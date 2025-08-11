import { ApiError, asyncHandler } from '../middlewares/errorMiddleware.js';
import Chat from '../models/chat.model.js';
import Messages from '../models/message.schema.js';
import { HTTP_STATUS } from '../constants/constants.js';

export const sendMessageHandler = asyncHandler(async (req, res) => {
    const { message } = req.body;
    const senderId = req.user._id;
    const { id: receiverId } = req.params;

    if (!message.trim() || !senderId || !receiverId) {
        throw new ApiError(HTTP_STATUS.VALIDATION_ERROR, 'Missing Fields!');
    }

    let chat = await Chat.findOne({
        participants: { $all: [senderId, receiverId] }
    });

    if (!chat) {
        chat = await Chat.create({
            participants: [senderId, receiverId],
            messages: []
        });
    }

    const newMessage = new Messages({
        senderId,
        receiverId,
        message
    });

    if (newMessage) {
        chat.messages.push(newMessage._id);
    }

    await Promise.all([newMessage.save(), chat.save()]);
    return res.status(HTTP_STATUS.OK).json({ success: true, message: 'message sent!', newMessage });
});

export const getMessageHandler = asyncHandler(async (req, res) => {
    const { id: usertoChatId } = req.params;
    const senderId = req.user._id;

    if (!usertoChatId || !senderId) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Unauthorized!');
    }
    const chat = await Chat.findOne({
        participants: { $all: [senderId, usertoChatId] }
    }).populate({ path: 'messages', options: { limit: 20, sort: { createdAt: -1 } } });

    if (!chat) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, 'chat not found!');
    }

    return res.status(HTTP_STATUS.OK).json({ success: true, chat });
});
