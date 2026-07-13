import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Search } from 'lucide-react';

const MOCK_LIST = [
  { id: 'M-001', room: 'P.101', customer: 'Trần Văn A', amount: '4,500,000 đ', status: 'Chờ thanh toán' },
  { id: 'M-002', room: 'P.102', customer: 'Nguyễn Thị B', amount: '3,200,000 đ', status: 'Đã thanh toán' },
];

export default function MonthlyPaymentList() {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredList = MOCK_LIST.filter(item => 
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!selectedItem) {
    return (
      <div className="p-8 h-full max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
           <div>
              <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1">Thanh toán hàng tháng</h1>
              <p className="text-sm text-[#666666]">Quản lý tiền phòng và các dịch vụ phát sinh hàng tháng.</p>
           </div>
           <div className="flex space-x-3">
              <div className="relative">
                 <input 
                    type="text" 
                    placeholder="Tìm kiếm phiếu, phòng, khách..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#B7705F] w-72 shadow-sm"
                 />
                 <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
           </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#EAD3CC]/50 overflow-hidden">
           <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF5F3] text-[#666666]">
                 <tr>
                    <th className="px-6 py-4 font-medium">Mã Phiếu</th>
                    <th className="px-6 py-4 font-medium">Phòng/Giường</th>
                    <th className="px-6 py-4 font-medium">Khách Hàng</th>
                    <th className="px-6 py-4 font-medium">Tổng tiền</th>
                    <th className="px-6 py-4 font-medium">Trạng thái</th>
                    <th className="px-6 py-4 font-medium text-right">Thao Tác</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                 {filteredList.map((item, idx) => (
                   <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-[#222222]">{item.id}</td>
                      <td className="px-6 py-4 text-[#666666]">{item.room}</td>
                      <td className="px-6 py-4 text-[#666666]">{item.customer}</td>
                      <td className="px-6 py-4 text-[#B7705F] font-bold">{item.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded text-xs font-semibold ${item.status === 'Đã thanh toán' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
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
    <div className="p-8 h-full max-w-7xl mx-auto">
      <div className="text-sm text-gray-500 mb-4 flex items-center">
          <span>Phòng (Rooms)</span>
          <span className="mx-2">&gt;</span>
          <span>{selectedItem.room}</span>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-900 font-medium">Thanh toán Hàng tháng</span>
      </div>
      <div className="flex justify-between items-end mb-8">
         <div>
            <div className="flex items-center space-x-3 mb-2">
               <button onClick={() => setSelectedItem(null)} className="text-[#666666] hover:text-[#B7705F] flex items-center text-sm font-medium">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại
               </button>
            </div>
            <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1">Chi tiết thanh toán - {selectedItem.room}</h1>
         </div>
      </div>
      <div className="bg-white p-6 rounded-xl border border-gray-200">
         <h2 className="text-lg font-bold mb-4">Hoá đơn {selectedItem.id}</h2>
         <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b pb-2">
               <span>Tiền phòng:</span>
               <span className="font-semibold">4,000,000 đ</span>
            </div>
            <div className="flex justify-between border-b pb-2">
               <span>Tiền điện:</span>
               <span className="font-semibold">350,000 đ</span>
            </div>
            <div className="flex justify-between border-b pb-2">
               <span>Tiền nước:</span>
               <span className="font-semibold">150,000 đ</span>
            </div>
            <div className="flex justify-between py-2 text-lg font-bold">
               <span>Tổng cộng:</span>
               <span className="text-[#B7705F]">{selectedItem.amount}</span>
            </div>
         </div>
         <div className="mt-8 flex justify-end">
            <button className="px-6 py-2 bg-[#B7705F] text-white rounded font-medium flex items-center shadow-sm hover:bg-[#A06050]">
               <CreditCard className="w-4 h-4 mr-2" />
               Xác nhận đã thu
            </button>
         </div>
      </div>
    </div>
  );
}
