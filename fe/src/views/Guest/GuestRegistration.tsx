import { useState } from 'react';
import { Home, BedDouble } from 'lucide-react';

export default function GuestRegistration({ onReturn }: { onReturn?: () => void }) {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    setShowSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#F9F7F6] pb-12 flex flex-col">
      {/* Header */}
      <div className="pt-12 pb-8 text-center max-w-4xl mx-auto w-full">
         <div className="w-12 h-12 bg-[#B7705F] rounded-full flex items-center justify-center mx-auto mb-4">
             <Home className="text-white w-6 h-6" />
         </div>
         <h1 className="text-3xl font-bold text-[#8C4A3A] mb-2">Đăng ký thuê phòng - Homestay Dorm</h1>
         <p className="text-gray-500 text-sm">Chào mừng bạn đến với HomeStay Dorm. Vui lòng điền thông tin bên dưới để gửi yêu cầu.</p>
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto w-full px-4 space-y-6 flex-1">
        
        {/* Section 1 */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-[#F3E1DC] flex items-center justify-center text-[#B7705F]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <h2 className="text-lg font-medium text-gray-900">Thông tin cá nhân</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
               <label className="block text-sm font-medium mb-1.5 text-gray-700">Họ và tên đầy đủ <span className="text-[#B7705F]">*</span></label>
               <input type="text" defaultValue="Nguyễn Văn A" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B7705F]/20 focus:border-[#B7705F] text-sm" />
            </div>
            <div>
               <label className="block text-sm font-medium mb-1.5 text-gray-700">Giới tính <span className="text-[#B7705F]">*</span></label>
               <select className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B7705F]/20 focus:border-[#B7705F] text-sm appearance-none">
                  <option>Chọn giới tính</option>
                  <option>Nam</option>
                  <option>Nữ</option>
               </select>
            </div>
            <div>
               <label className="block text-sm font-medium mb-1.5 text-gray-700">Ngày sinh <span className="text-[#B7705F]">*</span></label>
               <input type="date" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B7705F]/20 focus:border-[#B7705F] text-sm" />
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
               <input type="text" placeholder="090 123 4567" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B7705F]/20 focus:border-[#B7705F] text-sm" />
            </div>
            <div>
               <label className="block text-sm font-medium mb-1.5 text-gray-700">Email <span className="text-[#B7705F]">*</span></label>
               <input type="email" placeholder="example@email.com" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B7705F]/20 focus:border-[#B7705F] text-sm" />
            </div>
            <div className="md:col-span-2">
               <label className="block text-sm font-medium mb-1.5 text-gray-700">Địa chỉ thường trú</label>
               <input type="text" placeholder="Số nhà, Đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B7705F]/20 focus:border-[#B7705F] text-sm" />
            </div>
            <div className="md:col-span-2">
               <label className="block text-sm font-medium mb-1.5 text-gray-700">Nghề nghiệp / Trường học / Nơi làm việc</label>
               <input type="text" placeholder="Sinh viên Đại học Bách Khoa / Nhân viên IT" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B7705F]/20 focus:border-[#B7705F] text-sm" />
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-[#F3E1DC] flex items-center justify-center text-[#B7705F]">
              <BedDouble className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-medium text-gray-900">Nhu cầu lưu trú</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
               <label className="block text-sm font-medium mb-1.5 text-gray-700">Khu vực / Chi nhánh mong muốn <span className="text-[#B7705F]">*</span></label>
               <select className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B7705F]/20 focus:border-[#B7705F] text-sm appearance-none">
                  <option value="">Chọn chi nhánh</option>
                  <option value="CN Quận 1">Homestay Central Park (Q.Bình Thạnh)</option>
                  <option value="CN Quận 3">Sunrise Riverside (Nhà Bè)</option>
               </select>
            </div>
            <div>
               <label className="block text-sm font-medium mb-1.5 text-gray-700">Loại phòng <span className="text-[#B7705F]">*</span></label>
               <select className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B7705F]/20 focus:border-[#B7705F] text-sm appearance-none">
                  <option value="">Chọn loại phòng</option>
                  <option value="2">Phòng 2 người</option>
                  <option value="4">Phòng 4 người</option>
                  <option value="6">Phòng 6 người</option>
               </select>
            </div>
            <div>
               <label className="block text-sm font-medium mb-1.5 text-gray-700">Mức giá dự kiến (VNĐ/tháng)</label>
               <select className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B7705F]/20 focus:border-[#B7705F] text-sm appearance-none">
                  <option value="">Chọn mức giá</option>
                  <option value="1tr-1.5tr">1.000.000 - 1.500.000 đ</option>
                  <option value="1.5tr-2tr">1.500.000 - 2.000.000 đ</option>
                  <option value=">2tr">Trên 2.000.000 đ</option>
               </select>
            </div>
            <div>
               <label className="block text-sm font-medium mb-1.5 text-gray-700">Số lượng người dự kiến ở <span className="text-[#B7705F]">*</span></label>
               <input type="number" min="1" placeholder="Ví dụ: 1" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B7705F]/20 focus:border-[#B7705F] text-sm" />
            </div>
            <div>
               <label className="block text-sm font-medium mb-1.5 text-gray-700">Ngày dự kiến chuyển vào <span className="text-[#B7705F]">*</span></label>
               <input type="date" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B7705F]/20 focus:border-[#B7705F] text-sm" />
            </div>
            <div>
               <label className="block text-sm font-medium mb-1.5 text-gray-700">Thời gian thuê dự kiến <span className="text-[#B7705F]">*</span></label>
               <select className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B7705F]/20 focus:border-[#B7705F] text-sm appearance-none">
                  <option value="">Chọn thời gian</option>
                  <option value="3">3 tháng</option>
                  <option value="6">6 tháng</option>
                  <option value="12">1 năm</option>
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
            <h2 className="text-lg font-medium text-gray-900">Ghi chú & yêu cầu khác</h2>
          </div>

          <div>
             <label className="block text-sm font-medium mb-1.5 text-gray-700">Ghi chú / Yêu cầu đặc biệt</label>
             <textarea 
               rows={4} 
               placeholder="Nhập các yêu cầu khác (ví dụ: cần phòng có ban công, có nuôi thú cưng nhỏ, yêu cầu bạn cùng phòng...)" 
               className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B7705F]/20 focus:border-[#B7705F] text-sm resize-none"
             />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-4">
           <button onClick={handleSubmit} className="px-8 py-3 rounded-lg bg-[#B7705F] text-white font-medium hover:bg-[#a06050] transition-colors">
              Gửi yêu cầu
           </button>
        </div>

      </div>

      {/* Footer */}
      <footer className="mt-16 bg-[#F3EBE9] py-8 text-sm text-gray-500">
         <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
            <p>© 2024 HomeStay Dorm. All rights reserved.</p>
            <div className="flex space-x-6">
               <a href="#" className="hover:text-gray-900">Hỗ trợ</a>
               <a href="#" className="hover:text-gray-900">Chính sách bảo mật</a>
               <a href="#" className="hover:text-gray-900">Điều khoản</a>
            </div>
         </div>
      </footer>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden text-center mx-4">
            <div className="p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Gửi thành công!</h2>
              <p className="text-gray-600 mb-6 font-medium">Yêu cầu đăng ký của bạn đã được gửi. Chúng tôi sẽ sớm liên hệ lại với bạn.</p>
              <button 
                onClick={() => {
                  setShowSuccess(false);
                  if (onReturn) onReturn();
                }}
                className="w-full px-5 py-3 bg-[#B7705F] text-white font-medium rounded-lg shadow-sm hover:bg-[#a06050] transition-colors"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
