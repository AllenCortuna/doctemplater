import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

export async function POST(request) {
  try {
    const data = await request.json();
    //get the file
    const templateFile = fs.readFileSync(
      path.resolve(__dirname, "/public/template/NoaTemplate.docx"),
      "binary"
    );
    const zip = new PizZip(templateFile);
    let templateDocument = new Docxtemplater(templateFile);
    templateDocument.setData(data)
    
    return NextResponse.json({
      results: `Award Created was created in this folder: "${data.noaPath}" `,
    });
  } catch (error) {
    console.log("ERROR: ", error);
    return NextResponse.json({
      error: "error",
    });
  }
}