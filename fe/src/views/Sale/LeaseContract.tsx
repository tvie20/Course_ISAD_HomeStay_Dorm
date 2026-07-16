import React, { useState, useEffect } from 'react';
import { Search, UserCheck, CreditCard, Users, ShieldAlert, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import CreateLease from '../Sale/CreateLease';

export default function LeaseContract() {
   const [deposits, setDeposits] = useState<any[]>([]);
   const [selectedDeposit, setSelectedDeposit] = useState<any>(null);
   const [isChecking, setIsChecking] = useState(false);
   const [isCreating, setIsCreating] = useState(false);
   const [searchTerm, setSearchTerm] = useState('');

   const [numRoommates, setNumRoommates] = useState<number>(0);
   const [roommates, setRoommates] = useState<{ name: string; phone: string; cccd: string }[]>([
      { name: '', phone: '', cccd: '' },
      { name: '', phone: '', cccd: '' },
      { name: '', phone: '', cccd: '' }
   ]);

   const [customerPhone, setCustomerPhone] = useState('');
   const [customerCccd, setCustomerCccd] = useState('');
   const [isOcrScanning, setIsOcrScanning] = useState(false);
   const [ocrSuccess, setOcrSuccess] = useState(false);
   const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

   const fetchDeposits = () => {
      fetch('http://localhost:5000/api/v1/deposits')
         .then(res => res.json())
         .then(data => {
            if (data.status === 'success') {
               setDeposits(data.data.filter((d: any) => d.status === 'Sắp nhận phòng'));
            }
         })
         .catch(err => console.error(err));
   };

   const handleSelectDeposit = (deposit: any) => {
      setSelectedDeposit(deposit);
      setCustomerPhone(deposit.phone || '');
      setCustomerCccd(deposit.cccd || '');
      setIsChecking(true);
      setOcrSuccess(false);
      setUploadedFiles([]);

      const calculatedNumRoommates = deposit.beds && deposit.beds.length > 0 ? deposit.beds.length - 1 : 0;
      setNumRoommates(calculatedNumRoommates);
      setRoommates(Array.from({ length: Math.max(0, calculatedNumRoommates) }).map(() => ({ name: '', phone: '', cccd: '' })));
   };

   useEffect(() => {
      fetchDeposits();
   }, []);

   const handleOcrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
         const names = Array.from(files).map((f: any) => f.name);
         setUploadedFiles(names);
         setIsOcrScanning(true);
         setOcrSuccess(false);

         setTimeout(() => {
            setIsOcrScanning(false);
            setOcrSuccess(true);
            // Automatically fill in a realistic 12-digit CCCD
            setCustomerCccd("079198765432");
         }, 1500);
      }
   };

   if (isCreating) {
      return (
         <CreateLease
            onCancel={() => { setIsCreating(false); setIsChecking(false); setSelectedDeposit(null); }}
            onSuccess={() => {
               setIsCreating(false);
               setIsChecking(false);
               setSelectedDeposit(null);
               fetchDeposits();
            }}
            initialData={{
               ...selectedDeposit,
               phone: customerPhone,
               cccd: customerCccd,
               roommates: roommates.slice(0, numRoommates)
            }}
         />
      );
   }

   if (isChecking && selectedDeposit) {
      return (
         <div className="p-8 h-full max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-6">
               <div>
                  <div className="flex items-center space-x-3 mb-2">
                     <button onClick={() => { setIsChecking(false); setSelectedDeposit(null); }} className="text-[#666666] hover:text-[#B7705F] flex items-center text-sm font-medium">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại
                     </button>
                  </div>
                  <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1">Xét duyệt lưu trú - {selectedDeposit.room}</h1>
                  <p className="text-sm text-[#666666]">Đảm bảo hoàn tất các bước pháp lý trước khi tạo hợp đồng thuê mới.</p>
               </div>
               <button onClick={() => setIsCreating(true)} className="px-5 py-2.5 bg-[#B7705F] text-white rounded-lg text-sm font-medium hover:bg-[#a06050] transition-colors flex items-center shadow-sm">
                  Tiếp tục lập hợp đồng <ArrowRight className="w-4 h-4 ml-2" />
               </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-[#EAD3CC] overflow-hidden">
                     <div className="bg-[#FAF5F3] px-6 py-4 border-b border-[#EAD3CC]/50">
                        <h2 className="font-bold text-[#222222] flex items-center"><UserCheck className="w-5 h-5 mr-2 text-[#B7705F]" /> Hồ sơ định danh khách hàng</h2>
                     </div>
                     <div className="p-6">
                        {/* OCR Upload removed */}
                        <div className="space-y-4">
                           <div>
                              <label className="block text-xs font-semibold text-[#666666] mb-1">Họ và tên</label>
                              <input
                                 type="text"
                                 className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 focus:outline-none cursor-not-allowed"
                                 value={selectedDeposit.customer}
                                 readOnly
                              />
                           </div>
                           <div>
                              <label className="block text-xs font-semibold text-[#666666] mb-1">Số điện thoại khách hàng *</label>
                              <input
                                 type="text"
                                 className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 focus:outline-none cursor-not-allowed"
                                 value={customerPhone}
                                 readOnly
                              />
                           </div>
                           <div>
                              <label className="block text-xs font-semibold text-[#666666] mb-1">Số CCCD *</label>
                              <input
                                 type="text"
                                 className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 focus:outline-none cursor-not-allowed"
                                 value={customerCccd}
                                 readOnly
                              />
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-[#EAD3CC] overflow-hidden">
                     <div className="bg-[#FAF5F3] px-6 py-4 border-b border-[#EAD3CC]/50">
                        <h2 className="font-bold text-[#222222] flex items-center"><Users className="w-5 h-5 mr-2 text-[#B7705F]" /> Đối soát nhóm/người ở cùng</h2>
                     </div>
                     <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                           <span className="text-sm font-semibold text-[#222222]">Thông tin người ở cùng</span>
                           <span className="text-sm font-bold text-[#B7705F]">{numRoommates} người</span>
                        </div>
                        {numRoommates > 0 && (
                           <div className="mb-4 space-y-4">
                              {Array.from({ length: numRoommates }).map((_, idx) => (
                                 <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
                                    <h4 className="text-xs font-bold text-[#B7705F]">Người ở cùng {idx + 1}</h4>
                                    <div>
                                       <label className="block text-xs font-semibold text-[#666666] mb-1">Họ và tên</label>
                                       <input
                                          type="text"
                                          className="w-full bg-white border border-gray-200 rounded px-2 py-1.5 text-xs focus:border-[#B7705F] focus:outline-none"
                                          placeholder="Nhập họ và tên"
                                          value={roommates[idx].name}
                                          onChange={(e) => {
                                             const newRoommates = [...roommates];
                                             newRoommates[idx] = { ...newRoommates[idx], name: e.target.value };
                                             setRoommates(newRoommates);
                                          }}
                                       />
                                    </div>
                                    <div className="space-y-3">
                                       <div>
                                          <label className="block text-xs font-semibold text-[#666666] mb-1">Số CCCD</label>
                                          <input
                                             type="text"
                                             className="w-full bg-white border border-gray-200 rounded px-2 py-1.5 text-xs focus:border-[#B7705F] focus:outline-none"
                                             placeholder="CCCD/CMND"
                                             value={roommates[idx].cccd}
                                             onChange={(e) => {
                                                const newRoommates = [...roommates];
                                                newRoommates[idx] = { ...newRoommates[idx], cccd: e.target.value };
                                                setRoommates(newRoommates);
                                             }}
                                          />
                                       </div>
                                       <div>
                                          <label className="block text-xs font-semibold text-[#666666] mb-1">Số điện thoại</label>
                                          <input
                                             type="text"
                                             className="w-full bg-white border border-gray-200 rounded px-2 py-1.5 text-xs focus:border-[#B7705F] focus:outline-none"
                                             placeholder="SĐT liên hệ"
                                             value={roommates[idx].phone}
                                             onChange={(e) => {
                                                const newRoommates = [...roommates];
                                                newRoommates[idx] = { ...newRoommates[idx], phone: e.target.value.replace(/\D/g, '') };
                                                setRoommates(newRoommates);
                                             }}
                                          />
                                       </div>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        )}
                        <div className="p-3 bg-blue-50 text-blue-800 rounded-lg text-xs font-medium flex items-start">
                           <ShieldAlert className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
                           Hệ thống quy định tối đa sức chứa cho phép. Vui lòng đảm bảo không vượt quá số lượng giường/phòng.
                        </div>
                     </div>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-[#EAD3CC] overflow-hidden">
                     <div className="bg-[#FAF5F3] px-6 py-4 border-b border-[#EAD3CC]/50">
                        <h2 className="font-bold text-[#222222] flex items-center"><CreditCard className="w-5 h-5 mr-2 text-[#B7705F]" /> Thông tin đặt cọc</h2>
                     </div>
                     <div className="p-6 space-y-3">
                        <div className="flex justify-between text-sm">
                           <span className="text-[#666666]">Mã phiếu cọc</span>
                           <span className="font-semibold text-[#222222]">{selectedDeposit.id}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                           <span className="text-[#666666]">Số tiền đã thanh toán</span>
                           <span className="font-bold text-green-600">{selectedDeposit.amount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                           <span className="text-[#666666]">Tình trạng xác nhận</span>
                           <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                              <CheckCircle className="w-3 h-3 mr-1" /> Quản lý đã duyệt
                           </span>
                        </div>
                     </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-[#EAD3CC] overflow-hidden">
                     <div className="bg-[#FAF5F3] px-6 py-4 border-b border-[#EAD3CC]/50">
                        <h2 className="font-bold text-[#222222] flex items-center"><CheckCircle className="w-5 h-5 mr-2 text-[#B7705F]" /> Điều kiện lưu trú</h2>
                     </div>
                     <div className="p-6">
                        <label className="flex items-start space-x-3 cursor-pointer">
                           <input type="checkbox" className="mt-1 w-4 h-4 text-[#B7705F] border-gray-300 rounded focus:ring-[#B7705F]" />
                           <span className="text-sm text-[#222222] block leading-relaxed">
                              Khách hàng đã đọc, hiểu và đồng ý với các Nội quy Ký túc xá.
                           </span>
                        </label>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="p-8 h-full max-w-7xl mx-auto">
         <div className="flex justify-between items-end mb-8">
            <div>
               <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1">Lập hợp đồng thuê</h1>
               <p className="text-sm text-[#666666]">Tìm kiếm và chọn khách hàng đã có phiếu đặt cọc hợp lệ để bắt đầu lập hợp đồng.</p>
            </div>
         </div>

         <div className="bg-white p-4 rounded-xl shadow-sm border border-[#EAD3CC]/50 mb-6 flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[300px] relative">
               <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
               <input
                  type="text"
                  placeholder="Tìm theo Tên khách hàng/CCCD/..."
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
                     <th className="px-6 py-4 font-medium">Mã Đặt Cọc</th>
                     <th className="px-6 py-4 font-medium">Khách Hàng</th>
                     <th className="px-6 py-4 font-medium">Số điện thoại</th>
                     <th className="px-6 py-4 font-medium">Căn hộ / Phòng</th>
                     <th className="px-6 py-4 font-medium text-right">Thao Tác</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {deposits.filter(d => !searchTerm || (d.customer && String(d.customer).toLowerCase().includes(searchTerm.toLowerCase())) || (d.id && String(d.id).toLowerCase().includes(searchTerm.toLowerCase())) || (d.cccd && String(d.cccd).toLowerCase().includes(searchTerm.toLowerCase()))).map(deposit => (
                     <tr key={deposit.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-[#B7705F]">{deposit.id}</td>
                        <td className="px-6 py-4 text-[#222222] font-semibold">{deposit.customer}</td>
                        <td className="px-6 py-4 text-[#666666]">{deposit.phone}</td>
                        <td className="px-6 py-4 text-[#666666]">{deposit.room}</td>
                        <td className="px-6 py-4 text-right">
                           <button onClick={() => handleSelectDeposit(deposit)} className="px-3 py-1.5 text-sm font-medium text-white bg-[#B7705F] hover:bg-[#a06050] rounded-lg transition-colors inline-block shadow-sm">
                              Bắt đầu lập hợp đồng
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
