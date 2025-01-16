/* eslint-disable @next/next/no-img-element */
"use client";
import { amountToWords } from "@/config/amountToWords";
import { formatNumber } from "@/config/formatNumber";
import { useSearchParams } from "next/navigation";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const BondDetails = () => {
  const searchParams = useSearchParams();

  // First, calculate the raw values
  const rawAmount = parseInt(searchParams.get("amount") || "0", 10);
  const rawLabor = parseInt(searchParams.get("labor") || "0", 10);
  const rawMaterial = parseInt(searchParams.get("material") || "0", 10);
  const rawEquipment = parseInt(searchParams.get("equipment") || "0", 10);
  
  // Calculate the total raw cost
  const rawTotal = parseFloat((rawAmount / (rawLabor + rawMaterial + rawEquipment)).toFixed(2));

  // Now create the data object with all values
  const data = {
    fund: searchParams.get("fund") || "",
    amount: formatNumber(rawAmount),
    amountWords: amountToWords(rawAmount.toString()),
    contractor: searchParams.get("contractor") || "",
    contractorAddress: searchParams.get("contractorAddress") || "",
    contractorTIN: searchParams.get("contractorTIN") || "",
    contractID: searchParams.get("contractID") || "",
    pmis: searchParams.get("pmis") || "",
    contractName: searchParams.get("contractName") || "",

    // Raw values
    laborRaw: rawLabor,
    materialRaw: rawMaterial,
    equipmentRaw: rawEquipment,
    rawTotal: rawTotal,

    // Calculated values
    labor: formatNumber(parseFloat((rawLabor * rawTotal).toFixed(2))),
    material: formatNumber(parseFloat((rawMaterial * rawTotal).toFixed(2))),
    equipment: formatNumber(parseFloat((rawEquipment * rawTotal).toFixed(2))),
    total: formatNumber(rawAmount),

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
              <p className="text-[12px]">
                MINDORO OCCIDENTAL DISTRICT ENGINEERING OFFICE MIMAROPA REGION
                (IV-B)
              </p>
            </div>
            <img
              src="/bagongPilipinas.png"
              alt="Bagong Pilipinas"
              className="h-24 w-24 object-contain"
            />
          </div>

          <div className="p-8 max-w-4xl mx-auto text-left">
            <div className="space-y-6">
              <div className="text-[11px]">
                {/* For Section */}
                <div className="grid grid-cols-12 gap-2 mb-4">
                  <div className="col-span-4">FOR</div>
                  <div className="col-span-8">
                    <div>: The Budget Officer II</div>
                    <div className="ml-2 ">Accounting Section</div>
                    <div className="ml-2">This District</div>
                  </div>
                </div>

                {/* Subject Section */}
                <div className="grid grid-cols-12 gap-2 mb-4">
                  <div className="col-span-4">SUBJECT</div>
                  <div className="col-span-8">
                    <div>: Obligation Request</div>
                    <div className="ml-2">
                      This is to request for the issuance of an Obligation for
                      the following:
                    </div>
                  </div>
                </div>

                {/* Fund Section */}
                <div className="grid grid-cols-12 gap-2 mb-4">
                  <div className="col-span-4">FUND</div>
                  <div className="col-span-8">: {data.fund}</div>
                </div>

                {/* Amount Section */}
                <div className="grid grid-cols-12 gap-2 mb-4">
                  <div className="col-span-4">AMOUNT</div>
                  <div className="col-span-8">
                    <div>: ₱ {data.amount}</div>
                    <div className="ml-4">{data.amountWords}</div>
                  </div>
                </div>

                {/* Payee Section */}
                <div className="grid grid-cols-12 gap-2 mb-4">
                  <div className="col-span-4">PAYEE</div>
                  <div className="col-span-8">
                    <div>: {data.contractor}</div>
                    <div className="ml-2">Tin no: {data.contractorTIN}</div>
                  </div>
                </div>

                {/* Payee Address Section */}
                <div className="grid grid-cols-12 gap-2 mb-4">
                  <div className="col-span-4">PAYEE OFFICE/ADDRESS</div>
                  <div className="col-span-8">: {data.contractorAddress}</div>
                </div>

                {/* Particulars Section */}
                <div className="grid grid-cols-12 gap-2 mb-4">
                  <div className="col-span-4">PARTICULARS</div>
                  <div className="col-span-8">
                    <div>
                      <div className="flex gap-1">
                        <span>:</span>
                        <span>
                          To obligate payment for <b>{data.contractID}</b>
                          {"-"}
                          {data.contractName}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div>Contract ID:</div>
                        <div>{data.contractID}</div>
                        <div>PMS ID:</div>
                        <div>{data.pmis}</div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <div>Labor</div>
                        <div className="text-right">{data.labor}</div>
                        <div>Materials</div>
                        <div className="text-right">{data.material}</div>
                        <div>Equipment</div>
                        <div className="text-right">{data.equipment}</div>
                        <div className="font-bold">TOTAL</div>
                        <div className="text-right font-bold">{data.total}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SARO Section */}
                <div className="grid grid-cols-12 gap-2 mb-4">
                  <div className="col-span-4">SARO/SUB-ALLOTMENT NO.:</div>
                  <div className="col-span-8">SR2024-02-011588</div>
                </div>

                {/* Source of Fund Section */}
                <div className="grid grid-cols-12 gap-2 mb-4">
                  <div className="col-span-4">SOURCE OF FUND</div>
                  <div className="col-span-8">
                    : FY 2024 RA 11975 REGULAR 2024 CURRENT
                  </div>
                </div>

                {/* UACS Section */}
                <div className="grid grid-cols-12 gap-2 mb-4">
                  <div className="col-span-4">UACS No.</div>
                  <div className="col-span-8">: 20000010019000</div>
                </div>

                {/* Fiscal Year Section */}
                <div className="grid grid-cols-12 gap-2 mb-4">
                  <div className="col-span-4">FISCAL YEAR OF ALLOTMENT</div>
                  <div className="col-span-8">: FY 2024</div>
                </div>

                {/* Certification */}
                <div className="mt-8 space-y-2">
                  <p>
                    I certify that charges to appropriate/allotment are
                    necessary, lawful and under my direct supervision.
                  </p>
                  <p>
                    I also certify that the supporting documents are valid,
                    proper and legal.
                  </p>
                  <p>Your attention to this matter would be appreciated</p>
                </div>

                {/* Signature */}
                <div className="mt-16 mr-0 ml-auto w-1/3 text-center">
                  <div className="uppercase font-bold">{data.endUser}</div>
                  <div>{data.endUserTitle}</div>
                  <div>{data.designation}</div>
                </div>
              </div>
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