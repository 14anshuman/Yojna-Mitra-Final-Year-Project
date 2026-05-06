import express from "express";
import { getPersonalizedRecommendations,recommendationModelController } from "../../controllers/recommendation.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";


const router = express.Router();

router.get("/personalized", verifyJWT, getPersonalizedRecommendations);
router.get("/general", verifyJWT, recommendationModelController);

export default router;
