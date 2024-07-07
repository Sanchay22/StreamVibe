import mongoose, { isValidObjectId } from "mongoose"
import {Vibe} from "../models/vibe.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createVibe = asyncHandler(async (req, res) => {
    //TODO: create vibe
    const post=req.body.post;
    if(!content){
        throw new ApiError(400,"No content");
    }const user=req.user._id; 
    if(!user){
        throw new ApiError(500,"User detail can't be fetched");
    }const vibe=await Vibe.create({
        content:post,
        owner:user
    })
    return res.status(200)
    .json(new ApiResponse(201,vibe,"Vibe created successfully"));

})

const getUserVibes = asyncHandler(async (req, res) => {
    // TODO: get user vibes
    
})

const updateVibe = asyncHandler(async (req, res) => {
    //TODO: update vibe
})

const deleteVibe = asyncHandler(async (req, res) => {
    //TODO: delete vibe
})

export {
    createVibe,
    getUserVibes,
    updateVibe,
    deleteVibe
}
