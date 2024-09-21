CREATE TABLE `reminders` (
	`id` text PRIMARY KEY NOT NULL,
	`subscription_id` integer NOT NULL,
	`reminder_date` integer NOT NULL,
	`reminder_type` text NOT NULL,
	`is_acknowledged` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT '"2024-09-21T10:33:32.018Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2024-09-21T10:33:32.018Z"' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`price` text NOT NULL,
	`billing_cycle` text NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer,
	`trial_end_date` integer,
	`is_active` integer DEFAULT true NOT NULL,
	`user_id` integer NOT NULL,
	`created_at` integer DEFAULT '"2024-09-21T10:33:32.018Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2024-09-21T10:33:32.018Z"' NOT NULL
);
