import React, { useEffect, useState, useRef, useCallback } from "react";
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";

const CreateListing = () => {
	const [files, setFiles] = useState([]);
	const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
	const [formData, setFormData] = useState({
		imageUrls: [],
	});

	const storeImage = useCallback(async (file) => {
		return new Promise((resolve, reject) => {
			const storage = getStorage(app);
			const fileName = new Date().getTime() + file?.name;
			const storageRef = ref(storage, fileName);
			const uploadTask = uploadBytesResumable(storageRef, file);
            setUploading(true);

			uploadTask.on(
				"state_changed",
				(snapShot) => {
					const progress =
						(snapShot.bytesTransferred / snapShot.totalBytes) * 100;
					console.log(`upload progress: ${progress}`);
				},
				(error) => {
					reject(error);
                    setUploading(false);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						console.log(`File available at ${downloadURL}`);
                        setUploading(false)
						resolve(downloadURL);
					});
				}
			);
		});
	}, []);

	const handleImageSubmit = useCallback(
		async (e) => {
			e.preventDefault();
			if (
				files?.length > 0 &&
				files?.length + formData?.imageUrls?.length < 7
			) {
				const promises = [];

				for (let i = 0; i < files?.length; i++) {
					promises.push(storeImage(files[i]));
				}

				Promise.all(promises)
					.then((urls) => {
						setFormData({
							...formData,
							imageUrls: formData.imageUrls.concat(urls),
						});
						setImageUploadError(false);
					})
					.catch((error) => {
						console.log("Image upload error: ", error);
						setImageUploadError("Image upload failed.");
                        setUploading(false);
					});
			} else {
				setImageUploadError("You can only upload 6 images per listing.");
                setUploading(false);
			}
		},
		[files, formData, storeImage]
	);

    const handleImageRemove = useCallback((index) => {
        setFormData({
            ...formData,
            imageUrls: formData?.imageUrls?.filter((url, i) => i !== index)
        })
    },[formData])

	useEffect(() => {
		console.log(formData);
	}, [files, formData]);

	return (
		<main className="p-3 max-w-4xl mx-auto">
			<h1 className="text-3xl font-semibold text-center my-7">
				Create Listing
			</h1>
			<form className="flex flex-col sm:flex-row gap-4">
				<div className="flex flex-col gap-4 flex-1">
					<input
						type="text"
						placeholder="Name"
						className="border p-3 rounded-lg"
						id="name"
						maxLength="62"
						minLength="10"
						required
					/>
					<textarea
						type="text"
						placeholder="Description"
						className="border p-3 rounded-lg"
						id="description"
						maxLength="62"
						minLength="10"
						required
					/>
					<input
						type="text"
						placeholder="Address"
						className="border p-3 rounded-lg"
						id="address"
						maxLength="62"
						minLength="10"
						required
					/>
					<div className="flex gap-6 flex-wrap">
						<div className="flex gap-2">
							<input type="checkbox" id="sale" className="w-5" />
							<span>Sale</span>
						</div>
						<div className="flex gap-2">
							<input type="checkbox" id="rent" className="w-5" />
							<span>Rent</span>
						</div>
						<div className="flex gap-2">
							<input type="checkbox" id="parking" className="w-5" />
							<span>Parking</span>
						</div>
						<div className="flex gap-2">
							<input type="checkbox" id="furnished" className="w-5" />
							<span>furnished</span>
						</div>
						<div className="flex gap-2">
							<input type="checkbox" id="offer" className="w-5" />
							<span>Offer</span>
						</div>
					</div>
					<div className="flex flex-wrap gap-6">
						<div className="flex items-center gap-2">
							<input
								type="number"
								id="bedrooms"
								min="1"
								max="10"
								required
								className="p-3 border border-gray-300 rounded-lg"
							/>
							<p>Beds</p>
						</div>
						<div className="flex items-center gap-2">
							<input
								type="number"
								id="bathrooms"
								min="1"
								max="10"
								required
								className="p-3 border border-gray-300 rounded-lg"
							/>
							<p>Baths</p>
						</div>
						<div className="flex items-center gap-2">
							<input
								type="number"
								id="regularPrice"
								min="1"
								max="10"
								required
								className="p-3 border border-gray-300 rounded-lg"
							/>
							<div className="flex flex-col items-center">
								<p>Regular Price</p>
								<span>($/month)</span>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<input
								type="number"
								id="discountPrice"
								min="1"
								max="10"
								required
								className="p-3 border border-gray-300 rounded-lg"
							/>
							<div className="flex flex-col items-center">
								<p>Discounted Price</p>
								<span>($/month)</span>
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col flex-1 gap-4">
					<p className="font-semibold">
						Images:
						<span className="font-normal text-gray-600 ml-2">
							The first image will be the cover (max 6)
						</span>
					</p>
					<div className="flex items-center gap-4">
						<input
							type="file"
							className="p-3 border border-gray-300 rounded w-full"
							id="images"
							accept="image/*"
							multiple
							onChange={(e) => setFiles(e.target.files)}
						/>
						<button
							type="button"
                            disabled={uploading}
							onClick={handleImageSubmit}
							className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
						>
							{uploading ? "Uploading..." : "Upload"}
						</button>
					</div>
					{imageUploadError && (
						<p className="text-red-700 text-sm">{imageUploadError}</p>
					)}
					{formData?.imageUrls?.length > 0 &&
						formData?.imageUrls?.map((url, index) => {
							return (
								<div
									className="flex justify-between p-3 border items-center"
									key={index}
								>
									<img
										src={url}
										alt="listing image"
										className="w-20 h-20 object-contain rounded-lg"
									/>
									<button
										type="button"
                                        onClick={() => handleImageRemove(index)}
										className="uppercase p-3 text-red-700 rounded-lg hover:opacity-60"
									>
										Delete
									</button>
								</div>
							);
						})}
					<button className="uppercase p-3 rounded-lg text-white bg-slate-700 hover:opacity-80">
						Create Listing
					</button>
				</div>
			</form>
		</main>
	);
};

export default CreateListing;
