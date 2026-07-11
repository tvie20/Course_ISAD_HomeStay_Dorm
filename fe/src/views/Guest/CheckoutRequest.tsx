import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Home, FileSignature, Wallet, Send, AlertCircle, Clock, X, Check, CheckCircle2, ShieldCheck, Printer, DollarSign } from 'lucide-react';

export default function CheckoutRequest() {
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [status, setStatus] = useState('Chờ duyệt');
  const [reconData, setReconData] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('checkout_flow_request');
    if (saved) {
      const data = JSON.parse(saved);
      setDate(data.date || '');
      setNote(data.note || '');
      setIsSubmitted(true);
      setStatus(data.status || 'Chờ duyệt');
      setReconData(data);
    }
  }, [status]);

  const handleSubmit = () => {
    if (date) {
      const request = {
        room: "P.302",
        bed: "Giường 01",
        customer: "Trần Thị Sinh Viên",
        cccd: "079123456789",
        date: date,
        note: note,
        status: 'Chờ duyệt',
        deposit: 6500000,
        rentLiability: 0,
        damagedAssetFee: 150000,
        utilityFee: 175000,
        cleaningFee: 150000,
        totalDeductions: 475000,
        netAmount: 6025000,
        reconcilerNotes: ''
      };
      localStorage.setItem('checkout_flow_request', JSON.stringify(request));
      setIsSubmitted(true);
      setStatus('Chờ duyệt');
      setReconData(request);
    }
  };

  const handleCancel = () => {
    localStorage.removeItem('checkout_flow_request');
    setIsSubmitted(false);
    setDate('');
    setNote('');
    setStatus('Chờ duyệt');
    setReconData(null);
  };

  const handleConfirmLiquidation = () => {
    const saved = localStorage.getItem('checkout_flow_request');
    if (saved) {
      const data = JSON.parse(saved);
      const net = data.netAmount !== undefined ? data.netAmount : 6025000;
      // After guest confirms, transition to either 'Chờ hoàn cọc' or 'Chờ thanh toán bổ sung'
      const nextStatus = net >= 0 ? 'Chờ hoàn cọc' : 'Chờ thanh toán bổ sung';
      data.status = nextStatus;
      localStorage.setItem('checkout_flow_request', JSON.stringify(data));
      setStatus(nextStatus);
    }
  };

  // Extract dynamic values for display
  const depositVal = reconData?.deposit !== undefined ? reconData.deposit : 6500000;
  const utilityVal = reconData?.utilityFee !== undefined ? reconData.utilityFee : 175000;
  const cleaningVal = reconData?.cleaningFee !== undefined ? reconData.cleaningFee : 150000;
  const damageVal = reconData?.damagedAssetFee !== undefined ? reconData.damagedAssetFee : 150000;
  const liabilityVal = reconData?.rentLiability !== undefined ? reconData.rentLiability : 0;
  const otherVal = reconData?.otherFee !== undefined ? reconData.otherFee : 0;
  const totalDeductions = utilityVal + cleaningVal + damageVal + liabilityVal + otherVal;
  const netVal = reconData?.netAmount !== undefined ? reconData.netAmount : 6025000;
  const absNet = Math.abs(netVal);
  const refundOwed = netVal >= 0;

  if (status === 'Gửi khách hàng' || status === 'Chờ khách xác nhận') {
    return (
      <div className="max-w-4xl mx-auto w-full pb-12 pt-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1">Xác nhận biên bản thanh lý</h1>
            <p className="text-sm text-gray-500">BQL đã gửi kết quả đối soát tài chính và biên bản trả phòng. Vui lòng kiểm tra và ký xác nhận.</p>
          </div>
          <span className="px-3 py-1 bg-[#FAF5F3] text-[#8C4A3A] border border-[#EAD3CC] rounded-full text-xs font-semibold flex items-center shadow-sm">
            <Clock className="w-3.5 h-3.5 mr-1 animate-pulse" />
            Chờ khách hàng xác nhận
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EAD3CC]/50">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2 text-[#B7705F]" /> Tóm tắt đối soát tài chính chi tiết
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between text-sm pb-2 border-b border-dashed">
                  <span className="text-gray-500">Tiền cọc ban đầu (Đã thu):</span>
                  <span className="font-semibold text-gray-900">{depositVal.toLocaleString()} ₫</span>
                </div>
                <div className="flex justify-between text-sm pb-2 border-b border-dashed">
                  <span className="text-gray-500">Số tháng đã ở thực tế:</span>
                  <span className="font-bold text-[#B7705F]">10 tháng</span>
                </div>
                {liabilityVal > 0 && (
                  <div className="flex justify-between text-sm pb-2 border-b border-dashed text-red-600">
                    <span>Công nợ thuê phòng tồn đọng:</span>
                    <span className="font-semibold">-{liabilityVal.toLocaleString()} ₫</span>
                  </div>
                )}
                <div className="flex justify-between text-sm pb-2 border-b border-dashed text-red-600">
                  <span>Trừ tiền điện nước cuối:</span>
                  <span className="font-semibold">-{utilityVal.toLocaleString()} ₫</span>
                </div>
                <div className="flex justify-between text-sm pb-2 border-b border-dashed text-red-600">
                  <span>Trừ chi phí dọn dẹp vệ sinh:</span>
                  <span className="font-semibold">-{cleaningVal.toLocaleString()} ₫</span>
                </div>
                <div className="flex justify-between text-sm pb-2 border-b border-dashed text-red-600">
                  <span>Khấu trừ tài sản hư hỏng:</span>
                  <span className="font-semibold">-{damageVal.toLocaleString()} ₫</span>
                </div>
                {otherVal > 0 && (
                  <div className="flex justify-between text-sm pb-2 border-b border-dashed text-red-600">
                    <span>Chi phí phát sinh khác:</span>
                    <span className="font-semibold">-{otherVal.toLocaleString()} ₫</span>
                  </div>
                )}

                {reconData?.reconcilerNotes && (
                  <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 border border-gray-100">
                    <span className="font-bold text-gray-800 block mb-1">Ghi chú từ Kế toán viên:</span>
                    "{reconData.reconcilerNotes}"
                  </div>
                )}

                <div className="flex justify-between text-base font-bold p-3 rounded-xl border border-[#EAD3CC] mt-4 bg-[#FAF5F3] text-[#8C4A3A]">
                  <span>{refundOwed ? 'SỐ TIỀN BẠN ĐƯỢC HOÀN LẠI:' : 'SỐ TIỀN BẠN CẦN THANH TOÁN THÊM:'}</span>
                  <span>{absNet.toLocaleString()} ₫</span>
                </div>
              </div>
            </div>

            <div className="bg-[#FAF5F3] rounded-2xl p-6 border border-dashed border-[#EAD3CC]">
              <h3 className="font-bold text-[#8C4A3A] mb-2 text-sm">Điều khoản thỏa thuận thanh lý:</h3>
              <ul className="list-disc pl-4 text-xs text-[#666666] space-y-2">
                <li>Bên thuê đồng ý bàn giao lại phòng P.302 - Giường 01 sạch sẽ và đầy đủ chìa khóa.</li>
                {refundOwed ? (
                  <li>Bên cho thuê cam kết hoàn tiền cọc còn lại ({absNet.toLocaleString()} ₫) vào tài khoản của khách thuê trong vòng 3 ngày làm việc kể từ khi ký biên bản này.</li>
                ) : (
                  <li>Bên thuê cam kết thanh toán thêm phần chi phí chênh lệch ({absNet.toLocaleString()} ₫) cho Homestay Dorm để hoàn tất thủ tục bàn giao phòng.</li>
                )}
                <li>Sau khi xác nhận, hợp đồng thuê HD-2023-P302 chính thức chấm dứt hiệu lực và không bên nào khiếu nại thêm.</li>
              </ul>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={handleConfirmLiquidation}
                className="w-full px-8 py-3 bg-[#8C4A3A] hover:bg-[#723a2d] text-white rounded-xl font-bold flex items-center justify-center transition-all shadow-sm text-sm cursor-pointer"
              >
                <Check className="w-4 h-4 mr-2" />
                Đồng ý &amp; Ký xác nhận điện tử
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 sticky top-4">
              <div className="flex justify-between items-center mb-3 border-b pb-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Xem trước văn bản</span>
                <Printer className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
              </div>
              <div className="bg-gray-50 p-4 border border-gray-100 rounded-xl max-h-[350px] overflow-y-auto text-[10px] leading-relaxed" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                <div className="text-center font-bold mb-2">
                  CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br />
                  Độc lập - Tự do - Hạnh phúc<br />
                  <div className="border-b border-black w-12 mx-auto my-1"></div>
                  BIÊN BẢN THANH LÝ HỢP ĐỒNG THUÊ PHÒNG
                </div>
                <p className="mb-2">Hôm nay, ngày 25 tháng 10 năm 2023, chúng tôi gồm:</p>
                <p className="font-semibold">Bên A (Bên cho thuê): HomeStay Dorm</p>
                <p className="font-semibold mb-2">Bên B (Bên thuê): Trần Thị Sinh Viên</p>
                <p className="mb-2">Hai bên thống nhất lập biên bản thanh lý hợp đồng thuê phòng số P.302 - Giường 01 với các nội dung sau:</p>
                <ol className="list-decimal pl-3 space-y-1 mb-2">
                  <li>Chấm dứt hợp đồng thuê phòng kể từ ngày 25/10/2023.</li>
                  <li>Bên B bàn giao lại phòng và tài sản đi kèm đầy đủ.</li>
                  <li>{refundOwed ? `Bên A hoàn lại số tiền cọc còn thừa là: ${absNet.toLocaleString()} VNĐ.` : `Bên B đồng ý đóng thêm khoản phí chênh lệch là: ${absNet.toLocaleString()} VNĐ.`}</li>
                </ol>
                <div className="flex justify-between text-center font-bold mt-4">
                  <div>ĐẠI DIỆN BÊN A</div>
                  <div>ĐẠI DIỆN BÊN B</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'Chờ hoàn cọc') {
    return (
      <div className="max-w-2xl mx-auto w-full pb-12 pt-16 text-center">
        <div className="w-20 h-20 bg-[#FAF5F3] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#EAD3CC]">
          <Wallet className="w-12 h-12 text-[#B7705F]" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#8C4A3A] mb-3 leading-tight">Đã ký biên bản - Chờ hoàn cọc</h1>
        <p className="text-base text-gray-600 mb-8 max-w-lg mx-auto">
          Cảm ơn bạn đã xác nhận biên bản thanh lý hợp đồng. Bộ phận Kế toán của Homestay Dorm đang làm việc để hoàn trả lại số tiền cọc cho bạn.
        </p>

        <div className="bg-white rounded-2xl p-6 border border-[#EAD3CC]/50 text-left mb-8 max-w-md mx-auto shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4 text-sm border-b pb-2 flex items-center">
            <Check className="w-4 h-4 mr-1.5 text-[#B7705F]" /> Thông tin quyết toán hoàn trả
          </h2>
          <div className="space-y-3 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Mã Hợp đồng:</span>
              <span className="font-semibold text-gray-900">HD-2023-P302</span>
            </div>
            <div className="flex justify-between">
              <span>Số tiền cọc gốc:</span>
              <span className="font-medium text-gray-900">{depositVal.toLocaleString()} ₫</span>
            </div>
            <div className="flex justify-between">
              <span>Tổng chi phí khấu trừ:</span>
              <span className="font-medium text-red-600">-{totalDeductions.toLocaleString()} ₫</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-[#8C4A3A] font-bold text-sm">
              <span>SỐ TIỀN HOÀN TRẢ LẠI:</span>
              <span>{absNet.toLocaleString()} ₫</span>
            </div>
            <div className="flex justify-between pt-2 border-t text-gray-700 font-semibold items-center">
              <span>Trạng thái hồ sơ:</span>
              <span className="bg-[#FAF5F3] text-[#8C4A3A] border border-[#EAD3CC] px-2 py-0.5 rounded-full text-[10px]">Chờ hoàn cọc</span>
            </div>
          </div>
        </div>

        <div className="bg-[#FAF5F3]/50 rounded-xl p-4 text-xs text-gray-700 border border-[#EAD3CC] max-w-md mx-auto mb-8 text-left leading-relaxed">
          <strong>Lưu ý về thời hạn hoàn tiền:</strong> Khoản tiền hoàn lại sẽ được chuyển khoản trực tiếp vào số tài khoản ngân hàng của bạn đã đăng ký với Homestay trong vòng 1-3 ngày làm việc (không tính thứ 7, Chủ Nhật và ngày lễ).
        </div>

        <button
          onClick={handleCancel}
          className="px-6 py-2.5 border border-[#B7705F] text-[#B7705F] hover:bg-[#F3E1DC]/30 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
        >
          Tạo yêu cầu mới
        </button>
      </div>
    );
  }

  if (status === 'Chờ thanh toán bổ sung') {
    return (
      <div className="max-w-2xl mx-auto w-full pb-12 pt-16 text-center">
        <div className="w-20 h-20 bg-[#FAF5F3] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#EAD3CC]">
          <DollarSign className="w-12 h-12 text-[#B7705F]" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#8C4A3A] mb-3 leading-tight">Yêu cầu thanh toán bổ sung</h1>
        <p className="text-base text-gray-600 mb-8 max-w-lg mx-auto">
          Biên bản thanh lý của bạn đã được ghi nhận. Vì tổng chi phí phát sinh / hư hại vượt quá tiền cọc gốc, bạn vui lòng thanh toán bổ sung phần chênh lệch dưới đây để hoàn tất bàn giao.
        </p>

        <div className="bg-white rounded-2xl p-6 border border-[#EAD3CC]/50 text-left mb-8 max-w-md mx-auto shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4 text-sm border-b pb-2 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1.5 text-[#B7705F]" /> Chi tiết phần nợ chênh lệch
          </h2>
          <div className="space-y-3 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Mã Hợp đồng:</span>
              <span className="font-semibold text-gray-900">HD-2023-P302</span>
            </div>
            <div className="flex justify-between">
              <span>Số tiền cọc gốc:</span>
              <span className="font-medium text-gray-900">{depositVal.toLocaleString()} ₫</span>
            </div>
            <div className="flex justify-between">
              <span>Tổng chi phí khấu trừ:</span>
              <span className="font-medium text-red-600">-{totalDeductions.toLocaleString()} ₫</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-[#8C4A3A] font-bold text-sm">
              <span>SỐ TIỀN CẦN THANH TOÁN THÊM:</span>
              <span>{absNet.toLocaleString()} ₫</span>
            </div>
            <div className="flex justify-between pt-2 border-t text-gray-700 font-semibold items-center">
              <span>Trạng thái hồ sơ:</span>
              <span className="bg-[#FAF5F3] text-[#8C4A3A] border border-[#EAD3CC] px-2 py-0.5 rounded-full text-[10px]">Chờ thanh toán bổ sung</span>
            </div>
          </div>
        </div>

        <div className="bg-[#FAF5F3] rounded-xl p-5 border border-[#EAD3CC] max-w-md mx-auto mb-8 text-left">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-2">Thông tin tài khoản nhận chuyển khoản:</h3>
          <div className="text-xs space-y-1 text-gray-700">
            <p><strong>Ngân hàng:</strong> Techcombank (TCB)</p>
            <p><strong>Số tài khoản:</strong> 19033344455566</p>
            <p><strong>Chủ tài khoản:</strong> HOMESTAY DORM CO., LTD</p>
            <p><strong>Nội dung:</strong> <span className="font-mono bg-white px-1.5 py-0.5 border rounded text-[#8C4A3A] font-semibold">HD-2023-P302 THANH TOAN DU</span></p>
          </div>
        </div>

        <button
          onClick={handleCancel}
          className="px-6 py-2.5 border border-[#B7705F] text-[#B7705F] hover:bg-[#F3E1DC]/30 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
        >
          Tạo yêu cầu mới
        </button>
      </div>
    );
  }

  if (status === 'Đã thanh lý') {
    return (
      <div className="max-w-xl mx-auto w-full pb-12 pt-16 text-center">
        <div className="w-20 h-20 bg-[#FAF5F3] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#EAD3CC]">
          <CheckCircle2 className="w-12 h-12 text-[#B7705F]" />
        </div>
        <h1 className="text-3xl font-bold text-[#8C4A3A] mb-3 leading-tight">Thanh lý thành công!</h1>
        <p className="text-base text-gray-600 mb-8 max-w-md mx-auto">
          Hệ thống đã ghi nhận biên bản trả phòng của bạn. Hợp đồng <span className="font-semibold text-gray-900">HD-2023-P302</span> hiện đã được chuyển sang trạng thái <span className="font-semibold text-[#8C4A3A] bg-[#FAF5F3] px-2 py-0.5 rounded border border-[#EAD3CC]">Đã thanh lý</span>.
        </p>

        <div className="bg-white rounded-2xl p-6 border border-[#EAD3CC]/50 text-left mb-8 max-w-md mx-auto shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4 text-sm border-b pb-2">Thông tin hoàn tất</h2>
          <div className="space-y-3 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Hợp đồng:</span>
              <span className="font-medium text-gray-900">HD-2023-P302</span>
            </div>
            <div className="flex justify-between">
              <span>Khách thuê:</span>
              <span className="font-medium text-gray-900">Trần Thị Sinh Viên</span>
            </div>
            <div className="flex justify-between">
              <span>Phòng / Giường:</span>
              <span className="font-medium text-gray-900">P.302 - Giường 01</span>
            </div>
            <div className="flex justify-between">
              <span>Kết quả quyết toán:</span>
              <span className="font-bold text-[#8C4A3A]">{refundOwed ? `Hoàn trả: ${absNet.toLocaleString()} ₫` : `Nộp thêm: ${absNet.toLocaleString()} ₫`}</span>
            </div>
            <div className="flex justify-between pt-2 border-t text-[#8C4A3A] font-semibold">
              <span>Trạng thái:</span>
              <span>Đã thanh lý thành công</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleCancel}
          className="px-6 py-2.5 border border-[#B7705F] text-[#B7705F] hover:bg-[#F3E1DC]/30 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
        >
          Tạo yêu cầu mới
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full pb-12">
      {/* Header */}
      <div className="pt-8 pb-8">
        <h1 className="text-3xl font-bold text-[#8C4A3A] mb-3 leading-tight tracking-tight">Yêu cầu trả phòng</h1>
        <p className="text-base text-[#666666]">
          Bắt đầu thủ tục kết thúc hợp đồng thuê. Vui lòng xác nhận ngày mong muốn và theo dõi quy trình bên dưới.
        </p>
      </div>

      <div className="space-y-6">
        {/* Tóm tắt hợp đồng */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EAD3CC]/50">
          <div className="flex items-center space-x-2 mb-4 text-[#B7705F]">
            <FileText className="w-5 h-5" />
            <h2 className="text-lg font-medium text-[#222222]">Tóm tắt hợp đồng hiện tại</h2>
          </div>

          <div className="bg-[#FAF5F3]/50 rounded-xl p-5 flex flex-wrap gap-8">
            <div className="flex-1 min-w-[150px]">
              <p className="text-xs text-[#666666] mb-1">Số hợp đồng</p>
              <p className="text-base font-medium text-[#222222]">HD-2023-P302</p>
            </div>
            <div className="flex-1 min-w-[150px]">
              <p className="text-xs text-[#666666] mb-1">Ngày bắt đầu</p>
              <p className="text-base font-medium text-[#222222]">15/08/2023</p>
            </div>
            <div className="flex-1 min-w-[150px]">
              <p className="text-xs text-[#666666] mb-1">Số tháng đã ở</p>
              <p className="text-base font-bold text-[#B7705F]">10 tháng</p>
            </div>
            <div className="flex-1 min-w-[150px]">
              <p className="text-xs text-[#666666] mb-1">Số tiền cọc</p>
              <p className="text-base font-medium text-[#B7705F]">6,500,000 ₫</p>
            </div>
          </div>
        </div>

        {/* Quy trình hướng dẫn */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EAD3CC]/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FAF5F3] rounded-full blur-3xl opacity-50 -z-10 translate-x-1/3 -translate-y-1/3"></div>

          <h2 className="text-lg font-medium text-[#222222] mb-6">Quy trình hướng dẫn</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="w-10 h-10 bg-[#F3E1DC] rounded-full flex items-center justify-center text-[#B7705F] mb-3">
                <Home className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-[#222222] mb-2">1. Kiểm tra phòng</h3>
              <p className="text-xs text-[#666666] leading-relaxed">BQL sẽ kiểm tra hiện trạng nội thất và vệ sinh phòng.</p>
            </div>
            <div>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#666666] mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-[#222222] mb-2">2. Đối soát tài chính</h3>
              <p className="text-xs text-[#666666] leading-relaxed">Chốt chỉ số điện nước cuối cùng và các khoản phí phát sinh.</p>
            </div>
            <div>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#666666] mb-3">
                <FileSignature className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-[#222222] mb-2">3. Ký biên bản</h3>
              <p className="text-xs text-[#666666] leading-relaxed">Xác nhận công nợ và ký biên bản thanh lý hợp đồng.</p>
            </div>
            <div>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#666666] mb-3">
                <Wallet className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-[#222222] mb-2">4. Hoàn tiền</h3>
              <p className="text-xs text-[#666666] leading-relaxed">Hoàn trả tiền cọc còn lại (nếu có) sau khi trừ chi phí.</p>
            </div>
          </div>
        </div>

        {/* Chi tiết yêu cầu */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EAD3CC]/50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-[#222222]">Chi tiết yêu cầu</h2>
            {isSubmitted && (
              <span className="px-3 py-1 bg-[#FAF5F3] text-[#8C4A3A] border border-[#EAD3CC] rounded-full text-xs font-semibold flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1" />
                {status}
              </span>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#222222] mb-2">
                Ngày trả phòng mong muốn <span className="text-[#B7705F]">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={isSubmitted}
                className="w-full md:w-1/2 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B7705F]/20 focus:border-[#B7705F] text-sm outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="dd/mm/yyyy"
              />
              {!isSubmitted && (
                <p className="text-xs text-[#666666] mt-2 flex items-center">
                  <AlertCircle className="w-3.5 h-3.5 mr-1" />
                  Vui lòng báo trước ít nhất 30 ngày theo quy định hợp đồng.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#222222] mb-2">
                Ghi chú thêm (Không bắt buộc)
              </label>
              <textarea
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                disabled={isSubmitted}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B7705F]/20 focus:border-[#B7705F] text-sm resize-none outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Lý do chuyển đi hoặc các yêu cầu đặc biệt khác..."
              />
            </div>

            <div className="pt-4 flex justify-end space-x-3">
              {isSubmitted ? (
                <button onClick={handleCancel} className="px-6 py-2.5 rounded-xl border border-gray-300 text-[#666666] font-medium hover:bg-gray-50 transition-colors text-sm flex items-center cursor-pointer">
                  <X className="w-4 h-4 mr-2" /> Hủy yêu cầu
                </button>
              ) : (
                <button onClick={handleSubmit} className="px-6 py-2.5 rounded-xl bg-[#8A5A4A] text-white font-medium hover:bg-[#724A3D] transition-colors text-sm flex items-center cursor-pointer">
                  Gửi yêu cầu <Send className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
