"use client";
import React, { useState } from "react";

const App = () => {
  // State to manage input data array
  const [inputarr, setInputarr] = useState([]);

  // State to manage form input data
  const [inputdata, setInputdata] = useState({
    contractID: "",
    projectName: "",
  });

  // Handle changes in form inputs
  const changehandle = (e) => {
    setInputdata({
      ...inputdata,
      [e.target.name]: e.target.value,
    });
  };

  // Destructure input data for easy access
  const { contractID, projectName } = inputdata;

  // Handle adding new data to the input array
  const handleAdd = () => {
    setInputarr([
      ...inputarr,
      {
        contractID,
        projectName,
      },
    ]);

    console.log(inputdata, "input data what we Enter");

    // Reset input data
    setInputdata({ contractID: "", projectName: "" });
  };

  // Handle deleting an item from the input array
  const handleDelete = (i) => {
    let newdataArr = [...inputarr];
    newdataArr.splice(i, 1);
    setInputarr(newdataArr);
  };

  // Handle checking and storing data in the console
  const handleLog = () => {
    console.log("Object store in array", inputarr);

    fetch("https://jsonplaceholder.typicode.com/users", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputdata),
    }).then((resp) => {
      resp.json().then((result) => {
        console.log("result", result);
      });
    });
  };

  return (
    <div className="flex justify-center flex-col gap-5">
      <span className="gap-5 flex mx-auto mt-10">
        <input
          type="text"
          autoComplete="off"
          className="custom-input"
          name="contractID"
          value={inputdata.contractID}
          onChange={changehandle}
          placeholder="Contract ID"
        />
        <input
          type="text"
          autoComplete="off"
          className="custom-input w-[40rem]"
          name="projectName"
          value={inputdata.projectName}
          onChange={changehandle}
          placeholder="Project Name"
        />
        <button
          onClick={handleAdd}
          className="btn btn-sm btn-neutral text-xs w-40"
        >
          Add
        </button>
        <br />
      </span>

      <div className="flex flex-col max-w-[60rem] mx-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Contract ID </th>
              <th>Project Name</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {inputarr.length < 1 ? (
              <tr>
                <td colSpan={3}>NO data Enter yet !</td>
              </tr>
            ) : (
              inputarr.map((info, ind) => (
                <tr key={ind}>
                  <td>{info.contractID}</td>
                  <td>{info.projectName}</td>
                  <td>
                    <button onClick={() => handleDelete(ind)} className="btn btn-error btn-sm btn-outline">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <button
        onClick={handleLog}
        className="btn btn-sm btn-neutral text-xs w-60 mx-auto"
      >
        console.log()
      </button>
    </div>
  );
};

export default App;
