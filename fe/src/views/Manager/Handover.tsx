import React, { useState } from 'react';
import { X, BedDouble, Camera, PenSquare, Edit3, ArrowLeft } from 'lucide-react';

const MOCK_LIST = [
  { id: '1', room: 'P.102', bed: 'Giường 01', customer: 'Trần Văn B', date: '21/10/2023', status: 'Chưa bàn giao' },
  { id: '2', room: 'P.201', bed: 'Giường 02', customer: 'Lê Thị C', date: '20/10/2023', status: 'Đã bàn giao' },
];

export default function Handover() {
  const [selected, setSelected] = useState<any>(null);

  const items = [
    { name: 'Bed / Nệm', desc: 'Khung giường sắt, nệm cao su', status: 'Tốt', note: '', quantity: 1 },
    { name: 'Desk / Bàn học', desc: '', status: 'Hư hỏng', note: 'Trầy xước nhẹ ở mặt bàn', quantity: 1 },
    { name: 'Chair / Ghế', desc: '', status: 'Tốt', note: '', quantity: 2 },
    { name: 'Cabinet / Tủ đồ', desc: 'Kèm 1 chìa khóa', status: 'Tốt', note: '', quantity: 1 },
    { name: 'Key Card / Thẻ từ', desc: '', status: 'Tốt', note: '', quantity: 1 },
  ];

  if (!selected) {
    return (
      <div className="p-8 h-full max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
           <div>
              <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1">Bàn giao phòng &amp; tài sản</h1>
              <p className="text-sm text-[#666666]">Danh sách các phòng/giường đang chờ bàn giao.</p>
           </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-[#EAD3CC]/50 mb-6 flex flex-wrap gap-4 items-center">
           <div className="flex-1 min-w-[300px] relative">
             <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             <input 
               type="text" 
               placeholder="Tìm theo Tên khách hàng/CCCD/..." 
               className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#B7705F]"
             />
           </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#EAD3CC]/50 overflow-hidden">
           <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF5F3] text-[#666666]">
                 <tr>
                    <th className="px-6 py-4 font-medium">Phòng/Giường</th>
                    <th className="px-6 py-4 font-medium">Khách Hàng</th>
                    <th className="px-6 py-4 font-medium">Ngày Dự Kiến</th>
                    <th className="px-6 py-4 font-medium">Trạng thái</th>
                    <th className="px-6 py-4 font-medium text-right">Thao Tác</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                 {MOCK_LIST.map((item, idx) => (
                   <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-[#222222]">{item.room} - {item.bed}</td>
                      <td className="px-6 py-4 text-[#666666]">{item.customer}</td>
                      <td className="px-6 py-4 text-[#666666]">{item.date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded text-xs font-semibold ${item.status === 'Đã bàn giao' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button onClick={() => setSelected(item)} className="px-3 py-1.5 text-sm font-medium text-[#B7705F] bg-orange-50 hover:bg-[#F3E1DC] rounded-lg transition-colors inline-block">
                            {item.status === 'Chưa bàn giao' ? 'Lập biên bản bàn giao' : 'Chi tiết'}
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
    <div className="max-w-4xl mx-auto py-8">
      {/* Breadcrumb & Header */}
      <div className="mb-6">
        <div className="flex items-center text-sm font-medium text-gray-500 mb-2">
           <span>Phòng (Rooms)</span>
           <svg className="w-4 h-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
           <span>{selected.room}</span>
           <svg className="w-4 h-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
           <span className="text-[#B7705F]">Bàn giao phòng</span>
        </div>
      </div>
      <div className="flex flex-col space-y-4 mb-6">
         <button onClick={() => setSelected(null)} className="text-[#666666] hover:text-[#B7705F] flex items-center text-sm font-medium w-fit">
            <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại
         </button>
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold text-[#8C4A3A]">Biên bản bàn giao</h1>
               <p className="text-sm text-[#666666]">Thực hiện cùng khách hàng {selected.customer}</p>
            </div>
            <button className="text-sm font-medium text-gray-500 hover:text-gray-900 border border-gray-300 px-4 py-2 rounded-lg">Lưu nháp</button>
         </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
         {/* Contract & Room Info */}
         <div className="p-6 border-b border-gray-100">
            <div className="bg-[#FAF5F3] border border-[#EAD3CC] rounded-xl p-4 mb-6">
               <h3 className="text-sm font-bold text-[#B7705F] mb-3">Thông tin Hợp đồng</h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                     <p className="text-xs text-gray-500">Mã hợp đồng</p>
                     <p className="text-sm font-semibold text-gray-900">HD-2023-11-P102</p>
                  </div>
                  <div>
                     <p className="text-xs text-gray-500">Người thuê</p>
                     <p className="text-sm font-semibold text-gray-900">{selected.customer}</p>
                  </div>
                  <div>
                     <p className="text-xs text-gray-500">Thời hạn</p>
                     <p className="text-sm font-semibold text-gray-900">12 tháng</p>
                  </div>
                  <div>
                     <p className="text-xs text-gray-500">Ngày hiệu lực</p>
                     <p className="text-sm font-semibold text-gray-900">01/11/2023</p>
                  </div>
               </div>
            </div>
            <div className="flex items-center justify-between relative pl-16">
               <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#B7705F] rounded-xl flex items-center justify-center">
                 <BedDouble className="text-white w-6 h-6" />
               </div>
               <div>
                 <h2 className="text-xl font-bold text-gray-900 flex items-center">{selected.room} <span className="mx-2 text-gray-300">•</span> {selected.bed}</h2>
                 <p className="text-sm font-medium text-gray-600 mt-1 flex items-center">
                   <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                   {selected.customer} (Khách thuê)
                 </p>
               </div>
               <div className="text-right bg-gray-100 px-4 py-2 rounded-lg">
                 <p className="text-xs font-semibold text-gray-500 uppercase">Ngày bàn giao</p>
                 <p className="text-lg font-bold text-gray-900">{selected.date}</p>
               </div>
            </div>
            <p className="text-sm italic text-gray-500 mt-6">* Vui lòng kiểm tra tình trạng tài sản và đánh dấu tương ứng. Ghi chú chi tiết nếu có hư hỏng.</p>
         </div>

         {/* Checklist */}
         <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Danh sách Tài sản & Tình trạng</h3>
            <div className="space-y-4">
               {items.map((item, idx) => (
                 <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-[#FAF5F3]/50 border border-gray-100 rounded-xl">
                   <div className="flex items-start mb-3 md:mb-0">
                      <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 mr-3 shrink-0">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                      </div>
                      <div>
                         <p className="font-semibold text-gray-900 text-sm">{item.name} <span className="text-gray-500 font-normal ml-1">(SL: {item.quantity})</span></p>
                         {item.desc && <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>}
                      </div>
                   </div>
                   
                   <div className="flex flex-col items-end">
                      <div className="flex items-center space-x-3 mb-2">
                         <div className="flex bg-gray-100 rounded-lg p-1">
                            <button className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${item.status === 'Tốt' ? 'bg-[#D29F91] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Tốt</button>
                            <button className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${item.status === 'Hư hỏng' ? 'bg-red-100 text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Hư hỏng</button>
                         </div>
                         <button className="p-2 text-gray-400 hover:text-[#B7705F]"><Edit3 className="w-4 h-4" /></button>
                      </div>
                      {item.status === 'Hư hỏng' && (
                        <div className="w-full md:w-64">
                          <input type="text" className="w-full border border-red-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:border-red-400 bg-white" placeholder="Ghi chú hiện trạng..." defaultValue={item.note} />
                        </div>
                      )}
                   </div>
                 </div>
               ))}
            </div>

            {/* Photos */}
            <div className="mt-8 border border-gray-100 p-5 rounded-xl bg-gray-50">
               <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center">
                    <Camera className="w-5 h-5 text-gray-500 mr-2" />
                    <h3 className="font-medium text-gray-900">Hình ảnh hiện trạng</h3>
                 </div>
                 <span className="text-xs font-semibold px-2 py-1 bg-gray-200 rounded text-gray-600">Tùy chọn</span>
               </div>
               <div className="flex space-x-4">
                  <button className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
                     <span className="text-xl leading-none">+</span>
                     <span className="text-xs mt-1">Thêm ảnh</span>
                  </button>
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                     <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm3 3h6v2H9V9zm0 3h6v2H9v-2z" /></svg>
                  </div>
               </div>
            </div>
         </div>
         
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between mt-6">
         <p className="text-sm text-gray-500 max-w-sm"></p>
         <div className="flex space-x-3">
            <button onClick={() => setSelected(null)} className="px-6 py-2.5 rounded-lg border border-[#B7705F] text-[#B7705F] hover:bg-[#F3E1DC]/30 font-medium text-sm transition-colors">
               Hủy bỏ
            </button>
            <button className="px-6 py-2.5 rounded-lg bg-[#B7705F] text-white hover:bg-[#a06050] font-medium text-sm flex items-center shadow-sm transition-colors">
               <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
               Hoàn tất bàn giao & Bắt đầu lưu trú
            </button>
         </div>
      </div>
    </div>
  );
}
