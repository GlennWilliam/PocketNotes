import { api } from "../libs/api";

export async function createNoteApi(payload, token) {
	const response = await api.post("/note/", payload, {
		headers: {
			Authorization: token, // should already include "Bearer " prefix
		},
	});
	return response?.data ?? response;
}

export async function fetchPublicNotesApi({
	page = 1,
	per_page = 12,
	q = "",
	sort = "created_at",
	order = "desc",
} = {}) {
	const params = new URLSearchParams({ page, per_page, q, sort, order });

	const response = await api.get(`/note/?${params.toString()}`);
	const raw = response.data;

	// Support both shapes: either the backend returns { data: [...] } or the array directly
	const items = Array.isArray(raw) ? raw : raw?.data || [];
	const meta = Array.isArray(raw) ? {} : raw?.meta || {};

	return { items, meta };
}
