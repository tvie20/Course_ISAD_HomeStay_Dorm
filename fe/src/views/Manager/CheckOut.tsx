import React, { useState, useEffect } from 'react';
import { Printer, CheckCircle, AlertTriangle, ArrowRight, Trash2, ArrowLeft, Search, Clock, Check, FileText, Send } from 'lucide-react';

const MOCK_LIST = [
   { id: '1', room: 'P.102', bed: 'Giường 01', customer: 'Trần Văn B', cccd: '012345678901', date: '21/10/2023', status: 'Sắp Trả' },
];

export default function CheckOut() {
   const [selected, setSelected] = useState<any>(null);
   const [isCreatingRecord, setIsCreatingRecord] = useState(false);
   const [searchTerm, setSearchTerm] = useState('');
   const [statusFilter, setStatusFilter] = useState('');
   const [checkoutList, setCheckoutList] = useState<any[]>(MOCK_LIST);
   const [sentSuccess, setSentSuccess] = useState(false);
   const [reconData, setReconData] = useState<any>(null);

   // Load from localStorage
   useEffect(() => {
      const saved = localStorage.getItem('checkout_flow_request');
      if (saved) {
         const data = JSON.parse(saved);
         setReconData(data);
         // Display in CheckOut if the Accountant has finished financial reconciliation
         // i.e. status is in 'Đã đối soát', 'Gửi khách hàng', 'Đã thanh lý', 'Chờ hoàn cọc', 'Chờ thu bổ sung'
         const isReconciledStatus = ['Đã đối soát', 'Gửi khách hàng', 'Đã thanh lý', 'Chờ hoàn cọc', 'Chờ thu bổ sung'].includes(data.status);

         if (isReconciledStatus) {
            const flowItem = {
               id: 'flow_req_1',
               room: data.room || 'P.302',
               bed: data.bed || 'Giường 01',
               customer: data.customer || 'Trần Thị Sinh Viên',
               cccd: data.cccd || '079123456789',
               date: data.date || '25/10/2023',
               status: data.status,
               isFlowRequest: true
            };
            setCheckoutList([flowItem, ...MOCK_LIST]);
         } else {
            setCheckoutList(MOCK_LIST);
         }
      } else {
         setCheckoutList(MOCK_LIST);
         setReconData(null);
      }
   }, [isCreatingRecord, selected]);

   const filteredList = checkoutList.filter(item => {
      const matchSearch = searchTerm === '' || (
         item.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
         item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
         (item.cccd && item.cccd.includes(searchTerm))
      );
      const matchStatus = statusFilter === '' || item.status === statusFilter;
      return matchSearch && matchStatus;
   });

   const handleSelectItem = (item: any) => {
      setSelected(item);
      setIsCreatingRecord(true);
   };

   const handleSendToGuest = () => {
      const saved = localStorage.getItem('checkout_flow_request');
      if (saved) {
         const data = JSON.parse(saved);
         data.status = 'Gửi khách hàng';
         localStorage.setItem('checkout_flow_request', JSON.stringify(data));
      }

      if (selected) {
         setSelected({ ...selected, status: 'Gửi khách hàng' });
         setCheckoutList(prev => prev.map(item => {
            if (item.id === selected.id) {
               return { ...item, status: 'Gửi khách hàng' };
            }
            return item;
         }));
      }

      setSentSuccess(true);
      setTimeout(() => {
         setSentSuccess(false);
         setIsCreatingRecord(false);
         setSelected(null);
         alert('Hệ thống đã gửi biên bản trả phòng cho khách hàng xác nhận thành công!');
      }, 1500);
   };

   const handleFinalizeLiquidation = () => {
      const saved = localStorage.getItem('checkout_flow_request');
      if (saved) {
         const data = JSON.parse(saved);
         data.status = 'Đã thanh lý';
         localStorage.setItem('checkout_flow_request', JSON.stringify(data));
      }

      if (selected) {
         setSelected({ ...selected, status: 'Đã thanh lý' });
         setCheckoutList(prev => prev.map(item => {
            if (item.id === selected.id) {
               return { ...item, status: 'Đã thanh lý' };
            }
            return item;
         }));
      }

      alert('Đã lưu trữ biên bản trả phòng và chuyển hợp đồng thành công sang trạng thái: ĐÃ THANH LÝ!');
      setIsCreatingRecord(false);
      setSelected(null);
   };

   if (isCreatingRecord && selected) {
      // Dynamic values from accountant's reconciliation calculations
      const isFlow = selected.isFlowRequest;
      const depositVal = (isFlow && reconData?.deposit !== undefined) ? reconData.deposit : 6500000;
      const utilityVal = (isFlow && reconData?.utilityFee !== undefined) ? reconData.utilityFee : 175000;
      const cleaningVal = (isFlow && reconData?.cleaningFee !== undefined) ? reconData.cleaningFee : 150000;
      const damageVal = (isFlow && reconData?.damagedAssetFee !== undefined) ? reconData.damagedAssetFee : 150000;
      const liabilityVal = (isFlow && reconData?.rentLiability !== undefined) ? reconData.rentLiability : 0;
      const otherVal = (isFlow && reconData?.otherFee !== undefined) ? reconData.otherFee : 0;

      const totalDeductions = utilityVal + cleaningVal + damageVal + liabilityVal + otherVal;
      const netAmount = depositVal - totalDeductions;
      const refundOwed = netAmount >= 0;
      const absNet = Math.abs(netAmount);

      return (
         <div className="p-8 h-full max-w-7xl mx-auto">
            <div className="mb-8 flex flex-col space-y-4">
               <button onClick={() => { setIsCreatingRecord(false); setSelected(null); }} className="text-[#666666] hover:text-[#B7705F] flex items-center text-sm font-medium w-fit cursor-pointer">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại danh sách
               </button>
               <div className="flex justify-between items-start">
                  <div>
                     <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1 tracking-tight">Thanh lý hợp đồng &amp; giải phóng phòng</h1>
                     <p className="text-[#666666]">Phòng {selected.room} - {selected.bed} • Khách hàng: {selected.customer}</p>
                  </div>
                  <div>
                     {selected.status !== 'Gửi khách hàng' && selected.status !== 'Đã thanh lý' && (
                        <span className="px-3 py-1 bg-[#FAF5F3] text-[#8C4A3A] border border-[#EAD3CC] rounded-full text-xs font-semibold flex items-center shadow-sm">
                           <Check className="w-4 h-4 mr-1" /> Đối soát tài chính: {selected.status}
                        </span>
                     )}
                     {selected.status === 'Gửi khách hàng' && (
                        <span className="px-3 py-1 bg-[#FAF5F3] text-[#8C4A3A] border border-[#EAD3CC] rounded-full text-xs font-semibold flex items-center shadow-sm">
                           <Clock className="w-4 h-4 mr-1 animate-pulse" /> Đang chờ khách hàng xác nhận
                        </span>
                     )}
                     {selected.status === 'Đã thanh lý' && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded-full text-xs font-semibold flex items-center shadow-sm">
                           <CheckCircle className="w-4 h-4 mr-1" /> Đã thanh lý
                        </span>
                     )}
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="space-y-6">
                  <div className="bg-[#FAF5F3] rounded-2xl shadow-sm border border-[#EAD3CC] overflow-hidden p-6">
                     <h2 className="text-lg font-bold text-[#222222] mb-6 flex items-center">
                        <span className="w-6 h-6 rounded-md bg-[#B7705F] text-white flex items-center justify-center mr-2 text-sm">
                           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                        </span>
                        Tóm tắt kết quả đối soát tài chính tổng hợp
                     </h2>
                     <div className="space-y-4 mb-6">
                        <div className="flex justify-between text-sm">
                           <span className="text-[#666666]">Tiền cọc ban đầu (Đã thu)</span>
                           <span className="font-semibold text-[#222222]">{depositVal.toLocaleString()} đ</span>
                        </div>
                        <div className="flex justify-between text-sm">
                           <span className="text-[#666666]">Số tháng đã ở thực tế</span>
                           <span className="font-bold text-[#B7705F]">10 tháng</span>
                        </div>
                        <div className="flex justify-between text-sm text-red-600 border-b border-gray-200 pb-2">
                           <span className="text-red-500">Trừ tiền điện phát sinh cuối</span>
                           <span className="font-medium">- {utilityVal.toLocaleString()} đ</span>
                        </div>
                        <div className="flex justify-between text-sm text-red-600 border-b border-gray-200 pb-2">
                           <span className="text-red-500">Trừ chi phí dọn dẹp vệ sinh</span>
                           <span className="font-medium">- {cleaningVal.toLocaleString()} đ</span>
                        </div>
                        <div className="flex justify-between text-sm text-red-600 border-b border-gray-200 pb-4">
                           <span className="text-red-500">Khấu trừ tài sản hư hỏng</span>
                           <span className="font-medium">- {damageVal.toLocaleString()} đ</span>
                        </div>
                        {liabilityVal > 0 && (
                           <div className="flex justify-between text-sm text-red-600 border-b border-gray-200 pb-4">
                              <span className="text-red-500">Khấu trừ công nợ tồn đọng</span>
                              <span className="font-medium">- {liabilityVal.toLocaleString()} đ</span>
                           </div>
                        )}
                        {otherVal > 0 && (
                           <div className="flex justify-between text-sm text-red-600 border-b border-gray-200 pb-4">
                              <span className="text-red-500">Chi phí phát sinh khác</span>
                              <span className="font-medium">- {otherVal.toLocaleString()} đ</span>
                           </div>
                        )}
                     </div>
                     <div className="bg-white rounded-xl p-4 border border-gray-200 flex justify-between items-center shadow-sm">
                        <span className="text-sm font-bold text-[#222222]">
                           {refundOwed ? 'SỐ TIỀN HOÀN TRẢ KHÁCH THUÊ' : 'SỐ TIỀN KHÁCH PHẢI THANH TOÁN BỔ SUNG'}
                        </span>
                        <span className={`text-2xl font-bold ${refundOwed ? 'text-green-600' : 'text-red-600'}`}>
                           {absNet.toLocaleString()} đ
                        </span>
                     </div>
                  </div>

                  <div className="w-full mt-6 flex flex-row gap-4">
                     {selected.status !== 'Gửi khách hàng' && selected.status !== 'Đã thanh lý' && (
                        <button
                           onClick={handleSendToGuest}
                           disabled={sentSuccess}
                           className="flex-1 px-4 py-2.5 bg-[#8C4A3A] hover:bg-[#723a2d] text-white rounded-lg text-sm font-bold flex items-center justify-center transition-all shadow-sm cursor-pointer disabled:opacity-50"
                        >
                           <Send className="w-4 h-4 mr-2" />
                           Xác nhận tạo & gửi khách hàng
                        </button>
                     )}
                     {selected.status === 'Gửi khách hàng' && (
                        <>
                           <button
                              disabled={true}
                              className="flex-1 px-4 py-2.5 bg-[#FAF5F3] text-[#8C4A3A] border border-[#EAD3CC] rounded-lg text-sm font-bold flex items-center justify-center shadow-xs cursor-not-allowed opacity-80"
                           >
                              <Clock className="w-4 h-4 mr-1.5 animate-pulse" />
                              Chờ khách xác nhận...
                           </button>
                           <button
                              onClick={handleFinalizeLiquidation}
                              className="flex-1 px-4 py-2.5 bg-[#B7705F] hover:bg-[#a06050] text-white rounded-lg text-sm font-bold flex items-center justify-center transition-all shadow-sm cursor-pointer"
                           >
                              <CheckCircle className="w-4 h-4 mr-1.5" />
                              Hoàn tất thanh lý hợp đồng
                           </button>
                        </>
                     )}
                     {selected.status === 'Đã thanh lý' && (
                        <button
                           disabled={true}
                           className="w-full px-6 py-2.5 bg-gray-100 text-gray-500 border border-gray-200 rounded-lg text-sm font-bold flex items-center justify-center cursor-not-allowed"
                        >
                           <CheckCircle className="w-4 h-4 mr-2" />
                           Hợp đồng đã thanh lý thành công
                        </button>
                     )}
                  </div>
               </div>

               <div>
                  <div className="bg-white rounded-2xl shadow-sm border border-[#EAD3CC] flex flex-col h-full overflow-hidden">
                     <div className="bg-[#FAF5F3] px-6 py-4 border-b border-[#EAD3CC]/50 flex justify-between items-center">
                        <h2 className="font-bold text-[#222222] flex items-center">
                           <FileText className="w-5 h-5 mr-2 text-[#B7705F]" />
                           Biên bản thanh lý hợp đồng
                        </h2>
                        <button className="text-gray-500 hover:text-[#B7705F] transition-colors cursor-pointer">
                           <Printer className="w-5 h-5" />
                        </button>
                     </div>
                     <div className="p-8 bg-gray-50 flex-1 overflow-y-auto flex justify-center">
                        <div className="bg-white shadow border border-gray-200 aspect-[1/1.414] w-full max-w-[400px] p-8 text-[10px] leading-relaxed relative" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                           {selected.status === 'Đã thanh lý' && (
                              <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none select-none">
                                 <span className="text-green-600 font-bold text-4xl border-4 border-green-600 p-4 rounded-xl rotate-12">ĐÃ THANH LÝ</span>
                              </div>
                           )}
                           <div className="text-center font-bold mb-4">
                              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br />
                              Độc lập - Tự do - Hạnh phúc<br />
                              <div className="border-b border-black w-16 mx-auto my-1"></div>
                              BIÊN BẢN THANH LÝ HỢP ĐỒNG THUÊ PHÒNG
                           </div>
                           <div className="mb-2">
                              Hôm nay, ngày 25 tháng 10 năm 2023, tại HomeStay Dorm, chúng tôi gồm:
                           </div>
                           <div className="mb-2">
                              <p><strong>Bên A (Bên cho thuê):</strong> HomeStay Dorm</p>
                              <p><strong>Bên B (Bên thuê):</strong> {selected.customer}</p>
                           </div>
                           <div className="mb-2 text-justify">
                              Hai bên thống nhất lập biên bản thanh lý hợp đồng thuê phòng số {selected.room} - {selected.bed} với các nội dung sau:
                           </div>
                           <ol className="list-decimal pl-4 mb-4 space-y-1 text-justify">
                              <li>Chấm dứt hợp đồng thuê phòng kể từ ngày {selected.date}.</li>
                              <li>Bên B đã lưu trú thực tế: <strong>10 tháng</strong>.</li>
                              <li>Bên B đã bàn giao lại phòng và tài sản đi kèm đầy đủ.</li>
                              <li>Bên A hoàn trả lại số tiền cọc (sau khi trừ các khoản phí đối soát) là: <strong className="text-green-700">{absNet.toLocaleString()} VNĐ</strong>.</li>
                           </ol>
                           <div className="flex justify-between text-center font-bold mt-6">
                              <div>
                                 ĐẠI DIỆN BÊN A
                                 <p className="font-normal italic text-[8px] mt-1">(Ký &amp; đóng dấu)</p>
                                 <div className="mt-4 text-green-600 text-[9px] font-semibold">HOMESTAY DORM (Đã ký)</div>
                              </div>
                              <div>
                                 ĐẠI DIỆN BÊN B
                                 <p className="font-normal italic text-[8px] mt-1">(Xác nhận điện tử)</p>
                                 <div className="mt-4 text-[9px] font-semibold text-gray-500">
                                    {selected.status === 'Đã thanh lý' ? (
                                       <span className="text-green-600">ĐÃ ĐỒNG Ý KÝ</span>
                                    ) : (
                                       <span className="italic">Chờ xác nhận</span>
                                    )}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      );
   }

   if (!selected) {
      return (
         <div className="p-8 h-full max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-8">
               <div>
                  <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1">Trả phòng &amp; Lập biên bản</h1>
                  <p className="text-sm text-[#666666]">Lập biên bản thanh lý hợp đồng khi khách hàng trả phòng.</p>
               </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#EAD3CC]/50 mb-6 flex flex-wrap gap-4 items-center">
               <div className="flex-1 min-w-[300px] relative">
                  <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                  <input
                     type="text"
                     placeholder="Tìm theo Tên khách hàng / CCCD cần thanh lý hợp đồng..."
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
                   <option value="Sắp Trả">Sắp Trả</option>
                   <option value="Đã đối soát">Đã đối soát</option>
                   <option value="Gửi khách hàng">Gửi khách hàng</option>
                   <option value="Đã thanh lý">Đã thanh lý</option>
                   <option value="Chờ hoàn cọc">Chờ hoàn cọc</option>
                   <option value="Chờ thu bổ sung">Chờ thu bổ sung</option>
                 </select>
               </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-[#EAD3CC]/50 overflow-hidden">
               <table className="w-full text-left text-sm">
                  <thead className="bg-[#FAF5F3] text-[#666666]">
                     <tr>
                        <th className="px-6 py-4 font-medium">Phòng/Giường</th>
                        <th className="px-6 py-4 font-medium">Khách Hàng</th>
                        <th className="px-6 py-4 font-medium">CCCD</th>
                        <th className="px-6 py-4 font-medium">Ngày trả dự kiến</th>
                        <th className="px-6 py-4 font-medium">Trạng thái</th>
                        <th className="px-6 py-4 font-medium text-right">Thao Tác</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {filteredList.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                           <td className="px-6 py-4 font-medium text-[#222222]">{item.room} - {item.bed}</td>
                           <td className="px-6 py-4 text-[#666666] font-medium">{item.customer}</td>
                           <td className="px-6 py-4 text-[#666666] font-mono text-xs">{item.cccd}</td>
                           <td className="px-6 py-4 text-[#666666]">{item.date}</td>
                           <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded text-xs font-semibold border ${item.status === 'Đã thanh lý' ? 'bg-gray-100 text-gray-700 border border-gray-200' : 'bg-[#FAF5F3] text-[#8C4A3A] border border-[#EAD3CC]'
                                 }`}>
                                 {item.status}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <button
                                 onClick={() => handleSelectItem(item)}
                                 className="px-3 py-1.5 text-sm font-medium text-[#B7705F] bg-[#FAF5F3] hover:bg-[#F3E1DC] rounded-lg transition-colors inline-block cursor-pointer"
                              >
                                 Lập biên bản
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

   return null;
}
