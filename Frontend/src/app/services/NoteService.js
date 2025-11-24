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
	const params = new URLSearchParams({
		page: String(page),
		per_page: String(per_page),
		sort,
		order,
	});

	const response = await api.get(`/note/?${params.toString()}`);
	const raw = response.data;

	// Support both shapes: either the backend returns { data: [...] } or the array directly
	const items = Array.isArray(raw) ? raw : raw?.data || [];
	const meta = Array.isArray(raw) ? {} : raw?.meta || {};

	return { items, meta };
}

export async function fetchMyNotesApi(
	{
		page = 1,
		per_page = 12,
		q = "",
		sort = "created_at",
		order = "desc",
	} = {},
	token
) {
	const params = new URLSearchParams({
		page: String(page),
		per_page: String(per_page),
		sort,
		order,
	});
	if (q) params.set("q", q);

	const response = await api.get(`/note/me?${params.toString()}`, { token });
	const raw = response?.data ?? response;

	const items = Array.isArray(raw) ? raw : raw?.items ?? [];
	const meta = Array.isArray(raw)
		? {}
		: raw?.meta ?? { page: 1, per_page: 12, total: 0, pages: 1 };

	console.log("fetchMyNotesApi parsed items:", items);
	return { items, meta };
}

export async function updateNoteApi(id, payload, token) {
	const response = await api.put(`/note/${id}`, payload, { token });
	return response?.data ?? response;
}
