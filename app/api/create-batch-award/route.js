import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { amountToWords } from "@/config/amountToWords";
import { convertToDate } from "@/config/convertToDate";
import { formatNumber } from "@/config/formatNumber";
import { removeDuplicate } from "@/config/removeDuplicate";

export async function POST(request) {
  try {
    const data = await request.json();
    const excelData = removeDuplicate(data?.excelData);
    console.log('EXCEL DATA:>> ', excelData);

    // Check if excelData is not empty and is an array
    if (!excelData || !Array.isArray(excelData)) {
      throw new Error("Excel data is missing or not in correct format.");
    }

    for (const item of excelData) {
      try {
        // Get the template file
        const templateFilePath = path.resolve(
          __dirname,
          data?.noaFolderData?.noaTemplate
        );
        const templateFile = fs.readFileSync(templateFilePath, "binary");

        const zip = new PizZip(templateFile);
        let templateDocument = new Docxtemplater(zip);
        console.log('ITEM :>> ', item);
        const itemData = {
          date: convertToDate(item[2]),
          contractor_name: item[3],
          contractor_address: item[4],
          contract_no: item[0],
          contract_name: item[1],
          amount_in_words: amountToWords(item[5].toString()),
          amount: formatNumber(item[5].toString()),
          representative: item[6],
        }; 
        

        templateDocument.setData(itemData);

        // Render the document only once
        templateDocument.render();

        const outputDocumentBuffer = templateDocument
          .getZip()
          .generate({ type: "nodebuffer" });

        fs.writeFileSync(
          path.resolve(
            __dirname,
            `${data?.noaFolderData?.noaPath}/${item[0]} NOA.docx`
          ),
          outputDocumentBuffer
        );

        // Reset the templateDocument for next iteration
        templateDocument = new Docxtemplater(zip);
      } catch (error) {
        console.error("ERROR Filling out Template:");
        console.error(error);
      }
    }

    return NextResponse.json({
      results: `Award Created was created in this folder: "${data?.noaFolderData?.noaPath}"`,
    });
  } catch (error) {
    console.error("ERROR: ", error);
    return NextResponse.json({
      error: "error",
    });
  }
}
