import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import userRouter from "./routes/user.route.js";

mongoose
	.connect(process.env.MONGODB)
	.then(() => {
		console.log("DB Connected.");
	})
	.catch((error) => {
		console.log(error);
	});

const app = express();

app.use('/api/user', userRouter)

app.listen(3005, () => {
	console.log("server is running on port 3005");
});
