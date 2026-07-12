import React, { useState, useEffect } from 'react';
import {
  Search, Trash2, XCircle, CheckCircle2, AlertTriangle,
  Filter, Info, Eye, Plus, Save, PenSquare
} from 'lucide-react';

// ── Danh mục tài sản (DANHSACHTAISAN) ────────────────────────────────────────
interface AssetCatalog {
  maTaiSan: string;
  tenTaiSan: string;
  soLuongTon: number;
  moTa?: string;
}

// ── Bản ghi phân bổ tài sản theo chi nhánh ───────────────────────────────────
// Admin chỉ phân loại đến chi nhánh; phân loại phòng do Manager thực hiện.
interface AssetRecord {
  id: string;
  maTaiSan: string;
  tenTaiSan: string;
  branch: string;
  soLuong: number;
  condition: string;
  lastUpdated: string;
  notes?: string;
  isPendingDeletion?: boolean;
  deletionReason?: string;
}

const BRANCHES = ['Chi nhánh 1', 'Chi nhánh 2', 'Chi nhánh 3', 'Chi nhánh 4'];

const DEFAULT_CATALOG: AssetCatalog[] = [
  { maTaiSan: 'TS-001', tenTaiSan: 'Máy lạnh Daikin 1.5HP', soLuongTon: 5, moTa: 'Máy lạnh inverter, làm lạnh nhanh' },
  { maTaiSan: 'TS-002', tenTaiSan: 'Tủ lạnh Aqua 90L', soLuongTon: 3, moTa: 'Tủ lạnh ngăn đá trên' },
  { maTaiSan: 'TS-003', tenTaiSan: 'Giường tầng gỗ', soLuongTon: 10 },
  { maTaiSan: 'TS-004', tenTaiSan: 'Bình nóng lạnh Ariston 20L', soLuongTon: 6 },
  { maTaiSan: 'TS-005', tenTaiSan: 'Tivi LG 43 inch', soLuongTon: 4 },
];

const DEFAULT_RECORDS: AssetRecord[] = [
  { id: 'AR-001', maTaiSan: 'TS-001', tenTaiSan: 'Máy lạnh Daikin 1.5HP', branch: 'Chi nhánh 1', soLuong: 3, condition: 'Tốt', lastUpdated: '15/10/2023', notes: 'Máy chạy êm, làm lạnh tốt.' },
  { id: 'AR-002', maTaiSan: 'TS-002', tenTaiSan: 'Tủ lạnh Aqua 90L', branch: 'Chi nhánh 1', soLuong: 2, condition: 'Hư hỏng nhẹ', lastUpdated: '10/09/2023', notes: 'Bị rỉ nước nhẹ ở khay đá.' },
  { id: 'AR-003', maTaiSan: 'TS-003', tenTaiSan: 'Giường tầng gỗ', branch: 'Chi nhánh 2', soLuong: 5, condition: 'Tốt', lastUpdated: '20/10/2023' },
  { id: 'AR-004', maTaiSan: 'TS-001', tenTaiSan: 'Máy lạnh Daikin 1.5HP', branch: 'Chi nhánh 2', soLuong: 2, condition: 'Tốt', lastUpdated: '01/10/2023' },
  { id: 'AR-005', maTaiSan: 'TS-004', tenTaiSan: 'Bình nóng lạnh Ariston 20L', branch: 'Chi nhánh 3', soLuong: 3, condition: 'Tốt', lastUpdated: '05/11/2023' },
];

type ModalMode = 'view' | 'edit' | 'add' | null;
type AddMode = 'existing' | 'new';

const conditionCls = (cond: string, isPending?: boolean) => {
  if (isPending) return 'bg-[#FAF5F3] text-[#8C4A3A] border border-[#EAD3CC]';
  switch (cond) {
    case 'Tốt': return 'bg-green-50 text-green-700 border border-green-200';
    case 'Hư hỏng nhẹ': return 'bg-orange-50 text-orange-700 border border-orange-200';
    case 'Cần thay thế': return 'bg-red-50 text-red-700 border border-red-100';
    case 'Đã thanh lý': return 'bg-gray-100 text-gray-500 border border-gray-200';
    default: return 'bg-gray-50 text-gray-500 border border-gray-200';
  }
};

export default function AdminAssetsManagement() {
  // ── State: data ──────────────────────────────────────────────────────────
  const [catalog, setCatalog] = useState<AssetCatalog[]>(() => {
    const s = localStorage.getItem('asset_catalog_v2');
    if (s) try { return JSON.parse(s); } catch {}
    return DEFAULT_CATALOG;
  });

  const [records, setRecords] = useState<AssetRecord[]>(() => {
    const s = localStorage.getItem('asset_records_admin_v2');
    if (s) try { return JSON.parse(s); } catch {}
    return DEFAULT_RECORDS;
  });

  // ── State: UI ────────────────────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBranch, setFilterBranch] = useState('Tất cả');
  const [filterCondition, setFilterCondition] = useState('Tất cả');
  const [selectedRecord, setSelectedRecord] = useState<AssetRecord | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [addMode, setAddMode] = useState<AddMode>('existing');
  const [confirmAction, setConfirmAction] = useState<{ id: string; type: 'approve' | 'reject' | 'delete'; itemName: string } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // ── State: form ──────────────────────────────────────────────────────────
  const [formMaTaiSan, setFormMaTaiSan] = useState('');
  const [formTenTaiSan, setFormTenTaiSan] = useState('');
  const [formSoLuongTon, setFormSoLuongTon] = useState(1);
  const [formMoTa, setFormMoTa] = useState('');
  const [formBranch, setFormBranch] = useState(BRANCHES[0]);
  const [formSoLuong, setFormSoLuong] = useState(1);
  const [formCondition, setFormCondition] = useState('Tốt');
  const [formNotes, setFormNotes] = useState('');

  // ── Helpers ──────────────────────────────────────────────────────────────
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const persist = (newRecords: AssetRecord[], newCatalog?: AssetCatalog[]) => {
    setRecords(newRecords);
    localStorage.setItem('asset_records_admin_v2', JSON.stringify(newRecords));
    if (newCatalog) {
      setCatalog(newCatalog);
      localStorage.setItem('asset_catalog_v2', JSON.stringify(newCatalog));
    }
  };

  useEffect(() => {
    const sync = () => {
      const r = localStorage.getItem('asset_records_admin_v2');
      if (r) try { setRecords(JSON.parse(r)); } catch {}
      const c = localStorage.getItem('asset_catalog_v2');
      if (c) try { setCatalog(JSON.parse(c)); } catch {}
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const resetForm = (branch = BRANCHES[0]) => {
    setFormMaTaiSan(catalog[0]?.maTaiSan || '');
    setFormTenTaiSan(''); setFormSoLuongTon(1); setFormMoTa('');
    setFormBranch(branch); setFormSoLuong(1); setFormCondition('Tốt'); setFormNotes('');
  };

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleOpenAdd = () => { setAddMode('existing'); resetForm(); setSelectedRecord(null); setModalMode('add'); };

  const handleOpenEdit = (r: AssetRecord) => {
    setSelectedRecord(r);
    setFormMaTaiSan(r.maTaiSan); setFormBranch(r.id.startsWith('UNALLOC_') ? BRANCHES[0] : r.branch);
    setFormSoLuong(r.soLuong); setFormCondition(r.condition); setFormNotes(r.notes || '');
    setModalMode('edit');
  };

  const handleOpenView = (r: AssetRecord) => { setSelectedRecord(r); setModalMode('view'); };

  const closeModal = () => { setModalMode(null); setSelectedRecord(null); };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toLocaleDateString('vi-VN');

    if (addMode === 'existing') {
      const cat = catalog.find(c => c.maTaiSan === formMaTaiSan);
      if (!cat) { showToast('Vui lòng chọn tài sản!', 'error'); return; }
      const newRec: AssetRecord = {
        id: `AR-${Date.now()}`, maTaiSan: cat.maTaiSan, tenTaiSan: cat.tenTaiSan,
        branch: formBranch, soLuong: formSoLuong, condition: formCondition,
        lastUpdated: today, notes: formNotes.trim(),
      };
      persist([newRec, ...records]);
      showToast(`Đã phân bổ ${cat.tenTaiSan} → ${formBranch}`, 'success');
    } else {
      if (!formTenTaiSan.trim()) { showToast('Vui lòng nhập tên tài sản!', 'error'); return; }
      const nextNum = String(catalog.length + 1).padStart(3, '0');
      const newMa = `TS-${nextNum}`;
      const newCat: AssetCatalog = { maTaiSan: newMa, tenTaiSan: formTenTaiSan.trim(), soLuongTon: formSoLuongTon, moTa: formMoTa.trim() };
      const newRec: AssetRecord = {
        id: `AR-${Date.now()}`, maTaiSan: newMa, tenTaiSan: formTenTaiSan.trim(),
        branch: formBranch, soLuong: formSoLuong, condition: formCondition,
        lastUpdated: today, notes: formNotes.trim(),
      };
      persist([newRec, ...records], [...catalog, newCat]);
      showToast(`Đã thêm tài sản mới "${formTenTaiSan.trim()}" (${newMa}) và phân bổ đến ${formBranch}`, 'success');
    }
    closeModal();
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;
    
    if (selectedRecord.id.startsWith('UNALLOC_')) {
      if (formBranch === 'Chưa phân bổ' || !formBranch) {
        showToast('Vui lòng chọn chi nhánh hợp lệ để phân bổ!', 'error');
        return;
      }
      if (formSoLuong > selectedRecord.soLuong) {
        showToast('Số lượng phân bổ vượt quá số lượng tồn chưa phân bổ!', 'error');
        return;
      }
      const newRec: AssetRecord = {
        id: `AR-${Date.now()}`, maTaiSan: selectedRecord.maTaiSan, tenTaiSan: selectedRecord.tenTaiSan,
        branch: formBranch, soLuong: formSoLuong, condition: formCondition,
        lastUpdated: new Date().toLocaleDateString('vi-VN'), notes: formNotes.trim(),
      };
      persist([newRec, ...records]);
      closeModal();
      showToast(`Đã phân bổ ${selectedRecord.tenTaiSan} → ${formBranch}`, 'success');
      return;
    }

    const updated = records.map(r => r.id === selectedRecord.id
      ? { ...r, branch: formBranch, soLuong: formSoLuong, condition: formCondition, notes: formNotes, lastUpdated: new Date().toLocaleDateString('vi-VN') }
      : r
    );
    persist(updated);
    closeModal();
    showToast('Đã cập nhật thông tin tài sản thành công!', 'success');
  };

  const handleConfirm = () => {
    if (!confirmAction) return;
    const { id, type } = confirmAction;
    if (type === 'delete' || type === 'approve') {
      persist(records.filter(r => r.id !== id));
      closeModal();
      showToast('Đã xóa tài sản thành công.', 'success');
    } else {
      persist(records.map(r => r.id === id
        ? { ...r, isPendingDeletion: false, deletionReason: undefined, condition: 'Cần thay thế', lastUpdated: new Date().toLocaleDateString('vi-VN') }
        : r
      ));
      closeModal();
      showToast('Đã từ chối yêu cầu xóa. Trạng thái chuyển về "Cần thay thế".', 'info');
    }
    setConfirmAction(null);
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const deletionRequests = records.filter(r => r.isPendingDeletion);

  const unallocatedAdminRecords: AssetRecord[] = [];
  catalog.forEach(cat => {
    const totalAllocated = records.filter(r => r.maTaiSan === cat.maTaiSan).reduce((acc, r) => acc + r.soLuong, 0);
    const unallocated = cat.soLuongTon - totalAllocated;
    if (unallocated > 0) {
      unallocatedAdminRecords.push({
        id: `UNALLOC_${cat.maTaiSan}`,
        maTaiSan: cat.maTaiSan,
        tenTaiSan: cat.tenTaiSan,
        branch: 'Chưa phân bổ',
        soLuong: unallocated,
        condition: 'Tốt',
        lastUpdated: '-',
        isPendingDeletion: false
      });
    }
  });

  const allDisplayRecords = [...unallocatedAdminRecords, ...records];

  const filteredRecords = allDisplayRecords.filter(r => {
    const q = searchTerm.toLowerCase();
    const matchSearch = r.tenTaiSan.toLowerCase().includes(q) || r.maTaiSan.toLowerCase().includes(q) || r.branch.toLowerCase().includes(q);
    const matchBranch = filterBranch === 'Tất cả' || r.branch === filterBranch;
    const matchCond = filterCondition === 'Tất cả'
      || (filterCondition === 'Chờ duyệt xóa' && r.isPendingDeletion)
      || (filterCondition !== 'Chờ duyệt xóa' && r.condition === filterCondition && !r.isPendingDeletion);
    return matchSearch && matchBranch && matchCond;
  });

  // Branch summary
  const branchStats = BRANCHES.map(b => {
    const br = records.filter(r => r.branch === b);
    return { branch: b, qty: br.reduce((s, r) => s + r.soLuong, 0), types: new Set(br.map(r => r.maTaiSan)).size };
  });

  const totalAllocated = records.reduce((s, r) => s + r.soLuong, 0);

  return (
    <div className="p-8 h-full max-w-7xl mx-auto">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1">Quản lý tài sản</h1>
          <p className="text-sm text-[#666666]">Quản lý danh mục tài sản và phân bổ theo chi nhánh. Phê duyệt yêu cầu xóa từ Manager.</p>
        </div>
        <button onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#B7705F] text-white rounded-xl text-sm font-semibold hover:bg-[#a06050] transition-colors flex items-center gap-2 shadow-sm">
          <Plus className="w-4 h-4" /> Thêm tài sản
        </button>
      </div>

      {/* ── Summary cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-[#EAD3CC]/50 shadow-sm p-5">
          <p className="text-xs text-[#666666] font-medium">Tổng loại tài sản</p>
          <p className="text-3xl font-bold text-[#8C4A3A] mt-1">{catalog.length}</p>
          <p className="text-[11px] text-[#666666] mt-0.5">loại trong danh mục</p>
        </div>
        <div className="bg-white rounded-xl border border-[#EAD3CC]/50 shadow-sm p-5">
          <p className="text-xs text-[#666666] font-medium">Tổng số lượng</p>
          <p className="text-3xl font-bold text-[#8C4A3A] mt-1">{totalAllocated}</p>
          <p className="text-[11px] text-[#666666] mt-0.5">đơn vị đã phân bổ</p>
        </div>
        <div className="bg-white rounded-xl border border-[#EAD3CC]/50 shadow-sm p-5">
          <p className="text-xs text-[#666666] font-medium">Tình trạng tốt</p>
          <p className="text-3xl font-bold text-green-700 mt-1">{records.filter(r => r.condition === 'Tốt' && !r.isPendingDeletion).length}</p>
          <p className="text-[11px] text-[#666666] mt-0.5">/ {records.length} bản ghi · {records.filter(r => r.condition !== 'Tốt' && !r.isPendingDeletion).length} cần chú ý</p>
        </div>
      </div>

      {/* ── Pending deletion requests ───────────────────────────────────── */}
      {deletionRequests.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-[#B7705F]" />
            <h2 className="text-sm font-bold text-[#8C4A3A]">Yêu cầu xóa chờ phê duyệt ({deletionRequests.length})</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {deletionRequests.map(req => (
              <div key={req.id} className="bg-[#FAF5F3] border border-[#EAD3CC] rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs font-bold text-[#B7705F]">{req.maTaiSan}</span>
                  <span className="text-[10px] text-[#888]">{req.lastUpdated}</span>
                </div>
                <p className="font-semibold text-[#333] text-sm">{req.tenTaiSan}</p>
                <p className="text-xs text-[#666]">{req.branch} · Số lượng: {req.soLuong}</p>
                <div className="bg-white p-2.5 rounded-lg border border-[#EAD3CC]/70">
                  <p className="text-[10px] font-bold text-[#8C4A3A]">Lý do từ Manager:</p>
                  <p className="text-xs text-[#333] italic mt-0.5">"{req.deletionReason}"</p>
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={() => setConfirmAction({ id: req.id, type: 'reject', itemName: req.tenTaiSan })}
                    className="flex-1 py-1.5 border border-[#EAD3CC] hover:bg-white text-[#666] font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Từ chối
                  </button>
                  <button onClick={() => setConfirmAction({ id: req.id, type: 'approve', itemName: req.tenTaiSan })}
                    className="flex-1 py-1.5 bg-[#B7705F] hover:bg-[#a06050] text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-1">
                    <Trash2 className="w-3.5 h-3.5" /> Duyệt xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Filter bar ─────────────────────────────────────────────────── */}
      <div className="bg-white p-3.5 rounded-xl shadow-sm border border-[#EAD3CC]/50 mb-4 flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input type="text" placeholder="Tìm theo tên, mã tài sản, chi nhánh..." value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#B7705F]" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-[#999]" />
          <select value={filterBranch} onChange={e => setFilterBranch(e.target.value)}
            className="border border-gray-200 rounded-lg text-sm px-3 py-2 bg-white focus:outline-none focus:border-[#B7705F]">
            <option value="Tất cả">Tất cả chi nhánh</option>
            {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <select value={filterCondition} onChange={e => setFilterCondition(e.target.value)}
            className="border border-gray-200 rounded-lg text-sm px-3 py-2 bg-white focus:outline-none focus:border-[#B7705F]">
            <option value="Tất cả">Tất cả trạng thái</option>
            <option value="Chờ duyệt xóa">Chờ duyệt xóa</option>
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
              <th className="px-5 py-3.5 font-semibold text-xs">Chi nhánh</th>
              <th className="px-5 py-3.5 font-semibold text-xs text-center">Số lượng</th>
              <th className="px-5 py-3.5 font-semibold text-xs">Tình trạng</th>
              <th className="px-5 py-3.5 font-semibold text-xs text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">
                  Không tìm thấy tài sản phù hợp.
                </td>
              </tr>
            ) : filteredRecords.map(item => (
              <tr key={item.id} className="hover:bg-[#FAF5F3]/40 transition-colors">
                <td className="px-5 py-3 font-mono text-xs font-bold text-[#B7705F]">{item.maTaiSan}</td>
                <td className="px-5 py-3">
                  <p className="font-semibold text-gray-900 text-sm">{item.tenTaiSan}</p>
                  {item.notes && <p className="text-[11px] text-gray-400 mt-0.5 truncate max-w-[180px]">{item.notes}</p>}
                </td>
                <td className="px-5 py-3">
                  <span className="text-xs font-medium text-[#8C4A3A] bg-[#FAF5F3] border border-[#EAD3CC] px-2 py-0.5 rounded-md">{item.branch}</span>
                </td>
                <td className="px-5 py-3 text-center">
                  <span className="text-sm font-bold text-gray-800">{item.soLuong}</span>
                </td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${conditionCls(item.condition, item.isPendingDeletion)}`}>
                    {item.isPendingDeletion ? 'Chờ duyệt xóa' : item.condition}
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
                    <button onClick={() => setConfirmAction({ id: item.id, type: 'delete', itemName: item.tenTaiSan })} title="Xóa"
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Modal: Add ─────────────────────────────────────────────────── */}
      {modalMode === 'add' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAdd} className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#FAF5F3] px-6 py-4 border-b border-[#EAD3CC]/50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#8C4A3A]">Thêm tài sản</h2>
              <button type="button" onClick={closeModal} className="text-gray-400 hover:text-[#B7705F] text-2xl leading-none">&times;</button>
            </div>

            {/* Mode toggle */}
            <div className="px-6 pt-5 flex gap-2">
              <button type="button" onClick={() => setAddMode('existing')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${addMode === 'existing' ? 'bg-[#B7705F] text-white border-[#B7705F]' : 'border-[#EAD3CC] text-[#666] hover:bg-[#FAF5F3]'}`}>
                Tài sản có sẵn
              </button>
              <button type="button" onClick={() => setAddMode('new')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${addMode === 'new' ? 'bg-[#B7705F] text-white border-[#B7705F]' : 'border-[#EAD3CC] text-[#666] hover:bg-[#FAF5F3]'}`}>
                Tài sản mới hoàn toàn
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              {addMode === 'existing' ? (
                <div>
                  <label className="block text-sm font-semibold text-[#666] mb-2">
                    Chọn từ danh mục tài sản <span className="text-[#B7705F]">*</span>
                  </label>
                  <select value={formMaTaiSan} onChange={e => setFormMaTaiSan(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#B7705F]">
                    {catalog.map(c => (
                      <option key={c.maTaiSan} value={c.maTaiSan}>
                        {c.maTaiSan} — {c.tenTaiSan}  (Tổng tồn: {c.soLuongTon})
                      </option>
                    ))}
                  </select>
                  {formMaTaiSan && (() => {
                    const cat = catalog.find(c => c.maTaiSan === formMaTaiSan);
                    const allocated = records.filter(r => r.maTaiSan === formMaTaiSan).reduce((s, r) => s + r.soLuong, 0);
                    const avail = cat ? cat.soLuongTon - allocated : 0;
                    return cat ? (
                      <p className="text-xs text-[#666] mt-1.5 bg-[#FAF5F3] border border-[#EAD3CC]/50 rounded-lg px-3 py-2">
                        Đã phân bổ: <strong>{allocated}</strong> / Tổng tồn: <strong>{cat.soLuongTon}</strong> — Còn khả dụng: <strong className={avail <= 0 ? 'text-red-600' : 'text-green-700'}>{avail}</strong>
                      </p>
                    ) : null;
                  })()}
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-[#666] mb-2">Tên tài sản <span className="text-[#B7705F]">*</span></label>
                    <input type="text" value={formTenTaiSan} onChange={e => setFormTenTaiSan(e.target.value)} required
                      className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#B7705F]"
                      placeholder="Ví dụ: Điều hoà Panasonic 2HP..." />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-[#666] mb-2">Số lượng tồn (tổng)</label>
                      <input type="number" min={1} value={formSoLuongTon} onChange={e => setFormSoLuongTon(+e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#B7705F]" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#666] mb-2">Mô tả danh mục</label>
                      <input type="text" value={formMoTa} onChange={e => setFormMoTa(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#B7705F]"
                        placeholder="Thông số kỹ thuật..." />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-semibold text-[#666] mb-2">Chi nhánh <span className="text-[#B7705F]">*</span></label>
                <select value={formBranch} onChange={e => setFormBranch(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#B7705F]">
                  {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-[#666] mb-2">Số lượng phân bổ</label>
                  <input type="number" min={1} value={formSoLuong} onChange={e => setFormSoLuong(+e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#B7705F]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#666] mb-2">Tình trạng</label>
                  <select value={formCondition} onChange={e => setFormCondition(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#B7705F]">
                    <option>Tốt</option>
                    <option>Hư hỏng nhẹ</option>
                    <option>Cần thay thế</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#666] mb-2">Ghi chú</label>
                <textarea rows={2} value={formNotes} onChange={e => setFormNotes(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#B7705F] resize-none"
                  placeholder="Số serial, thông tin bảo hành..." />
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button type="button" onClick={closeModal} className="px-5 py-2.5 text-[#666] font-medium hover:bg-gray-200 rounded-lg text-sm transition-colors">Hủy</button>
              <button type="submit" className="px-5 py-2.5 bg-[#B7705F] text-white font-semibold rounded-lg text-sm hover:bg-[#a06050] transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" /> Thêm tài sản
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Modal: Edit ────────────────────────────────────────────────── */}
      {modalMode === 'edit' && selectedRecord && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveEdit} className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="bg-[#FAF5F3] px-6 py-4 border-b border-[#EAD3CC]/50 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-[#8C4A3A]">Chỉnh sửa tài sản</h2>
                <p className="text-xs text-[#666] mt-0.5">{selectedRecord.maTaiSan} — {selectedRecord.tenTaiSan}</p>
              </div>
              <button type="button" onClick={closeModal} className="text-gray-400 hover:text-[#B7705F] text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#666] mb-1.5">Tên tài sản</label>
                  <input value={selectedRecord.tenTaiSan} readOnly className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm font-semibold text-gray-700" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#666] mb-1.5">Mã tài sản</label>
                  <input value={selectedRecord.maTaiSan} readOnly className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm font-mono text-gray-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#666] mb-1.5">Chi nhánh</label>
                <select value={formBranch} onChange={e => setFormBranch(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#B7705F]">
                  {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#666] mb-1.5">Số lượng</label>
                  <input type="number" min={1} value={formSoLuong} onChange={e => setFormSoLuong(+e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#B7705F]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#666] mb-1.5">Tình trạng</label>
                  <select value={formCondition} onChange={e => setFormCondition(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#B7705F]">
                    <option>Tốt</option>
                    <option>Hư hỏng nhẹ</option>
                    <option>Cần thay thế</option>
                    <option>Đã thanh lý</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#666] mb-1.5">Ghi chú</label>
                <textarea rows={3} value={formNotes} onChange={e => setFormNotes(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#B7705F] resize-none" />
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button type="button" onClick={closeModal} className="px-5 py-2.5 text-[#666] font-medium hover:bg-gray-200 rounded-lg text-sm transition-colors">Hủy</button>
              <button type="submit" className="px-5 py-2.5 bg-[#B7705F] text-white font-semibold rounded-lg text-sm hover:bg-[#a06050] transition-colors flex items-center gap-2">
                <Save className="w-4 h-4" /> Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      )}

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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs font-bold text-[#666] mb-1">Chi nhánh</span>
                  <p className="text-sm font-semibold text-[#8C4A3A]">{selectedRecord.branch}</p>
                </div>
                <div>
                  <span className="block text-xs font-bold text-[#666] mb-1">Số lượng</span>
                  <p className="text-sm font-bold text-gray-800">{selectedRecord.soLuong}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs font-bold text-[#666] mb-1">Tình trạng</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${conditionCls(selectedRecord.condition, selectedRecord.isPendingDeletion)}`}>
                    {selectedRecord.isPendingDeletion ? 'Chờ duyệt xóa' : selectedRecord.condition}
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-[#666] mb-1">Cập nhật lần cuối</span>
                  <p className="text-sm font-semibold text-gray-800">{selectedRecord.lastUpdated}</p>
                </div>
              </div>
              {selectedRecord.notes && (
                <div>
                  <span className="block text-xs font-bold text-[#666] mb-1">Ghi chú</span>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs text-gray-700 leading-relaxed">{selectedRecord.notes}</div>
                </div>
              )}
              {selectedRecord.isPendingDeletion && (
                <div className="bg-[#FAF5F3] border border-[#EAD3CC] p-4 rounded-xl space-y-3">
                  <p className="text-xs font-bold text-[#8C4A3A] flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Yêu cầu xóa từ Manager
                  </p>
                  <p className="text-xs text-[#333] italic">"{selectedRecord.deletionReason}"</p>
                  <div className="flex gap-2">
                    <button onClick={() => { setConfirmAction({ id: selectedRecord.id, type: 'reject', itemName: selectedRecord.tenTaiSan }); closeModal(); }}
                      className="flex-1 py-1.5 border border-[#EAD3CC] hover:bg-white text-[#666] font-semibold rounded-lg text-xs">Từ chối</button>
                    <button onClick={() => { setConfirmAction({ id: selectedRecord.id, type: 'approve', itemName: selectedRecord.tenTaiSan }); closeModal(); }}
                      className="flex-1 py-1.5 bg-[#B7705F] hover:bg-[#a06050] text-white font-semibold rounded-lg text-xs">Duyệt xóa</button>
                  </div>
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

      {/* ── Confirm dialog ─────────────────────────────────────────────── */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 bg-[#FAF5F3]">
                {confirmAction.type === 'reject' ? <XCircle className="h-6 w-6 text-[#B7705F]" /> : <Trash2 className="h-6 w-6 text-[#B7705F]" />}
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                {confirmAction.type === 'approve' ? 'Phê duyệt xóa tài sản' : confirmAction.type === 'delete' ? 'Xóa tài sản' : 'Từ chối yêu cầu xóa'}
              </h3>
              <p className="text-sm text-gray-500 mb-5">
                {confirmAction.type === 'reject'
                  ? `Từ chối yêu cầu xóa "${confirmAction.itemName}"? Trạng thái sẽ chuyển về "Cần thay thế".`
                  : `Xóa vĩnh viễn tài sản "${confirmAction.itemName}"? Hành động này không thể hoàn tác.`}
              </p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmAction(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">Hủy</button>
                <button onClick={handleConfirm} className="flex-1 py-2.5 bg-[#B7705F] text-white rounded-xl text-sm font-semibold hover:bg-[#a06050]">Xác nhận</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ──────────────────────────────────────────────────────── */}
      {toast && (
        <div className="fixed top-5 right-5 z-[110]">
          <div className={`flex items-center gap-3 p-4 rounded-xl shadow-lg border ${
            toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            'bg-[#FAF5F3] border-[#EAD3CC] text-gray-800'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" /> :
             toast.type === 'error' ? <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" /> :
             <Info className="w-5 h-5 text-[#B7705F] shrink-0" />}
            <span className="text-sm font-semibold">{toast.message}</span>
            <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600 text-lg font-bold leading-none pl-2">&times;</button>
          </div>
        </div>
      )}
    </div>
  );
}
