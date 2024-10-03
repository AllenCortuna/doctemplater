"use client";
import React, { useState, useRef } from "react";
import axios from "axios";

const DTR = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [recognizedText, setRecognizedText] = useState(null);
  const [recognizedJson, setRecognizedJson] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target?.result);
      reader.readAsDataURL(file);
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
    <div className="p-4 flex flex-col justify-center items-center">
      <h1 className="text-xl font-bold mb-4 text-zinc-700">
        AI Automated DTR{" "}
      </h1>
      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn btn-sm btn-primary text-white px-4 py-2 rounded"
        >
          Select Image
        </button>
      </div>
      {selectedImage && (
        <div className="mb-4 flex flex-col items-center justify-center">
           {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={selectedImage} alt="Selected" className="max-w-full h-80" />
          <button
            onClick={handleUpload}
            className="mt-2 btn btn-sm btn-primary text-white px-4 py-2 rounded"
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Process Image"}
          </button>
        </div>
      )}
      {errorMessage && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          <h2 className="font-bold mb-2">Error:</h2>
          <p>{errorMessage}</p>
        </div>
      )}
      {recognizedJson && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="font-bold mb-2">Recognized TEXT:</h2>
          <pre>{JSON.stringify(recognizedJson, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default DTR;
