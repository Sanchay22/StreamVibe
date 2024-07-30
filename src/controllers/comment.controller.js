import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import {Comment} from "../models/comment.models.js"
import { Playlist } from "../models/playlist.models.js";
const getVideoComments = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    if(!videoId){
        throw new ApiError(400,"Video id is missing")
    }
    const comments=await Comment.aggregate([
        {
            $match:{
                videoId:new mongoose.Types.ObjectId(videoId)
            }  
        },
        {
            $skip:(page-1)*limit
        },
        {
            $limit:limit
        }
    ])
    if(!comments){
        throw new ApiError(400,"Comments could not be fetched")
    }
    return res.status(201).json(new ApiResponse(200,comments,"Comments fetched successfully"));
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    //get data from request
    // check comment is not empty
    // fetch userid for saving user from req.user
    // check if userid is fetched succcessfully
    // fetch the video id from req.params
    // create a comment object and save it
    const {content}=req.body;
    if(!content){
        throw new ApiError(400,"Comment content is missing");
    }
    const {videoId}=req.params;
    if(!videoId){
        throw new ApiError(400,"Video is missing");
    }
    const userId=req.user._id;
    if(!userId){
        throw new ApiError(400,"User id is missing")
    }
    const comment=await Comment.create({
        content:content,
        video:videoId,
        owner:userId
    })
    if(!comment){
        throw new ApiError(500,"Comment cannot be created")
    }
    return res.status(201).json(new ApiResponse(200,comment,"Comment is created successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId}=req.params;
    if(!commentId){
        throw new ApiError(400,"Comment ID is missing")
    }
    const {newContent}=req.body;
    if(!newContent){
        throw new ApiError(400,"Content is missing")
    }
    const userId=req.user._id;
    if(!userId){
        throw new ApiError(400,"User id is missing")
    }
    const comment=await Comment.findById(commentId);    
    if(!comment){
        throw new ApiError(400,"Comment not exist")
    }
    if(comment.owner.toString()!==userId.toString()){
        throw new ApiError(403,"Not authorized to make changes")
    }
    comment.content=newContent;
    await comment.save();
    return res.status(201).json(new ApiResponse(200,"Comment updated successfully"))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId}=req.params;
    if(!commentId){
        throw new ApiError(400,"Comment ID is missing")
    }
    const userId=req.user._id;
    if(!userId){
        throw new ApiError(400,"User id is missing")
    }
    const comment=await Comment.findById(commentId);    
    if(!comment){
        throw new ApiError(400,"Comment not exist")
    }
    if(comment.owner.toString()!==userId.toString()){
        throw new ApiError(403,"Not authorized to make changes")
    }
    const result=await Comment.deleteOne({_id:commentId});
    return res.status(201).json(new ApiResponse(200,result,"Comment updated successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }