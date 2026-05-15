import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Side - Branding (Hidden on mobile) */}
      <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden p-8">
        {/* Decorative grid overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-grid-white/[0.05]" style={{
            backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center space-y-6">
          {/* Logo area */}
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>

          {/* App name */}
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Warehouse AI
          </h1>

          {/* Tagline */}
          <p className="text-lg md:text-xl text-blue-100 max-w-sm">
            Kelola gudang lebih cerdas dengan AI
          </p>

          {/* Divider */}
          <div className="w-12 h-1 bg-white/30 rounded-full mx-auto" />

          {/* Supporting text */}
          <p className="text-sm text-blue-100/80 max-w-sm leading-relaxed">
            Sistem manajemen gudang terpadu dengan analitik cerdas untuk efisiensi maksimal
          </p>
        </div>
      </div>

      {/* Right Side - Form area */}
      <div className="flex flex-col items-center justify-center bg-white p-6 md:p-8">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>
    </div>
  );
}

