import mongoose from "mongoose";

const userActivationSchema = new mongoose.Schema({
  name: { type: String, required: true },   
  email: { type: String, required: true },  
  credits: { type: Number, default: 0 },   
});

const UserActivation = mongoose.model("UserActivation", userActivationSchema);

export default UserActivation;
