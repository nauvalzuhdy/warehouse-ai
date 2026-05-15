import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding (hidden on mobile, visible md+) */}
      <div className="hidden md:flex md:w-1/2 bg-linear-to-br from-blue-600 to-blue-800 flex-col items-center justify-center relative overflow-hidden">
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 gap-4 h-full w-full p-8">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="border border-blue-300"></div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-sm">
          {/* Logo/Icon Area */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-sm border border-white/30">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </div>
          </div>

          {/* App Name */}
          <h1 className="text-4xl font-bold text-white mb-4">Warehouse AI</h1>

          {/* Tagline */}
          <p className="text-blue-100 text-lg leading-relaxed">
            Kelola gudang lebih cerdas dengan AI
          </p>

          {/* Additional Info */}
          <div className="mt-12 space-y-4 text-blue-100 text-sm">
            <p>✓ Inventori Otomatis</p>
            <p>✓ Analisis Produk Real-time</p>
            <p>✓ Optimasi Stok Cerdas</p>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form (full on mobile, 1/2 on desktop) */}
      <div className="w-full md:w-1/2 bg-white flex flex-col items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
