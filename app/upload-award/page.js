"use client";
import { errorToast, successToast } from "@/config/toast";
import Image from "next/image";
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import * as XLSX from "xlsx";
import Dropzone from "react-dropzone";
import axios from "axios";

const UploadAward = () => {
  const [file, setFile] = useState(null);

  const handleFileUpload = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        jsonData.shift();
        console.log("jsonData", jsonData);
        localStorage.setItem("excelData", JSON.stringify(jsonData));
      };
      reader.readAsBinaryString(file);
    }

    try {
      const excelData = JSON.parse(localStorage.getItem("excelData"));
      const folderData = JSON.parse(localStorage.getItem("folderData"));
      const response = await axios.post(
        "http://localhost:3000/api/upload-award",
        JSON.stringify({ excelData, noaPath: folderData?.noaPath }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("response: ", response.data.results);
      successToast(response.data.results);
    } catch (error) {
      console.log("ERROR: ", error);
      errorToast(error);
    }
  };

  return (
    <div className="flex justify-center ">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center mt-20 bg-zinc-50 maw-w-[50rem] p-8 rounded-xl shadow-sm"
      >
        <ToastContainer />
        <Dropzone
          onDrop={handleFileUpload}
          accept={{
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
              [".xlsx"],
          }}
          maxFiles={1}
          className="p-4 border-2 border-dashed border-gray-600 rounded-md cursor-pointer"
        >
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              className="flex flex-col items-center p-20 border-2 border-dashed border-zinc-500 rounded-md cursor-pointer"
            >
              <input {...getInputProps()} />
              <span className="text-gray-400 text-xs min-w-[32rem] text-center m-auto">
                {file ? (
                  <span className="text-sm flex justify-center text-center gap-2">
                    <Image
                      src="/ms-excel.png"
                      alt="Example Image"
                      width={40}
                      height={40}
                    />
                    <p className="my-auto">{file.name}</p>
                  </span>
                ) : (
                  "Drag and drop an Excel file here, or Click to select a file"
                )}
              </span>
            </div>
          )}
        </Dropzone>
        <button
          type="submit"
          className="btn btn-primary px-10 mt-8 text-xs text-white"
          disabled={!file}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default UploadAward;
