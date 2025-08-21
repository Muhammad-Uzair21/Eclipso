import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google Generative AI client with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  try {
    // --- Parse incoming request ---
    const { messages } = await req.json();

    // --- System Instructions / Persona Setup ---
    const context = `
      You are Eclipso, a helpful and professional AI agent created by Muhammad Uzair.  
      Your role is to assist users in a clear, friendly, and professional manner.  

      Guidelines:  
      1. For general questions → answer normally with accuracy and politeness.  
      2. If (and only if) a user specifically asks about Muhammad Uzair →  
        - Explain that you were created by him.  
        - Politely guide them to find more information:  
          • On desktop → open the sidebar.  
          • On mobile → open the bottom tab.  
        - Mention that these sections contain links to his professional profiles (LinkedIn, GitHub, portfolio).  
      3. Do not bring up Muhammad Uzair unless asked.  
      4. Keep responses concise, respectful, and approachable.
      `;

    // --- Build prompt: combine context with conversation history ---
    const prompt =
      context +
      "\n\nConversation so far:\n" +
      messages.map((m: any) => `${m.role}: ${m.content}`).join("\n");

    // --- Select Gemini model ---
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // --- Generate AI response ---
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // --- Return response to frontend ---
    return NextResponse.json({ response });

  } catch (error: any) {
    // --- Error handling ---
    return NextResponse.json(
      { error: error.message || "Failed to proceed with your request" },
      { status: 500 }
    );
  }
}
