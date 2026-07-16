import React, { useState, useEffect } from 'react';
import API_URL from '../../api';
import { Search, Plus, Shield, ShieldCheck, User, Eye, EyeOff, CheckCircle, PenSquare, Filter, UserPlus, AlertCircle, FileText } from 'lucide-react';

interface UserRecord {
  id: string;
  name: string;
  role: string;
  branch: string;
  status: string;
  email: string;
  phone: string;
  cccd?: string;
  room?: string;
  bed?: string;
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

interface AvailableBed {
  bedId: number;
  price: number;
  note: string;
  roomId: string;
  roomCode: string;
  roomName: string;
  branchName: string;
}

// Map ChucVu từ DB sang tên role hiển thị trong FE
const CHUCVU_TO_ROLE: Record<string, string> = {
  'Quản trị viên': 'Quản trị viên',
  'Quản lý': 'Quản lý',
  'Kế toán': 'Nhân viên kế toán',
  'Nhân viên kế toán': 'Nhân viên kế toán',
  'Kinh doanh': 'Nhân viên kinh doanh',
  'Nhân viên kinh doanh': 'Nhân viên kinh doanh',
  'Khách hàng': 'Khách hàng',
};

function mapRole(chucVu: string): string {
  return CHUCVU_TO_ROLE[chucVu] || chucVu || 'Khách hàng';
}

function normalizeBranch(branch: string | undefined): string {
  const raw = (branch || '').trim();
  return raw && raw !== 'Toàn hệ thống' ? raw : '';
}

function getInitials(name: string) {
  if (!name) return '--';
  const parts = name.trim().split(' ');
  return parts.map(p => p[0]).join('').toUpperCase().substring(Math.max(0, parts.length - 2));
}

function syncManagerToBranch(user: UserRecord, allUsers: UserRecord[]) {
  const branchRaw = localStorage.getItem('branch_list_v2');
  if (!branchRaw) return;
  try {
    const branches: Branch[] = JSON.parse(branchRaw);
    const updatedBranches = branches.map(b => {
      if (b.managerId === user.id) return { ...b, manager: user.name, avatar: getInitials(user.name) };
      if (user.role === 'Quản lý' && user.branch === b.id && !b.managerId)
        return { ...b, manager: user.name, managerId: user.id, avatar: getInitials(user.name) };
      return b;
    });
    localStorage.setItem('branch_list_v2', JSON.stringify(updatedBranches));
  } catch { }
}

function getStatusOptions(role: string): { value: string; label: string }[] {
  if (role === 'Khách hàng') {
    return [
      { value: 'Đang quyết định', label: 'Đang quyết định' },
      { value: 'Đang ở', label: 'Đang ở' },
      { value: 'Kết thúc lưu trú', label: 'Kết thúc lưu trú' },
    ];
  }
  return [
    { value: 'Đang làm', label: 'Đang làm' },
    { value: 'Đã nghỉ', label: 'Đã nghỉ' },
  ];
}

function isLockedStatus(status: string): boolean {
  return ['Kết thúc lưu trú', 'Đã nghỉ', 'Ngưng hoạt động', 'Khóa'].includes(status);
}

function statusDotColor(status: string): string {
  if (['Đang hoạt động', 'Đang làm', 'Đang ở'].includes(status)) return 'bg-green-500';
  if (isLockedStatus(status)) return 'bg-red-500';
  return 'bg-orange-400';
}

function defaultStatus(role: string): string {
  return role === 'Khách hàng' ? 'Đang quyết định' : 'Đang làm';
}

const ALL_ROLES = ['Khách hàng', 'Quản trị viên', 'Quản lý', 'Nhân viên kế toán', 'Nhân viên kinh doanh'];

const EMPTY_FORM = {
  name: '', email: '', phone: '', cccd: '', role: 'Khách hàng',
  password: '', branch: 'CN001', status: 'Đang quyết định',
  room: '', bed: ''
};

interface PendingCustomer {
  id: string;
  name: string;
  phone: string;
  email: string;
  cccd: string;
  status: string;
  contractId: string;
  contractStart: string;
  contractEnd: string;
  roomId: string;
  roomName: string;
  branchId: string;
  branchName: string;
  bedNo: number | null;
}

export default function UserManagement() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [pendingAccounts, setPendingAccounts] = useState<PendingCustomer[]>([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('all');

  const [branches, setBranches] = useState<Branch[]>(() => {
    const s = localStorage.getItem('branch_list_v2');
    if (s) try { return JSON.parse(s); } catch { }
    return [];
  });

  const [availableBeds, setAvailableBeds] = useState<AvailableBed[]>([]);
  const [loadingBeds, setLoadingBeds] = useState(false);

  const fetchPendingAccounts = () => {
    setLoadingPending(true);
    fetch(`${API_URL}/api/v1/users/pending-account`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setPendingAccounts(data.data || []);
        }
      })
      .catch(err => console.error('pending-account fetch error:', err))
      .finally(() => setLoadingPending(false));
  };

  useEffect(() => {
    fetch(`${API_URL}/api/v1/users`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          const mappedUsers = data.data.map((u: any) => ({
            ...u,
            role: mapRole(u.role || u.chucVu || ''),
            status: u.status || (u.role === 'Khách hàng' ? 'Đang quyết định' : 'Đang làm')
          }));
          setUsers(mappedUsers);
          fetchPendingAccounts();
        }
      })
      .catch(err => console.error(err));

    fetchPendingAccounts();

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

  const fetchAvailableBeds = (branchId: string, role: string) => {
    if (role !== 'Khách hàng' || !branchId || branchId === 'Toàn hệ thống') {
      setAvailableBeds([]); return;
    }
    setLoadingBeds(true);
    fetch(`${API_URL}/api/v1/beds/available?BranchID=${branchId}`)
      .then(res => res.json())
      .then(data => setAvailableBeds(data.status === 'success' ? (data.data || []) : []))
      .catch(() => setAvailableBeds([]))
      .finally(() => setLoadingBeds(false));
  };

  // ── Filters & Pagination ─────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('Tất cả');
  const [filterBranch, setFilterBranch] = useState('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // ── Modal state ──────────────────────────────────────────────────────
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });

  // ── Branch options ────────────────────────────────────────────────────
  const branchSelectOptions = branches.length > 0
    ? branches.map(b => ({ value: b.id, label: `${b.id} - ${b.name}` }))
    : [
      { value: 'CN001', label: 'CN001 - Homestay Central Park' },
      { value: 'CN002', label: 'CN002 - Sunrise Riverside' },
      { value: 'CN003', label: 'CN003 - The Landmark View' },
    ];

  // ── Room-Bed derived ─────────────────────────────────────────────────
  const roomOptions = Array.from(new Map(availableBeds.map(b => [b.roomId, b.roomName])).entries())
    .map(([id, name]) => ({ id, name }));
  const bedOptions = availableBeds.filter(b => b.roomId === formData.room);

  // ── Open Add ─────────────────────────────────────────────────────────
  const handleOpenAdd = () => {
    const defaultRole = 'Khách hàng';
    const defaultBranch = branches[0]?.id || 'CN001';
    const newForm = {
      ...EMPTY_FORM,
      role: defaultRole,
      branch: defaultBranch,
      status: defaultStatus(defaultRole),
    };
    setFormData(newForm);
    fetchAvailableBeds(defaultBranch, defaultRole);
    setErrorMsg(''); setSuccessMsg(''); setShowPassword(false); setShowAdd(true);
  };

  const handleCreate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    const phone = formData.phone.trim();
    if (!formData.name || !formData.email || !phone || !formData.password || !formData.cccd) {
      setErrorMsg('Vui lòng điền đầy đủ các thông tin bắt buộc.'); return;
    }
    if (!/^\d+$/.test(phone)) {
      setErrorMsg('Số điện thoại không hợp lệ. Chỉ được phép điền ký tự số (0-9).'); return;
    }
    if (formData.role !== 'Quản trị viên' && (!formData.branch || formData.branch === 'Toàn hệ thống')) {
      setErrorMsg('Vui lòng chọn chi nhánh cụ thể.'); return;
    }
    if (users.some(u => u.email === formData.email || u.phone === phone)) {
      setErrorMsg('Email hoặc số điện thoại đã tồn tại trong hệ thống.'); return;
    }
    const newUser: UserRecord = {
      id: formData.role === 'Khách hàng' ? `KH0${users.length + 1}` : `NV0${users.length + 1}`,
      name: formData.name, role: formData.role, branch: formData.branch,
      status: formData.status, email: formData.email, phone,
      cccd: formData.cccd, room: formData.room, bed: formData.bed
    };
    const newList = [newUser, ...users];
    persistUsers(newList);
    if (newUser.role === 'Quản lý') syncManagerToBranch(newUser, newList);
    setSuccessMsg(`Đã tạo thành công tài khoản cho: ${formData.name}`);
    setShowAdd(false);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  // ── Open Edit — KEY FIX: set formData with exact user data ────────────
  const handleOpenEdit = (user: any) => {
    const role = mapRole(user.role || '');
    const branch = (user.branch && user.branch !== '') ? user.branch : (branches[0]?.id || 'CN001');
    const newForm = {
      name: user.name || '',
      email: user.email || '',
      phone: (user.phone || '').trim(),
      cccd: user.cccd || '',
      role,                                        // ← mapped correctly
      password: '',
      branch,
      status: user.status || defaultStatus(role),
      room: user.room || '',
      bed: user.bed || '',
    };
    setFormData(newForm);
    fetchAvailableBeds(branch, role);
    setErrorMsg(''); setSuccessMsg(''); setShowPassword(false); setShowEdit(user);
  };

  const handleUpdate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    const phone = formData.phone.trim();
    if (!formData.name || !formData.email || !phone || !formData.cccd) {
      setErrorMsg('Vui lòng điền đầy đủ thông tin bắt buộc.'); return;
    }
    if (!/^\d+$/.test(phone)) {
      setErrorMsg('Số điện thoại không hợp lệ.'); return;
    }
    if (formData.role !== 'Quản trị viên' && (!formData.branch || formData.branch === 'Toàn hệ thống')) {
      setErrorMsg('Vui lòng chọn chi nhánh cụ thể.'); return;
    }
    if (users.some(u => (u.email === formData.email || u.phone === phone) && u.id !== showEdit.id)) {
      setErrorMsg('Email hoặc số điện thoại đã tồn tại ở tài khoản khác.'); return;
    }
    const updatedUser: UserRecord = {
      ...showEdit,
      name: formData.name, email: formData.email, phone, cccd: formData.cccd,
      role: formData.role, branch: formData.branch, status: formData.status,
      room: formData.room, bed: formData.bed
    };
    const newList = users.map(u => u.id === showEdit.id ? updatedUser : u);
    persistUsers(newList);
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
      const locked = isLockedStatus(showConfirmAction.status);
      const newStatus = locked
        ? (showConfirmAction.role === 'Khách hàng' ? 'Đang quyết định' : 'Đang làm')
        : (showConfirmAction.role === 'Khách hàng' ? 'Kết thúc lưu trú' : 'Đã nghỉ');
      const newList = users.map(u => u.id === showConfirmAction.id ? { ...u, status: newStatus } : u);
      persistUsers(newList);
      setSuccessMsg(`Đã thay đổi trạng thái tài khoản ${showConfirmAction.name} thành "${newStatus}"`);
      setShowConfirmAction(null);
      setTimeout(() => setSuccessMsg(''), 5000);
    }
  };

  // ── Quick-create account cho KH trong tab pending ─────────────────────
  const [creatingFor, setCreatingFor] = useState<string | null>(null);

  const handleQuickCreate = async (pending: PendingCustomer) => {
    setCreatingFor(pending.id);
    try {
      const res = await fetch(`${API_URL}/api/v1/users/create-account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: pending.id, password: '123' })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setSuccessMsg(`✅ Đã tạo tài khoản cho ${pending.name}. Đăng nhập: ${pending.id} / 123`);
        setPendingAccounts(prev => prev.filter(p => p.id !== pending.id));
        // Reload danh sách user
        fetch(`${API_URL}/api/v1/users`)
          .then(r => r.json())
          .then(d => {
            if (d.status === 'success') {
              setUsers(d.data.map((u: any) => ({
                ...u,
                role: mapRole(u.role || u.chucVu || ''),
                status: u.status || (u.role === 'Khách hàng' ? 'Đang quyết định' : 'Đang làm')
              })));
            }
          });
        setTimeout(() => setSuccessMsg(''), 8000);
      } else {
        setErrorMsg(data.message || 'Tạo tài khoản thất bại');
        setTimeout(() => setErrorMsg(''), 5000);
      }
    } catch {
      setErrorMsg('Lỗi kết nối đến máy chủ');
      setTimeout(() => setErrorMsg(''), 5000);
    } finally {
      setCreatingFor(null);
    }
  };
  const filteredUsers = users.filter(u => {
    const matchSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.phone || '').includes(searchTerm) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === 'Tất cả' || u.role === filterRole;
    const matchBranch = filterBranch === 'Tất cả' || u.branch === filterBranch;
    return matchSearch && matchRole && matchBranch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredUsers.length);
  const pagedUsers = filteredUsers.slice(startIndex, endIndex);

  React.useEffect(() => { setCurrentPage(1); }, [searchTerm, filterRole, filterBranch]);

  // ── CSS helpers ───────────────────────────────────────────────────────
  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#B7705F] bg-white";
  const labelCls = "block text-xs font-bold text-gray-500 mb-2";

  // ── Role change handler ───────────────────────────────────────────────
  const handleRoleChange = (newRole: string) => {
    const newBranch = newRole === 'Quản trị viên' ? 'Toàn hệ thống' : (branches[0]?.id || 'CN001');
    const newStatus = defaultStatus(newRole);
    setFormData(prev => ({ ...prev, role: newRole, branch: newBranch, status: newStatus, room: '', bed: '' }));
    fetchAvailableBeds(newBranch, newRole);
  };

  const handleBranchChange = (newBranch: string) => {
    setFormData(prev => ({ ...prev, branch: newBranch, room: '', bed: '' }));
    fetchAvailableBeds(newBranch, formData.role);
  };

  // ── Branch filter options (unique branches from users + branchSelectOptions)
  const branchFilterOptions = ['Tất cả', ...Array.from(new Set([
    ...branchSelectOptions.map(b => b.value),
    ...users.map(u => u.branch).filter(b => b && b !== ''),
  ]))];

  // ── Modal form JSX (shared Add/Edit) ─────────────────────────────────
  const renderFormBody = (isEdit = false) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Họ tên */}
      <div>
        <label className={labelCls}>Họ và tên *</label>
        <input type="text" required value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className={inputCls} placeholder="Nhập họ và tên..." />
      </div>
      {/* Email */}
      <div>
        <label className={labelCls}>Email *</label>
        <input type="email" required value={formData.email}
          onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className={inputCls} placeholder="Nhập email..." />
      </div>
      {/* Phone */}
      <div>
        <label className={labelCls}>Số điện thoại *</label>
        <input type="text" required value={formData.phone}
          onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value.replace(/\s/g, '') }))}
          className={inputCls} placeholder="Ví dụ: 0901234567" />
      </div>
      {/* CCCD */}
      <div>
        <label className={labelCls}>CCCD/CMND *</label>
        <input
          type="text"
          required
          value={formData.cccd}
          onChange={e => setFormData(prev => ({ ...prev, cccd: e.target.value }))}
          className={inputCls}
          placeholder="Ví dụ: 079123456789"
          maxLength={12}
        />
      </div>
      {/* Password */}
      <div>
        <label className={labelCls}>{isEdit ? 'Mật khẩu mới (tùy chọn)' : 'Mật khẩu *'}</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            required={!isEdit}
            value={formData.password || ''}
            onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
            className={`${inputCls} pr-10`}
            placeholder={isEdit ? 'Bỏ trống nếu không đổi...' : 'Khởi tạo mật khẩu...'}
          />
          <button type="button" onClick={() => setShowPassword(p => !p)}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
      {/* Role */}
      <div>
        <label className={labelCls}>Vai trò *</label>
        <select value={formData.role} onChange={e => handleRoleChange(e.target.value)} className={inputCls}>
          {ALL_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      {/* Branch */}
      <div>
        <label className={labelCls}>Chi nhánh *</label>
        <select value={formData.branch} onChange={e => handleBranchChange(e.target.value)} className={inputCls}>
          {formData.role === 'Quản trị viên' && <option value="Toàn hệ thống">Toàn hệ thống</option>}
          {branchSelectOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      {/* Room + Bed (only for Khách hàng) */}
      {formData.role === 'Khách hàng' && (
        <>
          <div>
            <label className={labelCls}>
              Phòng {loadingBeds && <span className="text-gray-400 font-normal">(đang tải...)</span>}
            </label>
            {roomOptions.length > 0 ? (
              <select value={formData.room}
                onChange={e => setFormData(prev => ({ ...prev, room: e.target.value, bed: '' }))}
                className={inputCls}>
                <option value="">— Chưa chọn phòng —</option>
                {roomOptions.map(r => <option key={r.id} value={r.id}>{r.name} ({r.id})</option>)}
              </select>
            ) : (
              <input type="text" value={formData.room}
                onChange={e => setFormData(prev => ({ ...prev, room: e.target.value }))}
                className={inputCls}
                placeholder={loadingBeds ? 'Đang tải...' : 'Nhập mã hoặc tên phòng...'} />
            )}
          </div>
          <div>
            <label className={labelCls}>Giường</label>
            {bedOptions.length > 0 ? (
              <select value={formData.bed}
                onChange={e => setFormData(prev => ({ ...prev, bed: e.target.value }))}
                className={inputCls}>
                <option value="">— Chưa chọn giường —</option>
                {bedOptions.map(b => (
                  <option key={b.bedId} value={String(b.bedId)}>
                    Giường {b.bedId}{b.note ? ` – ${b.note}` : ''}
                    {b.price ? ` (${new Intl.NumberFormat('vi-VN').format(b.price)} đ/tháng)` : ''}
                  </option>
                ))}
              </select>
            ) : (
              <input type="text" value={formData.bed}
                onChange={e => setFormData(prev => ({ ...prev, bed: e.target.value }))}
                className={inputCls}
                placeholder={formData.room && !loadingBeds ? 'Không có giường trống' : 'Chọn phòng trước...'} />
            )}
          </div>
        </>
      )}
      {/* Status */}
      <div className="md:col-span-2 border-t border-gray-100 pt-3">
        <label className={labelCls}>Trạng thái tài khoản *</label>
        <select value={formData.status}
          onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
          className={inputCls}>
          {getStatusOptions(formData.role).map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );

  // ── RENDER ────────────────────────────────────────────────────────────
  return (
    <div className="p-8 h-full max-w-7xl mx-auto bg-[#FAF5F3]">

      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1">Quản lý người dùng &amp; phân quyền</h1>
          <p className="text-sm text-[#666666]">Kiểm soát quyền truy cập, vai trò và chi nhánh trực thuộc của tài khoản trên hệ thống.</p>
        </div>
        <button onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-[#B7705F] text-white rounded-xl text-sm font-semibold shadow-sm hover:bg-[#a06050] transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Thêm người dùng
        </button>
      </div>

      {/* ── Tab switcher ──────────────────────────────────────────────── */}
      <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 border border-[#EAD3CC]/50 shadow-sm w-fit">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'all'
              ? 'bg-[#B7705F] text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
          }`}>
          <User className="w-4 h-4 inline mr-1.5" />Tất cả tài khoản
          <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs font-bold ${
            activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
          }`}>{users.length}</span>
        </button>
        <button
          onClick={() => { setActiveTab('pending'); fetchPendingAccounts(); }}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === 'pending'
              ? 'bg-[#B7705F] text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
          }`}>
          <AlertCircle className="w-4 h-4" />Cần cấp tài khoản
          {pendingAccounts.length > 0 && (
            <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
              activeTab === 'pending' ? 'bg-white/30 text-white' : 'bg-red-100 text-red-600'
            }`}>{pendingAccounts.length}</span>
          )}
        </button>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl flex items-center space-x-2 shadow-sm">
          <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
          <span className="text-sm font-medium">{successMsg}</span>
        </div>
      )}

      {/* ── Conditional content by tab ─────────────────────────────── */}
      {activeTab === 'all' ? (
        <>
          {/* Search + Filter bar */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-[#EAD3CC]/50 mb-6 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                placeholder="Tìm theo tên, email, vai trò, SĐT..."
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#B7705F]" />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400 shrink-0" />
              <select value={filterRole} onChange={e => setFilterRole(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#B7705F] bg-white">
                <option value="Tất cả">Tất cả vai trò</option>
                {ALL_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <select value={filterBranch} onChange={e => setFilterBranch(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#B7705F] bg-white">
                <option value="Tất cả">Tất cả chi nhánh</option>
                {branches.length > 0 
                  ? branches.map(b => <option key={b.id} value={b.name}>{b.id} - {b.name}</option>)
                  : branchSelectOptions.map(o => <option key={o.value} value={o.label.split(' - ')[1] || o.value}>{o.label}</option>)
                }
                <option value="Toàn hệ thống">Toàn hệ thống</option>
              </select>
            </div>
          </div>

          {/* All users table */}
          <div className="bg-white rounded-2xl border border-[#EAD3CC]/80 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#EAD3CC]/50 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#222222]">Danh sách tài khoản</h2>
              <span className="text-xs text-gray-400">{filteredUsers.length} kết quả</span>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF5F3] text-xs font-semibold text-[#666666] border-b border-[#EAD3CC]/50">
                  <th className="py-4 px-6">Tài khoản &amp; định danh</th>
                  <th className="py-4 px-6">Vai trò</th>
                  <th className="py-4 px-6">Chi nhánh</th>
                  <th className="py-4 px-6">Trạng thái</th>
                  <th className="py-4 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {pagedUsers.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 px-6 text-center text-gray-400 font-medium">Không tìm thấy tài khoản nào khớp với bộ lọc.</td></tr>
                ) : pagedUsers.map((user, idx) => (
                  <tr key={idx} className="border-b border-gray-50 hover:bg-[#FAF5F3]/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[#FAF5F3] text-[#B7705F] border border-[#EAD3CC] flex items-center justify-center font-bold shadow-sm shrink-0">{getInitials(user.name)}</div>
                        <div>
                          <p className="font-semibold text-[#222222]">{user.name}</p>
                          <p className="text-xs text-[#666666]">{user.email}</p>
                          <p className="text-xs font-mono text-[#B7705F]">{(user.phone || '').trim()}</p>
                          {user.cccd && <p className="text-xs font-mono text-gray-500">CCCD: {user.cccd}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6"><span className="px-2.5 py-1 text-xs font-semibold rounded-lg border text-gray-700 bg-gray-50 border-gray-200">{user.role}</span></td>
                    <td className="py-4 px-6 text-gray-700 font-medium text-sm">
                      {user.branch || <span className="text-red-500 italic">Chưa phân chi nhánh</span>}
                      {user.room && <span className="block text-xs text-[#888] font-normal">Phòng: {user.room}{user.bed ? ` · Giường ${user.bed}` : ''}</span>}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-2 ${statusDotColor(user.status)}`}></span>
                        <span className="font-medium text-sm text-[#222222]">{user.status}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleOpenEdit(user)} title="Chỉnh sửa" className="p-1.5 text-[#555] hover:bg-gray-100 rounded-lg transition-colors"><PenSquare className="w-4 h-4" /></button>
                        <button onClick={() => handleToggleStatusClick(user)} className="px-3 py-1 bg-gray-50 hover:bg-[#FAF5F3] border border-gray-200 rounded-lg text-xs font-semibold text-gray-500 transition-colors">
                          {isLockedStatus(user.status) ? 'Mở khóa' : 'Khóa'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 bg-[#FAF5F3]/50 border-t border-[#EAD3CC]/50 flex items-center justify-between">
              <span className="text-xs text-[#666666] font-medium">
                {filteredUsers.length === 0 ? 'Không có kết quả' : `Hiển thị ${startIndex + 1}–${endIndex} trên ${filteredUsers.length} tài khoản`}
              </span>
              {totalPages > 1 && (
                <div className="flex space-x-1 items-center">
                  <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">&lt;</button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button key={i} onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 flex items-center justify-center border rounded-lg text-xs font-semibold ${currentPage === i + 1 ? 'border-[#B7705F] bg-[#B7705F] text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{i + 1}</button>
                  ))}
                  <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">&gt;</button>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* ── Tab: Cần cấp tài khoản ──────────────────────────────────── */
        <div className="bg-white rounded-2xl border border-[#EAD3CC]/80 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#EAD3CC]/50 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#222222]">Khách hàng cần cấp tài khoản</h2>
              <p className="text-xs text-gray-400 mt-0.5">Có hợp đồng còn hiệu lực nhưng chưa có tài khoản đăng nhập. Mật khẩu mặc định: <strong>123</strong></p>
            </div>
            <span className="text-xs text-gray-400">{loadingPending ? 'Đang tải...' : `${pendingAccounts.length} khách hàng`}</span>
          </div>
          {errorMsg && <div className="mx-5 mt-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">{errorMsg}</div>}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF5F3] text-xs font-semibold text-[#666666] border-b border-[#EAD3CC]/50">
                <th className="py-4 px-6">Khách hàng</th>
                <th className="py-4 px-6">Hợp đồng</th>
                <th className="py-4 px-6">Phòng / Giường</th>
                <th className="py-4 px-6">Chi nhánh</th>
                <th className="py-4 px-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loadingPending ? (
                <tr><td colSpan={5} className="py-8 px-6 text-center text-gray-400">Đang tải dữ liệu...</td></tr>
              ) : pendingAccounts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 px-6 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle className="w-10 h-10 text-green-400" />
                      <p className="text-gray-500 font-medium">Tất cả khách hàng đều đã có tài khoản!</p>
                    </div>
                  </td>
                </tr>
              ) : pendingAccounts.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-[#FAF5F3]/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-bold shrink-0">{getInitials(p.name)}</div>
                      <div>
                        <p className="font-semibold text-[#222222]">{p.name}</p>
                        <p className="text-xs text-[#888] font-mono">{p.id}</p>
                        <p className="text-xs text-[#B7705F] font-mono">{(p.phone || '').trim()}</p>
                        {p.cccd && <p className="text-xs text-gray-400">CCCD: {p.cccd}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-xs font-mono font-semibold text-[#8C4A3A]">{p.contractId}</p>
                    <p className="text-xs text-gray-400">
                      {p.contractStart ? new Date(p.contractStart).toLocaleDateString('vi-VN') : '--'}
                      {' → '}
                      {p.contractEnd ? new Date(p.contractEnd).toLocaleDateString('vi-VN') : '--'}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    {p.roomName
                      ? <><p className="text-sm font-medium text-gray-700">{p.roomName}</p>{p.bedNo != null && <p className="text-xs text-gray-400">Giường số {p.bedNo}</p>}</>
                      : <span className="text-gray-400 italic text-xs">Chưa xác định</span>}
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm font-medium text-gray-700">{p.branchName || p.branchId || '--'}</p>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button onClick={() => handleQuickCreate(p)} disabled={creatingFor === p.id}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#B7705F] hover:bg-[#a06050] text-white text-xs font-semibold rounded-xl shadow-sm transition-all disabled:opacity-60 disabled:cursor-wait ml-auto">
                      <UserPlus className="w-3.5 h-3.5" />
                      {creatingFor === p.id ? 'Đang tạo...' : 'Tạo tài khoản'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      {(showAdd || showEdit) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl my-8">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-[#FAF5F3] rounded-t-2xl">
              <h2 className="text-xl font-bold text-[#222222]">
                {showAdd ? 'Thêm mới người dùng' : 'Chỉnh sửa thông tin'}
              </h2>
              <button onClick={() => { setShowAdd(false); setShowEdit(null); }} className="text-gray-400 hover:text-red-500 transition-colors">
                <AlertCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center text-sm font-medium">
                  <AlertCircle className="w-5 h-5 mr-2 shrink-0" />
                  {errorMsg}
                </div>
              )}
              {renderFormBody(!!showEdit)}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3 rounded-b-2xl">
              <button type="button" onClick={() => { setShowAdd(false); setShowEdit(null); }} className="px-5 py-2.5 text-[#666] text-sm font-medium hover:bg-gray-200 rounded-xl transition-colors">
                Hủy bỏ
              </button>
              <button type="button" onClick={showAdd ? handleCreate : handleUpdate} className="px-5 py-2.5 bg-[#B7705F] text-white text-sm font-semibold rounded-xl shadow-sm hover:bg-[#a06050] transition-colors flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                {showAdd ? 'Tạo tài khoản' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm lock/unlock */}
      {showConfirmAction && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-[#FAF5F3] px-6 py-4 border-b border-[#EAD3CC]/50">
              <h2 className="text-xl font-bold text-[#222222]">Xác nhận thao tác</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-[#666666]">
                Bạn có chắc muốn <strong>{isLockedStatus(showConfirmAction.status) ? 'kích hoạt lại' : 'khóa / kết thúc'}</strong> tài khoản của <strong>{showConfirmAction.name}</strong>?
              </p>
              {!isLockedStatus(showConfirmAction.status) && (
                <p className="text-xs text-gray-400 mt-2">
                  Trạng thái mới: <strong>{showConfirmAction.role === 'Khách hàng' ? 'Kết thúc lưu trú' : 'Đã nghỉ'}</strong>
                </p>
              )}
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
              <button onClick={() => setShowConfirmAction(null)}
                className="px-5 py-2.5 text-[#666] text-sm font-medium hover:bg-gray-200 rounded-xl">Hủy</button>
              <button onClick={executeToggleStatus}
                className={`px-5 py-2.5 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors ${isLockedStatus(showConfirmAction.status) ? 'bg-green-600 hover:bg-green-700' : 'bg-[#B7705F] hover:bg-[#a06050]'}`}>
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action error */}
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
              <button onClick={() => setActionError('')}
                className="px-5 py-2.5 bg-[#B7705F] text-white text-sm font-semibold rounded-xl shadow-sm hover:bg-[#a06050] transition-colors">Đồng ý</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
