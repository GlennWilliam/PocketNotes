import React, { useMemo, useEffect, use } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

const RichTextEditor = ( {value, onChange, placeholder} ) => {
	const modules = useMemo(
		() => ({
			toolbar: [
				[{ header: [1, 2, 3, false] }],
				[
					"bold",
					"italic",
					"underline",
					"strike",
					"blockquote",
					"code-block",
				],
				[{ list: "ordered" }, { list: "bullet" }],
				[{ align: [] }],
				[{ color: [] }, { background: [] }],
				["clean"],
				["link", "image"],
			],
		}),
		[]
	);

	const formats = useMemo(
		() => [
			"header",
			"bold",
			"italic",
			"underline",
			"strike",
			"blockquote",
			"code-block",
			"list",
			"bullet",
			"align",
			"color",
			"background",
			"link",
			"image",
		],
		[]
	);

	const { quill, quillRef } = useQuill({ theme: "snow", modules, formats, placeholder});

	useEffect(() => {
		if (!quill) return;
		const handler = () => onChange(quill.root.innerHTML);
		quill.on("text-change", handler);
		return () => quill.off("text-change", handler);
	}, [quill, onChange]);

	useEffect(() => {
		if (!quill) return;
		const current = quill.root.innerHTML;
		if ((value || "") !== current) {
			quill.root.innerHTML = value || "";
		}
	}, [quill, value]);

	return <div className="rounded-xl overflow-hidden border border-neutral-300">
		<div ref={quillRef} style={{ minHeight: 180 }} />
	</div>;
};

export default RichTextEditor;
