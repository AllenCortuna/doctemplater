import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { dateSuffix, formatDate } from "@/config/convertToDate";

export async function POST(request) {
  try {
    const data = await request.json();
    const templatePath = path.join(
      process.cwd(),
      "public",
      "pioCertTemplate.docx"
    );
    console.log(`Template Path: ${templatePath}`);
    const certTemplate = fs.readFileSync(templatePath, "binary");
    const certZip = new PizZip(certTemplate);
    let certOutputDoc = new Docxtemplater(certZip);

    const dataToAdd = {
      certType: data.certType,
      endDate: formatDate(data.endDate),
      day: dateSuffix(data.certDate),
      month: new Date(data.certDate).toLocaleString("default", {
        month: "long",
      }),
      certTypeUpper: data.certType.toUpperCase(),
      table: data.contracts,
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
