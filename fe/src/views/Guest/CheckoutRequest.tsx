import React, { useState, useEffect } from 'react';
import { FileText, Home, FileSignature, Wallet, Send, AlertCircle, Clock, X, CheckCircle2 } from 'lucide-react';

export default function CheckoutRequest({ customerId }: { customerId?: string }) {
  const [activeContract, setActiveContract] = useState<any>(null);
  const [checkoutRequest, setCheckoutRequest] = useState<any>(null);

  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [status, setStatus] = useState('Đang xử lý');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const id = customerId || 'KH0001';
      // Fetch active contract
      const contractRes = await fetch(`http://localhost:5000/api/v1/contracts/active-contract?CustomerID=${id}`);
      const contractData = await contractRes.json();
      if (contractData.status === 'success') {
        setActiveContract(contractData.data);
      }

      // Fetch checkout request
      const requestRes = await fetch(`http://localhost:5000/api/v1/checkout-requests/my-requests?CustomerID=${id}`);
      const requestData = await requestRes.json();
      if (requestData.status === 'success' && requestData.data && requestData.data.length > 0) {
        const latestRequest = requestData.data[0];
        setCheckoutRequest(latestRequest);
        setDate(latestRequest.date ? latestRequest.date.split('T')[0] : '');
        setNote(latestRequest.note || '');
        setIsSubmitted(true);
        setStatus(latestRequest.status || 'Đang xử lý');
      } else {
        setCheckoutRequest(null);
        setIsSubmitted(false);
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu trả phòng:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [customerId]);

  const handleSubmit = async () => {
    if (date && activeContract) {
      try {
        const payload = {
          ContractID: activeContract.id,
          ExpectedCheckoutDate: date,
          Reason: note
        };

        const response = await fetch('http://localhost:5000/api/v1/checkout-requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (data.status === 'success') {
          await fetchData();
        } else {
          alert('Có lỗi xảy ra: ' + data.message);
        }
      } catch (error) {
        console.error(error);
        alert('Lỗi kết nối máy chủ');
      }
    }
  };

  const handleCancel = () => {
    // There is no DELETE API for checkout request, so just reset UI for demo purposes
    // Ideally we should call DELETE or UPDATE status to 'Đã hủy'
    setIsSubmitted(false);
    setDate('');
    setNote('');
    setStatus('Đang xử lý');
    setCheckoutRequest(null);
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>;
  }

  if (status === 'Đã duyệt' || status === 'Đã xử lý') {
    return (
      <div className="max-w-xl mx-auto w-full pb-12 pt-16 text-center">
        <div className="w-20 h-20 bg-[#FAF5F3] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#EAD3CC]">
          <CheckCircle2 className="w-12 h-12 text-[#B7705F]" />
        </div>
        <h1 className="text-3xl font-bold text-[#8C4A3A] mb-3 leading-tight">Yêu cầu đã được xử lý!</h1>
        <p className="text-base text-gray-600 mb-8 max-w-md mx-auto">
          Hệ thống đã hoàn tất thanh lý hợp đồng của bạn. Hợp đồng <span className="font-semibold text-gray-900">{activeContract?.id}</span> hiện đã được chuyển sang trạng thái <span className="font-semibold text-[#8C4A3A] bg-[#FAF5F3] px-2 py-0.5 rounded border border-[#EAD3CC]">{status}</span>.
        </p>

        <button
          onClick={handleCancel}
          className="px-6 py-2.5 border border-[#B7705F] text-[#B7705F] hover:bg-[#F3E1DC]/30 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
        >
          Quay lại
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
        {activeContract ? (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EAD3CC]/50">
          <div className="flex items-center space-x-2 mb-4 text-[#B7705F]">
            <FileText className="w-5 h-5" />
            <h2 className="text-lg font-medium text-[#222222]">Tóm tắt hợp đồng hiện tại</h2>
          </div>

          <div className="bg-[#FAF5F3]/50 rounded-xl p-5 flex flex-wrap gap-8">
            <div className="flex-1 min-w-[150px]">
              <p className="text-xs text-[#666666] mb-1">Số hợp đồng</p>
              <p className="text-base font-medium text-[#222222]">{activeContract.id}</p>
            </div>
            <div className="flex-1 min-w-[150px]">
              <p className="text-xs text-[#666666] mb-1">Ngày bắt đầu</p>
              <p className="text-base font-medium text-[#222222]">{new Date(activeContract.startDate).toLocaleDateString('vi-VN')}</p>
            </div>
            <div className="flex-1 min-w-[150px]">
              <p className="text-xs text-[#666666] mb-1">Số tháng đã ở</p>
              <p className="text-base font-bold text-[#B7705F]">{activeContract.monthsStayed} tháng</p>
            </div>
            <div className="flex-1 min-w-[150px]">
              <p className="text-xs text-[#666666] mb-1">Số tiền cọc</p>
              <p className="text-base font-medium text-[#B7705F]">{activeContract.deposit?.toLocaleString()} ₫</p>
            </div>
          </div>
        </div>
        ) : (
          <div className="bg-orange-50 border border-orange-200 p-5 rounded-xl text-orange-800">
            Bạn hiện không có hợp đồng thuê nào đang có hiệu lực.
          </div>
        )}

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
                <button onClick={handleSubmit} disabled={!activeContract} className="px-6 py-2.5 rounded-xl bg-[#8A5A4A] text-white font-medium hover:bg-[#724A3D] transition-colors text-sm flex items-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
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
