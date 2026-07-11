import React, { useState, useEffect } from 'react';
import { Search, Trash2, XCircle, CheckCircle2, AlertTriangle, ShieldCheck, Filter, Info, Eye } from 'lucide-react';

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

export default function AdminAssetsManagement() {
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

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCondition, setFilterCondition] = useState('Tất cả');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  
  // Custom Confirmation Dialog State
  const [confirmAction, setConfirmAction] = useState<{
    id: string;
    type: 'approve' | 'reject';
    itemName: string;
  } | null>(null);

  // Custom Toast State
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };
  
  // Listen for storage changes if role is switched in the same browser session
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('manager_assets');
      if (saved) {
        try {
          setAssets(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const saveToStorage = (updatedAssets: Asset[]) => {
    setAssets(updatedAssets);
    localStorage.setItem('manager_assets', JSON.stringify(updatedAssets));
  };

  // Initiate actions that require confirmation
  const initiateApproveDeletion = (id: string, itemName: string) => {
    setConfirmAction({ id, type: 'approve', itemName });
  };

  const initiateRejectDeletion = (id: string, itemName: string) => {
    setConfirmAction({ id, type: 'reject', itemName });
  };

  // Execute confirmed action
  const handleConfirmAction = () => {
    if (!confirmAction) return;
    const { id, type } = confirmAction;

    if (type === 'approve') {
      const updated = assets.filter(a => a.id !== id);
      saveToStorage(updated);
      setSelectedAsset(null);
      showToast(`Đã xóa vĩnh viễn tài sản ${id} thành công theo yêu cầu của Quản lý.`, 'success');
    } else if (type === 'reject') {
      const updated = assets.map(a => {
        if (a.id === id) {
          return {
            ...a,
            isPendingDeletion: false,
            deletionReason: undefined,
            condition: 'Cần thay thế',
            lastUpdated: new Date().toLocaleDateString('vi-VN')
          };
        }
        return a;
      });
      saveToStorage(updated);
      setSelectedAsset(null);
      showToast(`Đã từ chối yêu cầu xóa tài sản ${id}. Trạng thái đã chuyển sang "Cần thay thế".`, 'info');
    }

    setConfirmAction(null);
  };

  // Filter lists
  const deletionRequests = assets.filter(a => a.isPendingDeletion);
  
  const filteredAssets = assets.filter(item => {
    const matchesSearch = 
      item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.room.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCondition = filterCondition === 'Tất cả' || 
      (filterCondition === 'Yêu cầu xóa' && item.isPendingDeletion) ||
      (filterCondition !== 'Yêu cầu xóa' && item.condition === filterCondition);

    return matchesSearch && matchesCondition;
  });

  return (
    <div className="p-8 h-full max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8 border-b border-[#EAD3CC]/50 pb-6 flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1">Quản lý tài sản</h1>
            <p className="text-sm text-[#666666]">Tiếp nhận yêu cầu xóa tài sản từ Manager, phê duyệt xóa vĩnh viễn hoặc khôi phục trạng thái tài sản.</p>
         </div>
      </div>

      {/* Grid: Pending Requests Section and General List */}
      {deletionRequests.length > 0 && (
         <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
               <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
               <h2 className="text-lg font-bold text-red-800">Yêu cầu xóa tài sản đang chờ phê duyệt ({deletionRequests.length})</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {deletionRequests.map((req) => (
                  <div key={req.id} className="bg-red-50/60 border-2 border-red-200 rounded-xl p-5 shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md transition-all">
                     <div>
                        <div className="flex justify-between items-start">
                           <span className="font-mono text-xs font-bold text-[#B7705F] bg-white border border-[#EAD3CC] px-2 py-0.5 rounded">
                              {req.id}
                           </span>
                           <span className="text-xs text-gray-500 font-medium">Cập nhật: {req.lastUpdated}</span>
                        </div>
                        <h3 className="font-bold text-gray-900 mt-2 text-base">{req.item}</h3>
                        <p className="text-xs text-gray-600 mt-1 font-semibold">Phòng: {req.room} • Khách: {req.occupant}</p>
                        
                        <div className="mt-3 bg-white p-3 rounded-lg border border-red-100">
                           <p className="text-[11px] uppercase tracking-wider font-bold text-red-800">Lý do từ Manager:</p>
                           <p className="text-xs text-red-900 font-semibold mt-0.5 italic">"{req.deletionReason}"</p>
                        </div>
                     </div>

                     <div className="pt-4 border-t border-red-100 flex items-center justify-between gap-2 mt-4">
                        <button 
                          onClick={() => initiateRejectDeletion(req.id, req.item)}
                          className="flex-1 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold rounded-lg text-xs transition-colors flex items-center justify-center space-x-1"
                        >
                           <XCircle className="w-3.5 h-3.5" />
                           <span>Từ chối</span>
                        </button>
                        <button 
                          onClick={() => initiateApproveDeletion(req.id, req.item)}
                          className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center space-x-1 shadow-sm"
                        >
                           <Trash2 className="w-3.5 h-3.5" />
                           <span>Duyệt Xóa</span>
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-[#EAD3CC]/50 mb-6 flex flex-wrap gap-4 items-center justify-between">
         <div className="flex-1 min-w-[300px] relative">
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Tìm theo tên, mã tài sản, phòng hoặc ghi chú..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#B7705F]"
            />
         </div>
         <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-[#666666]" />
            <span className="text-xs font-semibold text-[#666666]">Lọc trạng thái:</span>
            <select 
              value={filterCondition}
              onChange={(e) => setFilterCondition(e.target.value)}
              className="border border-gray-200 rounded-lg text-sm px-4 py-2 bg-white focus:outline-none focus:border-[#B7705F]"
            >
               <option value="Tất cả">Tất cả tài sản</option>
               <option value="Yêu cầu xóa">Chờ duyệt xóa vĩnh viễn</option>
               <option value="Tốt">Tốt</option>
               <option value="Hư hỏng nhẹ">Hư hỏng nhẹ</option>
               <option value="Cần thay thế">Cần thay thế</option>
               <option value="Đã thanh lý">Đã thanh lý</option>
            </select>
         </div>
      </div>

      {/* Main Asset Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#EAD3CC]/50 overflow-hidden">
         <table className="w-full text-left text-sm">
            <thead className="bg-[#FAF5F3] text-[#666666]">
               <tr>
                  <th className="px-6 py-4 font-medium">Mã Tài Sản</th>
                  <th className="px-6 py-4 font-medium">Tên Tài Sản</th>
                  <th className="px-6 py-4 font-medium">Phòng</th>
                  <th className="px-6 py-4 font-medium">Khách Thuê</th>
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
                      <td className="px-6 py-4">
                         <div className="font-semibold text-gray-900">{item.item}</div>
                         {item.notes && <p className="text-[11px] text-gray-400 mt-0.5 truncate max-w-xs">{item.notes}</p>}
                      </td>
                      <td className="px-6 py-4 text-[#666666] font-medium">{item.room}</td>
                      <td className="px-6 py-4 text-[#666666] text-xs font-medium">{item.occupant}</td>
                      <td className="px-6 py-4">
                        {item.isPendingDeletion ? (
                          <span className="inline-flex items-center px-2.5 py-1 bg-red-100 border border-red-200 text-red-700 text-xs font-bold rounded-full">
                             Chờ duyệt xóa
                          </span>
                        ) : (
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            item.condition === 'Tốt' ? 'bg-green-50 text-green-600 border border-green-200' : 
                            item.condition === 'Hư hỏng nhẹ' ? 'bg-orange-50 text-orange-600 border border-orange-200' :
                            item.condition === 'Cần thay thế' ? 'bg-red-50 text-red-600 border border-red-100' :
                            'bg-gray-100 text-gray-700 border border-gray-200'
                          }`}>
                            {item.condition}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                         <button 
                           onClick={() => setSelectedAsset(item)} 
                           className="px-3 py-1.5 text-xs font-bold text-[#B7705F] bg-orange-50 hover:bg-[#F3E1DC] rounded-lg transition-colors inline-flex items-center"
                         >
                            <Eye className="w-3 h-3 mr-1" /> Chi tiết
                         </button>
                      </td>
                   </tr>
                 ))
               )}
            </tbody>
         </table>
      </div>

      {/* Modal View details for Admin */}
      {selectedAsset && (
         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
               <div className="bg-[#FAF5F3] px-6 py-4 border-b border-[#EAD3CC]/50 flex justify-between items-center">
                  <div>
                      <h2 className="text-lg font-bold text-[#8C4A3A]">Chi tiết tài sản</h2>
                      <p className="text-xs text-[#666666] mt-0.5">Mã: {selectedAsset.id}</p>
                  </div>
                  <button onClick={() => setSelectedAsset(null)} className="text-gray-400 hover:text-[#B7705F] text-2xl leading-none">&times;</button>
               </div>
               
               <div className="p-6 space-y-4">
                  <div>
                     <span className="block text-xs font-bold text-[#666666] uppercase tracking-wider mb-1">Tên tài sản</span>
                     <p className="text-base font-bold text-gray-900">{selectedAsset.item}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <span className="block text-xs font-bold text-[#666666] uppercase tracking-wider mb-1">Phòng</span>
                        <p className="text-sm font-semibold text-gray-800">{selectedAsset.room}</p>
                     </div>
                     <div>
                        <span className="block text-xs font-bold text-[#666666] uppercase tracking-wider mb-1">Người đang ở</span>
                        <p className="text-sm font-semibold text-gray-800">{selectedAsset.occupant}</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <span className="block text-xs font-bold text-[#666666] uppercase tracking-wider mb-1">Tình trạng thực tế</span>
                        <p className="text-sm">
                           <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                             selectedAsset.condition === 'Tốt' ? 'bg-green-50 text-green-600' :
                             selectedAsset.condition === 'Hư hỏng nhẹ' ? 'bg-orange-50 text-orange-600' :
                             'bg-red-50 text-red-600'
                           }`}>
                              {selectedAsset.condition}
                           </span>
                        </p>
                     </div>
                     <div>
                        <span className="block text-xs font-bold text-[#666666] uppercase tracking-wider mb-1">Cập nhật lần cuối</span>
                        <p className="text-sm font-semibold text-gray-800">{selectedAsset.lastUpdated}</p>
                     </div>
                  </div>

                  {selectedAsset.notes && (
                    <div>
                       <span className="block text-xs font-bold text-[#666666] uppercase tracking-wider mb-1">Mô tả / Ghi chú lịch sử</span>
                       <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs text-gray-700 leading-relaxed font-medium">
                          {selectedAsset.notes}
                       </div>
                    </div>
                  )}

                  {selectedAsset.isPendingDeletion && (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-xl space-y-2">
                       <p className="text-xs font-bold text-red-800 uppercase tracking-wider flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-1.5 text-red-600" />
                          Có yêu cầu xóa từ Quản lý (Manager)
                       </p>
                       <p className="text-xs text-red-900 font-semibold italic">"Lý do: {selectedAsset.deletionReason}"</p>
                       
                       <div className="pt-3 flex items-center space-x-2">
                          <button 
                            type="button" 
                            onClick={() => initiateRejectDeletion(selectedAsset.id, selectedAsset.item)}
                            className="flex-1 py-1.5 border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 font-bold rounded-lg text-xs transition-colors"
                          >
                             Từ chối xóa
                          </button>
                          <button 
                            type="button" 
                            onClick={() => initiateApproveDeletion(selectedAsset.id, selectedAsset.item)}
                            className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs transition-colors shadow-sm"
                          >
                             Duyệt xóa vĩnh viễn
                          </button>
                       </div>
                    </div>
                  )}
               </div>

               <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                  <button 
                    onClick={() => setSelectedAsset(null)} 
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-xs font-bold transition-colors"
                  >
                     Đóng
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* Custom Confirmation Dialog Modal */}
      {confirmAction && (
         <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
               <div className="p-6 text-center">
                  <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 ${
                     confirmAction.type === 'approve' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                     {confirmAction.type === 'approve' ? <Trash2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                     {confirmAction.type === 'approve' ? 'Xác nhận xóa vĩnh viễn' : 'Xác nhận từ chối xóa'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                     {confirmAction.type === 'approve' 
                        ? `Bạn có chắc chắn muốn PHÊ DUYỆT XÓA VĨNH VIỄN tài sản "${confirmAction.itemName}" (${confirmAction.id})? Hành động này không thể hoàn tác.`
                        : `Từ chối yêu cầu xóa tài sản "${confirmAction.itemName}" (${confirmAction.id})? Trạng thái tài sản sẽ chuyển lại thành "Cần thay thế".`
                     }
                  </p>
                  <div className="flex space-x-3">
                     <button
                        type="button"
                        onClick={() => setConfirmAction(null)}
                        className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                     >
                        Hủy bỏ
                     </button>
                     <button
                        type="button"
                        onClick={handleConfirmAction}
                        className={`flex-1 py-2.5 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm ${
                           confirmAction.type === 'approve' ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'
                        }`}
                     >
                        Xác nhận
                     </button>
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* Custom Toast Notification */}
      {toast && (
         <div className="fixed top-5 right-5 z-[110] animate-in fade-in slide-in-from-top-5 duration-300">
            <div className={`flex items-center space-x-3 p-4 rounded-xl shadow-lg border ${
               toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
               toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
               'bg-[#FAF5F3] border-[#EAD3CC] text-gray-800'
            }`}>
               {toast.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
               ) : toast.type === 'error' ? (
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
               ) : (
                  <Info className="w-5 h-5 text-[#B7705F] shrink-0" />
               )}
               <span className="text-sm font-semibold">{toast.message}</span>
               <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600 text-lg font-bold leading-none pl-2">&times;</button>
            </div>
         </div>
      )}
    </div>
  );
}
