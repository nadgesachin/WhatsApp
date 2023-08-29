import Message from "../modal/Message.js";
import Conversation from '../modal/Conversation.js';


export const newMessage = async (request, response) => {
    const newMessage = new Message(request.body);
    try {
        await newMessage.save();
        await Conversation.findByIdAndUpdate(request.body.conversationId, { message: request.body.text });
        response.status(200).json("Message has been sent successfully");
    } catch (error) {
        response.status(500).json(error);
    }

}

export const getMessage = async (request, response) => {
    try {
        const messages = await Message.find({ conversationId: request.params.id });
        response.status(200).json(messages);
    } catch (error) {
        response.status(500).json(error);
    }

}

// message-controller.js

export const updateMessageStatus = async (request, response) => {
    try {
        const { messageId } = request.params;
        const { status } = request.body;

        const message = await Message.findByIdAndUpdate(messageId, { status }, { new: true });

        // If you are using sockets, emit the event here to inform other users that the message has been seen
        socket.emit('messageStatusUpdated', { messageId: messageId, status: 'seen' });

        response.status(200).json(message);
    } catch (error) {
        response.status(500).json(error);
    }
}

export const batchUpdateMessageStatus = async (request, response) => {
    try {
        const { messageIds } = request.body;

        if (!messageIds || messageIds.length === 0) {
            return response.status(400).json({ error: 'No message IDs provided.' });
        }

        const updated = await Message.updateMany(
            { _id: { $in: messageIds } },
            { $set: { status: 'seen' } }
        );

        if (updated.nModified === 0) {
            return response.status(400).json({ error: 'No messages updated.' });
        }

        
        response.status(200).json({ success: true });
    } catch (error) {
        response.status(500).json(error);
    }
}