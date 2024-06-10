import Link from "next/link";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-start p-10">
			<Link href="./form">Create New Form</Link>
		</main>
	);
}
