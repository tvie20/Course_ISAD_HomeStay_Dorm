import React, { useState } from 'react';
import { Search, Filter, Plus, Shield, ShieldCheck, UserCog, User, Edit2, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState([
    { id: 'NV001', name: 'Nguyễn Văn Admin', role: 'Quản trị viên', branch: 'Toàn hệ thống', status: 'Hoạt động', email: 'admin@homestay.com', phone: '0901234567' },
    { id: 'NV002', name: 'Trần Thị Trưởng', role: 'Quản lý', branch: 'CN001', status: 'Hoạt động', email: 'truong.tt@homestay.com', phone: '0901234568' },
    { id: 'NV003', name: 'Lê Kế Toán', role: 'Nhân viên kế toán', branch: 'CN001, CN002', status: 'Đang nghỉ phép', email: 'toan.lk@homestay.com', phone: '0901234569' },
    { id: 'NV004', name: 'Phạm Kinh Doanh', role: 'Nhân viên kinh doanh', branch: 'Toàn hệ thống', status: 'Hoạt động', email: 'doanh.pk@homestay.com', phone: '0901234570' },
    { id: 'KH001', name: 'Vũ Đức Khách', role: 'Khách hàng', branch: 'CN001', status: 'Hoạt động', email: 'khachhang.vd@gmail.com', phone: '0909999999' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    role: 'Khách hàng', 
    password: '', 
    branch: 'CN001',
    status: 'Hoạt động'
  });

  const handleOpenAdd = () => {
    setFormData({ 
      name: '', 
      email: '', 
      phone: '', 
      role: 'Khách hàng', 
      password: '', 
      branch: 'CN001',
      status: 'Hoạt động'
    });
    setErrorMsg('');
    setSuccessMsg('');
    setShowAdd(true);
  };

  const handleCreate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setErrorMsg('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    // Ràng buộc số điện thoại chỉ được điền số
    if (!/^\d+$/.test(formData.phone)) {
      setErrorMsg('Số điện thoại không hợp lệ. Chỉ được phép điền ký tự số (0-9).');
      return;
    }

    // Không được tạo khách hàng mà không thuộc về chi nhánh nào
    if (formData.role === 'Khách hàng') {
      if (!formData.branch || formData.branch === 'Toàn hệ thống') {
        setErrorMsg('Bắt buộc phải gán Khách hàng vào một chi nhánh cụ thể (không thể chọn Toàn hệ thống).');
        return;
      }
    }

    if (users.some(u => u.email === formData.email || u.phone === formData.phone)) {
      setErrorMsg('Email hoặc số điện thoại đã tồn tại trong hệ thống.');
      return;
    }

    const newUser = {
      id: formData.role === 'Khách hàng' ? `KH0${users.length + 1}` : `NV0${users.length + 1}`,
      name: formData.name,
      role: formData.role,
      branch: formData.branch,
      status: formData.status,
      email: formData.email,
      phone: formData.phone
    };

    setUsers([newUser, ...users]);
    setSuccessMsg(`Đã tạo thành công tài khoản cho: ${formData.name}`);
    setShowAdd(false);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const handleOpenEdit = (user: any) => {
    setFormData({ 
      name: user.name, 
      email: user.email, 
      phone: user.phone || '', 
      role: user.role, 
      password: '', 
      branch: user.branch || 'CN001',
      status: user.status || 'Hoạt động'
    });
    setErrorMsg('');
    setSuccessMsg('');
    setShowEdit(user);
  };

  const handleUpdate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!formData.name || !formData.email || !formData.phone) {
      setErrorMsg('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }

    // Ràng buộc số điện thoại chỉ được điền số
    if (!/^\d+$/.test(formData.phone)) {
      setErrorMsg('Số điện thoại không hợp lệ. Chỉ được phép điền ký tự số (0-9).');
      return;
    }

    // Không được gán khách hàng mà không thuộc về chi nhánh nào
    if (formData.role === 'Khách hàng') {
      if (!formData.branch || formData.branch === 'Toàn hệ thống') {
        setErrorMsg('Khách hàng bắt buộc phải thuộc về một chi nhánh cụ thể.');
        return;
      }
    }

    if (users.some(u => (u.email === formData.email || u.phone === formData.phone) && u.id !== showEdit.id)) {
      setErrorMsg('Email hoặc số điện thoại đã tồn tại ở tài khoản khác.');
      return;
    }

    setUsers(users.map(u => u.id === showEdit.id ? { 
      ...u, 
      name: formData.name, 
      email: formData.email, 
      phone: formData.phone, 
      role: formData.role, 
      branch: formData.branch,
      status: formData.status // Chỉnh sửa được trạng thái tài khoản thành công
    } : u));

    setSuccessMsg(`Đã cập nhật tài khoản: ${formData.name}`);
    setShowEdit(null);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const [showConfirmAction, setShowConfirmAction] = useState<any>(null);
  const [actionError, setActionError] = useState('');

  const handleToggleStatusClick = (user: any) => {
    if (user.role === 'Quản trị viên') {
      setActionError('Không thể vô hiệu hóa Quản trị viên của hệ thống.');
      return;
    }
    setShowConfirmAction(user);
  };

  const executeToggleStatus = () => {
    if (showConfirmAction) {
      const isLocked = showConfirmAction.status === 'Vô hiệu hóa' || showConfirmAction.status === 'Khóa';
      const newStatus = isLocked ? 'Hoạt động' : 'Vô hiệu hóa';
      setUsers(users.map(u => u.id === showConfirmAction.id ? { ...u, status: newStatus } : u));
      setSuccessMsg(`Đã thay đổi trạng thái tài khoản ${showConfirmAction.name} thành ${newStatus}`);
      setShowConfirmAction(null);
      setTimeout(() => setSuccessMsg(''), 5000);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 h-full max-w-7xl mx-auto bg-[#FAF5F3]">
      {/* Page Header matching uniform styling with #222222 title and #666666 subtitle */}
      <div className="flex justify-between items-end mb-8">
        <div>
           <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1">Quản lý người dùng &amp; phân quyền</h1>
           <p className="text-sm text-[#666666]">Kiểm soát quyền truy cập, vai trò và chi nhánh trực thuộc của tài khoản trên hệ thống.</p>
        </div>
        <button 
          onClick={handleOpenAdd} 
          className="px-5 py-2.5 bg-[#B7705F] text-white rounded-xl text-sm font-bold shadow-sm hover:bg-[#a06050] transition-colors flex items-center"
        >
           <Plus className="w-4 h-4 mr-2" /> Thêm Người dùng
        </button>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl flex items-center space-x-2 shadow-sm">
          <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
          <span className="text-sm font-medium">{successMsg}</span>
        </div>
      )}

      {/* Filter / Search bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-[#EAD3CC]/50 mb-6 flex flex-wrap gap-4 items-center">
         <div className="flex-1 min-w-[300px] relative">
           <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
           <input 
             type="text" 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             placeholder="Tìm kiếm tài khoản theo tên, email, vai trò, số điện thoại..." 
             className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#B7705F]"
           />
         </div>
      </div>

      {/* Add User Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
           <form onSubmit={handleCreate} className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-fade-in">
              <div className="bg-[#FAF5F3] px-6 py-4 border-b border-[#EAD3CC]/50 flex justify-between items-center">
                 <h2 className="text-xl font-bold text-[#222222]">Thêm người dùng mới</h2>
                 <button type="button" onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-[#B7705F] text-2xl leading-none">&times;</button>
              </div>
              <div className="p-6">
                 {errorMsg && <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">{errorMsg}</div>}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Họ và tên *</label>
                       <input 
                         type="text" 
                         required
                         value={formData.name} 
                         onChange={e => setFormData({...formData, name: e.target.value})} 
                         className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#B7705F]" 
                         placeholder="Nhập họ và tên..." 
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email *</label>
                       <input 
                         type="email" 
                         required
                         value={formData.email} 
                         onChange={e => setFormData({...formData, email: e.target.value})} 
                         className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#B7705F]" 
                         placeholder="Nhập email..." 
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Số điện thoại * (Chỉ nhận số)</label>
                       <input 
                         type="text" 
                         required
                         value={formData.phone} 
                         onChange={e => setFormData({...formData, phone: e.target.value})} 
                         className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#B7705F]" 
                         placeholder="Ví dụ: 0901234567" 
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Mật khẩu *</label>
                       <div className="relative">
                         <input 
                           type={showPassword ? "text" : "password"} 
                           required
                           value={formData.password} 
                           onChange={e => setFormData({...formData, password: e.target.value})} 
                           className="w-full border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-[#B7705F]" 
                           placeholder="Khởi tạo mật khẩu..." 
                         />
                         {/* Nút Hiện Mật Khẩu */}
                         <button 
                           type="button" 
                           onClick={() => setShowPassword(!showPassword)}
                           className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                         >
                           {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                         </button>
                       </div>
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Vai trò *</label>
                       <select 
                         value={formData.role} 
                         onChange={e => setFormData({...formData, role: e.target.value, branch: e.target.value === 'Khách hàng' ? 'CN001' : 'Toàn hệ thống'})} 
                         className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#B7705F]"
                       >
                          <option value="Khách hàng">Khách hàng (Bắt buộc thuộc chi nhánh)</option>
                          <option value="Quản trị viên">Quản trị viên</option>
                          <option value="Quản lý">Quản lý</option>
                          <option value="Nhân viên kế toán">Nhân viên kế toán</option>
                          <option value="Nhân viên kinh doanh">Nhân viên kinh doanh</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Chi nhánh *</label>
                       <select 
                         value={formData.branch} 
                         onChange={e => setFormData({...formData, branch: e.target.value})} 
                         className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#B7705F]"
                       >
                          {formData.role !== 'Khách hàng' && <option value="Toàn hệ thống">Toàn hệ thống</option>}
                          <option value="CN001">CN001 - Homestay Central Park</option>
                          <option value="CN002">CN002 - Sunrise Riverside</option>
                          <option value="CN003">CN003 - The Landmark View</option>
                       </select>
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

      {/* Edit User Modal with Status Adjustment */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
           <form onSubmit={handleUpdate} className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-fade-in">
              <div className="bg-[#FAF5F3] px-6 py-4 border-b border-[#EAD3CC]/50 flex justify-between items-center">
                 <h2 className="text-xl font-bold text-[#222222]">Chỉnh sửa người dùng</h2>
                 <button type="button" onClick={() => setShowEdit(null)} className="text-gray-400 hover:text-[#B7705F] text-2xl leading-none">&times;</button>
              </div>
              <div className="p-6">
                 {errorMsg && <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">{errorMsg}</div>}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Họ và tên *</label>
                       <input 
                         type="text" 
                         required
                         value={formData.name} 
                         onChange={e => setFormData({...formData, name: e.target.value})} 
                         className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#B7705F]" 
                         placeholder="Nhập họ tên..." 
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email *</label>
                       <input 
                         type="email" 
                         required
                         value={formData.email} 
                         onChange={e => setFormData({...formData, email: e.target.value})} 
                         className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#B7705F]" 
                         placeholder="Nhập email..." 
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Số điện thoại * (Chỉ nhận số)</label>
                       <input 
                         type="text" 
                         required
                         value={formData.phone} 
                         onChange={e => setFormData({...formData, phone: e.target.value})} 
                         className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#B7705F]" 
                         placeholder="Nhập số điện thoại..." 
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Mật khẩu mới (Tùy chọn)</label>
                       <input 
                         type="password" 
                         value={formData.password} 
                         onChange={e => setFormData({...formData, password: e.target.value})} 
                         className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#B7705F]" 
                         placeholder="Bỏ trống nếu không đổi..." 
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Vai trò *</label>
                       <select 
                         value={formData.role} 
                         onChange={e => setFormData({...formData, role: e.target.value, branch: e.target.value === 'Khách hàng' ? 'CN001' : formData.branch})} 
                         className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#B7705F]"
                       >
                          <option value="Khách hàng">Khách hàng (Bắt buộc thuộc chi nhánh)</option>
                          <option value="Quản trị viên">Quản trị viên</option>
                          <option value="Quản lý">Quản lý</option>
                          <option value="Nhân viên kế toán">Nhân viên kế toán</option>
                          <option value="Nhân viên kinh doanh">Nhân viên kinh doanh</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Chi nhánh *</label>
                       <select 
                         value={formData.branch} 
                         onChange={e => setFormData({...formData, branch: e.target.value})} 
                         className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#B7705F]"
                       >
                          {formData.role !== 'Khách hàng' && <option value="Toàn hệ thống">Toàn hệ thống</option>}
                          <option value="CN001">CN001 - Homestay Central Park</option>
                          <option value="CN002">CN002 - Sunrise Riverside</option>
                          <option value="CN003">CN003 - The Landmark View</option>
                       </select>
                    </div>
                    {/* KHẢ NĂNG CHỈNH SỬA TRẠNG THÁI TÀI KHOẢN */}
                    <div className="md:col-span-2 border-t border-gray-100 pt-3">
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Trạng thái tài khoản *</label>
                       <select 
                         value={formData.status} 
                         onChange={e => setFormData({...formData, status: e.target.value})} 
                         className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#B7705F]"
                       >
                          <option value="Hoạt động">Hoạt động</option>
                          <option value="Đang nghỉ phép">Đang nghỉ phép / Tạm ngưng</option>
                          <option value="Vô hiệu hóa">Vô hiệu hóa / Khóa tài khoản</option>
                       </select>
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

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="bg-white p-5 rounded-2xl border border-[#EAD3CC]/50 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-[#FAF5F3] border border-[#EAD3CC]/30 flex items-center justify-center text-[#B7705F] shrink-0">
               <User className="w-5 h-5" />
            </div>
            <div>
               <p className="text-xs font-semibold text-gray-500 uppercase">Tổng số tài khoản</p>
               <h3 className="text-2xl font-bold text-gray-900">{users.length}</h3>
            </div>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-[#EAD3CC]/50 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-green-50 border border-green-100 flex items-center justify-center text-green-600 shrink-0">
               <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
               <p className="text-xs font-semibold text-gray-500 uppercase">Hoạt động bình thường</p>
               <h3 className="text-2xl font-bold text-gray-900">{users.filter(u => u.status === 'Hoạt động').length}</h3>
            </div>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-[#EAD3CC]/50 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
               <Shield className="w-5 h-5" />
            </div>
            <div>
               <p className="text-xs font-semibold text-gray-500 uppercase">Bị vô hiệu hóa / khóa</p>
               <h3 className="text-2xl font-bold text-gray-900">{users.filter(u => u.status === 'Khóa' || u.status === 'Vô hiệu hóa').length}</h3>
            </div>
         </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-[#EAD3CC]/80 shadow-sm overflow-hidden">
         <div className="p-5 border-b border-[#EAD3CC]/50 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#222222]">Danh sách các tài khoản nội bộ và khách hàng</h2>
         </div>
         
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-[#FAF5F3] text-xs uppercase tracking-wider text-[#666666] border-b border-[#EAD3CC]/50">
                  <th className="py-4 px-6 font-semibold">Tài khoản &amp; Định danh</th>
                  <th className="py-4 px-6 font-semibold">Vai trò</th>
                  <th className="py-4 px-6 font-semibold">Chi nhánh trực thuộc</th>
                  <th className="py-4 px-6 font-semibold">Trạng thái</th>
                  <th className="py-4 px-6 font-semibold text-right">Thao tác</th>
               </tr>
            </thead>
            <tbody className="text-sm">
               {filteredUsers.length === 0 ? (
                 <tr>
                    <td colSpan={5} className="py-8 px-6 text-center text-gray-400 font-medium">
                      Không tìm thấy tài khoản nào khớp với bộ lọc tìm kiếm.
                    </td>
                 </tr>
               ) : (
                 filteredUsers.map((user, idx) => (
                   <tr key={idx} className="border-b border-gray-50 hover:bg-[#FAF5F3]/30 transition-colors">
                      <td className="py-4 px-6">
                         <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-[#FAF5F3] text-[#B7705F] border border-[#EAD3CC] flex items-center justify-center font-bold shadow-sm shrink-0">
                               {user.name.split(' ').map((n: string) => n[0]).join('').substring(Math.max(0, user.name.split(' ').map((n: string) => n[0]).join('').length - 2))}
                            </div>
                            <div>
                               <p className="font-semibold text-[#222222]">{user.name}</p>
                               <p className="text-xs text-[#666666]">{user.email}</p>
                               <p className="text-xs font-mono text-[#B7705F]">{user.phone}</p>
                            </div>
                         </div>
                      </td>
                      <td className="py-4 px-6">
                          <span className="px-2.5 py-1 text-xs font-semibold rounded-lg border text-gray-700 bg-gray-50 border-gray-200">
                             {user.role}
                          </span>
                      </td>
                      <td className="py-4 px-6 text-gray-700 font-medium">
                        {user.branch ? user.branch : <span className="text-red-500 italic">Chưa phân chi nhánh</span>}
                      </td>
                      <td className="py-4 px-6">
                         <div className="flex items-center text-[#222222]">
                            <span className={`w-2 h-2 rounded-full mr-2 ${user.status === 'Hoạt động' ? 'bg-green-500' : (user.status === 'Khóa' || user.status === 'Vô hiệu hóa') ? 'bg-red-500' : 'bg-orange-400'}`}></span>
                            <span className="font-medium">{user.status}</span>
                         </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                         <button onClick={() => handleOpenEdit(user)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-lg mr-2" title="Chỉnh sửa">
                            <Edit2 className="w-4.5 h-4.5" />
                         </button>
                         <button 
                           onClick={() => handleToggleStatusClick(user)} 
                           className="px-3 py-1 bg-gray-50 hover:bg-red-50 hover:text-red-600 border border-gray-200 rounded-lg text-xs font-semibold text-gray-500 transition-colors"
                         >
                            {(user.status === 'Vô hiệu hóa' || user.status === 'Khóa') ? 'Mở' : 'Khóa'}
                         </button>
                      </td>
                   </tr>
                 ))
               )}
            </tbody>
         </table>
         
         {/* ĐÃ SỬA LỖI HIỂN THỊ: dòng hiển thị "Hiển thị X trên Y tài khoản" cập nhật động chuẩn 100% */}
         <div className="p-4 bg-[#FAF5F3]/50 border-t border-[#EAD3CC]/50 text-center text-xs text-[#666666] font-medium">
            Hiển thị {filteredUsers.length} trên tổng số {users.length} tài khoản trong hệ thống
         </div>
      </div>

      {/* Confirmation lock modal */}
      {showConfirmAction && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
           <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
              <div className="bg-[#FAF5F3] px-6 py-4 border-b border-[#EAD3CC]/50">
                 <h2 className="text-xl font-bold text-[#222222]">Xác nhận thao tác</h2>
              </div>
              <div className="p-6">
                 <p className="text-sm text-[#666666]">
                    Bạn có chắc chắn muốn <strong className="text-[#222222]">{(showConfirmAction.status === 'Vô hiệu hóa' || showConfirmAction.status === 'Khóa') ? 'KÍCH HOẠT LẠI' : 'KHÓA / VÔ HIỆU HÓA'}</strong> tài khoản của khách hàng/nhân viên <strong className="text-[#222222]">{showConfirmAction.name}</strong> không?
                 </p>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
                 <button onClick={() => setShowConfirmAction(null)} className="px-5 py-2.5 text-[#666666] text-sm font-medium hover:bg-gray-200 rounded-xl transition-colors">Hủy</button>
                 <button onClick={executeToggleStatus} className={`px-5 py-2.5 text-white text-sm font-bold rounded-xl shadow-sm transition-colors ${(showConfirmAction.status === 'Vô hiệu hóa' || showConfirmAction.status === 'Khóa') ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                    Xác nhận
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Warning popup */}
      {actionError && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
           <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
              <div className="bg-red-50 px-6 py-4 border-b border-red-100">
                 <h2 className="text-lg font-bold text-red-700">Thao tác bị chặn</h2>
              </div>
              <div className="p-6">
                 <p className="text-sm text-[#666666] leading-relaxed">{actionError}</p>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                 <button onClick={() => setActionError('')} className="px-5 py-2.5 bg-[#B7705F] text-white text-sm font-bold rounded-xl shadow-sm hover:bg-[#a06050] transition-colors">Đồng ý</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
