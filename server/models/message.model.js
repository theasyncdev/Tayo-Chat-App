import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        chat: { type: mongoose.Schema.Types.ObjectId, ref: 'chat' },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        }, 
        message: {
            type: String,
        },
        imageOrVideoUrl : {type: String},
        messageType: {
            type: String,
            enum: ['text', 'image', 'video']
        }
    },
    {
        timestamps: true
    }
);

const Messages = mongoose.models.message || mongoose.model('message', messageSchema);

export default Messages;
