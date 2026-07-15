// Mock data removed, fetching from API

import React, { useState, useEffect } from 'react';
import API_URL from '../../api';
import { Receipt, CreditCard, Banknote, CheckCircle, Search, Clock, ShieldCheck, Calculator, ArrowLeft, Plus, BedDouble } from 'lucide-react';

export default function InitialPayment({ branchId = '' }: { branchId?: string }) {
   const [list, setList] = useState<any[]>([]);
   const [registrations, setRegistrations] = useState<any[]>([]);
   const [rooms, setRooms] = useState<any[]>([]);
   const [viewMode, setViewMode] = useState<'list' | 'detail' | 'create'>('list');
   const [selectedItem, setSelectedItem] = useState<any>(null);

   // Create state
   const [searchCCCD, setSearchCCCD] = useState('');
   const [registration, setRegistration] = useState<any>(null);
   const [selectedRoomId, setSelectedRoomId] = useState('');
   const [selectedBeds, setSelectedBeds] = useState<string[]>([]);
   const [rentPrice, setRentPrice] = useState('0');
   const [isFullRoom, setIsFullRoom] = useState(false);
   const [searchTerm, setSearchTerm] = useState('');
   const [paymentMethod, setPaymentMethod] = useState('Chuyển khoản');

   const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);
   const [roomSearchQuery, setRoomSearchQuery] = useState('');

   const availableRooms = rooms.filter(r => r.beds.some((b: any) => b.status === 'Trống'));

   const fetchDeposits = () => {
      fetch(`${API_URL}/api/v1/deposits${branchId ? `?branchId=${branchId}` : ''}`)
         .then(res => res.json())
         .then(data => {
            if (data.status === 'success') {
               setList(data.data);
            }
         });
   };

   useEffect(() => {
      fetchDeposits();
      
      fetch(`${API_URL}/api/v1/registrations${branchId ? `?branchId=${branchId}` : ''}`)
         .then(res => res.json())
         .then(data => {
            if (data.status === 'success') {
               setRegistrations(data.data);
            }
         });

      fetch(`${API_URL}/api/v1/rooms/status${branchId ? `?branchId=${branchId}` : ''}`)
         .then(res => res.json())
         .then(data => {
            if (data.status === 'success') {
               const mappedRooms = data.data.map((r: any) => ({
                  id: r.id,
                  maxCount: r.capacity,
                  price: r.beds[0]?.price || 1500000,
                  beds: r.beds.map((b: any) => ({
                     id: b.bedId.toString(),
                     status: b.status,
                     price: b.price || 1500000
                  }))
               }));
               setRooms(mappedRooms);
            }
         });
   }, []);

   const handleSearchCCCD = () => {
      if (!searchCCCD.trim()) return;
      const lowerSearch = searchCCCD.toLowerCase().trim();
      const found = registrations.find(r =>
         r.status === 'Đã xử lý' &&
         ((r.cccd && r.cccd.toLowerCase().includes(lowerSearch)) ||
            (r.phone && r.phone.toLowerCase().includes(lowerSearch)) ||
            (r.customer && r.customer.toLowerCase().includes(lowerSearch)))
      );
      if (found) {
         setRegistration(found);
      } else {
         alert("Không tìm thấy Phiếu đăng ký nào ở trạng thái 'Đã xử lý' khớp với thông tin này.");
         setRegistration(null);
      }
   };

   const selectedRoom = rooms.find(r => r.id === selectedRoomId);
   const calculatedBeds = isFullRoom && selectedRoom ? selectedRoom.maxCount : selectedBeds.length;
   const totalRent = selectedRoom ? (
       isFullRoom 
       ? selectedRoom.beds.reduce((sum: number, b: any) => sum + (b.price || 0), 0)
       : selectedBeds.reduce((sum: number, bedId: string) => {
           const bed = selectedRoom.beds.find((b: any) => b.id === bedId);
           return sum + (bed?.price || 0);
       }, 0)
   ) : 0;
   const totalDeposit = totalRent * 2;

   const handleCreateDeposit = async () => {
      if (!registration) return;
      if (!selectedRoom) return alert('Vui lòng chọn phòng');
      if (!isFullRoom && selectedBeds.length === 0) return alert('Vui lòng chọn giường');

      const payload = {
         RegistrationID: registration.id,
         CustomerName: registration.customer,
         PhoneNumber: registration.phone,
         CCCD: registration.cccd,
         RoomID: selectedRoomId,
         Beds: isFullRoom ? selectedRoom.beds.map((b: any) => b.id) : selectedBeds,
         Amount: totalDeposit,
         DepositDate: new Date().toISOString(),
         PaymentMethod: paymentMethod,
      };

      try {
         const res = await fetch(`${API_URL}/api/v1/deposits`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
         });
         const data = await res.json();
         if (data.status === 'success') {
            alert('Gửi yêu cầu thanh toán thành công!');
            fetchDeposits();
            setViewMode('list');
         } else {
            alert('Lỗi: ' + data.message);
         }
      } catch (err) {
         console.error(err);
         alert('Không thể kết nối đến server');
      }
   };

   if (viewMode === 'list') {
      return (
         <div className="p-8 h-full max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-8">
               <div>
                  <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1">Tiếp nhận cọc</h1>
                  <p className="text-sm text-[#666666]">Tiếp nhận yêu cầu, tính tiền cọc và theo dõi xác nhận thanh toán.</p>
               </div>
               <button onClick={() => setViewMode('create')} className="px-4 py-2.5 bg-[#B7705F] hover:bg-[#a06050] text-white rounded-lg text-sm font-bold flex items-center transition-colors shadow-sm">
                  <Plus className="w-4 h-4 mr-2" /> Lập phiếu cọc mới
               </button>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#EAD3CC]/50 mb-6 flex flex-wrap gap-4 items-center">
               <div className="flex-1 min-w-[300px] relative">
                  <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                  <input
                     type="text"
                     placeholder="Tìm theo Tên khách hàng/Mã phiếu..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#B7705F]"
                  />
               </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-[#EAD3CC]/50 overflow-hidden">
               <table className="w-full text-left text-sm">
                  <thead className="bg-[#FAF5F3] text-[#666666]">
                     <tr>
                        <th className="px-6 py-4 font-medium">Mã Phiếu</th>
                        <th className="px-6 py-4 font-medium">Khách Hàng</th>
                        <th className="px-6 py-4 font-medium">CCCD</th>
                        <th className="px-6 py-4 font-medium">Phòng - Giường</th>
                        <th className="px-6 py-4 font-medium">Số tiền cọc</th>
                        <th className="px-6 py-4 font-medium">Trạng thái</th>
                        <th className="px-6 py-4 font-medium text-right">Thao Tác</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {list.filter(item => !searchTerm || item.customer.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.toLowerCase())).map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                           <td className="px-6 py-4 font-bold text-[#B7705F]">{item.id}</td>
                           <td className="px-6 py-4 font-medium text-[#222222]">{item.customer}</td>
                           <td className="px-6 py-4 text-[#666666]">{item.cccd}</td>
                           <td className="px-6 py-4 text-[#666666]">{item.room} - {item.beds ? item.beds.join(', ') : ''}</td>
                           <td className="px-6 py-4 text-[#B7705F] font-bold">{item.amount}</td>
                           <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded text-xs font-semibold ${item.status === 'Đã thanh toán' ? 'bg-green-50 text-green-600' : item.status === 'Chờ thanh toán' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'}`}>
                                 {item.status}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <button onClick={() => {
                                 setSelectedItem(item);
                                 setViewMode('detail');
                              }} className="px-3 py-1.5 text-sm font-medium text-[#B7705F] bg-orange-50 hover:bg-[#F3E1DC] rounded-lg transition-colors inline-block">
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

   if (viewMode === 'create') {
      return (
         <div className="p-8 h-full max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-8">
               <div>
                  <div className="flex items-center space-x-3 mb-2">
                     <button onClick={() => setViewMode('list')} className="text-[#666666] hover:text-[#B7705F] flex items-center text-sm font-medium">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại danh sách
                     </button>
                  </div>
                  <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1">Lập phiếu đặt cọc mới</h1>
               </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#EAD3CC] mb-6">
               {!registration ? (
                  <>
                     <h2 className="text-lg font-bold text-[#222222] mb-4">Tra cứu</h2>
                     <div className="flex space-x-4">
                        <div className="flex-1 relative">
                           <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                           <input
                              type="text"
                              placeholder="Nhập Tên/CCCD/SĐT của khách hàng để tra cứu..."
                              value={searchCCCD}
                              onChange={(e) => setSearchCCCD(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B7705F]"
                           />
                        </div>
                        <button onClick={handleSearchCCCD} className="px-6 py-2.5 bg-[#B7705F] text-white rounded-lg font-bold shadow-sm hover:bg-[#a06050]">Tìm kiếm</button>
                     </div>

                     <div className="mt-6">
                        <div className="bg-white rounded-xl shadow-sm border border-[#EAD3CC]/50 overflow-hidden">
                           <table className="w-full text-left text-sm">
                              <thead className="bg-[#FAF5F3] text-[#666666]">
                                 <tr>
                                    <th className="px-4 py-3 font-medium">Mã Phiếu ĐK</th>
                                    <th className="px-4 py-3 font-medium">Khách Hàng</th>
                                    <th className="px-4 py-3 font-medium">CCCD</th>
                                    <th className="px-4 py-3 font-medium">SĐT</th>
                                    <th className="px-4 py-3 font-medium text-right">Thao Tác</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                 {registrations.filter(r => {
                                    const term = searchCCCD.toLowerCase().trim();
                                    return r.status === 'Đã xử lý' && (!term || (r.cccd && r.cccd.toLowerCase().includes(term)) || (r.phone && r.phone.toLowerCase().includes(term)) || (r.customer && r.customer.toLowerCase().includes(term)));
                                 }).map((reg, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                       <td className="px-4 py-3 font-medium text-[#B7705F]">{reg.id}</td>
                                       <td className="px-4 py-3 text-[#222222] font-semibold">{reg.customer}</td>
                                       <td className="px-4 py-3 text-[#666666]">{reg.cccd}</td>
                                       <td className="px-4 py-3 text-[#666666]">{reg.phone}</td>
                                       <td className="px-4 py-3 text-right">
                                          <button onClick={() => {
                                             setSearchCCCD(reg.cccd);
                                             setRegistration(reg);
                                          }} className="px-3 py-1.5 text-sm font-medium text-white bg-[#B7705F] hover:bg-[#a06050] rounded-lg transition-colors shadow-sm">
                                             Chọn
                                          </button>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </>
               ) : (
                  <div className="p-4 bg-[#FAF5F3] rounded-xl border border-[#EAD3CC]">
                     <div className="flex justify-between items-center mb-3 border-b border-[#EAD3CC]/50 pb-2">
                        <h3 className="font-bold text-[#B7705F]">Thông tin Khách Hàng</h3>
                        <button onClick={() => setRegistration(null)} className="text-xs text-[#666666] hover:text-[#B7705F] font-semibold underline">
                           Chọn khách hàng khác
                        </button>
                     </div>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div><span className="block text-xs text-gray-500 uppercase">Họ và tên</span><span className="font-semibold text-gray-900">{registration.customer}</span></div>
                        <div><span className="block text-xs text-gray-500 uppercase">SĐT</span><span className="font-semibold text-gray-900">{registration.phone}</span></div>
                        <div><span className="block text-xs text-gray-500 uppercase">CCCD</span><span className="font-semibold text-gray-900">{registration.cccd}</span></div>
                        <div><span className="block text-xs text-gray-500 uppercase">Phiếu ĐK</span><span className="font-semibold text-gray-900">{registration.id}</span></div>
                     </div>
                  </div>
               )}
            </div>

            {registration && (
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#EAD3CC] mb-6">
                  <h2 className="text-lg font-bold text-[#222222] mb-4">Lựa chọn Phòng & Giường thuê</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-semibold text-[#666666] mb-2">Chọn Phòng</label>
                        <div className="relative">
                           <button
                              type="button"
                              onClick={() => setIsRoomDropdownOpen(!isRoomDropdownOpen)}
                              className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm flex justify-between items-center focus:outline-none focus:border-[#B7705F]"
                           >
                              <span className="text-gray-800 font-medium">
                                 {selectedRoomId ? `${selectedRoomId} (Tối đa ${rooms.find(r => r.id === selectedRoomId)?.maxCount} người)` : '-- Chọn phòng --'}
                              </span>
                           </button>

                           {isRoomDropdownOpen && (
                              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden flex flex-col">
                                 <div className="p-2 border-b border-gray-100 bg-gray-50">
                                    <input
                                       type="text"
                                       placeholder="Tìm kiếm phòng..."
                                       value={roomSearchQuery}
                                       onChange={e => setRoomSearchQuery(e.target.value)}
                                       onClick={e => e.stopPropagation()}
                                       className="w-full bg-white border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:border-[#B7705F]"
                                       autoFocus
                                    />
                                 </div>
                                 <div className="max-h-48 overflow-y-auto bg-white">
                                    {availableRooms
                                       .filter(r => r.id.toLowerCase().includes(roomSearchQuery.toLowerCase()))
                                       .map(r => (
                                          <button
                                             key={r.id}
                                             type="button"
                                             onClick={() => {
                                                setSelectedRoomId(r.id);
                                                setSelectedBeds([]);
                                                setIsFullRoom(false);
                                                setIsRoomDropdownOpen(false);
                                                setRoomSearchQuery('');
                                                setRentPrice(r.price.toString());
                                             }}
                                             className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${selectedRoomId === r.id ? 'bg-[#FAF5F3] text-[#8C4A3A] font-medium' : 'text-gray-700'}`}
                                          >
                                             {r.id} <span className="text-gray-500 text-xs ml-1">(Tối đa {r.maxCount} người)</span>
                                          </button>
                                       ))
                                    }
                                    {availableRooms.filter(r => r.id.toLowerCase().includes(roomSearchQuery.toLowerCase())).length === 0 && (
                                       <div className="px-3 py-3 text-sm text-center text-gray-500">
                                          Không tìm thấy phòng phù hợp hoặc phòng đã đầy
                                       </div>
                                    )}
                                 </div>
                              </div>
                           )}
                        </div>
                     </div>
                     <div>
                        <label className="block text-sm font-semibold text-[#666666] mb-2">Tổng tiền thuê dự kiến (VND/tháng)</label>
                        <input
                           type="text"
                           readOnly
                           value={totalRent !== 0 ? new Intl.NumberFormat('vi-VN').format(totalRent) : ''}
                           placeholder="Chọn phòng và giường để xem giá..."
                           className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 font-medium text-[#666666] focus:outline-none"
                        />
                     </div>
                  </div>

                  {selectedRoom && (
                     <div className="mt-6 border-t border-gray-100 pt-6">
                        <div className="flex items-center justify-between mb-4">
                           <label className="text-sm font-semibold text-[#222222]">Chỉ định Giường thuê</label>
                           <label className={`flex items-center space-x-2 ${selectedRoom.beds.some((b: any) => b.status !== 'Trống') ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                              <input
                                 type="checkbox"
                                 checked={isFullRoom}
                                 disabled={selectedRoom.beds.some((b: any) => b.status !== 'Trống')}
                                 onChange={(e) => setIsFullRoom(e.target.checked)}
                                 className={`w-4 h-4 text-[#B7705F] border-gray-300 rounded focus:ring-[#B7705F] ${selectedRoom.beds.some((b: any) => b.status !== 'Trống') ? 'cursor-not-allowed' : ''}`}
                              />
                           <span className="text-sm font-semibold text-orange-600">
                              Khách thuê nguyên phòng ({selectedRoom.maxCount} giường)
                              {selectedRoom.beds.some((b: any) => b.status !== 'Trống') && <span className="text-gray-500 ml-1 font-normal">(Phòng đã có khách)</span>}
                           </span>
                           </label>
                        </div>

                        {!isFullRoom && (
                            <div className="grid grid-cols-4 gap-4">
                               {selectedRoom.beds.map((bed: any) => {
                                 const isSelected = selectedBeds.includes(bed.id);
                                 return (
                                    <div
                                       key={bed.id}
                                       onClick={() => {
                                          if (bed.status !== 'Trống') return;
                                          if (isSelected) {
                                             setSelectedBeds(selectedBeds.filter(id => id !== bed.id));
                                          } else {
                                             setSelectedBeds([...selectedBeds, bed.id]);
                                          }
                                       }}
                                       className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${bed.status !== 'Trống' ? 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed' : isSelected ? 'bg-[#F3E1DC] border-[#B7705F]' : 'bg-white border-gray-200 hover:border-[#EAD3CC]'}`}
                                    >
                                       <div className="flex justify-between items-center mb-2">
                                          <BedDouble className={`w-5 h-5 ${isSelected ? 'text-[#B7705F]' : 'text-gray-400'}`} />
                                          {isSelected && <CheckCircle className="w-4 h-4 text-[#B7705F]" />}
                                       </div>
                                       <div className={`font-bold ${isSelected ? 'text-[#8C4A3A]' : 'text-gray-700'}`}>Giường {bed.id}</div>
                                       <div className="text-xs text-gray-500 mt-1">{bed.status} - {new Intl.NumberFormat('vi-VN').format(bed.price || 0)}đ</div>
                                    </div>
                                 );
                              })}
                           </div>
                        )}
                     </div>
                  )}

                  {(isFullRoom || selectedBeds.length > 0) && (
                     <div className="mt-8 pt-6 border-t border-dashed border-gray-300">
                        <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex items-center justify-between">
                           <div>
                              <p className="text-sm font-semibold text-gray-800">TỔNG KẾT TIỀN CỌC</p>
                              <p className="text-xs text-gray-500 mt-1">Công thức: Tổng Tiền Thuê ({new Intl.NumberFormat('vi-VN').format(totalRent)}) x 2 tháng</p>
                           </div>
                           <div className="text-right">
                              <span className="block text-xs text-gray-500 uppercase">Tổng cọc yêu cầu</span>
                              <span className="text-3xl font-bold text-[#B7705F]">
                                 {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalDeposit)}
                              </span>
                           </div>
                        </div>
                        
                        <div className="mt-4">
                           <label className="block text-sm font-semibold text-[#666666] mb-2">Hình thức thanh toán</label>
                           <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#B7705F]">
                              <option value="Chuyển khoản">Chuyển khoản</option>
                              <option value="Tiền mặt">Tiền mặt</option>
                              <option value="Thẻ tín dụng">Thẻ tín dụng</option>
                           </select>
                        </div>

                        <button onClick={handleCreateDeposit} className="w-full mt-6 py-4 bg-[#B7705F] text-white rounded-xl text-sm font-bold shadow-sm hover:bg-[#a06050] transition-colors flex items-center justify-center">
                           <Receipt className="w-5 h-5 mr-2" /> Gửi Yêu Cầu Thanh Toán Tiền Cọc
                        </button>
                        <p className="text-xs text-center text-gray-500 mt-3">* Khách có 24h để thanh toán, sau 24h phiếu cọc tự động hủy.</p>
                     </div>
                  )}
               </div>
            )}
         </div>
      );
   }

   // Detail View (Read-only representation of Mock)
   return (
      <div className="p-8 h-full max-w-6xl mx-auto">
         <div className="flex justify-between items-end mb-8">
            <div>
               <div className="flex items-center space-x-3 mb-2">
                  <button onClick={() => setViewMode('list')} className="text-[#666666] hover:text-[#B7705F] flex items-center text-sm font-medium">
                     <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại
                  </button>
               </div>
               <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1">Chi tiết Phiếu Cọc - {selectedItem.id}</h1>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#EAD3CC]">
               <h3 className="text-lg font-bold text-[#222222] mb-4 flex items-center border-b border-gray-100 pb-3">
                  <Calculator className="w-5 h-5 mr-2 text-[#B7705F]" /> Tính tiền cọc & gửi yêu cầu
               </h3>
               <div className="space-y-4">
                  <div>
                     <span className="block text-sm text-gray-500 mb-1">Tiền thuê 1 giường (VND/tháng)</span>
                     <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg font-medium">{selectedItem.rentPrice}</div>
                  </div>
                  <div>
                     <label className="flex items-center space-x-2">
                        <input type="checkbox" checked={selectedItem.isFullRoom} disabled className="w-4 h-4 text-[#B7705F] border-gray-300 rounded" />
                        <span className="text-sm font-semibold text-gray-700">Khách thuê nguyên phòng</span>
                     </label>
                  </div>
                  <div>
                     <span className="block text-sm text-gray-500 mb-1">Số giường thuê</span>
                     <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg font-medium">{selectedItem.beds ? selectedItem.beds.length : 0}</div>
                  </div>
                  <div className="mt-4 p-4 bg-[#FAF5F3] rounded-xl border border-[#EAD3CC]">
                     <span className="block text-xs text-gray-500 mb-1">Công thức: (Tiền Thuê 2 tháng) x Số Giường</span>
                     <div className="flex justify-between items-center mt-2">
                        <span className="font-semibold text-gray-800">Tổng tiền cọc yêu cầu:</span>
                        <span className="text-2xl font-bold text-[#B7705F]">{selectedItem.amount}</span>
                     </div>
                  </div>
               </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#EAD3CC]">
               <h3 className="text-lg font-bold text-[#222222] mb-4 border-b border-gray-100 pb-3">Thông tin cá nhân khách hàng</h3>
               <div className="space-y-4">
                  <div>
                     <span className="block text-xs text-gray-500 mb-1">Họ và tên</span>
                     <div className="font-semibold">{selectedItem.customer}</div>
                  </div>
                  <div>
                     <span className="block text-xs text-gray-500 mb-1">Số điện thoại</span>
                     <div className="font-semibold">{selectedItem.phone}</div>
                  </div>
                  <div>
                     <span className="block text-xs text-gray-500 mb-1">CCCD/CMND</span>
                     <div className="font-semibold">{selectedItem.cccd}</div>
                  </div>
                  <div>
                     <span className="block text-xs text-gray-500 mb-1">Email</span>
                     <div className="font-semibold">{selectedItem.email}</div>
                  </div>
                  <div>
                     <span className="block text-xs text-gray-500 mb-1">Địa chỉ thường trú</span>
                     <div className="font-semibold">{selectedItem.address}</div>
                  </div>
               </div>
            </div>
         </div>

         <div className="flex gap-4">
            {(selectedItem.status === 'Chờ thanh toán' || selectedItem.status === 'Đã thanh toán') && (
               <button onClick={async () => {
                  if (!window.confirm('Bạn có chắc chắn muốn hủy phiếu cọc này? Hành động này không thể hoàn tác.')) return;
                  try {
                     const res = await fetch(`${API_URL}/api/v1/deposits/${selectedItem.id}/cancel`, {
                        method: 'PUT'
                     });
                     const data = await res.json();
                     if (data.status === 'success') {
                        alert(data.data?.message || 'Đã hủy phiếu cọc thành công!');
                        setSelectedItem({ ...selectedItem, status: 'Đã hủy' });
                        fetchDeposits();
                     } else {
                        alert('Lỗi: ' + data.message);
                     }
                  } catch (err) {
                     console.error(err);
                     alert('Không thể kết nối đến server');
                  }
               }} className="flex-1 py-4 bg-red-100 text-red-600 rounded-xl text-sm font-bold shadow-sm hover:bg-red-200 transition-colors flex items-center justify-center">
                  Hủy Phiếu Cọc
               </button>
            )}

            {selectedItem.status === 'Chờ thanh toán' && (
             <button onClick={async () => {
                try {
                   const res = await fetch(`${API_URL}/api/v1/deposits/${selectedItem.id}/confirm`, {
                      method: 'PUT'
                   });
                   const data = await res.json();
                   if (data.status === 'success') {
                      alert('Xác nhận đã thanh toán thành công! Sẽ tự động chuyển xếp lịch nhận phòng.');
                      setSelectedItem({ ...selectedItem, status: 'Đã thanh toán' });
                      // Cập nhật lại danh sách (fetch lại) để sync dữ liệu
                      fetch(`${API_URL}/api/v1/deposits`)
                         .then(r => r.json())
                         .then(d => {
                            if (d.status === 'success') setList(d.data);
                         });
                   } else {
                      alert('Lỗi: ' + data.message);
                   }
                } catch (err) {
                   console.error(err);
                   alert('Không thể kết nối đến server');
                }
             }} className="w-full py-4 bg-[#B7705F] text-white rounded-xl text-sm font-bold shadow-sm hover:bg-[#a06050] transition-colors flex items-center justify-center">
               <CheckCircle className="w-5 h-5 mr-2" /> Xác nhận đã thanh toán
            </button>
            )}
         </div>
      </div>
   );
}
