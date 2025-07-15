# NeuroLint Pro - Authentication System Implementation

This document outlines the complete authentication system implemented with Supabase and PayPal integration.

## 🚀 Overview

The authentication system provides:

- **User Registration & Login** with Supabase Auth
- **Session Management** with JWT tokens
- **Protected Routes** with middleware
- **PayPal Payment Integration** for subscriptions
- **Real-time Dashboard** with user-specific data
- **Profile Management** for users

## 📁 File Structure

```
app/
├── api/
│   ├── auth/
│   │   ├── signup/route.ts          # User registration
│   │   ├── login/route.ts           # User login
│   │   ├── logout/route.ts          # User logout
│   │   └── user/route.ts            # User profile CRUD
│   ├── subscriptions/route.ts       # Subscription management
│   └── webhooks/paypal/route.ts     # PayPal webhook handler
├── login/page.tsx                   # Login page
├── signup/page.tsx                  # Registration page
├── profile/page.tsx                 # User profile management
└── dashboard/page.tsx               # Protected dashboard (updated)

lib/
├── auth-context.tsx                 # React authentication context
└── auth-middleware.ts               # Server-side auth middleware

supabase-schema.sql                  # Database schema
```

## 🔧 Setup Instructions

### 1. Environment Variables

Add these to your `.env.local`:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE=your_supabase_service_role_key

# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_SECRET=your_paypal_client_secret
PAYPAL_WEBHOOK_ID=your_paypal_webhook_id

# App Configuration
NEXTAUTH_URL=http://localhost:3000
```

### 2. Database Setup

1. Create a new Supabase project
2. Run the SQL commands in `supabase-schema.sql` in your Supabase SQL editor
3. Enable email confirmation in Supabase Auth settings (optional)
4. Configure any OAuth providers (Google, GitHub) in Supabase Auth

### 3. PayPal Setup

1. Create a PayPal Developer account
2. Create a new app in PayPal Developer Dashboard
3. Configure webhook endpoints:
   - `https://yourdomain.com/api/webhooks/paypal`
4. Enable these webhook events:
   - `BILLING.SUBSCRIPTION.ACTIVATED`
   - `BILLING.SUBSCRIPTION.CANCELLED`
   - `BILLING.SUBSCRIPTION.SUSPENDED`
   - `BILLING.SUBSCRIPTION.PAYMENT.COMPLETED`
   - `BILLING.SUBSCRIPTION.PAYMENT.FAILED`

## 🔐 Authentication Flow

### Registration

1. User fills out signup form (`/signup`)
2. Form submits to `/api/auth/signup`
3. Supabase creates user account
4. Profile record created in `profiles` table
5. Email confirmation sent (if enabled)
6. User redirected to dashboard or login

### Login

1. User enters credentials (`/login`)
2. Form submits to `/api/auth/login`
3. Supabase validates credentials
4. JWT session token returned
5. Token stored in localStorage
6. User redirected to dashboard

### Protected Routes

1. All API routes use `authenticateRequest()` middleware
2. Dashboard checks authentication on mount
3. Unauthenticated users redirected to `/login`
4. Session tokens validated on each request

## 💳 Payment Integration

### Subscription Creation

1. User selects plan on `/pricing`
2. Redirected to `/checkout` with plan details
3. PayPal payment processed
4. Webhook updates subscription status
5. User plan upgraded in database

### Webhook Processing

- PayPal sends webhooks to `/api/webhooks/paypal`
- Subscription status updated in real-time
- User plan automatically upgraded/downgraded
- Payment history tracked

## 🛡️ Security Features

### Row Level Security (RLS)

- All database tables have RLS enabled
- Users can only access their own data
- Service role used for admin operations

### Authentication Middleware

- JWT token validation on protected routes
- Rate limiting based on user plan
- API key support for programmatic access

### Data Protection

- Passwords hashed by Supabase Auth
- Session tokens expire automatically
- Sensitive data never logged

## 📊 Database Schema

### Core Tables

- `profiles` - Extended user information
- `subscriptions` - User subscription tracking
- `payments` - Payment transaction history
- `sessions` - Dashboard session management

### Relationships

- `profiles.id` → `auth.users.id` (1:1)
- `subscriptions.user_id` → `auth.users.id` (1:N)
- `payments.user_id` → `auth.users.id` (1:N)

## 🎯 Features Implemented

### ✅ Completed

- [x] Supabase authentication API routes
- [x] User registration and login pages
- [x] Protected dashboard with real auth
- [x] Authentication middleware
- [x] PayPal subscription integration
- [x] User profile management
- [x] Webhook handling for payments
- [x] Session management
- [x] Rate limiting by plan

### 🔄 API Endpoints

#### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/user` - Get user profile
- `PUT /api/auth/user` - Update user profile

#### Subscriptions

- `GET /api/subscriptions` - Get user subscriptions
- `POST /api/subscriptions` - Create new subscription
- `PUT /api/subscriptions` - Update subscription

#### Webhooks

- `POST /api/webhooks/paypal` - PayPal webhook handler

## 🚦 Usage Examples

### Client-Side Authentication

```tsx
import { useAuth } from "../lib/auth-context";

function MyComponent() {
  const { user, session, signIn, signOut } = useAuth();

  if (!user) {
    return <LoginForm onLogin={signIn} />;
  }

  return <Dashboard user={user} />;
}
```

### Server-Side Protection

```typescript
import { createAuthenticatedHandler } from "../lib/auth-middleware";

export const GET = createAuthenticatedHandler(async (request, user) => {
  // This handler only runs for authenticated users
  return NextResponse.json({ userId: user.id });
});
```

### API Key Authentication

```typescript
// Works with both session tokens and API keys
const response = await fetch("/api/analyze", {
  headers: {
    Authorization: `Bearer ${sessionToken}`,
    // OR
    "X-API-Key": "nlp_your_api_key",
  },
});
```

## 🔧 Customization

### Adding OAuth Providers

1. Enable provider in Supabase Auth settings
2. Update login/signup pages with provider buttons
3. Handle OAuth callbacks in auth context

### Custom User Fields

1. Add columns to `profiles` table
2. Update registration form
3. Modify profile management page

### Plan-Based Features

- Rate limits defined in `auth-middleware.ts`
- Feature flags based on `user.plan`
- Subscription upgrades through PayPal

## 🐛 Troubleshooting

### Common Issues

1. **CORS errors**: Check Supabase URL configuration
2. **Session not persisting**: Verify localStorage usage
3. **Webhook not working**: Check PayPal webhook URL and events
4. **Database permissions**: Ensure RLS policies are correct

### Debug Mode

Add to `.env.local`:

```env
NODE_ENV=development
```

## 📈 Next Steps

### Recommended Enhancements

- [ ] Email templates customization
- [ ] Two-factor authentication
- [ ] Social login providers (Google, GitHub)
- [ ] Password reset functionality
- [ ] User invitation system
- [ ] Audit logging
- [ ] Advanced analytics

## 🔗 Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [PayPal Developer Documentation](https://developer.paypal.com/docs/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
