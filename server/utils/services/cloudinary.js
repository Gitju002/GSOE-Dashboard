import {v2 as cloudinary} from 'cloudinary';

export const uploadImage = async (content) => {
    try {
        if(!content){
            return null;
        }
        const result = await cloudinary.uploader.upload(content);
        return {
            public_id: result.public_id,
            url: result.secure_url
        };
    } catch (error) {
        console.error(error);
        return null;
    }
}
export const deleteImage = async (public_id) => {
    try {
        await cloudinary.uploader.destroy(public_id);
    } catch (error) {
        console.error(error);
    }
}