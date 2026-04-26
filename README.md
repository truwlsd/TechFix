# TechFix

## Local start

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run prisma:migrate -- --name init
npm run seed
npm run dev
```

### Frontend

```bash
cp .env.example .env
npm install
npm run dev -- --host
```

## One-command Docker start

```bash
cd backend
cp .env.example .env
cd ..
docker compose up --build
```

After startup:

- Frontend: http://localhost:5173
- Backend health: http://localhost:4000/api/health

## Env vars

### Frontend

- `VITE_API_BASE_URL` - backend API base URL

### Backend

- `DATABASE_URL` - SQLite file path
- `PORT` - backend port
- `CORS_ORIGIN` - allowed frontend origin
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` - token lifetime
