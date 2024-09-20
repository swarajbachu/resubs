import { SubscriptionTracker } from "@/components/subscription-tracker";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center ">
      <SubscriptionTracker />
    </main>
  );
}
