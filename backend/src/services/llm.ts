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

export async function generateReply(message: string) {

const ai = new GoogleGenAI({
apiKey: process.env.GEMINI_API_KEY!,
});

const prompt = `
${STORE_CONTEXT}

Customer:
${message}
`;

const response = await ai.models.generateContent({
model: "gemini-2.5-flash",
contents: prompt,
});

return response.text;
}
