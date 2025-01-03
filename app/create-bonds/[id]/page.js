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
  const contractID = searchParams.get("contractID") || "";
  const insuranceCompany = searchParams.get("insuranceCompany") || "";
  const dateValidated = new Date(searchParams.get("dateValidated")) || "";
  const amount = formatNumber(searchParams.get("amount") || "");
  const amountInWords = amountToWords(searchParams.get("amount") || "");
  const contractor = searchParams.get("contractor") || "";
  const projectNo = searchParams.get("projectNo") || "";
  const projectName = searchParams.get("projectName") || "";
  const theWho = searchParams.get("theWho") || "";
  const designation = searchParams.get("designation") || "";

  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: `${contractID} ${projectNo} Bonds`,
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
          <div className="text-[15px] leading-relaxed text-justify">
            <p className="mb-4 indent-20">
              THIS IS TO CERTIFY that{" "}
              <span className="font-semibold">{projectNo}</span> issued by{" "}
              <span className="font-semibold">{insuranceCompany}</span> on{" "}
              <span className="font-semibold">
                {format(new Date(dateValidated), "MMMM dd, yyyy")}
              </span>{" "}
              in the amount of{" "}
              <span className="font-semibold">{amountInWords}</span> (₱
              <span className="font-semibold">{amount}</span>) under contract
              with <span className="font-semibold">{contractor}</span> in
              connection with the project{" "}
              <span className="font-semibold">{contractID}</span>:{" "}
              <span className="">{projectName}</span>. This was verified as
              evidenced by the attached letter of confirmation made under oath,
              dated{" "}
              <span className="font-semibold">
                {format(new Date(dateValidated), "MMMM dd, yyyy")}
              </span>
              , issued by <span className="font-semibold">{theWho}</span>,
              {designation} of{" "}
              <span className="font-semibold">{insuranceCompany}</span>.
            </p>
            <p>
              This Certification is issued on{" "}
              {format(new Date(dateValidated), "MMMM dd, yyyy")}.
            </p>
          </div>

          <p className="text-left mt-5 mb-8 text-[15px]">Procurement Unit:</p>

          {/* Signatories */}
          <div className="grid mt-8 grid-cols-2 text-center gap-y-8 text-[15px]">
            {/* Left Side */}
            <div>
              <p className="font-bold text-[16px]">REALYN G. ARRIOLA</p>
              <p>Administrative Aide I</p>
              <p>(Member)</p>
            </div>
            <div>
              <p className="font-bold text-[16px]">DARLENE KATE M. DE LEMOS</p>
              <p>Bookbinder I</p>
              <p>(Member)</p>
            </div>
            <div>
              <p className="font-bold text-[16px]">JAY ANNE MARIE D. LUZON</p>
              <p>Administrative Officer II (GSO)</p>
              <p>(Member)</p>
            </div>
            <div>
              <p className="font-bold text-[16px]">CZARINA C. REYES</p>
              <p>Engineer II</p>
              <p>(Member)</p>
            </div>

            {/* Bottom Centered */}
            <div className="col-span-2 text-center mt-4">
              <p className="font-bold text-[16px]">CASIANA A. ABAD</p>
              <p>Engineer III</p>
              <p>Head, Procurement Unit</p>
            </div>
          </div>
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
