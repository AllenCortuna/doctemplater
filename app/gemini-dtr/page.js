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
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // Options for compression
        const options = {
          maxSizeMB: 1, // Reduce to 1MB
          maxWidthOrHeight: 1920, // Resize if needed
          useWebWorker: true, // Use web workers for better performance
        };

        // Compress image
        const compressedFile = await imageCompression(file, options);
        const compressedImageUrl = URL.createObjectURL(compressedFile);

        // Read and set compressed image
        const reader = new FileReader();
        reader.onload = (e) => setSelectedImage(e.target?.result);
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Error compressing image:", error);
        setErrorMessage("Failed to compress image");
      }
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
<div className="p-6 flex flex-col justify-center items-center rounded-lg mt-10">
  <h1 className="font-bold text-sm p-2 border-2 border-dashed rounded-lg border-zinc-600 text-zinc-600 mb-6">AI Automated DTR</h1>

  <div className="mb-6">
    <input
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      className="hidden"
      ref={fileInputRef}
    />
    <button
      onClick={() => fileInputRef.current?.click()}
      className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-lg font-semibold px-6 py-3 rounded-full shadow-md hover:opacity-90 transition-all"
    >
      Select Image
    </button>
  </div>

  {selectedImage && (
    <div className="mb-6 flex flex-col items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={selectedImage} alt="Selected" className="max-w-full h-80 rounded-xl shadow-lg" />
      <button
        onClick={handleUpload}
        className="mt-4 bg-gradient-to-r from-green-400 to-teal-500 text-white text-lg font-semibold px-6 py-3 rounded-full shadow-md hover:opacity-90 transition-all"
        disabled={isProcessing}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-4 border-t-4 border-t-white rounded-full animate-spin"></div>
            <span>Processing...</span>
          </div>
        ) : (
          "Process Image"
        )}
      </button>
    </div>
  )}

  {errorMessage && (
    <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-md max-w-md w-full">
      <h2 className="font-bold text-lg mb-2">Error:</h2>
      <p>{errorMessage}</p>
    </div>
  )}

  {recognizedJson && (
    <div className="mt-6 p-4 bg-gray-100 text-gray-800 rounded-lg shadow-md max-w-md w-full">
      <h2 className="font-bold text-lg mb-2">Recognized TEXT:</h2>
      <pre className="whitespace-pre-wrap break-words">{JSON.stringify(recognizedJson, null, 2)}</pre>
    </div>
  )}
</div>

  );
};

export default DTR;