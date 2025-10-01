import User from '../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import Chat from '../models/Chat.js'

 //Genetrate JWT 
 const genetareToken =(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:'30d'
    })
 }

//Api to register user
export const registerUser=async(req,res)=>{
    const{name,email,password}=req.body;
    try {
        const userExist=await User.findOne({email});
        if(userExist){
            return res.json({
                success:false,
                message:" User already exists"
            })
        }
        const user=await User.create({name,email,password});
        const token=genetareToken(user._id)
        res.json({
            success:true,
            token:token
        })
    } catch (error) {
        return res.json({
            success:false,
            message:error.message
        })
    }
}
//Api to login user
export const loginUser=async (req,res)=>{
    const {email,password}=req.body;
    try {
        const user =await User.findOne({email});
        if(user){
            const isMatch=await bcrypt.compare(password,user.password);
            if(isMatch){
                const token=genetareToken(user._id);
                return res.json({
                    success:true,
                    token:token,
                    message:"✅ Login Successfully"
                })
            }
            return res.json({
                success:false,
                message:"❌ Invalid Email or Password"
            })
        }
        
    } catch (error) {
        return res.json({
            success:false,
            message:error.message
        })
    }
    
}

//Api to get user data
export const getUser=async(req,res)=>{
     try {
        const user=req.user
        return res.json({
            success:true,
            user
        })
        
     } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
     }
}

//Api to get published images
export const getPublishedImage =async(req,res)=>{
 try {
    const publishedImagesMessages= await Chat.aggregate([
        {$unwind:"$messages"},
        {
         $match:{
            "messages.isImages":true,
            "messages.isPublished":true
         }
        },
        {
            $project:{
                _id:0,
                imageUrl:"$messages.content",
                userName:"$userName"
            }
        }
    ])
    res.json({
        success:true,
        images:publishedImagesMessages.reverse()
    })
 } catch (error) {
    res.json({
        success:false,
        message:error.message
    })
    
 }
}