import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import NetflixLogo from "@/components/logo/netflix";
import Spotify from "@/components/logo/spotify";
import YoutubeLogo from "@/components/logo/youtube";
import AppleLogo from "@/components/logo/apple";
import GameLogo from "@/components/logo/game";

const platformIcons = {
	netflix: NetflixLogo,
	spotify: Spotify,
	youtube: YoutubeLogo,
	apple: AppleLogo,
	games: GameLogo,
};

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type CalendarGridProps = {
	calendarDays: Date[];
	subscriptions: {
		name: string;
		price: number;
		date: Date;
		platform: string;
	}[];
};

export function CalendarGrid({
	calendarDays,
	subscriptions,
}: CalendarGridProps) {
	const getSubscriptionsForDate = (date: Date) => {
		return subscriptions.filter(
			(sub) =>
				sub.date.getDate() === date.getDate() &&
				sub.date.getMonth() === date.getMonth(),
		);
	};

	return (
		<div className="grid grid-cols-7 gap-2">
			{daysOfWeek.map((day) => (
				<div
					key={day}
					className="text-center bg-card/70 rounded-md font-semibold text-sm py-2"
				>
					{day}
				</div>
			))}
			{calendarDays.map((date, index) => {
				const subs = getSubscriptionsForDate(date);
				return (
					<Popover key={index}>
						<PopoverTrigger asChild>
							<div className="aspect-square rounded-lg bg-card p-2 flex flex-col items-center justify-between cursor-pointer">
								<div className="flex flex-wrap gap-1 justify-center">
									{subs.map((sub, subIndex) => {
										const Icon =
											platformIcons[sub.platform as keyof typeof platformIcons];
										return (
											<div key={subIndex}>
												<Icon />
											</div>
										);
									})}
								</div>
								<span className="text-sm font-medium">{date.getDate()}</span>
							</div>
						</PopoverTrigger>
						{subs.length > 0 && (
							<PopoverContent className="w-64">
								<div className="grid gap-2">
									{subs.map((sub, subIndex) => {
										const Icon =
											platformIcons[sub.platform as keyof typeof platformIcons];
										return (
											<div
												key={subIndex}
												className="flex flex-col justify-between items-start w-full"
											>
												<h4 className="text-sm font-medium">{sub.name}</h4>
												<div className="flex flex-row justify-between items-start w-full">
													<div className="flex flex-col gap-2 mt-1">
														<span className="flex flex-row items-center space-x-2">
															<Icon /> <span>{sub.platform}</span>
														</span>
														<span className="text-muted-foreground text-xs">
															every month on {sub.date.getDate()}{" "}
															{nthNumber(sub.date.getDate())}
														</span>
													</div>
													<span className="mt-2">${sub.price.toFixed(2)}</span>
												</div>
											</div>
										);
									})}
								</div>
							</PopoverContent>
						)}
					</Popover>
				);
			})}
		</div>
	);
}

const nthNumber = (number: number) => {
	if (number > 3 && number < 21) return "th";
	switch (number % 10) {
		case 1:
			return "st";
		case 2:
			return "nd";
		case 3:
			return "rd";
		default:
			return "th";
	}
};
