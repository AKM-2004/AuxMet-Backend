import { v2 } from "cloudinary";
import fs from "fs";
import { extractPublicId } from "cloudinary-build-url";
import { ApiError } from "./apiError.js";

v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudnary = async (localfilepath) => {
    try {
        if (!localfilepath) {
            return null;
        }
        const response = await v2.uploader.upload(localfilepath, {
            resource_type: "auto",
        });
        console.log("file is uploaded on the cloudnary");
        fs.unlinkSync(localfilepath);
        return response; // return the url
    } catch (error) {
        fs.unlinkSync(localfilepath);
        console.log("there is problem while uploading");

        return null;
    }
};

const deleteFromCloudnary = (imgUrl) => {
    try {
        if (!imgUrl) return null;
        const pubID = extractPublicId(imgUrl);
        const response = v2.uploader.destroy(pubID);
        return response;
    } catch (err) {
        console.log(" there is some problem while delteing the img");
    }
};

export { uploadOnCloudnary, deleteFromCloudnary };
