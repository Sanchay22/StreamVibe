import mongoose, {Mongoose, isValidObjectId} from "mongoose"
import {Like} from "../models/like.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"

import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    
    // check karlenge ki pehle se liked to nahi hai
    // uske liye hum like mein document search karenge with given video id and userid if found it means hame unlike karna hai
    // unlike karne ke liye kuch nahi bas us document ko delete kardo to step 2 se jo document niklega agar hame mil jaata hai to kuch nahi bas use delete karo and return aur in case kuch new na mile it means like karna hai to fir hum
    // new like object ban jayega with user id and video id and just retun it
    if(!videoId){
        throw new ApiError(400,"Video id is missing");
    }
    const oldLikestaus=await Like.findOne({video:videoId,likedBy:req.user._id});
    if(oldLikestaus){
        const newstatus=await Like.deleteOne({video:videoId,likedBy:req.user._id})
        return res.status(201).json(new ApiResponse(200,newstatus,"Unliked successfully"))
    }const newLike= await Like.create({video:videoId,likedBy:req.user._id});
    if(!newLike){
        throw new ApiError(500,"Some error occured in creating like");
    }return res.status(201).json(new ApiResponse(200,newLike,"Liked successfully"))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if(!commentId){
        throw new ApiError(400,"Comment id is missing");
    }
    const oldLikestaus=await Like.findOne({comment:commentId,likedBy:req.user._id});
    if(oldLikestaus){
        const newstatus=await Like.deleteOne({comment:commentId,likedBy:req.user._id})
        return res.status(201).json(new ApiResponse(200,newstatus,"Unliked successfully"))
    }const newLike= await Like.create({comment:commentId,likedBy:req.user._id});
    if(!newLike){
        throw new ApiError(500,"Some error occured in creating like");
    }return res.status(201).json(new ApiResponse(200,newLike,"Liked successfully"))
})


const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    try {
        const likedVideos=await Like.aggregate([
            {
                $match:{
                    likedBy:req.user._id
                }
            },
            {
                $lookup:{
                    from:"videos",
                    localField:"video",
                    foreignField:"_id",
                    as:"video"
                }
            },
            {
                $unwind:"$video"
            },
            {
                $match:{
                    "video.isPublished":true
                }
            }
        ]);
        if(likedVideos.length){
            return res.status(201).json(new ApiResponse(200,likedVideos,"All liked videos fetched successfully"));
        }return res.status(404).json(new ApiResponse(404,null,"no liked video exist"));
        
    } catch (error) {
        throw new ApiError(500,"here is error",error);
    }

})

export {
    toggleCommentLike,
    toggleVideoLike,
    getLikedVideos
}