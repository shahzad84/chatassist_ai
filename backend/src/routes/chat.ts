import { Router} from "express";
import {generateReply} from "../services/llm.js";
import { v4 as uuidv4 } from "uuid";
const router = Router();

router.post("/message", async (req,res)=>{
    try{

        const {message} =req.body;
        if (!message?.trim()){
            return res.status(400).json({
                error:"message is required",
            });
        }
        let { sessionId } = req.body;

        if (!sessionId) {
        sessionId = uuidv4();
        }

        const reply=await generateReply(message);

        res.json({
            reply,
            sessionId,
        });
    }catch(error){
        console.error(error);
        res.status(500).json({
            error:"AI service unavailable",
        });
    }
});
export default router;