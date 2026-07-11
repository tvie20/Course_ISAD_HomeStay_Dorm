import React, { useState } from 'react';
import { Filter, Plus, TrendingUp, Search, Edit2, Trash2, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function BranchManagement() {
  const [branches, setBranches] = useState([
    { id: 'CN001', name: 'Homestay Central Park', status: 'Hoạt động', address: '208 Nguyễn Hữu Cảnh, P.22, Bình Thạnh', hotline: '0901 234 567', manager: 'Nguyễn Lam', avatar: 'NL', rooms: 120 },
    { id: 'CN002', name: 'Sunrise Riverside', status: 'Hoạt động', address: 'Đường Nguyễn Hữu Thọ, Phước Kiển, Nhà Bè', hotline: '0902 345 678', manager: 'Trần Huy', avatar: 'TH', rooms: 85 },
    { id: 'CN003', name: 'The Landmark View', status: 'Mới', address: '720A Điện Biên Phủ, Phường 22, Bình Thạnh', hotline: '0903 456 789', manager: 'Phan Anh', avatar: 'PA', rooms: 0 },
  ]);

  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // Only updates on Search button click or Enter key
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({ id: '', name: '', address: '', hotline: '', manager: '', rooms: 0 });

  const handleOpenAdd = () => {
    setFormData({ id: '', name: '', address: '', hotline: '', manager: '', rooms: 0 });
    setErrorMsg('');
    setSuccessMsg('');
    setShowAdd(true);
  };

  const handleCreate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.id || !formData.name || !formData.address || !formData.hotline || !formData.manager) {
      setErrorMsg('Vui lòng nhập đầy đủ các thông tin bắt buộc.');
      return;
    }

    if (branches.some(b => b.id.toLowerCase() === formData.id.toLowerCase() || b.name.toLowerCase() === formData.name.toLowerCase())) {
      setErrorMsg('Mã chi nhánh hoặc Tên chi nhánh đã tồn tại trong hệ thống.');
      return;
    }

    const initials = formData.manager.split(' ').map((n: string) => n[0]).join('').toUpperCase();
    const newBranch = {
      id: formData.id.toUpperCase(),
      name: formData.name,
      address: formData.address,
      hotline: formData.hotline,
      manager: formData.manager,
      status: 'Mới',
      avatar: initials.substring(Math.max(0, initials.length - 2)) || 'CN',
      rooms: Number(formData.rooms) || 0
    };

    setBranches([newBranch, ...branches]);
    setSuccessMsg(`Đã thêm thành công chi nhánh mới: ${formData.name}`);
    setShowAdd(false);
    setCurrentPage(1); // Return to first page to see the top upped branch
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const handleOpenEdit = (branch: any) => {
    setFormData({ id: branch.id, name: branch.name, address: branch.address, hotline: branch.hotline, manager: branch.manager, rooms: branch.rooms });
    setErrorMsg('');
    setSuccessMsg('');
    setShowEdit(branch);
  };

  const handleUpdate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.name || !formData.address || !formData.hotline || !formData.manager) {
      setErrorMsg('Vui lòng nhập đầy đủ các thông tin bắt buộc.');
      return;
    }

    if (branches.some(b => b.name.toLowerCase() === formData.name.toLowerCase() && b.id !== showEdit.id)) {
      setErrorMsg('Tên chi nhánh đã tồn tại trong hệ thống.');
      return;
    }

    const initials = formData.manager.split(' ').map((n: string) => n[0]).join('').toUpperCase();
    setBranches(branches.map(b => b.id === showEdit.id ? { 
      ...b, 
      name: formData.name,
      address: formData.address,
      hotline: formData.hotline,
      manager: formData.manager,
      rooms: Number(formData.rooms) || 0,
      avatar: initials.substring(Math.max(0, initials.length - 2)) || 'CN'
    } : b));

    setSuccessMsg(`Đã cập nhật chi nhánh: ${formData.name}`);
    setShowEdit(null);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<any>(null);
  const [deleteError, setDeleteError] = useState('');

  const handleDeleteClick = (branch: any) => {
    if (branch.rooms > 0) {
       setDeleteError(`Hệ thống chặn thao tác: Chi nhánh ${branch.name} đang có ${branch.rooms} phòng hoạt động. Chỉ có thể xóa cơ sở khi đã chuyển/làm trống hết dữ liệu phòng.`);
    } else {
       setShowDeleteConfirm(branch);
    }
  };

  const handleConfirmDelete = () => {
    if (showDeleteConfirm) {
      setBranches(branches.filter(b => b.id !== showDeleteConfirm.id));
      setSuccessMsg(`Đã xóa thành công chi nhánh: ${showDeleteConfirm.name}`);
      setShowDeleteConfirm(null);
      setCurrentPage(1);
      setTimeout(() => setSuccessMsg(''), 5000);
    }
  };

  // Search Logic
  const handleSearch = () => {
    setSearchTerm(searchInput);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const filteredBranches = branches.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculation
  const totalBranches = filteredBranches.length;
  const totalPages = Math.ceil(totalBranches / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalBranches);
  const displayedBranches = filteredBranches.slice(startIndex, startIndex + itemsPerPage);

  const totalRoomsCount = branches.reduce((sum, b) => sum + b.rooms, 0);

  return (
    <div className="p-8 h-full max-w-7xl mx-auto bg-[#FAF5F3]">
      {/* Page Header aligned strictly to color guidelines (#222222 bold and #666666 subtitle) */}
      <div className="flex justify-between items-end mb-8">
        <div>
           <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1">Quản lý chi nhánh</h1>
           <p className="text-sm text-[#666666]">Xem danh sách, thêm mới hoặc điều chỉnh cấu trúc số lượng phòng của các cơ sở homestay.</p>
        </div>
        <button 
          onClick={handleOpenAdd} 
          className="px-5 py-2.5 bg-[#B7705F] text-white rounded-xl text-sm font-bold shadow-sm hover:bg-[#a06050] transition-colors flex items-center"
        >
           <Plus className="w-4 h-4 mr-2" /> Thêm Chi nhánh
        </button>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl flex items-center space-x-2 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium">{successMsg}</span>
        </div>
      )}

      {/* Filter & Search Bar with Search Button */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-[#EAD3CC]/50 mb-6 flex gap-3 items-center">
         <div className="flex-1 relative">
           <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
           <input 
             type="text" 
             value={searchInput}
             onChange={(e) => setSearchInput(e.target.value)}
             onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
             placeholder="Tìm kiếm chi nhánh theo tên, quản lý, địa chỉ, mã chi nhánh..." 
             className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#B7705F]"
           />
         </div>
         {/* Nút Tìm kiếm */}
         <button 
           onClick={handleSearch}
           className="px-5 py-2.5 bg-[#B7705F] text-white rounded-xl text-sm font-semibold hover:bg-[#a06050] transition-colors flex items-center shadow-sm shrink-0"
         >
           <Search className="w-4 h-4 mr-1.5" />
           Tìm kiếm
         </button>
      </div>

      {/* Add Branch Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
           <form onSubmit={handleCreate} className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-fade-in">
              <div className="bg-[#FAF5F3] px-6 py-4 border-b border-[#EAD3CC]/50 flex justify-between items-center">
                 <h2 className="text-xl font-bold text-[#222222]">Thêm chi nhánh mới</h2>
                 <button type="button" onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-[#B7705F] text-2xl leading-none">&times;</button>
              </div>
              <div className="p-6">
                 {errorMsg && <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">{errorMsg}</div>}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Mã chi nhánh *</label>
                       <input 
                         type="text" 
                         required
                         value={formData.id} 
                         onChange={(e) => setFormData({...formData, id: e.target.value})} 
                         className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#B7705F]" 
                         placeholder="VD: CN004" 
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Tên chi nhánh *</label>
                       <input 
                         type="text" 
                         required
                         value={formData.name} 
                         onChange={(e) => setFormData({...formData, name: e.target.value})} 
                         className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#B7705F]" 
                         placeholder="Nhập tên chi nhánh..." 
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Hotline *</label>
                       <input 
                         type="text" 
                         required
                         value={formData.hotline} 
                         onChange={(e) => setFormData({...formData, hotline: e.target.value})} 
                         className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#B7705F]" 
                         placeholder="Nhập hotline cơ sở..." 
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Quản lý cơ sở *</label>
                       <input 
                         type="text" 
                         required
                         value={formData.manager} 
                         onChange={(e) => setFormData({...formData, manager: e.target.value})} 
                         className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#B7705F]" 
                         placeholder="Nhập tên quản lý..." 
                       />
                    </div>
                    {/* Thêm số phòng trong khi tạo cơ sở */}
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Số lượng phòng hiện có</label>
                       <input 
                         type="number" 
                         min="0"
                         value={formData.rooms} 
                         onChange={(e) => setFormData({...formData, rooms: Math.max(0, parseInt(e.target.value) || 0)})} 
                         className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#B7705F]" 
                         placeholder="Số lượng phòng hiện tại..." 
                       />
                    </div>
                    <div className="md:col-span-2">
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Địa chỉ chi tiết *</label>
                       <input 
                         type="text" 
                         required
                         value={formData.address} 
                         onChange={(e) => setFormData({...formData, address: e.target.value})} 
                         className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#B7705F]" 
                         placeholder="Nhập địa chỉ vị trí..." 
                       />
                    </div>
                 </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
                 <button type="button" onClick={() => setShowAdd(false)} className="px-5 py-2.5 text-[#666666] text-sm font-medium hover:bg-gray-200 rounded-xl transition-colors">Hủy</button>
                 <button type="submit" className="px-5 py-2.5 bg-[#B7705F] text-white text-sm font-bold rounded-xl shadow-sm hover:bg-[#a06050] transition-colors">Lưu thông tin</button>
              </div>
           </form>
        </div>
      )}

      {/* Edit Branch Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
           <form onSubmit={handleUpdate} className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-fade-in">
              <div className="bg-[#FAF5F3] px-6 py-4 border-b border-[#EAD3CC]/50 flex justify-between items-center">
                 <h2 className="text-xl font-bold text-[#222222]">Cập nhật chi nhánh</h2>
                 <button type="button" onClick={() => setShowEdit(null)} className="text-gray-400 hover:text-[#B7705F] text-2xl leading-none">&times;</button>
              </div>
              <div className="p-6">
                 {errorMsg && <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">{errorMsg}</div>}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Mã chi nhánh (Không thay đổi)</label>
                       <input 
                         type="text" 
                         disabled
                         value={formData.id} 
                         className="w-full border border-gray-100 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-400" 
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Tên chi nhánh *</label>
                       <input 
                         type="text" 
                         required
                         value={formData.name} 
                         onChange={(e) => setFormData({...formData, name: e.target.value})} 
                         className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#B7705F]" 
                         placeholder="Nhập tên chi nhánh..." 
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Hotline *</label>
                       <input 
                         type="text" 
                         required
                         value={formData.hotline} 
                         onChange={(e) => setFormData({...formData, hotline: e.target.value})} 
                         className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#B7705F]" 
                         placeholder="Nhập số điện thoại..." 
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Quản lý cơ sở *</label>
                       <input 
                         type="text" 
                         required
                         value={formData.manager} 
                         onChange={(e) => setFormData({...formData, manager: e.target.value})} 
                         className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#B7705F]" 
                         placeholder="Nhập tên quản lý..." 
                       />
                    </div>
                    {/* Thêm số phòng trong khi chỉnh sửa cơ sở */}
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Số lượng phòng hiện có</label>
                       <input 
                         type="number" 
                         min="0"
                         value={formData.rooms} 
                         onChange={(e) => setFormData({...formData, rooms: Math.max(0, parseInt(e.target.value) || 0)})} 
                         className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#B7705F]" 
                         placeholder="Số lượng phòng hiện tại..." 
                       />
                    </div>
                    <div className="md:col-span-2">
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Địa chỉ chi tiết *</label>
                       <input 
                         type="text" 
                         required
                         value={formData.address} 
                         onChange={(e) => setFormData({...formData, address: e.target.value})} 
                         className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#B7705F]" 
                         placeholder="Nhập địa chỉ..." 
                       />
                    </div>
                 </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
                 <button type="button" onClick={() => setShowEdit(null)} className="px-5 py-2.5 text-[#666666] text-sm font-medium hover:bg-gray-200 rounded-xl transition-colors">Hủy</button>
                 <button type="submit" className="px-5 py-2.5 bg-[#B7705F] text-white text-sm font-bold rounded-xl shadow-sm hover:bg-[#a06050] transition-colors">Lưu cập nhật</button>
              </div>
           </form>
        </div>
      )}

      {/* Stats Cards */}
      <div className="flex mb-8">
         <div className="bg-white border border-[#EAD3CC]/50 rounded-2xl p-6 shadow-sm flex flex-col justify-center min-w-[320px]">
            <p className="text-sm font-semibold text-[#666666] uppercase tracking-wider mb-2">Tổng quy mô vận hành</p>
            <div className="text-4xl font-bold text-[#222222] mb-3">{totalRoomsCount} <span className="text-base text-gray-500 font-medium">phòng hoạt động</span></div>
            <div className="flex items-center text-sm font-medium text-green-600">
               <TrendingUp className="w-4 h-4 mr-1 animate-pulse" />
               Mở rộng ổn định hệ thống toàn quốc
            </div>
         </div>
      </div>

      {/* Table grid of branches */}
      <div className="bg-white border border-[#EAD3CC]/80 rounded-2xl shadow-sm overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-[#FAF5F3] text-sm font-semibold text-[#222222] border-b border-[#EAD3CC]/50">
                  <th className="py-4 px-6 font-semibold">Mã CN</th>
                  <th className="py-4 px-6 font-semibold">Tên Chi nhánh</th>
                  <th className="py-4 px-6 font-semibold hidden md:table-cell">Địa chỉ</th>
                  <th className="py-4 px-6 font-semibold">Hotline</th>
                  <th className="py-4 px-6 font-semibold">Quản lý</th>
                  <th className="py-4 px-6 font-semibold text-center">Quy mô</th>
                  <th className="py-4 px-6 font-semibold text-right">Thao tác</th>
               </tr>
            </thead>
            <tbody className="text-sm text-[#222222]">
               {displayedBranches.length === 0 ? (
                 <tr>
                    <td colSpan={7} className="py-8 px-6 text-center text-gray-400 font-medium">
                      Không tìm thấy chi nhánh nào phù hợp với từ khóa tìm kiếm.
                    </td>
                 </tr>
               ) : (
                 displayedBranches.map((branch, idx) => (
                   <tr key={idx} className="border-b border-gray-50 hover:bg-[#FAF5F3]/30 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-[#B7705F]">{branch.id}</td>
                      <td className="py-4 px-6">
                         <div className="font-semibold text-[#222222]">{branch.name}</div>
                         <div className={`text-xs mt-1 font-medium ${branch.status === 'Mới' ? 'text-green-600 bg-green-50 px-2 py-0.5 rounded inline-block border border-green-100' : 'text-[#666666]'}`}>{branch.status}</div>
                      </td>
                      <td className="py-4 px-6 text-[#666666] hidden md:table-cell max-w-[200px] truncate">{branch.address}</td>
                      <td className="py-4 px-6 font-mono font-medium">{branch.hotline}</td>
                      <td className="py-4 px-6">
                         <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-[#EAD3CC]/60 text-[#B7705F] flex items-center justify-center text-xs font-bold mr-3 shrink-0 shadow-sm">{branch.avatar}</div>
                            <span className="font-semibold">{branch.manager}</span>
                         </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                         <div className="bg-orange-50 text-[#B7705F] font-bold text-xs py-1.5 px-3 rounded-xl inline-block border border-orange-100">
                            {branch.rooms} Phòng
                         </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                         <button onClick={() => handleOpenEdit(branch)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-lg mr-2" title="Chỉnh sửa">
                            <Edit2 className="w-4.5 h-4.5" />
                         </button>
                         <button onClick={() => handleDeleteClick(branch)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors rounded-lg" title="Xóa">
                            <Trash2 className="w-4.5 h-4.5" />
                         </button>
                      </td>
                   </tr>
                 ))
               )}
            </tbody>
         </table>

         {/* DYNAMIC PAGINATION FOOTER - Cập nhật tự động lại hoàn toàn */}
         <div className="p-4 border-t border-[#EAD3CC]/50 flex items-center justify-between bg-white text-sm text-[#666666]">
            <div>
              {totalBranches === 0 
                ? 'Hiển thị 0 trên 0 chi nhánh' 
                : `Hiển thị ${startIndex + 1}-${endIndex} trên ${totalBranches} chi nhánh`
              }
            </div>
            
            {totalPages > 1 && (
              <div className="flex space-x-1 items-center">
                 <button 
                   onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                   disabled={currentPage === 1}
                   className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-opacity"
                 >
                   <ChevronLeft className="w-4 h-4" />
                 </button>
                 
                 {Array.from({ length: totalPages }).map((_, i) => (
                   <button 
                     key={i}
                     onClick={() => setCurrentPage(i + 1)}
                     className={`w-8 h-8 flex items-center justify-center border rounded-lg font-medium transition-all ${
                       currentPage === i + 1 
                         ? 'border-[#B7705F] bg-[#B7705F] text-white shadow-sm' 
                         : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                     }`}
                   >
                     {i + 1}
                   </button>
                 ))}
                 
                 <button 
                   onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                   disabled={currentPage === totalPages}
                   className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-opacity"
                 >
                   <ChevronRight className="w-4 h-4" />
                 </button>
              </div>
            )}
         </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
           <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
              <div className="bg-[#FAF5F3] px-6 py-4 border-b border-[#EAD3CC]/50">
                 <h2 className="text-xl font-bold text-[#222222]">Xác nhận xóa chi nhánh</h2>
              </div>
              <div className="p-6">
                 <p className="text-sm text-[#666666]">
                   Bạn có chắc chắn muốn xóa chi nhánh <strong className="text-[#222222]">{showDeleteConfirm.name}</strong>? 
                   Thao tác này không thể hoàn tác và dữ liệu sẽ bị loại khỏi bảng thống kê.
                 </p>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
                 <button onClick={() => setShowDeleteConfirm(null)} className="px-5 py-2.5 text-[#666666] text-sm font-medium hover:bg-gray-200 rounded-xl transition-colors">Hủy</button>
                 <button onClick={handleConfirmDelete} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl shadow-sm transition-colors">Xác nhận xóa</button>
              </div>
           </div>
        </div>
      )}

      {/* Error Alert Modal */}
      {deleteError && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
           <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
              <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center space-x-2">
                 <h2 className="text-lg font-bold text-red-700">Không thể thực hiện</h2>
              </div>
              <div className="p-6">
                 <p className="text-sm text-[#666666] leading-relaxed">{deleteError}</p>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                 <button onClick={() => setDeleteError('')} className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-bold rounded-xl transition-colors">Đồng ý</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
