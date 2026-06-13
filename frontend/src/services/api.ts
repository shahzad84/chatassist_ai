const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3001";

export async function sendMessage(message:string,sessionId?:string){
    const response=await fetch(
        `${API_URL}/chat/message`,
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({message, sessionId}),
        }
    );
    const data = await response.json();
    if(!response.ok){
        throw new Error(data.error || "Failed to send message");
    }
    return data;
}
export async function getHistory(sessionId: string) {
  const response = await fetch(
    `${API_URL}/chat/history/${sessionId}`
  );
  const data = await response.json();
  if (!response.ok) {    
    throw new Error(data.error || "Failed to load history");
  }

  return data;
}