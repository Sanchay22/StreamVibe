import {v2 as cloudinary} from "cloudinary"
import fs from "fs"  
cloudinary.config({ 
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});
const uploadCloudinary= async(localFilePath)=>{
    try{
        if(!localFilePath) return null
        //upload the file on cloudinary
        const response=await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        //file has been uploaded successfully
        // console.log("file uploaded on cloudinary")
        // console.log(response.url);
        fs.unlinkSync(localFilePath)
        return response
    }catch(error){
        fs.unlinkSync(localFilePath)  //remove the locally temporarily saved file
        return null;
    }
}
const deleteCloudinary=async(imageUrl)=>{
    try {
        //this util should be called only after checking that file exists
        const image_id=imageUrl.split("/").pop().split(".")[0];
        console.log(image_id);
        console.log(imageUrl);
        await cloudinary.uploader.destroy(image_id, function(error,result) {
            console.log(result, error) }
        ) 
        console.log("File deleted")
        return true;
    } catch (error) {
        throw new error;
    }
}
export {uploadCloudinary,
    deleteCloudinary
}