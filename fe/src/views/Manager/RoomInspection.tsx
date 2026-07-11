import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit3, Save, Send } from 'lucide-react';

const MOCK_LIST = [
  { id: '1', room: 'P.102', date: '21/10/2023', status: 'Bình thường' },
  { id: '2', room: 'P.201', date: '20/10/2023', status: 'Cần sửa chữa' },
];

export default function RoomInspection() {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [inspectionList, setInspectionList] = useState<any[]>(MOCK_LIST);

  useEffect(() => {
    const saved = localStorage.getItem('checkout_flow_request');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.status === 'Chờ duyệt') {
        const flowItem = {
          id: 'flow_req_1',
          room: data.room,
          bed: data.bed,
          customer: data.customer,
          date: data.date,
          status: 'Yêu cầu trả phòng',
          isFlowRequest: true
        };
        setInspectionList([flowItem, ...MOCK_LIST]);
      } else {
        setInspectionList(MOCK_LIST);
      }
    } else {
      setInspectionList(MOCK_LIST);
    }
  }, [selectedItem]);

  const items = [
    { name: 'Bed / Nệm', desc: 'Khung giường sắt, nệm cao su', status: 'Tốt', note: '', quantity: 1 },
    { name: 'Desk / Bàn học', desc: '', status: 'Hư hỏng', note: 'Trầy xước ở góc', quantity: 1 },
    { name: 'Chair / Ghế', desc: '', status: 'Tốt', note: '', quantity: 2 },
    { name: 'Cabinet / Tủ đồ', desc: 'Kèm 1 chìa khóa', status: 'Hư hỏng', note: 'Trầy xước nặng ở cánh cửa', quantity: 1 },
    { name: 'Key Card / Thẻ từ', desc: '', status: 'Tốt', note: '', quantity: 1 },
  ];

  const handleSendToAccountant = () => {
    if (selectedItem?.isFlowRequest) {
      const saved = localStorage.getItem('checkout_flow_request');
      if (saved) {
        const data = JSON.parse(saved);
        data.status = 'Đã kiểm tra phòng';
        localStorage.setItem('checkout_flow_request', JSON.stringify(data));
      }
      setSelectedItem(null);
      alert('Đã chuyển thông tin kiểm tra phòng/giường cho bộ phận Kế toán thành công!');
    } else {
      setSelectedItem(null);
      alert('Đã chuyển thông tin thành công!');
    }
  };

  if (!selectedItem) {
    return (
      <div className="p-8 h-full max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
           <div>
              <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1">Kiểm tra phòng</h1>
              <p className="text-sm text-[#666666]">Đánh giá hiện trạng tài sản, ghi nhận phát sinh.</p>
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
                     <th className="px-6 py-4 font-medium">Phòng</th>
                     <th className="px-6 py-4 font-medium">Ngày cập nhật</th>
                     <th className="px-6 py-4 font-medium">Trạng thái</th>
                     <th className="px-6 py-4 font-medium text-right">Thao Tác</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {inspectionList.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                       <td className="px-6 py-4 font-medium text-[#222222]">
                          {item.isFlowRequest ? `${item.room} - ${item.bed}` : item.room}
                       </td>
                       <td className="px-6 py-4 text-[#666666]">{item.date}</td>
                       <td className="px-6 py-4">
                         <span className={`px-2.5 py-1 rounded text-xs font-semibold ${item.status === 'Bình thường' ? 'bg-green-50 text-green-600' : 'bg-[#FAF5F3] text-[#B7705F]'}`}>
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
    <div className="p-8 h-full max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center text-sm font-medium text-gray-500 mb-2">
           <span>Phòng (Rooms)</span>
           <svg className="w-4 h-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
           <span>{selectedItem.isFlowRequest ? `${selectedItem.room} - ${selectedItem.bed}` : selectedItem.room}</span>
           <svg className="w-4 h-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
           <span className="text-[#B7705F]">Kiểm tra phòng</span>
        </div>
      </div>
      <div className="flex justify-between items-end mb-6">
         <div>
            <div className="flex items-center space-x-3 mb-2">
               <button onClick={() => setSelectedItem(null)} className="text-[#666666] hover:text-[#B7705F] flex items-center text-sm font-medium">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại
               </button>
            </div>
            <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1">
               Kiểm tra - {selectedItem.isFlowRequest ? `${selectedItem.room} - ${selectedItem.bed}` : selectedItem.room}
            </h1>
            {selectedItem.isFlowRequest && (
              <p className="text-sm text-[#666666]">Khách thuê: <span className="font-semibold text-gray-900">{selectedItem.customer}</span> (Yêu cầu trả phòng)</p>
            )}
         </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
         <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Biểu mẫu kiểm tra (Danh sách tài sản ban đầu)</h3>
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
         </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
         <button className="px-6 py-2.5 border border-[#B7705F] text-[#B7705F] hover:bg-[#F3E1DC]/30 rounded font-medium flex items-center transition-colors">
            <Save className="w-5 h-5 mr-2" />
            Lưu thông tin
         </button>
         <button onClick={handleSendToAccountant} className="px-6 py-2.5 bg-[#B7705F] text-white hover:bg-[#A06050] rounded font-medium flex items-center shadow-sm transition-colors">
            <Send className="w-5 h-5 mr-2" />
            Chuyển thông tin cho Kế toán
         </button>
      </div>

    </div>
  );
}
