import { api } from "../libs/api";
import { toBool } from "../utils/toBool";

export const toggleLikeApi = async (noteId, token) => {
	const response = await api.post(`like/${noteId}`, null, { token });
	const data = response?.json ?? response;
	const message = data?.message?.toLowerCase?.() ?? "";
	return { liked: message.includes("added") };
};

export const fetchFavoriteNotesApi = async (
	{ page = 1, perPage = 200 } = {},
	token
) => {
	const params = new URLSearchParams({
		page: String(page),
		per_page: String(perPage),
	});
	const response = await api.get(`like/?${params.toString()}`, { token });

	const raw = response?.data ?? response;

	const items = Array.isArray(raw)
		? raw 
		: raw?.data ?? raw?.items ?? [];

	const meta = raw?.meta ?? {
		page,
		per_page: perPage,
		total: items.length,
		pages: 1,
	};

	return { items, meta };
};

export const fetchMyFavoriteIds = async (token) => {
	const { items } = await fetchFavoriteNotesApi(
		{ page: 1, perPage: 1000 },
		token
	);
	return new Set(items.map((n) => String(n.id)));
};
