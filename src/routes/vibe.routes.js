import { Router } from 'express';
import {
    createVibe,
    deleteVibe,
    getUserVibes,
    updateVibe,
} from "../controllers/vibe.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(createVibe);
router.route("/user/:userId").get(getUserVibes);
router.route("/:vibeId").patch(updateVibe).delete(deleteVibe);

export default router