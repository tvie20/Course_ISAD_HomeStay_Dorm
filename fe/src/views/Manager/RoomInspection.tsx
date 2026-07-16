import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Send, Search, Package, AlertTriangle, CheckCircle } from 'lucide-react';

// Matches Manager's AssetRecord
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
  assignedTo: 'room' | 'bed';
  bed?: string;
}

interface InspectionItem {
  assetId: string;
  maTaiSan: string;
  tenTaiSan: string;
  soLuong: number;
  assignedTo: 'room' | 'bed';
  bed?: string;
  conditionBefore: string;
  conditionAfter: string;
  note: string;
  isDisabled: boolean; // true = tài sản dùng chung phòng mà phòng còn người → không kiểm tra
}

// Mock occupants per room to simulate who is still living
const ROOM_OCCUPANTS: Record<string, { bed: string; customer: string; isLeaving: boolean }[]> = {
  'P.101': [
    { bed: 'Giường 01', customer: 'Nguyễn Văn A', isLeaving: false },
    { bed: 'Giường 02', customer: 'Lê Thị C', isLeaving: false },
  ],
  'P.102': [
    { bed: 'Giường 01', customer: 'Trần Văn B', isLeaving: false },
    { bed: 'Giường 02', customer: 'Phạm Thị D', isLeaving: false },
    { bed: 'Giường 03', customer: '', isLeaving: false },
    { bed: 'Giường 04', customer: '', isLeaving: false },
  ],
  'P.103': [
    { bed: 'Giường 01', customer: 'Phạm Thị D', isLeaving: false },
  ],
  'P.301': [
    { bed: 'Giường 01', customer: 'Khách hàng P.301', isLeaving: false },
    { bed: 'Giường 02', customer: 'Khách hàng 2', isLeaving: false },
  ],
  'P.302': [
    { bed: 'Giường 01', customer: 'Trần Thị Sinh Viên', isLeaving: false },
    { bed: 'Giường 02', customer: '', isLeaving: false },
  ],
};

const MOCK_LIST = [
  { id: '1', room: 'P.102', date: '21/10/2023', status: 'Bình thường' },
  { id: '2', room: 'P.301', date: '20/10/2023', status: 'Bình thường' },
];

const conditionCls = (cond: string) => {
  switch (cond) {
    case 'Tốt': return 'bg-green-50 text-green-700';
    case 'Hư hỏng': case 'Hư hỏng nhẹ': return 'bg-red-50 text-red-600';
    case 'Mất': return 'bg-gray-100 text-gray-700';
    default: return 'bg-gray-50 text-gray-500';
  }
};

export default function RoomInspection() {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [inspectionList, setInspectionList] = useState<any[]>(MOCK_LIST);
  const [inspectionItems, setInspectionItems] = useState<InspectionItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [inspectionType, setInspectionType] = useState<'regular' | 'checkout'>('regular');

  // Load checkout flow request and active rooms
  useEffect(() => {
    fetch('http://localhost:8080/api/v1/handovers/occupied')
      .then(res => res.json())
      .then(apiData => {
        let baseList: any[] = [];
        if (apiData.status === 'success') {
          baseList = apiData.data;
        }

        const saved = localStorage.getItem('checkout_flow_request');
        if (saved) {
          const data = JSON.parse(saved);
          if (data.status === 'Chờ duyệt' || data.status === 'Đang kiểm tra phòng') {
            const flowItem = {
              id: 'flow_req_1',
              room: data.room,
              bed: data.bed,
              customer: data.customer,
              date: data.date,
              status: 'Yêu cầu trả phòng',
              isFlowRequest: true
            };
            setInspectionList([flowItem, ...baseList]);
          } else {
            setInspectionList(baseList);
          }
        } else {
          setInspectionList(baseList);
        }
      })
      .catch(err => {
        console.error(err);
        setInspectionList(MOCK_LIST);
      });
  }, [selectedItem]);

  // Load real assets when an item is selected
  useEffect(() => {
    if (!selectedItem) return;
    const isCheckout = selectedItem.isFlowRequest;
    setInspectionType(isCheckout ? 'checkout' : 'regular');

    // Load Manager's asset records (fallback or for regular inspection)
    const rawRecords = localStorage.getItem('asset_records_manager_v3');
    let records: AssetRecord[] = [];
    if (rawRecords) {
      try { records = JSON.parse(rawRecords); } catch { /* ignore */ }
    }

    const room = selectedItem.room;
    const bed = selectedItem.bed; // e.g. 'Giường 01'
    
    if (isCheckout && bed) {
      // Checkout mode: determine if room still has other occupants
      const occupants = ROOM_OCCUPANTS[room] || [];
      const otherOccupants = occupants.filter(o => o.bed !== bed && o.customer);
      const isLastPerson = otherOccupants.length === 0;

      // Try to load from handover records first
      const rawHandover = localStorage.getItem('handover_records_v1');
      let hoRecords: any[] = [];
      if (rawHandover) try { hoRecords = JSON.parse(rawHandover); } catch {}
      
      // Inject mock handover for P.301 if it doesn't exist
      if (!hoRecords.some(r => r.room === 'P.301' && r.bed === 'Giường 01' && r.customer === 'Khách hàng P.301')) {
        hoRecords.push({
          id: 'HO-MOCK-301',
          room: 'P.301',
          bed: 'Giường 01',
          customer: 'Khách hàng P.301',
          date: '05/11/2023',
          items: [
             { assetId: 'MR-006', maTaiSan: 'TS-001', tenTaiSan: 'Máy lạnh Daikin 1.5HP', soLuong: 1, assignedTo: 'room', condition: 'Tốt', note: '', confirmed: true },
             { assetId: 'MR-007', maTaiSan: 'TS-005', tenTaiSan: 'Chìa khóa thẻ từ', soLuong: 1, assignedTo: 'bed', bed: 'Giường 01', condition: 'Tốt', note: '', confirmed: true },
             { assetId: 'MR-008', maTaiSan: 'TS-003', tenTaiSan: 'Giường tầng gỗ', soLuong: 1, assignedTo: 'bed', bed: 'Giường 01', condition: 'Tốt', note: '', confirmed: true },
          ]
        });
        localStorage.setItem('handover_records_v1', JSON.stringify(hoRecords));
      }
      
      // Find the handover record for this customer/bed
      const hoRecord = hoRecords.reverse().find(r => r.room === room && r.bed === bed && r.customer === selectedItem.customer);

      let sourceAssets = [];
      if (hoRecord && hoRecord.items) {
        // Convert HandoverItem back to a format similar to AssetRecord for processing
        sourceAssets = hoRecord.items;
      } else {
        // Fallback to current room assets if no handover record found
        sourceAssets = records.filter(r => r.room === room);
      }

      const items: InspectionItem[] = sourceAssets.map(asset => {
        const isBedSpecific = asset.assignedTo === 'bed';
        const isThisBed = isBedSpecific && asset.bed === bed;
        const isRoomShared = asset.assignedTo === 'room';

        let isDisabled = false;
        if (isRoomShared && !isLastPerson) {
          // Tài sản dùng chung mà phòng còn người khác → mờ, không kiểm tra
          isDisabled = true;
        }
        if (isBedSpecific && !isThisBed) {
          // Tài sản riêng giường khác → không hiển thị
          return null;
        }

        return {
          assetId: asset.assetId || asset.id,
          maTaiSan: asset.maTaiSan,
          tenTaiSan: asset.tenTaiSan,
          soLuong: asset.soLuong,
          assignedTo: asset.assignedTo,
          bed: asset.bed,
          conditionBefore: asset.condition,
          conditionAfter: asset.condition,
          note: '',
          isDisabled,
        };
      }).filter(Boolean) as InspectionItem[];

      setInspectionItems(items);
    } else {
      // Regular inspection: show all assets in the room
      const roomAssets = records.filter(r => r.room === room);
      const items: InspectionItem[] = roomAssets.map(asset => ({
        assetId: asset.id,
        maTaiSan: asset.maTaiSan,
        tenTaiSan: asset.tenTaiSan,
        soLuong: asset.soLuong,
        assignedTo: asset.assignedTo,
        bed: asset.bed,
        conditionBefore: asset.condition,
        conditionAfter: asset.condition,
        note: '',
        isDisabled: false,
      }));
      setInspectionItems(items);
    }
  }, [selectedItem]);

  const updateItem = (idx: number, field: keyof InspectionItem, value: string) => {
    setInspectionItems(prev => prev.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item
    ));
  };

  const handleSave = () => {
    // Save inspection result to localStorage for Accountant to read
    const result = {
      room: selectedItem.room,
      bed: selectedItem.bed,
      customer: selectedItem.customer,
      date: new Date().toLocaleDateString('vi-VN'),
      type: inspectionType,
      items: inspectionItems.filter(i => !i.isDisabled),
      damagedItems: inspectionItems.filter(i => !i.isDisabled && (i.conditionAfter === 'Hư hỏng' || i.conditionAfter === 'Mất')),
    };
    localStorage.setItem('inspection_result_v1', JSON.stringify(result));

    // Also update the condition in Manager's asset records
    const rawRecords = localStorage.getItem('asset_records_manager_v2');
    if (rawRecords) {
      try {
        let records: AssetRecord[] = JSON.parse(rawRecords);
        inspectionItems.filter(i => !i.isDisabled).forEach(item => {
          records = records.map(r =>
            r.id === item.assetId
              ? { ...r, condition: item.conditionAfter, lastUpdated: new Date().toLocaleDateString('vi-VN') }
              : r
          );
        });
        localStorage.setItem('asset_records_manager_v2', JSON.stringify(records));
      } catch { /* ignore */ }
    }

    alert('Đã lưu thông tin kiểm tra thành công!');
  };

  const handleSendToAccountant = () => {
    handleSave();

    if (selectedItem?.isFlowRequest) {
      const saved = localStorage.getItem('checkout_flow_request');
      if (saved) {
        const data = JSON.parse(saved);
        data.status = 'Đã kiểm tra phòng';
        localStorage.setItem('checkout_flow_request', JSON.stringify(data));
      }
      setSelectedItem(null);
      alert('Đã chuyển thông tin kiểm tra phòng/giường cho bộ phận Kế toán thành công!');
    } else {
      setSelectedItem(null);
      alert('Đã chuyển thông tin thành công!');
    }
  };

  const filteredList = inspectionList.filter(item => {
    const q = searchTerm.toLowerCase();
    const matchSearch = q === '' || (
      item.room.toLowerCase().includes(q)
      || (item.customer && item.customer.toLowerCase().includes(q))
      || (item.bed && item.bed.toLowerCase().includes(q))
    );
    const matchStatus = statusFilter === '' || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // ── LIST VIEW ──────────────────────────────────────────────────────────
  if (!selectedItem) {
    return (
      <div className="p-8 h-full max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
           <div>
              <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1">Kiểm tra phòng</h1>
              <p className="text-sm text-[#666666]">Kiểm tra tài sản bàn giao, đánh giá hiện trạng, ghi nhận phát sinh.</p>
           </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-[#EAD3CC]/50 mb-6 flex flex-wrap gap-4 items-center">
           <div className="flex-1 min-w-[300px] relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Tìm theo phòng, khách hàng, giường..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#B7705F]"
              />
           </div>
           
           <div className="flex items-center space-x-2">
             <span className="text-xs font-semibold text-gray-500 uppercase">Trạng thái:</span>
             <select 
               value={statusFilter}
               onChange={(e) => setStatusFilter(e.target.value)}
               className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:border-[#B7705F]"
             >
               <option value="">Tất cả trạng thái</option>
               <option value="Bình thường">Bình thường</option>
               <option value="Yêu cầu trả phòng">Yêu cầu trả phòng</option>
             </select>
           </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#EAD3CC]/50 overflow-hidden">
            <table className="w-full text-left text-sm">
               <thead className="bg-[#FAF5F3] text-[#666666]">
                  <tr>
                     <th className="px-6 py-4 font-medium">Phòng</th>
                     <th className="px-6 py-4 font-medium">Ngày cập nhật</th>
                     <th className="px-6 py-4 font-medium">Trạng thái</th>
                     <th className="px-6 py-4 font-medium text-right">Thao Tác</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {filteredList.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                       <td className="px-6 py-4 font-medium text-[#222222]">
                          {item.isFlowRequest ? (
                            <div>
                              <span>{item.room} - {item.bed}</span>
                              <span className="block text-xs text-[#666]">{item.customer}</span>
                            </div>
                          ) : item.room}
                       </td>
                       <td className="px-6 py-4 text-[#666666]">{item.date}</td>
                       <td className="px-6 py-4">
                         <span className={`px-2.5 py-1 rounded text-xs font-semibold ${
                           item.status === 'Bình thường' ? 'bg-green-50 text-green-600' :
                           item.status === 'Yêu cầu trả phòng' ? 'bg-orange-50 text-orange-600 border border-orange-200' :
                           'bg-[#FAF5F3] text-[#B7705F]'
                         }`}>
                           {item.status}
                         </span>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <button onClick={() => setSelectedItem(item)} className="px-3 py-1.5 text-sm font-medium text-[#B7705F] bg-orange-50 hover:bg-[#F3E1DC] rounded-lg transition-colors inline-block">
                             {item.isFlowRequest ? 'Kiểm tra tài sản' : 'Chi tiết'}
                          </button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    );
  }

  // ── DETAIL VIEW: Inspection Form ───────────────────────────────────────
  const enabledItems = inspectionItems.filter(i => !i.isDisabled);
  const disabledItems = inspectionItems.filter(i => i.isDisabled);
  const damagedCount = enabledItems.filter(i => i.conditionAfter === 'Hư hỏng' || i.conditionAfter === 'Mất').length;

  return (
    <div className="p-8 h-full max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center text-sm font-medium text-gray-500 mb-2">
           <span>Phòng (Rooms)</span>
           <svg className="w-4 h-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
           <span>{selectedItem.isFlowRequest ? `${selectedItem.room} - ${selectedItem.bed}` : selectedItem.room}</span>
           <svg className="w-4 h-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
           <span className="text-[#B7705F]">Kiểm tra tài sản</span>
        </div>
      </div>
      <div className="flex justify-between items-end mb-6">
         <div>
            <div className="flex items-center space-x-3 mb-2">
               <button onClick={() => setSelectedItem(null)} className="text-[#666666] hover:text-[#B7705F] flex items-center text-sm font-medium">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại
               </button>
            </div>
            <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1">
               Kiểm tra - {selectedItem.isFlowRequest ? `${selectedItem.room} - ${selectedItem.bed}` : selectedItem.room}
            </h1>
            {selectedItem.isFlowRequest && (
              <p className="text-sm text-[#666666]">Khách thuê: <span className="font-semibold text-gray-900">{selectedItem.customer}</span> (Yêu cầu trả phòng)</p>
            )}
         </div>
         <div className="flex items-center gap-2">
            {inspectionType === 'checkout' && (
              <span className="px-3 py-1.5 bg-orange-50 text-orange-700 border border-orange-200 rounded-full text-xs font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Kiểm tra trả phòng
              </span>
            )}
            {inspectionType === 'regular' && (
              <span className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-bold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Kiểm tra định kỳ
              </span>
            )}
         </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-[#EAD3CC]/50 shadow-sm p-4">
          <p className="text-xs text-[#666] font-medium">Tổng tài sản kiểm tra</p>
          <p className="text-2xl font-bold text-[#8C4A3A] mt-1">{enabledItems.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#EAD3CC]/50 shadow-sm p-4">
          <p className="text-xs text-[#666] font-medium">Hư hỏng / Mất</p>
          <p className={`text-2xl font-bold mt-1 ${damagedCount > 0 ? 'text-red-600' : 'text-green-700'}`}>{damagedCount}</p>
        </div>
        {disabledItems.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <p className="text-xs text-gray-500 font-medium">Chưa kiểm tra (phòng còn người)</p>
            <p className="text-2xl font-bold text-gray-700 mt-1">{disabledItems.length}</p>
          </div>
        )}
      </div>

      {/* Asset Inspection List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
         <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
              <Package className="w-5 h-5 text-[#B7705F]" />
              Danh sách tài sản cần kiểm tra
            </h3>
            <p className="text-xs text-[#666] mb-5">Đánh giá tình trạng từng tài sản đã bàn giao. Dữ liệu được lấy từ hệ thống quản lý tài sản.</p>

            {inspectionItems.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Không tìm thấy tài sản nào được phân bổ cho phòng/giường này.</p>
                <p className="text-xs mt-1">Hãy phân bổ tài sản vào phòng trong mục "Quản lý tài sản" trước.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Enabled items (can inspect) */}
                {enabledItems.map((item, _idx) => {
                  const globalIdx = inspectionItems.indexOf(item);
                  return (
                    <div key={item.assetId} className="flex flex-col md:flex-row md:items-start justify-between p-4 bg-[#FAF5F3]/50 border border-gray-100 rounded-xl">
                      <div className="flex items-start mb-3 md:mb-0">
                         <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 mr-3 shrink-0">
                           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                         </div>
                         <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              {item.tenTaiSan} <span className="text-gray-500 font-normal ml-1">(SL: {item.soLuong})</span>
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-mono text-[#B7705F] bg-[#FAF5F3] px-1.5 py-0.5 rounded border border-[#EAD3CC]/50">{item.maTaiSan}</span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.assignedTo === 'room' ? 'bg-gray-100 text-gray-600' : 'bg-[#FAF5F3] text-[#8C4A3A]'}`}>
                                {item.assignedTo === 'room' ? 'Dùng chung' : `Riêng: ${item.bed}`}
                              </span>
                              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${conditionCls(item.conditionBefore)}`}>
                                Trước: {item.conditionBefore}
                              </span>
                            </div>
                         </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2 w-full md:w-auto mt-2 md:mt-0">
                         <div className="flex items-center space-x-1">
                            <div className="flex bg-gray-100 rounded-lg p-0.5">
                               <button onClick={() => updateItem(globalIdx, 'conditionAfter', 'Tốt')}
                                 className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${item.conditionAfter === 'Tốt' ? 'bg-green-100 text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Tốt</button>
                               <button onClick={() => updateItem(globalIdx, 'conditionAfter', 'Hư hỏng')}
                                 className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${item.conditionAfter === 'Hư hỏng' ? 'bg-red-100 text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Hư hỏng</button>
                               <button onClick={() => updateItem(globalIdx, 'conditionAfter', 'Mất')}
                                 className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${item.conditionAfter === 'Mất' ? 'bg-gray-200 text-gray-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Mất</button>
                            </div>
                         </div>
                         {(item.conditionAfter === 'Hư hỏng' || item.conditionAfter === 'Mất') && (
                           <div className="w-full md:w-80 space-y-2 mt-2">
                             <input type="text" 
                               className="w-full border border-red-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:border-red-400 bg-white" 
                               placeholder="Ghi chú chi tiết hiện trạng..." 
                               value={item.note}
                               onChange={e => updateItem(globalIdx, 'note', e.target.value)}
                             />
                           </div>
                         )}
                      </div>
                    </div>
                  );
                })}

                {/* Disabled items (room-shared, room still has people) */}
                {disabledItems.length > 0 && (
                  <>
                    <div className="flex items-center gap-2 mt-6 mb-2">
                      <div className="h-px flex-1 bg-gray-200"></div>
                      <span className="text-xs font-bold text-gray-500 px-2">Tài sản dùng chung — Chưa kiểm tra</span>
                      <div className="h-px flex-1 bg-gray-200"></div>
                    </div>
                    <p className="text-xs text-gray-500 mb-3 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                      Các tài sản dùng chung dưới đây chưa được kiểm tra vì phòng vẫn còn người ở. Tài sản này sẽ được kiểm tra khi người cuối cùng trả phòng.
                    </p>
                    {disabledItems.map(item => (
                      <div key={item.assetId} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl opacity-60">
                        <div className="flex items-start">
                           <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 mr-3 shrink-0">
                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                           </div>
                           <div>
                              <p className="font-semibold text-gray-500 text-sm">
                                {item.tenTaiSan} <span className="font-normal ml-1">(SL: {item.soLuong})</span>
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{item.maTaiSan}</span>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-400">Dùng chung</span>
                              </div>
                           </div>
                        </div>
                        <span className="text-xs text-gray-400 font-medium italic">Phòng còn người ở</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
         </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
         <button onClick={handleSave} className="px-6 py-2.5 border border-[#B7705F] text-[#B7705F] hover:bg-[#F3E1DC]/30 rounded-lg font-medium flex items-center transition-colors text-sm">
            <Save className="w-4 h-4 mr-2" />
            Lưu thông tin
         </button>
         <button onClick={handleSendToAccountant} className="px-6 py-2.5 bg-[#B7705F] text-white hover:bg-[#A06050] rounded-lg font-medium flex items-center shadow-sm transition-colors text-sm">
            <Send className="w-4 h-4 mr-2" />
            {selectedItem.isFlowRequest ? 'Gửi biên bản cho Kế toán' : 'Lưu & hoàn tất kiểm tra'}
         </button>
      </div>

    </div>
  );
}
