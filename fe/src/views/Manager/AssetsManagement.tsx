import React, { useState, useEffect } from 'react';
import { Search, PenSquare, ArrowLeft, Save, Plus, Trash2, AlertTriangle, CheckCircle, Clock, Send, Info, Eye } from 'lucide-react';

interface Asset {
  id: string;
  room: string;
  item: string;
  condition: string;
  lastUpdated: string;
  occupant: string;
  notes?: string;
  isPendingDeletion?: boolean;
  deletionReason?: string;
}

const DEFAULT_ASSETS: Asset[] = [
  { id: 'TS-102-01', room: 'P.102', item: 'Máy lạnh Daikin 1.5HP', condition: 'Tốt', lastUpdated: '15/10/2023', occupant: 'Trần Văn B', notes: 'Máy chạy êm, làm lạnh tốt.' },
  { id: 'TS-102-02', room: 'P.102', item: 'Tủ lạnh Aqua 90L', condition: 'Hư hỏng nhẹ', lastUpdated: '10/09/2023', occupant: 'Trần Văn B', notes: 'Bị rỉ nước nhẹ ở khay đá.' },
  { id: 'TS-201-01', room: 'P.201', item: 'Giường tầng gỗ', condition: 'Tốt', lastUpdated: '20/10/2023', occupant: 'Lê Thị C', notes: 'Khung chắc chắn, không mối mọt.' },
];

export default function AssetsManagement() {
  // State for assets with localStorage persistence
  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem('manager_assets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_ASSETS;
  });

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCondition, setFilterCondition] = useState('Tất cả');

  // Form states for adding new asset
  const [newItem, setNewItem] = useState('');
  const [newRoom, setNewRoom] = useState('P.101');
  const [newCondition, setNewCondition] = useState('Tốt');
  const [newNotes, setNewNotes] = useState('');

  // Form states for updating asset
  const [editRoom, setEditRoom] = useState('');
  const [editCondition, setEditCondition] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [showDeleteRequestForm, setShowDeleteRequestForm] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');

  // Save to localStorage when assets change
  useEffect(() => {
    localStorage.setItem('manager_assets', JSON.stringify(assets));
  }, [assets]);

  // Handle adding new asset
  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) {
      alert('Vui lòng nhập tên tài sản!');
      return;
    }

    const cleanRoomNum = newRoom.replace(/[^0-9]/g, '');
    const randomNum = Math.floor(10 + Math.random() * 90);
    const generatedId = `TS-${cleanRoomNum}-${randomNum}`;
    const today = new Date().toLocaleDateString('vi-VN');

    const newAsset: Asset = {
      id: generatedId,
      room: newRoom,
      item: newItem.trim(),
      condition: newCondition,
      lastUpdated: today,
      occupant: 'Chưa có',
      notes: newNotes.trim()
    };

    setAssets(prev => [newAsset, ...prev]);
    
    // Reset form
    setNewItem('');
    setNewRoom('P.101');
    setNewCondition('Tốt');
    setNewNotes('');
    setShowAddAsset(false);
    alert(`Đã thêm thành công tài sản mới với Mã: ${generatedId}`);
  };

  // Sync edit form states when an asset is selected
  const handleOpenEdit = (asset: Asset) => {
    setSelectedAsset(asset);
    setEditRoom(asset.room);
    setEditCondition(asset.condition);
    setEditNotes(asset.notes || '');
    setShowDeleteRequestForm(false);
    setDeleteReason('');
  };

  // Handle saving edits
  const handleSaveEdit = () => {
    if (!selectedAsset) return;

    setAssets(prev => prev.map(item => {
      if (item.id === selectedAsset.id) {
        return {
          ...item,
          room: editRoom,
          condition: editCondition,
          notes: editNotes,
          lastUpdated: new Date().toLocaleDateString('vi-VN')
        };
      }
      return item;
    }));

    setSelectedAsset(null);
    alert('Đã lưu cập nhật thông tin tài sản thành công!');
  };

  // Submit Deletion Request to Admin
  const handleSubmitDeleteRequest = () => {
    if (!selectedAsset) return;
    if (!deleteReason.trim()) {
      alert('Vui lòng nhập lý do xóa tài sản (ví dụ: dữ liệu nhập sai hoàn toàn)!');
      return;
    }

    setAssets(prev => prev.map(item => {
      if (item.id === selectedAsset.id) {
        return {
          ...item,
          isPendingDeletion: true,
          deletionReason: deleteReason,
          condition: 'Chờ duyệt xóa',
          lastUpdated: new Date().toLocaleDateString('vi-VN')
        };
      }
      return item;
    }));

    setSelectedAsset(null);
    alert(`Đã gửi yêu cầu xóa vĩnh viễn tài sản ${selectedAsset.id} do nhập sai thông tin lên Admin phê duyệt!`);
  };

  // Quick action: Set status to liquidated directly (Business liquidation)
  const handleMarkStatus = (status: 'Đã thanh lý') => {
    if (!selectedAsset) return;
    
    setAssets(prev => prev.map(item => {
      if (item.id === selectedAsset.id) {
        return {
          ...item,
          condition: status,
          isPendingDeletion: false, // Clear delete request since status is changed
          lastUpdated: new Date().toLocaleDateString('vi-VN')
        };
      }
      return item;
    }));

    setSelectedAsset(null);
    alert(`Đã cập nhật trạng thái tài sản thành "${status}" thành công! Dữ liệu lịch sử vẫn được bảo toàn.`);
  };

  // Filtered Assets list
  const filteredAssets = assets.filter(item => {
    const matchesSearch = 
      item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.room.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCondition = filterCondition === 'Tất cả' || item.condition === filterCondition;

    return matchesSearch && matchesCondition;
  });

  return (
    <div className="p-8 h-full max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex justify-between items-end mb-8">
         <div>
            <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1">Quản lý tài sản</h1>
            <p className="text-sm text-[#666666]">Xem danh sách, cập nhật tình trạng sử dụng hoặc lập biên bản thanh lý, hủy bỏ tài sản.</p>
         </div>
         <button onClick={() => setShowAddAsset(true)} className="px-4 py-2 bg-[#B7705F] text-white rounded-lg text-sm font-medium hover:bg-[#a06050] transition-colors flex items-center shadow-sm">
            <Plus className="w-4 h-4 mr-2" /> Thêm tài sản mới
         </button>
      </div>



      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-[#EAD3CC]/50 mb-6 flex flex-wrap gap-4 items-center">
         <div className="flex-1 min-w-[300px] relative">
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Tìm theo tên tài sản, mã tài sản hoặc phòng..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#B7705F]"
            />
         </div>
         <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-[#666666]">Tình trạng:</span>
            <select 
              value={filterCondition}
              onChange={(e) => setFilterCondition(e.target.value)}
              className="border border-gray-200 rounded-lg text-sm px-4 py-2 bg-white focus:outline-none focus:border-[#B7705F]"
            >
               <option value="Tất cả">Tất cả trạng thái</option>
               <option value="Tốt">Tốt</option>
               <option value="Hư hỏng nhẹ">Hư hỏng nhẹ</option>
               <option value="Cần thay thế">Cần thay thế</option>
               <option value="Đã thanh lý">Đã thanh lý</option>
               <option value="Chờ duyệt xóa">Chờ duyệt xóa</option>
            </select>
         </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#EAD3CC]/50 overflow-hidden">
         <table className="w-full text-left text-sm">
            <thead className="bg-[#FAF5F3] text-[#666666]">
               <tr>
                  <th className="px-6 py-4 font-medium">Mã Tài Sản</th>
                  <th className="px-6 py-4 font-medium">Tên Tài Sản</th>
                  <th className="px-6 py-4 font-medium">Phòng</th>
                  <th className="px-6 py-4 font-medium">Khách Đang Ở</th>
                  <th className="px-6 py-4 font-medium">Trạng thái</th>
                  <th className="px-6 py-4 font-medium text-right">Thao Tác</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
               {filteredAssets.length === 0 ? (
                 <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400">Không tìm thấy tài sản nào phù hợp.</td>
                 </tr>
               ) : (
                 filteredAssets.map((item, idx) => (
                   <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-[#B7705F]">{item.id}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                         {item.item}
                         {item.isPendingDeletion && (
                           <span className="ml-2 inline-flex items-center px-1.5 py-0.5 bg-red-50 text-red-700 text-[10px] font-semibold rounded border border-red-200">
                              Chờ Admin xóa
                           </span>
                         )}
                      </td>
                      <td className="px-6 py-4 text-[#666666] font-medium">{item.room}</td>
                      <td className="px-6 py-4 text-[#666666] text-xs">{item.occupant}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded text-xs font-semibold ${
                          item.condition === 'Tốt' ? 'bg-green-50 text-green-600' : 
                          item.condition === 'Hư hỏng nhẹ' ? 'bg-orange-50 text-orange-600' :
                          item.condition === 'Cần thay thế' ? 'bg-red-50 text-red-600' :
                          item.condition === 'Đã thanh lý' ? 'bg-gray-100 text-gray-700 border border-gray-200' :
                          'bg-purple-50 text-purple-700 border border-purple-200'
                        }`}>
                          {item.condition}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button 
                           onClick={() => handleOpenEdit(item)} 
                           className="px-3.5 py-1.5 text-xs font-semibold text-[#B7705F] bg-orange-50 hover:bg-[#F3E1DC] rounded-lg transition-colors inline-block"
                         >
                            Cập nhật
                         </button>
                      </td>
                   </tr>
                 ))
               )}
            </tbody>
         </table>
      </div>

      {/* Modal Add Asset */}
      {showAddAsset && (
         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <form onSubmit={handleAddAsset} className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
               <div className="bg-[#FAF5F3] px-6 py-4 border-b border-[#EAD3CC]/50 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-[#8C4A3A]">Thêm tài sản mới</h2>
                  <button type="button" onClick={() => setShowAddAsset(false)} className="text-gray-400 hover:text-[#B7705F] text-2xl leading-none">&times;</button>
               </div>
               <div className="p-6 space-y-4">
                  <div>
                     <label className="block text-sm font-semibold text-[#666666] mb-2">Tên tài sản</label>
                     <input 
                       type="text" 
                       value={newItem}
                       onChange={(e) => setNewItem(e.target.value)}
                       required
                       className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#B7705F]" 
                       placeholder="Ví dụ: Bình nóng lạnh Ariston 20L, Tivi LG 43inch..." 
                     />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-semibold text-[#666666] mb-2">Vị trí (Phòng)</label>
                        <select 
                          value={newRoom}
                          onChange={(e) => setNewRoom(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#B7705F]"
                        >
                           <option value="P.101">P.101</option>
                           <option value="P.102">P.102</option>
                           <option value="P.201">P.201</option>
                           <option value="P.202">P.202</option>
                           <option value="P.301">P.301</option>
                           <option value="P.302">P.302</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-sm font-semibold text-[#666666] mb-2">Tình trạng ban đầu</label>
                        <select 
                          value={newCondition}
                          onChange={(e) => setNewCondition(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#B7705F]"
                        >
                           <option value="Tốt">Tốt</option>
                           <option value="Hư hỏng nhẹ">Hư hỏng nhẹ</option>
                           <option value="Cần thay thế">Cần thay thế</option>
                        </select>
                     </div>
                  </div>
                  <div>
                     <label className="block text-sm font-semibold text-[#666666] mb-2">Mô tả chi tiết / Ghi chú</label>
                     <textarea 
                       rows={3} 
                       value={newNotes}
                       onChange={(e) => setNewNotes(e.target.value)}
                       className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#B7705F] resize-none" 
                       placeholder="Nhập thông số kỹ thuật, số serial hoặc thông tin bổ sung..."
                     />
                  </div>
               </div>
               <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
                  <button type="button" onClick={() => setShowAddAsset(false)} className="px-5 py-2.5 text-[#666666] font-medium hover:bg-gray-200 rounded-lg text-sm transition-colors">Hủy</button>
                  <button type="submit" className="px-5 py-2.5 bg-[#B7705F] text-white font-medium rounded-lg text-sm shadow-sm hover:bg-[#a06050] transition-colors">Thêm</button>
               </div>
            </form>
         </div>
      )}

      {/* Modal Update Asset & Deletion Request Flow */}
      {selectedAsset && (
         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
               <div className="bg-[#FAF5F3] px-6 py-4 border-b border-[#EAD3CC]/50 flex justify-between items-center">
                  <div>
                      <h2 className="text-xl font-bold text-[#8C4A3A]">Cập nhật thông tin tài sản</h2>
                      <p className="text-xs text-[#666666] mt-0.5">{selectedAsset.item} • Mã: {selectedAsset.id}</p>
                  </div>
                  <button onClick={() => setSelectedAsset(null)} className="text-gray-400 hover:text-[#B7705F] text-2xl leading-none">&times;</button>
               </div>
               
               <div className="p-6 overflow-y-auto space-y-6">
                  {/* General details read-only */}
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-bold text-[#666666] mb-1.5 uppercase tracking-wider">Tên tài sản</label>
                        <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 font-semibold" value={selectedAsset.item} readOnly />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-[#666666] mb-1.5 uppercase tracking-wider">Mã tài sản</label>
                        <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm font-mono font-bold text-gray-500" value={selectedAsset.id} readOnly />
                     </div>
                  </div>

                  {/* Room & Condition editable */}
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-bold text-[#666666] mb-1.5 uppercase tracking-wider">Vị trí (Phòng)</label>
                        <select 
                          value={editRoom}
                          onChange={(e) => setEditRoom(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#B7705F]"
                        >
                           <option value="P.101">P.101</option>
                           <option value="P.102">P.102</option>
                           <option value="P.201">P.201</option>
                           <option value="P.202">P.202</option>
                           <option value="P.301">P.301</option>
                           <option value="P.302">P.302</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-[#666666] mb-1.5 uppercase tracking-wider">Tình trạng tài sản</label>
                        <select 
                          value={editCondition}
                          onChange={(e) => setEditCondition(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#B7705F]"
                        >
                           <option value="Tốt">Tốt</option>
                           <option value="Hư hỏng nhẹ">Hư hỏng nhẹ</option>
                           <option value="Cần thay thế">Cần thay thế</option>
                           <option value="Đã thanh lý">Đã thanh lý</option>
                        </select>
                     </div>
                  </div>

                  {/* Notes / Maintenance History */}
                  <div>
                     <label className="block text-xs font-bold text-[#666666] mb-1.5 uppercase tracking-wider">Mô tả tình trạng / Ghi chú sửa chữa</label>
                     <textarea 
                       rows={3} 
                       value={editNotes}
                       onChange={(e) => setEditNotes(e.target.value)}
                       className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#B7705F] resize-none" 
                       placeholder="Nhập chi tiết về tình trạng bảo trì, hỏng hóc hoặc lý do điều chỉnh..."
                     />
                  </div>

                  {/* Pending delete request details if any */}
                  {selectedAsset.isPendingDeletion && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800">
                       <p className="font-bold flex items-center">
                          <Clock className="w-4 h-4 mr-1.5 animate-pulse text-red-600" />
                          Tài sản đang trong danh sách chờ duyệt xóa của Admin
                       </p>
                       <p className="mt-1 text-xs">Lý do gửi yêu cầu: <strong className="text-red-900">{selectedAsset.deletionReason}</strong></p>
                    </div>
                  )}

                  {/* Special Asset Deletion Flow for Manager (Not Admin) */}
                  {!showDeleteRequestForm && !selectedAsset.isPendingDeletion ? (
                    <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                       <div>
                          <p className="text-xs font-bold text-gray-700">Xóa dữ liệu sai lệch / Nhập sai thông tin?</p>
                          <p className="text-[11px] text-[#666666]">Nếu tài sản này được tạo nhầm, bạn có thể gửi yêu cầu phê duyệt xóa vĩnh viễn đến Admin.</p>
                       </div>
                       <button 
                         type="button" 
                         onClick={() => setShowDeleteRequestForm(true)}
                         className="px-3 py-2 border border-red-200 hover:bg-red-50 text-red-600 rounded-lg text-xs font-bold transition-all flex items-center shrink-0"
                       >
                          <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Yêu cầu xóa vĩnh viễn
                       </button>
                    </div>
                  ) : showDeleteRequestForm ? (
                    <div className="bg-red-50/40 border-2 border-dashed border-red-200 rounded-xl p-5 space-y-4">
                       <div className="flex items-start space-x-3">
                          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                          <div>
                             <h4 className="text-xs font-bold text-red-800 uppercase tracking-wider">Xác nhận yêu cầu xóa lên Ban quản trị (Admin)</h4>
                             <p className="text-[11px] text-red-700 mt-0.5">Manager không có thẩm quyền tự động xóa vĩnh viễn thiết bị khỏi cơ sở dữ liệu. Vui lòng nhập lý do rõ ràng để Admin phê duyệt xóa vĩnh viễn.</p>
                          </div>
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-red-800 mb-1">Lý do yêu cầu xóa (Bắt buộc)</label>
                          <input 
                            type="text" 
                            required
                            placeholder="Ví dụ: Nhập nhầm mã phòng, tài sản này thực tế không tồn tại..."
                            value={deleteReason}
                            onChange={(e) => setDeleteReason(e.target.value)}
                            className="w-full bg-white border border-red-200 rounded-lg p-3 text-sm focus:outline-none focus:border-red-500 text-gray-800"
                          />
                       </div>
                       <div className="flex justify-end space-x-2">
                          <button 
                            type="button" 
                            onClick={() => setShowDeleteRequestForm(false)} 
                            className="px-3 py-1.5 text-gray-500 hover:bg-gray-100 rounded-lg text-xs font-medium"
                          >
                             Hủy bỏ yêu cầu
                          </button>
                          <button 
                            type="button" 
                            onClick={handleSubmitDeleteRequest}
                            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center"
                          >
                             <Send className="w-3.5 h-3.5 mr-1.5" /> Gửi yêu cầu xóa
                          </button>
                       </div>
                    </div>
                  ) : null}
               </div>

               <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center mt-auto">
                  <div className="flex space-x-2">
                     <button 
                       type="button" 
                       onClick={() => handleMarkStatus('Đã thanh lý')} 
                       className="px-3 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-bold transition-colors"
                     >
                        Thanh lý
                     </button>
                  </div>
                  <div className="flex space-x-2">
                     <button type="button" onClick={() => setSelectedAsset(null)} className="px-5 py-2.5 text-[#666666] font-medium hover:bg-gray-200 rounded-lg text-sm transition-colors">Đóng</button>
                     <button 
                       type="button" 
                       onClick={handleSaveEdit} 
                       className="px-5 py-2.5 bg-[#B7705F] text-white font-medium rounded-lg text-sm shadow-sm hover:bg-[#a06050] transition-colors flex items-center"
                     >
                        <Save className="w-4 h-4 mr-2" />
                        Lưu thay đổi
                     </button>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
