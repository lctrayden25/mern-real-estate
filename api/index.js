import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js"

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
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter)

// this middle must put under the router, otherwise error
app.use((err, req, res, next) => {
	const statusCode = err?.statusCode || 500;
	const message = err?.message || "Internal Server Error";
	return res.status(statusCode).json({ success: false, statusCode, message });
});

app.listen(3005, () => {
	console.log("server is running on port 3005");
});
