import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { dateSuffix, formatDate } from "@/config/convertToDate";
import { amountToWords } from "@/config/amountToWords";

export async function POST(request) {
  try {
    const data = await request.json();
    const templatePath = path.join(
      process.cwd(),
      "public",
      "obligation.docx"
    );
    console.log(`Template Path: ${templatePath}`);
    const certTemplate = fs.readFileSync(templatePath, "binary");
    const certZip = new PizZip(certTemplate);
    let certOutputDoc = new Docxtemplater(certZip);

    const dataToAdd = {
      fund: data.fund,
      amount: data.amount,
      total: parseInt(data.labor * 1.22) + parseInt(data.material * 1.22) + parseInt(data.equipment * 1.22),
      amountInWords: amountToWords(data.amount),
      contractor: data.contractor,
      contractorAddress: data.contractorAddress,
      contractorTIN: data.contractorTIN,
      contractID: data.contractID,
      pmis: data.pmis,
      contractName: data.contractName,
      labor: parseInt(data.labor * 1.22),
      material: parseInt(data.material * 1.22),
      equipment: parseInt(data.equipment * 1.22),
      saro: data.saro,
      sourceOfFund: data.sourceOfFund,
      uacs: data.uacs,
      year: data.year,
      endUser: data.endUser,
      designation: data.designation,
      endUserTitle: data.endUserTitle,
    };
    // console.log("dataToAdd: ",dataToAdd)
    certOutputDoc.setData(dataToAdd);

    try {
      // Attempt to render the document (Add data to the template)
      certOutputDoc.render();
      // Create a buffer to store the output data
      let outputDocumentBuffer = certOutputDoc
        .getZip()
        .generate({ type: "nodebuffer" });

      // Set headers to indicate a file download
      const responseHeaders = new Headers({
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": "attachment; filename=MEMO.docx",
      });

      return new NextResponse(outputDocumentBuffer, {
        status: 200,
        headers: responseHeaders,
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json({
        status: 500,
        error: `Error: ${error.message}`,
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      error: `Error: ${error.message}`,
    });
  }
}
