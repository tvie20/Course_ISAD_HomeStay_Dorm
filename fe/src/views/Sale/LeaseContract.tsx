import React, { useState } from 'react';
import { Search, UserCheck, CreditCard, Users, ShieldAlert, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import CreateLease from '../Sale/CreateLease';

const MOCK_DEPOSITS = [
   { id: 'DC-2023-088', room: 'P.102', customer: 'Nguyễn Văn A', phone: '0901234567', amount: '4,000,000 đ' },
   { id: 'DC-2023-089', room: 'P.201', customer: 'Lê Thị C', phone: '0987654321', amount: '8,000,000 đ' },
];

export default function LeaseContract() {
   const [selectedDeposit, setSelectedDeposit] = useState<any>(null);
   const [isChecking, setIsChecking] = useState(false);
   const [isCreating, setIsCreating] = useState(false);

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

   const handleSelectDeposit = (deposit: any) => {
      setSelectedDeposit(deposit);
      setCustomerPhone(deposit.phone || '');
      setCustomerCccd('');
      setIsChecking(true);
      setOcrSuccess(false);
      setUploadedFiles([]);
   };

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
                        <div className="mb-4">
                           <label className="block text-sm font-semibold text-[#666666] mb-2">Chụp/Tải lên CCCD/Passport</label>
                           <input
                              type="file"
                              id="ocr-upload"
                              className="hidden"
                              multiple
                              accept="image/*,application/pdf"
                              onChange={handleOcrUpload}
                           />
                           <div
                              onClick={() => document.getElementById('ocr-upload')?.click()}
                              className="border border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative overflow-hidden min-h-[110px]"
                           >
                              {isOcrScanning ? (
                                 <div className="flex flex-col items-center space-y-2 py-2">
                                    <div className="w-8 h-8 border-4 border-[#B7705F] border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-xs text-[#B7705F] font-semibold">Đang nhận diện OCR... Vui lòng đợi</span>
                                 </div>
                              ) : ocrSuccess ? (
                                 <div className="flex flex-col items-center space-y-1 text-center">
                                    <CheckCircle className="w-8 h-8 text-green-500 animate-bounce" />
                                    <span className="text-xs text-green-600 font-bold">Nhận diện OCR thành công!</span>
                                    <span className="text-[10px] text-gray-400">Đã điền tự động CCCD: 079198765432</span>
                                    {uploadedFiles.length > 0 && (
                                       <span className="text-[10px] font-mono text-gray-500 underline mt-1">
                                          {uploadedFiles.join(', ')}
                                       </span>
                                    )}
                                 </div>
                              ) : (
                                 <>
                                    <span className="text-sm text-[#B7705F] font-bold">+ Tải lên mặt trước & mặt sau</span>
                                    <span className="text-xs text-gray-400 mt-1">Hỗ trợ nhận diện OCR tự động điền</span>
                                 </>
                              )}
                           </div>
                        </div>
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
                                 className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[#B7705F] focus:outline-none font-medium text-gray-800"
                                 placeholder="Nhập số điện thoại"
                                 value={customerPhone}
                                 onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                              />
                           </div>
                           <div>
                              <label className="block text-xs font-semibold text-[#666666] mb-1">Số CCCD *</label>
                              <input
                                 type="text"
                                 className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[#B7705F] focus:outline-none font-medium text-gray-800"
                                 placeholder="Nhập số CCCD"
                                 value={customerCccd}
                                 onChange={(e) => setCustomerCccd(e.target.value.replace(/\D/g, ''))}
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
                           <span className="text-sm font-semibold text-[#222222]">Khai báo số người ở cùng</span>
                           <select
                              className="border border-gray-200 rounded text-sm px-2 py-1 bg-white focus:outline-none"
                              value={numRoommates}
                              onChange={(e) => setNumRoommates(Number(e.target.value))}
                           >
                              <option value={0}>0 người</option>
                              <option value={1}>1 người</option>
                              <option value={2}>2 người</option>
                              <option value={3}>3 người</option>
                           </select>
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
                              Khách hàng đã đọc, hiểu và đồng ý với các Nội quy Ký túc xá/Căn hộ (giờ giấc, vệ sinh, khách đến thăm).
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
                  {MOCK_DEPOSITS.map(deposit => (
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
