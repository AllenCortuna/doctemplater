import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { convertToDate } from "@/config/convertToDate";
import { amountToWords } from "@/config/amountToWords";
import { formatNumber } from "@/config/formatNumber";
import { filterByLen } from "@/config/removeDup";

export async function POST(request) {
  const requestData = await request.json();
  const memoTemplate = fs.readFileSync(
    path.resolve(__dirname, requestData?.memoTemplate),
    "binary"
  );
  const memoZip = new PizZip(memoTemplate);
  // console.log("here");
  // for the MEMO
  try {
    let memoOutputDoc = new Docxtemplater(memoZip);

    const memoPath = requestData?.excelData;
    console.log("BONDS PATH: ", memoPath);
    const buffer = fs.readFileSync(memoPath);
    const workbook = xlsx.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    const unfilterBonds = data.map((obj) => Object.values(obj));
    const bonds = filterByLen(unfilterBonds, 2);
    const dataToAdd = {
      bonds,
    };
    // console.log("dataToAdd: ", dataToAdd);

    // Set the data we wish to add to the document
    memoOutputDoc.setData(dataToAdd);

    try {
      // Attempt to render the document (Add data to the template)
      memoOutputDoc.render();

      // Create a buffer to store the output data
      let outputDocumentBuffer = memoOutputDoc
        .getZip()
        .generate({ type: "nodebuffer" });

      // Save the buffer to a file
      fs.writeFileSync(
        path.resolve(
          __dirname,
          `${folderData?.outputFolder}/ ${id} Certfications.docx`
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
    message: "Template written succesfully",
  });
}
