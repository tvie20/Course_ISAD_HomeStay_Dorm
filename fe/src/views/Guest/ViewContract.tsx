import React, { useState, useEffect } from 'react';
import { Download, Check, X, ShieldCheck } from 'lucide-react';

export default function ViewContract({ customerId }: { customerId?: string }) {
  const [contract, setContract] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const id = customerId;

        const res = await fetch(`http://localhost:5000/api/v1/contracts/active-contract?CustomerID=${id}`);
        const data = await res.json();
        if (data.status === 'success') {
          setContract(data.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải hợp đồng", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContract();
  }, [customerId]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu hợp đồng...</div>;
  }

  if (!contract) {
    return (
      <div className="max-w-4xl mx-auto w-full pb-12 pt-8">
        <div className="bg-orange-50 border border-orange-200 p-5 rounded-xl text-orange-800 text-center">
          Hiện tại bạn không có hợp đồng thuê nào đang có hiệu lực.
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const createdDate = new Date(contract.createdDate || contract.startDate);

  return (
    <div className="max-w-4xl mx-auto w-full pb-12">
      {/* Header */}
      <div className="pt-8 pb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1">Xem hợp đồng thuê</h1>
          <p className="text-sm text-[#666666]">
            Vui lòng đọc kỹ các điều khoản trước khi xác nhận ký.
          </p>
        </div>
        <button className="flex items-center px-4 py-2 bg-white border border-[#EAD3CC] rounded-lg text-sm font-medium text-[#B7705F] hover:bg-[#FAF5F3] transition-colors shadow-sm">
          <Download className="w-4 h-4 mr-2" />
          Tải bản PDF
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#EAD3CC] overflow-hidden">
        {/* Contract Document Area */}
        <div className="p-8 md:p-12 border-b border-[#EAD3CC]/50">
          <div className="text-sm leading-relaxed text-[#222222]" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
            <h3 className="text-center font-bold mb-1">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h3>
            <h4 className="text-center font-bold mb-6 underline decoration-1 underline-offset-4">Độc lập - Tự do - Hạnh phúc</h4>
            <h2 className="text-center font-bold text-base mb-1">Hợp đồng thuê phòng</h2>
            <p className="text-center italic text-gray-600 mb-8">Số: {new Date().getFullYear()}/{contract.id}</p>

            <p className="mb-4">Hôm nay, ngày {createdDate.getDate().toString().padStart(2, '0')} tháng {(createdDate.getMonth() + 1).toString().padStart(2, '0')} năm {createdDate.getFullYear()}, tại HomeStay Dorm, chúng tôi gồm:</p>

            <div className="mb-4">
              <p className="font-bold mb-1">BÊN CHO THUÊ (BÊN A):</p>
              <p>Đại diện: Ông Nguyễn Văn Quản Lý</p>
              <p>Chức vụ: Giám đốc chi nhánh</p>
              <p>Điện thoại: 0909 123 456</p>
            </div>

            <div className="mb-6">
              <p className="font-bold mb-1">BÊN THUÊ (BÊN B):</p>
              <p>Ông/Bà: {contract.customer}</p>
              <p>CCCD số: {contract.cccd || "Chưa cung cấp"}</p>
              <p>Điện thoại: {contract.phone || "Chưa cung cấp"}</p>
            </div>

            <p className="font-bold mb-2">ĐIỀU 1: NỘI DUNG THUÊ</p>
            <p className="mb-2">Bên A đồng ý cho Bên B thuê phòng {contract.room || '...'} {contract.bed ? `(${contract.bed})` : ''} tại địa chỉ: Tòa nhà HomeStay Dorm.</p>
            <p className="mb-2">Giá thuê: {contract.price?.toLocaleString() || '...'} VNĐ/tháng.</p>
            <p className="mb-2">Tiền cọc: {contract.deposit?.toLocaleString() || '...'} VNĐ (Đã nhận đủ).</p>
            <p className="mb-6">Thời hạn thuê: Từ ngày {formatDate(contract.startDate)} đến {formatDate(contract.endDate)}.</p>

            <p className="font-bold mb-2">ĐIỀU 2: CHI PHÍ DỊCH VỤ VÀ THANH TOÁN</p>
            <p className="mb-1">- Tiền điện: 3,500đ/kWh</p>
            <p className="mb-1">- Tiền nước: 20,000đ/m³</p>
            <p className="mb-1">- Internet: 100,000đ/tháng</p>
            <p className="mb-8 mt-4">Kỳ thanh toán: Từ ngày 01 đến ngày 05 hàng tháng.</p>

            <div className="grid grid-cols-2 text-center text-xs">
              <div>
                <p className="font-bold mb-1">ĐẠI DIỆN BÊN A</p>
                <p className="italic text-gray-500 mb-2">(Ký, ghi rõ họ tên)</p>
              </div>
              <div>
                <p className="font-bold mb-1">ĐẠI DIỆN BÊN B</p>
                <p className="italic text-gray-500 mb-2">(Ký, ghi rõ họ tên)</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

