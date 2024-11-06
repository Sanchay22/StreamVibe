import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {deleteCloudinary, uploadCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page, limit, query, sortBy, sortType } = req.query
    const pageNumber = parseInt(page, 1);
    const limitNumber = parseInt(limit, 10);
    const filter = query ? { title: { $regex: query, $options: 'i' } } : {};
    
        // Build the sort object
        const sort = { [sortBy]: sortType === 'desc' ? -1 : 1 };
    
        // Fetch videos with pagination, filtering, and sorting
        const videos = await Video.find(filter)
            .sort(sort)
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber)
            .populate('owner','username avatar fullname');
    
        // Get the total count of videos for pagination
        const totalVideos = await Video.countDocuments(filter);
    
        return res.status(201).json( new ApiResponse(201,{
            videos,
            totalVideos,
            totalPages: Math.ceil(totalVideos / limitNumber),
            currentPage: pageNumber,
        },"Video fetched successfully"));
        
    });

const publishAVideo = asyncHandler(async (req, res) => {
    // fetch the details from query
    // check if video file exists or not if it does then check thumbnail,title,description exists or not if it does not ,send the required error message
    // fetch the user id details from the req.user
    // uplaod the video and thumbnail image on local db and get the localfile path
    // if any error on localfile path delete it fereom loocal db and inform the user
    // upload the content on cloudinary from localfile path and get the cloudinary url
    // if cloudinary url is not found/found inform the user and delte from db/just delete from db
    // if file uplaoded correctly fetch the video duration from response
    //  if duration is fetched successfullty then just create a video object and save it to db and return the response
    const { title, description} = req.body
    if(!title){
        throw new ApiError(400,"Video title is required")
    }if(!description){
        throw new ApiError(400,"Video description is required")
    }
    const videoFile=req.files?.videoFile[0]?.path;
    const thumbnail=req.files?.thumbnail[0]?.path;
    if(!videoFile){
        throw new ApiError(400,"Video file not found")
    }if(!thumbnail){
        throw new ApiError(400,"Video file not found")
    }const videor=await uploadCloudinary(videoFile);
    const thumbnailr=await uploadCloudinary(thumbnail);
    const user_id=req.user?._id;
    // console.log("Sab changa see");
    const video=await Video.create({
        videoFile:videor.url,
        thumbnail:thumbnailr.url,
        title,
        description,
        duration:videor.duration,
        views:0,
        isPublished:true,
        owner:user_id
    })
    // console.log("Sab changa see");
    const createdVideo=await Video.findById(video._id)
    if(!createdVideo){
        throw new ApiError(500, "Something went wrong while uploading the video")
    }
    // console.log(videor);
    // console.log(thumbnailr);
    return res.status(201).json(
        new ApiResponse(200,video,"Video uploaded Successfully")
    )

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!videoId){
        throw new ApiError(400,"Video Id is required");
    }
    const video= await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,"Video does not exists");
    }return res.status(201).json(
        new ApiResponse(200,video,"Video found successfully")
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const oldVideo=await Video.findById(videoId);
    if(req.user._id!=oldVideo.owner){
        throw new ApiError(401,"Only video owners can update video details")
    }
    if(!oldVideo){
        throw new ApiError(400,"Video not found")
    }
    const {newTitle,newDescription}=req.body;
    if(!newTitle||!newDescription){
        throw new ApiError(400,"All fields are required")
    }
    const newThumbnail=req.file?.path;
    if(!newThumbnail){
        throw new ApiError(400,"Image Could not be found")
    }
    const newImage=await uploadCloudinary(newThumbnail);
    if(!newImage){
        throw new ApiError(500,"File could not be uploaded to cloudinary")
    }
    const deleteRes=await deleteCloudinary(oldVideo.thumbnail);
    if(!deleteRes){
        throw new ApiError(500,"Old thumbnail cannot be deleted")
    }
    const newVideo= await Video.findByIdAndUpdate(videoId,{
            $set:{
                title:newTitle,
                description:newDescription,
                thumbnail:newImage.url
            }
        },{returnOriginal:true}
        )
        if(!newVideo){
            throw new ApiError(500,"Video could not be found")
        }

    return res
        .status(201)
        .json(new ApiResponse(200,newVideo,"All details updated successfully"))


    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!videoId){
        throw new ApiError(404,"Please provide videoId")
    }
    const user=req.user;
    const video=await Video.findById(videoId)
    console.log(user)
    if(video.owner!=user){
        throw new ApiError(403,"Not Authorized to make changes")
    }
    const deletedVideo=await Video.findByIdAndDelete(videoId)
    if(!deletedVideo){
        throw new ApiError(500,"Couldn't find the video")
    }return res.status(201)
    .json(new ApiResponse(200,deletedVideo,"Deleted Video Successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!videoId){
        throw new ApiError(404,"Please provide videoId")
    }
    const user=req.user?._id;
    const video=await Video.findById(videoId)
    if(video.owner!=user){
        throw new ApiError(403,"Not Authorized to make changes")
    }
    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { $bit: { isPublished: { xor: 1 } } },
        { new: true }
    );
    if(!updatedVideo){
        throw new ApiError(500,"Couldn't find the video")
    }return res.status(201)
    .json(new ApiResponse(200,updatedVideo,"Published status toggled successfully"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}