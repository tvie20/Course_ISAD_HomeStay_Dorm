import { useState } from 'react';
import { Download, Trash2 } from 'lucide-react';

export default function SaleContract() {
  const [members, setMembers] = useState([
    { id: 1, name: 'Nguyễn Văn A', cccd: '079123456789', relation: 'Đại diện', isMain: true }
  ]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<any>(null);

  const addMember = () => {
    setMembers([...members, { id: Date.now(), name: '', cccd: '', relation: '', isMain: false }]);
  };

  const deleteMember = (id: number) => {
    setMembers(members.filter(m => m.id !== id));
    setShowDeleteConfirm(null);
  };
  return (
    <div className="p-8">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#8C4A3A]">Lập hợp đồng thuê</h1>
        <div className="flex items-center space-x-4">
          <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
             <Download className="w-4 h-4 mr-2" />
             Tải từ phiếu cọc
          </button>
        </div>
      </div>

      {/* Contract Paper */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 max-w-4xl mx-auto p-12">
        <div className="text-center mb-10">
          <h2 className="text-lg font-bold text-gray-900 uppercase">Cộng hòa xã hội chủ nghĩa việt nam</h2>
          <p className="text-sm font-medium text-gray-700 underline decoration-1 underline-offset-4">Độc lập - Tự do - Hạnh phúc</p>
          <h3 className="mt-8 text-xl font-bold text-[#B7705F] uppercase">Hợp đồng thuê phòng ký túc xá</h3>
          <p className="text-sm text-gray-500 mt-2">Số: HD-102023-001 | Ngày lập: 20/10/2023</p>
        </div>

        <div className="space-y-8">
           {/* Section 1 */}
           <div>
              <h4 className="text-sm font-bold text-[#B7705F] uppercase mb-4">Điều 1: Thông tin các bên</h4>
              <div className="grid grid-cols-2 gap-12 bg-gray-50 p-6 rounded-lg border border-gray-100">
                 <div>
                    <p className="font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">Bên Cho Thuê (Bên A)</p>
                    <div className="space-y-4 text-sm">
                       <div>
                          <p className="text-gray-500 mb-1">Đại diện</p>
                          <p className="font-medium text-gray-900">Ban Quản Lý HomeStay Dorm</p>
                       </div>
                       <div>
                          <p className="text-gray-500 mb-1">Chi nhánh</p>
                          <p className="font-medium text-gray-900">CN Quận 1</p>
                       </div>
                    </div>
                 </div>
                 <div>
                    <p className="font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">Bên Thuê (Bên B)</p>
                    <div className="space-y-4 text-sm">
                       <div>
                          <p className="text-gray-500 mb-1">Họ và tên người đại diện *</p>
                          <input type="text" defaultValue="Nguyễn Văn A" className="w-full bg-transparent border-b border-gray-300 focus:border-[#B7705F] focus:outline-none py-1 font-medium text-gray-900" />
                       </div>
                       <div>
                          <p className="text-gray-500 mb-1">CCCD/CMND *</p>
                          <input type="text" defaultValue="079123456789" className="w-full bg-transparent border-b border-gray-300 focus:border-[#B7705F] focus:outline-none py-1 font-medium text-gray-900" />
                       </div>
                       <div>
                          <p className="text-gray-500 mb-1">Số điện thoại *</p>
                          <input type="text" defaultValue="0901234567" className="w-full bg-transparent border-b border-gray-300 focus:border-[#B7705F] focus:outline-none py-1 font-medium text-gray-900" />
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Section 2 */}
           <div>
              <h4 className="text-sm font-bold text-[#B7705F] uppercase mb-4">Điều 2: Chi tiết thuê & tài chính</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                 <div>
                    <p className="text-xs font-medium text-gray-500 mb-1.5">Phòng thuê *</p>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm font-medium focus:ring-1 focus:ring-[#B7705F] focus:border-[#B7705F]">
                       <option>P101 - CN Quận 1</option>
                    </select>
                 </div>
                 <div>
                    <p className="text-xs font-medium text-gray-500 mb-1.5">Giá thuê (VNĐ/tháng) *</p>
                    <input type="text" defaultValue="4,500,000" className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm font-medium focus:ring-1 focus:ring-[#B7705F] focus:border-[#B7705F]" />
                 </div>
                 <div>
                    <p className="text-xs font-medium text-gray-500 mb-1.5">Kỳ thanh toán *</p>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm font-medium focus:ring-1 focus:ring-[#B7705F] focus:border-[#B7705F]">
                       <option>Hàng tháng (Ngày 1-5)</option>
                    </select>
                 </div>
                 <div>
                    <p className="text-xs font-medium text-gray-500 mb-1.5">Ngày bắt đầu tính phí *</p>
                    <input type="text" defaultValue="01/11/2023" className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm font-medium focus:ring-1 focus:ring-[#B7705F] focus:border-[#B7705F]" />
                 </div>
                 <div>
                    <p className="text-xs font-medium text-gray-500 mb-1.5">Ngày kết thúc *</p>
                    <input type="text" defaultValue="01/05/2024" className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm font-medium focus:ring-1 focus:ring-[#B7705F] focus:border-[#B7705F]" />
                 </div>
                 <div>
                    <p className="text-xs font-medium text-gray-500 mb-1.5">Tiền cọc giữ chân (VNĐ) *</p>
                    <div className="px-3 py-2 border border-[#B7705F]/30 bg-red-50/50 rounded-md text-sm font-medium text-green-700 bg-white">
                       4,500,000 (Đã nộp)
                    </div>
                 </div>
              </div>

              <div className="bg-[#FAF5F3]/50 p-4 rounded-lg border border-[#EAD3CC]/50">
                 <p className="text-sm font-medium text-gray-900 mb-2">Các phí dịch vụ đi kèm (chưa bao gồm trong giá thuê):</p>
                 <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    <li>Điện: 3.500đ/kwh (Đồng hồ riêng)</li>
                    <li>Nước sinh hoạt: 100.000đ/người/tháng</li>
                    <li>Phí rác, wifi, dịch vụ chung: 150.000đ/phòng/tháng</li>
                 </ul>
              </div>
           </div>

           {/* Section 3 */}
           <div>
              <div className="flex items-center justify-between mb-4">
                 <h4 className="text-sm font-bold text-[#B7705F] uppercase">Điều 3: Danh sách thành viên lưu trú</h4>
                 <button onClick={addMember} className="text-xs font-medium text-[#B7705F] bg-[#F3E1DC]/50 px-3 py-1.5 rounded-md hover:bg-[#F3E1DC]">
                   + Thêm thành viên
                 </button>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 bg-gray-50 border-b border-gray-200">
                       <tr>
                          <th className="py-3 px-4 w-12 font-medium">STT</th>
                          <th className="py-3 px-4 font-medium">Họ và tên</th>
                          <th className="py-3 px-4 font-medium">CCCD</th>
                          <th className="py-3 px-4 font-medium">Quan hệ</th>
                          <th className="py-3 px-4 font-medium text-right">Thao tác</th>
                       </tr>
                    </thead>
                    <tbody>
                       {members.map((member, idx) => (
                         <tr key={member.id} className="border-b border-gray-100">
                            <td className="py-3 px-4 text-gray-500">{idx + 1}</td>
                            <td className="py-3 px-4">
                              {member.isMain ? (
                                <span className="font-medium text-gray-900">{member.name}</span>
                              ) : (
                                <input type="text" value={member.name} onChange={e => {
                                  const newMembers = [...members];
                                  newMembers[idx].name = e.target.value;
                                  setMembers(newMembers);
                                }} placeholder="Nhập tên..." className="w-full bg-transparent focus:outline-none placeholder-gray-400" />
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {member.isMain ? (
                                <span className="text-gray-600">{member.cccd}</span>
                              ) : (
                                <input type="text" value={member.cccd} onChange={e => {
                                  const newMembers = [...members];
                                  newMembers[idx].cccd = e.target.value;
                                  setMembers(newMembers);
                                }} placeholder="Nhập CCCD..." className="w-full bg-transparent focus:outline-none placeholder-gray-400" />
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {member.isMain ? (
                                <span className="text-gray-600">{member.relation}</span>
                              ) : (
                                <input type="text" value={member.relation} onChange={e => {
                                  const newMembers = [...members];
                                  newMembers[idx].relation = e.target.value;
                                  setMembers(newMembers);
                                }} placeholder="Bạn bè/Anh em..." className="w-full bg-transparent focus:outline-none placeholder-gray-400" />
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                               {!member.isMain && (
                                 <button onClick={() => setShowDeleteConfirm(member.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors" title="Xóa">
                                     <Trash2 className="w-5 h-5" />
                                 </button>
                               )}
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 mt-12 pt-6 border-t border-gray-100">
           <button className="px-6 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">Lưu nháp</button>
           <button className="px-6 py-2.5 rounded-lg bg-gray-800 text-sm font-medium text-white hover:bg-gray-900">In hợp đồng PDF</button>
           <button className="px-6 py-2.5 rounded-lg bg-[#B7705F] text-sm font-medium text-white hover:bg-[#a06050] flex items-center">
             <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
             Hoàn tất & Ký
           </button>
        </div>
      </div>
    </div>
  );
}
