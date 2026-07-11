import React from 'react';
import { Download, Check, X, ShieldCheck } from 'lucide-react';

export default function ViewContract() {
  return (
    <div className="max-w-4xl mx-auto w-full pb-12">
      {/* Header */}
      <div className="pt-8 pb-6 flex justify-between items-center">
         <div>
            <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1">Xem hợp đồng thuê</h1>
            <p className="text-sm text-[#666666]">
               Vui lòng đọc kỹ các điều khoản trước khi xác nhận ký.
            </p>
         </div>
         <button className="flex items-center px-4 py-2 bg-white border border-[#EAD3CC] rounded-lg text-sm font-medium text-[#B7705F] hover:bg-[#FAF5F3] transition-colors shadow-sm">
            <Download className="w-4 h-4 mr-2" />
            Tải bản PDF
         </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#EAD3CC] overflow-hidden">
        {/* Contract Document Area */}
        <div className="p-8 md:p-12 border-b border-[#EAD3CC]/50">
          <div className="text-sm leading-relaxed text-[#222222]" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
             <h3 className="text-center font-bold mb-1">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h3>
             <h4 className="text-center font-bold mb-6 underline decoration-1 underline-offset-4">Độc lập - Tự do - Hạnh phúc</h4>
             <h2 className="text-center font-bold text-base mb-1">Hợp đồng thuê phòng</h2>
             <p className="text-center italic text-gray-600 mb-8">Số: 2024/HD-P102</p>
             
             <p className="mb-4">Hôm nay, ngày 24 tháng 10 năm 2024, tại HomeStay Dorm, chúng tôi gồm:</p>
             
             <div className="mb-4">
                <p className="font-bold mb-1">BÊN CHO THUÊ (BÊN A):</p>
                <p>Đại diện: Ông Nguyễn Văn Quản Lý</p>
                <p>Chức vụ: Giám đốc chi nhánh</p>
                <p>Điện thoại: 0909 123 456</p>
             </div>
             
             <div className="mb-6">
                <p className="font-bold mb-1">BÊN THUÊ (BÊN B):</p>
                <p>Ông/Bà: Trần Thị Sinh Viên</p>
                <p>CCCD số: 079123456789</p>
                <p>Điện thoại: 0987 654 321</p>

                <div className="mt-3">
                   <p className="font-semibold italic mb-1">Cùng các thành viên lưu trú sau:</p>
                   <ul className="list-disc pl-5 space-y-1">
                      <li>Ông/Bà: Nguyễn Văn Bạn - CCCD: 012345678901 - SĐT: 0912 345 678</li>
                   </ul>
                </div>
             </div>
             
             <p className="font-bold mb-2">ĐIỀU 1: NỘI DUNG THUÊ</p>
             <p className="mb-2">Bên A đồng ý cho Bên B thuê phòng số 102 tại địa chỉ: Tòa nhà HomeStay Dorm.</p>
             <p className="mb-2">Giá thuê: 3,500,000 VNĐ/tháng (Ba triệu năm trăm nghìn đồng).</p>
             <p className="mb-2">Tiền cọc: 3,500,000 VNĐ (Đã nhận đủ).</p>
             <p className="mb-6">Thời hạn thuê: 12 tháng, từ ngày 01/11/2024 đến 01/11/2025.</p>
             
             <p className="font-bold mb-2">ĐIỀU 2: CHI PHÍ DỊCH VỤ VÀ THANH TOÁN</p>
             <p className="mb-1">- Tiền điện: 3,500đ/kWh</p>
             <p className="mb-1">- Tiền nước: 20,000đ/m³</p>
             <p className="mb-1">- Internet: 100,000đ/tháng</p>
             <p className="mb-8 mt-4">Kỳ thanh toán: Từ ngày 01 đến ngày 05 hàng tháng.</p>
             
             <div className="grid grid-cols-2 text-center text-xs">
                <div>
                   <p className="font-bold mb-1">ĐẠI DIỆN BÊN A</p>
                   <p className="italic text-gray-500 mb-2">(Ký, ghi rõ họ tên)</p>
                </div>
                <div>
                   <p className="font-bold mb-1">ĐẠI DIỆN BÊN B</p>
                   <p className="italic text-gray-500 mb-2">(Ký, ghi rõ họ tên)</p>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
