import { Router} from "express";
const router = Router();

router.post("/message", async (req,res)=>{
    const {message} =req.body;
    if (!message?.trim()){
        return res.status(400).json({
            error:"message is required",
        });
    }
    res.json({
        reply:`You said: ${message}`,
        sessionId:"demo-session",
    });
});
export default router;