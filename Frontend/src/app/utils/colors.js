export function colorForNote(note, palette) {
	// Use slug, id, or title as a seed
	const key = note?.id || note?.slug || note?.title || "";

	// Generate a simple hash from the string
	let hash = 0;
	for (let i = 0; i < key.length; i++) {
		hash = key.charCodeAt(i) + ((hash << 5) - hash);
	}

	const index = Math.abs(hash) % palette.length;

	return palette[index];
}
