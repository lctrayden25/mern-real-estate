import React, { useState, useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { app } from "../firebase";
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from "firebase/storage";

const Profile = () => {
	const fileRef = useRef(null);
	const { currentUser } = useSelector((state) => state.user);
	const [file, setFile] = useState(undefined);
	const [fileUploadError, setFileUploadError] = useState(false);
	const [filePercentage, setFilePercentage] = useState(0);
	const [formData, setFormData] = useState({});

	const handleFileUpload = useCallback(
		(file) => {
			const storage = getStorage(app);
			const fileName = new Date().getTime() + file?.name;
			const storageRef = ref(storage, fileName);
			const uploadTask = uploadBytesResumable(storageRef, file);

			uploadTask.on(
				"state_changed",
				(snapShot) => {
					console.log(snapShot.bytesTransferred);
					const progress =
						(snapShot.bytesTransferred / snapShot.totalBytes) * 100;
					setFilePercentage(Math.round(progress));
				},
				(error) => {
					console.log(error);
					setFileUploadError(true);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						console.log(`File available at ${downloadURL}`);
						setFormData({ ...formData, avatar: downloadURL });
						setFile(undefined);
						setFileUploadError(false);
					});
				}
			);
		},
		[formData]
	);

	useEffect(() => {
		if (file) {
			handleFileUpload(file);
		}
	}, [file, handleFileUpload]);

	return (
		<div className="p-3 max-w-lg mx-auto">
			<h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
			<form className="flex flex-col gap-4">
				<input
					type="file"
					ref={fileRef}
					hidden
					accept="image/*"
					onChange={(e) => setFile(e?.target?.files[0])}
				/>
				<img
					src={formData?.avatar || currentUser?.avatar}
					alt="profile"
					className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
					onClick={() => fileRef?.current?.click()}
				/>
				<p className="text-sm self-center">
					{fileUploadError ? (
						<span className="text-red-500">Error Image Upload</span>
					) : filePercentage > 0 && filePercentage < 100 ? (
						<span className="text-green-500">{`Uploading ${filePercentage}%`}</span>
					) : (
						filePercentage === 100 && (
							<span className="text-green-500">
								Image successfully uploaded!
							</span>
						)
					)}
				</p>
				<input
					type="text"
					placeholder="username"
					className="border p-3 rounded-lg"
					id="username"
				/>
				<input
					type="email"
					placeholder="email"
					className="border p-3 rounded-lg"
					id="email"
				/>
				<input
					type="password"
					placeholder="password"
					className="border p-3 rounded-lg"
					id="password"
				/>
				<button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-80 disabled:opacity-80">
					Update
				</button>
			</form>
			<div className="flex justify-between mt-5">
				<span className="text-red-700 cursor-pointer">Delete account</span>
				<span className="text-red-700 cursor-pointer">Sign out</span>
			</div>
		</div>
	);
};

export default Profile;
