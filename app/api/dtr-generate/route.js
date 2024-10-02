import { NextResponse } from "next/server";
import path from "path";
import ExcelJS from "exceljs";

export async function POST(request) {
  try {
    const data = await request.json();
    const templatePath = path.join(process.cwd(), "public", "template.xlsx");
    console.log("templatePath", templatePath);

    // Load the Excel workbook
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);

    // List all available worksheets to check if the file is loaded correctly
    console.log("Worksheets:", workbook.worksheets.map(ws => ws.name));

    // Ensure we get the correct worksheet by name or index
    const worksheet = workbook.getWorksheet('Sheet1'); // Replace 'Sheet1' with your sheet name
    if (!worksheet) {
      throw new Error("Worksheet not found");
    }

    // Update name and period
    updateCellValue(worksheet, "D12", data.name);
    updateCellValue(worksheet, "A53", data.name);
    updateCellValue(worksheet, "H13", data.period);

    // Update date entries
    Object.entries(data.date).forEach(([day, record]) => {
      const row = 18 + parseInt(day); // Adjust row based on the day
      updateCellValue(worksheet, `E${row}`, record.Arrival);
      updateCellValue(worksheet, `I${row}`, record.Departure);
      updateCellValue(worksheet, `M${row}`, record["Arrival (PM)"]);
      updateCellValue(worksheet, `Q${row}`, record["Departure (PM)"]);
    });

    // Calculate and update total hours worked
    // calculateTotalHours(worksheet);

    // Create buffer for response
    const buffer = await workbook.xlsx.writeBuffer();

    // Send the Excel file back as a response
    const responseHeaders = new Headers({
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${data.name}_DTR.xlsx"`,
    });

    return new NextResponse(buffer, {
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

// Safely update cell values, ensuring the cell exists
function updateCellValue(worksheet, cellAddress, newValue) {
  const cell = worksheet.getCell(cellAddress); // Ensure cell exists
  if (cell) {
    cell.value = newValue; // Set the new value while preserving styles
  } else {
    console.error(`Cell ${cellAddress} not found in the worksheet.`);
  }
}

function calculateTotalHours(worksheet) {
  for (let row = 19; row <= 48; row++) {
    const morningIn = worksheet.getCell(`B${row}`).value;
    const morningOut = worksheet.getCell(`C${row}`).value;
    const afternoonIn = worksheet.getCell(`D${row}`).value;
    const afternoonOut = worksheet.getCell(`E${row}`).value;

    // if (morningIn && morningOut && afternoonIn && afternoonOut) {
    //   const totalHours =
    //     calculateHoursDifference(morningIn, morningOut) +
    //     calculateHoursDifference(afternoonIn, afternoonOut);
    //   updateCellValue(worksheet, `H${row}`, totalHours.toFixed(2));
    // }
  }
}

// function calculateHoursDifference(startTime, endTime) {
//   const [startHour, startMinute] = startTime.split(":").map(Number);
//   const [endHour, endMinute] = endTime.split(":").map(Number);

//   let hourDiff = endHour - startHour;
//   let minuteDiff = endMinute - startMinute;

//   if (minuteDiff < 0) {
//     hourDiff--;
//     minuteDiff += 60;
//   }
//   return hourDiff + minuteDiff / 60;
// }
