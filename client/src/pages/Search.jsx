import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

const Search = () => {
	const naviagte = useNavigate();
	const [loading, setLoading] = useState(false);
	const [listings, setListings] = useState([]);
	const [showMore, setShowMore] = useState(false);

	const [sidebarData, setSidebarData] = useState({
		searchTerm: "",
		type: "all",
		parking: false,
		furnished: false,
		offer: false,
		sort: "createdAt",
		order: "desc",
	});

	const handleChange = (e) => {
		if (
			e.target.id === "all" ||
			e.target.id === "rent" ||
			e.target.id === "sale"
		) {
			setSidebarData({ ...sidebarData, type: e.target.id });
		}

		if (e.target.id === "searchTerm") {
			setSidebarData({ ...sidebarData, searchTerm: e.target.value });
		}

		if (
			e.target.id === "parking" ||
			e.target.id === "furnished" ||
			e.target.id === "offer"
		) {
			setSidebarData({
				...sidebarData,
				[e.target.id]:
					e.target.checked || e.target.checked === "true" ? true : false,
			});
		}

		if (e.target.id === "sort_order") {
			const sort = e.target.value?.split("_")?.[0] || "createdAt";
			const order = e.target.value?.split("_")?.[1] || "desc";
			setSidebarData({ ...sidebarData, sort, order });
		}
	};

	const fetchListings = useCallback(async (searchQuery) => {
		try {
			setLoading(true);
			const res = await fetch(`/api/listing/get?${searchQuery}`, {
				method: "GET",
			});
			const data = await res?.json();
			if (data?.success === false) {
				console.log(data.message);
				setLoading(false);
				return;
			}
			if (data?.length >= 9) {
				setShowMore(true);
			} else {
				setShowMore(false);
			}
			setListings(data);
			setLoading(false);
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	}, []);

	const handleSubmit = useCallback(
		async (e) => {
			e.preventDefault();
			const urlParams = new URLSearchParams(location.search);
			urlParams.set("searchTerm", sidebarData?.searchTerm);
			urlParams.set("type", sidebarData?.type);
			urlParams.set("parking", sidebarData?.parking);
			urlParams.set("furnished", sidebarData?.furnished);
			urlParams.set("offer", sidebarData?.offer),
				urlParams.set("sort", sidebarData?.sort);
			urlParams.set("order", sidebarData?.order);

			const searchQuery = urlParams.toString();
			if (searchQuery) {
				naviagte(`/search?${searchQuery}`);
			}

			fetchListings(searchQuery);
		},
		[
			fetchListings,
			naviagte,
			sidebarData?.furnished,
			sidebarData?.offer,
			sidebarData?.order,
			sidebarData?.parking,
			sidebarData?.searchTerm,
			sidebarData?.sort,
			sidebarData?.type,
		]
	);

	const onShowMoreClick = useCallback(async () => {
		const numberOfListing = listings?.length;
		const startIndex = numberOfListing;

		const urlParams = new URLSearchParams(window.location.search);
		urlParams.set("startIndex", startIndex);
		const searchQuery = urlParams.toString();

		const res = await fetch(`/api/listing/get?${searchQuery}`, {
			method: "GET",
		});
		const data = await res?.json();
		if (data?.length < 9) {
			setShowMore(false);
		}

		setListings([...listings, ...data]);
	}, [listings]);

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const searchTermFromUrl = urlParams.get("searchTerm");
		const typeFromUrl = urlParams.get("type");
		const parkingFromUrl = urlParams.get("parking");
		const furnishedFromUrl = urlParams.get("furnished");
		const offerFromUrl = urlParams.get("offer");
		const sortFromUrl = urlParams.get("sort");
		const orderFromUrl = urlParams.get("order");

		if (
			searchTermFromUrl ||
			typeFromUrl ||
			parkingFromUrl ||
			furnishedFromUrl ||
			offerFromUrl ||
			sortFromUrl ||
			orderFromUrl
		) {
			setSidebarData({
				searchTerm: searchTermFromUrl || "",
				type: typeFromUrl || "all",
				parking: parkingFromUrl === "true" ? true : false,
				furnished: furnishedFromUrl === "true" ? true : false,
				offer: offerFromUrl === "true" ? true : false,
				sort: sortFromUrl || "created_at",
				order: orderFromUrl || "desc",
			});
		}

		if (urlParams) {
			fetchListings(urlParams.toString());
		}
	}, [location.search]);

	return (
		<div className="flex flex-col md:flex-row">
			<div className="p-7 border-b-2 sm:border-r-2 md:min-h-screen">
				<form onSubmit={handleSubmit} className="flex flex-col gap-8">
					<div className="flex items-center gap-2">
						<label className="whitespace-nowrap font-semibold">
							Search Terms:
						</label>
						<input
							type="text"
							id="searchTerm"
							placeholder="Search..."
							className="border rounded-lg p-3 w-full"
							value={sidebarData?.searchTerm}
							onChange={handleChange}
						/>
					</div>
					<div className="flex items-center gap-2 flex-wrap">
						<label className="font-semibold">Type:</label>
						<div className="flex gap-2">
							<input
								type="checkbox"
								id="all"
								className="w-5"
								onChange={handleChange}
								checked={sidebarData?.type === "all"}
							/>
							<span>Rent & Sale</span>
						</div>
						<div className="flex gap-2">
							<input
								type="checkbox"
								id="rent"
								className="w-5"
								onChange={handleChange}
								checked={sidebarData?.type === "rent"}
							/>
							<span>Rent</span>
						</div>
						<div className="flex gap-2">
							<input
								type="checkbox"
								id="sale"
								className="w-5"
								onChange={handleChange}
								checked={sidebarData?.type === "sale"}
							/>
							<span>Sale</span>
						</div>
						<div className="flex gap-2">
							<input
								type="checkbox"
								id="offer"
								className="w-5"
								onChange={handleChange}
								checked={sidebarData?.offer}
							/>
							<span>Offer</span>
						</div>
					</div>

					<div className="flex items-center gap-2 flex-wrap">
						<label className="font-semibold">Amenities:</label>
						<div className="flex gap-2">
							<input
								type="checkbox"
								id="parking"
								className="w-5"
								onChange={handleChange}
								checked={sidebarData?.parking}
							/>
							<span>Parking</span>
						</div>
						<div className="flex gap-2">
							<input
								type="checkbox"
								id="furnished"
								className="w-5"
								onChange={handleChange}
								checked={sidebarData?.furnished}
							/>
							<span>Furnished</span>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<label className="font-semibold">Sort:</label>
						<select
							onChange={handleChange}
							defaultValue={"createdAt_desc"}
							id="sort_order"
							className="border rounded-lg p-3 w-full"
						>
							<option value="regularPrice_desc">Price high to low</option>
							<option value="regularPrice_asc">Price low to high</option>
							<option value="createdAt_desc">Latest</option>
							<option value="createdAt_asc">Oldest</option>
						</select>
					</div>
					<button
						type="submit"
						className="bg-slate-700 text-white text-center p-3 w-full hover:opacity-95 rounded-lg uppercase"
					>
						Search
					</button>
				</form>
			</div>
			<div className="w-full">
				<h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5 w-full">
					Listing results:
				</h1>
				<div className="flex p-7 flex-col gap-5">
					<div className=" flex flex-wrap gap-10 w-full">
						{!loading && listings?.length === 0 && (
							<p className="text-xl text-slate-700">No listing found.</p>
						)}
						{loading && (
							<p className="text-xl text-slate-700 text-center w-full">
								Loading...
							</p>
						)}
						{listings &&
							!loading &&
							listings?.map((listing) => (
								<ListingItem key={listing?._id} listing={listing} />
							))}
					</div>
					{showMore && (
						<button
							onClick={onShowMoreClick}
							className="uppercase text-green-700 hover:underline p-3 bg-white text-center rounded-lg shadow-lg max-w-xs"
						>
							Show More
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default Search;
