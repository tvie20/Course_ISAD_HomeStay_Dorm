import React, { useState } from 'react';
import { Home, Users, BedDouble, CreditCard, Settings, LogOut, FileSignature, Calendar, Key, ClipboardCheck, FileBarChart, Bell, User } from 'lucide-react';
import { cn } from '../lib/utils';

export type Role = 'admin' | 'sale' | 'accountant' | 'manager' | 'guest';

export const MENUS: Record<Role, { id: string, label: string, icon: React.ElementType }[]> = {
  admin: [
    { id: 'branches', label: 'Quản lý chi nhánh', icon: Home },
    { id: 'rooms', label: 'Quản lý phòng & giường', icon: BedDouble },
    { id: 'users', label: 'Quản lý người dùng', icon: Users },
    { id: 'assets_management', label: 'Quản lý tài sản', icon: Settings },
  ],
  sale: [
    { id: 'schedule', label: 'Xếp lịch xem phòng', icon: Calendar },
    { id: 'initial_payments', label: 'Tiếp nhận cọc', icon: CreditCard },
    { id: 'checkin', label: 'Xếp lịch nhận phòng', icon: Key },
    { id: 'leases', label: 'Lập hợp đồng', icon: FileSignature },
    { id: 'room_status', label: 'Tra cứu tình trạng phòng giường', icon: BedDouble },
  ],
  accountant: [
    { id: 'reconciliation', label: 'Lập phiếu đối soát', icon: FileBarChart },
  ],
  manager: [
    { id: 'room_inspection', label: 'Kiểm tra phòng', icon: ClipboardCheck },
    { id: 'room_handover', label: 'Bàn giao phòng', icon: Home },
    { id: 'checkout', label: 'Trả phòng', icon: LogOut },
    { id: 'assets_management', label: 'Quản lý tài sản', icon: Settings },
  ],
  guest: [
    { id: 'view_contract', label: 'Hợp đồng thuê', icon: FileSignature },
    { id: 'service_payment', label: 'Thanh toán dịch vụ', icon: CreditCard },
    { id: 'checkout_request', label: 'Yêu cầu trả phòng', icon: LogOut },
  ]
};

export const ROLE_TITLES: Record<Role, { title: string, subtitle: string }> = {
  admin: { title: 'HomeStay Dorm', subtitle: 'Quản trị viên' },
  sale: { title: 'HomeStay Dorm', subtitle: 'Nhân viên kinh doanh' },
  accountant: { title: 'HomeStay Dorm', subtitle: 'Nhân viên kế toán' },
  manager: { title: 'HomeStay Dorm', subtitle: 'Nhân viên quản lý' },
  guest: { title: 'HomeStay Dorm', subtitle: 'Khách hàng' },
};

interface SidebarProps {
  role: Role;
  username: string;
  activeMenu: string;
  onMenuSelect: (id: string) => void;
  onLogout: () => void;
}

export default function Sidebar({ role, username, activeMenu, onMenuSelect, onLogout }: SidebarProps) {
  const menuList = MENUS[role] || [];
  const titles = ROLE_TITLES[role] || ROLE_TITLES.guest;
  
  // username đã được truyền là HoTen thật từ App.tsx
  const displayName = username || '---';

  return (
    <div className="w-[300px] bg-[#EAD3CC]/30 h-screen flex flex-col border-r border-[#EAD3CC]/50 fixed left-0 top-0">
      {/* Unified Header Profile / Logo Area */}
      <div className="p-6 pb-4 border-b border-[#EAD3CC]/50">
         <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
               <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-[#EAD3CC] overflow-hidden">
                  <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain p-1" />
               </div>
               <div>
                  <h2 className="font-semibold text-base text-[#8C4A3A] leading-tight">{titles.title}</h2>
                  <p className="text-[11px] text-[#B7705F] font-bold mt-0.5 uppercase tracking-wider">{titles.subtitle}</p>
               </div>
            </div>
            
            {/* Notification Bell directly on the menu bar */}
            <button className="text-gray-500 hover:text-[#8C4A3A] relative shrink-0 p-1.5 rounded-full hover:bg-white/50 transition-all">
               <Bell className="w-5 h-5" />
               <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
         </div>

         {/* Username display directly under the role */}
         <div className="flex items-center space-x-2 pt-2 border-t border-[#EAD3CC]/30">
            <div className="w-6 h-6 bg-[#B7705F]/10 rounded-full flex items-center justify-center text-[#B7705F]">
               <User className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
               <p className="text-xs font-bold text-gray-700 truncate">{displayName}</p>
               {role === 'guest' && <p className="text-[10px] text-gray-400">Phòng P.302 - Giường 01</p>}
            </div>
         </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 space-y-1 overflow-y-auto pb-4 pt-4">
        {menuList.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onMenuSelect(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
                isActive 
                  ? "bg-white text-[#B7705F] shadow-sm border border-[#EAD3CC]" 
                  : "text-gray-600 hover:bg-white/50 hover:text-gray-900"
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Footer Area */}
      <div className="px-4 pb-6 pt-4 mt-auto">
         {role === 'guest' && (
            <button className="w-full mb-4 py-2.5 bg-[#B7705F] hover:bg-[#a06050] text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center">
               <Settings className="w-4 h-4 mr-2" /> Hỗ trợ khẩn cấp
            </button>
         )}
         {role === 'admin' && (
            <button className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-white/50 transition-colors">
               <Settings className="w-5 h-5" />
               <span>Cài đặt hệ thống</span>
            </button>
         )}
         <button className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-white/50 transition-colors">
            <Settings className="w-5 h-5" />
            <span>Hỗ trợ</span>
         </button>
         <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium text-[#B7705F] hover:bg-[#F3E1DC] transition-colors mt-1"
         >
            <LogOut className="w-5 h-5" />
            <span>Đăng xuất</span>
         </button>
      </div>
    </div>
  );
}
