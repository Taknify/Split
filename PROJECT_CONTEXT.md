# SplitApp Project Context

## Project Overview

SplitApp is a Next.js application designed to simplify bill splitting and group expense management through virtual card creation. The app uses Stripe's PayFac system to charge individual users and combine those funds into a virtual card for seamless payment to merchants.

## Technical Architecture

### Frontend Architecture

The frontend is built with Next.js 14, leveraging the App Router for improved routing and server components. Key technologies include:

- **React**: Frontend UI library
- **Next.js**: React framework for both server and client components
- **Tailwind CSS**: Utility-first CSS framework for styling
- **TypeScript**: Typed JavaScript for improved developer experience

### Directory Structure

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

## Stripe Integration

The core of the application relies on Stripe's API for payment processing and virtual card creation. We use the following Stripe products:

### 1. Stripe Connect (PayFac Model)

Stripe Connect allows us to create a platform where we can process payments on behalf of merchants while managing the distribution of funds among multiple parties. This is crucial for our bill-splitting functionality.

- **Implementation**: We'll use Stripe Connect's "Platform Model" where SplitApp acts as the platform facilitating payments between users and merchants.
- **Key Endpoints**: 
  - `/api/connect/accounts`: Create and manage user payment accounts
  - `/api/connect/charges`: Process payments from each user

### 2. Stripe Issuing

Stripe Issuing allows us to create and manage virtual cards programmatically.

- **Implementation**: We'll use Stripe Issuing to generate virtual cards funded by pooled payments from group members.
- **Key Endpoints**:
  - `/api/issuing/cards`: Create virtual cards
  - `/api/issuing/authorizations`: Monitor card usage
  - `/api/issuing/transactions`: Track transactions

### 3. Payment Flow

The payment flow in SplitApp works as follows:

1. **Bill Creation**: A user creates a bill and invites other users to contribute
2. **Individual Charging**: Each user's payment method is charged for their portion
3. **Fund Pooling**: All funds are collected in the SplitApp platform account
4. **Virtual Card Creation**: A virtual card is created with the pooled funds
5. **Payment to Merchant**: The virtual card is used to pay the merchant

#### Code Example for Individual Charging

```typescript
// Example of charging individual users
async function chargeIndividualUsers(
  expense: Expense,
  participants: Participant[]
) {
  const charges = [];

  for (const participant of participants) {
    const charge = await stripe.charges.create({
      amount: participant.amount,
      currency: 'usd',
      customer: participant.stripeCustomerId,
      description: `Your portion of ${expense.title}`,
      metadata: {
        expenseId: expense.id,
        userId: participant.userId,
        groupId: expense.groupId
      }
    });
    
    charges.push(charge);
  }

  return charges;
}
```

#### Code Example for Virtual Card Creation

```typescript
// Example of creating a virtual card
async function createVirtualCard(
  expense: Expense,
  totalAmount: number
) {
  // Create a card
  const card = await stripe.issuing.cards.create({
    type: 'virtual',
    currency: 'usd',
    status: 'active',
    spending_controls: {
      spending_limits: [
        {
          amount: totalAmount,
          interval: 'per_authorization'
        }
      ],
      categories: {
        // Allow relevant merchant categories
        blocked: []
      }
    },
    shipping: {
      name: `SplitApp - ${expense.title}`,
      service: 'electronic'
    },
    metadata: {
      expenseId: expense.id,
      groupId: expense.groupId
    }
  });

  return card;
}
```

## Data Models

### Core Entities

1. **User**
   - Basic profile information
   - Payment methods
   - Transaction history

2. **Group**
   - Group members
   - Group expenses
   - Group settings

3. **Expense**
   - Amount and description
   - Split type (equal, percentage, custom)
   - Participants
   - Virtual card details

4. **Virtual Card**
   - Card details (number, expiry, CVV)
   - Funding sources
   - Transactions
   - Restrictions (amount, merchant, expiry)

## Implementation Roadmap

1. **Phase 1 (Current)**
   - User interface for group, expense, and virtual card creation
   - Stripe integration for payment processing
   - Virtual card creation and management

2. **Phase 2**
   - OCR receipt scanning and itemization
   - Enhanced expense splitting options
   - Transaction categorization and analytics

3. **Phase 3**
   - Mobile app development
   - Integration with popular accounting software
   - Expanded virtual card features

## Development Practices

- **State Management**: React Context API for global state
- **API Integration**: Axios for API calls to Stripe
- **Testing**: Jest for unit tests, Cypress for end-to-end tests
- **Deployment**: Vercel for frontend hosting

## Stripe API Keys

For development, use the following Stripe API keys:

- **Test Public Key**: `pk_test_example123456789`
- **Test Secret Key**: (To be stored securely in environment variables)

Note: Never commit actual API keys to version control. Use environment variables (.env files) that are excluded from Git via .gitignore.

## Resources

- [Stripe API Documentation](https://stripe.com/docs/api)
- [Stripe Connect](https://stripe.com/docs/connect)
- [Stripe Issuing](https://stripe.com/docs/issuing)
- [Next.js Documentation](https://nextjs.org/docs)
