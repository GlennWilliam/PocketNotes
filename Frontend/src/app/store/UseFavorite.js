import { create } from "zustand";
import {
	fetchMyFavoriteIds,
	fetchFavoriteNotesApi,
	toggleLikeApi,
} from "../services/FavoriteService";
import { useAuth } from "./UseAuth";

const toKey = (id) => String(id ?? "");

export const useFavorite = create((set, get) => ({
	items: [],
	meta: { page: 1, per_page: 200, total: 0, pages: 1 },
	favoriteIds: [],
	pendingIds: new Set(),
	loading: false,

	has(noteId) {
		return get().favoriteIds.includes(toKey(noteId));
	},

	isPending(noteId) {
		return get().pendingIds.has(toKey(noteId));
	},

	async load(params = {}) {
		set({ loading: true });
		try {
			const auth = useAuth.getState() || {};
			let token = auth.token;
			if (!token) throw new Error("No token, please login!");
			if (token.startsWith("Bearer ")) {
				token = token.slice(7);
			}
			const { items, meta } = await fetchFavoriteNotesApi(params, token);
			const ids = items.map((n) => toKey(n.id));
			set({ items, meta, favoriteIds: ids, loading: false });
			return { ok: true };
		} catch (error) {
			set({ loading: false });
			return { ok: false, error: error.message };
		}
	},

	async loadIds() {
		try {
			const auth = useAuth.getState() || {};
			let token = auth.token;
			if (!token) throw new Error("No token, please login!");
			if (token.startsWith("Bearer ")) {
				token = token.slice(7);
			}
			const idsSet = await fetchMyFavoriteIds(token);
			const normalized = Array.from(idsSet, (id) => toKey(id));
			set({ favoriteIds: normalized });
		} catch (error) {
			return { ok: false, error: error.message };
		}
	},

	async toggle(noteId) {
		const auth = useAuth.getState() || {};
		let token = auth.token;
		if (!token) throw new Error("No token, please login!");
		if (token.startsWith("Bearer ")) token = token.slice(7);

		const key = toKey(noteId);
		const { favoriteIds, pendingIds } = get();
		const willLike = !favoriteIds.includes(key);

		// optimistic update
		const nextIds = willLike
			? [...favoriteIds, key]
			: favoriteIds.filter((id) => id !== key);

		const nextPending = new Set(pendingIds);
		nextPending.add(key);
		set({ favoriteIds: nextIds, pendingIds: nextPending });

		try {
			// perform API call
			await toggleLikeApi(noteId, token);
			return willLike;
		} catch (error) {
			// revert if API failed
			const revert = new Set(favoriteIds);
			willLike ? revert.delete(key) : revert.add(key);
			set({ favoriteIds: revert });
			throw error;
		} finally {
			// clear pending flag
			const p = new Set(get().pendingIds);
			p.delete(key);
			set({ pendingIds: p });
		}
	},
}));
