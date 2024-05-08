import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import * as xlsx from "xlsx";
import { convertToDate, dateSuffix } from "@/config/convertToDate";
import { filterByLen } from "@/config/removeDup";
import {
  extractValue,
} from "@/config/createMemoFunction";

export async function POST(request) {
  // for the MEMO
  try {
    const requestData = await request.json();
    const memoTemplate = fs.readFileSync(
      path.resolve(__dirname, requestData?.certTemplate),
      "binary"
    );
    const memoZip = new PizZip(memoTemplate);
    let memoOutputDoc = new Docxtemplater(memoZip);
    const memoPath = requestData?.excelData;
    const buffer = fs.readFileSync(memoPath);
    const workbook = xlsx.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    const unfilterData = data.map((obj) => Object.values(obj));
    const excel = filterByLen(unfilterData, 2);

    const dataToAdd = {
      cert_type: extractValue(excel[0]),
      cert_type_upper: extractValue(excel[0]).toUpperCase(),
      day: dateSuffix(new Date(convertToDate(extractValue(excel[4]))).toLocaleString('default', { day: 'numeric' })),
      month: new Date(convertToDate(extractValue(excel[4]))).toLocaleString('default', { month: 'long' }),
      start_date: convertToDate(extractValue(excel[2])),
      end_date: convertToDate(extractValue(excel[3])),
      cert_date: convertToDate(extractValue(excel[4])),
      table: excel.slice(6).map((subArr) => {
        return {
          index: subArr[0],
          value: subArr[1],
        };
      }),
    };
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
          `${requestData?.outputPath}/CERT ${excel
            .slice(6,11)
            .map(([first]) => first)
            .join(", ")} ${extractValue(excel[0])}.docx`
        ),
        outputDocumentBuffer
      );
    } catch (error) {
      console.error(`ERROR Filling out Template:`);
      console.error(error);
    }
  } catch (error) {
    console.error(`ERROR Loading Template:`);
    console.error(error);
  }

  return NextResponse.json({
    status: 200,
    message: "CERT written succesfully",
  });
}
