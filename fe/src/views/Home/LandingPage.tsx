import React from 'react';

interface LandingPageProps {
  onNavigate: (view: 'login' | 'register') => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FAF5F3]">
      {/* Header */}
      <header className="relative flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 overflow-hidden md:overflow-visible shadow-sm">
        <div className="flex items-center space-x-4">
          <img src="/logo.jpg" alt="Logo" className="h-12 w-12 object-contain" />
          <div>
            <h1 className="text-[#8C4A3A] font-bold text-xs tracking-wide">Trung tâm quản lý</h1>
            <h2 className="text-[#8C4A3A] font-bold text-base md:text-lg tracking-wide uppercase">Ký túc xá Homestay Dorm</h2>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="px-4 py-1.5">
            <span className="text-[#8C4A3A] text-xs font-semibold italic bg-[#B7705F]/10 px-4 py-1.5 rounded-full">
              Không gian ấm cúng, đong đầy yêu thương!
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden bg-[#FAF5F3]">
        {/* Left Side - Register */}
        <div
          className="absolute inset-0 z-10 hidden md:block"
          style={{ clipPath: 'polygon(0 0, 55% 0, 45% 100%, 0% 100%)' }}
        >
          <div className="absolute inset-0 bg-[#FDFBF9] flex flex-col items-center justify-center transition-all duration-700 hover:scale-102 overflow-hidden">
            {/* Floating Background Icons - Left side (Homestay & Cozy theme) */}
            <div className="absolute inset-0 pointer-events-none select-none z-0">
              {/* Cozy House */}
              <div className="absolute top-[8%] left-[10%] animate-float-slow">
                <svg viewBox="0 0 64 64" className="w-16 h-16 opacity-85" fill="none" stroke="#8C4A3A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 54 Q 32 52, 56 54" strokeWidth="2" opacity="0.6" />
                  <rect x="18" y="24" width="28" height="26" rx="4" fill="#FDFBF9" />
                  <path d="M14 26 L 32 10 L 50 26" stroke="#B7705F" strokeWidth="3.5" fill="#FAF5F3" />
                  <rect x="28" y="36" width="8" height="14" rx="2" fill="#8C4A3A" />
                  <circle cx="33" cy="43" r="1" fill="#FAF5F3" />
                  <rect x="22" y="28" width="6" height="6" rx="1" fill="#FFF4E0" />
                  <rect x="36" y="28" width="6" height="6" rx="1" fill="#FFF4E0" />
                  <rect x="40" y="16" width="6" height="10" fill="#B7705F" />
                  <path d="M43 12 Q 41 9, 43 6" strokeWidth="1.5" stroke="#B7705F" opacity="0.8" />
                </svg>
              </div>

              {/* Smiling Sprout */}
              <div className="absolute top-[48%] left-[5%] animate-float-fast">
                <svg viewBox="0 0 64 64" className="w-12 h-12 opacity-80" fill="none" stroke="#8C4A3A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 50 C 22 56, 42 56, 42 50 Z" fill="#EAD3CC" />
                  <path d="M18 44 L 46 44 L 44 50 L 20 50 Z" fill="#FAF5F3" />
                  <path d="M32 44 Q 32 26, 38 18" stroke="#7A8B63" strokeWidth="3" />
                  <path d="M32 34 Q 22 34, 24 24 Q 32 28, 32 34" fill="#A1B48D" stroke="#7A8B63" strokeWidth="2" />
                  <path d="M34 28 Q 44 26, 42 18 Q 34 22, 34 28" fill="#A1B48D" stroke="#7A8B63" strokeWidth="2" />
                  <path d="M28 47 Q 32 49, 36 47" strokeWidth="1.5" />
                </svg>
              </div>

              {/* Sweet Hearts */}
              <div className="absolute top-[22%] left-[34%] animate-float-rot">
                <svg viewBox="0 0 64 64" className="w-10 h-10 opacity-85" fill="none" stroke="#B7705F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 24 C 12 14, 28 14, 32 22 C 36 14, 52 14, 52 24 C 52 38, 32 50, 32 50 C 32 50, 12 38, 12 24 Z" fill="#EAD3CC" />
                  <path d="M36 18 C 36 15, 44 15, 46 19 C 48 15, 54 15, 54 19 C 54 26, 46 32, 46 32" stroke="#8C4A3A" strokeWidth="1.5" />
                </svg>
              </div>

              {/* Cozy Cup of Tea */}
              <div className="absolute bottom-[24%] left-[10%] animate-float-delayed">
                <svg viewBox="0 0 64 64" className="w-14 h-14 opacity-85" fill="none" stroke="#8C4A3A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 28 C 16 44, 44 44, 44 28 Z" fill="#FDFBF9" />
                  <path d="M44 31 C 50 31, 50 39, 44 39" strokeWidth="3" />
                  <path d="M10 46 Q 32 48, 54 46" strokeWidth="3" />
                  <path d="M22 18 Q 24 14, 22 10" strokeWidth="2" stroke="#B7705F" />
                  <path d="M30 20 Q 32 15, 30 11" strokeWidth="2" stroke="#B7705F" />
                  <path d="M38 18 Q 40 14, 38 10" strokeWidth="2" stroke="#B7705F" />
                  <path d="M26 33 Q 30 30, 30 33 Q 30 30, 34 33 Q 30 38, 30 38 Z" fill="#EAD3CC" stroke="none" />
                </svg>
              </div>

              {/* Warm Star */}
              <div className="absolute top-[62%] left-[28%] animate-float-fast">
                <svg viewBox="0 0 64 64" className="w-10 h-10 opacity-80" fill="none" stroke="#8C4A3A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M32 8 L 39 22 L 54 24 L 43 35 L 46 50 L 32 42 L 18 50 L 21 35 L 10 24 L 25 22 Z" fill="#FFF4E0" />
                  <circle cx="26" cy="28" r="1.5" fill="#8C4A3A" />
                  <circle cx="38" cy="28" r="1.5" fill="#8C4A3A" />
                  <path d="M30 32 Q 32 34, 34 32" strokeWidth="1.5" />
                </svg>
              </div>

              {/* Happy Cloud */}
              <div className="absolute bottom-[8%] left-[25%] animate-float-slow">
                <svg viewBox="0 0 64 64" className="w-16 h-12 opacity-85" fill="none" stroke="#8C4A3A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 42 C 12 42, 10 34, 16 30 C 14 20, 26 14, 34 18 C 42 12, 52 18, 50 28 C 56 28, 56 38, 50 42 Z" fill="#FDFBF9" />
                  <circle cx="28" cy="30" r="1.5" fill="#8C4A3A" />
                  <circle cx="38" cy="30" r="1.5" fill="#8C4A3A" />
                  <path d="M31 34 Q 33 36, 35 34" strokeWidth="1.5" />
                  <path d="M22 48 Q 20 52, 22 54" stroke="#B7705F" strokeWidth="1.5" />
                  <path d="M32 50 Q 30 54, 32 56" stroke="#B7705F" strokeWidth="1.5" />
                </svg>
              </div>

              {/* Sleeping Cat */}
              <div className="absolute top-[32%] left-[16%] animate-float-delayed">
                <svg viewBox="0 0 64 64" className="w-16 h-16 opacity-85" fill="none" stroke="#8C4A3A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 44 C 10 38, 54 38, 54 44 C 54 50, 10 50, 10 44 Z" fill="#EAD3CC" />
                  <ellipse cx="30" cy="34" rx="14" ry="10" fill="#FAF5F3" />
                  <circle cx="40" cy="28" r="8" fill="#FAF5F3" />
                  <polygon points="34 23 37 16 40 21" fill="#FAF5F3" />
                  <polygon points="41 22 44 15 47 21" fill="#FAF5F3" />
                  <path d="M36 28 Q 38 30, 39 28" strokeWidth="1.5" />
                  <path d="M42 28 Q 44 30, 45 28" strokeWidth="1.5" />
                  <circle cx="41" cy="31" r="1" fill="#B7705F" />
                  <path d="M18 34 Q 14 30, 16 26" strokeWidth="3" />
                </svg>
              </div>
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-[#8C4A3A]/5 pointer-events-none"></div>
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-white pb-10 pr-[15%] z-30">
            <button
              onClick={() => onNavigate('register')}
              className="px-13 py-3 rounded-xl text-white bg-[#8C4A3A] hover:bg-white hover:text-[#8C4A3A] active:bg-white active:text-[#8C4A3A] transition-all duration-200 font-bold text-lg tracking-wide shadow-md cursor-pointer"
            >
              ĐĂNG KÝ THUÊ
            </button>
          </div>
        </div>

        {/* Right Side - Login */}
        <div
          className="absolute inset-0 z-0 hidden md:block"
        >
          <div className="absolute inset-0 bg-[#FAF7F5] flex flex-col items-center justify-center transition-all duration-700 hover:scale-102 overflow-hidden">

            {/* Floating Background Icons - Right side (Study & Success theme) */}
            <div className="absolute inset-0 pointer-events-none select-none z-0">
              {/* Graduation Cap */}
              <div className="absolute top-[10%] right-[10%] animate-float-slow">
                <svg viewBox="0 0 64 64" className="w-16 h-16 opacity-85" fill="none" stroke="#8C4A3A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="32 12 56 22 32 32 8 22" fill="#B7705F" strokeWidth="3" />
                  <path d="M18 27 L 18 38 C 18 44, 46 44, 46 38 L 46 27" fill="#FDFBF9" />
                  <path d="M32 22 L 48 26 L 50 38" />
                  <rect x="48" y="38" width="4" height="6" fill="#8C4A3A" stroke="none" />
                </svg>
              </div>

              {/* Study Books */}
              <div className="absolute bottom-[22%] right-[8%] animate-float-delayed">
                <svg viewBox="0 0 64 64" className="w-16 h-16 opacity-85" fill="none" stroke="#8C4A3A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="14" y="38" width="36" height="12" rx="2" fill="#B7705F" />
                  <line x1="18" y1="44" x2="44" y2="44" stroke="#FAF5F3" strokeWidth="2" />
                  <rect x="18" y="28" width="30" height="10" rx="2" fill="#FAF5F3" />
                  <line x1="22" y1="33" x2="42" y2="33" stroke="#8C4A3A" strokeWidth="2" />
                  <g transform="rotate(-6 32 20)">
                    <rect x="22" y="16" width="24" height="10" rx="2" fill="#EAD3CC" />
                    <circle cx="28" cy="21" r="2" fill="#B7705F" stroke="none" />
                  </g>
                </svg>
              </div>

              {/* Glowing Idea Lightbulb */}
              <div className="absolute top-[48%] right-[5%] animate-float-fast">
                <svg viewBox="0 0 64 64" className="w-14 h-14 opacity-85" fill="none" stroke="#8C4A3A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="32" y1="10" x2="32" y2="6" stroke="#B7705F" strokeWidth="2" />
                  <line x1="16" y1="20" x2="12" y2="18" stroke="#B7705F" strokeWidth="2" />
                  <line x1="48" y1="20" x2="52" y2="18" stroke="#B7705F" strokeWidth="2" />
                  <line x1="14" y1="36" x2="10" y2="38" stroke="#B7705F" strokeWidth="2" />
                  <line x1="50" y1="36" x2="54" y2="38" stroke="#B7705F" strokeWidth="2" />
                  <path d="M22 38 C 16 34, 16 18, 32 18 C 48 18, 48 34, 42 38 L 40 44 L 24 44 Z" fill="#FFF4E0" />
                  <rect x="26" y="44" width="12" height="6" rx="1" fill="#EAD3CC" />
                  <path d="M28 50 L 36 50 L 32 54 Z" fill="#8C4A3A" />
                  <path d="M29 32 Q 32 26, 35 32" strokeWidth="2" />
                </svg>
              </div>

              {/* Alarm Clock */}
              <div className="absolute bottom-[8%] right-[25%] animate-float-slow">
                <svg viewBox="0 0 64 64" className="w-14 h-14 opacity-85" fill="none" stroke="#8C4A3A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="32" cy="34" r="18" fill="#FAF5F3" strokeWidth="3" />
                  <circle cx="32" cy="34" r="14" fill="#FDFBF9" />
                  <line x1="32" y1="34" x2="32" y2="24" strokeWidth="3" />
                  <line x1="32" y1="34" x2="40" y2="34" strokeWidth="2" />
                  <path d="M14 18 C 14 12, 24 14, 20 20 Z" fill="#B7705F" />
                  <path d="M50 18 C 50 12, 40 14, 44 20 Z" fill="#B7705F" />
                  <line x1="20" y1="50" x2="16" y2="54" strokeWidth="3.5" />
                  <line x1="44" y1="50" x2="48" y2="54" strokeWidth="3.5" />
                  <path d="M29 38 Q 32 40, 35 38" strokeWidth="1.5" />
                </svg>
              </div>

              {/* Achievement Medal */}
              <div className="absolute top-[62%] right-[28%] animate-float-fast">
                <svg viewBox="0 0 64 64" className="w-12 h-12 opacity-80" fill="none" stroke="#8C4A3A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="26 12 32 28 20 28" fill="#B7705F" />
                  <polygon points="38 12 32 28 44 28" fill="#B7705F" />
                  <circle cx="32" cy="38" r="12" fill="#FFF4E0" strokeWidth="3" />
                  <polygon points="32 32 35 37 40 37 36 41 38 45 32 42 26 45 28 41 24 37 29 37" fill="#B7705F" stroke="none" />
                </svg>
              </div>

              {/* Pencil & Ruler Crossed */}
              <div className="absolute top-[32%] right-[16%] animate-float-rot">
                <svg viewBox="0 0 64 64" className="w-14 h-14 opacity-85" fill="none" stroke="#8C4A3A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <g transform="rotate(45 32 32)">
                    <rect x="12" y="27" width="40" height="10" rx="1" fill="#FAF5F3" />
                    <line x1="20" y1="27" x2="20" y2="31" />
                    <line x1="28" y1="27" x2="28" y2="31" />
                    <line x1="36" y1="27" x2="36" y2="31" />
                    <line x1="44" y1="27" x2="44" y2="31" />
                  </g>
                  <g transform="rotate(-45 32 32)">
                    <rect x="12" y="27" width="32" height="10" rx="1" fill="#B7705F" />
                    <polygon points="44 27 52 32 44 37" fill="#EAD3CC" />
                    <polygon points="48 29.5 52 32 48 34.5" fill="#8C4A3A" stroke="none" />
                    <rect x="8" y="27" width="4" height="10" fill="#EAD3CC" />
                  </g>
                </svg>
              </div>

              {/* Sprout of growth */}
              <div className="absolute bottom-[48%] right-[18%] animate-float-delayed">
                <svg viewBox="0 0 64 64" className="w-12 h-12 opacity-80" fill="none" stroke="#8C4A3A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 50 Q 32 48, 52 50" strokeWidth="2" opacity="0.6" />
                  <path d="M32 48 Q 30 24, 38 14" stroke="#7A8B63" strokeWidth="3" />
                  <path d="M31 34 Q 21 32, 23 22 Q 31 26, 31 34" fill="#A1B48D" stroke="#7A8B63" strokeWidth="2" />
                  <path d="M33 26 Q 43 24, 41 14 Q 33 18, 33 26" fill="#A1B48D" stroke="#7A8B63" strokeWidth="2" />
                  <path d="M44 26 Q 47 23, 47 26 Q 47 23, 50 26 Q 47 30, 47 30 Z" fill="#B7705F" stroke="none" opacity="0.8" />
                </svg>
              </div>
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-[#8C4A3A]/5 pointer-events-none"></div>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-white pb-10 pl-[15%] z-30">
            <button
              onClick={() => onNavigate('login')}
              className="px-13 py-3 rounded-xl text-[#8C4A3A] bg-white/95 hover:bg-[#8C4A3A] hover:text-white active:bg-[#723a2d] active:text-white transition-all duration-200 font-bold text-lg tracking-wide shadow-md cursor-pointer"
            >
              ĐĂNG NHẬP
            </button>
          </div>
        </div>

        {/* White Separator Diagonal Line */}
        <div
          className="absolute inset-0 z-20 pointer-events-none hidden md:block"
          style={{ clipPath: 'polygon(54.8% 0, 55.2% 0, 45.2% 100%, 44.8% 100%)' }}
        >
          <div className="w-full h-full bg-white opacity-90"></div>
        </div>

        {/* Mobile View (Stacked) */}
        <div className="md:hidden flex flex-col h-full bg-[#FAF5F3] overflow-y-auto">
          {/* Mobile Left - Register */}
          <div className="flex-1 relative flex flex-col items-center justify-center p-6 text-center min-h-[280px] overflow-hidden">
            {/* Overlay for mobile left */}
            <div className="absolute inset-0 bg-[#8C4A3A]/5 pointer-events-none"></div>

            {/* Floating Background Icons - Mobile Left */}
            <div className="absolute inset-0 pointer-events-none select-none z-0">
              {/* Cozy House */}
              <div className="absolute top-[8%] left-[6%] animate-float-slow opacity-40">
                <svg viewBox="0 0 64 64" className="w-10 h-10" fill="none" stroke="#8C4A3A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="18" y="24" width="28" height="26" rx="4" fill="#FAF5F3" />
                  <path d="M14 26 L 32 10 L 50 26" stroke="#B7705F" strokeWidth="3.5" />
                </svg>
              </div>
              {/* Heart */}
              <div className="absolute top-[28%] right-[6%] animate-float-rot opacity-45">
                <svg viewBox="0 0 64 64" className="w-8 h-8" fill="none" stroke="#B7705F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 24 C 12 14, 28 14, 32 22 C 36 14, 52 14, 52 24 C 52 38, 32 50, 32 50 C 32 50, 12 38, 12 24 Z" fill="#EAD3CC" />
                </svg>
              </div>
              {/* Sprout */}
              <div className="absolute bottom-[10%] left-[8%] animate-float-fast opacity-40">
                <svg viewBox="0 0 64 64" className="w-8 h-8" fill="none" stroke="#8C4A3A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M32 44 Q 32 26, 38 18" stroke="#7A8B63" strokeWidth="3" />
                  <path d="M32 34 Q 22 34, 24 24 Q 32 28, 32 34" fill="#A1B48D" stroke="#7A8B63" strokeWidth="2" />
                </svg>
              </div>
            </div>

            <div className="z-10 mb-4 text-center">
              <span className="text-[10px] font-bold text-[#8C4A3A]/60 uppercase tracking-wider bg-[#8C4A3A]/5 px-2.5 py-0.5 rounded-full">Dorm Homestay</span>
              <h3 className="text-base font-bold text-[#8C4A3A] mt-1">Đăng ký trải nghiệm tiện nghi</h3>
            </div>

            <div className="flex gap-3 mb-6 z-10">
              {/* Cottage */}
              <div className="bg-white border border-[#EAD3CC]/40 rounded-xl p-2.5 flex flex-col items-center justify-center shadow-sm w-20">
                <svg viewBox="0 0 64 64" className="w-8 h-8" fill="none" stroke="#8C4A3A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="18" y="24" width="28" height="26" rx="4" fill="#FAF5F3" />
                  <path d="M14 26 L 32 10 L 50 26" stroke="#B7705F" strokeWidth="3.5" />
                </svg>
                <span className="text-[#8C4A3A] font-bold text-[9px] mt-1">Nhà ấm</span>
              </div>
              {/* Key */}
              <div className="bg-white border border-[#EAD3CC]/40 rounded-xl p-2.5 flex flex-col items-center justify-center shadow-sm w-20">
                <svg viewBox="0 0 64 64" className="w-8 h-8" fill="none" stroke="#8C4A3A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="24" cy="24" r="10" fill="#FFF4E0" />
                  <path d="M31 31 L 48 48" />
                  <path d="M42 42 L 46 38" />
                </svg>
                <span className="text-[#8C4A3A] font-bold text-[9px] mt-1">Khóa phòng</span>
              </div>
              {/* Tea */}
              <div className="bg-white border border-[#EAD3CC]/40 rounded-xl p-2.5 flex flex-col items-center justify-center shadow-sm w-20">
                <svg viewBox="0 0 64 64" className="w-8 h-8" fill="none" stroke="#8C4A3A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 24 C 16 40, 44 40, 44 24 Z" fill="#FAF5F3" />
                  <line x1="24" y1="14" x2="24" y2="10" strokeWidth="2" />
                  <line x1="30" y1="16" x2="30" y2="11" strokeWidth="2" />
                </svg>
                <span className="text-[#8C4A3A] font-bold text-[9px] mt-1">Trà ấm</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('register')}
              className="w-full max-w-xs px-8 py-3 rounded-xl text-white font-bold text-base bg-[#8C4A3A] hover:bg-white hover:text-[#8C4A3A] active:bg-white active:text-[#8C4A3A] shadow-md transition-all duration-200 z-10 cursor-pointer"
            >
              ĐĂNG KÝ THUÊ
            </button>
          </div>

          <div className="h-[1px] w-full bg-[#EAD3CC]/30 z-10"></div>

          {/* Mobile Right - Login */}
          <div className="flex-1 relative flex flex-col items-center justify-center p-6 text-center min-h-[280px] overflow-hidden">
            {/* Overlay for mobile right */}
            <div className="absolute inset-0 bg-[#8C4A3A]/5 pointer-events-none"></div>

            {/* Floating Background Icons - Mobile Right */}
            <div className="absolute inset-0 pointer-events-none select-none z-0">
              {/* Graduation Cap */}
              <div className="absolute top-[8%] right-[6%] animate-float-slow opacity-40">
                <svg viewBox="0 0 64 64" className="w-10 h-10" fill="none" stroke="#8C4A3A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="32 12 56 22 32 32 8 22" fill="#B7705F" strokeWidth="3" />
                </svg>
              </div>
              {/* Books */}
              <div className="absolute top-[28%] left-[6%] animate-float-delayed opacity-40">
                <svg viewBox="0 0 64 64" className="w-8 h-8" fill="none" stroke="#8C4A3A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="14" y="38" width="36" height="12" rx="2" fill="#B7705F" />
                  <rect x="18" y="28" width="30" height="10" rx="2" fill="#FAF5F3" />
                </svg>
              </div>
              {/* Sprout */}
              <div className="absolute bottom-[10%] right-[8%] animate-float-fast opacity-40">
                <svg viewBox="0 0 64 64" className="w-8 h-8" fill="none" stroke="#8C4A3A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M32 44 Q 32 26, 38 18" stroke="#7A8B63" strokeWidth="3" />
                  <path d="M34 28 Q 44 26, 42 18 Q 34 22, 34 28" fill="#A1B48D" stroke="#7A8B63" strokeWidth="2" />
                </svg>
              </div>
            </div>

            <div className="z-10 mb-4 text-center">
              <span className="text-[10px] font-bold text-[#8C4A3A]/60 uppercase tracking-wider bg-[#8C4A3A]/5 px-2.5 py-0.5 rounded-full">Thành viên Dorm</span>
              <h3 className="text-base font-bold text-[#8C4A3A] mt-1">Đăng nhập tài khoản</h3>
            </div>

            <div className="flex gap-3 mb-6 z-10">
              {/* Lamp */}
              <div className="bg-white border border-[#EAD3CC]/40 rounded-xl p-2.5 flex flex-col items-center justify-center shadow-sm w-20">
                <svg viewBox="0 0 64 64" className="w-8 h-8" fill="none" stroke="#8C4A3A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 36 L 42 36 L 38 18 L 26 18 Z" fill="#B7705F" />
                  <polygon points="32 36 12 56 52 56" fill="#FFF4E0" opacity="0.25" stroke="none" />
                </svg>
                <span className="text-[#8C4A3A] font-bold text-[9px] mt-1">Đèn ấm</span>
              </div>
              {/* Cat */}
              <div className="bg-white border border-[#EAD3CC]/40 rounded-xl p-2.5 flex flex-col items-center justify-center shadow-sm w-20">
                <svg viewBox="0 0 64 64" className="w-8 h-8" fill="none" stroke="#8C4A3A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <ellipse cx="32" cy="40" rx="16" ry="10" fill="#FAF5F3" />
                  <circle cx="42" cy="34" r="7" fill="#FAF5F3" />
                </svg>
                <span className="text-[#8C4A3A] font-bold text-[9px] mt-1">Mèo con</span>
              </div>
              {/* Calendar */}
              <div className="bg-white border border-[#EAD3CC]/40 rounded-xl p-2.5 flex flex-col items-center justify-center shadow-sm w-20">
                <svg viewBox="0 0 64 64" className="w-8 h-8" fill="none" stroke="#8C4A3A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="16" y="18" width="32" height="32" rx="4" fill="#FAF5F3" />
                  <path d="M32 38 C 31 36, 29 36, 29 38 C 29 40, 32 42, 32 42 C 32 42, 35 40, 35 38 C 35 36, 33 36, 32 38 Z" fill="#B7705F" stroke="none" />
                </svg>
                <span className="text-[#8C4A3A] font-bold text-[9px] mt-1">Ngày vui</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('login')}
              className="w-full max-w-xs px-8 py-3 rounded-xl text-[#8C4A3A] font-bold text-base bg-white hover:bg-[#8C4A3A] hover:text-white active:bg-[#723a2d] active:text-white shadow-md transition-all duration-200 z-10 cursor-pointer"
            >
              ĐĂNG NHẬP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
