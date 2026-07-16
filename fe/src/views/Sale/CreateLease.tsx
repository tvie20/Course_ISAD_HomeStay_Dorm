import React, { useState, useEffect } from 'react';
import API_URL from '../../api';
import { X, Printer, Zap, Droplets, Wifi, ParkingCircle, CheckCircle } from 'lucide-react';

export default function CreateLease({ onCancel, onSuccess, initialData }: { onCancel: () => void, onSuccess?: () => void, initialData?: any }) {
   const availableBeds = initialData?.isFullRoom 
      ? Array.from({ length: initialData?.maxCount || 4 }).map((_, i) => `Giường 0${i + 1}`) 
      : (initialData?.beds && initialData.beds.length > 0 ? initialData.beds : ['Giường 01']);
   const [selectedBed, setSelectedBed] = useState(availableBeds[0]);
   const [customerName, setCustomerName] = useState(initialData?.customer || "Trần Thị Sinh Viên");
   const [customerPhone, setCustomerPhone] = useState((initialData?.phone || "0987654321").replace(/\D/g, ''));
   const [customerCccd, setCustomerCccd] = useState(initialData?.cccd || "079123456789");
   const [leaseDuration, setLeaseDuration] = useState('12');
   const [showSaveSuccess, setShowSaveSuccess] = useState(false);
   const roommates = initialData?.roommates || [];
   const [roommateBeds, setRoommateBeds] = useState<string[]>(roommates.map(() => ''));

   const [managerInfo, setManagerInfo] = useState({ name: 'Đang tải...', phone: '...' });

   useEffect(() => {
      // Lấy branchId từ initialData (deposit có thể có branchId trực tiếp)
      const branchId = initialData?.branchId || initialData?.branch_id;
      if (branchId) {
         fetch(`${API_URL}/api/v1/branches`)
            .then(res => res.json())
            .then(data => {
               if (data.status === 'success') {
                  const branch = data.data.find((b: any) => b.id === branchId);
                  if (branch) {
                     setManagerInfo({ name: branch.manager || 'Chưa cập nhật', phone: branch.managerPhone || branch.hotline || 'Chưa cập nhật' });
                  } else {
                     setManagerInfo({ name: 'Chưa cập nhật', phone: 'Chưa cập nhật' });
                  }
               }
            })
            .catch(err => {
               console.error(err);
               setManagerInfo({ name: 'Lỗi tải dữ liệu', phone: 'Lỗi' });
            });
      } else {
         // Nếu không có branchId, thử fetch tất cả branches và lấy cái đầu tiên
         fetch(`${API_URL}/api/v1/branches`)
            .then(res => res.json())
            .then(data => {
               if (data.status === 'success' && data.data.length > 0) {
                  const branch = data.data[0];
                  setManagerInfo({ name: branch.manager || 'Chưa cập nhật', phone: branch.managerPhone || branch.hotline || 'Chưa cập nhật' });
               } else {
                  setManagerInfo({ name: 'Chưa cập nhật', phone: 'Chưa cập nhật' });
               }
            })
            .catch(() => setManagerInfo({ name: 'Chưa cập nhật', phone: 'Chưa cập nhật' }));
      }
   }, [initialData?.branchId, initialData?.branch_id]);

   const handleSaveContract = async () => {
      try {
         const startDate = new Date();
         const endDate = new Date();
         endDate.setMonth(endDate.getMonth() + parseInt(leaseDuration));
         
         const payload = {
            DepositID: initialData?.id,
            CustomerID: initialData?.customerId,
            RoomPrice: initialData?.rentPrice || 3500000,
            StartDate: startDate.toISOString().split('T')[0],
            EndDate: endDate.toISOString().split('T')[0],
            roommates: roommates
         };
         
         const res = await fetch(`${API_URL}/api/v1/contracts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
         });
         
         const data = await res.json();
         if (data.status === 'success') {
            setShowSaveSuccess(true);
         } else {
            alert('Lỗi: ' + data.message);
         }
      } catch (err) {
         console.error(err);
         alert('Lỗi kết nối đến máy chủ');
      }
   };

   return (
      <div className="p-8 h-full flex flex-col max-w-7xl mx-auto bg-[#FAF5F3]">
         {/* Header with uniform design styling (#222222 on bold / #666666 for subtitle) */}
         <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#EAD3CC]/50">
            <div>
               <h1 className="text-3xl font-bold text-[#8C4A3A]">Lập hợp đồng thuê phòng &amp; giường</h1>
               <p className="text-sm text-[#666666]">Nhập thông tin thuê chi tiết, phân giường và xuất bản hợp đồng.</p>
            </div>
            <div className="flex space-x-3">
               <button onClick={onCancel} className="px-4 py-2 text-[#666666] hover:text-[#222222] bg-white border border-[#EAD3CC] rounded-xl flex items-center shadow-sm font-medium transition-colors">
                  <X className="w-4 h-4 mr-2" />
                  <span>Hủy</span>
               </button>
               <button
                  onClick={handleSaveContract}
                  className="px-5 py-2.5 bg-[#B7705F] hover:bg-[#A06050] text-white rounded-xl flex items-center shadow-sm font-bold transition-colors"
               >
                  <Printer className="w-4.5 h-4.5 mr-2" />
                  <span>Lưu &amp; in hợp đồng</span>
               </button>
            </div>
         </div>

         {showSaveSuccess && (
            <div className="fixed inset-0 bg-[#222222]/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
               <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-[#EAD3CC]">
                  <div className="p-6 text-center">
                     <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-green-50 text-green-600 mb-4 border border-green-100">
                        <CheckCircle className="h-7 w-7 animate-pulse" />
                     </div>
                     <h3 className="text-xl font-bold text-[#222222] mb-2">
                        Hợp đồng đã được lưu trữ vĩnh viễn!
                     </h3>
                     <p className="text-sm text-[#666666] leading-relaxed mb-6">
                        Biên bản hợp đồng của khách hàng <strong>{customerName.toUpperCase()}</strong> đã được lưu.
                     </p>
                     <div className="flex justify-center">
                        <button
                           type="button"
                           onClick={() => { setShowSaveSuccess(false); onSuccess?.(); }}
                           className="px-6 py-2.5 bg-[#B7705F] hover:bg-[#a06050] text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
                        >
                           Đóng thông báo
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}

         <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
               <div className="bg-white rounded-xl shadow-sm border border-[#EAD3CC]/50 p-6">
                  <div className="flex items-center mb-6">
                     <svg className="w-5 h-5 mr-3 text-[#B7705F]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                     <h2 className="text-lg font-bold text-[#222222]">Thông tin các bên</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="bg-[#FAF5F3] p-4 rounded-xl border border-[#EAD3CC]/30">
                        <h3 className="text-sm font-bold text-[#B7705F] mb-3">Bên A (Bên cho thuê)</h3>
                        <div className="space-y-3">
                           <div>
                              <label className="block text-xs text-[#666666] font-medium mb-1">Đại diện</label>
                              <p className="text-sm text-[#222222] font-semibold">{managerInfo.name}</p>
                           </div>
                           <div>
                              <label className="block text-xs text-[#666666] font-medium mb-1">Chức vụ</label>
                              <p className="text-sm text-[#222222]">Giám đốc chi nhánh</p>
                           </div>
                           <div>
                              <label className="block text-xs text-[#666666] font-medium mb-1">Số điện thoại</label>
                              <p className="text-sm text-[#222222]">{managerInfo.phone}</p>
                           </div>
                        </div>
                     </div>

                     <div className="bg-[#FAF5F3] p-4 rounded-xl border border-[#EAD3CC]/30">
                        <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                           <h3 className="text-sm font-bold text-[#B7705F]">Bên B (Bên thuê)</h3>
                        </div>
                        <div className="space-y-3">
                           <div>
                              <label className="block text-xs text-[#666666] font-medium mb-1">Họ và tên</label>
                              <p className="text-sm text-[#222222] font-semibold">{customerName}</p>
                           </div>
                           <div>
                              <label className="block text-xs text-[#666666] font-medium mb-1">CCCD</label>
                              <p className="text-sm text-[#222222] font-semibold">{customerCccd || "Chưa cung cấp"}</p>
                           </div>
                           <div>
                              <label className="block text-xs text-[#666666] font-medium mb-1">Số điện thoại</label>
                              <p className="text-sm text-[#222222] font-semibold">{customerPhone || "Chưa cung cấp"}</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="bg-white rounded-xl shadow-sm border border-[#EAD3CC]/50 p-6">
                  <div className="flex items-center mb-6 border-b border-[#EAD3CC]/50 pb-4">
                     <svg className="w-5 h-5 mr-3 text-[#B7705F]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                     <h2 className="text-lg font-bold text-[#222222]">Nội dung thuê &amp; dịch vụ (Phòng &amp; Giường)</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                           <div>
                              <label className="block text-xs text-[#666666] font-medium mb-1">Phòng số</label>
                              <div className="flex items-center bg-[#FAF5F3] border border-[#EAD3CC]/50 rounded-xl px-3 py-2">
                                 <span className="text-sm font-bold text-[#222222]">{initialData?.room || '302'}</span>
                              </div>
                           </div>
                           <div>
                              <label className="block text-xs text-[#666666] font-medium mb-1">Giường đại diện</label>
                              <select
                                 value={selectedBed}
                                 onChange={(e) => setSelectedBed(e.target.value)}
                                 className="w-full bg-white border border-[#EAD3CC] rounded-xl text-sm px-3 py-2.5 font-bold text-[#B7705F] outline-none focus:border-[#B7705F]"
                              >
                                 {availableBeds.map((b: string) => (
                                    <option key={b} value={b}>{b}</option>
                                 ))}
                              </select>
                           </div>
                        </div>

                        <div>
                           <label className="block text-xs text-[#666666] font-medium mb-1">Thời hạn thuê (Tháng)</label>
                           <select
                              value={leaseDuration}
                              onChange={(e) => setLeaseDuration(e.target.value)}
                              className="w-full bg-white border border-[#EAD3CC] rounded-xl text-sm px-3 py-2.5 text-[#222222] font-medium outline-none focus:border-[#B7705F]"
                           >
                              <option value="12">12 tháng</option>
                              <option value="6">6 tháng</option>
                           </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="block text-xs font-semibold text-[#666666] mb-2 uppercase tracking-wide">Giá thuê/tháng</label>
                              <input type="text" className="w-full bg-[#FAF5F3] border border-[#EAD3CC]/50 rounded-xl text-sm px-3 py-2.5 font-bold text-[#222222]" defaultValue={initialData?.rentPrice ? initialData.rentPrice.toLocaleString() : "3,500,000"} readOnly />
                           </div>
                           <div>
                              <label className="block text-xs font-semibold text-[#B7705F] mb-2 uppercase tracking-wide">Tiền cọc đã thu</label>
                              <input type="text" className="w-full bg-[#FAF5F3] border border-[#EAD3CC]/50 rounded-xl text-sm px-3 py-2.5 font-bold text-[#B7705F]" defaultValue={initialData?.amount ? initialData.amount.toLocaleString() : "3,500,000"} readOnly />
                           </div>
                        </div>

                        {roommates.length > 0 && (
                           <div className="pt-2">
                              <label className="block text-xs text-[#666666] font-medium mb-2">Khách đăng ký ở cùng (Lấy từ phiếu ĐK)</label>
                              <div className="space-y-2">
                                 {roommates.map((rm: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between p-2 bg-[#F3E1DC]/30 border border-[#EAD3CC] rounded-lg">
                                       <span className="text-sm font-semibold text-[#8C4A3A]">{rm.name || `Người ${idx+1}`}</span>
                                       <select 
                                          value={roommateBeds[idx]}
                                          onChange={(e) => {
                                             const newBeds = [...roommateBeds];
                                             newBeds[idx] = e.target.value;
                                             setRoommateBeds(newBeds);
                                          }}
                                          className="text-xs font-bold text-[#B7705F] bg-white border border-[#EAD3CC] rounded px-2 py-1 focus:outline-none"
                                       >
                                          <option value="">-- Chọn giường --</option>
                                          {availableBeds.map((b: string) => (
                                             <option key={b} value={b}>{b}</option>
                                          ))}
                                       </select>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        )}
                     </div>

                     <div className="bg-[#FAF5F3] rounded-xl border border-[#EAD3CC]/30 p-4">
                        <h3 className="text-xs font-bold text-[#222222] uppercase tracking-wide mb-3 flex items-center">
                           <Zap className="w-4 h-4 mr-2 text-[#B7705F]" />
                           Biểu phí dịch vụ đi kèm
                        </h3>
                        <div className="space-y-3">
                           <div className="flex justify-between items-center text-xs border-b border-gray-100 pb-2">
                              <span className="flex items-center text-[#666666]"><Zap className="w-3.5 h-3.5 mr-1 text-[#B7705F]" /> Điện sinh hoạt</span>
                              <span className="font-bold">3,500đ / kWh</span>
                           </div>
                           <div className="flex justify-between items-center text-xs border-b border-gray-100 pb-2">
                              <span className="flex items-center text-[#666666]"><Droplets className="w-3.5 h-3.5 mr-1 text-[#B7705F]" /> Nước sạch</span>
                              <span className="font-bold">20,000đ / m³</span>
                           </div>
                           <div className="flex justify-between items-center text-xs border-b border-gray-100 pb-2">
                              <span className="flex items-center text-[#666666]"><Wifi className="w-3.5 h-3.5 mr-1 text-[#B7705F]" /> Wifi tốc độ cao</span>
                              <span className="font-bold">100,000đ / phòng</span>
                           </div>
                           <div className="flex justify-between items-center text-xs pt-1">
                              <span className="flex items-center text-[#666666]"><ParkingCircle className="w-3.5 h-3.5 mr-1 text-[#B7705F]" /> Giữ xe máy</span>
                              <span className="font-bold">120,000đ / xe</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Right Column: Interactive Contract Preview */}
            <div className="bg-[#EAD3CC]/10 border border-[#EAD3CC]/50 rounded-2xl overflow-hidden flex flex-col h-[700px]">
               <div className="bg-white/60 p-3 border-b border-[#EAD3CC]/50 flex items-center justify-between">
                  <div className="flex items-center text-sm font-bold text-[#B7705F]">
                     <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                     Bản xem trước hợp đồng
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#EAD3CC]/30 text-[#8C4A3A]">
                     Sẵn sàng in
                  </span>
               </div>

               <div className="flex-1 p-6 overflow-y-auto">
                  <div className="bg-white p-8 rounded-lg shadow-sm text-sm leading-relaxed border border-[#EAD3CC]/20 text-[#222222]" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                     <h3 className="text-center font-bold mb-1">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h3>
                     <h4 className="text-center font-bold mb-6 underline decoration-1 underline-offset-4">Độc lập - Tự do - Hạnh phúc</h4>
                     <h2 className="text-center font-bold text-base mb-1 uppercase">Hợp đồng thuê phòng &amp; giường ngủ</h2>
                     <p className="text-center italic text-gray-600 mb-8">Số: 2026/HĐ-P{initialData?.room || '302'}-{selectedBed.replace('Giường ', 'G')}</p>

                     <p className="mb-4">Hôm nay, ngày 02 tháng 07 năm 2026, tại Homestay Dorm, chúng tôi gồm các bên:</p>

                     <div className="mb-4">
                        <p className="font-bold mb-1">BÊN CHO THUÊ (BÊN A):</p>
                        <p>Đơn vị quản lý: <strong>Homestay Dorm</strong></p>
                        <p>Đại diện: {managerInfo.name}</p>
                        <p>Chức vụ: Giám đốc chi nhánh</p>
                        <p>Điện thoại: {managerInfo.phone}</p>
                     </div>

                     <div className="mb-6">
                        <p className="font-bold mb-1">BÊN THUÊ (BÊN B):</p>
                        <p>Đại diện: <strong>{customerName}</strong></p>
                        <p>Số CCCD: {customerCccd}</p>
                        <p>Điện thoại: {customerPhone}</p>
                        {roommates.length > 0 && (
                           <div className="mt-4">
                              <p className="font-semibold italic mb-1">Thành viên ở cùng:</p>
                              {roommates.map((rm: any, idx: number) => (
                                 <div key={idx} className="ml-4 mb-2">
                                    <p>Ông/Bà: <strong>{rm.name || `Người ${idx+1}`}</strong></p>
                                    <p>Số CCCD: {rm.cccd || "Chưa cung cấp"}</p>
                                    <p>Điện thoại: {rm.phone || "Chưa cung cấp"}</p>
                                 </div>
                              ))}
                           </div>
                        )}
                     </div>

                     <p className="font-bold mb-2">ĐIỀU 1: ĐỐI TƯỢNG VÀ NỘI DUNG THUÊ</p>
                     <p className="mb-2">
                        Bên A đồng ý cho Bên B thuê chỗ ở tại <strong>Phòng {initialData?.room || '302'}{initialData?.isFullRoom ? "" : ` - ${Array.from(new Set([selectedBed, ...roommateBeds.filter(Boolean)])).sort().join(', ')}`}</strong> của hệ thống ký túc xá dịch vụ Homestay Dorm.
                     </p>
                     <p className="mb-2">Số lượng thành viên: {1 + roommates.filter((r:any) => r.name).length} người.</p>
                     <p className="mb-2">Giá thuê chỗ ở/giường: <strong>{initialData?.rentPrice ? initialData.rentPrice.toLocaleString() : "3,500,000"} VNĐ / tháng</strong>.</p>
                     <p className="mb-2">Tiền cọc bảo đảm: <strong>{initialData?.amount ? initialData.amount.toLocaleString() : "3,500,000"} VNĐ</strong> (Đã thanh toán trước và lưu trữ vào hồ sơ).</p>
                     <p className="mb-6">Thời hạn hợp đồng: {leaseDuration} tháng bắt đầu từ ngày nhận bàn giao phòng.</p>

                     <p className="font-bold mb-2">ĐIỀU 2: CHI PHÍ DỊCH VỤ VÀ THANH TOÁN</p>
                     <p className="mb-1">- Tiền điện: 3,500đ/kWh</p>
                     <p className="mb-1">- Tiền nước: 20,000đ/m³</p>
                     <p className="mb-1">- Internet phòng: 100,000đ/tháng</p>
                     <p className="mb-8 mt-4">Bên B có nghĩa vụ thanh toán đầy đủ các hóa đơn phát sinh hàng tháng đúng hạn.</p>

                     <div className="grid grid-cols-2 text-center text-xs mt-8">
                        <div>
                           <p className="font-bold mb-1">ĐẠI DIỆN BÊN A</p>
                           <p className="italic text-gray-500 mb-6">(Ký &amp; Đóng dấu)</p>
                           <div className="inline-block border border-gray-300 rounded px-2 py-1 text-gray-400 font-bold bg-gray-50">
                              HOMESTAY DORM (Đã ký)
                           </div>
                        </div>
                        <div>
                           <p className="font-bold mb-1">ĐẠI DIỆN BÊN B</p>
                           <p className="italic text-gray-500 mb-6">(Ký &amp; Ghi rõ họ tên)</p>
                           <div className="mt-8 border-b border-dashed border-gray-300 w-32 mx-auto"></div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="p-4 bg-white border-t border-[#EAD3CC]/50">
                  <button
                     onClick={handleSaveContract}
                     className="w-full py-3.5 bg-[#B7705F] text-white hover:bg-[#a06050] rounded-xl font-bold flex items-center justify-center transition-colors shadow-sm"
                  >
                     <Printer className="w-4.5 h-4.5 mr-2" /> Lưu &amp; In hợp đồng thuê phòng ngay
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}
