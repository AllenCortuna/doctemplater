"use client";
import React, { useState, useEffect } from "react";

const Folder = () => {
  const [data, setData] = useState({ noaPath: "" });

  useEffect(() => {
    const folderData = JSON.parse(localStorage.getItem("folderData"));
    setData(folderData);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted data:", data);
    localStorage.setItem("folderData", JSON.stringify(data));
  };

  return (
    <div className="flex w-screen p-20 justify-center">
      <form
        onSubmit={handleSubmit}
        className="justify-center flex flex-col gap-3 mt-10 w-auto rounded-xl shadow-sm p-8 min-w-[50rem] bg-zinc-50"
      >
        <p className="primary-text">Where to save Award?</p>
        <textarea
          name="noaPath"
          value={data?.noaPath}
          onChange={handleChange}
          // onPaste={handlePaste}
          className="custom-textarea w-full"
          rows={2}
        ></textarea>

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

export default Folder;
