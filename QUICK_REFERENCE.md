# SplitApp - Quick Reference

## Project Overview
SplitApp is a bill-splitting app that uses Stripe's PayFac system to charge individual users and combine those funds into a virtual card for seamless payment to merchants.

## Key Components

### Frontend
- Next.js 14 with App Router and TypeScript
- Tailwind CSS for styling
- React Context for state management

### API Integrations

#### Stripe Connect (PayFac)
```
/api/connect/accounts   # Create/manage user payment accounts
/api/connect/charges    # Process individual charges from users
/api/connect/transfers  # Move funds between accounts
```

#### Stripe Issuing (Virtual Cards)
```
/api/issuing/cards          # Create and manage virtual cards
/api/issuing/authorizations # Monitor card usage
/api/issuing/transactions   # Track card transactions
```

#### Stripe Payment Intents
```
/api/payment/intents    # Create payment intents for secure charging
/api/payment/methods    # Manage user payment methods
/api/payment/setup      # Setup future payments
```

### Main Backend Processes

1. **User Authentication**
   - `/api/auth/*` - NextAuth.js endpoints

2. **Group Management**
   - `/api/groups` - CRUD operations for expense groups
   - `/api/groups/members` - Add/remove group members

3. **Expense Tracking**
   - `/api/expenses` - Create and manage expenses
   - `/api/expenses/split` - Calculate split amounts

4. **Virtual Card Lifecycle**
   - `/api/cards` - Create virtual cards
   - `/api/cards/fund` - Fund from multiple sources 
   - `/api/cards/status` - Track card status

5. **Settlement Processing**
   - `/api/settlements` - Track payment settlements
   - `/api/settlements/reconcile` - Reconcile payments

## Core Data Flow
1. User creates expense group → Group stored in database
2. User adds expense with split details → Split calculations performed
3. System charges each participant → Stripe PaymentIntents API
4. Funds pooled in platform account → Stripe Connect API
5. Virtual card created with pooled funds → Stripe Issuing API
6. Merchant payment processed → Stripe Issuing API
7. Transaction record created → Database updated

## Stripe API Key Management
```
STRIPE_PUBLISHABLE_KEY=pk_test_...  # For client-side
STRIPE_SECRET_KEY=sk_test_...       # For server-side
STRIPE_WEBHOOK_SECRET=whsec_...     # For webhook verification
```

## Webhook Endpoints
```
/api/webhooks/stripe           # Handle Stripe events
/api/webhooks/stripe/connect   # Handle Connect events
/api/webhooks/stripe/issuing   # Handle Issuing events
```

## Development Commands
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Run tests
npm test
```

## Key Files Overview
- `src/lib/stripe/*` - Stripe integration helpers
- `src/app/api/*` - Backend API routes  
- `src/components/*` - Reusable UI components
- `src/app/*` - Page routes
- `src/contexts/*` - React context providers

## Important Notes
- All payment processing happens server-side via API routes
- Virtual card creation requires completing all individual charges first
- Environment variables must be properly set for Stripe integration
- Webhook handling is critical for tracking payment statuses
