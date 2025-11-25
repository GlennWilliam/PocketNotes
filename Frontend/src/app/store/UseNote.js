import { create } from "zustand";
import {
	createNoteApi,
	fetchPublicNotesApi,
	fetchMyNotesApi,
	updateNoteApi,
	searchNotesApi
} from "../services/NoteService";
import { useAuth } from "./UseAuth";

export const useNote = create((set, get) => ({
	items: [],
	meta: { page: 1, per_page: 12, total: 0, pages: 1 },
	myItems: [],
	myMeta: { page: 1, per_page: 12, total: 0, pages: 1 },
	loading: false,

	async createNote(payload) {
		const auth = useAuth.getState() || {};
		let token = auth.token || "";

		if (!token) throw new Error("No token found. Please login first!");

		const response = await createNoteApi(payload, `Bearer ${token}`);

		const myItems = get().myItems || [];
		set({ myItems: [response, ...myItems] });

		if (response?.status === "public") {
			const items = get().items || [];
			set({ items: [response, ...items] });
		}

		if (typeof window !== "undefined") {
			window.dispatchEvent(
				new CustomEvent("note:created", { detail: response })
			);
		}

		return response;
	},

	async loadPublicNotes(params = {}) {
		set({ loading: true });
		try {
			const { items, meta } = await fetchPublicNotesApi(params);
			set({ items, meta, loading: false });
		} catch (error) {
			console.error("Failed to load public notes:", error);
			set({ loading: false });
		}
	},

	async loadMine(params = {}) {
		const auth = useAuth.getState() || {};
		let token = auth.token || "";
		if (!token) throw new Error("No token found. Please login first!");
		if (token.startsWith("Bearer ")) token = token.slice(7);
		set({ loading: true });
		try {
			const { items, meta } = await fetchMyNotesApi(params, token);
			set({ myItems: items, myMeta: meta, loading: false });
			return { ok: true };
		} catch (error) {
			set({ loading: false });
			return { ok: false, error: error.message };
		}
	},

	async update(id, payload) {
		const auth = useAuth.getState() || {};
		let token = auth.token || "";
		if (!token) throw new Error("No token found. Please login first!");
		if (token.startsWith("Bearer ")) token = token.slice(7);

		const updated = await updateNoteApi(id, payload, token);
		set({
			myItems: (get().myItems || []).map((n) =>
				n.id === id ? { ...n, ...updated } : n
			),
			items: (get().items || []).map((n) =>
				n.id === id ? { ...n, ...updated } : n
			),
		});
		return updated;
	},

	async searchNotes(query) {
		if (!query.trim()) {
			set({ searchResults: [] });
			return [];
		}

		const auth = useAuth.getState() || {};
		let token = auth.token || "";
		if (!token) throw new Error("No token found. Please login first!");
		if (token.startsWith("Bearer ")) token = token.slice(7);

		set({ searchLoading: true });
		try {
			const items = await searchNotesApi(query, token);
			set({ searchLoading: false, searchResults: items });
			return items;
		} catch (error) {
			set({ searchLoading: false, searchResults: [] });
			return [];
		}
	},
	clearSearch() {
		set({ searchResults: [], error: null });
	},
}));
