import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { formatDate, suffix } from "@/config/convertToDate";

export async function POST(request) {
  try {
    const data = await request.json();
    const templatePath = path.join(process.cwd(), "public", "pioTemplate.docx");
    const pioTemplate = fs.readFileSync(templatePath, "binary");
    const pioZip = new PizZip(pioTemplate);
    let pioOutputDoc = new Docxtemplater(pioZip);

    const dataToAdd = {
      certType: data.certType,
      startDate: formatDate(data.startDate),
      endDate: formatDate(data.endDate),
      table: data.contracts,
      day: new Date(data.issueDate).getDate(),
      suffix: suffix(new Date(data.issueDate)),
      year: new Date(data.issueDate).getFullYear(),
      month: new Date(data.issueDate).toLocaleString("default", {
        month: "long",
      }),
    };
    pioOutputDoc.setData(dataToAdd);

    try {
      // Attempt to render the document (Add data to the template)
      pioOutputDoc.render();
      // Create a buffer to store the output data
      let outputDocumentBuffer = pioOutputDoc
        .getZip()
        .generate({ type: "nodebuffer" });

      // Set headers to indicate a file download
      const responseHeaders = new Headers({
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": "attachment; filename=CERT.docx",
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
