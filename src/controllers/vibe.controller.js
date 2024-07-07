import mongoose, { isValidObjectId } from "mongoose"
import {Vibe} from "../models/vibe.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createVibe = asyncHandler(async (req, res) => {
    //TODO: create vibe
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
