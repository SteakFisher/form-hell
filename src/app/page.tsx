import SignInWithGoogle from "@/../public/signinwithgoogle.svg";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { signIn } from "@/helpers/auth";

export default function SignIn({
	searchParams,
}: {
	searchParams?: { loginRedirect?: string };
}) {
	let loginRedirectURL = searchParams?.loginRedirect ?? "/form";

	return (
		<form
			action={async () => {
				"use server";
				await signIn("google", {
					redirect: true,
					redirectTo: loginRedirectURL,
				});
			}}
		>
			<div className="flex size-full h-screen flex-col items-center justify-center">
				<Card>
					<CardHeader className="space-y-1 text-center">
						<CardTitle className="text-2xl">Sign in</CardTitle>
						<CardDescription>
							Sign in to your account using your Google account.
						</CardDescription>
					</CardHeader>
					<div className={"flex items-center justify-center pb-4"}>
						<button type={"submit"}>
							<SignInWithGoogle />
						</button>
					</div>
				</Card>
			</div>
		</form>
	);
}
