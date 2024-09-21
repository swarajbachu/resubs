import { Button } from "@/components/ui/button";
import { signIn } from "@/server/auth";

export const runtime = "edge";

export default async function LoginPage() {
	return (
		<div className="relative flex h-[100dvh] w-full items-center justify-center">
			<div className="absolute top-0 z-[-2] hidden h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:block" />
			<div className="absolute top-0 z-[-2] h-screen w-screen bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:hidden" />{" "}
			<form>
				<Button
					size="lg"
					formAction={async () => {
						"use server";
						await signIn("google");
					}}
				>
					Sign in with Google
				</Button>
			</form>
		</div>
	);
}
