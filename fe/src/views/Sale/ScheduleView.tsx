import React, { useState } from 'react';
import { ArrowLeft, CalendarDays, Clock, Save, Search, User } from 'lucide-react';

const MOCK_LIST = [
   { id: 'DK-2023-01', branch: 'CN Quận 1', customer: 'Lê Văn Khách', phone: '0901234567', status: 'Chờ phản hồi' },
   { id: 'DK-2023-02', branch: 'CN Quận 3', customer: 'Nguyễn Thị B', phone: '0987654321', status: 'Đồng ý đặt cọc', date: '21/10/2023', time: '09:00' },
   { id: 'DK-2023-03', branch: 'CN Quận 1', customer: 'Phạm C', phone: '0912345678', status: 'Chờ xếp lịch' },
];

export default function ScheduleView({ onNavigate }: { onNavigate?: (menu: string) => void }) {
   const [list, setList] = useState(MOCK_LIST);
   const [selectedItem, setSelectedItem] = useState<any>(null);
   const [branchFilter, setBranchFilter] = useState('');
   const [statusFilter, setStatusFilter] = useState('');
   const [searchTerm, setSearchTerm] = useState('');

   if (!selectedItem) {
      return (
         <div className="p-8 h-full max-w-7xl mx-auto bg-[#FAF5F3]">
            <div className="flex justify-between items-end mb-8">
               <div>
                  <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1">Xếp lịch xem phòng</h1>
                  <p className="text-sm text-[#666666]">Lên lịch hẹn và theo dõi khách đến trải nghiệm thực tế phòng/giường.</p>
               </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#EAD3CC]/50 mb-6 flex flex-wrap gap-4 items-center justify-between">
               <div className="flex-1 min-w-[300px] relative">
                  <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                  <input
                     type="text"
                     placeholder="Tìm theo Tên khách hàng/CCCD..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#B7705F]"
                  />
               </div>

               {/* Chọn chi nhánh */}
               <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase">Chi nhánh:</span>
                  <select
                     value={branchFilter}
                     onChange={(e) => setBranchFilter(e.target.value)}
                     className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:border-[#B7705F]"
                  >
                     <option value="">Tất cả chi nhánh</option>
                     <option value="CN Quận 1">CN Quận 1</option>
                     <option value="CN Quận 3">CN Quận 3</option>
                  </select>
               </div>

               {/* Chọn trạng thái */}
               <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase">Trạng thái:</span>
                  <select
                     value={statusFilter}
                     onChange={(e) => setStatusFilter(e.target.value)}
                     className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:border-[#B7705F]"
                  >
                     <option value="">Tất cả trạng thái</option>
                     <option value="Chờ xếp lịch">Chờ xếp lịch</option>
                     <option value="Chờ phản hồi">Chờ phản hồi</option>
                     <option value="Đồng ý đặt cọc">Đồng ý đặt cọc</option>
                     <option value="Ngừng xem phòng">Ngừng xem phòng</option>
                  </select>
               </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-[#EAD3CC]/50 overflow-hidden">
               <table className="w-full text-left text-sm">
                  <thead className="bg-[#FAF5F3] text-[#666666]">
                     <tr>
                        <th className="px-6 py-4 font-medium">Phiếu Đăng ký</th>
                        <th className="px-6 py-4 font-medium">Khách Hàng</th>
                        <th className="px-6 py-4 font-medium">Số điện thoại</th>
                        <th className="px-6 py-4 font-medium">Chi nhánh</th>
                        <th className="px-6 py-4 font-medium">Trạng thái</th>
                        <th className="px-6 py-4 font-medium text-right">Thao Tác</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {list
                        .filter(item => {
                           const matchBranch = !branchFilter || item.branch === branchFilter;
                           const matchStatus = !statusFilter || item.status === statusFilter;
                           const matchSearch = !searchTerm ||
                              item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              item.phone.includes(searchTerm) ||
                              item.id.toLowerCase().includes(searchTerm.toLowerCase());
                           return matchBranch && matchStatus && matchSearch;
                        })
                        .map((item, idx) => (
                           <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-6 py-4 font-medium text-[#B7705F]">{item.id}</td>
                              <td className="px-6 py-4 font-medium text-[#222222]">{item.customer}</td>
                              <td className="px-6 py-4 text-[#666666]">{item.phone}</td>
                              <td className="px-6 py-4 text-[#666666]">{item.branch}</td>
                              <td className="px-6 py-4">
                                 <span className={`px-2.5 py-1 rounded text-xs font-semibold ${item.status.includes('Chờ') ? 'bg-orange-50 text-orange-600' : item.status === 'Đồng ý đặt cọc' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    {item.status}
                                 </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <button onClick={() => setSelectedItem(item)} className="px-3 py-1.5 text-sm font-medium text-[#B7705F] bg-orange-50 hover:bg-[#F3E1DC] rounded-lg transition-colors inline-block">
                                    Chi tiết
                                 </button>
                              </td>
                           </tr>
                        ))}
                  </tbody>
               </table>
            </div>
         </div>
      );
   }

   return (
      <div className="p-8 h-full max-w-3xl mx-auto bg-[#FAF5F3]">
         <div className="flex justify-between items-end mb-6">
            <div>
               <div className="flex items-center space-x-3 mb-2">
                  <button onClick={() => setSelectedItem(null)} className="text-[#666666] hover:text-[#B7705F] flex items-center text-sm font-medium">
                     <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại
                  </button>
               </div>
               <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1">Xếp lịch hẹn</h1>
            </div>
         </div>

         <div className="bg-white rounded-2xl shadow-sm border border-[#EAD3CC] overflow-hidden mb-6">
            <div className="bg-[#FAF5F3] px-6 py-4 border-b border-[#EAD3CC]/50">
               <h2 className="font-bold text-[#222222] flex items-center"><User className="w-5 h-5 mr-2 text-[#B7705F]" /> Thông tin Phiếu Đăng ký</h2>
            </div>
            <div className="p-6">
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div><span className="text-[#666666] text-sm block mb-1">Họ và tên:</span> <span className="font-semibold">{selectedItem.customer}</span></div>
                  <div><span className="text-[#666666] text-sm block mb-1">SĐT:</span> <span className="font-semibold">{selectedItem.phone}</span></div>
                  <div><span className="text-[#666666] text-sm block mb-1">Mã yêu cầu:</span> <span className="font-semibold">{selectedItem.id}</span></div>
                  <div><span className="text-[#666666] text-sm block mb-1">Trạng thái:</span> <span className="font-semibold text-[#B7705F]">{selectedItem.status}</span></div>
               </div>
            </div>
         </div>

         {selectedItem.status === 'Chờ xếp lịch' ? (
            <div className="bg-white rounded-2xl shadow-sm border border-[#EAD3CC] overflow-hidden p-6">
               <h2 className="text-lg font-bold text-[#222222] mb-4">Sắp xếp lịch xem phòng</h2>
               <div className="space-y-4">
                  <div>
                     <label className="block text-sm font-semibold text-[#666666] mb-2 flex items-center">
                        Chi nhánh xếp lịch
                     </label>
                     <input type="text" value={selectedItem.branch} disabled className="w-full bg-gray-100 border border-gray-200 rounded-lg p-3 text-gray-500 font-medium cursor-not-allowed" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-semibold text-[#666666] mb-2 flex items-center">
                           <CalendarDays className="w-4 h-4 mr-1" /> Ngày hẹn
                        </label>
                        <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-[#B7705F]" />
                     </div>
                     <div>
                        <label className="block text-sm font-semibold text-[#666666] mb-2 flex items-center">
                           <Clock className="w-4 h-4 mr-1" /> Giờ hẹn
                        </label>
                        <input type="time" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-[#B7705F]" />
                     </div>
                  </div>
                  <div>
                     <label className="block text-sm font-semibold text-[#666666] mb-2">
                        Lưu ý kèm theo (Tùy chọn)
                     </label>
                     <textarea rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-[#B7705F] resize-none" placeholder="Nhập các lưu ý về giờ giấc, yêu cầu khách..."></textarea>
                  </div>
               </div>

               <button onClick={() => {
                  setList(list.map(i => i.id === selectedItem.id ? { ...i, status: 'Chờ phản hồi' } : i));
                  setSelectedItem(null);
                  alert('Lưu lịch hẹn thành công!');
               }} className="w-full mt-6 py-3 bg-[#B7705F] text-white rounded-xl text-sm font-bold shadow-sm hover:bg-[#a06050] transition-colors flex items-center justify-center">
                  <Save className="w-4 h-4 mr-2" /> Lưu lịch hẹn
               </button>
            </div>
         ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-[#EAD3CC] overflow-hidden p-6">
               <h2 className="text-lg font-bold text-[#222222] mb-4">Kết quả xem phòng</h2>
               <div className="space-y-4 mb-6 text-sm text-[#666666]">
                  <p>Lịch hẹn: <strong>{selectedItem.time || '09:00'} - {selectedItem.date || '21/10/2023'}</strong></p>
               </div>
               {selectedItem.status === 'Chờ phản hồi' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <button
                        onClick={() => {
                           setList(list.map(i => i.id === selectedItem.id ? { ...i, status: 'Ngừng xem phòng' } : i));
                           setSelectedItem(null);
                        }}
                        className="py-3 px-4 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center transition-colors"
                     >
                        Ngừng xem phòng
                     </button>
                     <button
                        onClick={() => {
                           setList(list.map(i => i.id === selectedItem.id ? { ...i, status: 'Chờ xếp lịch' } : i));
                           setSelectedItem(null);
                        }}
                        className="py-3 px-4 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center transition-colors"
                     >
                        <Clock className="w-4 h-4 mr-2 text-gray-500" />
                        Xếp lịch mới
                     </button>
                     <button
                        onClick={() => {
                           setList(list.map(i => i.id === selectedItem.id ? { ...i, status: 'Đồng ý đặt cọc' } : i));
                           setSelectedItem({ ...selectedItem, status: 'Đồng ý đặt cọc' });
                           alert('Chuyển trạng thái thành công! Dữ liệu đã sẵn sàng ở phần Lập phiếu đặt cọc.');
                           if (onNavigate) {
                              onNavigate('initial_payments');
                           }
                        }}
                        className="py-3 px-4 bg-[#B7705F] text-white rounded-xl font-bold hover:bg-[#a06050] flex items-center justify-center transition-colors shadow-sm"
                     >
                        <User className="w-4 h-4 mr-2" />
                        Đồng ý đặt cọc
                     </button>
                  </div>
               )}
               {selectedItem.status === 'Đồng ý đặt cọc' && (
                  <div className="p-4 bg-green-50 text-green-700 rounded-lg text-sm text-center font-medium">
                     Khách đã đồng ý đặt cọc
                  </div>
               )}
               {selectedItem.status === 'Ngừng xem phòng' && (
                  <div className="p-4 bg-gray-50 text-gray-500 rounded-lg text-sm text-center font-medium">
                     Khách đã ngừng xem phòng
                  </div>
               )}
            </div>
         )}
      </div>
   );
}
