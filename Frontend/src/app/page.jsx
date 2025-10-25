import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import CardNote from "./components/CardNote";

export default function Home() {
	const dummy = [
		{
			title: "Sample Note Title",
			content: "This is a sample content for the note.",
			user: {
				username: "Glenn William",
				profile: "assets/profile.png",
			},
			date: "2025-01-01 10:00PM",
		},
		{
			title: "Sample Note Title 2",
			content: "This is a sample content for the note 2.",
			user: {
				username: "Glenn William",
				profile: "assets/profile.png",
			},
			date: "2025-01-01 10:00PM",
		},
		{
			title: "Sample Note Title 3",
			content: "This is a sample content for the note 3.",
			user: {
				username: "Glenn William",
				profile: "assets/profile.png",
			},
			date: "2025-01-01 10:00PM",
		},
		{
			title: "Sample Note Title 4",
			content: "This is a sample content for the note 4.",
			user: {
				username: "Glenn William",
				profile: "assets/profile.png",
			},
			date: "2025-01-01 10:00PM",
		},

	]

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{dummy.map((note, index) => (
				<CardNote key={index} note={note} />
			))}
		</div>
	);
}
