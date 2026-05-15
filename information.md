# Lihat semua folder di root
gci src -Directory

# Lihat struktur app
tree . /F

# pastikan tidak ada TypeScript error
npx tsc --noEmit

# .env.local tidak akan ter-commit ke Git.
cat .gitignore | Select-String ".env"

# middleware
focus on page (middleware.ts, auth-login-page.tsx, dashboard-page.tsx, dashboard-page.tsx, api-auth-logout-route.ts)

