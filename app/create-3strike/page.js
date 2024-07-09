"use client";
import { errorToast, successToast } from "@/config/toast";
import axios from "axios";
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import CreatableSelect from "react-select/creatable";
import BidderTable from "../component/BidderTable";

const Create3Strike = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [inputArr, setInputArr] = useState([]);
  const [data, setData] = useState({
    contractID: "",
    contractName: "",
    budget: "",
    date: "",
    category: "",
  });
  const options = [
    { value: "Infrastructure", label: "Infrastructure" },
    { value: "Goods and Services", label: "Goods and Services" },
    { value: "Consultancy", label: "Consultancy" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelect = (selectedOption) => {
    setData((prevData) => ({
      ...prevData,
      category: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("data", data);
    try {
      if (Object.values(data).some((value) => value === "") || !inputArr[0]) {
        errorToast("Hindi kumpleto ang mga input fields!");
      } else {
        //strike
        const strikeResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/create-3strike/strike`,
          { ...data, bidders: inputArr },
          {
            headers: {
              "Content-Type": "application/json",
            },
            responseType: "blob", // This is important for handling binary data
          }
        );
        if (strikeResponse.status === 200) {
          const blob = new Blob([strikeResponse.data], {
            type: strikeResponse.headers["content-type"],
          });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${data.contractID} STRIKE.docx`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          successToast("Certification downloaded successfully");
        }
        // transmittal
        const transmittalResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/create-3strike/transmittal`,
          { ...data, bidders: inputArr },
          {
            headers: {
              "Content-Type": "application/json",
            },
            responseType: "blob", // This is important for handling binary data
          }
        );
        if (transmittalResponse.status === 200) {
          const blob = new Blob([transmittalResponse.data], {
            type: transmittalResponse.headers["content-type"],
          });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${data.contractID} TRANSMITTAL.docx`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          successToast("Certification downloaded successfully");
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.log("ERROR: ", error);
      errorToast(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-screen p-10 justify-center">
      <ToastContainer />
      <form className="flex flex-col gap-8 min-w-[60rem]  mx-auto">
        <div className="flex gap-10">
          <input
            name="contractID"
            value={data?.contractID}
            onChange={handleChange}
            placeholder="Contract ID"
            className="custom-input w-48"
            type="text"
          ></input>
          <input
            name="contractName"
            value={data?.contractName}
            onChange={handleChange}
            placeholder="Contract Name"
            className="custom-input w-full"
            type="text"
          ></input>
        </div>
        <div className="flex gap-10">
          <CreatableSelect
            value={options.find((option) => option.value === data.category)}
            onChange={handleSelect}
            options={options}
            isClearable
            className="text-xs bg-zinc-200 w-80"
            placeholder="Procurement Category"
          />
          <input
            name="budget"
            value={data?.budget}
            onChange={handleChange}
            placeholder="Budget"
            className="custom-input w-48"
            type="number"
          ></input>
          <span className="tooltip" data-tip="Date of Report">
            <input
              name="date"
              value={data?.date}
              onChange={handleChange}
              className="custom-input w-40"
              type="date"
            ></input>
          </span>
        </div>
      </form>
      <BidderTable inputArr={inputArr} setInputArr={setInputArr} />
      <button
        type="submit"
        className={`btn fixed bottom-10 left-1/2 transform -translate-x-1/2 ${
          isLoading ? "btn-disable" : "btn-neutral"
        } text-xs w-80`}
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Download Documents"}
      </button>
    </div>
  );
};

export default Create3Strike;
