import { signUp, login, logout, refreshtoken, getMe, putData,addToFavorites, getUserFavorites, removeFromFavorites } from "../../controllers/user.controller.js";
import express from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", verifyJWT, logout);
router.get("/refresh-access-token", refreshtoken);
router.get("/getme", verifyJWT, getMe);
router.put("/update", verifyJWT, putData);
router.post("/add-to-favorites", verifyJWT, addToFavorites);
router.get("/favorites",verifyJWT,getUserFavorites);
router.post("/remove-from-favorites", verifyJWT, removeFromFavorites);


export default router;