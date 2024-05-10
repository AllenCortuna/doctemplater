"use client";
import { errorToast, successToast } from "@/config/toast";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";

const Folder = () => {
  const [data, setData] = useState({
    outputPath: "",
    certTemplate: "",
    excelData: "",
  });

  useEffect(() => {
    const memoData = JSON.parse(localStorage.getItem("pioData"));
    setData(memoData);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.setItem("pioData", JSON.stringify(data));
    try {
      const pathData = JSON.parse(localStorage.getItem("pioData"));
      const certResponse = await axios.post(
        "http://localhost:3000/api/create-pio-cert",
        JSON.stringify(pathData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      successToast(certResponse.data.message);
    } catch (error) {
      console.log("ERROR: ", error);
      errorToast(error);
    }
  };

  return (
    <div className="flex w-screen p-20 justify-center">
      <ToastContainer />
      <form className="justify-center flex flex-col gap-5 mt-10 w-auto rounded-xl shadow-sm p-10 min-w-[60rem] bg-zinc-50">
        <span className="mb-5 flex flex-row gap-10 justify-start ">
          <button
            type="submit"
            className="btn btn-neutral text-xs w-60"
            onClick={handleSubmit}
          >
            {/* Compile Memorandum and Certifications */}
            Compile Cert
          </button>
        </span>

        {/* AWARD */}
        <p className="primary-text">Where to save Memo and Certifications?</p>
        <input
          name="outputPath"
          value={data?.outputPath}
          onChange={handleChange}
          className="custom-input"
        ></input>

        <p className="primary-text mt-4">
          Where to find the Certification Template?
        </p>
        <input
          name="certTemplate"
          value={data?.certTemplate}
          onChange={handleChange}
          className="custom-input"
        ></input>

        <p className="primary-text mt-4">Where to find the Excel Data?</p>
        <input
          name="excelData"
          value={data?.excelData}
          onChange={handleChange}
          className="custom-input"
        ></input>
      </form>
    </div>
  );
};

export default Folder;
