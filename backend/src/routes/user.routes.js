import { Router } from "express";
import {
    changeCurrentPassword,
    getCurrentUser,
    getUserChannelProfile,
    getWatchHistory, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    registerUser, 
    updateAccountDetails, 
    updateUserAvatar, 
    updateUserCover ,
    validateTokenRouter
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

// Existing routes
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
);
router.route("/login").post(loginUser);

// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/change-user-details").patch(verifyJWT, updateAccountDetails);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/change-avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router.route("/change-cover").patch(verifyJWT, upload.single("coverImage"), updateUserCover);
router.route("/c/:username").get(verifyJWT, getUserChannelProfile);
router.route("/history").get(verifyJWT, getWatchHistory);

// Add the new /validate-token route
router.route("/validate-token").get(verifyJWT,validateTokenRouter);

export default router;
