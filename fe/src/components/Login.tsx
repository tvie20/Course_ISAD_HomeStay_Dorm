import React, { useState } from 'react';
import { Home, Eye, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface LoginProps {
  onLogin: (username: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'guest' | 'staff'>('staff');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      let finalUsername = username.trim();
      // Prefix with 'guest' if customer is selected and doesn't already have a valid prefix to satisfy App.tsx logic for mockup
      if (userType === 'guest' && !finalUsername.toLowerCase().startsWith('guest')) {
        finalUsername = 'guest_' + finalUsername;
      }
      onLogin(finalUsername);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF5F3] p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="pt-10 pb-6 text-center text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-[#EAD3CC] overflow-hidden shadow-sm">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain p-2" />
          </div>
          <h1 className="text-3xl font-bold text-[#8C4A3A]">HomeStay</h1>
          <p className="text-xl font-medium text-[#B7705F] mb-2">Dorm</p>
          <p className="text-gray-500 text-sm">Đăng nhập hệ thống</p>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100 w-full mb-6" />

        {/* Form */}
        <form onSubmit={handleLogin} className="px-8 pb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-900">
                {userType === 'staff' ? 'Tên đăng nhập' : 'Email / SĐT Khách hàng'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={userType === 'staff' ? "Nhập tên đăng nhập" : "Nhập email hoặc SĐT"}
                  className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B7705F]/20 focus:border-[#B7705F] text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-900">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={password ? "text" : "password"} // Just for visual in mockup
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B7705F]/20 focus:border-[#B7705F] text-sm transition-colors"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-6 pt-2 pb-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" checked={userType === 'staff'} onChange={() => setUserType('staff')} className="text-[#B7705F] focus:ring-[#B7705F]" />
                <span className="text-sm font-medium text-gray-700">Nhân viên</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" checked={userType === 'guest'} onChange={() => setUserType('guest')} className="text-[#B7705F] focus:ring-[#B7705F]" />
                <span className="text-sm font-medium text-gray-700">Khách hàng</span>
              </label>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-[#B7705F] focus:ring-[#B7705F]" />
                <span className="text-sm text-gray-600">Ghi nhớ đăng nhập</span>
              </label>
              <a href="#" className="text-sm text-[#B7705F] hover:underline font-medium">Quên mật khẩu?</a>
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-4 bg-[#B7705F] hover:bg-[#a06050] text-white rounded-lg flex justify-center items-center font-medium transition-colors"
            >
              Đăng nhập
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-gray-50/80 p-6 border-t border-gray-100 flex flex-col items-center justify-center space-y-4">
          <a href="#" className="text-xs text-gray-500 flex items-center hover:text-gray-800 transition-colors">
            <HelpCircle className="w-3.5 h-3.5 mr-1" />
            Hỗ trợ kỹ thuật cho nhân viên
          </a>
        </div>
      </div>
    </div>
  );
}
