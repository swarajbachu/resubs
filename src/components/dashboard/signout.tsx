import React from "react";
import { Button } from "../ui/button";
import { signOut } from "@/server/auth";

export const runtime = "edge";

export default function SignOut() {
	return (
		<form>
			<Button
				formAction={async () => {
					"use server";
					await signOut();
				}}
			>
				Sign Out
			</Button>
		</form>
	);
}
