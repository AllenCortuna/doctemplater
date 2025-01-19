"use client";
import React, { useState, useRef } from "react";
import axios from "axios";
import imageCompression from "browser-image-compression";

const DTR = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [recognizedText, setRecognizedText] = useState(null);
  const [recognizedJson, setRecognizedJson] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const processFile = async (file) => {
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      const compressedImageUrl = URL.createObjectURL(compressedFile);

      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target?.result);
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Error compressing image:", error);
      setErrorMessage("Failed to compress image");
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setRecognizedText(null);
    setRecognizedJson(null);
    try {
      const response = await axios.post("/api/process-image", {
        image: selectedImage,
      });

      console.log("response", response);
      const data = response.data;

      if (response.status !== 200) {
        throw new Error(data.error || "Failed to process image");
      }

      setRecognizedText(data.text);

      try {
        const cleanedText = data.text
          .replace(/```json\s+/, "")
          .replace(/```$/, "");

        const jsonData = JSON.parse(cleanedText);
        console.log("jsonData", jsonData);
        setRecognizedJson(jsonData);

        // POST REQUEST to API CREATE DTR
        const dtrResponse = await axios.post("/api/dtr-generate", jsonData, {
          responseType: "blob", // Important for downloading files
        });

        if (dtrResponse.status !== 200) {
          throw new Error("Failed to create DTR");
        }

        // Handle file download
        const url = window.URL.createObjectURL(dtrResponse.data);
        const a = document.createElement("a");
        a.href = url;
        a.download = "DTR.xlsx"; // Change filename if needed
        document.body.appendChild(a);
        a.click();
        a.remove();
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError);
      }
    } catch (error) {
      console.error("Error processing image:", error);
      setErrorMessage(error.message || "An unknown error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Upload or Scan DTR</h1>

      <div 
        className={`relative border-2 border-dashed rounded-lg p-8 ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-lg text-gray-600">Drag & drop or click to choose files</p>
            <p className="text-sm text-gray-500 mt-2">Max file size: 10 MB</p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Select File
          </button>
        </div>
      </div>

      {selectedImage && (
        <div className="mt-8">
          <div className="flex items-center justify-between p-4 bg-white border rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Selected Image</p>
                <p className="text-sm text-gray-500">Click Process to continue</p>
              </div>
            </div>
            <button
              onClick={handleUpload}
              disabled={isProcessing}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : "Process Image"}
            </button>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <h2 className="font-bold text-lg mb-2">Error:</h2>
          <p>{errorMessage}</p>
        </div>
      )}

      {recognizedJson && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h2 className="font-bold text-lg mb-2">Recognized Text:</h2>
          <pre className="whitespace-pre-wrap break-words bg-white p-4 rounded-md">
            {JSON.stringify(recognizedJson, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DTR;