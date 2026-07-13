import React, { useState } from 'react';
import { Search, ArrowLeft, MapPin, CheckCircle, XCircle, HelpCircle } from 'lucide-react';

interface Bed {
  bedId: string;
  price: number;
  status: 'Đã thuê' | 'Trống';
  note: string;
}

interface Room {
  id: string; // e.g. RM-101
  roomCode: string; // e.g. Phòng 101
  name: string; // e.g. Phòng Harmony A1
  type: string; // e.g. Phòng 4 người
  floor: string; // e.g. 1
  capacity: number; // e.g. 4
  branch: string; // e.g. CN Quận 1
  fullBranchName: string; // e.g. Homestay Central Park
  status: 'Đã thuê' | 'Trống' | 'BẢO TRÌ';
  beds: Bed[];
}

// Initial mock dataset representing rooms and their beds
const INITIAL_ROOMS_DATA: Room[] = [
  {
    id: 'RM-101',
    roomCode: 'Phòng 101',
    name: 'Phòng Harmony A1',
    type: 'Phòng 4 người',
    floor: '1',
    capacity: 4,
    branch: 'CN Quận 1',
    fullBranchName: 'Homestay Central Park',
    status: 'Đã thuê',
    beds: [
      { bedId: 'Giường 1', price: 1500000, status: 'Đã thuê', note: 'Giường dưới' },
      { bedId: 'Giường 2', price: 1500000, status: 'Đã thuê', note: 'Giường trên' },
      { bedId: 'Giường 3', price: 1500000, status: 'Đã thuê', note: 'Giường dưới' },
      { bedId: 'Giường 4', price: 1500000, status: 'Đã thuê', note: 'Giường trên' },
    ]
  },
  {
    id: 'RM-102',
    roomCode: 'Phòng 102',
    name: 'Phòng Harmony A2',
    type: 'Phòng 4 người',
    floor: '1',
    capacity: 4,
    branch: 'CN Quận 1',
    fullBranchName: 'Homestay Central Park',
    status: 'Đã thuê',
    beds: [
      { bedId: 'Giường 1', price: 1500000, status: 'Đã thuê', note: 'Giường dưới' },
      { bedId: 'Giường 2', price: 1500000, status: 'Trống', note: 'Giường trên' },
      { bedId: 'Giường 3', price: 1500000, status: 'Đã thuê', note: 'Giường dưới' },
      { bedId: 'Giường 4', price: 1500000, status: 'Trống', note: 'Giường trên' },
    ]
  },
  {
    id: 'RM-201',
    roomCode: 'Phòng 201',
    name: 'Phòng Harmony B1',
    type: 'Phòng 6 người',
    floor: '2',
    capacity: 6,
    branch: 'CN Quận 3',
    fullBranchName: 'Sunrise Riverside',
    status: 'Trống',
    beds: [
      { bedId: 'Giường 1', price: 1200000, status: 'Trống', note: 'Giường dưới' },
      { bedId: 'Giường 2', price: 1200000, status: 'Trống', note: 'Giường trên' },
      { bedId: 'Giường 3', price: 1200000, status: 'Trống', note: 'Giường dưới' },
      { bedId: 'Giường 4', price: 1200000, status: 'Trống', note: 'Giường trên' },
      { bedId: 'Giường 5', price: 1200000, status: 'Trống', note: 'Giường dưới' },
      { bedId: 'Giường 6', price: 1200000, status: 'Trống', note: 'Giường trên' },
    ]
  },
  {
    id: 'RM-202',
    roomCode: 'Phòng 202',
    name: 'Phòng Serene B2',
    type: 'Phòng 4 người',
    floor: '2',
    capacity: 4,
    branch: 'CN Quận 3',
    fullBranchName: 'Sunrise Riverside',
    status: 'Đã thuê',
    beds: [
      { bedId: 'Giường 1', price: 1600000, status: 'Đã thuê', note: 'Giường dưới' },
      { bedId: 'Giường 2', price: 1600000, status: 'Đã thuê', note: 'Giường trên' },
      { bedId: 'Giường 3', price: 1600000, status: 'Đã thuê', note: 'Giường dưới' },
      { bedId: 'Giường 4', price: 1600000, status: 'Trống', note: 'Giường trên' },
    ]
  },
  {
    id: 'RM-301',
    roomCode: 'Phòng 301',
    name: 'Phòng Luxury C1',
    type: 'Phòng 2 người',
    floor: '3',
    capacity: 2,
    branch: 'CN Quận 1',
    fullBranchName: 'Homestay Central Park',
    status: 'BẢO TRÌ',
    beds: [
      { bedId: 'Giường 1', price: 2000000, status: 'Trống', note: 'Giường dưới' },
      { bedId: 'Giường 2', price: 2000000, status: 'Trống', note: 'Giường trên' },
    ]
  }
];

export default function RoomStatus() {
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [floorFilter, setFloorFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Results & UI State
  const [results, setResults] = useState<Room[]>(INITIAL_ROOMS_DATA);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleSearch = () => {
    const filtered = INITIAL_ROOMS_DATA.filter(room => {
      // 1. Search Query (matches roomCode, room ID, room name, or bed ID inside)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesRoom = room.roomCode.toLowerCase().includes(query) ||
          room.id.toLowerCase().includes(query) ||
          room.name.toLowerCase().includes(query);
        const matchesBeds = room.beds.some(b => b.bedId.toLowerCase().includes(query));
        if (!matchesRoom && !matchesBeds) return false;
      }

      // 2. Branch Filter
      if (branchFilter && room.branch !== branchFilter) return false;

      // 3. Floor Filter
      if (floorFilter && room.floor !== floorFilter) return false;

      // 4. Room Type Filter
      if (typeFilter && room.type !== typeFilter) return false;

      // 5. Price Filter (check if any bed in room matches price range)
      if (priceFilter) {
        const hasMatchingPrice = room.beds.some(bed => {
          if (priceFilter === 'under-1.5m' && bed.price < 1500000) return true;
          if (priceFilter === '1.5m-1.6m' && bed.price >= 1500000 && bed.price <= 1600000) return true;
          if (priceFilter === 'above-1.6m' && bed.price > 1600000) return true;
          return false;
        });
        if (!hasMatchingPrice) return false;
      }

      // 6. Status Filter
      if (statusFilter) {
        const rentedCount = room.beds.filter(b => b.status === 'Đã thuê').length;
        if (statusFilter === 'Trống') {
          // Has at least one vacant bed
          if (rentedCount === room.capacity) return false;
        } else if (statusFilter === 'Đã thuê') {
          // Has at least one rented bed
          if (rentedCount === 0) return false;
        }
      }

      return true;
    });

    setResults(filtered);
  };

  const handleReset = () => {
    setSearchQuery('');
    setBranchFilter('');
    setFloorFilter('');
    setTypeFilter('');
    setPriceFilter('');
    setStatusFilter('');
    setResults(INITIAL_ROOMS_DATA);
  };

  // Helper to calculate rented beds count
  const getRentedCount = (room: Room) => {
    return room.beds.filter(b => b.status === 'Đã thuê').length;
  };

  // Helper to determine occupancy status badge & label
  const getOccupancyStatus = (room: Room) => {
    const rented = getRentedCount(room);
    if (rented === room.capacity) {
      return {
        label: 'Đã Đầy',
        bg: 'bg-red-50 border border-red-100 text-red-600',
        barColor: 'bg-red-500'
      };
    } else if (rented === 0) {
      return {
        label: 'Trống Hoàn Toàn',
        bg: 'bg-gray-100 border border-gray-200 text-gray-600',
        barColor: 'bg-gray-200'
      };
    } else {
      return {
        label: 'Còn Trống',
        bg: 'bg-green-50 border border-green-100 text-green-700',
        barColor: 'bg-[#B7705F]' // Matching custom brown visual bar
      };
    }
  };

  if (selectedRoom) {
    const occupancy = getOccupancyStatus(selectedRoom);
    const rentedCount = getRentedCount(selectedRoom);
    return (
      <div className="p-8 h-full bg-[#FAF5F3] animate-in fade-in duration-200">
        <button
          onClick={() => setSelectedRoom(null)}
          className="mb-6 flex items-center text-sm font-semibold text-[#8C4A3A] hover:text-[#B7705F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span>Quay lại</span>
        </button>

        <h1 className="text-3xl font-bold text-[#8C4A3A] mb-8">
          Chi tiết phòng &amp; giường – {selectedRoom.name}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Room Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#EAD3CC]/40 p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#222222] border-b border-gray-100 pb-3 mb-4">
                Thông tin phòng
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Mã phòng</label>
                  <p className="text-base font-bold text-[#222222]">{selectedRoom.id}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Tên phòng</label>
                  <p className="text-base font-semibold text-[#222222]">{selectedRoom.name}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Loại phòng</label>
                  <p className="text-sm font-medium text-gray-700">{selectedRoom.type}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Tầng</label>
                    <p className="text-sm font-bold text-gray-700">{selectedRoom.floor}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Sức chứa</label>
                    <p className="text-sm font-bold text-[#8C4A3A]">{selectedRoom.capacity} giường</p>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Chi nhánh</label>
                  <p className="text-sm font-medium text-gray-700">{selectedRoom.fullBranchName}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Trạng thái vận hành</label>
              <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-bold ${selectedRoom.status === 'ĐANG Ở' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                  selectedRoom.status === 'TRỐNG' ? 'bg-green-50 text-green-700 border border-green-100' :
                    'bg-red-50 text-red-700 border border-red-100'
                }`}>
                {selectedRoom.status}
              </span>
            </div>
          </div>

          {/* Right Column: Beds List */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-[#EAD3CC]/40 p-6">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-3">
              <h2 className="text-lg font-bold text-[#222222]">
                Danh sách giường ({selectedRoom.beds.length})
              </h2>
              <span className="text-xs text-gray-500 italic">
                Đã thuê: {rentedCount} / Sức chứa: {selectedRoom.capacity}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-bold text-xs uppercase bg-[#FAF5F3]/50">
                    <th className="px-4 py-3 rounded-l-lg">Số thứ tự</th>
                    <th className="px-4 py-3">Giá giường</th>
                    <th className="px-4 py-3">Trạng thái</th>
                    <th className="px-4 py-3 rounded-r-lg">Ghi chú</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedRoom.beds.map((bed, index) => (
                    <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-4 font-bold text-gray-800">{bed.bedId}</td>
                      <td className="px-4 py-4 font-semibold text-[#8C4A3A]">
                        {bed.price.toLocaleString('vi-VN')} đ
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${bed.status === 'Đã thuê'
                            ? 'bg-amber-50 text-amber-700 border border-amber-100'
                            : 'bg-green-50 text-green-700 border border-green-100'
                          }`}>
                          {bed.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-500 font-medium">
                        {bed.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 h-full bg-[#FAF5F3] animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#8C4A3A] mb-2">Tra cứu tình trạng phòng/giường</h1>
        <p className="text-sm text-[#666666]">
          Tra cứu nhanh trạng thái phòng, số giường đã thuê, thông tin sức chứa và địa chỉ chi nhánh của Homestay Dorm.
        </p>
      </div>

      {/* Filter panel */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#EAD3CC]/50 mb-8">
        {/* Top search & quick select */}
        <div className="flex flex-col md:flex-row items-stretch gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo mã phòng, giường..."
              className="w-full pl-9 pr-4 py-2.5 bg-[#FAF5F3] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#B7705F] transition-colors"
            />
          </div>

          <div className="w-full md:w-52">
            <select
              value={branchFilter}
              onChange={e => setBranchFilter(e.target.value)}
              className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:border-[#B7705F]"
            >
              <option value="">Tất cả chi nhánh</option>
              <option value="CN Quận 1">CN Quận 1 (Central Park)</option>
              <option value="CN Quận 3">CN Quận 3 (Riverside)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`px-4 py-2.5 border rounded-xl text-sm font-semibold transition-all flex items-center justify-center space-x-1.5 ${showAdvancedFilters
                ? 'bg-[#B7705F] text-white border-[#B7705F]'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
          >
            <span>Bộ lọc nâng cao</span>
            <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full font-bold">
              {['floorFilter', 'typeFilter', 'priceFilter', 'statusFilter'].filter(f => {
                if (f === 'floorFilter') return !!floorFilter;
                if (f === 'typeFilter') return !!typeFilter;
                if (f === 'priceFilter') return !!priceFilter;
                if (f === 'statusFilter') return !!statusFilter;
                return false;
              }).length}
            </span>
          </button>
        </div>

        {/* Advanced Filters Block */}
        {showAdvancedFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
            {/* Floor Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Tầng</label>
              <select
                value={floorFilter}
                onChange={e => setFloorFilter(e.target.value)}
                className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:border-[#B7705F]"
              >
                <option value="">Tất cả tầng</option>
                <option value="1">Tầng 1</option>
                <option value="2">Tầng 2</option>
                <option value="3">Tầng 3</option>
              </select>
            </div>

            {/* Room Type */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Loại phòng</label>
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:border-[#B7705F]"
              >
                <option value="">Tất cả loại phòng</option>
                <option value="Phòng 4 người">Phòng 4 người</option>
                <option value="Phòng 6 người">Phòng 6 người</option>
                <option value="Phòng 2 người">Phòng 2 người</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Mức giá giường</label>
              <select
                value={priceFilter}
                onChange={e => setPriceFilter(e.target.value)}
                className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:border-[#B7705F]"
              >
                <option value="">Tất cả mức giá</option>
                <option value="under-1.5m">Dưới 1,500,000 đ</option>
                <option value="1.5m-1.6m">Từ 1,500,000 đ - 1,600,000 đ</option>
                <option value="above-1.6m">Trên 1,600,000 đ</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Trạng thái giường</label>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:border-[#B7705F]"
              >
                <option value="">Tất cả trạng thái giường</option>
                <option value="Trống">Có giường trống</option>
                <option value="Đã thuê">Có giường đã thuê</option>
              </select>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end space-x-3 mt-4 border-t border-[#EAD3CC]/30 pt-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 bg-white hover:bg-gray-50 transition-colors"
          >
            Đặt lại bộ lọc
          </button>
          <button
            type="button"
            onClick={handleSearch}
            className="px-5 py-2 bg-[#B7705F] hover:bg-[#a06050] text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center space-x-1"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Tìm kiếm</span>
          </button>
        </div>
      </div>

      {/* Room Listing Grid */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#222222]">Danh sách phòng tìm thấy ({results.length})</h2>
          <span className="text-xs text-gray-500">Bấm vào từng phòng để xem sơ đồ giường chi tiết</span>
        </div>

        {results.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#EAD3CC]/40 p-12 text-center max-w-xl mx-auto shadow-sm">
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800 mb-1">Không tìm thấy phòng nào phù hợp!</h3>
            <p className="text-sm text-gray-500 mb-4">
              Vui lòng thử điều chỉnh lại từ khóa tìm kiếm hoặc các tiêu chí bộ lọc của bạn.
            </p>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors"
            >
              Xem tất cả phòng
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((room) => {
              const rented = getRentedCount(room);
              const percent = (rented / room.capacity) * 100;
              const statusInfo = getOccupancyStatus(room);

              return (
                <div
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className="bg-white rounded-2xl border border-[#EAD3CC]/40 p-5 shadow-sm hover:shadow-md hover:border-[#B7705F]/50 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#B7705F] transition-colors">
                      {room.roomCode}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusInfo.bg}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* Branch / Address */}
                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400 shrink-0" />
                    <span>{room.branch}</span>
                    <span className="mx-1.5 text-gray-300">•</span>
                    <span className="font-medium text-gray-400">{room.id}</span>
                  </div>

                  {/* Info Row: Capacity & Rented */}
                  <div className="flex justify-between items-center text-xs text-gray-600 mb-2">
                    <span className="font-medium">Sức chứa: {room.capacity} giường</span>
                    <span className="font-bold text-gray-800">Đã thuê: {rented}</span>
                  </div>

                  {/* Percentage Progress Bar matching user screenshot colors */}
                  <div className="w-full h-2 bg-[#FAF5F3] rounded-full overflow-hidden border border-[#EAD3CC]/20">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${statusInfo.barColor}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
