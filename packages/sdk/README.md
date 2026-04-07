# @hotelhub/sdk

Shared SDK for HotelHub web and mobile applications. Provides unified API client, types, and utilities.

## Installation

```bash
# Already in workspace, just npm install at root
npm install
```

## Usage

### Basic Example

```typescript
import { authModule, destinationsModule, queryKeys } from '@hotelhub/sdk'

// Login
const token = await authModule.login({ email: 'user@example.com', password: '123' })

// List destinations
const destinations = await destinationsModule.list({ page: 0, size: 20 })

// Get destination detail
const detail = await destinationsModule.getDetail('dest-123')
```

### Configuration

Set environment variables in your app:

```bash
# Client-side (browser/mobile)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1

# Server-side (Node.js SSR in Next.js)
API_INTERNAL_URL=http://localhost:8080/api/v1
```

Or configure at runtime:

```typescript
import { configManager } from '@hotelhub/sdk'

configManager.setConfig({
  baseUrl: 'http://localhost:8080/api/v1',
  timeout: 8000,
  retryAttempts: 1,
})
```

### Setting Authentication Token

```typescript
import { httpClient } from '@hotelhub/sdk'

// Call after login to inject token in all requests
httpClient.setTokenGetter(() => localStorage.getItem('token'))

// Optional: handle token expiration
httpClient.setTokenExpiredCallback(() => {
  console.log('Token expired, redirect to login')
})
```

### Error Handling

```typescript
import { HttpError, ErrorHandler } from '@hotelhub/sdk'

try {
  await destinationsModule.list()
} catch (error) {
  if (ErrorHandler.isHttpError(error)) {
    console.log(`HTTP ${error.statusCode}: ${error.apiError.message}`)
  } else if (ErrorHandler.isNetworkError(error)) {
    console.log('Network error, check internet connection')
  }
}
```

### Query Keys for TanStack Query

```typescript
import { queryKeys } from '@hotelhub/sdk'

// Use in useQuery/useMutation
const { data } = useQuery({
  queryKey: queryKeys.destinations.list(),
  queryFn: () => destinationsModule.list(),
})

// Invalidate on mutation
queryClient.invalidateQueries({ 
  queryKey: queryKeys.destinations.all 
})
```

## Modules

- **authModule**: Login, register, authentication
- **destinationsModule**: List and CRUD destinations
- **hotelsModule**: List and CRUD hotels + rooms
- **reservationsModule**: Create and manage reservations
- **profileModule**: User profile and account management

## Types

All types are exported from `@hotelhub/sdk`:

```typescript
import type {
  LoginRequest,
  Destination,
  Hotel,
  Reservation,
  UserProfile,
  // ... and more
} from '@hotelhub/sdk'
```

## Architecture

```
@hotelhub/sdk/
├── core/           # HTTP client, config, errors
├── types/          # TypeScript interfaces
├── modules/        # API client per domain
├── hooks/          # React hooks utilities (query-keys)
└── index.ts        # Barrel export
```

## For Web (Next.js)

1. Install: `npm install @tanstack/react-query`
2. Create hooks in `apps/web/src/hooks/`
3. Use `queryKeys` for consistency

See [hooks guide](./src/hooks/HOOKS_IMPLEMENTATION_GUIDE.ts) for detailed examples.

## For Mobile (Expo)

1. Install: `npm install @tanstack/react-query expo-secure-store`
2. Create hooks in `apps/mobile/src/hooks/`
3. Use SecureStore for token persistence

## Development

### Type Check

```bash
npm run typecheck --workspace=sdk
```

### Build

```bash
npm run build --workspace=sdk
```
