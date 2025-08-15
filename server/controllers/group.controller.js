import { HTTP_STATUS } from "../constants/constants.js";
import Group from "../models/group.model.js";
import User from "../models/user.model.js";
import { ApiResponse,ApiError, asyncHandler } from "../utils/apiUtils.js";

export const createGroupHandler = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { groupId } = req.params;
    const { memberIds } = req.body;

    if (!userId || !memberIds || memberIds.length === 0) {
        throw new ApiError(HTTP_STATUS.VALIDATION_ERROR, 'Fields are empty');
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found!');
    }

    const existingGroup = await Group.findById(groupId);
    if (existingGroup) {
        throw new ApiError(HTTP_STATUS.CONFLICT, 'Group already exists');
    }

    const newGroup = new Group({
        groupAdmin: userId,
        members: memberIds
    });

    await newGroup.save();

    return new ApiResponse(HTTP_STATUS.CREATED, 'Group created!', null).send(res)
});
