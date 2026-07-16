const { sql } = require('../config/database')
const { generateNextId } = require('../utils/generateId')

// Lay danh sach va trang thai duyet cac yeu cau tra phong cua khach
exports.getMyRequests = async (data) => {
    try {
        const pool = await sql.connect()
        const request = pool.request()

        if (!data.CustomerID) {
            throw new Error("Missing CustomerID")
        }

        request.input('CustomerID', sql.VarChar, data.CustomerID)

        // JOIN với HOP_DONG_THUE, KHACH_HANG, PHONG qua các bảng trung gian
        const query = `
            SELECT 
                chk.MaYeuCau AS id,
                c.MaHopDong AS contractId,
                r.TenPhong AS room,
                pc_g.SoThuTu AS bed,
                kh.HoTen AS customer,
                pc.SoTienCoc AS deposit,
                chk.NgayDuKienTra AS date,
                chk.LyDo AS note,
                chk.TrangThai AS status
            FROM YEU_CAU_TRA_PHONG chk
            INNER JOIN HOP_DONG_THUE c ON chk.MaHopDong = c.MaHopDong
            LEFT JOIN KHACHHANG_HOPDONGTHUE kh_hd ON c.MaHopDong = kh_hd.MaHopDong
            LEFT JOIN KHACH_HANG kh ON kh_hd.MaKhachHang = kh.MaKhachHang
            LEFT JOIN PHIEU_COC pc ON c.MaPhieuCoc = pc.MaPhieuCoc
            LEFT JOIN PHIEUCOC_PHONG pc_p ON pc.MaPhieuCoc = pc_p.MaPhieuCoc
            LEFT JOIN PHONG r ON pc_p.MaPhong = r.MaPhong
            LEFT JOIN PHIEUCOC_GIUONG pc_g ON pc.MaPhieuCoc = pc_g.MaPhieuCoc
            WHERE kh.MaKhachHang = @CustomerID
            ORDER BY chk.MaYeuCau DESC
        `

        const result = await request.query(query)
        return result.recordset
    } catch (error) {
        console.error("Error in checkout model (getMyRequests):", error)
        throw error
    }
}

// Khach hang khoi tao yeu cau bao truoc ngay tra phong
exports.create = async (data) => {
    try {
        const pool = await sql.connect()
        const request = pool.request()

        request.input('ContractID', sql.VarChar, data.ContractID)
        request.input('ExpectedCheckoutDate', sql.Date, data.ExpectedCheckoutDate)
        request.input('Reason', sql.NVarChar, data.Reason || '')
        
        // Trang thai mac dinh khi tao yeu cau tra phong
        request.input('Status', sql.NVarChar, 'Đang xử lý') // 'Chờ duyệt' -> 'Đang xử lý' theo enum có thể có? DB ko có check enum, ta cứ ghi Chờ duyệt cũng được
        
        const maYeuCau = await generateNextId('YEU_CAU_TRA_PHONG', 'MaYeuCau', 'YC')
        request.input('MaYeuCau', sql.VarChar, maYeuCau)

        const query = `
            INSERT INTO YEU_CAU_TRA_PHONG (
                MaYeuCau, MaHopDong, NgayDuKienTra, LyDo, TrangThai
            )
            VALUES (
                @MaYeuCau, @ContractID, @ExpectedCheckoutDate, @Reason, @Status
            )
        `

        await request.query(query)

        return {
            id: maYeuCau,
            message: 'Tao yeu cau tra phong thanh cong'
        }
    } catch (error) {
        console.error("Error in checkout model (create):", error)
        throw error
    }
}

// Lay danh sach tat ca yeu cau tra phong danh cho Quan ly
exports.getAll = async (data) => {
    try {
        const pool = await sql.connect()
        const request = pool.request()

        const query = `
            SELECT 
                chk.MaYeuCau AS id,
                c.MaHopDong AS contractId,
                r.TenPhong AS room,
                pc_g.SoThuTu AS bed,
                kh.HoTen AS customer,
                kh.CCCD AS cccd,
                chk.NgayDuKienTra AS date,
                chk.TrangThai AS status,
                chk.LyDo AS note,
                pc.SoTienCoc AS deposit,
                DATEDIFF(month, c.NgayBatDau, ISNULL(chk.NgayDuKienTra, GETDATE())) AS monthsStayed,
                ISNULL(deductions.utilityFee, 0) AS utilityFee,
                ISNULL(deductions.cleaningFee, 0) AS cleaningFee,
                ISNULL(deductions.damagedAssetFee, 0) AS damagedAssetFee,
                ISNULL(deductions.rentLiability, 0) AS rentLiability,
                ISNULL(deductions.otherFee, 0) AS otherFee
            FROM YEU_CAU_TRA_PHONG chk
            INNER JOIN HOP_DONG_THUE c ON chk.MaHopDong = c.MaHopDong
            LEFT JOIN KHACHHANG_HOPDONGTHUE kh_hd ON c.MaHopDong = kh_hd.MaHopDong
            LEFT JOIN KHACH_HANG kh ON kh_hd.MaKhachHang = kh.MaKhachHang
            LEFT JOIN PHIEU_COC pc ON c.MaPhieuCoc = pc.MaPhieuCoc
            LEFT JOIN PHIEUCOC_PHONG pc_p ON pc.MaPhieuCoc = pc_p.MaPhieuCoc
            LEFT JOIN PHONG r ON pc_p.MaPhong = r.MaPhong
            LEFT JOIN PHIEUCOC_GIUONG pc_g ON pc.MaPhieuCoc = pc_g.MaPhieuCoc
            LEFT JOIN (
                SELECT ds.MaHopDong,
                    SUM(CASE WHEN ct.MaLoaiKhauTru IN ('NO_DIEN', 'NO_NUOC') THEN ct.SoTienKhauTru ELSE 0 END) AS utilityFee,
                    SUM(CASE WHEN ct.MaLoaiKhauTru = 'PHI_DON_DEP' THEN ct.SoTienKhauTru ELSE 0 END) AS cleaningFee,
                    SUM(CASE WHEN ct.MaLoaiKhauTru = 'PHAT_TAI_SAN' THEN ct.SoTienKhauTru ELSE 0 END) AS damagedAssetFee,
                    SUM(CASE WHEN ct.MaLoaiKhauTru = 'NO_THUE' THEN ct.SoTienKhauTru ELSE 0 END) AS rentLiability,
                    SUM(CASE WHEN ct.MaLoaiKhauTru NOT IN ('NO_DIEN', 'NO_NUOC', 'PHI_DON_DEP', 'PHAT_TAI_SAN', 'NO_THUE') THEN ct.SoTienKhauTru ELSE 0 END) AS otherFee
                FROM DOI_SOAT_HOAN_COC ds
                INNER JOIN CHI_TIET_DOI_SOAT ct ON ds.MaDoiSoat = ct.MaDoiSoat
                GROUP BY ds.MaHopDong
            ) deductions ON c.MaHopDong = deductions.MaHopDong
            ORDER BY chk.MaYeuCau DESC
        `

        const result = await request.query(query)
        return result.recordset
    } catch (error) {
        console.error("Error in checkout model (getAll):", error)
        throw error
    }
}

exports.updateStatus = async (data) => {
    try {
        const pool = await sql.connect()
        const request = pool.request()
        
        request.input('MaYeuCau', sql.VarChar, data.id)
        request.input('TrangThai', sql.NVarChar, data.status)
        
        await request.query(`
            UPDATE YEU_CAU_TRA_PHONG 
            SET TrangThai = @TrangThai 
            WHERE MaYeuCau = @MaYeuCau
        `)
        
        // If status is 'Đã xử lý', we could theoretically update the room/contract status here,
        // but for now we just update the request status.
        return { success: true }
    } catch (error) {
        console.error("Error in checkout model (updateStatus):", error)
        throw error
    }
}
