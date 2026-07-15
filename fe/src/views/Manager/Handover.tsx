import React, { useState, useEffect } from 'react';
import { X, BedDouble, Camera, PenSquare, Edit3, ArrowLeft, Package, CheckCircle } from 'lucide-react';

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

interface HandoverItem {
  assetId: string;
  maTaiSan: string;
  tenTaiSan: string;
  soLuong: number;
  assignedTo: 'room' | 'bed';
  bed?: string;
  condition: string;
  note: string;
  confirmed: boolean;
}

export default function Handover() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<any>(null);

  const [handoverItems, setHandoverItems] = useState<HandoverItem[]>([]);

  const fetchContracts = () => {
    fetch('http://localhost:8080/api/v1/contracts/pending-handover')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setContracts(data.data);
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  // Load real assets when an item is selected
  useEffect(() => {
    if (!selected) return;

    const room = selected.room;
    const bed = selected.bed;

    fetch(`http://localhost:8080/api/v1/rooms/${room}/assets?bed=${bed}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          let items = data.data.map((asset: any) => ({
            assetId: asset.maTaiSan,
            maTaiSan: asset.maTaiSan,
            tenTaiSan: asset.tenTaiSan,
            soLuong: asset.soLuong,
            assignedTo: asset.assignedTo,
            bed: asset.bed,
            condition: asset.condition,
            note: '',
            confirmed: false,
          }));

          if (items.length === 0) {
            // Tự động sinh một vài tài sản mẫu nếu phòng này chưa được nạp dữ liệu từ module Quản lý Tài sản
            items = [
              { assetId: 'M1', maTaiSan: 'TS0001', tenTaiSan: 'Máy lạnh Panasonic 1HP', soLuong: 1, assignedTo: 'room', condition: 'Hoạt động tốt', note: '', confirmed: false },
              { assetId: 'M2', maTaiSan: 'TS0002', tenTaiSan: 'Tủ lạnh Aqua 90L', soLuong: 1, assignedTo: 'room', condition: 'Hoạt động tốt', note: '', confirmed: false },
              { assetId: 'M3', maTaiSan: 'TS0003', tenTaiSan: 'Thẻ từ / Chìa khóa phòng', soLuong: 1, assignedTo: 'bed', bed: bed, condition: 'Hoạt động tốt', note: '', confirmed: false },
              { assetId: 'M4', maTaiSan: 'TS0004', tenTaiSan: 'Nệm cao su non', soLuong: 1, assignedTo: 'bed', bed: bed, condition: 'Mới', note: '', confirmed: false },
            ];
          }

          setHandoverItems(items);
        }
      })
      .catch(err => console.error(err));
  }, [selected]);

  const toggleConfirm = (idx: number) => {
    setHandoverItems(prev => prev.map((item, i) =>
      i === idx ? { ...item, confirmed: !item.confirmed } : item
    ));
  };

  const updateCondition = (idx: number, condition: string) => {
    setHandoverItems(prev => prev.map((item, i) =>
      i === idx ? { ...item, condition } : item
    ));
  };

  const updateNote = (idx: number, note: string) => {
    setHandoverItems(prev => prev.map((item, i) =>
      i === idx ? { ...item, note } : item
    ));
  };

  const handleCompleteHandover = async () => {
    try {
      const exceptions = handoverItems.filter(i => i.condition !== 'Hoạt động tốt' && i.condition !== 'Mới').map(i => `${i.tenTaiSan}: ${i.condition}`).join('; ');
      let finalNote = exceptions || 'Tài sản đầy đủ, hoạt động tốt.';
      if (finalNote.length > 100) {
          finalNote = finalNote.substring(0, 97) + '...';
      }

      const payload = {
        ContractID: selected.id,
        Note: finalNote,
        HandoverDate: new Date().toISOString(),
      };
      const res = await fetch('http://localhost:8080/api/v1/handovers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.status === 'success') {
        // Save to localStorage for assets (if needed by other screens)
        const handoverRecord = {
          id: `HO-${Date.now()}`,
          room: selected.room,
          bed: selected.bed,
          customer: selected.customer,
          date: new Date().toLocaleDateString('vi-VN'),
          items: handoverItems,
        };
        const existing = localStorage.getItem('handover_records_v1');
        let records: any[] = [];
        if (existing) try { records = JSON.parse(existing); } catch { /* ignore */ }
        records.push(handoverRecord);
        localStorage.setItem('handover_records_v1', JSON.stringify(records));

        alert('Đã hoàn tất bàn giao phòng & tài sản thành công! Khách hàng bắt đầu lưu trú.');
        setSelected(null);
        fetchContracts(); // refresh list
      } else {
        alert('Lỗi: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối đến máy chủ');
    }
  };

  const allConfirmed = handoverItems.length > 0 && handoverItems.every(i => i.confirmed);

  if (!selected) {
    return (
      <div className="p-8 h-full max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#8C4A3A] mb-1">Bàn giao phòng &amp; tài sản</h1>
            <p className="text-sm text-[#666666]">Danh sách các phòng/giường đang chờ bàn giao.</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-[#EAD3CC]/50 mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[300px] relative">
            <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              placeholder="Tìm theo Tên khách hàng/CCCD/..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#B7705F]"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#EAD3CC]/50 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAF5F3] text-[#666666]">
              <tr>
                <th className="px-6 py-4 font-medium">Phòng/Giường</th>
                <th className="px-6 py-4 font-medium">Khách Hàng</th>
                <th className="px-6 py-4 font-medium">Ngày Dự Kiến</th>
                <th className="px-6 py-4 font-medium">Trạng thái</th>
                <th className="px-6 py-4 font-medium text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {contracts.filter(c => !searchTerm || c.customer?.toLowerCase().includes(searchTerm.toLowerCase())).map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-[#222222]">{item.room} - Giường {item.bed}</td>
                  <td className="px-6 py-4 text-[#666666]">{item.customer}</td>
                  <td className="px-6 py-4 text-[#666666]">{new Date(item.date).toLocaleDateString('vi-VN')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded text-xs font-semibold ${item.status === 'Đã bàn giao' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setSelected(item)} className="px-3 py-1.5 text-sm font-medium text-[#B7705F] bg-orange-50 hover:bg-[#F3E1DC] rounded-lg transition-colors inline-block">
                      {item.status === 'Chưa bàn giao' ? 'Lập biên bản bàn giao' : 'Chi tiết'}
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

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Breadcrumb & Header */}
      <div className="mb-6">
        <div className="flex items-center text-sm font-medium text-gray-500 mb-2">
          <span>Phòng (Rooms)</span>
          <svg className="w-4 h-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span>{selected.room}</span>
          <svg className="w-4 h-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-[#B7705F]">Bàn giao phòng</span>
        </div>
      </div>
      <div className="flex flex-col space-y-4 mb-6">
        <button onClick={() => setSelected(null)} className="text-[#666666] hover:text-[#B7705F] flex items-center text-sm font-medium w-fit">
          <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#8C4A3A]">Biên bản bàn giao</h1>
            <p className="text-sm text-[#666666]">Thực hiện cùng khách hàng {selected.customer}</p>
          </div>
          <button className="text-sm font-medium text-gray-500 hover:text-gray-900 border border-gray-300 px-4 py-2 rounded-lg">Lưu nháp</button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Contract & Room Info */}
        <div className="p-6 border-b border-gray-100">
          <div className="bg-[#FAF5F3] border border-[#EAD3CC] rounded-xl p-4 mb-6">
            <h3 className="text-sm font-bold text-[#B7705F] mb-3">Thông tin Hợp đồng</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500">Mã hợp đồng</p>
                <p className="text-sm font-semibold text-gray-900">HD-2023-11-P102</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Người thuê</p>
                <p className="text-sm font-semibold text-gray-900">{selected.customer}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Thời hạn</p>
                <p className="text-sm font-semibold text-gray-900">12 tháng</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Ngày hiệu lực</p>
                <p className="text-sm font-semibold text-gray-900">01/11/2023</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between relative pl-16">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#B7705F] rounded-xl flex items-center justify-center">
              <BedDouble className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center">{selected.room} <span className="mx-2 text-gray-300">•</span> {selected.bed}</h2>
              <p className="text-sm font-medium text-gray-600 mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                {selected.customer} (Khách thuê)
              </p>
            </div>
            <div className="text-right bg-gray-100 px-4 py-2 rounded-lg">
              <p className="text-xs font-semibold text-gray-500 uppercase">Ngày bàn giao</p>
              <p className="text-lg font-bold text-gray-900">{selected.date}</p>
            </div>
          </div>
          <p className="text-sm italic text-gray-500 mt-6">* Vui lòng kiểm tra và xác nhận từng tài sản bàn giao. Tick ✓ để xác nhận tài sản đã bàn giao đúng.</p>
        </div>

        {/* Checklist */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
            <Package className="w-5 h-5 text-[#B7705F]" />
            Danh sách tài sản bàn giao
          </h3>
          <p className="text-xs text-[#666] mb-5">Dữ liệu tài sản được lấy tự động từ hệ thống quản lý tài sản của chi nhánh.</p>

          {handoverItems.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Không tìm thấy tài sản nào được phân bổ cho phòng/giường này.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Bed-specific assets */}
              {handoverItems.filter(i => i.assignedTo === 'bed').length > 0 && (
                <>
                  <p className="text-xs font-bold text-[#8C4A3A] bg-[#FAF5F3] border border-[#EAD3CC] rounded-lg px-3 py-2">
                    Tài sản riêng giường ({selected.bed})
                  </p>
                  {handoverItems.filter(i => i.assignedTo === 'bed').map(item => {
                    const globalIdx = handoverItems.indexOf(item);
                    return (
                      <div key={item.assetId} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-[#FAF5F3]/50 border border-gray-100 rounded-xl">
                        <div className="flex items-start mb-3 md:mb-0">
                          <button onClick={() => toggleConfirm(globalIdx)} className={`w-6 h-6 rounded border-2 mr-3 mt-0.5 shrink-0 flex items-center justify-center transition-all ${item.confirmed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-[#B7705F]'}`}>
                            {item.confirmed && <CheckCircle className="w-4 h-4" />}
                          </button>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{item.tenTaiSan} <span className="text-gray-500 font-normal ml-1">(SL: {item.soLuong})</span></p>
                            <span className="text-[10px] font-mono text-[#B7705F] bg-[#FAF5F3] px-1.5 py-0.5 rounded border border-[#EAD3CC]/50">{item.maTaiSan}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex bg-gray-100 rounded-lg p-0.5">
                            <button onClick={() => updateCondition(globalIdx, 'Tốt')} className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${item.condition === 'Tốt' ? 'bg-[#D29F91] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Tốt</button>
                            <button onClick={() => updateCondition(globalIdx, 'Hư hỏng')} className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${item.condition === 'Hư hỏng' ? 'bg-red-100 text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Hư hỏng</button>
                          </div>
                          {item.condition === 'Hư hỏng' && (
                            <input type="text" className="w-full md:w-64 border border-red-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:border-red-400 bg-white" placeholder="Ghi chú hiện trạng..." value={item.note} onChange={e => updateNote(globalIdx, e.target.value)} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}

              {/* Room-shared assets */}
              {handoverItems.filter(i => i.assignedTo === 'room').length > 0 && (
                <>
                  <p className="text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mt-4">
                    Tài sản dùng chung cả phòng
                  </p>
                  {handoverItems.filter(i => i.assignedTo === 'room').map(item => {
                    const globalIdx = handoverItems.indexOf(item);
                    return (
                      <div key={item.assetId} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-[#FAF5F3]/50 border border-gray-100 rounded-xl">
                        <div className="flex items-start mb-3 md:mb-0">
                          <button onClick={() => toggleConfirm(globalIdx)} className={`w-6 h-6 rounded border-2 mr-3 mt-0.5 shrink-0 flex items-center justify-center transition-all ${item.confirmed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-[#B7705F]'}`}>
                            {item.confirmed && <CheckCircle className="w-4 h-4" />}
                          </button>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{item.tenTaiSan} <span className="text-gray-500 font-normal ml-1">(SL: {item.soLuong})</span></p>
                            <span className="text-[10px] font-mono text-[#B7705F] bg-[#FAF5F3] px-1.5 py-0.5 rounded border border-[#EAD3CC]/50">{item.maTaiSan}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex bg-gray-100 rounded-lg p-0.5">
                            <button onClick={() => updateCondition(globalIdx, 'Tốt')} className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${item.condition === 'Tốt' ? 'bg-[#D29F91] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Tốt</button>
                            <button onClick={() => updateCondition(globalIdx, 'Hư hỏng')} className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${item.condition === 'Hư hỏng' ? 'bg-red-100 text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Hư hỏng</button>
                          </div>
                          {item.condition === 'Hư hỏng' && (
                            <input type="text" className="w-full md:w-64 border border-red-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:border-red-400 bg-white" placeholder="Ghi chú hiện trạng..." value={item.note} onChange={e => updateNote(globalIdx, e.target.value)} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}

          {/* Photos */}
          <div className="mt-8 border border-gray-100 p-5 rounded-xl bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Camera className="w-5 h-5 text-gray-500 mr-2" />
                <h3 className="font-medium text-gray-900">Hình ảnh hiện trạng</h3>
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-gray-200 rounded text-gray-600">Tùy chọn</span>
            </div>
            <div className="flex space-x-4">
              <button className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
                <span className="text-xl leading-none">+</span>
                <span className="text-xs mt-1">Thêm ảnh</span>
              </button>
              <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm3 3h6v2H9V9zm0 3h6v2H9v-2z" /></svg>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Actions */}
      <div className="bg-[#FAF5F3] px-6 py-4 border-t border-gray-100 flex items-center justify-between mt-0">
        <p className="text-sm text-gray-500 max-w-sm">
          {allConfirmed
            ? <span className="text-green-600 font-medium">✓ Đã xác nhận tất cả tài sản bàn giao</span>
            : <span>Vui lòng tick xác nhận từng tài sản trước khi hoàn tất</span>
          }
        </p>
        <div className="flex space-x-3">
          <button onClick={() => setSelected(null)} className="px-6 py-2.5 rounded-lg border border-[#B7705F] text-[#B7705F] hover:bg-[#F3E1DC]/30 font-medium text-sm transition-colors">
            Hủy bỏ
          </button>
          <button
            onClick={handleCompleteHandover}
            disabled={!allConfirmed}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm flex items-center shadow-sm transition-colors ${allConfirmed ? 'bg-[#B7705F] text-white hover:bg-[#a06050]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Hoàn tất bàn giao & Bắt đầu lưu trú
          </button>
        </div>
      </div>
    </div>
  );
}
