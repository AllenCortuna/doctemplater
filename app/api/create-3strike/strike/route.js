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
      "strike.docx"
    );
    console.log(`Template Path: ${templatePath}`);
    const strikeTemplate = fs.readFileSync(templatePath, "binary");
    const strikeZip = new PizZip(strikeTemplate);
    let strikeOutputDoc = new Docxtemplater(strikeZip);

    // console.log('data :>> ', data);
    let isGood = data.category == "Goods and Services";
    const dataToAdd = {
      ...data,
      budget: formatNumber(data.budget),
      date: formatDate(data.date),
      bidders: data.bidders.map((item, index) => ({
        ...item,
        id: index + 1,
      })),
      endUser: isGood ? "KATHERINE V. LADAGA" : "JOHNNY M. USI",
      endID: isGood ? "12 G 0106" : "12 G 0100",
      endDesignation: isGood
        ? "End User for Goods"
        : "End-user for Construction / Maintenance and Consultancy Projects",
    };
    // console.log("dataToAdd: ",dataToAdd)
    strikeOutputDoc.setData(dataToAdd);

    try {
      // Attempt to render the document (Add data to the template)
      strikeOutputDoc.render();
      // Create a buffer to store the output data
      let outputDocumentBuffer = strikeOutputDoc
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
