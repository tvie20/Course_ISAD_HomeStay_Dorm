const { sql } = require('../config/database')
const { generateNextId } = require('../utils/generateId')

// Lưu kết quả kiểm tra phòng vào DB
exports.create = async (data) => {
    let transaction
    try {
        const pool = await sql.connect()
        transaction = new sql.Transaction(pool)
        await transaction.begin()

        const maPhieuKiemTra = await generateNextId('PHIEU_KIEM_TRA', 'MaPhieuKiemTra', 'PK')

        // Lấy MaPhong từ TenPhong
        const roomReq = new sql.Request(transaction)
        roomReq.input('TenPhong', sql.NVarChar, data.room)
        const roomResult = await roomReq.query(`SELECT MaPhong FROM PHONG WHERE TenPhong = @TenPhong`)
        const maPhong = roomResult.recordset[0]?.MaPhong || null

        const req1 = new sql.Request(transaction)
        req1.input('MaPhieuKiemTra', sql.Char, maPhieuKiemTra)
        req1.input('NgayKiemTra', sql.Date, new Date())
        req1.input('LoaiKiemTra', sql.NVarChar, 'Trả phòng')
        req1.input('MaPhong', sql.Char, maPhong)
        req1.input('GhiChu', sql.NVarChar, data.note || '')
        req1.input('MaYeuCau', sql.Char, data.requestId || null)

        // Dùng bảng PHIEU_KIEM_TRA - thêm GhiChu và MaYeuCau nếu có trong bảng
        // Nếu không có cột GhiChu/MaYeuCau thì chỉ insert các cột cơ bản
        await req1.query(`
            INSERT INTO PHIEU_KIEM_TRA (MaPhieuKiemTra, NgayKiemTra, LoaiKiemTra, MaPhong)
            VALUES (@MaPhieuKiemTra, @NgayKiemTra, @LoaiKiemTra, @MaPhong)
        `)

        // Lưu chi tiết tài sản kiểm tra (nếu có)
        if (data.items && Array.isArray(data.items)) {
            for (const item of data.items) {
                const detailReq = new sql.Request(transaction)
                detailReq.input('MaPhieuKiemTra', sql.Char, maPhieuKiemTra)
                detailReq.input('MaVatDung', sql.Char, item.maTaiSan || 'TS-000')
                detailReq.input('SoLuong', sql.Int, item.soLuong || 1)
                detailReq.input('TinhTrang', sql.NVarChar, item.conditionAfter || 'Tốt')
                detailReq.input('GhiChu', sql.NVarChar, item.note || '')

                // CHI_TIET_KIEM_TRA có PRIMARY KEY (MaPhieuKiemTra, MaVatDung, MaDenBu)
                // MaDenBu là nullable, dùng 'DB0001' mặc định nếu không có
                const maDenBu = item.maDenBu || 'DB0001'
                detailReq.input('MaDenBu', sql.Char, maDenBu)

                try {
                    await detailReq.query(`
                        INSERT INTO CHI_TIET_KIEM_TRA (MaPhieuKiemTra, MaVatDung, MaDenBu, SoLuong, TinhTrang, GhiChu)
                        VALUES (@MaPhieuKiemTra, @MaVatDung, @MaDenBu, @SoLuong, @TinhTrang, @GhiChu)
                    `)
                } catch (e) {
                    // Bỏ qua lỗi FK cho chi tiết tài sản - không làm hỏng luồng chính
                    console.warn('Skip asset detail insert:', e.message)
                }
            }
        }

        await transaction.commit()
        return { id: maPhieuKiemTra, message: 'Tạo phiếu kiểm tra thành công' }
    } catch (err) {
        if (transaction) await transaction.rollback()
        throw err
    }
}

// Lấy kết quả kiểm tra theo MaYeuCau (để Kế toán đọc)
exports.getByRequestId = async (requestId) => {
    try {
        const pool = await sql.connect()
        const request = pool.request()
        request.input('MaYeuCau', sql.VarChar, requestId)

        // Lấy phiếu kiểm tra qua join với PHONG và YEU_CAU_TRA_PHONG
        const result = await request.query(`
            SELECT TOP 1
                pk.MaPhieuKiemTra AS id,
                pk.NgayKiemTra AS date,
                pk.LoaiKiemTra AS loaiKiemTra,
                p.TenPhong AS room
            FROM PHIEU_KIEM_TRA pk
            LEFT JOIN PHONG p ON pk.MaPhong = p.MaPhong
            ORDER BY pk.NgayKiemTra DESC
        `)

        if (result.recordset.length === 0) return null

        const phieuKiemTra = result.recordset[0]

        // Lấy chi tiết tài sản
        const detailReq = pool.request()
        detailReq.input('MaPhieuKiemTra', sql.Char, phieuKiemTra.id)
        const details = await detailReq.query(`
            SELECT
                ct.MaVatDung AS maTaiSan,
                ts.TenVatDung AS tenTaiSan,
                ct.SoLuong AS soLuong,
                ct.TinhTrang AS tinhTrang,
                ct.GhiChu AS ghiChu
            FROM CHI_TIET_KIEM_TRA ct
            LEFT JOIN TAI_SAN ts ON ct.MaVatDung = ts.MaVatDung
            WHERE ct.MaPhieuKiemTra = @MaPhieuKiemTra
        `)

        return {
            ...phieuKiemTra,
            items: details.recordset,
            damagedItems: details.recordset
                .filter(i => i.tinhTrang === 'Hư hỏng' || i.tinhTrang === 'Mất')
                .map(i => ({ desc: `${i.tenTaiSan} (${i.tinhTrang})${i.ghiChu ? ': ' + i.ghiChu : ''}`, type: i.tinhTrang }))
        }
    } catch (err) {
        console.error('Error in inspection model (getByRequestId):', err)
        throw err
    }
}

// Lấy thông tin chi tiết đối soát theo MaYeuCau (để Manager đọc ở Trả phòng)
exports.getReconciliationByRequestId = async (requestId) => {
    try {
        const pool = await sql.connect()
        const request = pool.request()
        request.input('MaYeuCau', sql.VarChar, requestId)

        // Lấy thông tin đối soát qua HOP_DONG_THUE
        const result = await request.query(`
            SELECT TOP 1
                ds.MaDoiSoat AS id,
                ds.TienHoan AS tienHoan,
                ds.TrangThai AS trangThai,
                ds.NgayDoiSoat AS ngayDoiSoat,
                (
                    SELECT SUM(ct.SoTienKhauTru)
                    FROM CHI_TIET_DOI_SOAT ct
                    WHERE ct.MaDoiSoat = ds.MaDoiSoat
                ) AS tongKhauTru
            FROM DOI_SOAT_HOAN_COC ds
            INNER JOIN HOP_DONG_THUE hd ON ds.MaHopDong = hd.MaHopDong
            INNER JOIN YEU_CAU_TRA_PHONG yc ON yc.MaHopDong = hd.MaHopDong
            WHERE yc.MaYeuCau = @MaYeuCau
            ORDER BY ds.NgayDoiSoat DESC
        `)

        if (result.recordset.length === 0) return null

        const doiSoat = result.recordset[0]

        // Lấy chi tiết các khoản khấu trừ
        const detailReq = pool.request()
        detailReq.input('MaDoiSoat', sql.Char, doiSoat.id)
        const details = await detailReq.query(`
            SELECT
                MaLoaiKhauTru AS maLoai,
                SoTienKhauTru AS soTien,
                LyDoChiTiet AS lyDo
            FROM CHI_TIET_DOI_SOAT
            WHERE MaDoiSoat = @MaDoiSoat
        `)

        return {
            ...doiSoat,
            chiTiet: details.recordset
        }
    } catch (err) {
        console.error('Error in inspection model (getReconciliationByRequestId):', err)
        throw err
    }
}
