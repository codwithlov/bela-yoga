# SPORTVERSE LDP CMS Next.js Full

Repo này là bản gộp giữa:

- `sportverse-ldp`: public site, admin shell, SPORTVERSE UI/module.
- `cms-nextjs-template`: auth/session/CSRF/rate-limit/Mongoose API foundation cho CMS.

Mục tiêu: chạy public FE + CMS/admin API ngay trong một app Next.js, không cần backend Laravel/PHP riêng cho LDP.

## Cấu trúc chính

- Public pages: `/`, `/san`, `/san/[slug]`, `/tran-dau`, `/highlight`, `/cua-hang`.
- Admin shell SPORTVERSE: `/admin/overview`, `/admin/organizations`, `/admin/venues`, `/admin/booking`, `/admin/user`, `/admin/role`.
- LDP-compatible internal API: `/api/public/v1/*`.
- CMS template auth/session API: `/api/auth/*`, `/api/admin/*`.
- Auth/session core: `lib/auth.ts`, `lib/auth-shared.ts`, `models/Session.ts`, `models/User.ts`.

## Chạy local

```bash
npm install
npm run dev
```

App mặc định chạy tại `http://localhost:3000`.

## Env chính

```env
NEXT_PUBLIC_BASE_URL='http://localhost:3000/'
NEXT_PUBLIC_API_PATH='api/public/v1/'
NEXT_PUBLIC_WEB_URL='http://localhost:3000/'

MONGODB_URI='mongodb://127.0.0.1:27017/ldp_cms_nextjs_full'
MONGODB_DB='ldp_cms_nextjs_full'
AUTH_SECRET='sportverse-fullstack-local-secret-change-me'
```

MongoDB dùng cho CMS session/user API từ template. Riêng API `/api/public/v1/*` vẫn có fallback JWT để public/admin SPORTVERSE chạy được khi chưa bật MongoDB.

## Tài khoản demo

- Super admin: `superadmin@gmail.com` / `Superadmin@123`
- Organization manager: `manager.org@sportverse.test` / `Password@123`
- Booking operator: `operator.org@sportverse.test` / `Password@123`
- Member: `member.org@sportverse.test` / `Password@123`

## API SPORTVERSE nội bộ

- `GET /api/public/v1/health`
- `GET /api/public/v1/home`
- `GET /api/public/v1/organizations`
- `GET /api/public/v1/organizations/:slug`
- `GET /api/public/v1/organizations/:slug/availability`
- `GET /api/public/v1/matches`
- `GET /api/public/v1/highlights`
- `GET /api/public/v1/store-items`
- `POST /api/public/v1/user/login`
- `POST /api/public/v1/user/refresh-token`
- `GET /api/public/v1/admin/overview`
- `GET /api/public/v1/admin/organizations`
- `GET /api/public/v1/admin/venues`
- `GET /api/public/v1/admin/bookings`
- `GET /api/public/v1/admin/users`
- `GET /api/public/v1/admin/roles`

## Validate

```bash
npx tsc --noEmit --pretty false
npm run build
```