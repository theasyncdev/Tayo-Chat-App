import { ApiError, asyncHandler, ApiResponse } from '../utils/apiUtils.js';
import Chat from '../models/chat.model.js';
import Messages from '../models/message.model.js';
import { HTTP_STATUS } from '../constants/constants.js';
import uploadFileToCloudinary from '../services/cloudinary.service.js';

export const sendMessageHandler = asyncHandler(async (req, res) => {
    const { message } = req.body;
    const file = req.file;
    const senderId = req.user._id;
    const { id: receiverId } = req.params;
    console.log(senderId, receiverId);

    if (!senderId || !receiverId) {
        throw new ApiError(HTTP_STATUS.VALIDATION_ERROR, 'Missing Ids Fields!');
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

    let  messageType = null;
    let imageOrVideoUrl = null;

    if (file) {
        const uploadFile = await uploadFileToCloudinary(file);

        if (!uploadFile?.secure_url) {
            throw new ApiError(HTTP_STATUS.SERVICE_UNAVAILABLE, 'Failed to upload media');
        }

        imageOrVideoUrl = uploadFile.secure_url;

        if (file.mimetype.startsWith('image')) {
             messageType = 'image';
        } else if (file.mimetype.startsWith('video')) {
             messageType = 'video';
        } else {
            throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Content type not supported');
        }
    } else if (message?.trim()) {
         messageType = 'text';
    } else {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Message content is required');
    }

    const newMessage = new Messages({
        senderId,
        receiverId,
        message,
         messageType,
        imageOrVideoUrl
    });

    if (newMessage) {
        chat.messages.push(newMessage._id);
    }

    await Promise.all([newMessage.save(), chat.save()]);

    return new ApiResponse(HTTP_STATUS.OK, 'Message Sent!', newMessage).send(res)
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

    return new ApiResponse(HTTP_STATUS.OK, 'message fetch success!', chat ).send(res);
});
