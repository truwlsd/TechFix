# TechFix Backend

MVP API для обработки заявок, бонусной системы и статусов заказа.

## Запуск

```bash
npm install
npm run prisma:migrate -- --name init
npm run seed
npm run dev
```

Сервер: `http://localhost:4000`

## Тестовые аккаунты

- Админ: `admin@techfix.ru` / `admin123`
- Клиент: `demo@techfix.ru` / `demo123`

## Основные эндпоинты

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (Bearer token)
- `GET /api/services`
- `POST /api/orders` (Bearer token)
- `GET /api/orders/my` (Bearer token)
- `GET /api/orders/:id` (Bearer token)
- `GET /api/admin/orders` (Bearer token, admin)
- `PATCH /api/admin/orders/:id/status` (Bearer token, admin)
- `GET /api/admin/users/:id/bonus-ledger` (Bearer token, admin)

## Бизнес-правила

- При регистрации начисляется `100` приветственных бонусов.
- При создании заказа можно списать максимум `30%` цены услуги.
- Списание бонусов происходит сразу при создании заказа.
- Начисление `5%` бонусов происходит при переводе заказа в статус `completed`.
- Уровень лояльности:
  - `silver` до 14999
  - `gold` от 15000
  - `platinum` от 50000
