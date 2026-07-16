
const sql = require('mssql')
const { generateNextId } = require('../utils/generateId')

exports.getAll = async () => {
    try {
        const pool = await sql.connect()
        const result = await pool.request().query(`
            SELECT 
                ds.MaDoiSoat AS id, 
                ds.TyLeHoan AS tyLeHoan, 
                ds.TienHoan AS tienHoan, 
                ds.NgayDoiSoat AS ngayDoiSoat, 
                ds.TrangThai AS status,
                ds.MaPhieuCoc AS depositId,
                ds.MaHopDong AS contractId,
                kh.HoTen AS customer,
                r.MaPhong AS room,
                'Trống' AS bed
            FROM DOI_SOAT_HOAN_COC ds
            LEFT JOIN PHIEU_COC pc ON ds.MaPhieuCoc = pc.MaPhieuCoc
            LEFT JOIN PHIEU_DANG_KY pdk ON pc.MaPhieuDangKy = pdk.MaPhieuDangKy
            LEFT JOIN KHACH_HANG kh ON pdk.MaKhachHang = kh.MaKhachHang
            LEFT JOIN PHIEUCOC_PHONG pcp ON pc.MaPhieuCoc = pcp.MaPhieuCoc
            LEFT JOIN PHONG r ON pcp.MaPhong = r.MaPhong
            ORDER BY ds.NgayDoiSoat DESC
        `)
        return result.recordset
    } catch (err) {
        throw err
    }
}

exports.create = async (data) => {
    let transaction;
    try {
        const pool = await sql.connect()
        transaction = new sql.Transaction(pool)
        await transaction.begin()
        
        const maDoiSoat = await generateNextId('DOI_SOAT_HOAN_COC', 'MaDoiSoat', 'DS')
        
        const request = new sql.Request(transaction)
        request.input('MaDoiSoat', sql.VarChar, maDoiSoat)
        request.input('TyLeHoan', sql.Float, 1.0) // Assume 100% minus deductions
        request.input('TienHoan', sql.Int, data.netAmount)
        request.input('NgayDoiSoat', sql.Date, new Date())
        request.input('MaHopDong', sql.VarChar, data.contractId)
        request.input('TrangThai', sql.NVarChar, 'Đã đối soát')
        
        await request.query(`
            INSERT INTO DOI_SOAT_HOAN_COC (MaDoiSoat, TyLeHoan, TienHoan, NgayDoiSoat, MaHopDong, TrangThai)
            VALUES (@MaDoiSoat, @TyLeHoan, @TienHoan, @NgayDoiSoat, @MaHopDong, @TrangThai)
        `)
        
        // Loop over chiTietList
        if (data.chiTietList && Array.isArray(data.chiTietList)) {
            for (let i = 0; i < data.chiTietList.length; i++) {
                const item = data.chiTietList[i]
                const detailReq = new sql.Request(transaction)
                detailReq.input('MaPhieuKiemTra', sql.VarChar, 'PK0001') // Hardcode or generate if needed
                detailReq.input('MaDoiSoat', sql.VarChar, maDoiSoat)
                detailReq.input('MaLoaiKhauTru', sql.VarChar, item.maLoaiKhauTru)
                detailReq.input('SoTienKhauTru', sql.Int, item.soTien)
                detailReq.input('LyDoChiTiet', sql.NVarChar, item.lyDo)
                
                await detailReq.query(`
                    INSERT INTO CHI_TIET_DOI_SOAT (MaPhieuKiemTra, MaDoiSoat, MaLoaiKhauTru, SoTienKhauTru, LyDoChiTiet)
                    VALUES (@MaPhieuKiemTra, @MaDoiSoat, @MaLoaiKhauTru, @SoTienKhauTru, @LyDoChiTiet)
                `)
            }
        }
        
        // Update YEU_CAU_TRA_PHONG status
        if (data.requestId) {
            const updateReq = new sql.Request(transaction)
            updateReq.input('MaYeuCau', sql.VarChar, data.requestId)
            updateReq.input('TrangThai', sql.NVarChar, 'Chờ thanh lý')
            await updateReq.query(`
                UPDATE YEU_CAU_TRA_PHONG SET TrangThai = @TrangThai WHERE MaYeuCau = @MaYeuCau
            `)
        }
        
        await transaction.commit()
        return { id: maDoiSoat, message: 'Tạo đối soát thành công' }
    } catch (err) {
        if (transaction) await transaction.rollback()
        throw err
    }
}

exports.updateStatus = async (data) => {
    try {
        const pool = await sql.connect()
        const request = pool.request()
        request.input('MaDoiSoat', sql.VarChar, data.id)
        request.input('Status', sql.NVarChar, data.status)
        
        await request.query(`
            UPDATE DOI_SOAT_HOAN_COC SET TrangThai = @Status WHERE MaDoiSoat = @MaDoiSoat
        `)
        return { success: true }
    } catch (err) {
        throw err
    }
}
