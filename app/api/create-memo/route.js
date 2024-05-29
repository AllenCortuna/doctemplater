import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { formatDate } from "@/config/convertToDate";

export async function POST(request) {
  // for the MEMO
  try {
    const data = await request.json();
    const templatePath = path.join(
      process.cwd(),
      "public",
      "memoTemplate.docx"
    );
    const memoTemplate = fs.readFileSync(templatePath, "binary");
    const memoZip = new PizZip(memoTemplate);
    let memoOutputDoc = new Docxtemplater(memoZip);

    // console.log('data :>> ', data);
    const dataToAdd = {
      certType: data.certType,
      startDate: formatDate(data.startDate),
      endDate: formatDate(data.endDate),
      certTypeUpper: data.certType.toUpperCase(),
      table: data.contracts
   
    };
    // console.log("dataToAdd: ",dataToAdd)
    memoOutputDoc.setData(dataToAdd);

    try {
      // Attempt to render the document (Add data to the template)
      memoOutputDoc.render();
      // Create a buffer to store the output data
      let outputDocumentBuffer = memoOutputDoc
        .getZip()
        .generate({ type: "nodebuffer" });

      // Set headers to indicate a file download
      const responseHeaders = new Headers({
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="MEMO.docx"`,
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
