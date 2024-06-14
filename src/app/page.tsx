
import { signIn } from "@/helpers/auth";
import Link from "next/link";

export default function SignIn() {
	return (
		<form
			action={async () => {
				"use server";
				await signIn("google", {
					redirect: true,
					redirectTo: "/form",
				});
			}}
		>
			<button type="submit">Signin with Google</button>
		</form>
	);
}
