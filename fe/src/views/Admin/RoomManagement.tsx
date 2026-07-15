import React, { useState } from 'react';
import { Search, Bell, MessageSquare, Plus, Edit2, Trash2, ArrowLeft, Eye } from 'lucide-react';

const INITIAL_ROOMS = [
   { id: 'P.101', name: 'Phòng 101', type: 'Phòng 2 người', floor: '1', currentCount: 2, maxCount: 2, status: 'Đã thuê', branch: 'Chi nhánh 1' },
   { id: 'P.102', name: 'Phòng 102', type: 'Phòng 4 người', floor: '1', currentCount: 2, maxCount: 4, status: 'Đã thuê', branch: 'Chi nhánh 1' },
   { id: 'P.103', name: 'Phòng 103', type: 'Phòng 2 người', floor: '1', currentCount: 1, maxCount: 2, status: 'Đã thuê', branch: 'Chi nhánh 1' },
   { id: 'P.301', name: 'Phòng 301', type: 'Phòng 4 người', floor: '3', currentCount: 4, maxCount: 4, status: 'Đã thuê', branch: 'Chi nhánh 1' },
   { id: 'P.302', name: 'Phòng 302', type: 'Phòng 2 người', floor: '3', currentCount: 0, maxCount: 2, status: 'Trống', branch: 'Chi nhánh 1' },
];

export default function RoomManagement() {
   const [rooms, setRooms] = useState<any[]>([]);
   const [bedsData, setBedsData] = useState<Record<string, { bedId: string, price: string, status: string, note: string }[]>>({});
   const [selectedRoom, setSelectedRoom] = useState<any>(null);

   React.useEffect(() => {
      fetch('http://localhost:8080/api/v1/rooms/status')
         .then(res => res.json())
         .then(data => {
            if (data.status === 'success') {
               const mappedRooms: any[] = [];
               const mappedBeds: Record<string, any> = {};
               
               data.data.forEach((r: any) => {
                  const beds = r.beds || [];
                  const rentedCount = beds.filter((b: any) => b.status && b.status !== 'Trống').length;
                  
                  mappedRooms.push({
                     id: r.id,
                     name: r.name,
                     type: r.type,
                     floor: r.floor,
                     currentCount: rentedCount,
                     maxCount: r.capacity,
                     status: r.status || 'TRỐNG',
                     branch: r.fullBranchName || r.branch
                  });

                  mappedBeds[r.id] = beds.map((b: any) => ({
                     bedId: b.bedId.toString(),
                     price: new Intl.NumberFormat('vi-VN').format(b.price || 1500000),
                     status: b.status || 'Trống',
                     note: b.note || ''
                  }));
               });

               setRooms(mappedRooms);
               setBedsData(mappedBeds);
            }
         })
         .catch(err => console.error(err));
   }, []);

   const [showAddBed, setShowAddBed] = useState(false);
   const [isEditBed, setIsEditBed] = useState(false);
   const [showDeleteBedConfirm, setShowDeleteBedConfirm] = useState<any>(null);
   const [deleteBedError, setDeleteBedError] = useState('');
   const [bedFormData, setBedFormData] = useState({ bedId: '', price: '', status: 'Trống', note: '' });

   const handleOpenAddBed = () => {
      if (!selectedRoom) return;
      const roomBeds = bedsData[selectedRoom.id] || [];
      if (roomBeds.length >= selectedRoom.maxCount) {
         setDeleteBedError(`${selectedRoom.name} đã đạt số lượng tối đa (${selectedRoom.maxCount} giường).`);
         return;
      }
      setBedFormData({
         bedId: (roomBeds.length + 1).toString().padStart(2, '0'),
         price: '1.500.000',
         status: 'Trống',
         note: 'Giường ' + (roomBeds.length % 2 === 0 ? 'dưới' : 'trên')
      });
      setErrorMsg('');
      setIsEditBed(false);
      setShowAddBed(true);
   };

   const handleOpenEditBed = (bed: any) => {
      setBedFormData(bed);
      setErrorMsg('');
      setIsEditBed(true);
      setShowAddBed(true);
   };

   const handleDeleteBedClick = (bed: any) => {
      if (bed.status !== 'Trống') {
         setDeleteBedError(`Giường ${bed.bedId} đang có người ở. Cần đảm bảo giường trống mới được phép xóa.`);
         return;
      }
      setShowDeleteBedConfirm(bed);
   };

   const handleConfirmDeleteBed = () => {
      if (selectedRoom && showDeleteBedConfirm) {
         const updatedBeds = (bedsData[selectedRoom.id] || []).filter((b: any) => b.bedId !== showDeleteBedConfirm.bedId);
         setBedsData({ ...bedsData, [selectedRoom.id]: updatedBeds });

         const newRoomList = rooms.map(r => r.id === selectedRoom.id ? { ...r, roomBeds: updatedBeds.length } : r);
         setRooms(newRoomList);

         setShowDeleteBedConfirm(null);
      }
   };

   const handleCreateBed = () => {
      if (!selectedRoom) return;
      const roomBeds = bedsData[selectedRoom.id] || [];
      if (roomBeds.some(b => b.bedId === bedFormData.bedId)) {
         setErrorMsg('Mã giường đã tồn tại.');
         return;
      }
      setBedsData({
         ...bedsData,
         [selectedRoom.id]: [...roomBeds, bedFormData]
      });
      setShowAddBed(false);
   };
   const [showAdd, setShowAdd] = useState(false);
   const [showEdit, setShowEdit] = useState<any>(null);
   const [filterType, setFilterType] = useState('Tất cả loại');
   const [searchTerm, setSearchTerm] = useState('');
   const [errorMsg, setErrorMsg] = useState('');

   const [formData, setFormData] = useState({ id: '', name: '', type: 'Phòng 4 người', floor: '1', maxCount: 4, status: 'TRỐNG', branch: 'Homestay Central Park' });

   const handleOpenAdd = () => {
      const roomIds = rooms.map(r => parseInt(r.id.replace(/\D/g, ''))).filter(n => !isNaN(n));
      const maxId = roomIds.length > 0 ? Math.max(...roomIds) : 0;
      const nextId = maxId + 1;
      const nextRoomId = `PH${String(nextId).padStart(4, '0')}`;
      setFormData({ id: nextRoomId, name: `Phòng ${nextId}`, type: 'Phòng 4 người', floor: '1', maxCount: 4, status: 'TRỐNG', branch: 'Chi nhánh 1' });
      setErrorMsg('');
      setShowAdd(true);
   };

   const handleCreate = () => {
      if (rooms.some(r => r.id === formData.id || r.name === formData.name)) {
         setErrorMsg('Mã phòng hoặc Tên phòng đã tồn tại.');
         return;
      }
      const newRoom = {
         ...formData,
         currentCount: 0
      };
      setRooms([newRoom, ...rooms]);
      setShowAdd(false);
   };

   const handleOpenEdit = (room: any) => {
      setFormData({ id: room.id, name: room.name, type: room.type, floor: room.floor, maxCount: room.maxCount, status: room.status || 'TRỐNG', branch: room.branch || 'Homestay Central Park' });
      setErrorMsg('');
      setShowEdit(room);
   };

   const handleUpdate = () => {
      if (rooms.some(r => (r.id === formData.id || r.name === formData.name) && r.id !== showEdit.id)) {
         setErrorMsg('Mã phòng hoặc Tên phòng đã tồn tại.');
         return;
      }
      setRooms(rooms.map(r => r.id === showEdit.id ? { ...r, ...formData } : r));
      setShowEdit(null);
   };

   const [showDeleteConfirm, setShowDeleteConfirm] = useState<any>(null);
   const [deleteError, setDeleteError] = useState('');

   const handleDeleteClick = (room: any) => {
      if (room.currentCount > 0) {
         setDeleteError(`${room.name} đang có người ở. Cần đảm bảo dữ liệu phòng trống mới được phép xóa.`);
         return;
      }
      setShowDeleteConfirm(room);
   };

   const handleConfirmDelete = () => {
      if (showDeleteConfirm) {
         setRooms(rooms.filter(r => r.id !== showDeleteConfirm.id));
         setShowDeleteConfirm(null);
      }
   };

   if (selectedRoom) {
      const beds = bedsData[selectedRoom.id] || [];

      return (
         <div className="p-8 h-full">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
               <div>
                  <button onClick={() => setSelectedRoom(null)} className="text-gray-500 hover:text-[#B7705F] font-medium text-sm mb-2 flex items-center">
                     <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại
                  </button>
                  <h1 className="text-3xl font-bold text-[#8C4A3A]">Chi tiết phòng & giường - {selectedRoom.name}</h1>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* Room Info */}
               <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3 mb-4">Thông tin phòng</h2>
                  <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Mã phòng</label>
                        <div className="font-semibold">{selectedRoom.id}</div>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Tên phòng</label>
                        <div className="font-semibold">{selectedRoom.name}</div>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Loại phòng</label>
                        <div className="font-semibold">{selectedRoom.type}</div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-500 mb-1">Tầng</label>
                           <div className="font-semibold">{selectedRoom.floor}</div>
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-500 mb-1">Sức chứa</label>
                           <div className="font-semibold">{selectedRoom.maxCount}</div>
                        </div>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Chi nhánh</label>
                        <div className="font-semibold">{selectedRoom.branch || 'Homestay Central Park'}</div>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Trạng thái</label>
                        <div className="font-semibold text-[#8C4A3A]">{selectedRoom.status}</div>
                     </div>
                  </div>
               </div>

               {/* Beds List */}
               <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center p-6 border-b border-gray-100">
                     <h2 className="text-lg font-semibold text-gray-900">Danh sách giường ({beds.length})</h2>
                     <button onClick={handleOpenAddBed} className="px-4 py-2 bg-[#8C4A3A] text-white rounded text-sm font-medium">Thêm Giường</button>
                  </div>

                  <table className="w-full text-left text-sm">
                     <thead className="bg-[#FAF5F3] text-gray-600">
                        <tr>
                           <th className="px-6 py-4 font-medium">Số thứ tự</th>
                           <th className="px-6 py-4 font-medium">Giá giường</th>
                           <th className="px-6 py-4 font-medium">Trạng thái</th>
                           <th className="px-6 py-4 font-medium">Ghi chú</th>
                           <th className="px-6 py-4 font-medium text-right">Thao tác</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                        {beds.length > 0 ? beds.map((bed, idx) => (
                           <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-6 py-4 font-semibold text-gray-900">Giường {bed.bedId}</td>
                              <td className="px-6 py-4 text-[#8C4A3A] font-medium">{bed.price}</td>
                              <td className="px-6 py-4">
                                 <span className={`px-2 py-1 rounded text-xs font-semibold ${bed.status === 'Trống' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {bed.status}
                                 </span>
                              </td>
                              <td className="px-6 py-4 text-gray-500">{bed.note}</td>
                              <td className="px-6 py-4 text-right">
                                 <button onClick={() => handleOpenEditBed(bed)} className="p-2 text-gray-500 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50 mr-2" title="Chỉnh sửa">
                                    <Edit2 className="w-5 h-5" />
                                 </button>
                                 <button onClick={() => handleDeleteBedClick(bed)} className="p-2 text-red-500 hover:text-red-700 transition-colors rounded-lg hover:bg-red-50" title="Xóa">
                                    <Trash2 className="w-5 h-5" />
                                 </button>
                              </td>
                           </tr>
                        )) : (
                           <tr>
                              <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Chưa có dữ liệu giường cho phòng này.</td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
            {showAddBed && (
               <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                  <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden mx-4">
                     <div className="bg-[#FAF5F3] px-6 py-4 border-b border-[#EAD3CC]/50 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-[#222222]">Thêm giường mới</h2>
                        <button onClick={() => setShowAddBed(false)} className="text-gray-400 hover:text-[#B7705F] text-2xl leading-none">&times;</button>
                     </div>
                     <div className="p-6">
                        {errorMsg && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium">{errorMsg}</div>}
                        <div className="space-y-4">
                           <div>
                              <label className="block text-sm font-semibold text-[#666666] mb-2">Mã giường (Số thứ tự)</label>
                              <input type="text" value={bedFormData.bedId} disabled className="w-full bg-gray-100 border border-gray-200 rounded-lg p-3 text-gray-500 cursor-not-allowed" />
                           </div>
                           <div>
                              <label className="block text-sm font-semibold text-[#666666] mb-2">Giá giường (VNĐ)</label>
                              <input type="text" value={bedFormData.price} onChange={e => setBedFormData({ ...bedFormData, price: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:bg-white focus:border-[#B7705F]" />
                           </div>
                           <div>
                              <label className="block text-sm font-semibold text-[#666666] mb-2">Trạng thái</label>
                              <select value={bedFormData.status} onChange={e => setBedFormData({ ...bedFormData, status: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:bg-white focus:border-[#B7705F]">
                                 <option value="Trống">Trống</option>
                                 <option value="Đã thuê">Đã thuê</option>
                              </select>
                           </div>
                           <div>
                              <label className="block text-sm font-semibold text-[#666666] mb-2">Ghi chú</label>
                              <input type="text" value={bedFormData.note} onChange={e => setBedFormData({ ...bedFormData, note: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:bg-white focus:border-[#B7705F]" />
                           </div>
                        </div>
                     </div>
                     <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
                        <button onClick={() => setShowAddBed(false)} className="px-5 py-2.5 text-[#666666] font-medium hover:bg-gray-200 rounded-lg transition-colors">Hủy</button>
                        <button onClick={handleCreateBed} className="px-5 py-2.5 bg-[#B7705F] text-white font-medium rounded-lg shadow-sm hover:bg-[#a06050] transition-colors">Lưu thông tin</button>
                     </div>
                  </div>
               </div>
            )}
            {showDeleteBedConfirm && (
               <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                  <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden mx-4">
                     <div className="bg-[#FAF5F3] px-6 py-4 border-b border-[#EAD3CC]/50">
                        <h2 className="text-xl font-bold text-[#222222]">Xác nhận xóa</h2>
                     </div>
                     <div className="p-6">
                        <p className="text-[#666666]">Bạn có chắc chắn muốn xóa giường <span className="font-bold text-[#222222]">{showDeleteBedConfirm.bedId}</span> không?</p>
                     </div>
                     <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
                        <button onClick={() => setShowDeleteBedConfirm(null)} className="px-5 py-2.5 text-[#666666] font-medium hover:bg-gray-200 rounded-lg transition-colors">Hủy</button>
                        <button onClick={handleConfirmDeleteBed} className="px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg shadow-sm hover:bg-red-700 transition-colors">Xác nhận</button>
                     </div>
                  </div>
               </div>
            )}
            {deleteBedError && (
               <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                  <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden mx-4">
                     <div className="bg-red-50 px-6 py-4 border-b border-red-100">
                        <h2 className="text-xl font-bold text-red-700">Cảnh báo</h2>
                     </div>
                     <div className="p-6">
                        <p className="text-[#666666]">{deleteBedError}</p>
                     </div>
                     <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                        <button onClick={() => setDeleteBedError('')} className="px-5 py-2.5 text-[#666666] font-medium hover:bg-gray-200 rounded-lg transition-colors bg-gray-100">Hủy</button>
                     </div>
                  </div>
               </div>
            )}
         </div>
      );
   }

   const filteredRooms = rooms.filter(r =>
      (filterType === 'Tất cả loại' || r.type === filterType) &&
      (r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.toLowerCase().includes(searchTerm.toLowerCase()))
   );

   return (
      <div className="p-8 h-full max-w-7xl mx-auto">
         <div className="flex justify-between items-end mb-8">
            <div>
               <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1">Quản lý phòng & giường</h1>
               <p className="text-sm text-[#666666]">Theo dõi và cập nhật thông tin hệ thống phòng lưu trú</p>
            </div>
            <button onClick={handleOpenAdd} className="px-5 py-2.5 bg-[#B7705F] text-white rounded-lg text-sm font-bold shadow-sm hover:bg-[#a06050] transition-colors flex items-center">
               <Plus className="w-4 h-4 mr-2" /> Thêm phòng mới
            </button>
         </div>

         <div className="bg-white p-4 rounded-xl shadow-sm border border-[#EAD3CC]/50 mb-6 flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[300px] relative">
               <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
               <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm phòng, mã..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#B7705F]"
               />
            </div>
            <div className="w-[200px]">
               <select className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#B7705F]">
                  <option>Tất cả chi nhánh</option>
               </select>
            </div>
            <div className="w-[200px]">
               <select
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#B7705F]"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
               >
                  <option value="Tất cả loại">Tất cả loại phòng</option>
                  <option value="Phòng 2 người">Phòng 2 người</option>
                  <option value="Phòng 4 người">Phòng 4 người</option>
                  <option value="Phòng 8 người">Phòng 8 người</option>
               </select>
            </div>
            <div className="w-[200px]">
               <select className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#B7705F]">
                  <option>Tất cả trạng thái</option>
               </select>
            </div>
         </div>

         {showAdd && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
               <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden mx-4">
                  <div className="bg-[#FAF5F3] px-6 py-4 border-b border-[#EAD3CC]/50 flex justify-between items-center">
                     <h2 className="text-xl font-bold text-[#222222]">Thêm phòng mới</h2>
                     <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-[#B7705F] text-2xl leading-none">&times;</button>
                  </div>
                  <div className="p-6">
                     {errorMsg && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium">{errorMsg}</div>}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                           <label className="block text-sm font-semibold text-[#666666] mb-2">Mã phòng</label>
                           <input type="text" value={formData.id} disabled className="w-full bg-gray-100 border border-gray-200 rounded-lg p-3 text-gray-500 cursor-not-allowed" />
                        </div>
                        <div>
                           <label className="block text-sm font-semibold text-[#666666] mb-2">Tên phòng</label>
                           <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:bg-white focus:border-[#B7705F]" placeholder="Nhập tên phòng..." />
                        </div>
                        <div>
                           <label className="block text-sm font-semibold text-[#666666] mb-2">Tầng</label>
                           <input type="number" value={formData.floor} onChange={e => setFormData({ ...formData, floor: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:bg-white focus:border-[#B7705F]" />
                        </div>
                        <div>
                           <label className="block text-sm font-semibold text-[#666666] mb-2">Sức chứa tối đa (người)</label>
                           <input type="number" value={formData.maxCount} onChange={e => setFormData({ ...formData, maxCount: parseInt(e.target.value) || 0 })} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:bg-white focus:border-[#B7705F]" />
                        </div>
                        <div className="md:col-span-2">
                           <label className="block text-sm font-semibold text-[#666666] mb-2">Loại phòng</label>
                           <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:bg-white focus:border-[#B7705F]">
                              <option>Phòng 2 người</option>
                              <option>Phòng 4 người</option>
                              <option>Phòng 8 người</option>
                           </select>
                        </div>
                        <div className="md:col-span-1">
                           <label className="block text-sm font-semibold text-[#666666] mb-2">Chi nhánh</label>
                           <select value={formData.branch} onChange={e => setFormData({ ...formData, branch: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:bg-white focus:border-[#B7705F]">
                              <option value="Homestay Central Park">Homestay Central Park</option>
                              <option value="Sunrise Riverside">Sunrise Riverside</option>
                              <option value="The Landmark View">The Landmark View</option>
                           </select>
                        </div>
                        <div className="md:col-span-1">
                           <label className="block text-sm font-semibold text-[#666666] mb-2">Trạng thái phòng</label>
                           <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:bg-white focus:border-[#B7705F]">
                              <option value="TRỐNG">TRỐNG</option>
                              <option value="ĐANG Ở">ĐANG Ở</option>
                              <option value="BẢO TRÌ">BẢO TRÌ</option>
                           </select>
                        </div>
                     </div>
                  </div>
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
                     <button onClick={() => setShowAdd(false)} className="px-5 py-2.5 text-[#666666] font-medium hover:bg-gray-200 rounded-lg transition-colors">Hủy</button>
                     <button onClick={handleCreate} className="px-5 py-2.5 bg-[#B7705F] text-white font-medium rounded-lg shadow-sm hover:bg-[#a06050] transition-colors">Lưu thông tin</button>
                  </div>
               </div>
            </div>
         )}

         {showEdit && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
               <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden mx-4">
                  <div className="bg-[#FAF5F3] px-6 py-4 border-b border-[#EAD3CC]/50 flex justify-between items-center">
                     <h2 className="text-xl font-bold text-[#222222]">Cập nhật phòng</h2>
                     <button onClick={() => setShowEdit(null)} className="text-gray-400 hover:text-[#B7705F] text-2xl leading-none">&times;</button>
                  </div>
                  <div className="p-6">
                     {errorMsg && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium">{errorMsg}</div>}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                           <label className="block text-sm font-semibold text-[#666666] mb-2">Mã phòng</label>
                           <input type="text" value={formData.id} disabled className="w-full bg-gray-100 border border-gray-200 rounded-lg p-3 text-gray-500 cursor-not-allowed" />
                        </div>
                        <div>
                           <label className="block text-sm font-semibold text-[#666666] mb-2">Tên phòng</label>
                           <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:bg-white focus:border-[#B7705F]" placeholder="Nhập tên phòng..." />
                        </div>
                        <div>
                           <label className="block text-sm font-semibold text-[#666666] mb-2">Tầng</label>
                           <input type="number" value={formData.floor} onChange={e => setFormData({ ...formData, floor: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:bg-white focus:border-[#B7705F]" />
                        </div>
                        <div>
                           <label className="block text-sm font-semibold text-[#666666] mb-2">Sức chứa tối đa (người)</label>
                           <input type="number" value={formData.maxCount} onChange={e => setFormData({ ...formData, maxCount: parseInt(e.target.value) || 0 })} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:bg-white focus:border-[#B7705F]" />
                        </div>
                        <div className="md:col-span-2">
                           <label className="block text-sm font-semibold text-[#666666] mb-2">Loại phòng</label>
                           <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:bg-white focus:border-[#B7705F]">
                              <option>Phòng 2 người</option>
                              <option>Phòng 4 người</option>
                              <option>Phòng 8 người</option>
                           </select>
                        </div>
                        <div className="md:col-span-1">
                           <label className="block text-sm font-semibold text-[#666666] mb-2">Chi nhánh</label>
                           <select value={formData.branch} onChange={e => setFormData({ ...formData, branch: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:bg-white focus:border-[#B7705F]">
                              <option value="Homestay Central Park">Homestay Central Park</option>
                              <option value="Sunrise Riverside">Sunrise Riverside</option>
                              <option value="The Landmark View">The Landmark View</option>
                           </select>
                        </div>
                        <div className="md:col-span-1">
                           <label className="block text-sm font-semibold text-[#666666] mb-2">Trạng thái phòng</label>
                           <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:bg-white focus:border-[#B7705F]">
                              <option value="TRỐNG">TRỐNG</option>
                              <option value="ĐANG Ở">ĐANG Ở</option>
                              <option value="BẢO TRÌ">BẢO TRÌ</option>
                           </select>
                        </div>
                     </div>
                  </div>
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
                     <button onClick={() => setShowEdit(null)} className="px-5 py-2.5 text-[#666666] font-medium hover:bg-gray-200 rounded-lg transition-colors">Hủy</button>
                     <button onClick={handleUpdate} className="px-5 py-2.5 bg-[#B7705F] text-white font-medium rounded-lg shadow-sm hover:bg-[#a06050] transition-colors">Lưu cập nhật</button>
                  </div>
               </div>
            </div>
         )}

         {/* Table grid */}
         <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
               <thead className="bg-[#FAF5F3] text-gray-700 border-b border-gray-200 font-semibold">
                  <tr>
                     <th className="px-6 py-4">Mã<br />phòng</th>
                     <th className="px-6 py-4">Tên phòng</th>
                     <th className="px-6 py-4">Chi nhánh</th>
                     <th className="px-6 py-4">Loại phòng</th>
                     <th className="px-6 py-4">Tầng</th>
                     <th className="px-6 py-4 text-center">Sức<br />chứa</th>
                     <th className="px-6 py-4">Trạng<br />thái</th>
                     <th className="px-6 py-4 text-right">Thao tác</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {filteredRooms.map((r, i) => (
                     <tr key={i} className="hover:bg-gray-50/50">
                        <td className="px-6 py-5 text-gray-600">{r.id}</td>
                        <td className="px-6 py-5 font-medium text-gray-900">{r.name}</td>
                        <td className="px-6 py-5 text-gray-600">{r.branch || 'Homestay Central Park'}</td>
                        <td className="px-6 py-5 text-gray-600 whitespace-pre-wrap">{r.type.split(' ').join(' \n').replace(' \n', ' ')}</td>
                        <td className="px-6 py-5 text-gray-600">{r.floor}</td>
                        <td className="px-6 py-5 text-center font-medium">
                           {r.maxCount === 0 ? '-' : <><span className="text-[#8C4A3A] font-bold">{r.currentCount}</span> / {r.maxCount}</>}
                        </td>
                        <td className="px-6 py-5 text-xs font-bold">
                           <span className={`px-3 py-1 rounded-full whitespace-nowrap 
                          ${r.status === 'Đã thuê' ? 'bg-[#F2D7D0] text-[#8C4A3A]' :
                                 r.status === 'Trống' ? 'bg-[#E5D7D3] text-[#665D59]' :
                                    'bg-[#FCEAE8] text-[#D84C4C]'}`}>
                              {r.status}
                           </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                           <div className="flex items-center justify-end gap-1">
                              <button onClick={() => setSelectedRoom(r)} title="Chi tiết" className="p-1.5 text-[#8C4A3A] hover:bg-[#EAD3CC]/40 rounded-lg transition-colors">
                                 <Eye className="w-5 h-5" />
                              </button>
                              <button onClick={() => handleOpenEdit(r)} title="Chỉnh sửa" className="p-1.5 text-[#8C4A3A] hover:bg-[#EAD3CC]/40 rounded-lg transition-colors">
                                 <Edit2 className="w-5 h-5" />
                              </button>
                              <button onClick={() => handleDeleteClick(r)} title="Xóa" className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                 <Trash2 className="w-5 h-5" />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>

            {/* Pagination mockup */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
               <div>Hiển thị {filteredRooms.length > 0 ? 1 : 0} - {filteredRooms.length} trên tổng số {rooms.length} phòng</div>
               <div className="flex space-x-1">
                  <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-400 bg-white">&lt;</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-[#8C4A3A] text-white">1</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 bg-white">2</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 bg-white">3</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 bg-white">&gt;</button>
               </div>
            </div>
         </div>

         {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
               <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden mx-4">
                  <div className="bg-[#FAF5F3] px-6 py-4 border-b border-[#EAD3CC]/50">
                     <h2 className="text-xl font-bold text-[#222222]">Xác nhận xóa</h2>
                  </div>
                  <div className="p-6">
                     <p className="text-[#666666]">Bạn có chắc chắn muốn xóa phòng <span className="font-bold text-[#222222]">{showDeleteConfirm.name}</span> không?</p>
                  </div>
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
                     <button onClick={() => setShowDeleteConfirm(null)} className="px-5 py-2.5 text-[#666666] font-medium hover:bg-gray-200 rounded-lg transition-colors">Hủy</button>
                     <button onClick={handleConfirmDelete} className="px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg shadow-sm hover:bg-red-700 transition-colors">Xác nhận</button>
                  </div>
               </div>
            </div>
         )}

         {deleteError && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
               <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden mx-4">
                  <div className="bg-red-50 px-6 py-4 border-b border-red-100">
                     <h2 className="text-xl font-bold text-red-700">Cảnh báo</h2>
                  </div>
                  <div className="p-6">
                     <p className="text-[#666666]">{deleteError}</p>
                  </div>
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                     <button onClick={() => setDeleteError('')} className="px-5 py-2.5 text-[#666666] font-medium hover:bg-gray-200 rounded-lg transition-colors bg-gray-100">Hủy</button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}

