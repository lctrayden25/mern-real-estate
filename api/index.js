import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";

mongoose
	.connect(process.env.MONGODB)
	.then(() => {
		console.log("DB Connected.");
	})
	.catch((error) => {
		console.log(error);
	});

const app = express();

app.use(express.json());

app.use('/api/user', userRouter);
app.use("/api/auth", authRouter);

app.listen(3005, () => {
	console.log("server is running on port 3005");
});
