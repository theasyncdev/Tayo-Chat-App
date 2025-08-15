import cloudinary from 'cloudinary';
import { CLOUDINARY_NAME, CLOUDINARY_API_SECRET, CLOUDINARY_API_KEY } from '../config/env.config.js';

cloudinary.v2.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

const uploadFileToCloudinary = async (file) => {
    const isVideo = file.mimetype.startsWith('video');
    const options = {
        resource_type: isVideo ? 'video' : 'image'
    };

    try {
        const uploader = isVideo 
            ? cloudinary.v2.uploader.upload_large 
            : cloudinary.v2.uploader.upload;

        const result = await uploader(file.path, options);
        return result;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error;
    }
};

export default uploadFileToCloudinary;
