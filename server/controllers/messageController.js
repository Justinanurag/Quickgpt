import imagekit from "../configs/ImageKit.js";
import Chat from "../models/Chat.js";
import User from "../models/user.js";
import axios from "axios";
import openai from "../configs/openai.js";

//Text-based  AI Chat message Controller
export const textMessageController = async (req, res) => {
  try {
    if (!req.user) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const userId = req.user._id;

    // Check Credits
    if (req.user.credits < 1) {
      return res.json({
        success: false,
        message: "Insufficient Credit points",
      });
    }

    const { chatId, prompt } = req.body;
    const chat = await Chat.findOne({ userId, _id: chatId });

    if (!chat) {
      return res.json({
        success: false,
        message: "Chat not found",
      });
    }

    // Save user message
    chat.message.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    // OpenAI call
    const completion = await openai.chat.completions.create({
      model: "gemini-1.5-flash",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
    });

    const replyMessage = completion.choices[0].message;

    const reply = {
      role: replyMessage.role || "assistant",
      content: replyMessage.content,
      timestamp: Date.now(),
      isImage: false,
    };

    // Send response back
    res.json({
      success: true,
      message: "Text message fetched from API",
      reply,
    });

    // Save reply + update credits
    chat.message.push(reply);
    await chat.save();
    await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

//Image generation Message Controller
export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check Credits
    if (req.user.credits < 2) {
      return res.json({
        success: false,
        message: "Insufficient Credit points",
      });
    }

    const { prompt, chatId, isPublished } = req.body;

    // Find chat
    const chat = await Chat.findOne({ userId, _id: chatId });
    if (!chat) {
      return res.json({ success: false, message: "Chat not found" });
    }

    // Push user message
    chat.message.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    // Encode the prompt
    const encodedPrompt = encodeURIComponent(prompt);

    // Construct ImageKit AI generation URL
    const generateImageUrl = `${
      process.env.IMAGEKIT_URL_ENDPOINT
    }/Quickgpt/ik-genimg-prompt-${encodedPrompt}-${Date.now()}.png?tr=w-800,h-800`;

    // Image generation by fetching from ImageKit
    const aiImageResponse = await axios.get(generateImageUrl, {
      responseType: "arraybuffer",
    });

    // Convert to base64
    const base64Image = `data:image/png;base64,${Buffer.from(
      aiImageResponse.data,
      "binary"
    ).toString("base64")}`;

    // Upload to ImageKit media library
    const uploadResponse = await imagekit.upload({
      file: base64Image,
      fileName: `${Date.now()}.png`,
      folder: "quickgpt",
    });

    const reply = {
      role: "assistant",
      content: uploadResponse.url,
      timestamp: Date.now(),
      isImage: true,
      isPublished,
    };

    res.json({
      success: true,
      message: "Generated image fetched from ImageKit",
      reply,
    });

    // Save to chat + deduct credits
    chat.message.push(reply);
    await chat.save();
    await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

