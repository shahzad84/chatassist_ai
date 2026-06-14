const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3001";

async function fetchWithRetry(
  url: string,
  options: RequestInit
) {
  try {
    return await fetch(url, options);
  } catch {
    await new Promise((resolve) =>
      setTimeout(resolve, 2000)
    );

    return fetch(url, options);
  }
}

export async function sendMessage(message:string,sessionId?:string){
    try{
      const response=await fetchWithRetry(
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
    }catch {
      throw new Error(
        "Unable to reach the support service. It may be starting up. Please try again in a few seconds."
      );
    }
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