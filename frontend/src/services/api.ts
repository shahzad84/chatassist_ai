export async function sendMessage(message:string){
    const response=await fetch(
        "http://localhost:3001/chat/message",
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({message}),
        }
    );
    if(!response.ok){
        throw new Error("Failed to send message");
    }
    return response.json();
}