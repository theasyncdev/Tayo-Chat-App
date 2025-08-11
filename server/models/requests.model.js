import mongoose from 'mongoose';

const friendRequestSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending'
        }
    },
    { timestamps: true }
);

const Friends = models.friendRequest || mongoose.model('friendRequest', friendRequestSchema);

export default Friends;
