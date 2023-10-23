import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { FaBed, FaChair, FaMapMarkerAlt, FaParking } from "react-icons/fa";

const Listing = () => {
	SwiperCore.use(Navigation);

	const params = useParams();
	const { listingId } = params;
	const [listing, setListing] = useState({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	const fetchListing = useCallback(async () => {
		setLoading(true);
		try {
			const res = await fetch(`/api/listing/get/${listingId}`, {
				method: "GET",
			});
			const data = await res?.json();
			if (data?.success === false) {
				setError(true);
				setLoading(false);
				console.log(data?.message);
				return;
			}
			setListing(data);
			setLoading(false);
			setError(false);
		} catch (error) {
			console.log(error);
			setError(false);
			setLoading(false);
		}
	}, [listingId]);

	useEffect(() => {
		fetchListing();
	}, [fetchListing]);

	return (
		<main className="pb-7">
			{loading && <p className="text-center my-7 text-2xl">Loading...</p>}
			{error && (
				<p className="text-center my-7 text-2xl">Something went wrong...</p>
			)}
			{listing && !loading && !error && (
				<>
					<Swiper navigation>
						{listing.imageUrls?.map((url) => (
							<SwiperSlide key={url}>
								<div
									className="h-[550px]"
									style={{
										background: `url(${url}) center no-repeat`,
										backgroundSize: "cover",
									}}
								></div>
							</SwiperSlide>
						))}
					</Swiper>
					<div className="max-w-5xl p-3 mx-auto">
						<p className="flex items-center font-semibold text-2xl my-6">
							{listing?.name} -
							{listing?.discountPrice
								? `$ ${listing?.discountPrice}`
								: `$ ${listing?.regularPrice}`}{" "}
							{listing?.type === "rent" && "/ Month"}
						</p>
						<p className="flex items-center my-6 gap-2 text-slate-600 text-sm">
							<FaMapMarkerAlt className="text-green-700" />
							<span>{listing?.address}</span>
						</p>
						<div className="flex items-center gap-4">
							<p className="bg-red-900 w-full max-w-[200px] text-center text-white p-1 rounded-md">
								{listing?.type === "rent" ? "For Rent" : "For Sale"}
							</p>
							{listing?.offer && (
								<p className="bg-green-900 w-full max-w-[200px] text-center text-white p-1 rounded-md">
									${listing?.regularPrice - listing?.discountPrice}
								</p>
							)}
						</div>
						<div className="flex flex-col gap-3 my-5">
							<h2 className="text-xl font-semibold">Description</h2>
							<p>{listing?.description}</p>
						</div>
                        <ul className="text-green-900 font-semibold text-sm flex gap-5 items-center flex-wrap">
                            <li className="flex items-center gap-1 whitespace-nowrap">
                                <FaBed className="text-lg"/>
                                {listing?.bedrooms > 1 ? `${listing?.bedrooms} beds` : `${listing?.bedrooms} bed`}
                            </li>
                            <li className="flex items-center gap-1 whitespace-nowrap">
                                <FaBed className="text-lg"/>
                                {listing?.bathrooms > 1 ? `${listing?.bathrooms} baths` : `${listing?.bathrooms} bath`}
                            </li>
                            <li className="flex items-center gap-1 whitespace-nowrap">
                                <FaParking className="text-lg"/>
                                {listing?.parking > 1 ? `Parking Spot` : `No Parking`}
                            </li>
                            <li className="flex items-center gap-1 whitespace-nowrap">
                                <FaChair className="text-lg"/>
                                {listing?.furnished > 1 ? `Furnished` : `Unfurnished`}
                            </li>
                        </ul>
					</div>
				</>
			)}
		</main>
	);
};

export default Listing;
