import { GoogleGenAI } from "@google/genai";

const STORE_CONTEXT = `
You are a helpful support agent.

Store Information:

Shipping:
- Worldwide shipping
- Delivery 3-7 business days

Returns:
- Returns accepted within 30 days

Support:
- Monday to Friday
- 9am to 6pm IST

Answer clearly and concisely.
`;

export async function generateReply(history: any[],message: string) {

    const historyText = history
  .slice(-20)
  .map(
    (msg) =>
      `${msg.sender.toUpperCase()}: ${msg.text}`
  )
  .join("\n");

const ai = new GoogleGenAI({
apiKey: process.env.GEMINI_API_KEY!,
});

const prompt = `
${STORE_CONTEXT}

Conversation History:

${historyText}

Customer:
${message}

Support Agent:
`;

const response = await ai.models.generateContent({
model: "gemini-2.5-flash",
contents: prompt,
});

return response.text;
}
