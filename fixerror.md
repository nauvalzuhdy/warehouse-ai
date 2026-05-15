
if (user && AUTH_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

10.04 2026
- error di validator.ts ✔
- terakhir bisa login dan muncul dashboard ada logout dan berhasil log out ✔
- masuk kedashboard langsung gabisa harus diarahin ke login ✔
- note (https://claude.ai/share/92e18d64-8c5e-4ab8-a051-8ec345dc370a)
- edit karena semua folder itu dalam folder dashboard
  before
  const PROTECTED_ROUTES_PREFIX = [
  '/dashboard',
  '/products',
  '/warehouses',
  '/stock',
  '/chat',
]; 
  after
  const PROTECTED_ROUTES_PREFIX = [
  '/dashboard',
];
not:
- coba pelajari logout itu fitur di page mana, baca kodenya. penting

15.04.2026 
dashboard/layout&page.tsx
components/Dashboardshells&PageHeader&Sidebar.tsx
- page dashboard ga nampilin sidebar dan header, ternyata fix error di dashboard/layout.tsx harus diisi ✔
- after click menu utama - all menu contoh, produk, masuk ke page /produk terus tekan kembali di browser kemudian tekan page menu lain gabisa jadi harus direfresh halamannya, kenapa itu?
- itu mending tulis components/Header or PageHeader biar ga dobel
not:
- baca ulang codenya, terutama children itu apa, bagaimana web itu jalan, 
- rapikan kodenya
- ubah bahasa & desain nantinya

27.04.2026
-link sidebar product masuk ke /warehouse/product ubahnya di link component/sidebar

28.04.2026
- promtnya ku ubah jadi
lira
File: src/lib/utils.ts (add to existing file, don't replace)
Add these utility functions:
1. formatLira(amount: number | null | undefined): string

Format number as Turkish Lira
Use Intl.NumberFormat with locale 'tr-TR' and currency 'TRY'
If null/undefined: return '-'
Example: 12500 → "₺12.500,00"

2. formatNumber(num: number | null | undefined): string

Format number with thousand separators using Turkish locale ('tr-TR')
If null/undefined: return '0'
Example: 12840 → "12.840"

3. truncateText(text: string, maxLength: number): string

Truncate text and add '...' if longer than maxLength
Example: truncateText("Özel Döner Menüsü", 10) → "Özel Döner..."

Export all three functions.

