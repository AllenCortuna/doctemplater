"use client";
import React from "react";
import { db } from "@/config/db";
import { useLiveQuery } from "dexie-react-hooks";

const Award = ({ params }) => {
  const contractNo = params?.contractNo;

  // Using useLiveQuery hook to fetch data based on contractNo
  const awardData = useLiveQuery(() => {
    return contractNo
      ? db.award.where("contractNo").equals(contractNo).first()
      : null;
  }, [contractNo]);

  console.log("awardData: ", awardData);
  return (
    <div className="flex flex-col p-20 justify-center ">
      {awardData ? (
        <div className="flex justify-start flex-col gap-4 mx-auto max-w-[80%]">
          <p className="highligth-text text-lg underline">
            {awardData.contractNo}
          </p>
          <span className="highligth-text flex flex-row gap-2">
            Project Name:{" "}
            <p className="primary-text">{awardData?.projectName}</p>
          </span>
          <span className="highligth-text flex flex-row gap-2">
            Amount Budget: <p className="primary-text">{awardData?.budget}</p>
          </span>
          <span className="highligth-text flex flex-row gap-2">
            Contract Amount:{" "}
            <p className="primary-text">{awardData?.contractAmount}</p>
          </span>
          <span className="highligth-text flex flex-row gap-2">
            Bidder(s) Info:{" "}
            <p className="primary-text">{awardData?.bidderInfo}</p>
          </span>
          <div className="mt-10 flex flex-row gap-10 ">
            <button type="submit" className="btn btn-neutral text-xs w-auto">
              Save Award
            </button>
            <button type="submit" className="btn btn-neutral text-xs w-auto ">
              Save Reso
            </button>
            <button type="submit" className="btn btn-error text-white text-xs w-auto">
              Delete
            </button>
          </div>
        </div>
      ) : (
        <p className="text-md mx-auto">
          Loading <span className="loading loading-dots loading-md"></span>
        </p>
      )}
    </div>
  );
};

export default Award;
