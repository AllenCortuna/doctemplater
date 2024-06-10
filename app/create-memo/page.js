"use client";
import { errorToast, successToast } from "@/config/toast";
import axios from "axios";
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import ContractTable from "../component/ContractTable";
import Holidays from "date-holidays";
import { isWeekend } from "date-fns";
import CreatableSelect from "react-select/creatable";

const Folder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [inputArr, setInputArr] = useState([]);
  const [data, setData] = useState({
    certType: "",
    memoDate: "",
    startDate: "",
    endDate: "",
    certDate: "",
  });
  const options = [
    { value: "Invitation to Bid", label: "Invitation to Bid" },
    { value: "Notice of Award", label: "Notice of Award" },
    { value: "Notice to Proceed", label: "Notice to Proceed" },
    { value: "Request for Quotation", label: "Request for Quotation" },
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
      certType: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleDate = (e) => {
    const { name, value } = e.target;
    const hd = new Holidays("PH");
    const holiday = hd.isHoliday(value);
    if (isWeekend(value)) {
      errorToast("Dapat Monday to Friday lang!");
    } else if (holiday) {
      errorToast(`Bawal dahil ${holiday[0].name}!`);
    } else {
      setData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (Object.values(data).some((value) => value === "") || !inputArr[0]) {
        errorToast("Hindi kumpleto ang mga input fields!");
      } else {
        //MEMO
        const memoResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/create-memo`,
          { ...data, contracts: inputArr },
          {
            headers: {
              "Content-Type": "application/json",
            },
            responseType: "blob", // This is important for handling binary data
          }
        );

        if (memoResponse.status === 200) {
          const blob = new Blob([memoResponse.data], {
            type: memoResponse.headers["content-type"],
          });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `MEMO ${inputArr
            .slice(0, 5)
            .map((item) => item.contractID)
            .join(", ")} ${data.certType.toUpperCase()}.docx`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          successToast("MEMO downloaded successfully");
        }

        //MEMO
        const certResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/create-cert`,
          { ...data, contracts: inputArr },
          {
            headers: {
              "Content-Type": "application/json",
            },
            responseType: "blob", // This is important for handling binary data
          }
        );

        if (certResponse.status === 200) {
          const blob = new Blob([certResponse.data], {
            type: certResponse.headers["content-type"],
          });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `CERT ${inputArr
            .slice(0, 5)
            .map((item) => item.contractID)
            .join(", ")} ${data.certType.toUpperCase()}.docx`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          successToast("CERT downloaded successfully");
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
        <CreatableSelect
          value={options.find((option) => option.value === data.certType)}
          onChange={handleSelect}
          options={options}
          isClearable
          className={"text-xs bg-zinc-200 w-[30rem]"}
          placeholder="Type of Document"
        />
        <div className="flex gap-10">

        <span className="gap-2 flex flex-col">
            <p className="primary-text ml-1">Memo Date: </p>
            <input
              name="memoDate"
              value={data?.memoDate}
              onChange={handleDate}
              className="custom-input w-52"
              type="date"
            ></input>
          </span>

          <span className="gap-2 flex flex-col">
            <p className="primary-text ml-1">Start Date: </p>
            <input
              name="startDate"
              value={data?.startDate}
              onChange={handleChange}
              className="custom-input w-52"
              type="date"
            ></input>
          </span>

          <span className="gap-2 flex flex-col">
            <p className="primary-text ml-1">End Date: </p>
            <input
              name="endDate"
              value={data?.endDate}
              onChange={handleChange}
              className="custom-input w-52"
              type="date"
            ></input>
          </span>
          <span className="gap-2 flex flex-col">
            <p className="primary-text ml-1">Cert Date: </p>
            <input
              name="certDate"
              value={data?.certDate}
              onChange={handleDate}
              className="custom-input w-52"
              type="date"
            ></input>
          </span>
        </div>
      </form>
      <ContractTable inputArr={inputArr} setInputArr={setInputArr} />
      <button
        type="submit"
        className={`btn ${
          isLoading ? "btn-disable" : "btn-neutral"
        } text-xs mt-10 w-60 mx-auto`}
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Compile Cert and Memo"}
      </button>
    </div>
  );
};

export default Folder;
