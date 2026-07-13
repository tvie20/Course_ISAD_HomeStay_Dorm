import { useState } from 'react';
import { Download, Trash2 } from 'lucide-react';

export default function SaleContract() {
   // Mock deposit beds from InitialPayment
   const reservedBeds = ['01', '02', '03'];

   const [members, setMembers] = useState([
      { id: 1, name: 'Nguyễn Văn A', cccd: '079123456789', relation: 'Đại diện', isMain: true, assignedBed: '01' }
   ]);
   const [showDeleteConfirm, setShowDeleteConfirm] = useState<any>(null);

   const addMember = () => {
      setMembers([...members, { id: Date.now(), name: '', cccd: '', relation: '', isMain: false, assignedBed: '' }]);
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
                  <div className="flex items-center mb-4">
                     <h4 className="text-sm font-bold text-[#B7705F] uppercase flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        Nội dung thuê & dịch vụ (Phòng & Giường)
                     </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <div className="col-span-2 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                           <div>
                              <p className="text-sm font-medium text-gray-500 mb-2">Phòng số</p>
                              <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-900 focus:outline-none">
                                 <option>P.102</option>
                              </select>
                           </div>
                           <div>
                              <p className="text-sm font-medium text-gray-500 mb-2">Giường số</p>
                              <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-[#B7705F] focus:outline-none focus:border-[#B7705F]">
                                 <option>Giường 01</option>
                                 <option>Giường 02</option>
                                 <option>Giường 03</option>
                              </select>
                           </div>
                        </div>

                        <div>
                           <p className="text-sm font-medium text-gray-500 mb-2">Thời hạn thuê (Tháng)</p>
                           <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#B7705F]">
                              <option>12 tháng</option>
                              <option>6 tháng</option>
                              <option>3 tháng</option>
                           </select>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                           <div>
                              <p className="text-sm font-medium text-gray-500 mb-2">Giá thuê (đ/tháng)</p>
                              <input type="text" defaultValue="3,500,000" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-900 focus:outline-none" />
                           </div>
                           <div>
                              <p className="text-sm font-medium text-gray-500 mb-2">Tiền cọc (Đã đóng)</p>
                              <input type="text" defaultValue="3,500,000" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-[#B7705F] focus:outline-none" />
                           </div>
                        </div>

                        <div>
                           <p className="text-sm font-medium text-gray-500 mb-2">Khách đăng ký ở cùng</p>
                           <div className="flex flex-wrap gap-2">
                              <span className="px-3 py-1.5 bg-[#F3E1DC] text-[#8C4A3A] rounded-lg text-xs font-bold border border-[#EAD3CC]">Nguyễn Văn B (Bạn)</span>
                              <span className="px-3 py-1.5 bg-[#F3E1DC] text-[#8C4A3A] rounded-lg text-xs font-bold border border-[#EAD3CC]">Trần Thị C (Bạn)</span>
                           </div>
                        </div>
                     </div>

                     <div className="bg-[#FAF5F3] p-6 rounded-xl border border-[#EAD3CC]">
                        <h5 className="text-sm font-bold text-gray-900 mb-6 flex items-center uppercase">
                           <svg className="w-4 h-4 mr-2 text-[#B7705F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                           Biểu phí dịch vụ đi kèm
                        </h5>
                        <div className="space-y-4">
                           <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                              <span className="text-sm text-gray-500 flex items-center">
                                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                 Điện sinh hoạt
                              </span>
                              <span className="text-sm font-bold text-gray-900">3,500đ / kWh</span>
                           </div>
                           <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                              <span className="text-sm text-gray-500 flex items-center">
                                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                                 Nước sạch
                              </span>
                              <span className="text-sm font-bold text-gray-900">20,000đ / m³</span>
                           </div>
                           <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                              <span className="text-sm text-gray-500 flex items-center">
                                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path></svg>
                                 Wifi tốc độ cao
                              </span>
                              <span className="text-sm font-bold text-gray-900">100,000đ / phòng</span>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-500 flex items-center">
                                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path></svg>
                                 Giữ xe máy
                              </span>
                              <span className="text-sm font-bold text-gray-900">120,000đ / xe</span>
                           </div>
                        </div>
                     </div>
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
                              <th className="py-3 px-4 font-medium">Giường chỉ định</th>
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
                                 <td className="py-3 px-4">
                                    <select
                                       value={member.assignedBed}
                                       onChange={e => {
                                          const newMembers = [...members];
                                          newMembers[idx].assignedBed = e.target.value;
                                          setMembers(newMembers);
                                       }}
                                       className="w-full bg-white border border-gray-200 rounded-md py-1.5 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#B7705F]"
                                    >
                                       <option value="">-- Chọn giường --</option>
                                       {reservedBeds.map(bed => (
                                          <option key={bed} value={bed} disabled={members.some(m => m.id !== member.id && m.assignedBed === bed)}>
                                             Giường {bed}
                                          </option>
                                       ))}
                                    </select>
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
               <button onClick={() => alert('Đã hoàn tất ký hợp đồng và lưu trữ thành công!')} className="px-6 py-2.5 rounded-lg bg-[#B7705F] text-sm font-medium text-white hover:bg-[#a06050] flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Hoàn tất & Ký
               </button>
            </div>
         </div>
      </div>
   );
}
