/* eslint-disable @next/next/no-img-element */
"use client";
import { amountToWords } from "@/config/amountToWords";
import { formatNumber } from "@/config/formatNumber";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";


const BondDetails = () => {
  const searchParams = useSearchParams();

  // Extract query data from the URL
  const data = {
    fund: searchParams.get("fund") || "",
    amount: searchParams.get("amount") || "",
    contractor: searchParams.get("contractor") || "",
    contractorAddress: searchParams.get("contractorAddress") || "",
    contractorTIN: searchParams.get("contractorTIN") || "",
    contractID: searchParams.get("contractID") || "",
    pmis: searchParams.get("pmis") || "",
    contractName: searchParams.get("contractName") || "",
    labor: searchParams.get("labor") || "",
    material: searchParams.get("material") || "",
    equipment: searchParams.get("equipment") || "",
    saro: searchParams.get("saro") || "",
    sourceOfFund: searchParams.get("sourceOfFund") || "",
    uacs: searchParams.get("uacs") || "",
    year: searchParams.get("year") || "",
    endUser: searchParams.get("endUser") || "",
    designation: searchParams.get("designation") || "",
    endUserTitle: searchParams.get("endUserTitle") || "",
  };

  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: `${data.contractID} ${data.contractName} Bonds`,
    size: [210, 297], // A4 size in mm
  });

  return (
    <div className="flex justify-center items-center w-screen h-full pt-10 overflow-x-hidden">
      <div className="flex flex-col overflow-scroll overflow-x-hidden h-[calc(100vh-5rem)]">
        <div
          id="printable"
          ref={contentRef}
          className="w-[210mm] tahoma h-[297mm] mx-auto p-14 text-center bg-white border border-gray-200 shadow-lg"
        >
          {/* Header Section */}
          <div className="flex justify-between items-center mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/dpwhLogo.png"
              alt="DPWH Logo"
              className="h-24 w-24 object-contain"
            />
            <div className="text-[15px] text-black">
              <p>Republic of the Philippines</p>
              <p className="font-semibold">
                DEPARTMENT OF PUBLIC WORKS AND HIGHWAYS
              </p>
              <p className="text-[12px]">MINDORO OCCIDENTAL DISTRICT ENGINEERING OFFICE MIMAROPA REGION (IV-B)</p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/bagongPilipinas.png"
              alt="Bagong Pilipinas"
              className="h-24 w-24 object-contain"
            />
          </div>

          <h1
            className="text-2xl font-bold mb-8 mt-5"
            style={{ fontFamily: "Times New Roman" }}
          >
            CERTIFICATION
          </h1>

          {/* Certification Body */}
    
          <p className="text-left">Year: {data.year}</p>


        </div>
      </div>

      {/* Print Button */}
      <button
        onClick={reactToPrintFn}
        className="fixed bottom-10 right-10 btn btn-neutral mt-5"
      >
        Print
      </button>
    </div>
  );
};

export default BondDetails;
