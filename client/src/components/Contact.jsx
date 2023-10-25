import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
	const [landlord, setLandlord] = useState(null);
	const [message, setMessage] = useState("");

	const fetchLandload = useCallback(async () => {
		try {
			const res = await fetch(`/api/user/${listing?.userRef}`, {
				method: "GET",
			});
			const data = await res?.json();
			if (data?.success === false) {
				setLandlord(null);
				console.log(data?.message);
			}

			setLandlord(data);
		} catch (error) {
			console.log(error);
		}
	}, [listing?.userRef]);

	useEffect(() => {
		fetchLandload();
	}, [fetchLandload]);

	return (
		<>
			{landlord && (
				<div className="flex flex-col gap-2 mt-5">
					<p>
						Contact <span className="font-semibold">{landlord?.username}</span>{" "}
						for{" "}
						<span className="font-semibold">
							{listing?.name?.toLowerCase()}
						</span>
					</p>
					<textarea
						placeholder="Enter your message here."
						name="message"
						id="message"
						rows={2}
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						className="w-full border border-gray-500 p-3 mt-2 rounded-lg"
					></textarea>
					<Link
						to={`mailto:${landlord?.email}?subject=Regarding ${listing?.name}&body=${message}`}
						className="bg-slate-700 w-full p-3 text-white uppercase rounded-lg text-center hover:opacity-95"
					>
						Send Message
					</Link>
				</div>
			)}
		</>
	);
};

export default Contact;
