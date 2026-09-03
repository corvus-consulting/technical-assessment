# booking-platform

A small service-booking application. Customers book providers, providers accept
or decline, and there is a partially built admin view plus an endpoint that
drafts booking summaries with a language model.

## Setup

You need Docker and Node 20 or newer.

```bash
cp .env.example .env
npm install
npm run setup
npm run dev
```

`npm run setup` starts Postgres in Docker, applies migrations, generates the
Prisma client, and seeds 21 users and 400 bookings.

Open http://localhost:3000 and pick a user to sign in as. There is no password
step in development — the home page lists every seeded user and signing in sets
a session cookie.

If setup does not work within a few minutes, stop and tell us. That is our
problem, not yours, and we will extend your time.

## Layout

```
prisma/
  schema.prisma          data model
  migrations/            migration history
  seed.ts                seed data
src/
  lib/
    prisma.ts            Prisma client singleton
    session.ts           session handling
    llm.ts               language model call
  graphql/
    schema.ts            GraphQL type definitions
    resolvers.ts         resolvers
  app/
    page.tsx             user picker
    bookings/            customer and provider view
    admin/               admin view
    api/graphql/         GraphQL Yoga endpoint
    api/summary/         AI booking summary
  components/            UI components
tests/                   test suite
```

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the app |
| `npm run setup` | Database up, migrate, generate, seed |
| `npm run db:seed` | Reseed only |
| `npm test` | Run the test suite |

## GraphQL

The endpoint is at `/api/graphql` and serves a GraphiQL interface in the
browser. It reads your session from the same cookie the app uses, so sign in first.

```graphql
query {
  myBookings {
    id
    title
    status
    price
    provider { name }
  }
}
```

## The AI summary endpoint

`POST /api/summary` with `{ "bookingId": "..." }` returns a short generated
summary of a booking.

It needs a real `ANTHROPIC_API_KEY` in `.env` to return a summary. **You do not
need a working key for this assessment.** Read the code and reason about it;
you are not expected to run it.

