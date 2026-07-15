const { sql } = require('../config/database')
const { generateNextId } = require('../utils/generateId')

// Tao hop dong thue chinh thuc
exports.create = async (data) => {
    try {
        const pool = await sql.connect()
        const request = pool.request()

        // Nhan cac truong thong tin tu form lap hop dong
        request.input('DepositID', sql.VarChar, data.DepositID || null)

        let customerId = data.CustomerID;
        if (!customerId && data.DepositID) {
            const depReq = pool.request();
            depReq.input('DepositID', sql.VarChar, data.DepositID);
            const depRes = await depReq.query(`
                SELECT pdk.MaKhachHang 
                FROM PHIEU_COC pc
                INNER JOIN PHIEU_DANG_KY pdk ON pc.MaPhieuDangKy = pdk.MaPhieuDangKy
                WHERE pc.MaPhieuCoc = @DepositID
            `);
            if (depRes.recordset.length > 0) {
                customerId = depRes.recordset[0].MaKhachHang;
            }
        }

        if (!customerId) {
            throw new Error("Missing CustomerID in request and could not resolve from DepositID");
        }

        request.input('CustomerID', sql.VarChar, customerId)
        request.input('StartDate', sql.Date, data.StartDate)
        request.input('EndDate', sql.Date, data.EndDate)
        request.input('RoomPrice', sql.Decimal, data.RoomPrice)
        request.input('CreatedDate', sql.Date, new Date())

        // Tính toán Kỳ thanh toán (tháng a năm bbbb) dựa trên NgayBatDau
        const startDateObj = new Date(data.StartDate);
        const kyThanhToan = `tháng ${startDateObj.getMonth() + 1} năm ${startDateObj.getFullYear()}`;
        request.input('KyThanhToan', sql.NVarChar, kyThanhToan);

        // Phí dịch vụ cố định 200000
        const phiDichVu = 200000;
        request.input('PhiDichVu', sql.Decimal, phiDichVu);

        // Trang thai ban dau: Còn hiệu lực (Chờ bàn giao không có trong check constraint của HOP_DONG_THUE, dùng Còn hiệu lực)
        request.input('Status', sql.NVarChar, 'Còn hiệu lực')

        const maHopDong = await generateNextId('HOP_DONG_THUE', 'MaHopDong', 'HD')
        request.input('MaHopDong', sql.VarChar, maHopDong)

        // Tao phieu thanh toan luon (Chỉ thu phí dịch vụ ban đầu)
        const maPhieuThanhToan = await generateNextId('PHIEU_THANH_TOAN', 'MaPhieuThanhToan', 'PTT')
        request.input('MaPhieuThanhToan', sql.VarChar, maPhieuThanhToan)
        request.input('SoTienThanhToan', sql.Decimal, phiDichVu)
        request.input('TrangThaiThanhToan', sql.NVarChar, 'Chờ thanh toán')

        const query = `
            INSERT INTO HOP_DONG_THUE (
                MaHopDong, NgayLap, NgayBatDau, NgayKetThuc, GiaThue, TrangThai, MaPhieuCoc, KyThanhToan, PhiDichVu
            )
            VALUES (
                @MaHopDong, @CreatedDate, @StartDate, @EndDate, @RoomPrice, @Status, @DepositID, @KyThanhToan, @PhiDichVu
            );
            
            INSERT INTO KHACHHANG_HOPDONGTHUE (MaKhachHang, MaHopDong)
            VALUES (@CustomerID, @MaHopDong);

            INSERT INTO PHIEU_THANH_TOAN (MaPhieuThanhToan, TrangThaiThanhToan, SoTien, MaKhachHang)
            VALUES (@MaPhieuThanhToan, @TrangThaiThanhToan, @SoTienThanhToan, @CustomerID);

            INSERT INTO HOP_DONG (MaPhieuThanhToan, MaHopDong)
            VALUES (@MaPhieuThanhToan, @MaHopDong);
        `

        await request.query(query)

        // Neu hop dong duoc tao tu Phieu Coc, cap nhat lai trang thai phieu coc va trang thai giuong
        if (data.DepositID) {
            const updateDepReq = pool.request()
            updateDepReq.input('DepositID', sql.VarChar, data.DepositID)
            await updateDepReq.query("UPDATE PHIEU_COC SET TrangThai = N'Đã thanh toán' WHERE MaPhieuCoc = @DepositID")

            const updateBedReq = pool.request()
            updateBedReq.input('DepositID', sql.VarChar, data.DepositID)
            await updateBedReq.query(`
                UPDATE g
                SET g.TrangThai = N'Đã thuê'
                FROM GIUONG g
                INNER JOIN PHIEUCOC_GIUONG pcg ON g.MaPhong = pcg.MaPhong AND g.SoThuTu = pcg.SoThuTu
                WHERE pcg.MaPhieuCoc = @DepositID
            `)
        }

        // Them nguoi o cung (roommates)
        if (data.roommates && Array.isArray(data.roommates)) {
            for (const rm of data.roommates) {
                if (!rm.name || !rm.cccd) continue;

                const rmReq = pool.request();
                rmReq.input('CCCD', sql.VarChar, rm.cccd);
                const rmRes = await rmReq.query("SELECT MaKhachHang FROM KHACH_HANG WHERE CCCD = @CCCD");
                let rmMaKhachHang = null;

                if (rmRes.recordset.length > 0) {
                    rmMaKhachHang = rmRes.recordset[0].MaKhachHang;
                } else {
                    rmMaKhachHang = await generateNextId('KHACH_HANG', 'MaKhachHang', 'KH');
                    const insRmReq = pool.request();
                    insRmReq.input('MaKhachHang', sql.VarChar, rmMaKhachHang);
                    insRmReq.input('HoTen', sql.NVarChar, rm.name);
                    insRmReq.input('SDT', sql.VarChar, rm.phone || null);
                    insRmReq.input('CCCD', sql.VarChar, rm.cccd);
                    await insRmReq.query("INSERT INTO KHACH_HANG (MaKhachHang, HoTen, SDT, CCCD) VALUES (@MaKhachHang, @HoTen, @SDT, @CCCD)");
                }

                // insert into KHACHHANG_HOPDONGTHUE
                const linkReq = pool.request();
                linkReq.input('MaKhachHang', sql.VarChar, rmMaKhachHang);
                linkReq.input('MaHopDong', sql.VarChar, maHopDong);
                await linkReq.query("INSERT INTO KHACHHANG_HOPDONGTHUE (MaKhachHang, MaHopDong) VALUES (@MaKhachHang, @MaHopDong)");
            }
        }

        return {
            id: maHopDong,
            message: 'Tao hop dong thanh cong'
        }
    } catch (error) {
        console.error("Error in contract model (create):", error)
        throw error
    }
}

// Lay danh sach cac hop dong
exports.getPendingHandover = async (data) => {
    try {
        const pool = await sql.connect()
        const request = pool.request()

        const query = `
            SELECT 
                c.MaHopDong AS id,
                kh.HoTen AS customer,
                r.MaPhong AS room,
                pc_g.SoThuTu AS bed,
                c.NgayBatDau AS date,
                CASE WHEN bb.MaBienBan IS NULL THEN N'Chưa bàn giao' ELSE N'Đã bàn giao' END AS status
            FROM HOP_DONG_THUE c
            LEFT JOIN KHACHHANG_HOPDONGTHUE kh_hd ON c.MaHopDong = kh_hd.MaHopDong
            LEFT JOIN KHACH_HANG kh ON kh_hd.MaKhachHang = kh.MaKhachHang
            LEFT JOIN PHIEU_COC pc ON c.MaPhieuCoc = pc.MaPhieuCoc
            LEFT JOIN PHIEUCOC_PHONG pc_p ON pc.MaPhieuCoc = pc_p.MaPhieuCoc
            LEFT JOIN PHONG r ON pc_p.MaPhong = r.MaPhong
            LEFT JOIN PHIEUCOC_GIUONG pc_g ON pc.MaPhieuCoc = pc_g.MaPhieuCoc
            LEFT JOIN BIEN_BAN_BAN_GIAO bb ON c.MaHopDong = bb.MaHopDong
            ${data.branchId ? "WHERE r.MaChiNhanh = @BranchID" : ""}
            ORDER BY c.NgayLap ASC
        `

        if (data.branchId) request.input('BranchID', sql.VarChar, data.branchId)

        const result = await request.query(query)

        return result.recordset
    } catch (error) {
        console.error("Error in contract model (getPendingHandover):", error)
        throw error
    }
}

// Lay chi tiet hop dong de preview tren web
exports.getOne = async (data) => {
    try {
        const pool = await sql.connect()
        const request = pool.request()

        if (!data.id) {
            throw new Error("Missing ContractID")
        }

        request.input('ContractID', sql.VarChar, data.id)

        // JOIN cac bang de lay day du thong tin phong va chi nhanh
        const query = `
            SELECT 
                c.MaHopDong AS id,
                kh.HoTen AS customer,
                c.NgayBatDau AS startDate,
                c.NgayKetThuc AS endDate,
                c.GiaThue AS price,
                pc.SoTienCoc AS deposit,
                c.NgayLap AS createdDate,
                c.TrangThai AS status,
                r.TenPhong AS room,
                r.MaPhong AS roomCode,
                b_r.TenChiNhanh AS branch,
                pc_g.SoThuTu AS bedId
            FROM HOP_DONG_THUE c
            LEFT JOIN KHACHHANG_HOPDONGTHUE kh_hd ON c.MaHopDong = kh_hd.MaHopDong
            LEFT JOIN KHACH_HANG kh ON kh_hd.MaKhachHang = kh.MaKhachHang
            LEFT JOIN PHIEU_COC pc ON c.MaPhieuCoc = pc.MaPhieuCoc
            LEFT JOIN PHIEUCOC_PHONG pc_p ON pc.MaPhieuCoc = pc_p.MaPhieuCoc
            LEFT JOIN PHONG r ON pc_p.MaPhong = r.MaPhong
            LEFT JOIN CHI_NHANH b_r ON r.MaChiNhanh = b_r.MaChiNhanh
            LEFT JOIN PHIEUCOC_GIUONG pc_g ON pc.MaPhieuCoc = pc_g.MaPhieuCoc
            WHERE c.MaHopDong = @ContractID
        `

        const result = await request.query(query)

        if (result.recordset.length === 0) {
            return null
        }

        // Tra ve doi tuong hop dong chi tiet
        return result.recordset[0]
    } catch (error) {
        console.error("Error in contract model (getOne):", error)
        throw error
    }
}

// Lay hop dong dang hieu luc cua khach hang
exports.getActiveContract = async (data) => {
    try {
        const pool = await sql.connect()
        const request = pool.request()

        if (!data.CustomerID) {
            throw new Error("Missing CustomerID")
        }

        request.input('CustomerID', sql.VarChar, data.CustomerID)

        const query = `
            SELECT TOP 1
                c.MaHopDong AS id,
                c.NgayBatDau AS startDate,
                c.NgayKetThuc AS endDate,
                c.GiaThue AS price,
                c.NgayLap AS createdDate,
                pc.SoTienCoc AS deposit,
                r.TenPhong AS room,
                pc_g.SoThuTu AS bed,
                kh.HoTen AS customer,
                kh.CCCD AS cccd,
                kh.SDT AS phone,
                DATEDIFF(month, c.NgayBatDau, GETDATE()) AS monthsStayed
            FROM HOP_DONG_THUE c
            INNER JOIN KHACHHANG_HOPDONGTHUE kh_hd ON c.MaHopDong = kh_hd.MaHopDong
            INNER JOIN KHACH_HANG kh ON kh_hd.MaKhachHang = kh.MaKhachHang
            LEFT JOIN PHIEU_COC pc ON c.MaPhieuCoc = pc.MaPhieuCoc
            LEFT JOIN PHIEUCOC_PHONG pc_p ON pc.MaPhieuCoc = pc_p.MaPhieuCoc
            LEFT JOIN PHONG r ON pc_p.MaPhong = r.MaPhong
            LEFT JOIN PHIEUCOC_GIUONG pc_g ON pc.MaPhieuCoc = pc_g.MaPhieuCoc
            WHERE kh.MaKhachHang = @CustomerID
              AND c.TrangThai = N'Còn hiệu lực'
            ORDER BY c.NgayLap DESC
        `

        const result = await request.query(query)

        if (result.recordset.length === 0) {
            return null
        }

        return result.recordset[0]
    } catch (error) {
        console.error("Error in contract model (getActiveContract):", error)
        throw error
    }
}

