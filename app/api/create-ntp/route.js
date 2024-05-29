import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

export async function POST(request) {
  try {
    const data = await request.json();
    const templatePath = path.join(
      process.cwd(),
      "public",
      "goodsNTPTemplate.docx"
    );
    console.log(`Template Path: ${templatePath}`);
    const ntpTemplate = fs.readFileSync(templatePath, "binary");
    const ntpZip = new PizZip(ntpTemplate);
    let ntpOutputDoc = new Docxtemplater(ntpZip);

    const dataToAdd = data;
    ntpOutputDoc.setData(dataToAdd);

    try {
      // Attempt to render the document (Add data to the template)
      ntpOutputDoc.render();
      // Create a buffer to store the output data
      let outputDocumentBuffer = ntpOutputDoc
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
