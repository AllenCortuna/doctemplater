"use client";
import { db } from "@/config/db";
import { errorToast } from "@/config/toast";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";

const UploadAward = () => {
  const router = useRouter();
  const [data, setData] = useState({
    contractNo: "",
    projectName: "",
    budget: "",
    contractAmount: "",
    bidderInfo: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setData((prevContractInfo) => ({
      ...prevContractInfo,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Contract Info:", data);
    try {
      // Add the new Award!
      const result = await db.award.add(data);
      console.log(`Award successfully added. Got id ${result}`);
      router.push(`/award/${result}`)
      // router.push(`/`)
    } catch (error) {
      errorToast(`${error}`);
    }
  };
  return (
    <div className="flex justify-center">
      {/* UploadProject */}
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className="justify-start flex flex-col gap-5 mt-10 w-auto rounded-xl shadow-sm p-8 max-w-[65rem] bg-zinc-50"
      >
        {/* Notice of Award */}
        <span className="justify-start flex flex-col gap-5 w-50 w-[30rem]">
          <input
            type="text"
            name="contractNo"
            value={data.contractNo}
            onChange={handleChange}
            placeholder="Contract NO:"
            className="custom-input"
          />

          <textarea
            name="projectName"
            value={data.projectName}
            onChange={handleChange}
            className="custom-textarea"
            placeholder="Project Name:"
            rows={4}
          ></textarea>

          <input
            type="text"
            name="budget"
            value={data.budget}
            onChange={handleChange}
            className="custom-input"
            placeholder="Budget for Contract:"
          />
          <input
            type="text"
            name="contractAmount"
            value={data.contractAmount}
            onChange={handleChange}
            placeholder="Contract Amount:"
            className="custom-input"
          />
        </span>
        <span className="justify-start flex flex-col gap-5 w-50 w-[30rem] bg-zinc-100 mt-5">
          <textarea
            name="bidderInfo"
            value={data.bidderInfo}
            onChange={handleChange}
            className="custom-textarea"
            placeholder="Bidder Number 1, Amount, Bidder Number 2, Amount"
            rows={8}
          ></textarea>
        </span>
        <button
          type="submit"
          className="btn btn-neutral text-xs w-32 ml-auto mr-0"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default UploadAward;
