import * as fs from 'fs';
const file = 'src/views/Admin/RoomManagement.tsx';
let content = fs.readFileSync(file, 'utf-8');

const target1 = `<div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-[#666666] mb-2">Chi nhánh</label>
                        <select value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:bg-white focus:border-[#B7705F]">
                           <option value="Homestay Central Park">Homestay Central Park</option>
                           <option value="Sunrise Riverside">Sunrise Riverside</option>
                           <option value="The Landmark View">The Landmark View</option>
                        </select>
                     </div>`;

const rep1 = `<div className="md:col-span-1">
                        <label className="block text-sm font-semibold text-[#666666] mb-2">Chi nhánh</label>
                        <select value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:bg-white focus:border-[#B7705F]">
                           <option value="Homestay Central Park">Homestay Central Park</option>
                           <option value="Sunrise Riverside">Sunrise Riverside</option>
                           <option value="The Landmark View">The Landmark View</option>
                        </select>
                     </div>
                     <div className="md:col-span-1">
                        <label className="block text-sm font-semibold text-[#666666] mb-2">Trạng thái phòng</label>
                        <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:bg-white focus:border-[#B7705F]">
                           <option value="TRỐNG">TRỐNG</option>
                           <option value="ĐANG Ở">ĐANG Ở</option>
                           <option value="BẢO TRÌ">BẢO TRÌ</option>
                        </select>
                     </div>`;

// Replace all occurrences (we know there are 2)
// normalize newlines because CRLF vs LF
const t1_normalized = target1.replace(/\r\n/g, '\n');
const c_normalized = content.replace(/\r\n/g, '\n');

let newContent = c_normalized.split(t1_normalized).join(rep1);

// Let's also do Title Capitalization while we're at it!
newContent = newContent.replace('Chi tiết Phòng & Giường - ', 'Chi tiết phòng & giường - ');
newContent = newContent.replace('Thêm Giường Mới', 'Thêm giường mới');
newContent = newContent.replace('Danh sách Giường', 'Danh sách giường');
newContent = newContent.replace('Quản lý Phòng & Giường', 'Quản lý phòng & giường');
newContent = newContent.replace('Thêm Phòng Mới', 'Thêm phòng mới');
newContent = newContent.replace('Cập nhật Phòng', 'Cập nhật phòng');

fs.writeFileSync(file, newContent, 'utf-8');
console.log('Done replacing RoomManagement.tsx');
