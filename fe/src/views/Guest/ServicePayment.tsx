import React, { useState } from 'react';
import { CreditCard, AlertCircle, Smartphone, FileText, CheckCircle2, ChevronRight, Upload, Wallet, Eye, ArrowLeft, Printer } from 'lucide-react';

export default function ServicePayment({ onNavigate }: { onNavigate?: (id: string) => void }) {
  // Mock state with all invoices (unpaid & paid history merged)
  const [invoices, setInvoices] = useState([
    {
      id: 'HD-10-23',
      month: 'Tháng 10/2023',
      room: 'Phòng P.102',
      total: 5230000,
      status: 'Chưa thanh toán',
      dueDate: '05/11/2023',
      base: 4500000,
      electricity: 420000,
      water: 160000,
      service: 150000,
      paymentDate: '-'
    },
    {
      id: 'HD-09-23',
      month: 'Tháng 09/2023',
      room: 'Phòng P.102',
      total: 5180000,
      status: 'Đã thanh toán',
      dueDate: '05/10/2023',
      base: 4500000,
      electricity: 390000,
      water: 140000,
      service: 150000,
      paymentDate: '04/09/2023'
    },
    {
      id: 'HD-08-23',
      month: 'Tháng 08/2023',
      room: 'Phòng P.102',
      total: 4980000,
      status: 'Đã thanh toán',
      dueDate: '05/09/2023',
      base: 4500000,
      electricity: 210000,
      water: 120000,
      service: 150000,
      paymentDate: '05/08/2023'
    },
    {
      id: 'HD-07-23',
      month: 'Tháng 07/2023',
      room: 'Phòng P.102',
      total: 5050000,
      status: 'Đã thanh toán',
      dueDate: '05/08/2023',
      base: 4500000,
      electricity: 260000,
      water: 140000,
      service: 150000,
      paymentDate: '02/07/2023'
    },
    {
      id: 'HD-06-23',
      month: 'Tháng 06/2023',
      room: 'Phòng P.102',
      total: 4900000,
      status: 'Đã thanh toán',
      dueDate: '05/07/2023',
      base: 4500000,
      electricity: 180000,
      water: 70000,
      service: 150000,
      paymentDate: '03/06/2023'
    }
  ]);

  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showPaymentArea, setShowPaymentArea] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'qr' | 'bank'>('qr');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'idle' | 'processing' | 'done'>('idle');
  const [receiptFile, setReceiptFile] = useState<string | null>(null);

  const handleSelectInvoice = (inv: any) => {
    setSelectedInvoice(inv);
    setShowPaymentArea(false);
    setPaymentStep('idle');
    setReceiptFile(null);
  };

  const handleBackToList = () => {
    setSelectedInvoice(null);
    setShowPaymentArea(false);
    setPaymentStep('idle');
    setReceiptFile(null);
  };

  const triggerPaymentDemo = () => {
    if (paymentMethod === 'bank' && !receiptFile) {
      alert('Vui lòng tải lên ảnh chụp Ủy nhiệm chi / Biên lai chuyển khoản để tiếp tục thanh toán.');
      return;
    }

    setIsProcessing(true);
    setPaymentStep('processing');

    // Simulate Payment Connection Gateway
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentStep('done');

      const nowStr = new Date().toLocaleDateString('vi-VN');
      // Update invoice list state
      setInvoices(prev => prev.map(inv => inv.id === selectedInvoice.id ? { ...inv, status: 'Đã thanh toán', paymentDate: nowStr } : inv));
      setSelectedInvoice(prev => ({ ...prev, status: 'Đã thanh toán', paymentDate: nowStr }));
    }, 2000);
  };

  const handleSimulateUpload = () => {
    setReceiptFile('receipt_proof_active.png');
  };

  return (
    <div className="p-8 h-full max-w-5xl mx-auto">
      {/* Payment Processing Overlay */}
      {paymentStep === 'processing' && (
        <div className="fixed inset-0 bg-black/60 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-pulse">
            <div className="w-16 h-16 border-4 border-[#B7705F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-bold text-[#222222] mb-2">Đang xử lý giao dịch...</h3>
            <p className="text-xs text-[#666666]">Đang kết nối cổng thanh toán Homestay Pay và đối soát tài khoản tự động. Vui lòng không đóng cửa sổ này.</p>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {paymentStep === 'done' && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl border border-green-100">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4 border border-green-200">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-green-800 mb-2">Thanh toán thành công!</h3>
            <p className="text-sm text-gray-600 mb-6">Hóa đơn mã <strong className="text-gray-900">{selectedInvoice.id}</strong> đã được thanh toán.</p>
            <button
              onClick={() => {
                setPaymentStep('idle');
                setShowPaymentArea(false);
              }}
              className="w-full py-3 bg-[#B7705F] hover:bg-[#a06050] text-white rounded-xl text-sm font-bold shadow-sm transition-colors"
            >
              Đồng ý &amp; Quay lại chi tiết
            </button>
          </div>
        </div>
      )}

      {/* RENDER VIEW 1: Invoice Detail Screen */}
      {selectedInvoice ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToList}
              className="text-[#666666] hover:text-[#8C4A3A] flex items-center text-sm font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Quay lại danh sách hóa đơn
            </button>
          </div>

          <div className="mb-4">
            <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1">
              Chi tiết hóa đơn {selectedInvoice.month}
            </h1>
            <p className="text-sm text-[#666666]">
              Xem bảng kê chi tiết phòng &amp; dịch vụ. {selectedInvoice.status === 'Chưa thanh toán' && 'Vui lòng thực hiện thanh toán đúng hạn.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Invoice Bill Breakdown */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-xl border border-[#D29F91]/50 overflow-hidden relative">
                <div className="bg-[#8C4A3A] px-6 py-4 flex justify-between items-center text-white">
                  <h2 className="font-bold text-base flex items-center">
                    <FileText className="w-5 h-5 mr-2" /> Hóa đơn: {selectedInvoice.id}
                  </h2>
                  <span className={`text-xs font-bold tracking-wider px-2.5 py-1 rounded border backdrop-blur ${selectedInvoice.status === 'Đã thanh toán'
                      ? 'bg-green-600/30 border-green-200 text-green-100'
                      : 'bg-red-600/20 border-red-200 text-red-100'
                    }`}>
                    {selectedInvoice.status}
                  </span>
                </div>

                <div className="p-6">
                  <div className="text-center mb-6">
                    <p className="text-xs font-semibold text-[#666666] mb-1">Tổng tiền thanh toán</p>
                    <p className="text-4xl font-bold text-[#8C4A3A]">{selectedInvoice.total.toLocaleString()} <span className="text-xl font-medium text-gray-400">₫</span></p>
                    {selectedInvoice.status === 'Chưa thanh toán' ? (
                      <p className="text-xs text-red-500 font-semibold mt-1.5 flex items-center justify-center">
                        <AlertCircle className="w-4 h-4 mr-1" /> Hạn thanh toán: {selectedInvoice.dueDate}
                      </p>
                    ) : (
                      <p className="text-xs text-green-600 font-semibold mt-1.5 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 mr-1" /> Đã thanh toán lúc: {selectedInvoice.paymentDate}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3 mb-6 bg-[#FAF5F3] p-5 rounded-xl border border-[#EAD3CC]/50 text-sm">
                    <div className="flex justify-between items-center pb-3 border-b border-[#EAD3CC]">
                      <span className="font-semibold text-[#666666]">Tiền phòng cơ bản</span>
                      <span className="font-bold text-[#222222]">{selectedInvoice.base.toLocaleString()} ₫</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 border-dashed">
                      <span className="text-xs text-[#666666]">Tiền điện tiêu dùng</span>
                      <span className="text-xs font-semibold text-[#222222]">{selectedInvoice.electricity.toLocaleString()} ₫</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 border-dashed">
                      <span className="text-xs text-[#666666]">Tiền nước sinh hoạt</span>
                      <span className="text-xs font-semibold text-[#222222]">{selectedInvoice.water.toLocaleString()} ₫</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-xs text-[#666666]">Phí dịch vụ chung &amp; tiện ích</span>
                      <span className="text-xs font-semibold text-[#222222]">{selectedInvoice.service.toLocaleString()} ₫</span>
                    </div>
                  </div>

                  {/* BUTTON THANH TOÁN NGAY -> ONLY IF UNPAID AND PAYMENT AREA IS NOT YET SHOWN */}
                  {selectedInvoice.status === 'Chưa thanh toán' && !showPaymentArea && (
                    <button
                      onClick={() => setShowPaymentArea(true)}
                      className="w-full bg-[#8C4A3A] hover:bg-[#723a2d] text-white py-3.5 px-6 rounded-xl font-bold text-base shadow-md transition-all transform hover:-translate-y-0.5 flex items-center justify-center"
                    >
                      <CreditCard className="w-5 h-5 mr-2" /> Thanh toán ngay
                    </button>
                  )}

                  {/* PAYMENT AREA: QR OR BANK TRANSFER, EXPANDS ONLY AFTER "THANH TOÁN NGAY" IS CLICKED */}
                  {showPaymentArea && selectedInvoice.status === 'Chưa thanh toán' && (
                    <div className="border-t border-gray-200 pt-6 mt-6 space-y-6">
                      <h3 className="text-sm font-bold text-[#222222] mb-4">Chọn phương thức thanh toán:</h3>

                      <div className="grid grid-cols-2 gap-4">
                        {/* QR Method Selector */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('qr')}
                          className={`p-4 rounded-xl flex flex-col items-center justify-center transition-all shadow-sm border-2 ${paymentMethod === 'qr' ? 'border-[#8C4A3A] bg-orange-50/40' : 'border-gray-200 bg-white'
                            }`}
                        >
                          <Smartphone className={`w-8 h-8 mb-2 ${paymentMethod === 'qr' ? 'text-[#8C4A3A]' : 'text-gray-400'}`} />
                          <span className="font-bold text-xs text-[#222222]">Quét mã QR Momo / VNPay</span>
                          <span className="text-[10px] text-[#666666] mt-1 text-center">Xử lý tự động nhanh chóng</span>
                        </button>

                        {/* Bank Method Selector */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('bank')}
                          className={`p-4 rounded-xl flex flex-col items-center justify-center transition-all shadow-sm border-2 ${paymentMethod === 'bank' ? 'border-[#8C4A3A] bg-orange-50/40' : 'border-gray-200 bg-white'
                            }`}
                        >
                          <CreditCard className={`w-8 h-8 mb-2 ${paymentMethod === 'bank' ? 'text-[#8C4A3A]' : 'text-gray-400'}`} />
                          <span className="font-bold text-xs text-[#222222]">Chuyển khoản Ngân hàng</span>
                          <span className="text-[10px] text-[#666666] mt-1 text-center">Yêu cầu tải lên ủy nhiệm chi</span>
                        </button>
                      </div>

                      {/* QR Code section */}
                      {paymentMethod === 'qr' && (
                        <div className="border border-[#EAD3CC]/50 bg-[#FAF5F3] p-6 rounded-2xl text-center">
                          <p className="text-xs font-semibold text-[#666666] mb-3">Quét mã QR để thanh toán tiền phòng</p>
                          <div className="w-48 h-48 bg-white border border-gray-200 rounded-xl mx-auto flex flex-col items-center justify-center p-3 shadow-inner relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#8C4A3A]/5 to-transparent pointer-events-none"></div>
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://homestay-payment-demo-checkout?id=${selectedInvoice.id}`}
                              alt="QR Code"
                              className="w-40 h-40 object-contain rounded"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <p className="text-xs font-bold text-[#8C4A3A] mt-3">Mã GD: {selectedInvoice.id}</p>
                          <p className="text-[10px] text-gray-400 mt-1">Sử dụng ứng dụng Momo, ZaloPay hoặc Ngân hàng quét để thanh toán ngay</p>
                        </div>
                      )}

                      {/* Bank Details section */}
                      {paymentMethod === 'bank' && (
                        <div className="border border-[#EAD3CC]/50 bg-[#FAF5F3] p-6 rounded-2xl">
                          <p className="text-xs font-bold text-center text-[#8C4A3A] mb-4">Thông tin tài khoản nhận tiền</p>
                          <div className="space-y-3 bg-white p-4 rounded-xl border border-[#EAD3CC]/30 text-sm mb-4">
                            <div className="flex justify-between pb-2 border-b border-gray-100">
                              <span className="text-xs text-[#666666]">Ngân hàng thụ hưởng:</span>
                              <span className="font-bold text-[#222222]">Techcombank (TCB)</span>
                            </div>
                            <div className="flex justify-between pb-2 border-b border-gray-100">
                              <span className="text-xs text-[#666666]">Số tài khoản:</span>
                              <span className="font-mono font-bold text-[#8C4A3A]">1903 5558 9991 22</span>
                            </div>
                            <div className="flex justify-between pb-2 border-b border-gray-100">
                              <span className="text-xs text-[#666666]">Chủ tài khoản:</span>
                              <span className="font-bold text-[#222222]">CÔNG TY TNHH HOMESTAY VIETNAM</span>
                            </div>
                            <div className="flex justify-between pb-2 border-b border-gray-100">
                              <span className="text-xs text-[#666666]">Số tiền chuyển:</span>
                              <span className="font-bold text-gray-900">{selectedInvoice.total.toLocaleString()} ₫</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs text-[#666666]">Nội dung chuyển khoản:</span>
                              <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{`CK ${selectedInvoice.id}`}</span>
                            </div>
                          </div>

                          {/* Upload Proof Box */}
                          <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
                            {receiptFile ? (
                              <div className="flex flex-col items-center">
                                <CheckCircle2 className="w-8 h-8 text-green-500 mb-1" />
                                <p className="text-xs font-bold text-[#222222]">Đã chọn 1 file hóa đơn thành công</p>
                                <p className="text-[10px] text-gray-400 font-mono">receipt_proof_active.png</p>
                                <button
                                  type="button"
                                  onClick={() => setReceiptFile(null)}
                                  className="text-xs text-red-500 hover:underline mt-2"
                                >
                                  Xóa và chọn file khác
                                </button>
                              </div>
                            ) : (
                              <div>
                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-xs font-bold text-[#222222]">Đính kèm Ủy nhiệm chi / Hóa đơn</p>
                                <p className="text-[10px] text-[#666666] mt-1 mb-3">Tải lên ảnh chụp màn hình chuyển khoản thành công</p>
                                <button
                                  type="button"
                                  onClick={handleSimulateUpload}
                                  className="px-4 py-2 border border-[#8C4A3A] text-[#8C4A3A] rounded-lg text-xs font-bold hover:bg-orange-50 transition-colors inline-block"
                                >
                                  Chọn file ảnh...
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Confirm payment button */}
                      <button
                        onClick={triggerPaymentDemo}
                        className="w-full bg-[#8C4A3A] hover:bg-[#723a2d] text-white p-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center transition-transform hover:-translate-y-0.5"
                      >
                        Xác nhận thanh toán (Demo) <span className="ml-2">→</span>
                      </button>
                    </div>
                  )}

                  {selectedInvoice.status === 'Đã thanh toán' && (
                    <div className="mt-4 p-5 bg-green-50 border border-green-200 rounded-xl text-center">
                      <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto mb-2" />
                      <h4 className="font-bold text-green-800 text-sm">Hóa đơn đã được quyết toán</h4>
                      <p className="text-xs text-green-700 mt-1">Hệ thống đã ghi nhận đầy đủ doanh thu cho kỳ thanh toán này.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Side Column: Support info */}
            <div className="space-y-6">
              <div className="bg-[#FAF5F3] rounded-2xl border border-[#EAD3CC] p-5 text-center shadow-sm">
                <AlertCircle className="w-8 h-8 text-[#8C4A3A] mx-auto mb-2" />
                <h3 className="font-bold text-[#222222] text-sm mb-2">Hỗ trợ đối soát hóa đơn</h3>
                <p className="text-xs text-[#666666] mb-4">Mọi thắc mắc về các khoản thu điện nước hoặc kỳ hạn phòng vui lòng kiến nghị ngay.</p>
                <button className="px-4 py-2.5 border border-[#8C4A3A] text-[#8C4A3A] bg-white rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors w-full">Gọi hotline hỗ trợ: 0901 234 567</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* RENDER VIEW 2: Invoice List Table */
        <div className="space-y-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1">Thanh toán tiền thuê &amp; dịch vụ</h1>
            <p className="text-sm text-[#666666]">Xem danh sách hóa đơn hàng tháng và thanh toán tiền thuê, hóa đơn dịch vụ điện nước của bạn.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EAD3CC]/50">
            <h3 className="text-sm font-bold text-[#222222] tracking-wider mb-4 flex items-center">
              <Wallet className="w-4 h-4 mr-2 text-[#8C4A3A]" /> Danh sách hóa đơn của tôi
            </h3>

            <div className="overflow-hidden rounded-xl border border-gray-100">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#FAF5F3] text-[#666666]">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Mã Hóa Đơn</th>
                    <th className="px-6 py-4 font-semibold">Kỳ Thanh Toán</th>
                    <th className="px-6 py-4 font-semibold">Tổng Tiền</th>
                    <th className="px-6 py-4 font-semibold">Trạng Thái</th>
                    <th className="px-6 py-4 font-semibold">Hạn/Ngày Thanh Toán</th>
                    <th className="px-6 py-4 font-semibold text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-[#8C4A3A] font-bold">{inv.id}</td>
                      <td className="px-6 py-4 font-normal text-gray-700">{inv.month} ({inv.room})</td>
                      <td className="px-6 py-4 font-bold text-[#8C4A3A]">{inv.total.toLocaleString()} ₫</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded text-xs font-bold whitespace-nowrap ${inv.status === 'Đã thanh toán' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                        {inv.status === 'Đã thanh toán' ? `Đã trả: ${inv.paymentDate}` : `Hạn chót: ${inv.dueDate}`}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleSelectInvoice(inv)}
                          className="px-3.5 py-1.5 text-xs font-bold text-[#8C4A3A] bg-orange-50 hover:bg-[#F3E1DC] rounded-lg transition-colors inline-flex items-center space-x-1 whitespace-nowrap"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Chi tiết</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
