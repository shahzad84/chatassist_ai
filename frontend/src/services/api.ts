export async function sendMessage(message:string,sessionId?:string){
    const response=await fetch(
        "http://localhost:3001/chat/message",
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({message, sessionId}),
        }
    );
    if(!response.ok){
        throw new Error("Failed to send message");
    }
    return response.json();
}
export async function getHistory(sessionId: string) {
  const response = await fetch(
    `http://localhost:3001/chat/history/${sessionId}`
  );

  if (!response.ok) {
    throw new Error("Failed to load history");
  }

  return response.json();
}