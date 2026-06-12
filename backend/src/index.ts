import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chat.js";


dotenv.config();

const app=express();

app.use(cors());
app.use(express.json());
app.use("/chat",chatRoutes);

app.get("/", (req, res)=>{
    res.send("backend running");
});
const PORT =3001;

app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`);
})