# Resubs - Subscription Tracking Platform

Resubs is a modern, fast, and efficient subscription tracking platform that helps you manage and monitor your various digital subscriptions like Netflix, ChatGPT, YouTube, Spotify, and Apple services. Built with performance in mind, Resubs is hosted on Cloudflare's edge network and utilizes Cloudflare D1 for lightning-fast database operations.

## Features

- Track multiple subscriptions from popular platforms
- Visual calendar interface for easy subscription management
- Analytics dashboard to monitor spending patterns
- Fast and responsive design powered by Next.js and Cloudflare
- Secure authentication using NextAuth.js

## Tech Stack

- Next.js
- React
- TypeScript
- Cloudflare Pages
- Cloudflare D1 Database
- NextAuth.js for authentication
- Tailwind CSS for styling

## Setup Instructions

Follow these steps to set up Resubs on your local machine and deploy it to Cloudflare:

1. Clone the repository:
   ```
   git clone https://github.com/swarajbachu/resubs.git
   cd resubs
   ```

2. Install dependencies:
   ```
   pnpm install
   ```

3. Set up Cloudflare:
   - Run `pnpx wrangler whoami` to ensure you're logged into your Cloudflare account
   - Create a new Cloudflare Pages project
   - Create a new D1 database for your project

4. Update your `wrangler.toml` file with the appropriate values for your Cloudflare project and D1 database.

5. Run database migrations:
   - Local: `pnpm run db:migrate:local`
   - Remote: `pnpm run db:migrate:prod`

6. Set up authentication:
   - Create a Google OAuth client and get the client ID and secret
   - Generate an AUTH_SECRET for NextAuth.js using `openssl`
     ```
     openssl rand -base64 32
     ```
   - Add these secrets to your Cloudflare Pages project:
     - AUTH_SECRET
     - AUTH_GOOGLE_ID
     - AUTH_GOOGLE_SECRET

7. Deploy to Cloudflare Pages:
   ```
   pnpm run deploy
   ```

## Local Development

To run the project locally:

1. Start the development server:
   ```
   pnpm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
