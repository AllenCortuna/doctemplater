import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { formatNumber } from "@/config/formatNumber";
import { formatDate } from "@/config/convertToDate";

export async function POST(request) {
  // for the MEMO
  try {
    const data = await request.json();
    const templatePath = path.join(
      process.cwd(),
      "public",
      "3-STRIKE",
      "transmittal.docx"
    );
    console.log(`Template Path: ${templatePath}`);
    const transmittalTemplate = fs.readFileSync(templatePath, "binary");
    const transmittalZip = new PizZip(transmittalTemplate);
    let transmittalOutputDoc = new Docxtemplater(transmittalZip);

    // console.log('data :>> ', data);
    const dataToAdd = {
      ...data,
      budget: formatNumber(data.budget),
      date: formatDate(data.date),
    };
    // console.log("dataToAdd: ",dataToAdd)
    transmittalOutputDoc.setData(dataToAdd);

    try {
      // Attempt to render the document (Add data to the template)
      transmittalOutputDoc.render();
      // Create a buffer to store the output data
      let outputDocumentBuffer = transmittalOutputDoc
        .getZip()
        .generate({ type: "nodebuffer" });

      // Set headers to indicate a file download
      const responseHeaders = new Headers({
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment`,
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
