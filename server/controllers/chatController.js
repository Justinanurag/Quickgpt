import Chat from "../models/Chat.js"

//Api Controller for creating a new chat
export const createChat=async(req,res)=>{
    
    try {
        const userId=req.user._id;
        const chatData={
            userId,
            messages:[],
            name:"new Chat",
            userName:req.user.name
        }
        await Chat.create(chatData)
        res.json({
            success:true,
            messages:"Chat Created Successfully"
        })
    } catch (error) {
        res.json({
            success:false,
            error:error.messages
        })
        
    }

}

//Api Controller for getting all chats

export const getChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });

    res.json({
      success: true,
      chats,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message || "Get chat error",
    });
  }
};


//Api Controller for deleting a chats
export const deleteChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId } = req.body;

    const result = await Chat.deleteOne({
      _id: chatId,
      userId,
    });

    if (result.deletedCount === 0) {
      return res.json({
        success: false,
        message: "Chat not found or not authorized to delete",
      });
    }

    res.json({
      success: true,
      message: "Chat deleted successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message || "Delete Chat error",
    });
  }
};
