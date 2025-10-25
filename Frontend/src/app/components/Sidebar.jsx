"use client";
import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
	RiEarthLine,
	RiFolderOpenLine,
	RiUserHeartLine,
	RiUserLine,
} from "react-icons/ri";
import Link from "next/link";

const Sidebar = () => {
	const pathname = usePathname();

	const navItems = [
		{ name: "Dashboard", href: "/", icon: <RiEarthLine size={20} /> },
		{ name: "My Notes", href: "/my-note", icon: <RiFolderOpenLine size={20} /> },
		{ name: "Favorite", href: "/favorite", icon: <RiUserHeartLine size={20} /> },
		{ name: "Profile", href: "/profile", icon: <RiUserLine size={20} /> },
	];

	const isActive = (href) => pathname === href;

	return (
		<aside className="fixed top-24 left-5 h-[calc(100vh-7.5rem)] w-64 rounded-2xl border border-neutral-300 bg-white p-4 shadow-lg z-40 overflow-y-auto">
			<div className="flex items-center mb-4">
				<Image
					src="/assets/profile.png"
					alt="Profile"
					width={50}
					height={50}
					className="rounded-full object-cover mr-3"
				/>
				<div className="overflow-hidden">
					<h2 className="text-base font-semibold text-neutral-800 truncate">
						Glenn William
					</h2>
					<p className="text-sm text-neutral-500 truncate">
						glennwilliam@gmail.com
					</p>
				</div>
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
					type='button'
					onClick={() => {
						// Handle logout logic here
					}}
					className="inline-flex items-center justify-center h-12 w-full rounded-full bg-(--secondary-color) text-white font-medium hover:bg-(--secondary-dark-color) duration-150 cursor-pointer">
						Upload Notes
				</button>
			</nav>
		</aside>
	);
};

export default Sidebar;
