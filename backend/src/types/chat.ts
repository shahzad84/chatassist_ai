export interface ChatMessage{
    sender:"user" | "ai";
    text:string;
}

export interface Conversation{
    id:string;
    messages:ChatMessage[];
}