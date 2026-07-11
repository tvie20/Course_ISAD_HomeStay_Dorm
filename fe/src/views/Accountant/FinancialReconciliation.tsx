import React, { useState, useEffect } from 'react';
import {
   FileText, Save, Send, Printer, CheckCircle, ArrowLeft, Eye, FileDigit,
   Info, Calculator, Upload, Search, AlertTriangle, CheckCircle2, DollarSign, HelpCircle, FileCheck
} from 'lucide-react';

const MOCK_RECON = [
   {
      id: 'DS-2026-01',
      room: 'P.102',
      bed: 'Giường 01',
      customer: 'Trần Văn B',
      type: 'Trả phòng',
      status: 'Chờ đối soát',
      isFlowRequest: false,
      hasInspection: true,
      hasContract: true,
      contractId: 'HD-2023-P102',
      leaseDuration: '21/10/2023 - 21/10/2024 (12 tháng)',
      monthsOccupied: 10,
      deposit: 4000000,
      rentLiability: 0,
      damagedAssetFee: 300000,
      damagedAssetDesc: 'Hỏng 1 tủ đựng đồ (phí khấu trừ: 300,000 đ)',
      utilityFee: 175000,
      cleaningFee: 150000,
      notes: 'Khách hàng dọn đi đúng thời hạn, giữ phòng tương đối sạch.'
   },
   {
      id: 'DS-2026-02',
      room: 'P.205',
      bed: 'Giường 02',
      customer: 'Nguyễn Thị Hương',
      type: 'Trả phòng',
      status: 'Chờ đối soát',
      isFlowRequest: false,
      hasInspection: false, // Exception A4: Missing Room Inspection Report
      hasContract: true,
      contractId: 'HD-2023-P205',
      leaseDuration: '10/01/2024 - 10/01/2025 (12 tháng)',
      monthsOccupied: 6,
      deposit: 3500000,
      rentLiability: 0,
      damagedAssetFee: 0,
      damagedAssetDesc: '',
      utilityFee: 0,
      cleaningFee: 0,
      notes: 'Chưa có kết quả kiểm tra phòng từ bộ phận kỹ thuật.'
   },
   {
      id: 'DS-2026-03',
      room: 'P.410',
      bed: 'Giường 01',
      customer: 'Lê Hoàng Nam',
      type: 'Trả phòng',
      status: 'Chờ đối soát',
      isFlowRequest: false,
      hasInspection: true,
      hasContract: false, // Exception A4: Missing Contract / Deposit Info
      contractId: null,
      leaseDuration: 'N/A',
      monthsOccupied: 0,
      deposit: 0,
      rentLiability: 0,
      damagedAssetFee: 0,
      damagedAssetDesc: 'Không có hư hỏng',
      utilityFee: 100000,
      cleaningFee: 150000,
      notes: 'Hồ sơ thiếu thông tin hợp đồng gốc và tiền cọc đặt giữ giường.'
   }
];

export default function FinancialReconciliation() {
   const [selected, setSelected] = useState<any>(null);
   const [isReconciling, setIsReconciling] = useState(false);
   const [isSaved, setIsSaved] = useState(false);
   const [searchTerm, setSearchTerm] = useState('');
   const [reconList, setReconList] = useState<any[]>([]);

   // Custom Popup Alert Modal State
   const [alertModal, setAlertModal] = useState<{
      isOpen: boolean;
      type: 'success' | 'error';
      title: string;
      message: string;
      onClose?: () => void;
   }>({
      isOpen: false,
      type: 'success',
      title: '',
      message: '',
   });

   const showSuccessModal = (msg: string, title = 'Thành công', onClose?: () => void) => {
      setAlertModal({
         isOpen: true,
         type: 'success',
         title: title,
         message: msg,
         onClose: onClose,
      });
   };

   const showErrorModal = (msg: string, title = 'Cảnh báo') => {
      setAlertModal({
         isOpen: true,
         type: 'error',
         title: title,
         message: msg,
      });
   };

   // Interactive Calculator State
   const [depositInput, setDepositInput] = useState<number>(0);
   const [rentLiabilityInput, setRentLiabilityInput] = useState<number>(0);
   const [damagedAssetInput, setDamagedAssetInput] = useState<number>(0);
   const [utilityInput, setUtilityInput] = useState<number>(0);
   const [cleaningInput, setCleaningInput] = useState<number>(150000);
   const [otherInput, setOtherInput] = useState<number>(0);
   const [notesInput, setNotesInput] = useState<string>('');
   const [attachmentName, setAttachmentName] = useState<string | null>(null);
   const [reconStatus, setReconStatus] = useState<string>('Chờ khách xác nhận');

   // Load from localStorage & mock list
   useEffect(() => {
      const saved = localStorage.getItem('checkout_flow_request');
      const updatedStatusMap = JSON.parse(localStorage.getItem('reconciled_statuses') || '{}');

      const applyUpdatedStatus = (item: any) => {
         if (updatedStatusMap[item.id]) {
            return { ...item, status: updatedStatusMap[item.id] };
         }
         return item;
      };

      if (saved) {
         const data = JSON.parse(saved);
         // Determine if this saved request is verified/inspected
         const hasInspection = ['Đã kiểm tra phòng', 'Đã đối soát', 'Chờ khách xác nhận', 'Chờ hoàn cọc', 'Chờ thanh toán bổ sung', 'Gửi khách hàng', 'Đã thanh lý'].includes(data.status);
         const hasContract = true; // Complete contract details

         const flowItem = {
            id: 'DS-2026-FLOW',
            room: data.room || 'P.302',
            bed: data.bed || 'Giường 01',
            customer: data.customer || 'Trần Thị Sinh Viên',
            type: 'Trả phòng',
            status: ['Chờ đối soát', 'Đã kiểm tra phòng'].includes(data.status) ? 'Chờ đối soát' : data.status,
            isFlowRequest: true,
            hasInspection: hasInspection,
            hasContract: hasContract,
            contractId: 'HD-2023-P302',
            leaseDuration: '15/08/2023 - 15/08/2024 (12 tháng)',
            monthsOccupied: 10,
            deposit: data.deposit || 6500000,
            rentLiability: data.rentLiability || 0,
            damagedAssetFee: data.damagedAssetFee || 150000,
            damagedAssetDesc: 'Hỏng 1 tủ đựng đồ (phí khấu trừ: 150,000 đ)',
            utilityFee: data.utilityFee || 175000,
            cleaningFee: data.cleaningFee || 150000,
            notes: data.reconcilerNotes || data.note || 'Yêu cầu trả phòng từ ứng dụng khách hàng.'
         };

         const finalFlowItem = applyUpdatedStatus(flowItem);
         // If our state manager has an updated status for flow request, make sure it is in sync with checkout_flow_request
         if (updatedStatusMap['DS-2026-FLOW'] && data.status !== updatedStatusMap['DS-2026-FLOW']) {
            data.status = updatedStatusMap['DS-2026-FLOW'];
            localStorage.setItem('checkout_flow_request', JSON.stringify(data));
         }

         setReconList([finalFlowItem, ...MOCK_RECON.map(applyUpdatedStatus)]);
      } else {
         setReconList(MOCK_RECON.map(applyUpdatedStatus));
      }
   }, [selected]);

   // Synchronize calculator state when an item is selected
   useEffect(() => {
      if (selected) {
         setDepositInput(selected.deposit || 0);
         setRentLiabilityInput(selected.rentLiability || 0);
         setDamagedAssetInput(selected.damagedAssetFee || 0);
         setUtilityInput(selected.utilityFee || 0);
         setCleaningInput(selected.cleaningFee || 150000);
         setOtherInput(0);
         setNotesInput(selected.notes || '');
         setAttachmentName(null);
         setIsReconciling(false);
         setIsSaved(false);

         // Auto calculate initial status
         const totalDeductions = (selected.rentLiability || 0) + (selected.damagedAssetFee || 0) + (selected.utilityFee || 0) + (selected.cleaningFee || 150000);
         const netAmount = (selected.deposit || 0) - totalDeductions;
         if (netAmount >= 0) {
            setReconStatus('Chờ hoàn cọc');
         } else {
            setReconStatus('Chờ thanh toán bổ sung');
         }
      }
   }, [selected]);

   // Calculations
   const totalDeductions = rentLiabilityInput + damagedAssetInput + utilityInput + cleaningInput + otherInput;
   const netAmount = depositInput - totalDeductions;
   const isSurplus = netAmount >= 0;
   const absoluteNet = Math.abs(netAmount);

   // Auto transition recommendation when calculations update
   useEffect(() => {
      if (selected) {
         if (isSurplus) {
            setReconStatus('Chờ hoàn cọc');
         } else {
            setReconStatus('Chờ thanh toán bổ sung');
         }
      }
   }, [netAmount, isSurplus]);

   const handleSaveAndConfirm = () => {
      // Keep track of all reconciled item statuses
      const updatedStatusMap = JSON.parse(localStorage.getItem('reconciled_statuses') || '{}');
      updatedStatusMap[selected.id] = reconStatus;
      localStorage.setItem('reconciled_statuses', JSON.stringify(updatedStatusMap));

      // If flow request from guest, update it
      if (selected?.isFlowRequest) {
         const saved = localStorage.getItem('checkout_flow_request');
         if (saved) {
            const data = JSON.parse(saved);
            data.status = reconStatus; // 'Chờ khách xác nhận', 'Chờ hoàn cọc', or 'Chờ thanh toán bổ sung'
            data.deposit = depositInput;
            data.rentLiability = rentLiabilityInput;
            data.damagedAssetFee = damagedAssetInput;
            data.utilityFee = utilityInput;
            data.cleaningFee = cleaningInput;
            data.otherFee = otherInput;
            data.totalDeductions = totalDeductions;
            data.netAmount = netAmount;
            data.reconcilerNotes = notesInput;
            localStorage.setItem('checkout_flow_request', JSON.stringify(data));
         }
      }

      setIsSaved(true);
      const targetStatus = reconStatus;
      showSuccessModal(
         `Trạng thái hồ sơ trả phòng của khách hàng được cập nhật sang: ${targetStatus}`,
         'Lưu phiếu đối soát thành công!',
         () => {
            setSelected(null);
            setIsReconciling(false);
            setIsSaved(false);
         }
      );
   };

   const filteredReconList = reconList.filter(item =>
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customer.toLowerCase().includes(searchTerm.toLowerCase())
   );

   const simulateFileUpload = () => {
      setAttachmentName(`chung_tu_doi_soat_${selected?.room || 'P'}.pdf`);
   };

   if (!selected) {
      return (
         <div className="p-8 h-full max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-8">
               <div>
                  <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1">Đối soát tài chính trả phòng</h1>
                  <p className="text-sm text-[#666666]">Danh sách hồ sơ trả phòng chờ đối soát công nợ, tiền cọc và lập phiếu quyết toán.</p>
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

            {/* Dashboard Statistics summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
               <div className="bg-white p-5 rounded-xl border border-[#EAD3CC]/50 shadow-xs flex items-center justify-between">
                  <div>
                     <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Chờ đối soát</p>
                     <h3 className="text-2xl font-extrabold text-[#8C4A3A] mt-1">
                        {reconList.filter(item => item.status === 'Chờ đối soát').length} Hồ sơ
                     </h3>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-[#FAF5F3] flex items-center justify-center text-[#B7705F]">
                     <Calculator className="w-6 h-6" />
                  </div>
               </div>
               <div className="bg-white p-5 rounded-xl border border-[#EAD3CC]/50 shadow-xs flex items-center justify-between">
                  <div>
                     <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Chờ hoàn cọc</p>
                     <h3 className="text-2xl font-extrabold text-[#8C4A3A] mt-1">
                        {reconList.filter(item => item.status === 'Chờ hoàn cọc').length} Hồ sơ
                     </h3>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-[#FAF5F3] flex items-center justify-center text-[#B7705F]">
                     <FileCheck className="w-6 h-6" />
                  </div>
               </div>
               <div className="bg-white p-5 rounded-xl border border-[#EAD3CC]/50 shadow-xs flex items-center justify-between">
                  <div>
                     <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Chờ thu bổ sung</p>
                     <h3 className="text-2xl font-extrabold text-[#8C4A3A] mt-1">
                        {reconList.filter(item => item.status === 'Chờ thanh toán bổ sung').length} Hồ sơ
                     </h3>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-[#FAF5F3] flex items-center justify-center text-[#B7705F]">
                     <DollarSign className="w-6 h-6" />
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-[#EAD3CC]/50 overflow-hidden">
               <table className="w-full text-left text-sm">
                  <thead className="bg-[#FAF5F3] text-[#666666]">
                     <tr>
                        <th className="px-6 py-4 font-medium">Mã đối soát</th>
                        <th className="px-6 py-4 font-medium">Phòng / Giường</th>
                        <th className="px-6 py-4 font-medium">Khách hàng</th>
                        <th className="px-6 py-4 font-medium">Loại yêu cầu</th>
                        <th className="px-6 py-4 font-medium">Trạng thái</th>
                        <th className="px-6 py-4 font-medium text-right">Thao tác</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {filteredReconList.length === 0 ? (
                        <tr>
                           <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                              Không tìm thấy hồ sơ đối soát phù hợp.
                           </td>
                        </tr>
                     ) : (
                        filteredReconList.map((item, idx) => (
                           <tr key={idx} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 font-mono font-medium text-[#222222]">{item.id}</td>
                              <td className="px-6 py-4 font-medium text-[#222222]">
                                 {item.room} - {item.bed}
                              </td>
                              <td className="px-6 py-4 text-[#666666] font-semibold">{item.customer}</td>
                              <td className="px-6 py-4 text-[#666666]">{item.type}</td>
                              <td className="px-6 py-4">
                                 <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${item.status === 'Chờ đối soát' ? 'bg-[#FAF5F3] text-[#8C4A3A] border-[#EAD3CC]' :
                                    item.status === 'Chờ hoàn cọc' ? 'bg-[#FAF5F3] text-[#8C4A3A] border-[#EAD3CC]' :
                                       item.status === 'Chờ thanh toán bổ sung' ? 'bg-[#FAF5F3] text-[#8C4A3A] border-[#EAD3CC]' :
                                          'bg-gray-50 text-gray-600 border-gray-100'
                                    }`}>
                                    {item.status}
                                 </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <button
                                    onClick={() => setSelected(item)}
                                    className="px-3 py-1.5 text-sm font-medium text-[#8C4A3A] bg-[#FAF5F3] hover:bg-[#F3E1DC]/60 border border-[#EAD3CC]/60 rounded-lg transition-colors inline-block cursor-pointer"
                                 >
                                    Xử lý đối soát
                                 </button>
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      );
   }

   // Pre-condition checking for warnings/blocking (Exception A4)
   const isBlocked = selected ? (!selected.hasContract || !selected.hasInspection) : false;

   return (
      <div className="p-8 h-full max-w-7xl mx-auto">
         {/* Top Navbar */}
         <div className="flex items-center text-sm font-medium text-gray-500 mb-4 pb-4 border-b border-[#EAD3CC]/50">
            <span>Kế toán</span>
            <svg className="w-4 h-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span>Đối soát tài chính</span>
            <svg className="w-4 h-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span>{selected.room} - {selected.bed}</span>
            <svg className="w-4 h-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-[#B7705F] font-semibold">Lập phiếu đối soát</span>
         </div>

         <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <div>
               <div className="flex items-center space-x-3 mb-2">
                  <button onClick={() => setSelected(null)} className="text-[#666666] hover:text-[#B7705F] flex items-center text-sm font-medium cursor-pointer">
                     <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại danh sách
                  </button>
               </div>
               <h1 className="text-3xl font-bold text-[#8C4A3A] tracking-tight mb-1">
                  Phiếu đối soát tài chính
               </h1>
               <p className="text-sm text-[#666666]">
                  Khách thuê: <span className="font-bold text-gray-900">{selected.customer}</span> • Mã đối soát: <span className="font-mono font-medium text-gray-900">{selected.id}</span>
               </p>
            </div>

            <div className="flex space-x-3 mt-4 md:mt-0">
               {isSaved && (
                  <span className="px-4 py-2.5 bg-[#FAF5F3] text-[#8C4A3A] rounded-lg text-sm font-semibold flex items-center shadow-sm border border-[#EAD3CC]">
                     <CheckCircle2 className="w-4 h-4 mr-2" /> Đã đối soát thành công
                  </span>
               )}
               {!isReconciling && !isSaved && (
                  <button
                     onClick={() => {
                        if (isBlocked) {
                           showErrorModal(
                              'Thiếu hợp đồng hoặc biên bản kiểm tra phòng! Không thể lập phiếu đối soát.',
                              'Không thể lập phiếu đối soát'
                           );
                           return;
                        }
                        setIsReconciling(true);
                     }}
                     className={`px-5 py-2.5 rounded-lg text-sm font-bold flex items-center shadow-sm transition-all duration-200 cursor-pointer ${isBlocked
                        ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-60'
                        : 'bg-[#B7705F] hover:bg-[#a06050] text-white'
                        }`}
                  >
                     <Calculator className="w-4 h-4 mr-2" /> Lập phiếu đối soát
                  </button>
               )}
               {isReconciling && !isSaved && (
                  <button
                     onClick={handleSaveAndConfirm}
                     className="px-5 py-2.5 bg-[#8C4A3A] hover:bg-[#723a2d] text-white rounded-lg text-sm font-bold transition-all duration-200 flex items-center shadow-sm cursor-pointer"
                  >
                     <Save className="w-4 h-4 mr-2" /> Lưu phiếu đối soát
                  </button>
               )}
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Read-only Information Column */}
            <div className="space-y-6">
               {/* Contract and Deposit Information Section */}
               <div className="bg-white rounded-xl shadow-sm border border-[#EAD3CC]/60 overflow-hidden">
                  <div className="bg-[#FAF5F3] px-6 py-4 border-b border-[#EAD3CC]/40 flex justify-between items-center">
                     <h2 className="font-bold text-[#222222] flex items-center">
                        <Info className="w-5 h-5 mr-2 text-[#B7705F]" /> Thông tin hợp đồng &amp; tiền cọc gốc
                     </h2>
                     <span className={`text-xs px-2.5 py-0.5 font-semibold rounded ${selected.hasContract ? 'bg-[#FAF5F3] text-[#8C4A3A] border border-[#EAD3CC]' : 'bg-gray-50 text-gray-700 border border-gray-200'}`}>
                        {selected.hasContract ? 'Hợp đồng hợp lệ' : 'Thiếu dữ liệu hợp đồng'}
                     </span>
                  </div>
                  <div className="p-6">
                     {selected.hasContract ? (
                        <div className="space-y-4">
                           <div className="flex justify-between border-b pb-2 border-dashed border-gray-100">
                              <span className="text-[#666666] text-sm">Mã hợp đồng / Phiếu cọc:</span>
                              <span className="font-mono font-semibold text-[#222222] text-sm">
                                 {selected.contractId || 'HD-UNKNOWN'}
                              </span>
                           </div>
                           <div className="flex justify-between border-b pb-2 border-dashed border-gray-100">
                              <span className="text-[#666666] text-sm">Thời gian lưu trú:</span>
                              <span className="font-semibold text-[#222222] text-sm">
                                 {selected.leaseDuration}
                              </span>
                           </div>
                           <div className="flex justify-between border-b pb-2 border-dashed border-gray-100">
                              <span className="text-[#666666] text-sm">Số tháng lưu trú thực tế:</span>
                              <span className="font-bold text-[#B7705F] text-sm">
                                 {selected.monthsOccupied} tháng
                              </span>
                           </div>
                           <div className="flex justify-between border-b pb-2 border-dashed border-gray-100">
                              <span className="text-[#666666] text-sm">Tiền cọc ban đầu ghi nhận:</span>
                              <span className="font-bold text-gray-900 text-sm">
                                 {selected.deposit ? `${selected.deposit.toLocaleString()} đ` : 'Chưa thu cọc'}
                              </span>
                           </div>
                           <div className="flex justify-between text-[#B7705F]">
                              <span className="text-[#666666] text-sm font-medium">Công nợ thuê phòng/dịch vụ còn tồn:</span>
                              <span className="font-bold text-sm">
                                 {selected.rentLiability ? `${selected.rentLiability.toLocaleString()} đ` : '0 đ (Đã đóng đầy đủ)'}
                              </span>
                           </div>
                        </div>
                     ) : (
                        <div className="text-center py-6">
                           <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                           <p className="text-sm font-semibold text-[#8C4A3A]">Hệ thống không tìm thấy hợp đồng gốc</p>
                           <p className="text-xs text-gray-500 mt-1">Thông tin đặt giữ chỗ/hợp đồng chưa được bộ phận kinh doanh liên kết với phòng này.</p>
                        </div>
                     )}
                  </div>
               </div>

               {/* Room Inspection Report Section */}
               <div className="bg-white rounded-xl shadow-sm border border-[#EAD3CC]/60 overflow-hidden">
                  <div className="bg-[#FAF5F3] px-6 py-4 border-b border-[#EAD3CC]/40 flex justify-between items-center">
                     <h2 className="font-bold text-[#222222] flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2 text-[#B7705F]" /> Kết quả biên bản kiểm tra phòng
                     </h2>
                     <span className={`text-xs px-2.5 py-0.5 font-semibold rounded ${selected.hasInspection ? 'bg-[#FAF5F3] text-[#8C4A3A] border border-[#EAD3CC]' : 'bg-gray-50 text-gray-700 border border-gray-200'}`}>
                        {selected.hasInspection ? 'Đã kiểm tra phòng' : 'Chưa có biên bản'}
                     </span>
                  </div>
                  <div className="p-6">
                     {selected.hasInspection ? (
                        <div className="space-y-4">
                           <div className="flex justify-between border-b pb-2 border-dashed border-gray-100">
                              <span className="text-[#666666] text-sm">Tài sản hư hỏng khấu trừ:</span>
                              <span className="font-semibold text-gray-900 text-sm">
                                 {selected.damagedAssetFee > 0 ? `${selected.damagedAssetDesc}` : 'Không phát sinh hư hỏng'}
                              </span>
                           </div>
                           <div className="flex justify-between border-b pb-2 border-dashed border-gray-100">
                              <span className="text-[#666666] text-sm">Chỉ số Điện/Nước phát sinh cuối:</span>
                              <span className="font-semibold text-gray-900 text-sm">
                                 Phát sinh {selected.utilityFee > 0 ? `${selected.utilityFee.toLocaleString()} đ` : '0 đ'}
                              </span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-[#666666] text-sm">Chi phí dọn dẹp vệ sinh trả phòng:</span>
                              <span className="font-semibold text-gray-900 text-sm">
                                 {selected.cleaningFee ? `${selected.cleaningFee.toLocaleString()} đ` : '150,000 đ'} (Vệ sinh tổng thể bàn giao)
                              </span>
                           </div>
                        </div>
                     ) : (
                        <div className="text-center py-6">
                           <AlertTriangle className="w-12 h-12 text-[#B7705F] mx-auto mb-2" />
                           <p className="text-sm font-semibold text-gray-700">Chưa có kết quả biên bản từ Trưởng tòa nhà</p>
                           <p className="text-xs text-gray-500 mt-1">Vui lòng chờ nhân sự kiểm kho/phòng quét mã và lập hiện trạng bàn giao tài sản.</p>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            {/* Reconciliation Interactive Calculator Column */}
            <div className="space-y-6">
               {isReconciling ? (
                  <div className="bg-white rounded-xl shadow-md border-2 border-[#D29F91] p-6 relative overflow-hidden transition-all duration-300">
                     <h3 className="text-lg font-bold text-[#8C4A3A] mb-4 flex items-center border-b border-gray-100 pb-2">
                        <FileDigit className="w-5 h-5 mr-2 text-[#B7705F]" />
                        Công cụ lập phiếu đối soát tự động
                     </h3>

                     {/* Interactive inputs */}
                     <div className="space-y-4 mb-6 bg-[#FAF5F3]/30 p-4 rounded-xl border border-[#EAD3CC]/40">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Các khoản thu &amp; khấu trừ</h4>

                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Tiền cọc ban đầu (đ)</label>
                              <input
                                 type="number"
                                 value={depositInput}
                                 onChange={(e) => setDepositInput(Number(e.target.value))}
                                 className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#B7705F]"
                              />
                           </div>
                           <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Công nợ cũ thuê phòng (đ)</label>
                              <input
                                 type="number"
                                 value={rentLiabilityInput}
                                 onChange={(e) => setRentLiabilityInput(Number(e.target.value))}
                                 className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#B7705F]"
                              />
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-2">
                           <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Đền bù tài sản hỏng (đ)</label>
                              <input
                                 type="number"
                                 value={damagedAssetInput}
                                 onChange={(e) => setDamagedAssetInput(Number(e.target.value))}
                                 className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#B7705F]"
                              />
                           </div>
                           <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Điện nước cuối (đ)</label>
                              <input
                                 type="number"
                                 value={utilityInput}
                                 onChange={(e) => setUtilityInput(Number(e.target.value))}
                                 className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#B7705F]"
                              />
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-2">
                           <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Chi phí dọn phòng (đ)</label>
                              <input
                                 type="number"
                                 value={cleaningInput}
                                 onChange={(e) => setCleaningInput(Number(e.target.value))}
                                 className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#B7705F]"
                              />
                           </div>
                           <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Chi phí phát sinh khác (đ)</label>
                              <input
                                 type="number"
                                 value={otherInput}
                                 onChange={(e) => setOtherInput(Number(e.target.value))}
                                 className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#B7705F]"
                              />
                           </div>
                        </div>
                     </div>

                     {/* Calculation Breakdown */}
                     <div className="space-y-2 border-t border-gray-100 pt-4 text-sm">
                        <div className="flex justify-between">
                           <span className="text-gray-500">Tiền cọc giữ ban đầu:</span>
                           <span className="font-bold text-gray-900">
                              {depositInput.toLocaleString()} ₫
                           </span>
                        </div>
                        <div className="flex justify-between text-gray-900">
                           <span className="text-gray-600">Tổng các khoản khấu trừ (-):</span>
                           <span className="font-bold">
                              - {totalDeductions.toLocaleString()} ₫
                           </span>
                        </div>
                     </div>

                     {/* Dynamic Result determination block */}
                     <div className={`mt-5 rounded-xl p-4 border transition-all duration-300 ${isSurplus
                        ? 'bg-[#FAF5F3] text-[#8C4A3A] border-[#EAD3CC]'
                        : 'bg-[#FAF5F3] text-[#8C4A3A] border-[#EAD3CC]'
                        }`}>
                        <div className="flex justify-between items-center">
                           <div>
                              <span className="text-xs font-bold uppercase tracking-wider block opacity-75">
                                 Kết quả đối soát tài chính:
                              </span>
                              <span className="text-sm font-bold mt-1 block">
                                 {isSurplus
                                    ? 'Còn dư để hoàn cọc cho khách hàng'
                                    : 'Khách hàng phải thanh toán thêm chênh lệch'}
                              </span>
                           </div>
                           <div className="text-right">
                              <span className={`text-2xl font-extrabold text-[#8C4A3A]`}>
                                 {absoluteNet.toLocaleString()} ₫
                              </span>
                           </div>
                        </div>
                     </div>

                     {/* Post-condition status updates selection */}
                     <div className="mt-5 pt-4 border-t border-gray-100">
                        <label className="block text-sm font-bold text-[#222222] mb-2">
                           Trạng thái cập nhật hồ sơ trả phòng sau đối soát:
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                           <button
                              type="button"
                              onClick={() => setReconStatus('Chờ khách xác nhận')}
                              className={`px-2 py-2.5 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${reconStatus === 'Chờ khách xác nhận'
                                 ? 'bg-[#8C4A3A] text-white border-[#8C4A3A] shadow-sm'
                                 : 'bg-white text-gray-600 border-gray-200 hover:bg-[#FAF5F3]/50'
                                 }`}
                           >
                              Chờ khách xác nhận
                           </button>
                           <button
                              type="button"
                              onClick={() => setReconStatus('Chờ hoàn cọc')}
                              className={`px-2 py-2.5 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${reconStatus === 'Chờ hoàn cọc'
                                 ? 'bg-[#8C4A3A] text-white border-[#8C4A3A] shadow-sm'
                                 : 'bg-white text-gray-600 border-gray-200 hover:bg-[#FAF5F3]/50'
                                 }`}
                           >
                              Chờ hoàn cọc
                           </button>
                           <button
                              type="button"
                              onClick={() => setReconStatus('Chờ thanh toán bổ sung')}
                              className={`px-2 py-2.5 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${reconStatus === 'Chờ thanh toán bổ sung'
                                 ? 'bg-[#8C4A3A] text-white border-[#8C4A3A] shadow-sm'
                                 : 'bg-white text-gray-600 border-gray-200 hover:bg-[#FAF5F3]/50'
                                 }`}
                           >
                              Chờ thu bổ sung
                           </button>
                        </div>
                     </div>

                     {/* Notes & File uploads */}
                     <div className="mt-5">
                        <label className="block text-sm font-semibold text-[#222222] mb-2">Bổ sung ghi chú đối soát</label>
                        <textarea
                           value={notesInput}
                           onChange={(e) => setNotesInput(e.target.value)}
                           className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#B7705F]"
                           rows={2}
                           placeholder="Nhập lý giải chi phí phát sinh, cam kết hoàn tiền..."
                        ></textarea>
                     </div>

                     <div className="mt-4">
                        <label className="block text-sm font-semibold text-[#222222] mb-1">Đính kèm chứng từ đối soát (nếu có)</label>
                        <div
                           onClick={simulateFileUpload}
                           className="border border-dashed border-[#EAD3CC] rounded-lg p-4 flex flex-col items-center justify-center text-center bg-[#FAF5F3]/10 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                           <Upload className="w-5 h-5 text-gray-400 mb-1" />
                           {attachmentName ? (
                              <span className="text-sm text-[#8C4A3A] font-semibold flex items-center">
                                 <CheckCircle className="w-4 h-4 mr-1.5" /> {attachmentName}
                              </span>
                           ) : (
                              <>
                                 <span className="text-xs text-[#B7705F] font-bold">Nhấn vào đây để tải tài liệu/ảnh hóa đơn lên</span>
                                 <span className="text-[10px] text-gray-400 mt-0.5">Hỗ trợ định dạng .jpg, .png, .pdf tối đa 5MB</span>
                              </>
                           )}
                        </div>
                     </div>
                  </div>
               ) : (
                  <div className="bg-[#FAF5F3] rounded-xl border border-dashed border-[#EAD3CC] p-12 flex flex-col items-center justify-center text-center h-full min-h-[350px]">
                     <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border border-[#EAD3CC]/50">
                        <Calculator className="w-8 h-8 text-[#B7705F]" />
                     </div>
                     <h3 className="text-[#222222] font-extrabold text-lg mb-2">Chưa lập phiếu đối soát</h3>
                     <p className="text-sm text-[#666666] max-w-sm mb-6 leading-relaxed">
                        Nhân viên kế toán vui lòng kiểm tra hồ sơ bàn giao, hợp đồng ban đầu và biên bản hư hỏng bên tay trái trước khi lập phiếu đối soát tài chính.
                     </p>
                     <button
                        onClick={() => {
                           if (isBlocked) {
                              showErrorModal(
                                 'Thiếu hợp đồng hoặc biên bản kiểm tra phòng!',
                                 'Không thể lập phiếu đối soát'
                              );
                              return;
                           }
                           setIsReconciling(true);
                        }}
                        className={`px-6 py-3 rounded-lg text-sm font-bold flex items-center shadow-sm transition-all cursor-pointer ${isBlocked
                           ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-60'
                           : 'bg-[#B7705F] hover:bg-[#a06050] text-white'
                           }`}
                     >
                        <Calculator className="w-4 h-4 mr-2" /> Bắt đầu lập đối soát
                     </button>
                  </div>
               )}
            </div>
         </div>

         {/* Custom Popup Alert Modal */}
         {alertModal.isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
               <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#EAD3CC]/60 overflow-hidden transform transition-all duration-300 scale-100">
                  <div className="p-6 text-center">
                     {alertModal.type === 'success' ? (
                        <div className="w-16 h-16 bg-[#FAF5F3] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#EAD3CC]">
                           <CheckCircle2 className="w-10 h-10 text-[#8C4A3A]" />
                        </div>
                     ) : (
                        <div className="w-16 h-16 bg-[#FAF5F3] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#EAD3CC]">
                           <AlertTriangle className="w-10 h-10 text-[#8C4A3A]" />
                        </div>
                     )}

                     <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {alertModal.title}
                     </h3>

                     <p className="text-sm text-[#666666] leading-relaxed mb-6">
                        {alertModal.message}
                     </p>

                     <button
                        onClick={() => {
                           setAlertModal(prev => ({ ...prev, isOpen: false }));
                           if (alertModal.onClose) alertModal.onClose();
                        }}
                        className="w-full py-3 rounded-xl font-bold text-sm shadow-sm transition-colors duration-150 cursor-pointer bg-[#8C4A3A] hover:bg-[#723a2d] text-white"
                     >
                        Đóng
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}
