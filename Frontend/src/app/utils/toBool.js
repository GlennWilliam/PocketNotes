export const toBool = (value) => {
	if (typeof value === "boolean") {
		return value;
	}
	if (typeof value === "number") {
		return value === 1;
	}
	if (typeof value === "string") {
		const val = value.toLowerCase().trim();
		return val === "true" || val === "1";
	}
	return !!value;
};