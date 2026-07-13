import React, { useState, useEffect } from 'react';
import { Search, Save, Trash2, AlertTriangle, Clock, Send, Eye, PenSquare, Filter, ChevronDown } from 'lucide-react';

// Bản ghi phân bổ tài sản theo phòng (Manager)
interface AssetRecord {
   id: string;
   maTaiSan: string;
   tenTaiSan: string;
   branch: string;
   room: string;
   soLuong: number;
   occupant: string;
   condition: string;
   lastUpdated: string;
   notes?: string;
   isVirtual?: boolean;
   assignedTo?: 'room' | 'bed';  // 'room' = dùng chung cả phòng, 'bed' = riêng giường
   bed?: string;                 // Tên giường cụ thể (khi assignedTo = 'bed')
}

const ROOM_BEDS: Record<string, string[]> = {
  'P.101': ['Giường 01', 'Giường 02'],
  'P.102': ['Giường 01', 'Giường 02', 'Giường 03', 'Giường 04'],
  'P.103': ['Giường 01', 'Giường 02'],
  'P.301': ['Giường 01', 'Giường 02', 'Giường 03', 'Giường 04'],
  'P.302': ['Giường 01', 'Giường 02'],
};

// Manager chỉ quản lý chi nhánh của mình
const MANAGER_BRANCH = 'Chi nhánh 1';

const DEFAULT_RECORDS: AssetRecord[] = [
   { id: 'MR-001', maTaiSan: 'TS-001', tenTaiSan: 'Máy lạnh Daikin 1.5HP', branch: 'Chi nhánh 1', room: 'P.102', soLuong: 1, occupant: 'Trần Văn B', condition: 'Tốt', lastUpdated: '15/10/2023', notes: 'Máy chạy êm, làm lạnh tốt.', assignedTo: 'room' },
   { id: 'MR-002', maTaiSan: 'TS-002', tenTaiSan: 'Tủ lạnh Aqua 90L', branch: 'Chi nhánh 1', room: 'P.102', soLuong: 1, occupant: 'Trần Văn B', condition: 'Hư hỏng nhẹ', lastUpdated: '10/09/2023', notes: 'Bị rỉ nước nhẹ ở khay đá.', assignedTo: 'room' },
   { id: 'MR-003', maTaiSan: 'TS-001', tenTaiSan: 'Máy lạnh Daikin 1.5HP', branch: 'Chi nhánh 1', room: 'P.103', soLuong: 1, occupant: 'Phạm Thị D', condition: 'Tốt', lastUpdated: '05/11/2023', assignedTo: 'room' },
   { id: 'MR-004', maTaiSan: 'TS-004', tenTaiSan: 'Bình nóng lạnh Ariston 20L', branch: 'Chi nhánh 1', room: 'P.101', soLuong: 1, occupant: 'Nguyễn Văn A', condition: 'Tốt', lastUpdated: '01/10/2023', assignedTo: 'room' },
   { id: 'MR-005', maTaiSan: 'TS-003', tenTaiSan: 'Giường tầng gỗ', branch: 'Chi nhánh 1', room: 'P.101', soLuong: 2, occupant: 'Nguyễn Văn A', condition: 'Tốt', lastUpdated: '05/11/2023', assignedTo: 'bed', bed: 'Giường 01' },
   { id: 'MR-006', maTaiSan: 'TS-001', tenTaiSan: 'Máy lạnh Daikin 1.5HP', branch: 'Chi nhánh 1', room: 'P.301', soLuong: 1, occupant: '--', condition: 'Tốt', lastUpdated: '05/11/2023', assignedTo: 'room' },
   { id: 'MR-007', maTaiSan: 'TS-005', tenTaiSan: 'Chìa khóa thẻ từ', branch: 'Chi nhánh 1', room: 'P.301', soLuong: 1, occupant: 'Khách hàng P.301', condition: 'Tốt', lastUpdated: '05/11/2023', assignedTo: 'bed', bed: 'Giường 01' },
   { id: 'MR-008', maTaiSan: 'TS-003', tenTaiSan: 'Giường tầng gỗ', branch: 'Chi nhánh 1', room: 'P.301', soLuong: 1, occupant: 'Khách hàng P.301', condition: 'Tốt', lastUpdated: '05/11/2023', assignedTo: 'bed', bed: 'Giường 01' },
];

type ModalMode = 'view' | 'edit' | null;

const conditionCls = (cond: string) => {
   switch (cond) {
      case 'Tốt': return 'bg-green-50 text-green-700 border border-green-200';
      case 'Hư hỏng nhẹ': return 'bg-orange-50 text-orange-700 border border-orange-200';
      case 'Cần thay thế': return 'bg-red-50 text-red-700 border border-red-100';
      case 'Đã thanh lý': return 'bg-gray-100 text-gray-500 border border-gray-200';
      default: return 'bg-gray-50 text-gray-500 border border-gray-200';
   }
};

export default function AssetsManagement() {
   // ── State: data ──────────────────────────────────────────────────────────
   const [records, setRecords] = useState<AssetRecord[]>(() => {
      const s = localStorage.getItem('asset_records_manager_v3');
      if (s) try { return JSON.parse(s); } catch { }
      return DEFAULT_RECORDS;
   });

   const [adminRecords, setAdminRecords] = useState<any[]>(() => {
      const s = localStorage.getItem('asset_records_admin_v2');
      if (s) try { return JSON.parse(s); } catch { }
      return [];
   });

   // ── State: UI ────────────────────────────────────────────────────────────
   const [searchTerm, setSearchTerm] = useState('');
   const [filterRoom, setFilterRoom] = useState('Tất cả');
   const [filterCondition, setFilterCondition] = useState('Tất cả');
   const [selectedRecord, setSelectedRecord] = useState<AssetRecord | null>(null);
   const [modalMode, setModalMode] = useState<ModalMode>(null);

   const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);
   const [roomSearchQuery, setRoomSearchQuery] = useState('');

   // ── State: edit form ─────────────────────────────────────────────────────
   const [editRoom, setEditRoom] = useState('');
   const [editSoLuong, setEditSoLuong] = useState<number | ''>('');
   const [editCondition, setEditCondition] = useState('');
   const [editNotes, setEditNotes] = useState('');
   const [editAssignedTo, setEditAssignedTo] = useState<'room' | 'bed'>('room');
   const [editBed, setEditBed] = useState('');

   // ── Persistence ───────────────────────────────────────────────────────────
   const saveRecords = (updated: AssetRecord[]) => {
      setRecords(updated);
      localStorage.setItem('asset_records_manager_v3', JSON.stringify(updated));
   };

   useEffect(() => {
      const sync = () => {
         const s = localStorage.getItem('asset_records_manager_v3');
         if (s) try { setRecords(JSON.parse(s)); } catch { }
         const sa = localStorage.getItem('asset_records_admin_v2');
         if (sa) try { setAdminRecords(JSON.parse(sa)); } catch { }
      };
      window.addEventListener('storage', sync);
      return () => window.removeEventListener('storage', sync);
   }, []);

   // ── Derived: chỉ hiển thị tài sản thuộc chi nhánh manager ───────────────
   const myRecords = records.filter(r => r.branch === MANAGER_BRANCH);
   const myAdminRecords = adminRecords.filter(r => r.branch === MANAGER_BRANCH);

   // Tính toán số lượng chưa phân bổ
   const adminTotals: Record<string, number> = {};
   const adminNames: Record<string, string> = {};
   myAdminRecords.forEach(r => {
      adminTotals[r.maTaiSan] = (adminTotals[r.maTaiSan] || 0) + r.soLuong;
      adminNames[r.maTaiSan] = r.tenTaiSan;
   });

   const managerTotals: Record<string, number> = {};
   myRecords.forEach(r => {
      managerTotals[r.maTaiSan] = (managerTotals[r.maTaiSan] || 0) + r.soLuong;
   });

   const unallocatedRecords: AssetRecord[] = [];
   Object.keys(adminTotals).forEach(maTaiSan => {
      const unallocated = adminTotals[maTaiSan] - (managerTotals[maTaiSan] || 0);
      if (unallocated > 0) {
         unallocatedRecords.push({
            id: `UNALLOC_${maTaiSan}`,
            maTaiSan,
            tenTaiSan: adminNames[maTaiSan],
            branch: MANAGER_BRANCH,
            room: 'Chưa phân bổ',
            soLuong: unallocated,
            occupant: '--',
            condition: 'Tốt',
            lastUpdated: '-',
            isVirtual: true
         } as AssetRecord);
      }
   });

   const allDisplayRecords = [...unallocatedRecords, ...myRecords];
   const roomOptions = ['Tất cả', ...Array.from(new Set(myRecords.map(r => r.room))).sort()];

   const filtered = allDisplayRecords.filter(r => {
      const q = searchTerm.toLowerCase();
      const matchSearch = r.tenTaiSan.toLowerCase().includes(q)
         || r.maTaiSan.toLowerCase().includes(q)
         || r.room.toLowerCase().includes(q);
      const matchRoom = filterRoom === 'Tất cả' || r.room === filterRoom;
      const matchCond = filterCondition === 'Tất cả' || r.condition === filterCondition;
      return matchSearch && matchRoom && matchCond;
   });

   // ── Handlers ──────────────────────────────────────────────────────────────
   const handleOpenView = (r: AssetRecord) => {
      setSelectedRecord(r);
      setModalMode('view');
   };

   const handleOpenEdit = (r: AssetRecord) => {
      setSelectedRecord(r);
      setEditRoom(r.isVirtual ? '' : r.room);
      setEditSoLuong(r.soLuong);
      setEditCondition(r.condition);
      setEditNotes(r.notes || '');
      setEditAssignedTo(r.assignedTo || 'room');
      setEditBed(r.bed || '');
      setIsRoomDropdownOpen(false);
      setRoomSearchQuery('');
      setModalMode('edit');
   };

   const closeModal = () => { setModalMode(null); setSelectedRecord(null); };

   const handleSaveEdit = () => {
      if (!selectedRecord) return;
      const qty = parseInt(editSoLuong as string) || 0;
      const isVirtual = selectedRecord.isVirtual;

      if (qty <= 0) {
         if (!isVirtual) {
            saveRecords(records.filter(r => r.id !== selectedRecord.id));
         }
         closeModal();
         return;
      }

      if (!editRoom.trim() || editRoom === 'Chưa phân bổ') {
         alert('Vui lòng nhập tên phòng!');
         return;
      }

      const unallocatedAmount = adminTotals[selectedRecord.maTaiSan] - (managerTotals[selectedRecord.maTaiSan] || 0);

      if (isVirtual) {
         if (qty > selectedRecord.soLuong) {
            alert('Số lượng phân bổ không được lớn hơn số lượng hiện có!');
            return;
         }
         const newRecord: AssetRecord = {
            id: 'MR-' + Date.now(),
            maTaiSan: selectedRecord.maTaiSan,
            tenTaiSan: selectedRecord.tenTaiSan,
            branch: MANAGER_BRANCH,
            room: editRoom,
            soLuong: qty,
            occupant: '--',
            condition: editCondition,
            lastUpdated: new Date().toLocaleDateString('vi-VN'),
            notes: editNotes,
            assignedTo: editAssignedTo,
            bed: editAssignedTo === 'bed' ? editBed : undefined
         };
         saveRecords([...records, newRecord]);
      } else {
         const maxAllowed = selectedRecord.soLuong + unallocatedAmount;
         if (qty > maxAllowed) {
            alert(`Số lượng tối đa có thể cập nhật là ${maxAllowed}`);
            return;
         }
         saveRecords(records.map(r => r.id === selectedRecord.id
            ? { ...r, room: editRoom, soLuong: qty, condition: editCondition, notes: editNotes, assignedTo: editAssignedTo, bed: editAssignedTo === 'bed' ? editBed : undefined, lastUpdated: new Date().toLocaleDateString('vi-VN') }
            : r
         ));
      }
      closeModal();
   };

   return (
      <div className="p-8 h-full max-w-7xl mx-auto">

         {/* ── Header ─────────────────────────────────────────────────────── */}
         <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1">Quản lý tài sản</h1>
            <p className="text-sm text-[#666666]">
               Xem và cập nhật tình trạng tài sản tại <strong className="text-[#8C4A3A]">{MANAGER_BRANCH}</strong>.
               Việc thêm hoặc xóa tài sản do Admin quản lý.
            </p>
         </div>

         {/* ── Filter bar ─────────────────────────────────────────────────── */}
         <div className="bg-white p-3.5 rounded-xl shadow-sm border border-[#EAD3CC]/50 mb-4 flex flex-wrap gap-3 items-center">
            <div className="flex-1 min-w-[240px] relative">
               <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
               <input type="text" placeholder="Tìm theo tên, mã tài sản, phòng..." value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#B7705F]" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
               <Filter className="w-4 h-4 text-[#999]" />
               <select value={filterRoom} onChange={e => setFilterRoom(e.target.value)}
                  className="border border-gray-200 rounded-lg text-sm px-3 py-2 bg-white focus:outline-none focus:border-[#B7705F]">
                  {roomOptions.map(r => <option key={r} value={r}>{r === 'Tất cả' ? 'Tất cả phòng' : r}</option>)}
               </select>
               <select value={filterCondition} onChange={e => setFilterCondition(e.target.value)}
                  className="border border-gray-200 rounded-lg text-sm px-3 py-2 bg-white focus:outline-none focus:border-[#B7705F]">
                  <option value="Tất cả">Tất cả trạng thái</option>
                  <option value="Tốt">Tốt</option>
                  <option value="Hư hỏng nhẹ">Hư hỏng nhẹ</option>
                  <option value="Cần thay thế">Cần thay thế</option>
                  <option value="Đã thanh lý">Đã thanh lý</option>
               </select>
            </div>
         </div>

         {/* ── Table ──────────────────────────────────────────────────────── */}
         <div className="bg-white rounded-xl shadow-sm border border-[#EAD3CC]/50 overflow-hidden">
            <table className="w-full text-left text-sm">
               <thead className="bg-[#FAF5F3] text-[#666666]">
                  <tr>
                     <th className="px-5 py-3.5 font-semibold text-xs">Mã TS</th>
                     <th className="px-5 py-3.5 font-semibold text-xs">Tên tài sản</th>
                     <th className="px-5 py-3.5 font-semibold text-xs">Phòng / Giường</th>
                     <th className="px-5 py-3.5 font-semibold text-xs">Phân bổ</th>
                     <th className="px-5 py-3.5 font-semibold text-xs text-center">Số lượng</th>
                     <th className="px-5 py-3.5 font-semibold text-xs">Tình trạng</th>
                     <th className="px-5 py-3.5 font-semibold text-xs text-right">Thao tác</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {filtered.length === 0 ? (
                     <tr>
                        <td colSpan={5} className="text-center py-12 text-gray-400 text-sm">
                           Không tìm thấy tài sản phù hợp.
                        </td>
                     </tr>
                  ) : filtered.map(item => (
                     <tr key={item.id} className="hover:bg-[#FAF5F3]/40 transition-colors">
                        <td className="px-5 py-3 font-mono text-xs font-bold text-[#B7705F]">{item.maTaiSan}</td>
                        <td className="px-5 py-3">
                           <p className="font-semibold text-gray-900 text-sm">{item.tenTaiSan}</p>
                        </td>
                        <td className="px-5 py-3 text-sm text-[#555] font-medium">
                           {item.room}
                           {item.assignedTo === 'bed' && item.bed && (
                              <span className="block text-xs text-[#8C4A3A] mt-0.5">{item.bed}</span>
                           )}
                        </td>
                        <td className="px-5 py-3">
                           <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.assignedTo === 'room' ? 'bg-gray-100 text-gray-700 border border-gray-200' : 'bg-[#FAF5F3] text-[#8C4A3A] border border-[#EAD3CC]'}`}>
                              {item.assignedTo === 'room' ? 'Dùng chung' : 'Riêng giường'}
                           </span>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-900 font-bold text-center">{item.soLuong}</td>
                        <td className="px-5 py-3">
                           <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${conditionCls(item.condition)}`}>
                              {item.condition}
                           </span>
                        </td>
                        <td className="px-5 py-3">
                           <div className="flex items-center justify-end gap-0.5">
                              <button onClick={() => handleOpenView(item)} title="Chi tiết"
                                 className="p-1.5 text-[#8C4A3A] hover:bg-[#EAD3CC]/40 rounded-lg transition-colors">
                                 <Eye className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleOpenEdit(item)} title="Chỉnh sửa"
                                 className="p-1.5 text-[#555] hover:bg-gray-100 rounded-lg transition-colors">
                                 <PenSquare className="w-4 h-4" />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {/* ── Modal: View ────────────────────────────────────────────────── */}
         {modalMode === 'view' && selectedRecord && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
               <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                  <div className="bg-[#FAF5F3] px-6 py-4 border-b border-[#EAD3CC]/50 flex justify-between items-center">
                     <div>
                        <h2 className="text-lg font-bold text-[#8C4A3A]">Chi tiết tài sản</h2>
                        <p className="text-xs text-[#666] mt-0.5">Mã: {selectedRecord.maTaiSan}</p>
                     </div>
                     <button onClick={closeModal} className="text-gray-400 hover:text-[#B7705F] text-2xl leading-none">&times;</button>
                  </div>
                  <div className="p-6 space-y-4">
                     <div>
                        <span className="block text-xs font-bold text-[#666] mb-1">Tên tài sản</span>
                        <p className="text-base font-bold text-gray-900">{selectedRecord.tenTaiSan}</p>
                     </div>
                     <div className="grid grid-cols-3 gap-4">
                        <div>
                           <span className="block text-xs font-bold text-[#666] mb-1">Phòng</span>
                           <p className="text-sm font-semibold text-gray-800">{selectedRecord.room}</p>
                        </div>
                        {(() => {
                           const unallocated = (adminTotals[selectedRecord.maTaiSan] || 0) - (managerTotals[selectedRecord.maTaiSan] || 0);
                           return (
                              <div>
                                 <span className="block text-xs font-bold text-[#666] mb-1">Số lượng</span>
                                 <p className="text-sm font-semibold text-gray-800">
                                    {selectedRecord.soLuong}
                                    <span className="text-[#8C4A3A] font-normal ml-1">(Số lượng tồn: {unallocated})</span>
                                 </p>
                              </div>
                           );
                        })()}
                        <div>
                           <span className="block text-xs font-bold text-[#666] mb-1">Cập nhật cuối</span>
                           <p className="text-sm font-semibold text-gray-800">{selectedRecord.lastUpdated}</p>
                        </div>
                     </div>
                     <div>
                        <span className="block text-xs font-bold text-[#666] mb-1">Tình trạng</span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${conditionCls(selectedRecord.condition)}`}>
                           {selectedRecord.condition}
                        </span>
                     </div>
                     {selectedRecord.notes && (
                        <div>
                           <span className="block text-xs font-bold text-[#666] mb-1">Ghi chú</span>
                           <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs text-gray-700 leading-relaxed">{selectedRecord.notes}</div>
                        </div>
                     )}
                  </div>
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                     <button onClick={() => handleOpenEdit(selectedRecord)}
                        className="px-3.5 py-2 text-[#666] hover:bg-gray-100 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5">
                        <PenSquare className="w-3.5 h-3.5" /> Chỉnh sửa
                     </button>
                     <button onClick={closeModal}
                        className="px-4 py-2 bg-[#FAF5F3] hover:bg-[#EAD3CC]/50 text-[#8C4A3A] rounded-lg text-xs font-semibold border border-[#EAD3CC] transition-colors">
                        Đóng
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* ── Modal: Edit ─────────────────────────────────────────────────── */}
         {modalMode === 'edit' && selectedRecord && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
               <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                  <div className="bg-[#FAF5F3] px-6 py-4 border-b border-[#EAD3CC]/50 flex justify-between items-center">
                     <div>
                        <h2 className="text-xl font-bold text-[#8C4A3A]">
                           {(selectedRecord as any).isVirtual ? 'Phân bổ tài sản vào phòng' : 'Cập nhật tài sản'}
                        </h2>
                        <p className="text-xs text-[#666] mt-0.5">{selectedRecord.tenTaiSan} · {selectedRecord.maTaiSan}</p>
                     </div>
                     <button onClick={closeModal} className="text-gray-400 hover:text-[#B7705F] text-2xl leading-none">&times;</button>
                  </div>

                  <div className="p-6 overflow-y-auto space-y-5 flex-1">
                     {/* Thông tin read-only */}
                     <div className="grid grid-cols-2 gap-3">
                        <div>
                           <label className="block text-xs font-bold text-[#666] mb-1">Mã tài sản</label>
                           <input value={selectedRecord.maTaiSan} readOnly
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs font-mono text-gray-500" />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-[#666] mb-1">Phòng</label>
                           <div className="relative">
                              <button
                                 type="button"
                                 onClick={() => setIsRoomDropdownOpen(!isRoomDropdownOpen)}
                                 className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm flex justify-between items-center focus:outline-none focus:border-[#B7705F]"
                              >
                                 <span className="text-gray-800 font-medium">{editRoom || 'Chọn phòng...'}</span>
                                 <ChevronDown className="w-4 h-4 text-gray-500" />
                              </button>

                              {isRoomDropdownOpen && (
                                 <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden flex flex-col">
                                    <div className="p-2 border-b border-gray-100 bg-gray-50">
                                       <input
                                          type="text"
                                          placeholder="Tìm kiếm phòng..."
                                          value={roomSearchQuery}
                                          onChange={e => setRoomSearchQuery(e.target.value)}
                                          onClick={e => e.stopPropagation()}
                                          className="w-full bg-white border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:border-[#B7705F]"
                                          autoFocus
                                       />
                                    </div>
                                    <div className="max-h-48 overflow-y-auto bg-white">
                                       {roomOptions
                                          .filter(r => r !== 'Tất cả' && r !== 'Chưa phân bổ')
                                          .filter((r: any) => r.toLowerCase().includes(roomSearchQuery.toLowerCase()))
                                          .map(r => (
                                             <button
                                                key={r}
                                                type="button"
                                                onClick={() => { setEditRoom(r); setIsRoomDropdownOpen(false); setRoomSearchQuery(''); }}
                                                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${editRoom === r ? 'bg-[#FAF5F3] text-[#8C4A3A] font-medium' : 'text-gray-700'}`}
                                             >
                                                {r}
                                             </button>
                                          ))
                                       }
                                       {roomSearchQuery && !roomOptions.includes(roomSearchQuery) && (
                                          <button
                                             type="button"
                                             onClick={() => { setEditRoom(roomSearchQuery); setIsRoomDropdownOpen(false); setRoomSearchQuery(''); }}
                                             className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-[#B7705F] font-medium"
                                          >
                                             + Thêm phòng mới "{roomSearchQuery}"
                                          </button>
                                       )}
                                    </div>
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>

                     {/* Số lượng */}
                     {(() => {
                        const admin = adminTotals[selectedRecord.maTaiSan] || 0;
                        const manager = managerTotals[selectedRecord.maTaiSan] || 0;
                        const unallocated = admin - manager;
                        const maxAllowed = (selectedRecord as any).isVirtual ? unallocated : unallocated + selectedRecord.soLuong;
                        return (
                           <div>
                              <label className="block text-xs font-bold text-[#666] mb-1.5">
                                 Số lượng phân bổ <span className="ml-1 text-[#8C4A3A] font-normal">(Số lượng tồn: {unallocated})</span>
                              </label>
                              <input type="number" min="0" max={maxAllowed} value={editSoLuong} onChange={e => setEditSoLuong(e.target.value ? parseInt(e.target.value) : '')}
                                 className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#B7705F]" />
                           </div>
                        );
                     })()}

                     {/* Loại phân bổ (tùy chỉnh thủ công) */}
                     <div>
                        <label className="block text-xs font-bold text-[#666] mb-1.5">Loại phân bổ</label>
                        <select value={editAssignedTo} onChange={e => { setEditAssignedTo(e.target.value as 'room'|'bed'); if (e.target.value === 'room') setEditBed(''); }}
                           className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#B7705F]">
                           <option value="room">Dùng chung phòng</option>
                           <option value="bed">Gắn với giường cụ thể</option>
                        </select>
                     </div>

                     {/* Chọn giường (chỉ khi assignedTo = 'bed') */}
                     {editAssignedTo === 'bed' && (
                        <div>
                           <label className="block text-xs font-bold text-[#666] mb-1.5">Giường cụ thể <span className="text-[#B7705F]">*</span></label>
                           <select value={editBed} onChange={e => setEditBed(e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#B7705F]">
                              <option value="">Chọn giường...</option>
                              {(ROOM_BEDS[editRoom] || []).map(b => (
                                 <option key={b} value={b}>{b}</option>
                              ))}
                           </select>
                        </div>
                     )}

                     {/* Tình trạng */}
                     <div>
                        <label className="block text-xs font-bold text-[#666] mb-1.5">Tình trạng tài sản</label>
                        <select value={editCondition} onChange={e => setEditCondition(e.target.value)}
                           className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#B7705F]">
                           <option>Tốt</option>
                           <option>Hư hỏng nhẹ</option>
                           <option>Cần thay thế</option>
                           <option>Đã thanh lý</option>
                        </select>
                     </div>

                     {/* Ghi chú */}
                     <div>
                        <label className="block text-xs font-bold text-[#666] mb-1.5">Ghi chú bảo trì</label>
                        <textarea rows={3} value={editNotes} onChange={e => setEditNotes(e.target.value)}
                           className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#B7705F] resize-none"
                           placeholder="Nhập tình trạng bảo trì, hỏng hóc hoặc lý do thay đổi..." />
                     </div>
                  </div>

                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end items-center gap-2 mt-auto">
                     <button type="button" onClick={closeModal}
                        className="px-5 py-2.5 text-[#666] font-medium hover:bg-gray-200 rounded-lg text-sm transition-colors">Đóng</button>
                     <button type="button" onClick={handleSaveEdit}
                        className="px-5 py-2.5 bg-[#B7705F] text-white font-medium rounded-lg text-sm hover:bg-[#a06050] transition-colors flex items-center gap-2">
                        <Save className="w-4 h-4" /> Lưu thay đổi
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}
