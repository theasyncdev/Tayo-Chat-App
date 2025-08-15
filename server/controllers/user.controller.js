import {ApiError, asyncHandler} from '../utils/apiUtils.js'
import {HTTP_STATUS} from '../constants/constants.js'
export const userUpdateHandler = asyncHandler(async(req,res) => {
    const {id} = req.params;

    if(!id){
        throw new ApiError(HTTP_STATUS.VALIDATION_ERROR, 'Id was not provided')        
    }

    
})