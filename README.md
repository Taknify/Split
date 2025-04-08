# SplitApp - Group Expense Management

A Next.js application for managing group expenses with virtual cards, built with Neo4j as the database backend.

## Project Overview

SplitApp simplifies bill splitting and group expense management through virtual card creation. The app uses Stripe's PayFac system to charge individual users and combine those funds into a virtual card for seamless payment to merchants.

## Installation

### Prerequisites

- Node.js 16.x or higher
- Neo4j Database (local instance or cloud)
- npm or yarn

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# Neo4j Connection
NEO4J_URI=bolt://localhost:7687  # Adjust to your Neo4j instance
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=yourpassword

# NextAuth Secret
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000

# Stripe API Keys (for payment processing)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Other Configuration
NODE_ENV=development
```

### Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up and initialize Neo4j database:
   ```bash
   npm run setup-db  # Create Neo4j database if needed
   npm run seed-db   # Seed test data (2 users, 1 group, and a bill)
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Neo4j Setup

This application requires a Neo4j database. Follow these steps to set it up:

1. **Install Neo4j**:
   - Visit [Neo4j Download Center](https://neo4j.com/download/) and download Neo4j Desktop
   - Or use Docker: `docker run --name neo4j -p7474:7474 -p7687:7687 -e NEO4J_AUTH=neo4j/password neo4j`

2. **Configure Neo4j**:
   - Default credentials: username `neo4j`, password `password` (change in `.env` if different)
   - Make sure the database is running and accessible at `bolt://localhost:7687`

3. **Database Schema**:
   The application uses a graph data model with the following main entities:
   - Users (with authentication information)
   - Groups (collection of users)
   - Expenses (bills to be split)
   - Shares (individual portions of expenses)
   - Virtual Cards (for payment to merchants)

## Features

- **User Authentication**: Register, login, and protected routes
- **Group Management**: Create and join expense groups
- **Expense Tracking**: Record and track expenses within groups
- **Virtual Cards**: Create group virtual cards for shared expenses
- **Expense Splitting**: Automatically split expenses among group members

## Test Credentials

The seed script creates the following test accounts:

- **John (Admin)**:
  - Email: john@example.com
  - Password: password123

- **Jane (Regular User)**:
  - Email: jane@example.com
  - Password: password123

Both users are in a "Dinner Group" with a shared expense of $60.

## Technical Architecture

### Frontend Architecture

- **React**: Frontend UI library
- **Next.js**: React framework with App Router
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe JavaScript

### Directory Structure

```
/
├── public/                # Static assets
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── api/           # API routes
│   │   ├── auth/          # Authentication pages
│   │   └── ...            # Other pages
│   ├── components/        # Reusable UI components
│   ├── lib/               # Utility functions 
│   │   ├── auth/          # Authentication logic
│   │   ├── stripe/        # Stripe integration
│   │   └── ...            # Other utilities
│   ├── providers/         # React context providers
│   └── scripts/           # Database initialization scripts
└── ...                    # Config files
```

## Stripe Integration

The application integrates with Stripe for payment processing and virtual card issuance using:

1. **Stripe Connect**: Platform model for handling multi-party payments
2. **Stripe Treasury**: Financial account to hold pooled funds (optional)
3. **Stripe Issuing**: Virtual card creation and management

### Payment Flow

1. **Bill Creation**: A user creates a bill and invites group members
2. **Authorization**: Each user's payment method is authorized
3. **Fund Pooling**: Funds are collected or authorized
4. **Virtual Card Creation**: A virtual card is created with the pooled amount
5. **Payment to Merchant**: The virtual card is used to pay the merchant

## Development Commands

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run seed-db`: Initialize database with test data

## Code Style Guidelines

- **Imports**: Group imports by type (React, Next.js, third-party, local)
- **Typing**: Use TypeScript interfaces for component props
- **Component Structure**: Use functional components with hooks
- **Error Handling**: Use try/catch blocks for async operations
- **CSS**: Use Tailwind CSS classes for styling

## Resources

- [Stripe API Documentation](https://stripe.com/docs/api)
- [Neo4j Documentation](https://neo4j.com/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)