import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import * as XLSX from "xlsx";

export async function POST(request) {
  try {
    const data = await request.json();
    const templatePath = path.join(process.cwd(), "public", "DTR.xlsx");
    const fileBuffer = await fs.readFile(templatePath);
    const workbook = XLSX.read(fileBuffer, { type: "buffer", cellStyles: true });
    
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    // Update name and period
    updateCellValue(worksheet, "D12", data.name);
    updateCellValue(worksheet, "A53", data.name);
    updateCellValue(worksheet, "H13", data.period);

    // Update date entries
    Object.entries(data.date).forEach(([day, record]) => {
      const row = 19 + parseInt(day);
      updateCellValue(worksheet, `E${row}`, record.Arrival);
      updateCellValue(worksheet, `I${row}`, record.Departure);
      updateCellValue(worksheet, `M${row}`, record["Arrival (PM)"]);
      updateCellValue(worksheet, `Q${row}`, record["Departure (PM)"]);
    });

    // Calculate and update total hours worked
    calculateTotalHours(worksheet);

    const updatedWorkbookBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
      cellStyles: true,
    });

    const responseHeaders = new Headers({
      "Content-Type": "application/vnd.ms-excel",
      "Content-Disposition": `attachment; filename="${data.name}_DTR.xlsx"`,
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
  XLSX.utils.sheet_add_aoa(worksheet, [[newValue]], { origin: cellAddress });
}

function calculateTotalHours(worksheet) {
  for (let row = 19; row <= 48; row++) {
    const morningIn = worksheet[`B${row}`]?.v;
    const morningOut = worksheet[`C${row}`]?.v;
    const afternoonIn = worksheet[`D${row}`]?.v;
    const afternoonOut = worksheet[`E${row}`]?.v;

    if (morningIn && morningOut && afternoonIn && afternoonOut) {
      const totalHours = calculateHoursDifference(morningIn, morningOut) +
                         calculateHoursDifference(afternoonIn, afternoonOut);
      updateCellValue(worksheet, `H${row}`, totalHours.toFixed(2));
    }
  }
}

function calculateHoursDifference(startTime, endTime) {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  let hourDiff = endHour - startHour;
  let minuteDiff = endMinute - startMinute;

  if (minuteDiff < 0) {
    hourDiff--;
    minuteDiff += 60;
  }

  return hourDiff + (minuteDiff / 60);
}