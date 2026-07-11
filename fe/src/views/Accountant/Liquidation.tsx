import { ArrowLeft, Printer, CheckCircle } from 'lucide-react';

export default function Liquidation() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 cursor-pointer transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Trở về Chi tiết Phòng
        </div>
        <div className="flex items-center text-[#B7705F] font-semibold text-lg">
           <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
           HomeStay Dorm
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Title area */}
        <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between bg-white">
           <div>
              <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1">Thanh lý hợp đồng</h1>
              <p className="text-sm font-medium text-gray-500">Phòng: <span className="text-[#B7705F]">A204</span> | Khách: Nguyễn Văn A</p>
           </div>
           <div className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm font-medium">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              Hành động không thể hoàn tác
           </div>
        </div>

        {/* Content area */}
        <div className="p-8 bg-[#FAF5F3]/30">
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Deposit Card */}
              <div className="bg-[#FAF5F3] border border-[#EAD3CC] rounded-xl p-8 flex flex-col justify-center">
                 <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tiền cọc ban đầu</p>
                 <p className="text-4xl font-bold text-[#B7705F]">5,000,000<span className="text-2xl underline align-top ml-1">đ</span></p>
              </div>

              {/* Deductions Card */}
              <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6">
                 <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Các khoản khấu trừ</p>
                 
                 <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                       <span className="text-gray-600">Hư hỏng tài sản (Gương nhà tắm)</span>
                       <span className="font-semibold text-gray-900">-350,000đ</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                       <span className="text-gray-600">Điện/Nước chưa thanh toán (T10)</span>
                       <span className="font-semibold text-gray-900">-450,000đ</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                       <span className="text-gray-600">Phí vệ sinh</span>
                       <span className="font-semibold text-gray-900">-220,000đ</span>
                    </div>
                 </div>

                 <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="font-semibold text-gray-900">Tổng khấu trừ</span>
                    <span className="font-bold text-red-500 text-lg">-1,020,000<span className="underline ml-0.5">đ</span></span>
                 </div>
              </div>
           </div>

           {/* Total Return Card */}
           <div className="bg-[#F3E1DC]/30 border-2 border-[#D29F91] rounded-xl p-8 flex flex-col md:flex-row md:items-center justify-between mb-8 shadow-sm">
              <div>
                 <h2 className="text-xl font-bold text-gray-900 mb-1">Tổng tiền hoàn trả cho khách</h2>
                 <p className="text-sm font-medium text-gray-500">Tiền cọc - Tổng khấu trừ</p>
              </div>
              <div className="mt-4 md:mt-0">
                 <p className="text-4xl font-bold text-[#B7705F]">3,980,000<span className="text-2xl underline align-top ml-1">đ</span></p>
              </div>
           </div>

           {/* Checkbox Agreement */}
           <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-8">
              <div className="flex items-center text-lg font-bold text-gray-900 mb-3">
                 <svg className="w-5 h-5 mr-2 text-[#B7705F]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                 Biên bản thanh lý hợp đồng
              </div>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                 Quản lý và khách thuê xác nhận đã kiểm tra phòng, thống nhất các khoản khấu trừ và số tiền hoàn trả cuối cùng.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-[#B7705F] focus:ring-[#B7705F] mr-3" />
                    <span className="font-medium text-gray-900">Xác nhận của Khách thuê</span>
                 </label>
                 <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-[#B7705F] focus:ring-[#B7705F] mr-3" />
                    <span className="font-medium text-gray-900">Xác nhận của Quản lý</span>
                 </label>
              </div>
           </div>

        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-gray-100 bg-white flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
           <button className="flex items-center justify-center px-8 py-3.5 border border-[#D29F91] text-[#B7705F] font-medium rounded-xl hover:bg-[#F3E1DC]/30 transition-colors bg-white">
              <Printer className="w-4 h-4 mr-2" /> In Biên bản
           </button>
           <button className="flex items-center justify-center px-8 py-3.5 bg-[#B7705F] text-white font-medium rounded-xl hover:bg-[#a06050] transition-colors shadow-sm">
              <CheckCircle className="w-4 h-4 mr-2" /> Xác nhận kết thúc lưu trú & Giải phóng phòng
           </button>
        </div>
      </div>
    </div>
  );
}
