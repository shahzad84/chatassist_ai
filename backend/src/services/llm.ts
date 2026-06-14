import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({
apiKey: process.env.GEMINI_API_KEY!,
});
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

export class LLMError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LLMError";
  }
}
function withTimeout<T>(
  promise: Promise<T>,
  ms: number
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error("timeout")),
        ms
      )
    ),
  ]);
}

export async function generateReply(history: any[],message: string) {
  try {
  const historyText = history
  .slice(-20)
  .map(
    (msg) =>
      `${msg.sender.toUpperCase()}: ${msg.text}`
  )
  .join("\n");


const prompt = `
${STORE_CONTEXT}

Conversation History:

${historyText}

Customer:
${message}

Support Agent:
`;

const response = await withTimeout(
  ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  }),
  15000
);

return (
  response.text ||
  "Sorry, I couldn't generate a response."
);

} catch (error: any) {
console.error("Gemini Error:", error);

const errorMessage =
  error?.message?.toLowerCase() || "";

if (
  errorMessage.includes("api key") ||
  errorMessage.includes("authentication") ||
  errorMessage.includes("unauthorized")
) {
  throw new LLMError(
    "AI service configuration error."
  );
}

if (
  errorMessage.includes("quota") ||
  errorMessage.includes("rate limit")
) {
  throw new LLMError(
    "The support assistant is currently handling many requests. Please try again shortly."
  );
}

if (
  errorMessage.includes("timeout") ||
  errorMessage.includes("deadline")
) {
  throw new LLMError(
    "The AI service took too long to respond."
  );
}

throw new LLMError(
  "Support assistant temporarily unavailable."
);

}
}
