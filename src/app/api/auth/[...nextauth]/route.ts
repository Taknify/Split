import { handlers } from '@/lib/auth/auth';

// Export NextAuth handlers for API routes
export const { GET, POST } = handlers;

// NextAuth debugging can be configured in auth.ts
// instead of exporting debug from this route file