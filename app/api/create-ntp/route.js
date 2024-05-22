import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { extractValue } from "@/config/createMemoFunction";

export async function POST(request) {
  // for the MEMO
  try {
    const requestData = await request.json();
    const ntpTemplate = fs.readFileSync(
      path.resolve(__dirname, "../todo the path" ),
      "binary"
    );
    const ntpZip = new PizZip(ntpTemplate);
    let memoOutputDoc = new Docxtemplater(ntpZip);


    const dataToAdd = requestData;
    console.log("dataToAdd :>> ", dataToAdd);
    memoOutputDoc.setData(dataToAdd);
    try {
      // Attempt to render the document (Add data to the template)
      memoOutputDoc.render();
      // Create a buffer to store the output data
      let outputDocumentBuffer = memoOutputDoc
        .getZip()
        .generate({ type: "nodebuffer" });
      fs.writeFileSync(
        path.resolve(
          __dirname,
          `${requestData?.outputPath}/${excel
            .slice(5, 11)
            .map(([first]) => first)
            .join(", ")} ${extractValue(excel[0])} NTP.docx`
        ),
        outputDocumentBuffer
      );

      return NextResponse.json({
        status: 200,
        message: `"NTP written succesfully"`,
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json({
        status: 200,
        error: `Error: ${error}`,
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 200,
      error: `Error: ${error.Error}`,
    });
  }
}
