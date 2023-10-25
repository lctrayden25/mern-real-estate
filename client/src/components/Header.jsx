import React, { useCallback, useEffect, useState } from "react";
import { FaSearch } from "react-icons/Fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
	const { currentUser } = useSelector((state) => state?.user);
	const [searchTerm, setSearchTerm] = useState("");
	const navigate = useNavigate();

	const handleSubmit = useCallback(
		(e) => {
			const urlParams = new URLSearchParams(window.location.search);
			e.preventDefault();
			urlParams.set("searchTerm", searchTerm);
			const searchQuery = urlParams.toString();
			navigate(`/search?${searchQuery}`);
		},
		[navigate, searchTerm]
	);

	const getSearchParams = useCallback(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const searchTermQuery = urlParams.get("searchTerm");
		if (searchTermQuery) {
			setSearchTerm(searchTermQuery);
		}
	}, []);

	useEffect(() => {
		getSearchParams();
	}, [getSearchParams]);

	return (
		<header className="bg-slate-200 shadow-md">
			<div className="flex justify-between items-center max-w-6xl mx-auto p-3">
				<Link to="/">
					<h1 className="fort font-bold text-sm sm:text-xl flex flex-wrap">
						<span className="text-slate-500">Real</span>
						<span className="text-slate-700">Estate</span>
					</h1>
				</Link>
				<form
					onSubmit={handleSubmit}
					className="bg-slate-100 p-3 rounded-lg flex items-center"
				>
					<input
						type="text"
						placeholder="Search"
						className="bg-transparent focus:outline-none w-24 sm:w-64"
						onChange={(e) => setSearchTerm(e.target.value)}
						value={searchTerm}
					/>
					<button type="submit">
						<FaSearch className="text-slate-600" />
					</button>
				</form>
				<ul className="flex gap-4">
					<Link to="/">
						<li className="hidden sm:inline text-slate-700 hover:underline hover:cursor-pointer">
							Home
						</li>
					</Link>
					<Link to="/about">
						<li className="hidden sm:inline text-slate-700 hover:underline hover:cursor-pointer">
							About
						</li>
					</Link>

					<Link to="/profile">
						{currentUser ? (
							<img
								className="rounded-full h-7 w-7 object-cover"
								src={currentUser?.avatar}
								alt={"profile"}
							/>
						) : (
							<li className="text-slate-700 hover:underline hover:cursor-pointer">
								Sign In
							</li>
						)}
					</Link>
				</ul>
			</div>
		</header>
	);
};

export default Header;
