import {Conversation} from "../models/conversation.model.js";
import {Message} from "../models/message.model.js";
export const sendMessage = async (req,res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const {textMessage:message} = req.body;
      
        let conversation = await Conversation.findOne({
            participants:{$all:[senderId, receiverId]}
        });
        if(!conversation){
            conversation = await Conversation.create({
                participants:[senderId, receiverId]
            })
        };
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });
        if(newMessage) conversation.messages.push(newMessage._id);

        await Promise.all([conversation.save(),newMessage.save()])
        await newMessage.populate({
            path: 'senderId',
            select: 'username profilePicture'
        });

        return res.status(201).json({
            success:true,
            newMessage
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
}
export const getMessage = async (req,res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const conversation = await Conversation.findOne({
            participants:{$all: [senderId, receiverId]}
        }).populate({
            path: 'messages',
            populate: {
                path: 'senderId',
                select: 'username profilePicture'
            }
        });
        if(!conversation) return res.status(200).json({success:true, messages:[]});

        return res.status(200).json({success:true, messages:conversation?.messages || []});
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
}