import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-start p-10">
      <Link href="./new-form">Create New Form</Link>
    </main>
  );
}
