import Link from "next/link";
import { db } from "@/helpers/drizzleTurso";
import { fooTable } from "@/../drizzle/schema";

export default async function Home() {
	// const result = await db.select().from(fooTable).all();
	// console.log(result);

	return (
		<main className="flex min-h-screen flex-col items-start p-10">
			<Link href="./form">Create New Form</Link>
		</main>
	);
}
