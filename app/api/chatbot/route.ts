import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(messages);

    return NextResponse.json({
      response: result.response.text(),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      response: "Failed to proceed with your request",
    });
  }
}
