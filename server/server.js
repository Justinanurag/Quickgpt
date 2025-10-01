import express from "express"
import "dotenv/config"
import cors from "cors";
import connectDB from'./configs/db.js'
import userRouter from "./Routes/userRouter.js";
import chatRouter from "./Routes/chatRouter.js";
import messageRouter from "./Routes/messageRouter.js";
import creditRouter from "./Routes/creditRouter.js";
import { razorpayWebhooks } from "./controllers/webhooks.js";

const  app=express();
const PORT=process.env.PORT || 3000;

await connectDB();

//Middleware
app.use(cors());
app.use(express.json());
app.use('/api/user',userRouter);
app.use('/api/chat',chatRouter);
app.use('/api/message',messageRouter);
app.use('/api/credit',creditRouter)
//Routes
app.get('/',(req,res)=>{
    res.send("Server is live now")
});

//razorpay
app.post("/api/razorpay",razorpayWebhooks)
app.get("/Polybond",(req,res)=>{
    res.send("Polybond page")
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
});
