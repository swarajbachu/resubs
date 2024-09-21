import ExpenseBreakdown from "@/components/dashboard/expense-breakdown";
import { SubscriptionTracker } from "@/components/dashboard/subscription-tracker";
import Image from "next/image";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center ">
			<ExpenseBreakdown />
			<SubscriptionTracker />
		</main>
	);
}
