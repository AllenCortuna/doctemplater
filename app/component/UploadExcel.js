"use client";
import { useState } from "react";
import * as XLSX from "xlsx";

export default function UploadExcel() {
  const [file, setFile] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Store the data in local storage
        localStorage.setItem("excelData", JSON.stringify(jsonData));
      };
      reader.readAsBinaryString(file);
    }
    const excelData = JSON.parse(localStorage.getItem("excelData"));
    console.log(excelData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileUpload} accept=".xlsx,.xls" />
      <button type="submit">Upload Excel File</button>
    </form>
  );
}
