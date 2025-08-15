import mongoose from 'mongoose'

const groupSchema = new mongoose.Schema(
    {
        groupAdmin : {
            type : mongoose.Schema.Types.ObjectId,
            ref: 'user',
            reuired: true
        },
        members: [{type: mongoose.Schema.Types.ObjectId, ref:'user'}],
        messages: [{type: mongoose.Schema.Types.ObjectId, ref:'message'}],
        imageOrVideoUrl : {type: String},
        messageType: {
            type: String,
            enum: ['text', 'image', 'video']
        }
    },
    {timestamps: true}
)

const Group = mongoose.models.group || mongoose.model('group', groupSchema);

export default Group;