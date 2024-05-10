import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import * as xlsx from "xlsx";
import {
  convertToDate,
  dateSuffix,
  suffix,
  toTitleCase,
} from "@/config/convertToDate";
import { filterByLen } from "@/config/removeDup";
import { extractValue } from "@/config/createMemoFunction";

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
      day: new Date(convertToDate(extractValue(excel[1]))).toLocaleString(
        "default",
        { day: "numeric" }
      ),
      suffix: suffix(
        new Date(convertToDate(extractValue(excel[1]))).toLocaleString(
          "default",
          { day: "numeric" }
        )
      ),
      month: toTitleCase(
        new Date(convertToDate(extractValue(excel[1]))).toLocaleString(
          "default",
          { month: "long" }
        )
      ),
      year: new Date(convertToDate(extractValue(excel[1]))).toLocaleString(
        "default",
        { year: "numeric" }
      ),
      start_date: convertToDate(extractValue(excel[2])),
      end_date: convertToDate(extractValue(excel[3])),
      table: excel.slice(5).map((subArr) => {
        return {
          index: subArr[0],
          value: subArr[1],
        };
      }),
    };
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
            .join(", ")} ${extractValue(excel[0])} PIO CERT.docx`
        ),
        outputDocumentBuffer
      );

      return NextResponse.json({
        status: 200,
        message: `"CERT written succesfully"`,
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
