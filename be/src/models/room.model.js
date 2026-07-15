const { sql } = require('../config/database')

// Lay danh sach phong va giuong kem trang thai
exports.getStatus = async (data) => {
    try {
        const pool = await sql.connect()
        const request = pool.request()

        // Co the them dieu kien loc theo chi nhanh (BranchID) neu co truyen len
        let whereClause = ''
        if (data.BranchID) {
            request.input('BranchID', sql.VarChar, data.BranchID)
            whereClause = 'WHERE r.MaChiNhanh = @BranchID'
        }

        // Truy van du lieu phang (phong JOIN voi giuong)
        const query = `
            SELECT 
                r.MaPhong AS id, 
                r.MaPhong AS roomCode, 
                r.TenPhong AS name, 
                r.LoaiPhong AS type, 
                r.Tang AS floor, 
                r.SucChua AS capacity, 
                r.MaChiNhanh AS branch, 
                b_r.TenChiNhanh AS fullBranchName, 
                r.TrangThai AS status,
                
                -- Thông tin giường
                bed.SoThuTu AS bedId, 
                bed.GiaGiuong AS price, 
                bed.TrangThai AS bedStatus, 
                bed.GhiChu AS note
            FROM PHONG r
            INNER JOIN CHI_NHANH b_r ON r.MaChiNhanh = b_r.MaChiNhanh
            LEFT JOIN GIUONG bed ON r.MaPhong = bed.MaPhong
            ${whereClause}
        `

        const result = await request.query(query)
        const flatData = result.recordset

        // Group (gom nhom) cac giuong vao trong thuoc tinh 'beds' cua tung phong
        const roomsMap = {}

        flatData.forEach(row => {
            if (!roomsMap[row.id]) {
                // Khoi tao phong moi neu chua co trong map
                roomsMap[row.id] = {
                    id: row.id,
                    roomCode: row.roomCode,
                    name: row.name,
                    type: row.type,
                    floor: row.floor,
                    capacity: row.capacity,
                    branch: row.branch,
                    fullBranchName: row.fullBranchName,
                    status: row.status,
                    beds: [] // Mang chua cac giuong
                }
            }

            // Neu co du lieu giuong (vi dung LEFT JOIN, phong co the chua co giuong)
            if (row.bedId) {
                roomsMap[row.id].beds.push({
                    bedId: row.bedId,
                    price: row.price,
                    status: row.bedStatus,
                    note: row.note
                })
            }
        })

        // Chuyen object map thanh mang danh sach phong
        return Object.values(roomsMap)
    } catch (error) {
        console.error("Error in room model (getStatus):", error)
        throw error
    }
}

// Lấy danh sách tài sản của một phòng
exports.getAssets = async (data) => {
    try {
        const pool = await sql.connect()
        const request = pool.request()

        request.input('RoomID', sql.VarChar, data.id)

        const query = `
            SELECT 
                ts_p.MaPhong AS room,
                ts_p.MaVatDung AS maTaiSan,
                ts.TenVatDung AS tenTaiSan,
                ts_p.SoLuong AS soLuong,
                'room' AS assignedTo,
                N'Hoạt động tốt' AS condition
            FROM TAISAN_PHONG ts_p
            INNER JOIN TAI_SAN ts ON ts_p.MaVatDung = ts.MaVatDung
            WHERE ts_p.MaPhong = @RoomID
        `

        const result = await request.query(query)
        
        // Cập nhật lại những tài sản là nệm hoặc thẻ từ/chìa khóa thành assignedTo='bed'
        const mappedData = result.recordset.map(asset => {
            const tenLower = asset.tenTaiSan.toLowerCase()
            if (tenLower.includes('giường') || tenLower.includes('nệm') || tenLower.includes('thẻ từ') || tenLower.includes('chìa khóa')) {
                return {
                    ...asset,
                    assignedTo: 'bed',
                    bed: data.bed || '' // We pass bed from frontend as query param if needed, or just let Handover handle it
                }
            }
            return asset
        })

        return mappedData
    } catch (error) {
        console.error("Error in room model (getAssets):", error)
        throw error
    }
}

// Xem chi tiet thong tin mot phong
exports.getOne = async (data) => {
    try {
        const pool = await sql.connect()
        const request = pool.request()

        // Bat buoc phai truyen id cua phong can xem
        if (!data.id) {
            throw new Error("Missing room ID")
        }

        request.input('RoomID', sql.VarChar, data.id)

        // Tuong tu ham getStatus nhung loc theo RoomId cu the
        const query = `
            SELECT 
                r.MaPhong AS id, 
                r.MaPhong AS roomCode, 
                r.TenPhong AS name, 
                r.LoaiPhong AS type, 
                r.Tang AS floor, 
                r.SucChua AS capacity, 
                r.MaChiNhanh AS branch, 
                b_r.TenChiNhanh AS fullBranchName, 
                r.TrangThai AS status,
                
                bed.SoThuTu AS bedId, 
                bed.GiaGiuong AS price, 
                bed.TrangThai AS bedStatus, 
                bed.GhiChu AS note
            FROM PHONG r
            INNER JOIN CHI_NHANH b_r ON r.MaChiNhanh = b_r.MaChiNhanh
            LEFT JOIN GIUONG bed ON r.MaPhong = bed.MaPhong
            WHERE r.MaPhong = @RoomID
        `

        const result = await request.query(query)
        const flatData = result.recordset

        // Neu khong tim thay phong
        if (flatData.length === 0) {
            return null
        }

        // Tao object room chua du lieu chung
        const roomDetail = {
            id: flatData[0].id,
            roomCode: flatData[0].roomCode,
            name: flatData[0].name,
            type: flatData[0].type,
            floor: flatData[0].floor,
            capacity: flatData[0].capacity,
            branch: flatData[0].branch,
            fullBranchName: flatData[0].fullBranchName,
            status: flatData[0].status,
            beds: [] // Mang chua cac giuong
        }

        // Do du lieu giuong vao mang (neu co giuong)
        flatData.forEach(row => {
            if (row.bedId) {
                roomDetail.beds.push({
                    bedId: row.bedId,
                    price: row.price,
                    status: row.bedStatus,
                    note: row.note
                })
            }
        })

        return roomDetail
    } catch (error) {
        console.error("Error in room model (getOne):", error)
        throw error
    }
}

