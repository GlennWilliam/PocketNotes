const stripTrailing = (s = "") => s.replace(/\/+$/, "");
const stripLeading = (s = "") => s.replace(/^\/+/, "");

const API_IMG = stripTrailing(process.env.NEXT_PUBLIC_API_IMG || "");

export function imgUrl(path) {
	if (!path) return "";

	// already absolute
	if (/^https?:\/\//i.test(path)) return path;

	const cleaned = path.replace(/^\/+/, "");
	const base = process.env.NEXT_PUBLIC_API_IMG_URL || "";

	return `${base}/api/v1/${cleaned}`;
}