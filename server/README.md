# Donation Portal Backend

Minimal Express + SQLite backend for the Donation Portal.

Features:
- User registration and login (JWT)
- Payment recording endpoint
- Admin endpoints to list payments and users

Quick start

1. Install dependencies

```powershell
cd server
npm install
```

2. Copy `.env.example` to `.env` and set values (optional)

3. Start server

```powershell
npm run dev
# or
npm start
```

The backend uses `data/donations.db` by default.

Default admin

On first run the server will create a default admin user using `.env` values `ADMIN_EMAIL` and `ADMIN_PASSWORD` (or the defaults in `.env.example`).
