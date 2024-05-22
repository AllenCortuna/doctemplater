"use client";
import { errorToast, successToast } from "@/config/toast";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";

const Folder = () => {
  const [data, setData] = useState({
    contractID: "",
    projectName: "",
    contractorName: "",
    contractorAddress: "",
    proprietor: "",
    designation: ""
  });

  // useEffect(() => {
  //   const memoData = JSON.parse(localStorage.getItem("ntpData"));
  //   setData(memoData);
  // }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.setItem("ntpData", JSON.stringify(data));
    try {
      const pathData = JSON.parse(localStorage.getItem("ntpData"));
      const certResponse = await axios.post(
        "http://localhost:3000/api/create-ntp",
        JSON.stringify(pathData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (certResponse.data.message) {
        successToast(certResponse.data.message);
        setData({
          contractID: "",
          projectName: "",
          contractorName: "",
          contractorAddress: "",
          proprietor: "",
          designation: ""
        })
      } else {
        errorToast(certResponse.data.error);
      }
    } catch (error) {
      console.log("ERROR: ", error);
      errorToast(error);
    }
  };

  return (
    <div className="flex w-screen p-20 justify-center">
      <ToastContainer />
      <form className="justify-center flex flex-col gap-8 mt-10 w-auto rounded-xl shadow-sm p-10 min-w-[65rem] bg-zinc-50">
        {/* AWARD */}
        <span className="grid grid-cols-2 gap-8">
          <input
            name="contractID"
            value={data?.contractID}
            onChange={handleChange}
            className="custom-input"
            placeholder="Contract ID"
          ></input>
        </span>

        <input
          name="projectName"
          value={data?.projectName}
          onChange={handleChange}
          className="custom-input"
          placeholder="Project Name"
        ></input>

        <input
          name="contractorName"
          value={data?.contractorName}
          onChange={handleChange}
          className="custom-input"
          placeholder="Contractor Name"
        ></input>

        <input
          name="contractorAddress"
          value={data?.contractorAddress}
          onChange={handleChange}
          className="custom-input"
          placeholder="Contractor Address"
        ></input>

        <span className="grid grid-cols-2 gap-8">
          <input
            name="proprietor"
            value={data?.proprietor}
            onChange={handleChange}
            className="custom-input"
            placeholder="Proprietor"
          ></input>
          <input
            name="designation"
            value={data?.designation}
            onChange={handleChange}
            className="custom-input"
            placeholder="Designation"
          ></input>
        </span>

        <span className="mb-5 flex flex-row gap-10 justify-start ">
          <button
            type="submit"
            className="btn btn-neutral text-xs w-60"
            onClick={handleSubmit}
          >
            {/* Compile Memorandum and Certifications */}
            Submit NTP
          </button>
        </span>
      </form>
    </div>
  );
};

export default Folder;
