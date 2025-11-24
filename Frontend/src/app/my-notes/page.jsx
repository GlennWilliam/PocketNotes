"use client";
import React, { use, useEffect, useState, useRef } from "react";
import { Button, Empty, Spin } from "antd";
import CardNote from "../components/CardNote";
import { colorForNote } from "../utils/colors";
import { colors } from "../constants/colors";
import { useFavorite } from "../store/UseFavorite";
import { useAuth } from "../store/UseAuth";
import { useNote } from "../store/UseNote";
import NoteEditModal from "../components/modal/NoteEditModal";

export default function Favorites() {
	const { checkSession, token } = useAuth();
	const { myItems, loadMine, loading } = useNote();
	const loadFavIds = useFavorite((s) => s.loadIds);
	const loadRef = useRef(false);

	const [openEditNote, setOpenEditNote] = useState(false);
	const [selectedNote, setSelectedNote] = useState(null);

	useEffect(() => {
		if (loadRef.current) return;
		loadRef.current = true;
		checkSession();
		loadMine({ page: 1, per_page: 12 });
	}, [loadMine]);

	useEffect(() => {
		if (token) {
			loadFavIds().catch(() => {});
		}
	}, [token]);

	if (loading) {
		return (
			<div className="py-10 flex justify-center">
				<Spin />
			</div>
		);
	}

	if (myItems.length === 0) {
		return (
			<div className="py-10">
				<Empty />
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{myItems.map((note, index) => (
				<div key={index} className="relative group">
					<CardNote note={note} bg={colorForNote(note, colors)} />
					<Button
						size="small"
						className="!rounded-full px-3 h-7 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
						onClick={() => {
							setSelectedNote(note);
							setOpenEditNote(true);
						}}
					>
						Edit
					</Button>
				</div>
			))}
			{
				selectedNote && (
					<NoteEditModal
						note={selectedNote}
						open={openEditNote}
						onClose={() => {
							setOpenEditNote(false);
							setSelectedNote(null);
						}}
					/>
				)
			}
		</div>
	);
}
