"use client";
import React, { use, useEffect, useState } from "react";
import { Empty, Spin } from "antd";
import CardNote from "./components/CardNote";
import { useAuth } from "./store/UseAuth";
import { useNote } from "./store/UseNote";

export default function Home() {
	const { items, loading, loadPublicNotes } = useNote();
	const { token } = useAuth();

	useEffect(() => {
		loadPublicNotes({ page: 1, per_page: 12 });
	}, [token, loadPublicNotes]);

	const dummy = [
		{
			title: "Sample Note Title",
			content: "This is a sample content for the note.",
			user: {
				username: "Glenn William",
				profile: "assets/profile.png",
			},
			date: "2025-01-01 10:00PM",
		},
		{
			title: "Sample Note Title 2",
			content: "This is a sample content for the note 2.",
			user: {
				username: "Glenn William",
				profile: "assets/profile.png",
			},
			date: "2025-01-01 10:00PM",
		},
		{
			title: "Sample Note Title 3",
			content: "This is a sample content for the note 3.",
			user: {
				username: "Glenn William",
				profile: "assets/profile.png",
			},
			date: "2025-01-01 10:00PM",
		},
		{
			title: "Sample Note Title 4",
			content: "This is a sample content for the note 4.",
			user: {
				username: "Glenn William",
				profile: "assets/profile.png",
			},
			date: "2025-01-01 10:00PM",
		},

	]

	if(loading){
		return <div className="py-10 flex justify-center"><Spin /></div>
	}
	
	if (items.length === 0) {
		return <div className="py-10"><Empty /></div>;
	}	

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{items.map((note, index) => (
				<CardNote key={index} note={note} />
			))}
		</div>
	);
}
