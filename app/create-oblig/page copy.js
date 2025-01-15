"use client";
import { errorToast, successToast } from "@/config/toast";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";

const CreateNOA = () => {
  const [data, setData] = useState({
    fund: "",
    amount: "",
    contractor: "",
    contractorAddress: "",
    contractorTIN: "",
    contractID: "",
    pmis: "",
    contractName: "",
    labor: "",
    material: "",
    equipment: "",
    saro: "",
    sourceOfFund: "",
    uacs: "",
    year: "",
    endUser: "",
    designation: "",
    endUserTitle: "",
  });

  // Load data from local storage on component mount
  // useEffect(() => {
  //   const savedData = localStorage.getItem('formData');
  //   if (savedData) {
  //     setData(JSON.parse(savedData));
  //   }
  // }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = {
      ...data,
      [name]: value,
    };

    // Save to local storage whenever input changes
    // localStorage.setItem('formData', JSON.stringify(newData));

    setData(newData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/create-oblig`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
          responseType: "blob",
        }
      );

      if (response.status === 200) {
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${data.contractID} OBLIGATION.docx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        successToast("Document downloaded successfully");
      } else {
        errorToast("Failed to download document");
      }
    } catch (error) {
      console.log("ERROR: ", error);
      errorToast(error.message);
    }
  };

  return (
    <div className="flex w-screen justify-center">
      <ToastContainer />
      <form className="justify-center mt-10 flex flex-col gap-8 w-auto rounded-none shadow-sm p-10 min-w-[65rem] bg-zinc-50">
        {/* AWARD */}
        <span className="grid grid-cols-4 gap-8">
          <input
            name="fund"
            value={data.fund}
            onChange={handleChange}
            className="custom-input"
            placeholder="Fund"
          />
          <input
            name="amount"
            value={data.amount}
            type="number"
            onChange={handleChange}
            className="custom-input"
            placeholder="Amount"
          />
        </span>

        <span className="grid grid-cols-4 gap-8">
          <input
            name="contractID"
            value={data.contractID}
            onChange={handleChange}
            className="custom-input"
            placeholder="Contract ID"
          />
          <input
            name="pmis"
            value={data.pmis}
            onChange={handleChange}
            className="custom-input"
            placeholder="PMIS"
          />
          <input
            name="contractName"
            value={data.contractName}
            onChange={handleChange}
            className="custom-input col-span-3"
            placeholder="Contract Name"
          />
        </span>

        <span className="grid grid-cols-2 gap-8">
          <input
            name="contractor"
            value={data.contractor}
            onChange={handleChange}
            className="custom-input"
            placeholder="Contractor"
          />
          <input
            name="contractorAddress"
            value={data.contractorAddress}
            onChange={handleChange}
            className="custom-input"
            placeholder="Contractor Address"
          />
        </span>

        <span className="grid grid-cols-4 gap-8">
          <input
            name="contractorTIN"
            value={data.contractorTIN}
            onChange={handleChange}
            className="custom-input"
            placeholder="Contractor TIN"
          />
        </span>

        <span className="grid grid-cols-3 gap-8">
          <input
            name="endUser"
            value={data.endUser}
            onChange={handleChange}
            className="custom-input"
            placeholder="End User"
          />
          <input
            name="designation"
            value={data.designation}
            onChange={handleChange}
            className="custom-input"
            placeholder="Designation"
          />
          <input
            name="endUserTitle"
            value={data.endUserTitle}
            onChange={handleChange}
            className="custom-input"
            placeholder="End User Title"
          />
        </span>

        <span className="grid grid-cols-3 gap-8">
          <input
            name="labor"
            type="number"
            value={data.labor}
            onChange={handleChange}
            className="custom-input"
            placeholder="Labor"
          />
          <input
            name="material"
            type="number"
            value={data.material}
            onChange={handleChange}
            className="custom-input"
            placeholder="Material"
          />
          <input
            name="equipment"
            type="number"
            value={data.equipment}
            onChange={handleChange}
            className="custom-input"
            placeholder="Equipment"
          />
        </span>

        <span className="grid grid-cols-4 border-t pt-5 gap-8">
          <input
            name="saro"
            value={data.saro}
            onChange={handleChange}
            className="custom-input"
            placeholder="SARO"
          />
          <input
            name="sourceOfFund"
            value={data.sourceOfFund}
            onChange={handleChange}
            className="custom-input"
            placeholder="Source of Fund"
          />
          <input
            name="uacs"
            value={data.uacs}
            onChange={handleChange}
            className="custom-input"
            placeholder="UACS"
          />
          <input
            name="year"
            value={data.year}
            onChange={handleChange}
            className="custom-input"
            placeholder="Year"
          />
        </span>

        <span className="mb-5 ml-auto mr-0 flex flex-row gap-10 justify-start ">
          {/* <button
            type="submit"
            className="btn btn-neutral text-xs w-60 rounded-none"
            onClick={handleSubmit}
          >
            Submit
          </button> */}
          <a
            type="submit"
            target="_blank"
            rel="noopener noreferrer"
            href={`/create-oblig/${data.contractID}?${new URLSearchParams(
              data
            ).toString()}`}
            className="btn btn-neutral text-xs w-60 rounded-none"
          >
            Submit Bond
          </a>
        </span>
      </form>
    </div>
  );
};

export default CreateNOA;
