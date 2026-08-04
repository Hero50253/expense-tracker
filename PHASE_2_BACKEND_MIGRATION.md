# ExpenseOS Phase 2 Backend Migration

Phase 2 converts the Phase 1 browser sandbox into a MongoDB-backed SaaS foundation while keeping offline mode available.

## Implemented In This Phase

- Express REST API with JWT-protected finance routes.
- MongoDB/Mongoose persistence for users, transactions, budgets, savings goals, credit cards, EMIs, Splitwise friends, groups, shared expenses, and settlements.
- Bcrypt password hashing for signup/login.
- Stable `clientId` support so restored sandbox backups keep references like `f1`, `gr1`, and `t1` intact even after MongoDB assigns `_id` values.
- Bulk `/api/system/sync` restore endpoint for importing local ExpenseOS JSON backups into a user account.
- Environment-based CORS and production JWT secret enforcement.

## Local Backend Setup

1. Install dependencies from `backend/package.json`.
2. Copy `backend/.env.example` to `backend/.env`.
3. Set `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_ORIGIN`.
4. Start the API:

```bash
cd backend
npm run dev
```

5. In the ExpenseOS Settings screen, set Backend API URL to:

```text
http://localhost:5000
```

## Main API Surface

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/user`
- `PUT /api/auth/currency`
- `GET|POST|DELETE /api/transactions`
- `GET|POST|DELETE /api/budgets`
- `GET|POST|PUT|DELETE /api/savings-goals`
- `GET|POST /api/credit-cards`
- `PUT /api/credit-cards/:id/pay`
- `GET|POST /api/emis`
- `PUT /api/emis/:id/pay`
- `GET|POST /api/splitwise/friends`
- `GET|POST /api/splitwise/groups`
- `GET|POST /api/splitwise/expenses`
- `GET|POST /api/splitwise/settlements`
- `POST /api/system/sync`

## Recommended Next Step: Vite Client Extraction

The current UI still runs as a single `index.html` with inline Babel JSX for maximum Phase 1 portability. The next clean frontend migration is:

1. Create `frontend/` with Vite + React.
2. Move `DEFAULT_STATE`, reducer, context, and API helpers into `src/state/ExpenseContext.jsx`.
3. Move each major view into `src/views/`.
4. Move charts and rings into `src/components/`.
5. Import the existing `styles.css` from `src/main.jsx`.
6. Replace CDN React/Babel scripts with package dependencies.

Keep offline sandbox mode as a first-class fallback. It is still useful for demos, development, and backup recovery.
