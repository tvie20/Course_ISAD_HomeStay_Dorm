import { useState } from 'react';

// Reuse similar structure to GuestRegistration but slightly adapted for Admin view
export default function AdminRegistration() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
         <div className="flex items-center text-sm font-medium text-gray-500 mb-2">
            <span>Home</span>
            <svg className="w-4 h-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span>Guests</span>
            <svg className="w-4 h-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-[#B7705F]">Registration</span>
         </div>
         <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1">Phiếu đăng ký thuê phòng</h1>
         <p className="text-gray-500 text-sm">Vui lòng điền đầy đủ thông tin để hoàn tất thủ tục đăng ký.</p>
      </div>

      <div className="space-y-6 max-w-4xl">
        {/* Section 1 */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-[#F3E1DC] flex items-center justify-center text-[#B7705F]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <h2 className="text-lg font-medium text-gray-900">1. thông tin khách hàng</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
               <label className="block text-sm font-medium mb-1.5 text-gray-700">Họ và tên đầy đủ <span className="text-[#B7705F]">*</span></label>
               <input type="text" placeholder="Nhập họ và tên" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B7705F]/20 focus:border-[#B7705F] text-sm" />
            </div>
            <div>
               <label className="block text-sm font-medium mb-1.5 text-gray-700">Giới tính <span className="text-[#B7705F]">*</span></label>
               <select className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B7705F]/20 focus:border-[#B7705F] text-sm appearance-none">
                  <option>Chọn</option>
                  <option>Nam</option>
                  <option>Nữ</option>
               </select>
            </div>
            <div>
               <label className="block text-sm font-medium mb-1.5 text-gray-700">Ngày sinh <span className="text-[#B7705F]">*</span></label>
               <input type="text" defaultValue="dd/mm/yyyy" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B7705F]/20 focus:border-[#B7705F] text-sm" />
            </div>
            <div>
               <label className="block text-sm font-medium mb-1.5 text-gray-700">Số CCCD / Hộ chiếu <span className="text-[#B7705F]">*</span></label>
               <input type="text" placeholder="Nhập số CCCD/Hộ chiếu" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B7705F]/20 focus:border-[#B7705F] text-sm" />
            </div>
            <div>
               <label className="block text-sm font-medium mb-1.5 text-gray-700">Quốc tịch</label>
               <input type="text" defaultValue="Việt Nam" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B7705F]/20 focus:border-[#B7705F] text-sm" />
            </div>
            <div>
               <label className="block text-sm font-medium mb-1.5 text-gray-700">Số điện thoại <span className="text-[#B7705F]">*</span></label>
               <input type="text" defaultValue="090 123 4567" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B7705F]/20 focus:border-[#B7705F] text-sm" />
            </div>
            <div>
               <label className="block text-sm font-medium mb-1.5 text-gray-700">Email</label>
               <input type="text" defaultValue="example@email.com" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B7705F]/20 focus:border-[#B7705F] text-sm" />
            </div>
            <div className="md:col-span-2">
               <label className="block text-sm font-medium mb-1.5 text-gray-700">Địa chỉ thường trú</label>
               <input type="text" placeholder="Số nhà, Đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B7705F]/20 focus:border-[#B7705F] text-sm" />
            </div>
            <div className="md:col-span-2">
               <label className="block text-sm font-medium mb-1.5 text-gray-700">Nghề nghiệp / Trường học / Nơi làm việc</label>
               <input type="text" defaultValue="Sinh viên Đại học Bách Khoa / Nhân viên IT" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B7705F]/20 focus:border-[#B7705F] text-sm" />
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-[#F3E1DC] flex items-center justify-center text-[#B7705F]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            </div>
            <h2 className="text-lg font-medium text-gray-900">2. yêu cầu thuê phòng</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="md:col-span-2">
               <label className="block text-sm font-medium mb-1.5 text-gray-700">Số lượng người ở <span className="text-[#B7705F]">*</span></label>
               <input type="number" defaultValue="1" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B7705F]/20 focus:border-[#B7705F] text-sm" />
            </div>
            <div>
               <label className="block text-sm font-medium mb-1.5 text-gray-700">Khu vực mong muốn</label>
               <select className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B7705F]/20 focus:border-[#B7705F] text-sm appearance-none">
                  <option>Chọn chi nhánh</option>
               </select>
            </div>
            <div>
               <label className="block text-sm font-medium mb-1.5 text-gray-700">Loại phòng <span className="text-[#B7705F]">*</span></label>
               <select className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B7705F]/20 focus:border-[#B7705F] text-sm appearance-none">
                  <option>Chọn loại phòng</option>
               </select>
            </div>
            <div>
               <label className="block text-sm font-medium mb-1.5 text-gray-700">Ngày dự kiến chuyển vào <span className="text-[#B7705F]">*</span></label>
               <input type="text" defaultValue="dd/mm/yyyy" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B7705F]/20 focus:border-[#B7705F] text-sm" />
            </div>
            <div>
               <label className="block text-sm font-medium mb-1.5 text-gray-700">Mức giá dự kiến (VNĐ/tháng)</label>
               <select className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B7705F]/20 focus:border-[#B7705F] text-sm appearance-none">
                  <option>Chọn mức giá</option>
               </select>
            </div>
            <div>
               <label className="block text-sm font-medium mb-1.5 text-gray-700">Thời gian thuê dự kiến <span className="text-[#B7705F]">*</span></label>
               <select className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B7705F]/20 focus:border-[#B7705F] text-sm appearance-none">
                  <option>Chọn thời gian</option>
               </select>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-[#F3E1DC] flex items-center justify-center text-[#B7705F]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </div>
            <h2 className="text-lg font-medium text-gray-900">3. yêu cầu khác</h2>
          </div>

          <div>
             <label className="block text-sm font-medium mb-1.5 text-gray-700">Ghi chú / Yêu cầu đặc biệt</label>
             <textarea 
               rows={4} 
               placeholder="Nhập các yêu cầu khác (ví dụ: cần phòng có ban công, có nuôi thú cưng nhỏ...)" 
               className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B7705F]/20 focus:border-[#B7705F] text-sm resize-none"
             />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
           <button className="px-8 py-2.5 rounded-lg bg-white border border-[#D29F91] text-[#B7705F] font-medium hover:bg-[#F3E1DC]/30 transition-colors">
              Hủy
           </button>
           <button className="px-8 py-2.5 rounded-lg bg-[#B7705F] text-white font-medium hover:bg-[#a06050] transition-colors">
              Gửi yêu cầu
           </button>
        </div>
      </div>
    </div>
  );
}
