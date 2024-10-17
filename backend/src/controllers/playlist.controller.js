import mongoose, {isValidObjectId, Mongoose} from "mongoose"
import {Playlist} from "../models/playlist.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    if(!name||!description){
        throw new ApiError(400,"Playlist name and description both are required");
    }
    const user=req.user._id;
    if(!user){
        throw new ApiError(400,"User detail is missing");
    }
    const playlist=await Playlist.create({
        name:name,
        description:description,
        owner:user
    })
    if(!playlist){
        throw new ApiError(500,"Error in creating playlist");
    }
    return res.status(200)
    .json(new ApiResponse(200,playlist,"Playlist created successfully"));
    //TODO: create playlist
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    if(!userId){
        throw new ApiError(400,"Userid is required");
    }
    const playlists=await Playlist.aggregate([
        {
            $match:{
                owner:new mongoose.Types.ObjectId(userId)
            }
        },{
            $project:{
                name:1,
                description:1,
                video:1,
                createdAt:1,
            }
        }
    ])
    if(!playlists){
        throw new ApiError(404,"No playlists found");
    }
    return res.status(200).json(new ApiResponse(200,playlists,"All playlists fetched successfully"));
    //TODO: get user playlists
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    if(!playlistId){
        throw new ApiError(400,"Playlist id is required");
    }
    const playlist=await Playlist.findById(playlistId);
    if(!playlist){
        throw new ApiError(404,"No playlist found");
    }
    return res.status(200).json(new ApiResponse(200,playlist,"Playlist fetched successfully"));
    //TODO: get playlist by id
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(!playlistId){
        throw new ApiError(400,"Playlist id is required")
    }
    if(!videoId){
        throw new ApiError(400,"Video id is required")
    }
    const play=await Playlist.findById(playlistId);
    if(!play){
        throw new ApiError(400,"Could not find playlist");
    }
    if(play.owner.toString()!==req.user._id.toString()){
        throw new ApiError(403,"Not authorized to make changes")
    }
    if(play.video.includes(videoId)) {
        throw new ApiError(400, "Video already in playlist");
    }
    play.video.push(videoId);
    await play.save();
    return res.status(200).json(new ApiResponse(200,play,"Video added successfully"));
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(!playlistId){
        throw new ApiError(400,"Playlist id is required")
    }
    if(!videoId){
        throw new ApiError(400,"Video id is required")
    }
    const play=await Playlist.findById(playlistId);
    if(!play){
        throw new ApiError(400,"Could not find playlist");
    }
    if(play.owner.toString()!==req.user._id.toString()){
        throw new ApiError(403,"Not authorized to make changes")
    }
    const playlist=await Playlist.findByIdAndUpdate(playlistId,{
        $pull:{
            video:videoId
        }
    },{
        new:true
    })
    if(!playlist){
        throw new ApiError(500,"Some error occured in creating the playlist")
    }
    return res.status(200).json(new ApiResponse(200,playlist,"Video deleted successfully"));
    // TODO: remove video from playlist

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    if(!playlistId){
        throw new ApiError(400,"Playlist id is required");
    }
    const play=await Playlist.findById(playlistId);
    if(!play){
        throw new ApiError(400,"Could not find playlist");
    }
    if(play.owner.toString()!==req.user._id.toString()){
        throw new ApiError(403,"Not authorized to make changes")
    }
    const result=await Playlist.deleteOne({_id:playlistId});
    if(result.deletedCount==0){
        throw new ApiError(500,"Failed to delete playlist");
    }
    return res.status(200).json(new ApiResponse(200,result,"Playlist deleted successfully"));
    // TODO: delete playlist
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    if(!name||!description){
        throw new ApiError(400,"Playlist new name and new description both are required");
    }
    if(!playlistId){
        throw new ApiError(400,"Playlist id is required");
    }
    const play=await Playlist.findById(playlistId);
    if(!play){
        throw new ApiError(400,"Could not find playlist");
    }
    if(play.owner.toString()!==req.user._id.toString()){
        throw new ApiError(403,"Not authorized to make changes")
    }
    play.name=name;
    play.description=description;
    await play.save();
    return res.status(200).json(new ApiResponse(200,play,"Playlist updated successfully"));
    //TODO: update playlist
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
