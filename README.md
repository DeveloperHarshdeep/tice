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
| `SESSION_SECRET` | At least 32 random characters (server-only); required for login |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Optional one-time bootstrap credentials when no admin exists |
| `CLOUDINARY_*` | Server-side upload credentials |
| `NEXT_PUBLIC_SITE_URL` | Public site URL for SEO metadata |
| `UPSTASH_REDIS_*` | Optional; recommended for rate limits in production |

3. Install dependencies:

```bash
npm install
```

4. Create the initial administrator (runs once; refuses if an admin already exists):

```bash
npm run create-admin
```

5. Start development:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin login: `/admin/login`.

Additional administrators can register at `/admin/register` while database-controlled registration is enabled. New accounts share the same institute records and have no separate data partition.

## MongoDB

Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or a self-hosted instance. Whitelist your IP and create a database user with read/write access. Set `MONGODB_URI` to the connection string.

### Enable or disable administrator registration

Registration is controlled only by the `settings` collection in the same MongoDB database selected by `MONGODB_URI` (the existing project setup uses the `tice` database). The document can use MongoDB's normal ObjectId `_id` with `id: "admin"`:

```json
{
  "id": "admin",
  "adminRegistrationEnabled": true
}
```

For compatibility, the application also recognizes the older `{ "_id": "admin" }` string-id document. If neither form exists, or the field is missing or not the Boolean `true`, registration is disabled. If duplicate matching setting documents exist, all must explicitly enable registration. No public API can change this setting.

In MongoDB Atlas, open **Database > Browse Collections**, select the database named in the `MONGODB_URI` path, then open the `settings` collection:

1. Find the existing settings document identified by `id: "admin"` (or legacy string `_id: "admin"`). Update that document and set `adminRegistrationEnabled` to the Boolean `true`. If no settings document exists, insert one shaped like `{ "id": "admin", "adminRegistrationEnabled": true }`; Atlas will assign its ObjectId `_id`.
2. To disable registration, edit that same document and set `adminRegistrationEnabled` to the Boolean `false`. Alternatively, delete the registration settings document; missing settings fail closed.
3. Save the change. The registration page and registration API read MongoDB directly, so no redeployment is needed.

The equivalent `mongosh` command to enable registration is:

```javascript
db.settings.updateOne(
  { id: "admin" },
  { $set: { adminRegistrationEnabled: true } },
  { upsert: true }
)
```

Change `true` to `false` to disable it. When enabling an existing legacy document keyed by string `_id`, update it using `{ _id: "admin" }` instead of the `id` filter above. Do not create an unauthenticated settings API or store administrator accounts in any institute-data collection.

Generate a suitable session secret locally with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

Set the generated value as server-side `SESSION_SECRET` in `.env.local` for development and in the hosting provider's environment settings for production. Restart the development server or redeploy after changing it. The application intentionally rejects missing or shorter-than-32-character secrets rather than falling back to a hardcoded value.

## Production deployment

Local `.env*` files are ignored by Git and are not copied to the hosting provider. Add `MONGODB_URI` in the provider's server-side production environment settings, using the same Atlas cluster and database as local development. The database name comes from the URI path; the current local setup selects `tice`. Do not prefix this variable with `NEXT_PUBLIC_`.

After changing environment variables, redeploy so the running application receives them. Ensure the Atlas database user has the required database access and that Atlas network access permits connections from the hosting environment using the provider's recommended secure egress configuration. Do not open Atlas access to all IPs as a workaround.

## Cloudinary

1. Create a Cloudinary cloud.
2. Copy cloud name, API key, and API secret into `.env.local`.
3. Uploads use signed server-side streams only; credentials are never exposed to the browser.

If Cloudinary is missing, photo and certificate uploads fail with a clear error; other features still work.

## Rate limiting

Public search and login endpoints are rate limited. For a single server, an in-memory fallback is used. For production with multiple instances, configure [Upstash Redis](https://upstash.com/) REST credentials.

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
- [ ] Keep `SESSION_SECRET` at least 32 characters and configure it in every deployment environment
- [ ] Use HTTPS in production (secure cookies)
- [ ] Configure Upstash (or equivalent) rate limiting
- [ ] Restrict MongoDB network access
- [ ] Keep Cloudinary secrets server-side only
- [ ] Do not commit `.env.local`
- [ ] Verify admin routes return 401 without session (not only UI hiding)
