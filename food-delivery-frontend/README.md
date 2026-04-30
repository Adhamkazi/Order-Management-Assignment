# Feastly — Food Delivery App

A full-stack Order Management feature built with **Next.js 14 (App Router)**, **Zustand**, **Tailwind CSS**, and **Vitest**.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React 18, Tailwind CSS |
| State | Zustand (cart, persisted to localStorage) |
| Backend | Next.js API Routes (REST) |
| Real-time | Server-Sent Events (SSE) |
| Testing | Vitest + React Testing Library |
| Hosting | Vercel |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Running Tests

```bash
npm test          # run all tests once
npm run test:watch  # watch mode
```

## Project Structure

```
├── app/
│   ├── page.tsx                    # Menu page
│   ├── cart/page.tsx               # Cart page
│   ├── checkout/page.tsx           # Checkout form
│   ├── order-status/[id]/page.tsx  # Live order tracking
│   └── api/
│       ├── menu/route.ts           # GET /api/menu
│       ├── orders/route.ts         # POST /api/orders, GET /api/orders
│       └── orders/[id]/
│           ├── route.ts            # GET /api/orders/:id
│           └── stream/route.ts     # SSE stream
├── components/
│   ├── Navbar.tsx
│   ├── MenuItemCard.tsx
│   ├── CategoryFilter.tsx
│   └── OrderStatusTracker.tsx
├── lib/
│   ├── types.ts                    # Shared TypeScript types
│   ├── menu-data.ts                # Menu seed data
│   ├── orders-store.ts             # In-memory orders + SSE
│   └── validation.ts               # Input validation
├── store/
│   └── cart-store.ts               # Zustand cart store
└── __tests__/
    ├── api/orders.test.ts          # Validation + order store tests
    ├── api/cart-store.test.ts      # Zustand store tests
    └── components/components.test.tsx  # Component tests
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/menu` | Returns all menu items |
| POST | `/api/orders` | Places a new order |
| GET | `/api/orders/:id` | Gets a specific order |
| GET | `/api/orders/:id/stream` | SSE stream for real-time status |

## Order Status Flow

Orders automatically progress through these statuses via `setTimeout`:

```
Order Received (0s) → Preparing (8s) → Out for Delivery (20s) → Delivered (35s)
```

Real-time updates are pushed to the client via **Server-Sent Events**.

## Deployment (Vercel)

```bash
npm i -g vercel
vercel
```
