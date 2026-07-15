import React, { useState, useEffect } from 'react';
import { Search, Plus, Shield, ShieldCheck, User, Edit2, Eye, EyeOff, CheckCircle, PenSquare } from 'lucide-react';

interface UserRecord {
  id: string;
  name: string;
  role: string;
  branch: string;
  status: string;
  email: string;
  phone: string;
  cccd?: string;
}

interface Branch {
  id: string;
  name: string;
  address: string;
  hotline: string;
  email: string;
  trangThai: string;
  manager: string;
  managerId: string;
  avatar: string;
  rooms: number;
}

const DEFAULT_USERS: UserRecord[] = [
  { id: 'NV001', name: 'Nguyễn Văn Admin', role: 'Quản trị viên', branch: 'Toàn hệ thống', status: 'Đang hoạt động', email: 'admin@homestay.com', phone: '0901234567', cccd: '079123456789' },
  { id: 'NV002', name: 'Trần Thị Trưởng', role: 'Quản lý', branch: 'CN001', status: 'Đang hoạt động', email: 'truong.tt@homestay.com', phone: '0901234568', cccd: '079123456788' },
  { id: 'NV003', name: 'Lê Kế Toán', role: 'Nhân viên kế toán', branch: 'CN001, CN002', status: 'Đang nghỉ phép', email: 'toan.lk@homestay.com', phone: '0901234569', cccd: '079123456787' },
  { id: 'NV004', name: 'Phạm Kinh Doanh', role: 'Nhân viên kinh doanh', branch: 'Toàn hệ thống', status: 'Đang hoạt động', email: 'doanh.pk@homestay.com', phone: '0901234570', cccd: '079123456786' },
  { id: 'KH001', name: 'Vũ Đức Khách', role: 'Khách hàng', branch: 'CN001', status: 'Đang hoạt động', email: 'khachhang.vd@gmail.com', phone: '0909999999', cccd: '079123456785' },
];

function getInitials(name: string) {
  if (!name) return '--';
  const parts = name.trim().split(' ');
  return parts.map(p => p[0]).join('').toUpperCase().substring(Math.max(0, parts.length - 2));
}

// Khi user role "Quản lý" được thêm/sửa → cập nhật branch's manager trong localStorage
function syncManagerToBranch(user: UserRecord, allUsers: UserRecord[]) {
  const branchRaw = localStorage.getItem('branch_list_v2');
  if (!branchRaw) return;
  try {
    const branches: Branch[] = JSON.parse(branchRaw);
    const updatedBranches = branches.map(b => {
      // Nếu user này là manager của branch này
      if (b.managerId === user.id) {
        return { ...b, manager: user.name, avatar: getInitials(user.name) };
      }
      // Nếu user được gán chi nhánh này và là Quản lý → gán là manager
      if (user.role === 'Quản lý' && user.branch === b.id && !b.managerId) {
        return { ...b, manager: user.name, managerId: user.id, avatar: getInitials(user.name) };
      }
      return b;
    });
    localStorage.setItem('branch_list_v2', JSON.stringify(updatedBranches));
  } catch { }
}

export default function UserManagement() {
  const [users, setUsers] = useState<UserRecord[]>([]);

  // Danh sách chi nhánh để hiển thị tên đẹp hơn trong dropdown
  const [branches, setBranches] = useState<Branch[]>(() => {
    const s = localStorage.getItem('branch_list_v2');
    if (s) try { return JSON.parse(s); } catch { }
    return [];
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/users')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          const mappedUsers = data.data.map((u: any) => ({
            ...u,
            status: u.status || 'Đang hoạt động'
          }));
          setUsers(mappedUsers);
        }
      })
      .catch(err => console.error(err));

    const sync = () => {
      const s = localStorage.getItem('branch_list_v2');
      if (s) try { setBranches(JSON.parse(s)); } catch { }
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const persistUsers = (updated: UserRecord[]) => {
    setUsers(updated);
    localStorage.setItem('user_list_v2', JSON.stringify(updated));
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', cccd: '', role: 'Khách hàng',
    password: '', branch: 'CN001', status: 'Đang hoạt động',
    room: '', bed: ''
  });

  const handleOpenAdd = () => {
    setFormData({ name: '', email: '', phone: '', cccd: '', role: 'Khách hàng', password: '', branch: 'CN001', status: 'Đang hoạt động', room: '', bed: '' });
    setErrorMsg(''); setSuccessMsg(''); setShowAdd(true);
  };

  const handleCreate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.cccd) {
      setErrorMsg('Vui lòng điền đầy đủ các thông tin bắt buộc.'); return;
    }
    if (!/^\d+$/.test(formData.phone)) {
      setErrorMsg('Số điện thoại không hợp lệ. Chỉ được phép điền ký tự số (0-9).'); return;
    }
    if (formData.role === 'Khách hàng' && (!formData.branch || formData.branch === 'Toàn hệ thống')) {
      setErrorMsg('Khách hàng bắt buộc phải thuộc về một chi nhánh cụ thể.'); return;
    }
    if (users.some(u => u.email === formData.email || u.phone === formData.phone)) {
      setErrorMsg('Email hoặc số điện thoại đã tồn tại trong hệ thống.'); return;
    }

    const newUser: UserRecord = {
      id: formData.role === 'Khách hàng' ? `KH0${users.length + 1}` : `NV0${users.length + 1}`,
      name: formData.name, role: formData.role, branch: formData.branch,
      status: formData.status, email: formData.email, phone: formData.phone, cccd: formData.cccd
    };

    const newList = [newUser, ...users];
    persistUsers(newList);
    // Đồng bộ sang BranchManagement nếu là Quản lý
    if (newUser.role === 'Quản lý') syncManagerToBranch(newUser, newList);

    setSuccessMsg(`Đã tạo thành công tài khoản cho: ${formData.name}`);
    setShowAdd(false);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const handleOpenEdit = (user: any) => {
    setFormData({ name: user.name, email: user.email, phone: user.phone || '', cccd: user.cccd || '', role: user.role, password: '', branch: user.branch || 'CN001', status: user.status || 'Đang hoạt động', room: user.room || '', bed: user.bed || '' });
    setErrorMsg(''); setSuccessMsg(''); setShowEdit(user);
  };

  const handleUpdate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    if (!formData.name || !formData.email || !formData.phone || !formData.cccd) {
      setErrorMsg('Vui lòng điền đầy đủ thông tin bắt buộc.'); return;
    }
    if (!/^\d+$/.test(formData.phone)) {
      setErrorMsg('Số điện thoại không hợp lệ.'); return;
    }
    if (formData.role === 'Khách hàng' && (!formData.branch || formData.branch === 'Toàn hệ thống')) {
      setErrorMsg('Khách hàng bắt buộc phải thuộc về một chi nhánh cụ thể.'); return;
    }
    if (users.some(u => (u.email === formData.email || u.phone === formData.phone) && u.id !== showEdit.id)) {
      setErrorMsg('Email hoặc số điện thoại đã tồn tại ở tài khoản khác.'); return;
    }

    const updatedUser: UserRecord = {
      ...showEdit,
      name: formData.name, email: formData.email, phone: formData.phone, cccd: formData.cccd,
      role: formData.role, branch: formData.branch, status: formData.status
    };

    const newList = users.map(u => u.id === showEdit.id ? updatedUser : u);
    persistUsers(newList);
    // Đồng bộ sang BranchManagement nếu là Quản lý
    if (updatedUser.role === 'Quản lý') syncManagerToBranch(updatedUser, newList);

    setSuccessMsg(`Đã cập nhật tài khoản: ${formData.name}`);
    setShowEdit(null);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const [showConfirmAction, setShowConfirmAction] = useState<any>(null);
  const [actionError, setActionError] = useState('');

  const handleToggleStatusClick = (user: any) => {
    if (user.role === 'Quản trị viên') {
      setActionError('Không thể vô hiệu hóa Quản trị viên của hệ thống.'); return;
    }
    setShowConfirmAction(user);
  };

  const executeToggleStatus = () => {
    if (showConfirmAction) {
      const isLocked = showConfirmAction.status === 'Ngưng hoạt động' || showConfirmAction.status === 'Ngưng hoạt động';
      const newStatus = isLocked ? 'Đang hoạt động' : 'Ngưng hoạt động';
      const newList = users.map(u => u.id === showConfirmAction.id ? { ...u, status: newStatus } : u);
      persistUsers(newList);
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

  // Branch options cho dropdown
  const branchSelectOptions = branches.length > 0
    ? branches.map(b => ({ value: b.id, label: `${b.id} - ${b.name}` }))
    : [
      { value: 'CN001', label: 'CN001 - Homestay Central Park' },
      { value: 'CN002', label: 'CN002 - Sunrise Riverside' },
      { value: 'CN003', label: 'CN003 - The Landmark View' },
    ];

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#B7705F]";
  const labelCls = "block text-xs font-bold text-gray-500 mb-2";

  return (
    <div className="p-8 h-full max-w-7xl mx-auto bg-[#FAF5F3]">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1">Quản lý người dùng & phân quyền</h1>
          <p className="text-sm text-[#666666]">Kiểm soát quyền truy cập, vai trò và chi nhánh trực thuộc của tài khoản trên hệ thống.</p>
        </div>
        <button onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-[#B7705F] text-white rounded-xl text-sm font-semibold shadow-sm hover:bg-[#a06050] transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Thêm người dùng
        </button>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl flex items-center space-x-2 shadow-sm">
          <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
          <span className="text-sm font-medium">{successMsg}</span>
        </div>
      )}

      {/* ── Search ─────────────────────────────────────────────────────── */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-[#EAD3CC]/50 mb-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm tài khoản theo tên, email, vai trò, số điện thoại..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#B7705F]" />
        </div>
      </div>

      {/* ── Add Modal ──────────────────────────────────────────────────── */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <form onSubmit={handleCreate} className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="bg-[#FAF5F3] px-6 py-4 border-b border-[#EAD3CC]/50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#222222]">Thêm người dùng mới</h2>
              <button type="button" onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-[#B7705F] text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6">
              {errorMsg && <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">{errorMsg}</div>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Họ và tên *</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className={inputCls} placeholder="Nhập họ và tên..." />
                </div>
                <div>
                  <label className={labelCls}>Email *</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className={inputCls} placeholder="Nhập email..." />
                </div>
                <div>
                  <label className={labelCls}>Số điện thoại *</label>
                  <input type="text" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className={inputCls} placeholder="Ví dụ: 0901234567" />
                </div>
                <div>
                  <label className={labelCls}>CCCD/CMND *</label>
                  <input type="text" required value={formData.cccd} onChange={e => setFormData({ ...formData, cccd: e.target.value })} className={inputCls} placeholder="Ví dụ: 079123456789" />
                </div>
                <div>
                  <label className={labelCls}>Mật khẩu *</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className={`${inputCls} pr-10`} placeholder="Khởi tạo mật khẩu..." />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Vai trò *</label>
                  <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value, branch: e.target.value === 'Khách hàng' ? 'CN001' : 'Toàn hệ thống' })} className={`${inputCls} bg-white`}>
                    <option value="Khách hàng">Khách hàng</option>
                    <option value="Quản trị viên">Quản trị viên</option>
                    <option value="Quản lý">Quản lý</option>
                    <option value="Nhân viên kế toán">Nhân viên kế toán</option>
                    <option value="Nhân viên kinh doanh">Nhân viên kinh doanh</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Chi nhánh *</label>
                  <select value={formData.branch} onChange={e => setFormData({ ...formData, branch: e.target.value })} className={`${inputCls} bg-white`}>
                    {formData.role !== 'Khách hàng' && <option value="Toàn hệ thống">Toàn hệ thống</option>}
                    {branchSelectOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                {formData.role === 'Khách hàng' && (
                  <>
                    <div>
                      <label className={labelCls}>Phòng (Mã hoặc Tên)</label>
                      <input type="text" value={formData.room} onChange={e => setFormData({ ...formData, room: e.target.value })} className={inputCls} placeholder="VD: P.101" />
                    </div>
                    <div>
                      <label className={labelCls}>Giường</label>
                      <input type="text" value={formData.bed} onChange={e => setFormData({ ...formData, bed: e.target.value })} className={inputCls} placeholder="VD: 01" />
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
              <button type="button" onClick={() => setShowAdd(false)} className="px-5 py-2.5 text-[#666] text-sm font-medium hover:bg-gray-200 rounded-xl transition-colors">Hủy</button>
              <button type="submit" className="px-5 py-2.5 bg-[#B7705F] text-white text-sm font-semibold rounded-xl shadow-sm hover:bg-[#a06050] transition-colors">Lưu thông tin</button>
            </div>
          </form>
        </div>
      )}

      {/* ── Edit Modal ─────────────────────────────────────────────────── */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <form onSubmit={handleUpdate} className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="bg-[#FAF5F3] px-6 py-4 border-b border-[#EAD3CC]/50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#222222]">Chỉnh sửa người dùng</h2>
              <button type="button" onClick={() => setShowEdit(null)} className="text-gray-400 hover:text-[#B7705F] text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6">
              {errorMsg && <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">{errorMsg}</div>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Họ và tên *</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Email *</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Số điện thoại *</label>
                  <input type="text" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>CCCD/CMND *</label>
                  <input type="text" required value={formData.cccd} onChange={e => setFormData({ ...formData, cccd: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Mật khẩu mới (tùy chọn)</label>
                  <input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className={inputCls} placeholder="Bỏ trống nếu không đổi..." />
                </div>
                <div>
                  <label className={labelCls}>Vai trò *</label>
                  <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value, branch: e.target.value === 'Khách hàng' ? 'CN001' : formData.branch })} className={`${inputCls} bg-white`}>
                    <option value="Khách hàng">Khách hàng</option>
                    <option value="Quản trị viên">Quản trị viên</option>
                    <option value="Quản lý">Quản lý</option>
                    <option value="Nhân viên kế toán">Nhân viên kế toán</option>
                    <option value="Nhân viên kinh doanh">Nhân viên kinh doanh</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Chi nhánh *</label>
                  <select value={formData.branch} onChange={e => setFormData({ ...formData, branch: e.target.value })} className={`${inputCls} bg-white`}>
                    {formData.role !== 'Khách hàng' && <option value="Toàn hệ thống">Toàn hệ thống</option>}
                    {branchSelectOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                {formData.role === 'Khách hàng' && (
                  <>
                    <div>
                      <label className={labelCls}>Phòng (Mã hoặc Tên)</label>
                      <input type="text" value={formData.room} onChange={e => setFormData({ ...formData, room: e.target.value })} className={inputCls} placeholder="VD: P.101" />
                    </div>
                    <div>
                      <label className={labelCls}>Giường</label>
                      <input type="text" value={formData.bed} onChange={e => setFormData({ ...formData, bed: e.target.value })} className={inputCls} placeholder="VD: 01" />
                    </div>
                  </>
                )}
                <div className="md:col-span-2 border-t border-gray-100 pt-3">
                  <label className={labelCls}>Trạng thái tài khoản *</label>
                  <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className={`${inputCls} bg-white`}>
                    <option value="Đang hoạt động">Đang hoạt động</option>
                    <option value="Đang nghỉ phép">Đang nghỉ phép / Tạm ngưng</option>
                    <option value="Ngưng hoạt động">Ngưng hoạt động / Khóa tài khoản</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
              <button type="button" onClick={() => setShowEdit(null)} className="px-5 py-2.5 text-[#666] text-sm font-medium hover:bg-gray-200 rounded-xl transition-colors">Hủy</button>
              <button type="submit" className="px-5 py-2.5 bg-[#B7705F] text-white text-sm font-semibold rounded-xl shadow-sm hover:bg-[#a06050] transition-colors">Lưu cập nhật</button>
            </div>
          </form>
        </div>
      )}

      {/* ── Overview cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-[#EAD3CC]/50 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-[#FAF5F3] border border-[#EAD3CC]/30 flex items-center justify-center text-[#B7705F] shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500">Tổng số tài khoản</p>
            <h3 className="text-2xl font-bold text-gray-900">{users.length}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#EAD3CC]/50 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-green-50 border border-green-100 flex items-center justify-center text-green-600 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500">Đang hoạt động bình thường</p>
            <h3 className="text-2xl font-bold text-gray-900">{users.filter(u => u.status === 'Đang hoạt động').length}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#EAD3CC]/50 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500">Bị vô hiệu hóa / khóa</p>
            <h3 className="text-2xl font-bold text-gray-900">{users.filter(u => u.status === 'Khóa' || u.status === 'Ngưng hoạt động').length}</h3>
          </div>
        </div>
      </div>

      {/* ── Main table ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#EAD3CC]/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#EAD3CC]/50">
          <h2 className="text-lg font-bold text-[#222222]">Danh sách các tài khoản nội bộ và khách hàng</h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FAF5F3] text-xs font-semibold text-[#666666] border-b border-[#EAD3CC]/50">
              <th className="py-4 px-6">Tài khoản & định danh</th>
              <th className="py-4 px-6">Vai trò</th>
              <th className="py-4 px-6">Chi nhánh trực thuộc</th>
              <th className="py-4 px-6">Trạng thái</th>
              <th className="py-4 px-6 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 px-6 text-center text-gray-400 font-medium">
                  Không tìm thấy tài khoản nào khớp với bộ lọc tìm kiếm.
                </td>
              </tr>
            ) : filteredUsers.map((user, idx) => (
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
                      {user.cccd && <p className="text-xs font-mono text-gray-500">CCCD: {user.cccd}</p>}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-lg border text-gray-700 bg-gray-50 border-gray-200">{user.role}</span>
                </td>
                <td className="py-4 px-6 text-gray-700 font-medium text-sm">
                  {user.branch || <span className="text-red-500 italic">Chưa phân chi nhánh</span>}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center text-[#222222]">
                    <span className={`w-2 h-2 rounded-full mr-2 ${user.status === 'Đang hoạt động' ? 'bg-green-500' : (user.status === 'Khóa' || user.status === 'Ngưng hoạt động') ? 'bg-red-500' : 'bg-orange-400'}`}></span>
                    <span className="font-medium text-sm">{user.status}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => handleOpenEdit(user)} title="Chỉnh sửa"
                      className="p-1.5 text-[#555] hover:bg-gray-100 rounded-lg transition-colors">
                      <PenSquare className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleToggleStatusClick(user)}
                      className="px-3 py-1 bg-gray-50 hover:bg-[#FAF5F3] border border-gray-200 rounded-lg text-xs font-semibold text-gray-500 transition-colors">
                      {(user.status === 'Ngưng hoạt động' || user.status === 'Khóa') ? 'Mở khóa' : 'Khóa'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 bg-[#FAF5F3]/50 border-t border-[#EAD3CC]/50 text-center text-xs text-[#666666] font-medium">
          Hiển thị {filteredUsers.length} trên tổng số {users.length} tài khoản trong hệ thống
        </div>
      </div>

      {/* ── Confirm lock ──────────────────────────────────────────────── */}
      {showConfirmAction && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-[#FAF5F3] px-6 py-4 border-b border-[#EAD3CC]/50">
              <h2 className="text-xl font-bold text-[#222222]">Xác nhận thao tác</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-[#666666]">
                Bạn có chắc chắn muốn <strong className="text-[#222222]">{(showConfirmAction.status === 'Ngưng hoạt động' || showConfirmAction.status === 'Khóa') ? 'kích hoạt lại' : 'khóa / vô hiệu hóa'}</strong> tài khoản của <strong className="text-[#222222]">{showConfirmAction.name}</strong> không?
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
              <button onClick={() => setShowConfirmAction(null)} className="px-5 py-2.5 text-[#666] text-sm font-medium hover:bg-gray-200 rounded-xl">Hủy</button>
              <button onClick={executeToggleStatus} className={`px-5 py-2.5 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors ${(showConfirmAction.status === 'Ngưng hoạt động' || showConfirmAction.status === 'Khóa') ? 'bg-green-600 hover:bg-green-700' : 'bg-[#B7705F] hover:bg-[#a06050]'}`}>
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Action error ──────────────────────────────────────────────── */}
      {actionError && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-red-50 px-6 py-4 border-b border-red-100">
              <h2 className="text-lg font-bold text-red-700">Thao tác bị chặn</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-[#666] leading-relaxed">{actionError}</p>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button onClick={() => setActionError('')} className="px-5 py-2.5 bg-[#B7705F] text-white text-sm font-semibold rounded-xl shadow-sm hover:bg-[#a06050] transition-colors">Đồng ý</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
