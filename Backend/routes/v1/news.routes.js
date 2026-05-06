import express from "express";
const router = express.Router();
import { getLatestNews,getLatestNewsById } from "../../controllers/news.controller.js";


router.route("/latest").get(getLatestNews);
router.route("/latest/:id").get(getLatestNewsById);

export default router;