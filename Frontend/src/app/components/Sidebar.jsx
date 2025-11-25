"use client";
import React, { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
	RiEarthLine,
	RiFolderOpenLine,
	RiUserHeartLine,
	RiUserLine,
} from "react-icons/ri";
import Link from "next/link";
import NoteCreateModal from "./modal/NoteCreateModal";
import { useAuth } from "../store/UseAuth";
import { imgUrl } from "../libs/url";

const Sidebar = () => {
	const pathname = usePathname();

	const navItems = [
		{ name: "Dashboard", href: "/", icon: <RiEarthLine size={20} /> },
		{
			name: "My Notes",
			href: "/my-notes",
			icon: <RiFolderOpenLine size={20} />,
		},
		{
			name: "Favorites",
			href: "/favorites",
			icon: <RiUserHeartLine size={20} />,
		},
		{ name: "Profile", href: "/profile", icon: <RiUserLine size={20} /> },
	];

	const isActive = (href) => pathname === href;

	const [showModalCreate, setShowModalCreate] = useState(false);

	const user = useAuth((s) => s.user);
	const token = useAuth((s) => s.token);
	const isAuthenticated = !!token;

	return (
		<aside className="fixed top-24 left-5 h-[calc(100vh-7.5rem)] w-64 rounded-2xl border border-neutral-300 bg-white p-4 shadow-lg z-40 overflow-y-auto">
			<div className="flex flex-col">
				<div className="flex items-center mb-4">
					{isAuthenticated ? (
						<>
							<div
								className="flex items-center gap-4 cursor-pointer"
								onClick={() => setOpenEdit?.(true)} 
							>
								<img
									src={
										user?.profile_img
											? imgUrl(user.profile_img)
											: "/assets/profile.png"
									}
									className="rounded-full w-16 h-16 object-cover border border-neutral-200"
									alt="profile user"
								/>
								<div className="flex flex-col">
									<h2 className="font-bold text-xl">
										{user?.username || "User"}
									</h2>
									<span className="text-sm break-all text-neutral-600">
										{user?.email || "user@example.com"}
									</span>
								</div>
							</div>

							<hr className="border-neutral-300 my-3" />
						</>
					) : (
						<>
							<div className="flex items-center gap-4">
								<img
									src="/assets/profile.png"
									className="rounded-full w-16 h-16 object-cover border border-neutral-200"
									alt="default profile"
								/>
								<div className="flex flex-col">
									<h2 className="font-bold text-xl">
										Guest
									</h2>
								</div>
							</div>

							<hr className="border-neutral-300 my-3" />
						</>
					)}
				</div>
				<hr className="my-4 border border-neutral-200" />
				<nav className="space-y-2">
					{navItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={`flex items-center gap-3 px-3 py-3 rounded-xl transition font-medium focus-visible:outline-none focus-visible:ring-2 ${
								isActive(item.href)
									? "bg-blue-100 text-blue-700 focus-visible:ring-blue-300"
									: "hover:bg-neutral-100 text-neutral-600"
							}`}
						>
							{item.icon}
							<span>{item.name}</span>
						</Link>
					))}

					<button
						type="button"
						onClick={() => {
							setShowModalCreate(true);
						}}
						className="inline-flex items-center justify-center h-12 w-full rounded-full bg-(--secondary-color) text-white font-medium hover:bg-(--secondary-dark-color) duration-150 cursor-pointer"
					>
						Upload Notes
					</button>
				</nav>
			</div>
			<NoteCreateModal
				open={showModalCreate}
				onClose={() => setShowModalCreate(false)}
				onCreated={() => {
					setShowModalCreate(false);
				}}
			/>
		</aside>
	);
};

export default Sidebar;
