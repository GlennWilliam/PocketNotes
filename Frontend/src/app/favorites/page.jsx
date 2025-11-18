"use client";
import React, { use, useEffect, useState, useRef } from "react";
import { Empty, Spin } from "antd";
import CardNote from "../components/CardNote";
import { colorForNote } from "../utils/colors";
import { colors } from "../constants/colors";
import { useFavorite } from "../store/UseFavorite";

export default function Favorites() {
	const { items, loading, load } = useFavorite();
	const loadRef = useRef(false);

	useEffect (() => {
		if (loadRef.current) return;
		loadRef.current = true;
		load({ page: 1, per_page: 12 });

	}, [load]);

	if(loading){
		return <div className="py-10 flex justify-center"><Spin /></div>
	}

	if (items.length === 0) {
		return <div className="py-10"><Empty /></div>;
	}	

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{items.map((note, index) => (
				<CardNote key={index} note={note} bg={colorForNote(note, colors)} />
			))}
		</div>
	);
}
