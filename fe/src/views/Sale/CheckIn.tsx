import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, Save, Search, User } from 'lucide-react';

const MOCK_LIST = [
  { id: 'DC-2023-01', room: 'Phòng 102', bed: 'Giường 01', customer: 'Trần Văn B', phone: '0901234567', cccd: '079123456789', status: 'Chờ xếp lịch' },
  { id: 'DC-2023-02', room: 'Phòng 201', bed: 'Giường 03', customer: 'Lê Thị C', phone: '0987654321', cccd: '079987654321', status: 'Sắp nhận phòng' },
];

export default function CheckIn() {
  const [list, setList] = useState<any[]>(MOCK_LIST);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('');
  const [formNote, setFormNote] = useState('');

  if (!selectedItem) {
    return (
      <div className="p-8 h-full max-w-7xl mx-auto bg-[#FAF5F3]">
        <div className="flex justify-between items-end mb-8">
           <div>
              <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1">Xếp lịch nhận phòng</h1>
              <p className="text-sm text-[#666666]">Danh sách các phiếu đặt cọc đang chờ sắp xếp hẹn lịch và bàn giao phòng ngủ.</p>
           </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-[#EAD3CC]/50 mb-6 flex flex-wrap gap-4 items-center">
           <div className="flex-1 min-w-[300px] relative">
             <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
             <input 
               type="text" 
               placeholder="Tìm theo Tên khách hàng/Mã/CCCD..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#B7705F]"
             />
           </div>
           
           <div className="flex items-center space-x-2">
             <span className="text-xs font-semibold text-gray-500 uppercase">Trạng thái:</span>
             <select 
               value={statusFilter}
               onChange={(e) => setStatusFilter(e.target.value)}
               className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:border-[#B7705F]"
             >
               <option value="">Tất cả trạng thái</option>
               <option value="Chờ xếp lịch">Chờ xếp lịch</option>
               <option value="Sắp nhận phòng">Sắp nhận phòng</option>
             </select>
           </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#EAD3CC]/50 overflow-hidden">
           <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF5F3] text-[#666666]">
                 <tr>
                    <th className="px-6 py-4 font-medium">Mã Đặt Cọc</th>
                    <th className="px-6 py-4 font-medium">Khách Hàng</th>
                    <th className="px-6 py-4 font-medium">CCCD</th>
                    <th className="px-6 py-4 font-medium">Số điện thoại</th>
                    <th className="px-6 py-4 font-medium">Phòng thuê</th>
                    <th className="px-6 py-4 font-medium">Giường chỉ định</th>
                    <th className="px-6 py-4 font-medium">Trạng thái</th>
                    <th className="px-6 py-4 font-medium text-right">Thao Tác</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                 {list
                    .filter((item: any) => {
                       const matchStatus = !statusFilter || item.status === statusFilter;
                       const matchSearch = !searchTerm || 
                          (item.customer && item.customer.toLowerCase().includes(searchTerm.toLowerCase())) || 
                          (item.id && item.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (item.cccd && item.cccd.includes(searchTerm));
                       return matchStatus && matchSearch;
                    })
                    .map((item: any, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                       <td className="px-6 py-4 font-medium text-[#B7705F]">{item.id}</td>
                       <td className="px-6 py-4 font-medium text-[#222222]">{item.customer}</td>
                       <td className="px-6 py-4 text-[#666666]">{item.cccd}</td>
                       <td className="px-6 py-4 text-[#666666]">{item.phone}</td>
                       <td className="px-6 py-4 text-[#222222] font-semibold">{item.room}</td>
                       <td className="px-6 py-4 text-[#B7705F] font-bold">{item.bed}</td>
                       <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-md ${item.status === 'Chờ xếp lịch' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                             {item.status}
                          </span>
                       </td>
                       <td className="px-6 py-4 text-right">
                          {item.status !== 'Sắp nhận phòng' ? (
                             <button onClick={() => {
                                setSelectedItem(item);
                                setFormDate(item.date || '');
                                setFormTime(item.time || '');
                                setFormNote(item.note || '');
                             }} className="px-4 py-2 text-sm font-semibold text-white bg-[#B7705F] hover:bg-[#a06050] rounded-xl transition-colors inline-block shadow-sm">
                                Xếp lịch
                             </button>
                          ) : (
                             <button onClick={() => {
                                setSelectedItem(item);
                                setFormDate(item.date || '');
                                setFormTime(item.time || '');
                                setFormNote(item.note || '');
                             }} className="px-4 py-2 text-sm font-semibold text-[#B7705F] bg-[#FAF5F3] border border-[#EAD3CC] hover:bg-[#EAD3CC] rounded-xl transition-colors inline-block shadow-sm">
                                Xem lịch
                             </button>
                          )}
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
            {/* Tách rõ ràng phòng giường ở tiêu đề */}
            <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1">Xếp lịch nhận phòng - {selectedItem.room} ({selectedItem.bed})</h1>
         </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#EAD3CC] overflow-hidden mb-6">
         <div className="bg-[#FAF5F3] px-6 py-4 border-b border-[#EAD3CC]/50">
            <h2 className="font-bold text-[#222222] flex items-center"><User className="w-5 h-5 mr-2 text-[#B7705F]"/> Thông tin bàn giao chi tiết</h2>
         </div>
         <div className="p-6">
            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
               <div>
                  <span className="text-[#666666] text-xs font-semibold uppercase block mb-1">Họ và tên khách thuê</span>
                  <span className="font-bold text-gray-800 text-sm">{selectedItem.customer}</span>
               </div>
               <div>
                  <span className="text-[#666666] text-xs font-semibold uppercase block mb-1">Số điện thoại</span>
                  <span className="font-bold text-gray-800 text-sm">{selectedItem.phone}</span>
               </div>
               <div>
                  <span className="text-[#666666] text-xs font-semibold uppercase block mb-1">CCCD</span>
                  <span className="font-bold text-gray-800 text-sm">{selectedItem.cccd}</span>
               </div>
               <div>
                  <span className="text-[#666666] text-xs font-semibold uppercase block mb-1">Căn hộ / Phòng số</span>
                  <span className="font-bold text-[#222222] text-sm">{selectedItem.room}</span>
               </div>
               <div>
                  <span className="text-[#666666] text-xs font-semibold uppercase block mb-1">Giường chỉ định</span>
                  <span className="font-bold text-[#B7705F] text-sm">{selectedItem.bed}</span>
               </div>
               <div>
                  <span className="text-[#666666] text-xs font-semibold uppercase block mb-1">Mã đặt cọc</span>
                  <span className="font-mono text-gray-600 text-sm">{selectedItem.id}</span>
               </div>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#EAD3CC] overflow-hidden p-6">
         <h2 className="text-lg font-bold text-[#222222] mb-4">Lập kế hoạch lịch nhận phòng</h2>
         <div className="space-y-4">
            <div>
               <label className="block text-sm font-semibold text-[#666666] mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-[#B7705F]" /> Ngày hẹn nhận phòng
               </label>
               <input type="date" value={formDate} onChange={e => setFormDate(e.target.value)} disabled={selectedItem.status === 'Sắp nhận phòng'} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-[#B7705F] disabled:opacity-70 disabled:cursor-not-allowed" />
            </div>
            <div>
               <label className="block text-sm font-semibold text-[#666666] mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-[#B7705F]" /> Giờ hẹn nhận phòng (Dự kiến)
               </label>
               <input type="time" value={formTime} onChange={e => setFormTime(e.target.value)} disabled={selectedItem.status === 'Sắp nhận phòng'} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-[#B7705F] disabled:opacity-70 disabled:cursor-not-allowed" />
            </div>
         </div>
         <div className="mt-4">
            <label className="block text-sm font-semibold text-[#666666] mb-2 flex items-center">
               Ghi chú (Tùy chọn)
            </label>
            <textarea rows={3} value={formNote} onChange={e => setFormNote(e.target.value)} disabled={selectedItem.status === 'Sắp nhận phòng'} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-[#B7705F] resize-none disabled:opacity-70 disabled:cursor-not-allowed" placeholder="Nhập ghi chú..."></textarea>
         </div>
         
         {selectedItem.status !== 'Sắp nhận phòng' && (
            <button onClick={() => {
               setList(list.map(i => i.id === selectedItem.id ? { ...i, status: 'Sắp nhận phòng', date: formDate, time: formTime, note: formNote } : i));
               setSelectedItem(null);
               alert('Lưu lịch nhận phòng & lập hợp đồng thành công!');
            }} className="w-full mt-6 py-3.5 bg-[#B7705F] text-white rounded-xl text-sm font-bold shadow-sm hover:bg-[#a06050] transition-colors flex items-center justify-center">
               <Save className="w-4 h-4 mr-2" /> Lưu lịch nhận phòng
            </button>
         )}
      </div>
    </div>
  );
}
