import React, { useState } from 'react';
import { Receipt, CreditCard, Banknote, CheckCircle, Search, Clock, ShieldCheck, Calculator, ArrowLeft } from 'lucide-react';

const MOCK_LIST = [
  { id: '1', room: 'P.102', customer: 'Trần Văn B', status: 'Chờ thanh toán', amount: '4,000,000 đ', expiredAt: '14:00 - 21/10/2023' },
  { id: '2', room: 'P.201', customer: 'Lê Thị C', status: 'Chờ Quản lý xác nhận', amount: '16,000,000 đ' },
  { id: '3', room: 'P.305', customer: 'Nguyễn Văn A', status: 'Đã chốt cọc', amount: '8,000,000 đ' },
];

export default function InitialPayment() {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [rentPrice, setRentPrice] = useState('2000000');
  const [beds, setBeds] = useState('1');
  const [isFullRoom, setIsFullRoom] = useState(false);
  const [maxCapacity, setMaxCapacity] = useState('4');

  const calculatedBeds = isFullRoom ? parseInt(maxCapacity) || 0 : parseInt(beds) || 0;
  const rentNumber = parseInt(rentPrice) || 0;
  const totalDeposit = rentNumber * 2 * calculatedBeds;

  if (!selectedItem) {
    return (
      <div className="p-8 h-full max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
           <div>
              <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1">Tiếp nhận cọc</h1>
              <p className="text-sm text-[#666666]">Tiếp nhận yêu cầu, tính tiền cọc và theo dõi xác nhận thanh toán.</p>
           </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-[#EAD3CC]/50 mb-6 flex flex-wrap gap-4 items-center">
           <div className="flex-1 min-w-[300px] relative">
             <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
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
                    <th className="px-6 py-4 font-medium">Số tiền</th>
                    <th className="px-6 py-4 font-medium">Trạng thái</th>
                    <th className="px-6 py-4 font-medium text-right">Thao Tác</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                 {MOCK_LIST.map((item, idx) => (
                   <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-[#222222]">{item.room}</td>
                      <td className="px-6 py-4 text-[#666666]">{item.customer}</td>
                      <td className="px-6 py-4 text-[#B7705F] font-bold">{item.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded text-xs font-semibold ${item.status === 'Đã chốt cọc' ? 'bg-green-50 text-green-600' : item.status === 'Chờ Quản lý xác nhận' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
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
          <span className="text-gray-900 font-medium">Tiếp nhận cọc</span>
      </div>
      <div className="flex justify-between items-end mb-8">
         <div>
            <div className="flex items-center space-x-3 mb-2">
               <button onClick={() => setSelectedItem(null)} className="text-[#666666] hover:text-[#B7705F] flex items-center text-sm font-medium">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại
               </button>
            </div>
            <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1">Chi tiết thanh toán - {selectedItem.room}</h1>
            <p className="text-sm text-[#666666]">Tiếp nhận yêu cầu, tính tiền cọc và theo dõi xác nhận thanh toán.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Calculator / Create Request */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#EAD3CC]">
            <div className="flex items-center mb-6 border-b border-[#EAD3CC]/50 pb-3">
               <Calculator className="w-5 h-5 text-[#B7705F] mr-2" />
               <h2 className="text-lg font-bold text-[#222222]">Tính tiền cọc & gửi yêu cầu</h2>
            </div>
            
            <div className="space-y-5">
               <div>
                  <label className="block text-sm font-semibold text-[#666666] mb-2">Tiền thuê 1 giường (VND/tháng)</label>
                  <input 
                     type="number" 
                     value={rentPrice} 
                     onChange={(e) => setRentPrice(e.target.value)} 
                     className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 font-medium text-[#222222] focus:outline-none focus:border-[#B7705F]" 
                  />
               </div>
               
               <div className="flex items-center mb-2 mt-4 space-x-2">
                  <input 
                    type="checkbox" 
                    id="fullRoom" 
                    checked={isFullRoom} 
                    onChange={(e) => setIsFullRoom(e.target.checked)}
                    className="w-4 h-4 text-[#B7705F] border-gray-300 rounded focus:ring-[#B7705F]"
                  />
                  <label htmlFor="fullRoom" className="text-sm font-semibold text-[#222222]">Khách thuê nguyên phòng</label>
               </div>

               {isFullRoom ? (
                 <div>
                    <label className="block text-sm font-semibold text-[#666666] mb-2">Sức chứa tối đa của phòng</label>
                    <input 
                       type="number" 
                       value={maxCapacity} 
                       onChange={(e) => setMaxCapacity(e.target.value)} 
                       className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 font-medium text-[#222222]" 
                    />
                 </div>
               ) : (
                 <div>
                    <label className="block text-sm font-semibold text-[#666666] mb-2">Số giường thuê</label>
                    <input 
                       type="number" 
                       value={beds} 
                       onChange={(e) => setBeds(e.target.value)} 
                       className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 font-medium text-[#222222]" 
                    />
                 </div>
               )}
               
               <div className="pt-4 border-t border-dashed border-gray-200">
                  <div className="p-4 bg-[#FAF5F3] rounded-xl border border-[#EAD3CC]">
                     <p className="text-xs text-[#666666] mb-1">Công thức: (Tiền Thuê 2 tháng) x Số Giường = {rentNumber} x 2 x {calculatedBeds}</p>
                     <div className="flex justify-between items-center mt-2">
                        <span className="font-bold text-[#222222]">Tổng tiền cọc yêu cầu:</span>
                        <span className="text-2xl font-bold text-[#B7705F]">
                           {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalDeposit)}
                        </span>
                     </div>
                  </div>
                  <p className="text-xs text-orange-600 mt-3">* Sau khi gửi, khách có 24 giờ để thanh toán. Nếu quá hạn sẽ tự động huỷ.</p>
               </div>
               
               <button className="w-full py-3 bg-[#B7705F] text-white rounded-xl text-sm font-bold shadow-sm hover:bg-[#a06050] transition-colors flex items-center justify-center mt-4">
                  <Receipt className="w-4 h-4 mr-2" /> Gửi Yêu Cầu Thanh Toán
               </button>
            </div>
         </div>

         {/* Customer Information */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#EAD3CC] flex flex-col">
            <h3 className="text-lg font-bold text-[#222222] mb-4">Thông tin cá nhân khách hàng</h3>
            <div className="space-y-4">
               <div>
                  <label className="block text-sm font-semibold text-[#666666] mb-1">Họ và tên</label>
                  <p className="font-medium text-[#222222]">{selectedItem.customer}</p>
               </div>
               <div>
                  <label className="block text-sm font-semibold text-[#666666] mb-1">Số điện thoại</label>
                  <p className="font-medium text-[#222222]">0901234567</p>
               </div>
               <div>
                  <label className="block text-sm font-semibold text-[#666666] mb-1">CCCD/CMND</label>
                  <p className="font-medium text-[#222222]">079123456789</p>
               </div>
               <div>
                  <label className="block text-sm font-semibold text-[#666666] mb-1">Email</label>
                  <p className="font-medium text-[#222222]">khachhang@example.com</p>
               </div>
               <div>
                  <label className="block text-sm font-semibold text-[#666666] mb-1">Địa chỉ thường trú</label>
                  <p className="font-medium text-[#222222]">123 Đường ABC, Phường X, Quận Y, TP.HCM</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
