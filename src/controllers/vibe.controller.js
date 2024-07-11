import mongoose, { isValidObjectId, Mongoose } from "mongoose"
import {Vibe} from "../models/vibe.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createVibe = asyncHandler(async (req, res) => {
    //TODO: create vibe
    const content=req.body.content;
    if(!content){
        throw new ApiError(400,"No content");
    }const user=req.user._id; 
    if(!user){
        throw new ApiError(500,"User detail can't be fetched");
    }const vibe=await Vibe.create({
        content:content,
        owner:user
    })
    return res.status(200)
    .json(new ApiResponse(201,vibe,"Vibe created successfully"));

})

const getUserVibes = asyncHandler(async (req, res) => {
    // TODO: get user vibes
    const {userId}=req.params;
    if(!userId){
        throw new ApiError(400,"User id is required");
    }const vibes=await Vibe.aggregate([
        {
            $match:{
                owner:new mongoose.Types.ObjectId(userId)
            }
        },{
            $project:{
                content:1,
                createdAt:1
            }
        }
    ]);
    return res.status(200).json(new ApiResponse(200,vibes,"All vibes posted fetched successfully"));

})

const updateVibe = asyncHandler(async (req, res) => {
    //TODO: update vibe
    const {vibeId}=req.params;
    if(!vibeId){
        throw new ApiError(400,"Vibe id is required");
    }const newContent=req.body.newContent;
    if(!newContent){
        throw new ApiError(400,"New Content cannot be empty");
    }const newVibe=await Vibe.findByIdAndUpdate(vibeId,{
        content:newContent
    },{new:true});
    if(!newVibe){
        throw new ApiError(500,"Cannot update vibe");
    }return res.status(200).json(new ApiResponse(200,newVibe,"Updated successfully"));


})

const deleteVibe = asyncHandler(async (req, res) => {
    //TODO: delete vibe
    const {vibeId}=req.params;
    if(!vibeId){
        throw new ApiError(400,"Vibe id is required");
    }
    const deletedVibe=await Vibe.findByIdAndDelete(vibeId);
    if(!deletedVibe){
        throw new ApiError(404,"Cannot delete vibe");
    }return res.status(200).json(new ApiResponse(200,deletedVibe,"Deleted successfully"));


})

export {
    createVibe,
    getUserVibes,
    updateVibe,
    deleteVibe
}
