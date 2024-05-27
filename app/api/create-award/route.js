import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { amountToWords } from "@/config/amountToWords";
import { formatNumber } from "@/config/formatNumber";
import { convertToDate, formatDate } from "@/config/convertToDate";

export async function POST(request) {
  // for the MEMO
  try {
    const data = await request.json();
    const templatePath = path.join(
      process.cwd(),
      "public",
      "goodsNOATemplate.docx"
    );
    console.log(`Template Path: ${templatePath}`);
    const noaTemplate = fs.readFileSync(templatePath, "binary");
    const noaZip = new PizZip(noaTemplate);
    let noaOutputDoc = new Docxtemplater(noaZip);

    // console.log('data :>> ', data);
    const dataToAdd = {
      ...data,
      amountInWords: amountToWords(data.amount),
      amountFormat: formatNumber(data.amount),
      noaDate: formatDate(data.date)
    };
    // console.log("dataToAdd: ",dataToAdd)
    noaOutputDoc.setData(dataToAdd);

    try {
      // Attempt to render the document (Add data to the template)
      noaOutputDoc.render();
      // Create a buffer to store the output data
      let outputDocumentBuffer = noaOutputDoc
        .getZip()
        .generate({ type: "nodebuffer" });

      // Set headers to indicate a file download
      const responseHeaders = new Headers({
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${dataToAdd.contractID} NTP.docx"`,
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
