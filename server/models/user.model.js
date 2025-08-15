import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
            maxlength: 30
        },
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 30
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        avatar: {
            type: String
        },
        isOnline: {
            type : Boolean,
            default: false
        },
        lastSeen: {
            type : Date
        }
    },
    { timestamps: true }
);

const User = mongoose.models.user || mongoose.model('user', userSchema);

export default User;
