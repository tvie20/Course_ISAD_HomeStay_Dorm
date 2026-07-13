import React, { useState, useEffect, useCallback } from 'react';
import { Filter, Plus, TrendingUp, Search, Trash2, CheckCircle2, ChevronLeft, ChevronRight, PenSquare, Eye, Building2, AlertCircle } from 'lucide-react';

// ── Schema CHINHANH ───────────────────────────────────────────────────────────
// CHINHANH(MaChiNhanh PK, TenChiNhanh, DiaChi, SDT, Email, TrangThai, QuanLy)
interface Branch {
  id: string;          // MaChiNhanh
  name: string;        // TenChiNhanh
  address: string;     // DiaChi
  hotline: string;     // SDT
  email: string;       // Email
  trangThai: string;   // TrangThai: 'Đang hoạt động' | 'Không hoạt động'
  manager: string;     // Tên quản lý (có thể rỗng)
  managerId: string;   // ID user quản lý (có thể rỗng)
  avatar: string;
  rooms: number;
}

// ── User từ UserManagement ─────────────────────────────────────────────────────
interface UserRecord {
  id: string;
  name: string;
  role: string;
  branch: string;
  status: string;
  email: string;
  phone: string;
}

const TRANG_THAI_OPTIONS = ['Đang hoạt động', 'Không hoạt động'];

const DEFAULT_BRANCHES: Branch[] = [
  { id: 'CN001', name: 'Homestay Central Park', trangThai: 'Đang hoạt động', address: '208 Nguyễn Hữu Cảnh, P.22, Bình Thạnh', hotline: '0901 234 567', email: 'centralpark@homestay.com', manager: 'Nguyễn Lam', managerId: '', avatar: 'NL', rooms: 120 },
  { id: 'CN002', name: 'Sunrise Riverside', trangThai: 'Đang hoạt động', address: 'Đường Nguyễn Hữu Thọ, Phước Kiển, Nhà Bè', hotline: '0902 345 678', email: 'sunrise@homestay.com', manager: 'Trần Huy', managerId: '', avatar: 'TH', rooms: 85 },
  { id: 'CN003', name: 'The Landmark View', trangThai: 'Không hoạt động', address: '720A Điện Biên Phủ, Phường 22, Bình Thạnh', hotline: '0903 456 789', email: 'landmark@homestay.com', manager: '', managerId: '', avatar: '--', rooms: 0 },
];

const DEFAULT_USERS: UserRecord[] = [
  { id: 'NV001', name: 'Nguyễn Văn Admin', role: 'Quản trị viên', branch: 'Toàn hệ thống', status: 'Hoạt động', email: 'admin@homestay.com', phone: '0901234567' },
  { id: 'NV002', name: 'Trần Thị Trưởng', role: 'Quản lý', branch: 'CN001', status: 'Hoạt động', email: 'truong.tt@homestay.com', phone: '0901234568' },
  { id: 'NV003', name: 'Lê Kế Toán', role: 'Nhân viên kế toán', branch: 'CN001, CN002', status: 'Đang nghỉ phép', email: 'toan.lk@homestay.com', phone: '0901234569' },
  { id: 'NV004', name: 'Phạm Kinh Doanh', role: 'Nhân viên kinh doanh', branch: 'Toàn hệ thống', status: 'Hoạt động', email: 'doanh.pk@homestay.com', phone: '0901234570' },
  { id: 'KH001', name: 'Vũ Đức Khách', role: 'Khách hàng', branch: 'CN001', status: 'Hoạt động', email: 'khachhang.vd@gmail.com', phone: '0909999999' },
];

type ModalMode = 'view' | 'add' | 'edit' | null;

function getInitials(name: string) {
  if (!name) return '--';
  const parts = name.trim().split(' ');
  return parts.map(p => p[0]).join('').toUpperCase().substring(Math.max(0, parts.length - 2));
}

export default function BranchManagement() {
  // ── Data: từ localStorage, đồng bộ với UserManagement ──────────────────
  const loadBranches = (): Branch[] => {
    const s = localStorage.getItem('branch_list_v2');
    if (s) try { return JSON.parse(s); } catch { }
    return DEFAULT_BRANCHES;
  };

  const loadUsers = (): UserRecord[] => {
    const s = localStorage.getItem('user_list_v2');
    if (s) try { return JSON.parse(s); } catch { }
    return DEFAULT_USERS;
  };

  const [branches, setBranches] = useState<Branch[]>(loadBranches);
  const [users, setUsers] = useState<UserRecord[]>(loadUsers);

  // Lấy danh sách manager để hiển thị dropdown
  const managerOptions = users.filter(u => u.role === 'Quản lý' && u.status === 'Hoạt động');

  // ── Sync khi UserManagement cập nhật ──────────────────────────────────
  useEffect(() => {
    const sync = () => {
      const s = localStorage.getItem('user_list_v2');
      if (s) try {
        const updatedUsers: UserRecord[] = JSON.parse(s);
        setUsers(updatedUsers);
        // Tự động cập nhật thông tin quản lý trong branch list
        setBranches(prev => {
          const updated = prev.map(b => {
            // Nếu branch đang có managerId, cập nhật tên theo user mới nhất
            if (b.managerId) {
              const user = updatedUsers.find(u => u.id === b.managerId);
              if (user) {
                return { ...b, manager: user.name, avatar: getInitials(user.name) };
              } else {
                // User bị xóa hoặc đổi role → reset manager
                return { ...b, manager: '', managerId: '', avatar: '--' };
              }
            }
            return b;
          });
          localStorage.setItem('branch_list_v2', JSON.stringify(updated));
          return updated;
        });
      } catch { }
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const persistBranches = (updated: Branch[]) => {
    setBranches(updated);
    localStorage.setItem('branch_list_v2', JSON.stringify(updated));
  };

  // ── UI State ───────────────────────────────────────────────────────────
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Branch | null>(null);
  const [deleteError, setDeleteError] = useState('');

  // ── Form State ─────────────────────────────────────────────────────────
  const emptyForm = () => ({
    id: '', name: '', address: '', hotline: '', email: '',
    trangThai: 'Đang hoạt động', managerId: '', rooms: 0,
  });
  const [form, setForm] = useState(emptyForm());

  const handleOpenAdd = () => {
    setForm(emptyForm());
    setErrorMsg('');
    setSuccessMsg('');
    setModalMode('add');
  };

  const handleOpenEdit = (b: Branch) => {
    setSelectedBranch(b);
    setForm({ id: b.id, name: b.name, address: b.address, hotline: b.hotline, email: b.email, trangThai: b.trangThai, managerId: b.managerId, rooms: b.rooms });
    setErrorMsg('');
    setModalMode('edit');
  };

  const handleOpenView = (b: Branch) => { setSelectedBranch(b); setModalMode('view'); };

  const closeModal = () => { setModalMode(null); setSelectedBranch(null); };

  // ── CRUD ───────────────────────────────────────────────────────────────
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id || !form.name || !form.address || !form.hotline || !form.email) {
      setErrorMsg('Vui lòng nhập đầy đủ các thông tin bắt buộc.'); return;
    }
    if (branches.some(b => b.id.toLowerCase() === form.id.toLowerCase())) {
      setErrorMsg('Mã chi nhánh đã tồn tại.'); return;
    }
    if (branches.some(b => b.name.toLowerCase() === form.name.toLowerCase())) {
      setErrorMsg('Tên chi nhánh đã tồn tại.'); return;
    }

    const selectedManager = managerOptions.find(u => u.id === form.managerId);
    const newBranch: Branch = {
      id: form.id.toUpperCase(),
      name: form.name,
      address: form.address,
      hotline: form.hotline,
      email: form.email,
      trangThai: form.trangThai,
      manager: selectedManager?.name || '',
      managerId: form.managerId,
      avatar: selectedManager ? getInitials(selectedManager.name) : '--',
      rooms: Number(form.rooms) || 0,
    };

    persistBranches([newBranch, ...branches]);
    setSuccessMsg(`Đã thêm chi nhánh "${form.name}" thành công.`);
    closeModal();
    setCurrentPage(1);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBranch) return;
    if (!form.name || !form.address || !form.hotline || !form.email) {
      setErrorMsg('Vui lòng nhập đầy đủ thông tin bắt buộc.'); return;
    }
    if (branches.some(b => b.name.toLowerCase() === form.name.toLowerCase() && b.id !== selectedBranch.id)) {
      setErrorMsg('Tên chi nhánh đã tồn tại.'); return;
    }

    const selectedManager = managerOptions.find(u => u.id === form.managerId);
    const updated = branches.map(b => b.id === selectedBranch.id ? {
      ...b,
      name: form.name,
      address: form.address,
      hotline: form.hotline,
      email: form.email,
      trangThai: form.trangThai,
      manager: selectedManager?.name || '',
      managerId: form.managerId,
      avatar: selectedManager ? getInitials(selectedManager.name) : '--',
      rooms: Number(form.rooms) || 0,
    } : b);

    persistBranches(updated);
    setSuccessMsg(`Đã cập nhật chi nhánh "${form.name}" thành công.`);
    closeModal();
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const handleDeleteClick = (b: Branch) => {
    if (b.rooms > 0) {
      setDeleteError(`Không thể xóa chi nhánh "${b.name}" vì đang có ${b.rooms} phòng. Hãy chuyển hoặc xóa hết phòng trước.`);
    } else {
      setShowDeleteConfirm(b);
    }
  };

  const handleConfirmDelete = () => {
    if (!showDeleteConfirm) return;
    persistBranches(branches.filter(b => b.id !== showDeleteConfirm.id));
    setSuccessMsg(`Đã xóa chi nhánh "${showDeleteConfirm.name}" thành công.`);
    setShowDeleteConfirm(null);
    setCurrentPage(1);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  // ── Search & Filter ────────────────────────────────────────────────────
  const handleSearch = () => { setSearchTerm(searchInput); setCurrentPage(1); };

  const filtered = branches.filter(b => {
    const q = searchTerm.toLowerCase();
    const matchSearch = b.name.toLowerCase().includes(q) || b.id.toLowerCase().includes(q)
      || b.address.toLowerCase().includes(q) || b.manager.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'Tất cả' || b.trangThai === filterStatus;
    return matchSearch && matchStatus;
  });

  // ── Pagination ─────────────────────────────────────────────────────────
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filtered.length);
  const displayed = filtered.slice(startIndex, startIndex + itemsPerPage);

  const totalRooms = branches.reduce((s, b) => s + b.rooms, 0);
  const activeCount = branches.filter(b => b.trangThai === 'Đang hoạt động').length;

  // ── Form helper ────────────────────────────────────────────────────────
  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#B7705F]";
  const labelCls = "block text-xs font-bold text-gray-500 mb-2";
  const readonlyCls = "w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm text-gray-400";

  const BranchForm = ({ onSubmit, isEdit = false }: { onSubmit: (e: React.FormEvent) => void; isEdit?: boolean }) => (
    <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
      <div className="bg-[#FAF5F3] px-6 py-4 border-b border-[#EAD3CC]/50 flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#222222]">{isEdit ? 'Cập nhật chi nhánh' : 'Thêm chi nhánh mới'}</h2>
        <button type="button" onClick={closeModal} className="text-gray-400 hover:text-[#B7705F] text-2xl leading-none">&times;</button>
      </div>
      <div className="p-6">
        {errorMsg && <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">{errorMsg}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mã chi nhánh */}
          <div>
            <label className={labelCls}>Mã chi nhánh {!isEdit && '*'}</label>
            {isEdit
              ? <input value={form.id} disabled className={readonlyCls} />
              : <input type="text" required value={form.id} onChange={e => setForm({ ...form, id: e.target.value })} className={inputCls} placeholder="VD: CN004" />
            }
          </div>

          {/* Tên chi nhánh */}
          <div>
            <label className={labelCls}>Tên chi nhánh *</label>
            <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Nhập tên chi nhánh..." />
          </div>

          {/* Hotline */}
          <div>
            <label className={labelCls}>Số điện thoại *</label>
            <input type="text" required value={form.hotline} onChange={e => setForm({ ...form, hotline: e.target.value })} className={inputCls} placeholder="Hotline chi nhánh..." />
          </div>

          {/* Email */}
          <div>
            <label className={labelCls}>Email *</label>
            <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={inputCls} placeholder="email@homestay.com" />
          </div>

          {/* Trạng thái */}
          <div>
            <label className={labelCls}>Trạng thái *</label>
            <select value={form.trangThai} onChange={e => setForm({ ...form, trangThai: e.target.value })} className={`${inputCls} bg-white`}>
              {TRANG_THAI_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Quản lý — dropdown, cho phép null */}
          <div>
            <label className={labelCls}>Quản lý chi nhánh</label>
            <select value={form.managerId} onChange={e => setForm({ ...form, managerId: e.target.value })} className={`${inputCls} bg-white`}>
              <option value="">— Chưa phân công —</option>
              {managerOptions.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.id})</option>
              ))}
            </select>
            <p className="text-[11px] text-[#888] mt-1">Có thể để trống và gán sau khi tạo tài khoản quản lý.</p>
          </div>

          {/* Số phòng */}
          <div>
            <label className={labelCls}>Số lượng phòng</label>
            <input type="number" min={0} value={form.rooms} onChange={e => setForm({ ...form, rooms: Math.max(0, parseInt(e.target.value) || 0) })} className={inputCls} />
          </div>

          {/* Địa chỉ */}
          <div className="md:col-span-2">
            <label className={labelCls}>Địa chỉ chi tiết *</label>
            <input type="text" required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className={inputCls} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành..." />
          </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
        <button type="button" onClick={closeModal} className="px-5 py-2.5 text-[#666666] text-sm font-medium hover:bg-gray-200 rounded-xl transition-colors">Hủy</button>
        <button type="submit" className="px-5 py-2.5 bg-[#B7705F] text-white text-sm font-semibold rounded-xl shadow-sm hover:bg-[#a06050] transition-colors">
          {isEdit ? 'Lưu cập nhật' : 'Thêm chi nhánh'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="p-8 h-full max-w-7xl mx-auto bg-[#FAF5F3]">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1">Quản lý chi nhánh</h1>
          <p className="text-sm text-[#666666]">Xem danh sách, thêm mới và cập nhật trạng thái hoạt động của các cơ sở homestay.</p>
        </div>
        <button onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-[#B7705F] text-white rounded-xl text-sm font-semibold shadow-sm hover:bg-[#a06050] transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Thêm chi nhánh
        </button>
      </div>

      {/* ── Success msg ───────────────────────────────────────────────────── */}
      {successMsg && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl flex items-center space-x-2 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          <span className="text-sm font-medium">{successMsg}</span>
        </div>
      )}

      {/* ── Summary cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-[#EAD3CC]/50 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-[#666]">Tổng chi nhánh</p>
          <p className="text-3xl font-bold text-[#8C4A3A] mt-1">{branches.length}</p>
          <p className="text-xs text-[#666] mt-0.5">{activeCount} đang hoạt động</p>
        </div>
        <div className="bg-white border border-[#EAD3CC]/50 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-[#666]">Tổng số phòng</p>
          <p className="text-3xl font-bold text-[#8C4A3A] mt-1">{totalRooms}</p>
          <div className="flex items-center text-xs text-green-600 mt-1">
            <TrendingUp className="w-3.5 h-3.5 mr-1" /> Mở rộng ổn định
          </div>
        </div>
        <div className="bg-white border border-[#EAD3CC]/50 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-[#666]">Không hoạt động</p>
          <p className="text-3xl font-bold text-gray-400 mt-1">{branches.filter(b => b.trangThai === 'Không hoạt động').length}</p>
          <p className="text-xs text-[#666] mt-0.5">chi nhánh tạm ngưng</p>
        </div>
      </div>

      {/* ── Search & Filter ────────────────────────────────────────────── */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-[#EAD3CC]/50 mb-6 flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
            placeholder="Tìm theo tên, mã, địa chỉ, quản lý..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#B7705F]" />
        </div>
        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}
          className="border border-gray-200 rounded-xl text-sm px-3 py-2.5 bg-white focus:outline-none focus:border-[#B7705F]">
          <option value="Tất cả">Tất cả trạng thái</option>
          {TRANG_THAI_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <button onClick={handleSearch}
          className="px-4 py-2.5 bg-[#B7705F] text-white rounded-xl text-sm font-semibold hover:bg-[#a06050] transition-colors flex items-center gap-1.5 shadow-sm shrink-0">
          <Search className="w-4 h-4" /> Tìm kiếm
        </button>
      </div>

      {/* ── Modals ────────────────────────────────────────────────────── */}
      {modalMode === 'add' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <BranchForm onSubmit={handleCreate} />
        </div>
      )}
      {modalMode === 'edit' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <BranchForm onSubmit={handleUpdate} isEdit />
        </div>
      )}

      {/* ── View Modal ─────────────────────────────────────────────────── */}
      {modalMode === 'view' && selectedBranch && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-[#FAF5F3] px-6 py-4 border-b border-[#EAD3CC]/50 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-[#8C4A3A]">Chi tiết chi nhánh</h2>
                <p className="text-xs text-[#666] mt-0.5">Mã: {selectedBranch.id}</p>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-[#B7705F] text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <span className="block text-xs font-bold text-[#666] mb-1">Tên chi nhánh</span>
                <p className="text-base font-bold text-gray-900">{selectedBranch.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs font-bold text-[#666] mb-1">Trạng thái</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${selectedBranch.trangThai === 'Đang hoạt động' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                    {selectedBranch.trangThai}
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-[#666] mb-1">Số phòng</span>
                  <p className="text-sm font-bold text-gray-800">{selectedBranch.rooms}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs font-bold text-[#666] mb-1">Số điện thoại</span>
                  <p className="text-sm font-mono font-medium text-gray-800">{selectedBranch.hotline}</p>
                </div>
                <div>
                  <span className="block text-xs font-bold text-[#666] mb-1">Email</span>
                  <p className="text-sm text-gray-800 break-all">{selectedBranch.email}</p>
                </div>
              </div>
              <div>
                <span className="block text-xs font-bold text-[#666] mb-1">Địa chỉ</span>
                <p className="text-sm text-gray-700">{selectedBranch.address}</p>
              </div>
              <div>
                <span className="block text-xs font-bold text-[#666] mb-1">Quản lý</span>
                {selectedBranch.manager ? (
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#EAD3CC]/60 text-[#B7705F] flex items-center justify-center text-xs font-bold shrink-0">{selectedBranch.avatar}</div>
                    <span className="text-sm font-semibold text-gray-800">{selectedBranch.manager}</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400 italic">Chưa phân công</span>
                )}
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between">
              <button onClick={() => { closeModal(); setTimeout(() => handleOpenEdit(selectedBranch), 50); }}
                className="px-3.5 py-2 text-[#666] hover:bg-gray-100 rounded-lg text-xs font-semibold flex items-center gap-1.5">
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

      {/* ── Table ──────────────────────────────────────────────────────── */}
      <div className="bg-white border border-[#EAD3CC]/80 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FAF5F3] text-xs font-semibold text-[#666666] border-b border-[#EAD3CC]/50">
              <th className="py-4 px-5">Mã CN</th>
              <th className="py-4 px-5">Tên chi nhánh</th>
              <th className="py-4 px-5 hidden md:table-cell">Địa chỉ</th>
              <th className="py-4 px-5">Liên hệ</th>
              <th className="py-4 px-5">Quản lý</th>
              <th className="py-4 px-5 text-center">Phòng</th>
              <th className="py-4 px-5 text-center">Trạng thái</th>
              <th className="py-4 px-5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-sm text-[#222222]">
            {displayed.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-gray-400">Không tìm thấy chi nhánh nào phù hợp.</td>
              </tr>
            ) : displayed.map((b, idx) => (
              <tr key={idx} className="border-b border-gray-50 hover:bg-[#FAF5F3]/30 transition-colors">
                <td className="py-4 px-5 font-mono font-bold text-[#B7705F]">{b.id}</td>
                <td className="py-4 px-5">
                  <p className="font-semibold text-[#222]">{b.name}</p>
                  <p className="text-[11px] text-[#888] mt-0.5">{b.email}</p>
                </td>
                <td className="py-4 px-5 text-[#666] hidden md:table-cell max-w-[180px] truncate text-xs">{b.address}</td>
                <td className="py-4 px-5 font-mono text-xs font-medium">{b.hotline}</td>
                <td className="py-4 px-5">
                  {b.manager ? (
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#EAD3CC]/60 text-[#B7705F] flex items-center justify-center text-xs font-bold shrink-0">{b.avatar}</div>
                      <span className="text-sm font-medium">{b.manager}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 italic">Chưa phân công</span>
                  )}
                </td>
                <td className="py-4 px-5 text-center">
                  <span className="bg-[#FAF5F3] text-[#B7705F] font-semibold text-xs py-1 px-2.5 rounded-lg border border-[#EAD3CC]">
                    {b.rooms}
                  </span>
                </td>
                <td className="py-4 px-5 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${b.trangThai === 'Đang hoạt động' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                    {b.trangThai}
                  </span>
                </td>
                <td className="py-4 px-5 text-right">
                  <div className="flex items-center justify-end gap-0.5">
                    <button onClick={() => handleOpenView(b)} title="Chi tiết"
                      className="p-1.5 text-[#8C4A3A] hover:bg-[#EAD3CC]/40 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleOpenEdit(b)} title="Chỉnh sửa"
                      className="p-1.5 text-[#555] hover:bg-gray-100 rounded-lg transition-colors">
                      <PenSquare className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteClick(b)} title="Xóa"
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-4 border-t border-[#EAD3CC]/50 flex items-center justify-between bg-white text-sm text-[#666666]">
          <div>
            {filtered.length === 0 ? 'Không có kết quả' : `Hiển thị ${startIndex + 1}–${endIndex} trên ${filtered.length} chi nhánh`}
          </div>
          {totalPages > 1 && (
            <div className="flex space-x-1 items-center">
              <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center border rounded-lg font-medium transition-all ${currentPage === i + 1 ? 'border-[#B7705F] bg-[#B7705F] text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Delete confirm ──────────────────────────────────────────────── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-[#FAF5F3] px-6 py-4 border-b border-[#EAD3CC]/50">
              <h2 className="text-xl font-bold text-[#222222]">Xác nhận xóa chi nhánh</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-[#666]">
                Bạn có chắc chắn muốn xóa chi nhánh <strong className="text-[#222]">{showDeleteConfirm.name}</strong>?
                Thao tác này không thể hoàn tác.
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="px-5 py-2.5 text-[#666] text-sm font-medium hover:bg-gray-200 rounded-xl">Hủy</button>
              <button onClick={handleConfirmDelete} className="px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg shadow-sm hover:bg-red-700 transition-colors">Xác nhận</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete error ────────────────────────────────────────────────── */}
      {deleteError && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-bold text-red-700">Không thể thực hiện</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-[#666] leading-relaxed">{deleteError}</p>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button onClick={() => setDeleteError('')} className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-semibold rounded-xl">Đồng ý</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
