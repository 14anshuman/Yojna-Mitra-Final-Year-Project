import connectDB from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";
import { startNewsCron } from "./services/newsCron.service.js";
import { startNewsAPIaiCron } from "./services/newsApi.js";



dotenv.config();
// startNewsCron();
// startNewsAPIaiCron();
connectDB()
    .then(() => {
        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log("Server running on port", PORT);
        });
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB", error);
    });