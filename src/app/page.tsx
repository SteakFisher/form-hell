import { signIn } from "@/helpers/auth";

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
