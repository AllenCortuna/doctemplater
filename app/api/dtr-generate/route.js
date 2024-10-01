import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import * as XLSX from "xlsx";

export async function POST(request) {
  try {
    const data = await request.json();
    const templatePath = path.join(process.cwd(), "public", "DTR.xls");
    const fileBuffer = await fs.readFile(templatePath);
    const workbook = XLSX.read(fileBuffer, { cellStyles: true });
    console.log("data", data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    // Update name and period
    updateCellValue(worksheet, "D12", data.name);
    updateCellValue(worksheet, "H13", data.period);

    // Update date entries
    Object.entries(data.date).forEach(([day, record]) => {
      const row = 19 + parseInt(day);
      updateCellValue(worksheet, `E${row}`, record.Arrival);
      updateCellValue(worksheet, `I${row}`, record.Departure);
      updateCellValue(worksheet, `M${row}`, record['Arrival (PM)']);
      updateCellValue(worksheet, `Q${row}`, record['Departure (PM)']);
    });

    const updatedWorkbookBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xls",
      cellStyles: true,
    });

    const responseHeaders = new Headers({
      "Content-Type": "application/vnd.ms-excel",
      "Content-Disposition": `attachment; filename="${data.name} DTR.xls"`,
    });

    return new NextResponse(updatedWorkbookBuffer, {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Error generating DTR:", error);
    return NextResponse.json({
      status: 500,
      error: `Error: ${error.message}`,
    });
  }
}

function updateCellValue(worksheet, cellAddress, newValue) {
  if (worksheet[cellAddress]) {
    worksheet[cellAddress].v = newValue;
  } else {
    worksheet[cellAddress] = { t: 's', v: newValue };
  }
}