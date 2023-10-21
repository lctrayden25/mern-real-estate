import React, { useState, useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
	updateUserStart,
	updateUserFailure,
	updateUserSuccess,
	deleteUserStart,
	deleteUserFailure,
	deleteUserSuccess,
	signOutFailure,
	signOutSuccess,
	signOutStart,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { app } from "../firebase";
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from "firebase/storage";

const Profile = () => {
	const fileRef = useRef(null);
	const { currentUser, loading, error } = useSelector((state) => state.user);
	const [file, setFile] = useState(undefined);
	const [fileUploadError, setFileUploadError] = useState(false);
	const [filePercentage, setFilePercentage] = useState(0);
	const [formData, setFormData] = useState({});
	const [updateSuccess, setUpdateSuccess] = useState(false);
	const [showListingError, setShowListingError] = useState(false);
	const [userListings, setUserListings] = useState([]);
	const dispatch = useDispatch();

	const handleFileUpload = useCallback(
		(file) => {
			//handle image upload to firebase
			const storage = getStorage(app);
			const fileName = new Date().getTime() + file?.name;
			const storageRef = ref(storage, fileName);
			const uploadTask = uploadBytesResumable(storageRef, file);

			uploadTask.on(
				"state_changed",
				(snapShot) => {
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

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	const handleDeleteUser = useCallback(async () => {
		try {
			dispatch(deleteUserStart());
			const res = await fetch(`/api/user/delete/${currentUser?._id}`, {
				method: "Delete",
			});
			const data = await res?.json();
			if (data?.success === false) {
				dispatch(deleteUserFailure(data?.message));
				return;
			}
			dispatch(deleteUserSuccess(data));
		} catch (error) {
			dispatch(deleteUserFailure(error.message));
		}
	}, [currentUser?._id, dispatch]);

	const handleSignOut = useCallback(async () => {
		try {
			dispatch(signOutStart());
			const res = await fetch("/api/auth/signout", {
				method: "GET",
			});
			const data = await res.json();
			if (data.success === false) {
				dispatch(signOutFailure(data?.message));
			}
			dispatch(signOutSuccess(data));
		} catch (error) {
			dispatch(signOutFailure(error?.message));
		}
	}, [dispatch]);

	const handleSubmit = useCallback(
		async (e) => {
			e.preventDefault();
			try {
				dispatch(updateUserStart());
				const res = await fetch(`/api/user/update/${currentUser?._id}`, {
					method: "POST",
					headers: {
						"Content-type": "application/json",
					},
					body: JSON.stringify(formData),
				});

				const data = await res.json();
				if (data?.success === false) {
					dispatch(updateUserFailure(data.message));
					return;
				}
				setUpdateSuccess(true);
				dispatch(updateUserSuccess(data));
			} catch (error) {
				dispatch(updateUserFailure(error));
			}
		},
		[currentUser?._id, dispatch, formData]
	);

	const handleShowListing = useCallback(async () => {
		try {
			setShowListingError(false);
			const res = await fetch(`/api/user/listings/${currentUser?._id}`, {
				method: "GET",
				headers: {
					"Content-type": "application/json",
				},
			});
			const data = await res?.json();
			if (data?.success === false) {
				setShowListingError(true);
				return;
			}

			setUserListings(data);
		} catch (error) {
			console.log(error);
			setShowListingError(true);
		}
	}, [currentUser?._id]);

	const handleDeleteListing = useCallback(async (listingId) => {
		try {
			const res = await fetch(`/api/listing/delete/${listingId}`, {
				method: "DELETE",
			});
			const data = await res?.json();
			if (data.success === false) {
				console.log(data?.message);
				return;
			}
			setUserListings((prev) =>
				prev.filter((listing) => listing?._id !== listingId)
			);
		} catch (error) {
			console.log(error);
		}
	}, []);

	useEffect(() => {
		console.log(userListings);
		if (file) {
			handleFileUpload(file);
		}
	}, [file, handleFileUpload, userListings]);

	return (
		<div className="p-3 max-w-lg mx-auto">
			<h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
			<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
					defaultValue={currentUser?.username}
					onChange={handleChange}
				/>
				<input
					type="email"
					placeholder="email"
					className="border p-3 rounded-lg"
					id="email"
					defaultValue={currentUser?.email}
					onChange={handleChange}
				/>
				<input
					type="password"
					placeholder="password"
					className="border p-3 rounded-lg"
					id="password"
					onChange={handleChange}
				/>
				<button
					disabled={loading}
					className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-80 disabled:opacity-80"
				>
					{loading ? "Loading..." : "Update"}
				</button>
				<Link
					to="/create-listing"
					className="bg-green-500 text-center text-white p-3 rounded-lg hover:opacity-80 uppercase"
				>
					Create Listing
				</Link>
			</form>
			<div className="flex justify-between mt-5">
				<span
					className="text-red-700 cursor-pointer"
					onClick={handleDeleteUser}
				>
					Delete account
				</span>
				<span className="text-red-700 cursor-pointer" onClick={handleSignOut}>
					Sign out
				</span>
			</div>
			{error && <p className="text-red-500 mt-5">{error}</p>}
			{updateSuccess && (
				<p className="text-green-700 mt-5">User updated successfully.</p>
			)}
			<button
				onClick={handleShowListing}
				className="w-full text-green-600 text-center my-4 text-lg hover:opacity-80"
			>
				Show Listings
			</button>
			<p className="text-red-700 text-sm text-center mt-5">
				{showListingError ? "Showing listing failed" : ""}
			</p>
			{userListings?.length > 0 && (
				<div className="flex flex-col gap-5">
					<h1 className="text-center text-2xl mt-4">Your listings</h1>
					{userListings?.map((listing) => (
						<div
							key={listing?._id}
							className="border rounded-lg p-3 flex justify-between items-center gap-4"
						>
							<Link to={`/listing/${listing?._id}`}>
								<img
									src={listing?.imageUrls?.[0]}
									alt={listing?.name}
									className="w-16 h-16 object-contain rounded-lg"
								/>
							</Link>
							<Link
								to={`/listing/${listing?._id}`}
								className="text-slate-700 font-semibold flex-1 hover:underline truncate"
							>
								<p>{listing?.name}</p>
							</Link>
							<div className="flex flex-col gap-1 items-end">
								<button
									className="text-red-700 flex-1 hover:opacity-90"
									onClick={() => handleDeleteListing(listing?._id)}
								>
									DELETE
								</button>
								<Link to={`/update-listing/${listing?._id}`} className="text-green-700 flex-1 hover:opacity-90">
									EDIT
								</Link>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default Profile;
