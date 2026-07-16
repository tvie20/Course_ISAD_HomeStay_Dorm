import React, { useState, useEffect, useRef } from 'react';
import {
   FileText, Save, Send, Printer, CheckCircle, ArrowLeft, Eye, FileDigit,
   Info, Calculator, Upload, Search, AlertTriangle, CheckCircle2, DollarSign, HelpCircle, FileCheck, ChevronDown
} from 'lucide-react';
import API_URL from '../../api';

const MOCK_RECON: any[] = [];

const BANG_GIA_DEN_BU = [
   { MaDenBu: 'DB01', TenLoi: 'Hư hỏng nhẹ tủ đựng đồ', MucDo: 'Nhẹ', PhanTramDenBu: 10, GiaThamKhao: 150000 },
   { MaDenBu: 'DB02', TenLoi: 'Hư hỏng nặng máy lạnh', MucDo: 'Nặng', PhanTramDenBu: 50, GiaThamKhao: 2000000 },
   { MaDenBu: 'DB03', TenLoi: 'Mất chìa khóa phòng/thẻ từ', MucDo: 'Nặng', PhanTramDenBu: 100, GiaThamKhao: 50000 },
   { MaDenBu: 'DB04', TenLoi: 'Vết bẩn tường/nệm khó giặt', MucDo: 'Vừa', PhanTramDenBu: 20, GiaThamKhao: 200000 }
];

const BANG_GIA_DICH_VU: Record<string, { DonGia_ApDung: number }> = {
   'NO_DIEN': { DonGia_ApDung: 3800 },
   'NO_NUOC': { DonGia_ApDung: 22000 }
};

export default function FinancialReconciliation() {
   const [selected, setSelected] = useState<any>(null);
   const [isReconciling, setIsReconciling] = useState(false);
   const [isSaved, setIsSaved] = useState(false);
   const [searchTerm, setSearchTerm] = useState('');
   const [reconList, setReconList] = useState<any[]>([]);
   const [inspectionData, setInspectionData] = useState<any>(null);

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

   const [depositInput, setDepositInput] = useState<number | ''>(0);

   interface ChiTietDoiSoat {
      id: string;
      maLoaiKhauTru: string;
      loaiDenBu?: string;
      lyDo: string;
      soTien: number | '';
      chiSoCu?: number;
      chiSoMoi?: number;
   }
   const [chiTietList, setChiTietList] = useState<ChiTietDoiSoat[]>([]);
   const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
   const [searchDenBu, setSearchDenBu] = useState<string>('');

   const [notesInput, setNotesInput] = useState<string>('');
   const [attachmentName, setAttachmentName] = useState<string | null>(null);
   const fileInputRef = useRef<HTMLInputElement>(null);
   const [reconStatus, setReconStatus] = useState<string>('Chờ hoàn cọc');
   const [terminationStatus, setTerminationStatus] = useState<string>('EXPIRED');

   const fetchReconList = async () => {
      try {
         const res = await fetch(`${API_URL}/api/v1/checkout-requests`);
         const data = await res.json();
         if (data.status === 'success') {
            const formatted = data.data.map((item: any) => {
               let mappedStatus = item.status;
               const net = (item.deposit || 0) - (item.utilityFee || 0) - (item.cleaningFee || 0) - (item.damagedAssetFee || 0) - (item.rentLiability || 0) - (item.otherFee || 0);
               
               if (item.status === 'Đang xử lý' || item.status === 'Đã kiểm tra phòng') {
                  mappedStatus = 'Chờ đối soát';
               } else if (item.status === 'Chờ thanh lý') {
                  mappedStatus = net >= 0 ? 'Chờ hoàn cọc' : 'Chờ thu bổ sung';
               } else if (item.status === 'Đã xử lý') {
                  mappedStatus = 'Hoàn tất';
               }

               return {
                  id: item.id,
                  room: item.room,
                  bed: typeof item.bed === 'number' ? `Giường 0${item.bed}` : (item.bed || 'N/A'),
                  customer: item.customer,
                  type: 'Trả phòng',
                  status: mappedStatus,
                  rawStatus: item.status,
                  contractId: item.contractId || 'HD-UNKNOWN',
                  leaseDuration: `${item.monthsStayed} tháng`,
                  monthsOccupied: item.monthsStayed,
                  deposit: item.deposit || 0,
                  rentLiability: item.rentLiability || 0,
                  hasInspection: item.status === 'Đã kiểm tra phòng' || item.status === 'Chờ thanh lý' || item.status === 'Đã xử lý',
                  hasContract: true,
                  notes: item.note
               };
            });
            setReconList(formatted.filter((item: any) => ['Đã kiểm tra phòng', 'Chờ thanh lý', 'Đã xử lý'].includes(item.rawStatus)));
         }
      } catch (err) {
         console.error('Error fetching reconciliations:', err);
      }
   };

   useEffect(() => {
      fetchReconList();
   }, []);

   useEffect(() => {
      if (selected) {
         setDepositInput(selected.deposit || 0);

         const initialDetails: ChiTietDoiSoat[] = [];
         if (selected.rentLiability > 0) initialDetails.push({ id: '1', maLoaiKhauTru: 'NO_THUE', lyDo: 'Công nợ cũ thuê phòng', soTien: selected.rentLiability });

         setChiTietList(initialDetails);
         setNotesInput(selected.notes || '');
         setAttachmentName(null);
         setIsReconciling(['Chờ hoàn cọc', 'Chờ thu bổ sung', 'Đã đối soát'].includes(selected.status));
         setIsSaved(false);
         setInspectionData(null);

         // Load kết quả kiểm tra phòng từ DB
         fetch(`${API_URL}/api/v1/inspections/by-request/${selected.id}`)
            .then(r => r.json())
            .then(d => {
               if (d.status === 'success' && d.data) {
                  setInspectionData(d.data);
               }
            })
            .catch(() => {});

         const totalDeductions = (selected.rentLiability || 0) + (selected.damagedAssetFee || 0);
         const netAmount = (selected.deposit || 0) - totalDeductions;
         if (netAmount >= 0) {
            setReconStatus('Chờ hoàn cọc');
         } else {
            setReconStatus('Chờ thu bổ sung');
         }
      }
   }, [selected]);

   let baseRefundPercentage = 1;
   if (terminationStatus === 'NO_CONTRACT') baseRefundPercentage = 0.8;
   else if (terminationStatus === 'UNDER_6_MONTHS') baseRefundPercentage = 0.5;
   else if (terminationStatus === 'OVER_6_MONTHS') baseRefundPercentage = 0.7;

   const depositPenalty = (Number(depositInput) || 0) * (1 - baseRefundPercentage);
   const listDeductions = chiTietList.reduce((sum, item) => sum + (Number(item.soTien) || 0), 0);
   const totalDeductions = listDeductions + depositPenalty;
   const netAmount = (Number(depositInput) || 0) - totalDeductions;
   const isSurplus = netAmount >= 0;
   const absoluteNet = Math.abs(netAmount);

   useEffect(() => {
      if (selected) {
         if (isSurplus) {
            setReconStatus('Chờ hoàn cọc');
         } else {
            setReconStatus('Chờ thu bổ sung');
         }
      }
   }, [netAmount, isSurplus]);

   const handleSaveAndConfirm = async () => {
      try {
         const payload = {
            contractId: selected.contractId,
            requestId: selected.id,
            netAmount: netAmount,
            chiTietList: chiTietList.map(item => ({
               maLoaiKhauTru: item.maLoaiKhauTru,
               soTien: Number(item.soTien) || 0,
               lyDo: item.lyDo
            }))
         };
         
         const res = await fetch(`${API_URL}/api/v1/reconciliations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
         });
         
         const data = await res.json();
         if (data.status === 'success') {
            setIsSaved(true);
            showSuccessModal(
               `Đã lưu đối soát và cập nhật trạng thái yêu cầu trả phòng thành Chờ thanh lý.`,
               'Lưu phiếu đối soát thành công!',
               () => {
                  fetchReconList();
               }
            );
         } else {
            showErrorModal(data.message || 'Lỗi khi lưu đối soát');
         }
      } catch (err) {
         showErrorModal('Lỗi kết nối máy chủ khi lưu đối soát');
      }
   };

   const filteredReconList = reconList.filter(item =>
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customer.toLowerCase().includes(searchTerm.toLowerCase())
   );

   const simulateFileUpload = () => {
      fileInputRef.current?.click();
   };

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         setAttachmentName(file.name);
      }
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
                        {reconList.filter(item => item.status === 'Chờ thu bổ sung').length} Hồ sơ
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
                                       item.status === 'Chờ thu bổ sung' ? 'bg-[#FAF5F3] text-[#8C4A3A] border-[#EAD3CC]' :
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

   const isBlocked = selected ? (!selected.hasInspection) : false;

   return (
      <div className="p-8 h-full max-w-7xl mx-auto">
         {/* Datalist cho Bảng giá đền bù để hỗ trợ thanh Search */}
         <datalist id="bang-gia-den-bu">
            {BANG_GIA_DEN_BU.map(db => (
               <option key={db.MaDenBu} value={db.TenLoi}>{db.GiaThamKhao.toLocaleString()}đ</option>
            ))}
         </datalist>

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
               <button
                  onClick={isReconciling && !(selected && ['Chờ hoàn cọc', 'Chờ thu bổ sung', 'Đã đối soát'].includes(selected.status)) ? handleSaveAndConfirm : undefined}
                  disabled={!isReconciling || (selected && ['Chờ hoàn cọc', 'Chờ thu bổ sung', 'Đã đối soát'].includes(selected.status))}
                  className={`px-5 py-2.5 rounded-lg text-sm font-bold flex items-center shadow-sm transition-all duration-200 ${(!isReconciling || (selected && ['Chờ hoàn cọc', 'Chờ thu bổ sung', 'Đã đối soát'].includes(selected.status)))
                     ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-60'
                     : 'bg-[#8C4A3A] hover:bg-[#723a2d] text-white cursor-pointer'
                     }`}
               >
                  <Save className="w-4 h-4 mr-2" /> Lưu phiếu đối soát
               </button>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="space-y-6">
               <div className="bg-white rounded-xl shadow-sm border border-[#EAD3CC]/60 overflow-hidden">
                  <div className="bg-[#FAF5F3] px-6 py-4 border-b border-[#EAD3CC]/40 flex justify-between items-center">
                     <h2 className="font-bold text-[#222222] flex items-center">
                        <Info className="w-5 h-5 mr-2 text-[#B7705F]" /> Thông tin hợp đồng &amp; tiền cọc gốc
                     </h2>
                     <span className={`text-xs px-2.5 py-0.5 font-semibold rounded bg-[#FAF5F3] text-[#8C4A3A] border border-[#EAD3CC]`}>
                        Dữ liệu đối soát
                     </span>
                  </div>
                  <div className="p-6">
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
                  </div>
               </div>

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
                           <div className="flex flex-col border-b pb-3 border-dashed border-gray-100">
                              <span className="text-[#666666] text-sm font-semibold mb-2">Báo cáo tình trạng tài sản:</span>
                              <div className="pl-2 space-y-2">
                                 <div className="flex justify-between items-start text-sm">
                                    <span className="text-gray-500 w-16">+ Hư hỏng:</span>
                                    <div className="flex-1 text-right font-semibold text-[#8C4A3A]">
                                       {selected.damagedItems?.filter((i: any) => i.type === 'Hỏng').length > 0
                                          ? selected.damagedItems.filter((i: any) => i.type === 'Hỏng').map((item: any, idx: number) => (
                                             <div key={idx}>{item.desc}</div>
                                          ))
                                          : '0'}
                                    </div>
                                 </div>
                                 <div className="flex justify-between items-start text-sm">
                                    <span className="text-gray-500 w-16">+ Mất:</span>
                                    <div className="flex-1 text-right font-semibold text-[#8C4A3A]">
                                       {selected.damagedItems?.filter((i: any) => i.type === 'Mất').length > 0
                                          ? selected.damagedItems.filter((i: any) => i.type === 'Mất').map((item: any, idx: number) => (
                                             <div key={idx}>{item.desc}</div>
                                          ))
                                          : '0'}
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div className="flex justify-between border-b pb-2 border-dashed border-gray-100 mt-4">
                              <span className="text-[#666666] text-sm w-1/3">Ghi chú từ quản lý:</span>
                              <span className="font-semibold text-[#8C4A3A] text-sm italic text-right w-2/3">
                                 {selected.notes || 'Đã hoàn tất kiểm tra phòng, xác nhận tình trạng như báo cáo.'}
                              </span>
                           </div>
                        </div>
                     ) : (
                        <div className="text-center py-6">
                           <AlertTriangle className="w-12 h-12 text-[#B7705F] mx-auto mb-2" />
                           <p className="text-sm font-semibold text-gray-700">Chưa có kết quả biên bản từ Quản lý</p>
                           <p className="text-xs text-gray-500 mt-1">Vui lòng chờ nhân sự kiểm kho/phòng quét mã và lập hiện trạng bàn giao tài sản.</p>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            <div className="space-y-6">
               {isReconciling ? (
                  <div className="bg-white rounded-xl shadow-md border-2 border-[#D29F91] p-6 relative overflow-hidden transition-all duration-300">
                     <h3 className="text-lg font-bold text-[#8C4A3A] mb-4 flex items-center border-b border-gray-100 pb-2">
                        <FileDigit className="w-5 h-5 mr-2 text-[#B7705F]" />
                        Phiếu đối soát
                     </h3>

                     <div className={['Chờ hoàn cọc', 'Chờ thu bổ sung', 'Đã đối soát'].includes(selected.status) ? 'pointer-events-none opacity-80' : ''}>
                        <div className="space-y-4 mb-6 bg-[#FAF5F3]/30 p-4 rounded-xl border border-[#EAD3CC]/40">
                           <div className="flex justify-between items-center mb-4 border-b border-[#EAD3CC]/50 pb-3">
                              <div>
                                 <h4 className="text-sm font-bold text-[#8C4A3A]">Thông tin chi tiết đối soát</h4>
                              </div>
                              <button
                                 onClick={() => setChiTietList([...chiTietList, { id: Date.now().toString(), maLoaiKhauTru: 'PHAT_VI_PHAM', loaiDenBu: 'Khác', lyDo: '', soTien: '' }])}
                                 className="px-3 py-1.5 bg-white border border-[#EAD3CC] text-[#8C4A3A] rounded shadow-sm text-xs font-bold hover:bg-[#FAF5F3] transition-colors"
                              >
                                 + Thêm khoản trừ
                              </button>
                           </div>

                           <div className="mb-4">
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Tiền cọc ban đầu (đ)</label>
                              <input
                                 type="number"
                                 placeholder="0"
                                 value={depositInput}
                                 onChange={(e) => setDepositInput(e.target.value === '' ? '' : Number(e.target.value))}
                                 className="w-1/2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white font-medium text-[#222222] focus:outline-none focus:ring-1 focus:ring-[#B7705F]"
                              />
                           </div>

                           <div className="mb-6">
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Tình trạng thanh lý &amp; tỷ lệ hoàn cọc cơ bản</label>
                              <select
                                 value={terminationStatus}
                                 onChange={(e) => setTerminationStatus(e.target.value)}
                                 className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white font-medium text-[#222222] focus:outline-none focus:ring-1 focus:ring-[#B7705F]"
                              >
                                 <option value="EXPIRED">Hết hạn thuê theo hợp đồng (Hoàn 100%)</option>
                                 <option value="OVER_6_MONTHS">Chưa hết hạn, lưu trú TRÊN 6 tháng (Hoàn 70%)</option>
                                 <option value="UNDER_6_MONTHS">Chưa hết hạn, lưu trú DƯỚI 6 tháng (Hoàn 50%)</option>
                                 <option value="NO_CONTRACT">Chưa ký hợp đồng / Hủy thuê (Hoàn 80%)</option>
                              </select>
                           </div>

                           <div className="space-y-2">
                              <div className="grid grid-cols-12 gap-2 px-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                 <div className="col-span-3">Mã Loại</div>
                                 <div className="col-span-5">Lý do chi tiết</div>
                                 <div className="col-span-3">Số tiền (đ)</div>
                                 <div className="col-span-1 text-center">Xóa</div>
                              </div>

                              {chiTietList.map((item, idx) => (
                                 <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-white p-2 rounded border border-gray-100 shadow-sm">
                                    <div className="col-span-3">
                                       <select
                                          value={item.maLoaiKhauTru}
                                          onChange={(e) => {
                                             const val = e.target.value;
                                             let chiSoCu = undefined;
                                             if (val === 'NO_DIEN') chiSoCu = 1250;
                                             if (val === 'NO_NUOC') chiSoCu = 105;
                                             setChiTietList(chiTietList.map(c => c.id === item.id ? { ...c, maLoaiKhauTru: val, chiSoCu, chiSoMoi: undefined, soTien: '', loaiDenBu: undefined, lyDo: '' } : c));
                                          }}
                                          className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-[#B7705F]"
                                       >
                                          <option value="NO_THUE">NO_THUE</option>
                                          <option value="NO_DIEN">NO_DIEN</option>
                                          <option value="PHAT_TAI_SAN">PHAT_TAI_SAN</option>
                                          <option value="PHI_DON_DEP">PHI_DON_DEP</option>
                                          <option value="PHAT_VI_PHAM">PHAT_VI_PHAM</option>
                                       </select>
                                    </div>
                                    <div className="col-span-5 relative">
                                       {item.maLoaiKhauTru === 'PHAT_TAI_SAN' ? (
                                          <div className="flex flex-col gap-1">
                                             <div className="relative">
                                                <div
                                                   onClick={() => {
                                                      if (openDropdownId === item.id) setOpenDropdownId(null);
                                                      else {
                                                         setOpenDropdownId(item.id);
                                                         setSearchDenBu('');
                                                      }
                                                   }}
                                                   className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs text-gray-800 bg-white cursor-pointer flex justify-between items-center"
                                                >
                                                   <span className="truncate">{item.loaiDenBu ? item.loaiDenBu : '-- Tra cứu bảng giá đền bù --'}</span>
                                                   <ChevronDown className="w-3 h-3 text-gray-500 flex-shrink-0 ml-1" />
                                                </div>
                                                {openDropdownId === item.id && (
                                                   <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-56 overflow-hidden flex flex-col">
                                                      <div className="p-1.5 border-b border-gray-100 bg-gray-50 sticky top-0">
                                                         <div className="relative">
                                                            <Search className="w-3 h-3 absolute left-2 top-1.5 text-gray-400" />
                                                            <input
                                                               type="text"
                                                               autoFocus
                                                               placeholder="Tìm kiếm lỗi..."
                                                               value={searchDenBu}
                                                               onChange={(e) => setSearchDenBu(e.target.value)}
                                                               className="w-full pl-6 pr-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#B7705F]"
                                                            />
                                                         </div>
                                                      </div>
                                                      <div className="overflow-y-auto">
                                                         {BANG_GIA_DEN_BU.filter(db => db.TenLoi.toLowerCase().includes(searchDenBu.toLowerCase())).map(db => (
                                                            <div
                                                               key={db.MaDenBu}
                                                               className="px-2 py-1.5 hover:bg-[#FAF5F3] cursor-pointer text-xs text-gray-700 border-b border-gray-50 last:border-0"
                                                               onClick={() => {
                                                                  setChiTietList(chiTietList.map(c => c.id === item.id ? { ...c, loaiDenBu: db.TenLoi, lyDo: db.TenLoi, soTien: db.GiaThamKhao } : c));
                                                                  setOpenDropdownId(null);
                                                               }}
                                                            >
                                                               {db.TenLoi} ({db.GiaThamKhao.toLocaleString()}đ)
                                                            </div>
                                                         ))}
                                                         <div
                                                            className="px-2 py-1.5 hover:bg-[#FAF5F3] cursor-pointer text-xs text-[#B7705F] font-semibold"
                                                            onClick={() => {
                                                               setChiTietList(chiTietList.map(c => c.id === item.id ? { ...c, loaiDenBu: 'Khác', lyDo: '', soTien: '' } : c));
                                                               setOpenDropdownId(null);
                                                            }}
                                                         >
                                                            Khác
                                                         </div>
                                                      </div>
                                                   </div>
                                                )}
                                             </div>
                                             {item.loaiDenBu === 'Khác' && (
                                                <input
                                                   type="text"
                                                   placeholder="Chi tiết lỗi phạt..."
                                                   value={item.lyDo}
                                                   onChange={(e) => setChiTietList(chiTietList.map(c => c.id === item.id ? { ...c, lyDo: e.target.value } : c))}
                                                   className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-[#B7705F]"
                                                />
                                             )}
                                          </div>
                                       ) : (item.maLoaiKhauTru === 'NO_DIEN' || item.maLoaiKhauTru === 'NO_NUOC') ? (
                                          <div className="flex items-center gap-1 w-full relative">
                                             <span className="text-xs text-gray-500 font-medium whitespace-nowrap">CS:</span>
                                             <input
                                                type="number"
                                                placeholder="Cũ"
                                                value={item.chiSoCu !== undefined ? item.chiSoCu : ''}
                                                onChange={(e) => {
                                                   const val = Number(e.target.value);
                                                   const soTien = (item.chiSoMoi || 0) > val ? ((item.chiSoMoi || 0) - val) * BANG_GIA_DICH_VU[item.maLoaiKhauTru].DonGia_ApDung : '';
                                                   setChiTietList(chiTietList.map(c => c.id === item.id ? { ...c, chiSoCu: e.target.value === '' ? undefined : val, soTien, lyDo: `Chỉ số: ${val} -> ${item.chiSoMoi || '?'}` } : c));
                                                }}
                                                className="w-full px-2 py-1.5 border border-gray-200 bg-white rounded text-xs text-gray-800 focus:outline-none focus:border-[#B7705F]"
                                                title="Chỉ số cũ (Tháng trước)"
                                             />
                                             <span className="text-[10px] text-gray-400">→</span>
                                             <input
                                                type="number"
                                                placeholder="Mới"
                                                value={item.chiSoMoi !== undefined ? item.chiSoMoi : ''}
                                                onChange={(e) => {
                                                   const val = Number(e.target.value);
                                                   const soTien = val > (item.chiSoCu || 0) ? (val - (item.chiSoCu || 0)) * BANG_GIA_DICH_VU[item.maLoaiKhauTru].DonGia_ApDung : '';
                                                   setChiTietList(chiTietList.map(c => c.id === item.id ? { ...c, chiSoMoi: e.target.value === '' ? undefined : val, soTien, lyDo: `Chỉ số: ${item.chiSoCu || '?'} -> ${val}` } : c));
                                                }}
                                                className="w-full px-2 py-1.5 border border-gray-200 bg-white rounded text-xs text-gray-800 focus:outline-none focus:border-[#B7705F]"
                                                title="Chỉ số mới"
                                             />
                                             <span className="text-[10px] text-gray-400 whitespace-nowrap" title="Đơn giá áp dụng">
                                                ({(BANG_GIA_DICH_VU[item.maLoaiKhauTru].DonGia_ApDung / 1000).toLocaleString()}k)
                                             </span>
                                          </div>
                                       ) : (
                                          <input
                                             type="text"
                                             placeholder="Ghi chú chi tiết..."
                                             value={item.lyDo}
                                             onChange={(e) => setChiTietList(chiTietList.map(c => c.id === item.id ? { ...c, lyDo: e.target.value } : c))}
                                             className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-[#B7705F]"
                                          />
                                       )}
                                    </div>
                                    <div className="col-span-3">
                                       <input
                                          type={(item.maLoaiKhauTru === 'NO_DIEN' || item.maLoaiKhauTru === 'NO_NUOC') ? 'text' : 'number'}
                                          placeholder="0"
                                          value={item.soTien}
                                          onChange={(e) => setChiTietList(chiTietList.map(c => c.id === item.id ? { ...c, soTien: e.target.value === '' ? '' : Number(e.target.value) } : c))}
                                          className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs text-red-600 font-semibold focus:outline-none focus:border-[#B7705F]"
                                       />
                                    </div>
                                    <div className="col-span-1 flex justify-center">
                                       <button
                                          onClick={() => setChiTietList(chiTietList.filter(c => c.id !== item.id))}
                                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                       >
                                          ✕
                                       </button>
                                    </div>
                                 </div>
                              ))}

                              {chiTietList.length === 0 && (
                                 <div className="text-center py-4 text-xs text-gray-500 italic bg-white border border-gray-100 rounded">
                                    Không có khoản khấu trừ nào. Khách hàng nhận lại đủ cọc gốc.
                                 </div>
                              )}
                           </div>
                        </div>

                        {/* Calculation Breakdown */}
                        <div className="space-y-2 border-t border-gray-100 pt-4 text-sm">
                           <div className="flex justify-between">
                              <span className="text-gray-500">Tiền cọc giữ ban đầu:</span>
                              <span className="font-bold text-gray-900">
                                 {(Number(depositInput) || 0).toLocaleString()} ₫
                              </span>
                           </div>
                           {depositPenalty > 0 && (
                              <div className="flex justify-between text-gray-900">
                                 <span className="text-gray-600">Khấu trừ tỷ lệ hoàn cọc ({Math.round((1 - baseRefundPercentage) * 100)}%):</span>
                                 <span className="font-bold">
                                    - {depositPenalty.toLocaleString()} ₫
                                 </span>
                              </div>
                           )}
                           {listDeductions > 0 && (
                              <div className="flex justify-between text-gray-900">
                                 <span className="text-gray-600">Tổng các khoản phí vi phạm/phát sinh:</span>
                                 <span className="font-bold">
                                    - {listDeductions.toLocaleString()} ₫
                                 </span>
                              </div>
                           )}
                           <div className="flex justify-between text-[#8C4A3A] font-bold border-t border-dashed border-gray-200 pt-2 mt-2">
                              <span>Tổng khấu trừ:</span>
                              <span>{netAmount.toLocaleString()} ₫</span>
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
                           <div className="grid grid-cols-2 gap-2">
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
                                 onClick={() => setReconStatus('Chờ thu bổ sung')}
                                 className={`px-2 py-2.5 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${reconStatus === 'Chờ thu bổ sung'
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
                              <input
                                 type="file"
                                 ref={fileInputRef}
                                 onChange={handleFileChange}
                                 className="hidden"
                                 accept=".jpg,.png,.pdf"
                              />
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

                     {/* Action Buttons */}
                     <div className="mt-8 border-t border-gray-100 pt-6 flex justify-end gap-3">

                        {['Chờ hoàn cọc', 'Chờ thu bổ sung'].includes(selected.status) ? (
                           <button
                              onClick={() => {
                                 const updatedStatusMap = JSON.parse(localStorage.getItem('reconciled_statuses') || '{}');
                                 updatedStatusMap[selected.id] = 'Đã đối soát';
                                 localStorage.setItem('reconciled_statuses', JSON.stringify(updatedStatusMap));
                                 setReconList(reconList.map(item => item.id === selected.id ? { ...item, status: 'Đã đối soát' } : item));
                                 setSelected({ ...selected, status: 'Đã đối soát' });
                                 setAlertModal({ isOpen: true, type: 'success', title: 'Thành công', message: 'Đã hoàn tất quá trình đối soát tài chính. Chuyển thông tin cho Quản lý.' });
                              }}
                              className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-sm transition-colors flex items-center cursor-pointer"
                           >
                              <CheckCircle className="w-5 h-5 mr-2" /> Đã xong
                           </button>
                        ) : selected.status === 'Đã đối soát' ? (
                           <button disabled className="px-6 py-2.5 bg-gray-200 text-gray-500 font-bold rounded-lg shadow-sm cursor-not-allowed flex items-center">
                              <CheckCircle className="w-5 h-5 mr-2 text-gray-400" /> Đã hoàn tất đối soát
                           </button>
                        ) : null}
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
         {
            alertModal.isOpen && (
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
            )
         }
      </div >
   );
}
