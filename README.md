# NURTW Digital Platform (E-Manifest)

This is a Next.js (App Router) application for managing NURTW e-manifests.

## What’s included
- **Passenger flow**: validate a vehicle plate against an active manifest, then register as a passenger.
- **Admin portal**: email/password login (NextAuth Credentials) and admin screens.
- **Database**: Prisma + SQLite by default (easy local dev).  
- **PDF/QR utilities**: for manifest/verification flows.

> Note: Some agent/admin operational flows are UI-only placeholders (backend endpoints are not fully implemented yet).

## Quickstart (local)
1. Copy env:
```bash
cp .env.example .env
```

2. Install and generate Prisma client:
```bash
npm install
npx prisma generate
```

3. Run migrations + seed:
```bash
npx prisma migrate dev
npm run db:seed
```

4. Start dev server:
```bash
npm run dev
```

## Docker (production-ish, SQLite)
```bash
cp .env.example .env
docker compose up --build
```

The container runs `prisma migrate deploy` before starting.

## Security notes
- **Do not commit** `.env` or `.next` or database files (`*.db`).
- Admin routes are protected by `middleware.ts` and require a valid NextAuth session.

