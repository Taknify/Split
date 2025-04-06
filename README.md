# SplitApp

SplitApp is a Next.js application designed to simplify bill splitting and group expense management through virtual card creation. The app uses Stripe's PayFac system to charge individual users and combine those funds into a virtual card for seamless payment to merchants.

## Features

- Create expense groups with friends, family, or colleagues
- Add new bills and split them equally or custom amounts
- Generate virtual cards funded by all participants
- Track expenses and payments in one place
- Secure payment processing via Stripe

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or newer)
- [npm](https://www.npmjs.com/) (v9 or newer)
- A code editor (e.g., VS Code, Sublime Text)
- [Git](https://git-scm.com/)

## Installation

Follow these steps to set up SplitApp on your local machine:

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/split-app.git
   cd split-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory of the project with the following variables:

   ```
   # Stripe API Keys (Test Mode)
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
   STRIPE_SECRET_KEY=sk_test_your_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

   Note: Replace the placeholder values with your actual Stripe API keys. For development purposes, you can use Stripe's test keys.

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000).

## Stripe Integration Setup

To fully utilize the virtual card creation functionality, you'll need to:

1. Create a [Stripe](https://stripe.com) account
2. Enable Stripe Connect in your Stripe Dashboard
3. Set up Stripe Issuing for virtual card creation
4. Configure webhooks for payment status updates

## Project Structure

```
/
├── public/                # Static assets
│   └── images/            # Image files
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── page.tsx       # Homepage
│   │   ├── create-group/  # Group creation page
│   │   ├── create-bill/   # Bill creation page
│   │   └── create-virtual-card/ # Virtual card creation
│   ├── components/        # Reusable UI components
│   │   ├── Header.tsx     # Header component
│   │   ├── Footer.tsx     # Footer component
│   │   ├── Hero.tsx       # Hero section component
│   │   └── ...            # Other components
│   ├── lib/               # Utility functions and API helpers
│   │   ├── stripe/        # Stripe integration code
│   │   └── utils.ts       # General utility functions
│   └── data/              # Sample data for development
└── ...                    # Config files
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Lint the codebase

## Testing Stripe Integration

For testing the Stripe integration locally:

1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
   ```
3. Use Stripe's test card numbers for simulating payments:
   - `4242 4242 4242 4242` - Successful payment
   - `4000 0000 0000 9995` - Declined payment

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Stripe](https://stripe.com/) - Payment processing platform
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
