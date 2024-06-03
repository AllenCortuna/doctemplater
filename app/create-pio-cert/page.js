"use client";
import { errorToast, successToast } from "@/config/toast";
import axios from "axios";
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import ContractTable from "../component/ContractTable";

const CreatePIOCert = () => {
  const [inputArr, setInputArr] = useState([]);
  const [data, setData] = useState({
    certType: "",
    startDate: "",
    endDate: "",
    issueDate: "",
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
      //MEMO
      const certResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/create-pio-cert`,
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
        a.download = `${inputArr
          .slice(0, 5)
          .map((item) => item.contractID)
          .join(", ")} ${data.certType.toUpperCase()}.docx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        successToast("Certification downloaded successfully");
      }
    } catch (error) {
      console.log("ERROR: ", error);
      errorToast(error);
    }
  };

  return (
    <div className="flex flex-col w-screen p-10 justify-center">
      <ToastContainer />
      <form className="flex flex-col gap-8 min-w-[60rem]  mx-auto">
        <input
          name="certType"
          value={data?.certType}
          onChange={handleChange}
          className="custom-input w-[30rem]"
          placeholder="Type of Document"
        ></input>
        <div className="flex gap-10">
          <span className="gap-2 flex flex-col">
            <p className="primary-text ml-1">Start Date: </p>
            <input
              name="startDate"
              value={data?.startDate}
              onChange={handleChange}
              className="custom-input w-60"
              type="date"
            ></input>
          </span>

          <span className="gap-2 flex flex-col">
            <p className="primary-text ml-1">End Date: </p>
            <input
              name="endDate"
              value={data?.endDate}
              onChange={handleChange}
              className="custom-input w-60"
              type="date"
            ></input>
          </span>
          <span className="gap-2 flex flex-col">
            <p className="primary-text ml-1">Issue Date: </p>
            <input
              name="issueDate"
              value={data?.issueDate}
              onChange={handleChange}
              className="custom-input w-60"
              type="date"
            ></input>
          </span>
        </div>
      </form>
      <ContractTable inputArr={inputArr} setInputArr={setInputArr} />
      <button
        type="submit"
        className="btn btn-neutral text-xs mt-10 w-80 mx-auto"
        onClick={handleSubmit}
      >
        Download Certification
      </button>
    </div>
  );
};

export default CreatePIOCert;
