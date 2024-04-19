"use client";
import { successToast } from "@/config/toast";
import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";

const Folder = () => {
  const [data, setData] = useState({
    outputPath: "",
    memoTemplate: "",
    certTemplate: "",
    excelData: ""
  });

  useEffect(() => {
    const folderData = JSON.parse(localStorage.getItem("memoData"));
    setData(folderData);
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
    console.log("Submitted data:", data);
    localStorage.setItem("memoData", JSON.stringify(data));
    successToast("Folder directories has been updated");
    // try {
    //   const pathData = JSON.parse(localStorage.getItem("folderData"));
    //   const response = await axios.post(
    //     "http://localhost:3000/api/create-memo",
    //     JSON.stringify(pathData),
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
    //   console.log("response: ", response.data.results);
    //   successToast(response.data.results);
    // } catch (error) {
    //   console.log("ERROR: ", error);
    //   errorToast(error);
    // }
  };

  return (
    <div className="flex w-screen p-20 justify-center">
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className="justify-center flex flex-col gap-3 mt-10 w-auto rounded-xl shadow-sm p-8 min-w-[50rem] bg-zinc-50"
      >
        {/* AWARD */}
        <p className="primary-text">Where to save Memo and Certifiactions?</p>
        <input
          name="outputPath"
          value={data?.outputPath}
          onChange={handleChange}
          // onPaste={handlePaste}
          className="custom-input"
        ></input>

        <p className="primary-text mt-4">Where to find the Memo Template?</p>
        <input
          name="memoTemplate"
          value={data?.memoTemplate}
          onChange={handleChange}
          // onPaste={handlePaste}
          className="custom-input"
        ></input>

        <p className="primary-text mt-10">Where to find the Certifiaction Template?</p>
        <input
          name="certTemplate"
          value={data?.certTemplate}
          onChange={handleChange}
          // onPaste={handlePaste}
          className="custom-input"
        ></input>

        <p className="primary-text mt-4">Where to find the Excel Data?</p>
        <input
          name="excelData"
          value={data?.excelData}
          onChange={handleChange}
          // onPaste={handlePaste}
          className="custom-input"
        ></input>

        <button
          type="submit"
          className="btn btn-neutral text-xs w-32 ml-auto mr-0 mt-10"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Folder;
