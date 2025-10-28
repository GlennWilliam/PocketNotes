"use client";
import React from "react";
import { useState } from "react";
import Image from "next/image";
import { RiSearchLine } from "react-icons/ri";
import Link from "next/link";
import { Button } from "antd";
import AuthModal from "./modal/AuthModal";

const Navbar = () => {
	const [showModalAuth, setShowModalAuth] = useState(false);

	return (
		<header className="bg-white shadow-sm py-1.5">
			<div className="mx-auto flex h-16 w-full items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
				<Link href="/" className="flex items-center">
					<Image src="/assets/logo.png" alt="Logo" width={125} height={125} />
					<h2 className="font-bold text-2xl -ml-3">PocketNotes</h2>
				</Link>

				<div className="relative w-100">
					<div className="flex items-center gap-2 pr-2 py-2 border border-rounded-md border-neutral-300">
						<div className="flex items-center justify-center px-3 border-r border-neutral-300 h-5">
							<RiSearchLine />
						</div>
						<input type="text" className="outline-none" placeholder="Search..." />
					</div>
				</div>

				<div className="flex items-center justify-end md:justify-between">
					<div className="flex items-center gap-4">
						<div className="sm:flex sm:gap-4">
							<Button
								className="block !rounded-md !bg-white !border !border-neutral-600 !px-5 !py-2.5 !text-sm !font-medium !text-neutral transition hover:!bg-(--secondary-color) hover:!text-white"
								onClick={() => setShowModalAuth(true)}
							>
								Login
							</Button>

							<Button
								className="hidden !rounded-md !px-5 !py-2.5 !text-sm !font-medium !text-white !bg-(--secondary-color) transition hover:!bg-(--secondary-dark-color) sm:block"
								onClick={() => setShowModalAuth(true)}
							>
								Register
							</Button>
						</div>

						<button className="block rounded-sm bg-gray-100 p-2.5 text-gray-600 transition hover:text-gray-600/75 md:hidden">
							<span className="sr-only">Toggle menu</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="size-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
			<AuthModal
				open={showModalAuth}
				onClose={() => setShowModalAuth(false)}
			/>
		</header>
	);
};

export default Navbar;
