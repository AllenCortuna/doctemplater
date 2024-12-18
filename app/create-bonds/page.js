"use client";
import { errorToast, successToast } from "@/config/toast";
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";

const CreateBonds = () => {
  const [data, setData] = useState({
    contractID: "",
    insuranceCompany: "",
    dateValidated: "",
    amount: "",
    contractor: "",
    projectNo: "",
    projectName: "",
    theWho: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log(
  //     "process.env.BASE_URL :>> ",
  //     process.env.NEXT_PUBLIC_BASE_API_URL
  //   );
  //   try {
  //     const response = await axios.post(
  //       `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/create-ntp`,
  //       data,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         responseType: "blob", // This is important for handling binary data
  //       }
  //     );

  //     if (response.status === 200) {
  //       const blob = new Blob([response.data], {
  //         type: response.headers["content-type"],
  //       });
  //       const url = window.URL.createObjectURL(blob);
  //       const a = document.createElement("a");
  //       a.href = url;
  //       a.download = `${data.contractID} NTP.docx`;
  //       document.body.appendChild(a);
  //       a.click();
  //       a.remove();
  //       successToast("Document downloaded successfully");

  //       // Reset form data
  //       setData({
  //         contractID: "",
  //         projectName: "",
  //         contractorName: "",
  //         contractorAddress: "",
  //         proprietor: "",
  //         designation: "",
  //       });
  //     } else {
  //       errorToast("Failed to download document");
  //     }
  //   } catch (error) {
  //     console.log("ERROR: ", error);
  //     errorToast(error.message);
  //   }
  // };

  return (
    <div className="flex w-screen p-20 justify-center">
      <ToastContainer />
      <form className="justify-center flex flex-col gap-8 mt-10 w-auto rounded-xl shadow-sm p-10 min-w-[65rem] bg-zinc-50">
        {/* AWARD */}
        <span className="grid grid-cols-4 gap-8">
          <label className="flex flex-col">
            <span className="text-xs text-zinc-500 mb-2">Contract ID</span>
            <input
              name="contractID"
              value={data.contractID}
              onChange={handleChange}
              className="custom-input"
              required
            />
          </label>
          <label className="flex flex-col col-span-3">
            <span className="text-xs text-zinc-500 mb-2">Project Name</span>
            <input
              name="projectName"
              value={data.projectName}
              onChange={handleChange}
              className="custom-input"
              required
            />
          </label>
        </span>

        <div className="grid grid-cols-2 gap-8">
          <label className="flex flex-col">
            <span className="text-xs text-zinc-500 mb-2">
              Insurance Company
            </span>
            <input
              name="insuranceCompany"
              value={data.insuranceCompany}
              onChange={handleChange}
              className="custom-input"
              required
            />
          </label>

          <label className="flex flex-col">
            <span className="text-xs text-zinc-500 mb-2">Contractor</span>
            <input
              name="contractor"
              value={data.contractor}
              onChange={handleChange}
              className="custom-input"
              required
            />
          </label>

          <label className="flex flex-col">
            <span className="text-xs text-zinc-500 mb-2">Amount</span>
            <input
              name="amount"
              value={data.amount}
              onChange={handleChange}
              className="custom-input"
              required
            />
          </label>

          <label className="flex flex-col">
            <span className="text-xs text-zinc-500 mb-2">Date Validated</span>
            <input
              name="dateValidated"
              value={data.dateValidated}
              type="date"
              onChange={handleChange}
              className="custom-input tooltip-top"
              required
            />
          </label>

          <label className="flex flex-col">
            <span className="text-xs text-zinc-500 mb-2">Project No</span>
            <input
              name="projectNo"
              value={data.projectNo}
              onChange={handleChange}
              className="custom-input"
              required
            />
          </label>

          <label className="flex flex-col">
            <span className="text-xs text-zinc-500 mb-2">The Who</span>
            <input
              name="theWho"
              value={data.theWho}
              onChange={handleChange}
              className="custom-input"
              required
            />
          </label>
        </div>

        <span className="mb-5 ml-auto mr-0 flex flex-row gap-10 justify-start ">
          <a
            type="submit"
            target="_blank"
            rel="noopener noreferrer"
            href={`/create-bonds/${data.contractID}?${new URLSearchParams(
              data
            ).toString()}`}
            className="btn btn-neutral text-xs w-60"
          >
            Submit Bond
          </a>
        </span>
      </form>
    </div>
  );
};

export default CreateBonds;
