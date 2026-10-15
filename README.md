# Talent Institute & Computer Education

Production-oriented institute website built with Next.js App Router, MongoDB, and Tailwind CSS v4.

## Requirements

- Node.js 20+ (for `node --env-file`)
- MongoDB database
- Cloudinary account (student photos & certificate files)

## Setup

1. Copy environment variables:

```bash
cp .env.example .env.local
```

2. Fill in `.env.local`:

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | MongoDB connection string |
| `SESSION_SECRET` | At least 32 random characters (server-only) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | One-time bootstrap credentials |
| `CLOUDINARY_*` | Server-side upload credentials |
| `NEXT_PUBLIC_SITE_URL` | Public site URL for SEO metadata |
| `UPSTASH_REDIS_*` | Optional; recommended for rate limits in production |

3. Install dependencies:

```bash
npm install
```

4. Create the administrator (runs once; refuses if an admin already exists):

```bash
npm run create-admin
```

5. Start development:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin login: `/admin/login`.

## MongoDB

Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or a self-hosted instance. Whitelist your IP and create a database user with read/write access. Set `MONGODB_URI` to the connection string.

## Cloudinary

1. Create a Cloudinary cloud.
2. Copy cloud name, API key, and API secret into `.env.local`.
3. Uploads use signed server-side streams only; credentials are never exposed to the browser.

If Cloudinary is missing, photo and certificate uploads fail with a clear error; other features still work.

## Rate limiting

Public search, login, and enquiry endpoints are rate limited. For a single server, an in-memory fallback is used. For production with multiple instances, configure [Upstash Redis](https://upstash.com/) REST credentials.

## Student deletion strategy

- If a student has **issued certificates** or **published results**, delete requests **archive** the student (`archived: true`) instead of hard deletion.
- Otherwise draft-linked records are removed and the student document is deleted.

## Editable content

- Contact details: `src/lib/site-config.js`
- Courses: `src/data/courses.js`
- About faculty & official documents: `src/app/about/page.js`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint |
| `npm run create-admin` | Bootstrap admin user |

## Security checklist (deployment)

- [ ] Set strong `SESSION_SECRET` and rotate if compromised
- [ ] Use HTTPS in production (secure cookies)
- [ ] Configure Upstash (or equivalent) rate limiting
- [ ] Restrict MongoDB network access
- [ ] Keep Cloudinary secrets server-side only
- [ ] Do not commit `.env.local`
- [ ] Verify admin routes return 401 without session (not only UI hiding)
