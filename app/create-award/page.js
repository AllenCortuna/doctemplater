"use client";
import { errorToast, successToast } from "@/config/toast";
import axios from "axios";
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";

const CreateNOA = () => {
  const [data, setData] = useState({
    date: "",
    amount: "",
    contractID: "",
    projectName: "",
    contractorName: "",
    contractorAddress: "",
    representative: "",
    designation: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/create-award",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
          responseType: "blob", // This is important for handling binary data
        }
      );

      if (response.status === 200) {
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${data.contractID} NOA.docx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        successToast("Document downloaded successfully");

        // Reset form data
        setData({
          date: "",
          amount: "",
          contractID: "",
          projectName: "",
          contractorName: "",
          contractorAddress: "",
          representative: "",
          designation: "",
        });
      } else {
        errorToast("Failed to download document");
      }
    } catch (error) {
      console.log("ERROR: ", error);
      errorToast(error.message);
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
            value={data.contractID}
            onChange={handleChange}
            className="custom-input"
            placeholder="Contract ID"
          ></input>
          <span></span>
          <input
            name="date"
            value={data.date}
            type="date"
            onChange={handleChange}
            className="custom-input"
          ></input>

          <input
            name="amount"
            value={data.amount}
            type="number"
            onChange={handleChange}
            className="custom-input"
            placeholder="Amount"
          ></input>
        </span>

        <input
          name="projectName"
          value={data.projectName}
          onChange={handleChange}
          className="custom-input"
          placeholder="Project Name"
        ></input>

        <input
          name="contractorName"
          value={data.contractorName}
          onChange={handleChange}
          className="custom-input"
          placeholder="Contractor Name"
        ></input>

        <input
          name="contractorAddress"
          value={data.contractorAddress}
          onChange={handleChange}
          className="custom-input"
          placeholder="Contractor Address"
        ></input>

        <span className="grid grid-cols-2 gap-8">
          <input
            name="representative"
            value={data.representative}
            onChange={handleChange}
            className="custom-input"
            placeholder="Representative"
          ></input>
          <input
            name="designation"
            value={data.designation}
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
            Submit AWARD
          </button>
        </span>
      </form>
    </div>
  );
};

export default CreateNOA;
