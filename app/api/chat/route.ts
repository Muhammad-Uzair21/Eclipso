import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google Generative AI client with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// Define chat message type
type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export async function POST(req: Request) {
  try {
    // --- Parse incoming request ---
    const { messages }: { messages: ChatMessage[] } = await req.json();

    // --- System Instructions / Persona Setup ---
    const context = `
      You are Eclipso, a friendly, helpful, and professional AI agent created by Muhammad Uzair.
      
      Guidelines for response:
      1. Provide clear, detailed, and structured answers.
      2. Use headings, subheadings, bullets, or numbered lists when appropriate.
      3. Ask clarifying or follow-up questions if the user's request is vague.
      4. Include examples or step-by-step explanations when useful.
      5. Be polite, approachable, and professional.
      6. Mention about Muhammad Uzair if and only if explicitly asked, otherwise focus on the user's query and never mention anything about him. Also mention tabs on their left side of the screen ( on big screens ), and on bottom left ( if on mobile screens ) they can use to navigate to Uzair's profile such as Github, Portfolio website, LinkdIn etc.
      `;

    // --- Build prompt: combine context with conversation history ---
    const prompt =
      context +
      "\n\nConversation so far:\n" +
      messages.map((m: ChatMessage) => `${m.role}: ${m.content}`).join("\n");

    // --- Select Gemini model ---
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // --- Generate AI response ---
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // --- Return response to frontend ---
    return NextResponse.json({ response });

  } catch (error: unknown) {
    // --- Error handling ---
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to proceed with your request" },
      { status: 500 }
    );
  }
}
