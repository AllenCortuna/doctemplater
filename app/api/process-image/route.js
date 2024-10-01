// pages/api/process-image/route.js
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google Generative AI
const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req) {
  try {
    let base64Image;
    let mimeType;
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      // Handle form-data (from camera capture)
      const formData = await req.formData();
      const file = formData.get("image");
      if (!file) {
        return NextResponse.json(
          { error: "No file uploaded" },
          { status: 400 }
        );
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      base64Image = buffer.toString("base64");
      mimeType = file.type;
    } else if (contentType.includes("application/json")) {
      // Handle JSON body (from file upload)
      const { image } = await req.json();
      const matches = image.match(/^data:(.+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return NextResponse.json(
          { error: "Invalid image data" },
          { status: 400 }
        );
      }
      mimeType = matches[1];
      base64Image = matches[2];
    } else {
      return NextResponse.json(
        { error: "Unsupported content type" },
        { status: 400 }
      );
    }

    const prompt = `extract the data here in this format:
                        {
                        name: "",
                        period: "",
                        date: {
                        1: { "", "", "", "" },
                        2: { "", "", "", ""},
                        ... so on
                        }
                        }

                        sample data:
                        {
                            "name": "CORTUNA, ALLEN LAWRENCE R.",
                            "period": "September 2024",
                            "date": {
                                "1": { "Arrival": "", "Departure": "", "Arrival (PM)": "", "Departure (PM)": "" },
                                "2": { "Arrival": "8:23AM", "Departure": "12:05PM", "Arrival (PM)": "12:33PM", "Departure (PM)": "5:06PM" },
                                "3": { "Arrival": "7:35AM", "Departure": "12:19PM", "Arrival (PM)": "12:34PM", "Departure (PM)": "5:04PM" },
                                "4": { "Arrival": "7:52AM", "Departure": "12:22PM", "Arrival (PM)": "12:42PM", "Departure (PM)": "5:01PM" },
                                "5": { "Arrival": "7:38AM", "Departure": "12:02PM", "Arrival (PM)": "12:38PM", "Departure (PM)": "5:02PM" },
                                "6": { "Arrival": "7:54AM", "Departure": "12:14PM", "Arrival (PM)": "12:38PM", "Departure (PM)": "5:01PM" },
                                "7": { "Arrival": "", "Departure": "", "Arrival (PM)": "", "Departure (PM)": "" },
                                "8": { "Arrival": "", "Departure": "", "Arrival (PM)": "", "Departure (PM)": "" },
                                "9": { "Arrival": "7:39AM", "Departure": "12:17PM", "Arrival (PM)": "12:45PM", "Departure (PM)": "5:05PM" },
                                "10": { "Arrival": "7:32AM", "Departure": "12:19PM", "Arrival (PM)": "12:38PM", "Departure (PM)": "5:17PM" },
                                "11": { "Arrival": "7:50AM", "Departure": "12:18PM", "Arrival (PM)": "12:41PM", "Departure (PM)": "5:04PM" },
                                "12": { "Arrival": "7:45AM", "Departure": "12:25PM", "Arrival (PM)": "12:42PM", "Departure (PM)": "5:03PM" },
                                "13": { "Arrival": "7:50AM", "Departure": "12:06PM", "Arrival (PM)": "12:48PM", "Departure (PM)": "5:04PM" },
                                "14": { "Arrival": "", "Departure": "", "Arrival (PM)": "", "Departure (PM)": "" },
                                "15": { "Arrival": "", "Departure": "", "Arrival (PM)": "", "Departure (PM)": "" },
                                "16": { "Arrival": "7:48AM", "Departure": "12:13PM", "Arrival (PM)": "12:33PM", "Departure (PM)": "5:03PM" },
                                "17": { "Arrival": "7:31AM", "Departure": "12:06PM", "Arrival (PM)": "12:36PM", "Departure (PM)": "5:04PM" },
                                "18": { "Arrival": "7:54AM", "Departure": "12:05PM", "Arrival (PM)": "12:42PM", "Departure (PM)": "5:01PM" },
                                "19": { "Arrival": "7:55AM", "Departure": "12:03PM", "Arrival (PM)": "12:37PM", "Departure (PM)": "5:03PM" },
                                "20": { "Arrival": "7:53AM", "Departure": "12:04PM", "Arrival (PM)": "12:48PM", "Departure (PM)": "5:03PM" },
                                "21": { "Arrival": "", "Departure": "", "Arrival (PM)": "", "Departure (PM)": "" },
                                "22": { "Arrival": "", "Departure": "", "Arrival (PM)": "", "Departure (PM)": "" },
                                "23": { "Arrival": "8:12AM", "Departure": "12:04PM", "Arrival (PM)": "12:45PM", "Departure (PM)": "3:04PM" },
                                "24": { "Arrival": "7:51AM", "Departure": "12:10PM", "Arrival (PM)": "12:48PM", "Departure (PM)": "5:04PM" },
                                "25": { "Arrival": "7:49AM", "Departure": "12:14PM", "Arrival (PM)": "12:40PM", "Departure (PM)": "5:04PM" },
                                "26": { "Arrival": "7:55AM", "Departure": "12:03PM", "Arrival (PM)": "12:40PM", "Departure (PM)": "5:01PM" },
                                "27": { "Arrival": "7:47AM", "Departure": "12:14PM", "Arrival (PM)": "12:35PM", "Departure (PM)": "5:03PM" },
                                "28": { "Arrival": "7:40AM", "Departure": "12:00PM", "Arrival (PM)": "12:33PM", "Departure (PM)": "5:02PM" },
                                "29": { "Arrival": "", "Departure": "", "Arrival (PM)": "", "Departure (PM)": "" },
                                "30": { "Arrival": "7:56AM", "Departure": "12:06PM", "Arrival (PM)": "12:54PM", "Departure (PM)": "5:10PM" }
                            }
                            }
                        `;
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      {
        error: "Failed to process image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
