import Link from "next/link";

export default async function Home() {
	// const result = await db.select().from(fooTable).all();
	// console.log(result);

	return (
		<main className="flex min-h-screen flex-col items-start p-10">
			<Link href="./form">Create New Form</Link>
		</main>
	);
}
