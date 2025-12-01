import React from "react";
import Card from "antd/es/card/Card";
import { Avatar, Tooltip, message } from "antd";
import {
	RiLockLine,
	RiShadowFill,
	RiShareForwardFill,
	RiStackFill,
	RiUser3Line,
} from "react-icons/ri";
import dayjs from "dayjs";
import { imgUrl } from "../libs/url";
import { useFavorite } from "../store/UseFavorite";
import { useRouter } from "next/navigation";
import { useAuth } from "../store/UseAuth";

const FRONTEND_BASE =
	(process.env.NEXT_PUBLIC_FRONTEND_BASE_URL || "").replace(/\/+$/, "") ||
	(typeof window !== "undefined" ? window.location.origin : "");

const CardNote = ({ note, bg, onFavoriteChange, showPrivateIcon = true }) => {
	const { token } = useAuth();
	const router = useRouter();
	const author = note?.user?.username || "Anonymous";
	const slug = note?.slug || "";
	const isPrivateLike =
		note?.status === "private" || note?.status === "protected";
	const cardbg = bg || "var(--secondary-light-color)";
	const favoriteIds = useFavorite((s) => s.favoriteIds);
	const pendingIds = useFavorite((s) => s.pendingIds);
	const toggleFav = useFavorite((s) => s.toggle);
	const keyId = String(note?.id ?? "");
	const fav = favoriteIds.includes(keyId);
	const toggling = pendingIds.has(keyId);
	const redirectToAuth = () => {
		router.push("/?auth=1");
	};
	const handleShare = async (event) => {
		event.stopPropagation();
		if (!token) {
			redirectToAuth();
			return;
		}
		const urlShare = `${FRONTEND_BASE}/note/${encodeURIComponent(slug)}`;
		if (navigator.share) {
			try {
				await navigator.share({
					title: note.title || "PocketNotes",
					url: urlShare,
				});
				return;
			} catch (error) {
				console.error("Error sharing:", error);
			}
		}

		try {
			await navigator.clipboard.writeText(urlShare);
			message.success("Note link copied to clipboard!");
		} catch (error) {
			message.info(urlShare);
		}
	};

	const noteSlug = note?.slug;

	const goDetail = () => {
		if (noteSlug) {
			router.push(`/note/${encodeURIComponent(noteSlug)}`);
		}
	};

	const onKeyDetail = (e) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			goDetail();
		}
	};

	return (
		<div className="relative">
			<Card
				className="note-card border-0 !rounded-2xl cursor-pointer"
				style={{ background: cardbg }}
				styles={{ body: { padding: "16px" } }}
				hoverable
				tabIndex={0}
				onClick={goDetail}
				onKeyDown={onKeyDetail}
				aria-label={
					note?.title || note?.title !== "Untitled"
						? `Open note titled ${note?.title}`
						: "Open untitled note"
				}
			>
				<h3 className="font-semibold mb-2 text-neutral-800 text-xl sm:text-base">
					{note.title}
				</h3>
				<div
					className="text-base text-neutral-800 font-medium break-words"
					dangerouslySetInnerHTML={{ __html: note?.content }}
				/>
				<div className="flex flex-row justify-between gap-3 mt-4">
					<div className="flex items-center gap-2 ">
						{note?.user?.profile_picture ? (
							(
								<Avatar
									src={imgUrl(note.user.profile_picture)}
									alt="User Avatar"
									size={38}
									className="shrink-0"
								/>
							)
						) : (
							<Avatar
								icon={
									<RiUser3Line className="text-neutral-600" />
								}
								size={38}
								className="shrink-0"
							/>
						)}
						<div className="flex flex-col">
							<h4 className="text-base font-semibold truncate">
								{author}
							</h4>
							<p className="text-sm text-neutral-500">
								{note?.created_at
									? dayjs(note.created_at).format(
											"MMM D, YYYY h:mm A"
									  )
									: "Unknown Date"}
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2">
						{showPrivateIcon && isPrivateLike && (
							<Tooltip title={note?.status === "protected" ? "Protected" : "Private"}>
								<span onClick={(e) => e.stopPropagation()}>
									<RiLockLine
										size={20}
										className="text-neutral-600"
									/>
								</span>
							</Tooltip>
						)}

						<Tooltip title={fav ? "Favorited" : "Favorite"}>
							<span
								className={`inline-flex ${
									toggling
										? "opacity-60 pointer-events-none"
										: "opacity-100"
								}`}
								onClick={(e) => {
									e.stopPropagation();
									if (!toggling) toggleFav(note.id);
								}}
								aria-pressed={fav}
								data-id={keyId}
								data-fav={fav ? "1" : "0"}
								key={fav ? `fav-${keyId}` : `unfav-${keyId}`}
							>
								<RiStackFill
									size={25}
									className={`cursor-pointer text-neutral-600 ${
										fav
											? "!text-(--primary-color)"
											: "!text-zinc-300"
									}`}
								/>
							</span>
						</Tooltip>

						<Tooltip title="Share">
							<span onClick={handleShare}>
								<RiShareForwardFill
									size={20}
									className="text-neutral-500 hover:text-neutral-700 cursor-pointer"
								/>
							</span>
						</Tooltip>
					</div>
				</div>
			</Card>
		</div>
	);
};

export default CardNote;
