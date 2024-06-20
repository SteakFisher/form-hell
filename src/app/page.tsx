import { signIn } from "@/helpers/auth";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

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
			<div className="flex h-screen w-full items-center justify-center p-4">
				<Card className="w-full max-w-md">
					<CardHeader className="space-y-1 text-center">
						<CardTitle className="text-2xl font-bold">Sign in</CardTitle>
						<CardDescription>
							Sign in to your account using your Google account.
						</CardDescription>
					</CardHeader>
					<div
						className={
							"flex flex-1 items-center justify-center p-4 align-middle"
						}
					>
						<button type={"submit"}>
							<Image
								width={225}
								height={225}
								src={"/signinwithgoogle.svg"}
								alt={"Sign In With Google"}
							/>
						</button>
					</div>
				</Card>
			</div>
		</form>
	);
}
