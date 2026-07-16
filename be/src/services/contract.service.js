const contractModel = require('../models/contract.model')
const accountModel = require('../models/account.model')
const emailService = require('./email.service')

// Tạo hợp đồng thuê chính thức
exports.create = async (data) => {
    // Xử lý business logic ở đây (nếu có) trước khi gọi Model
    const result = await contractModel.create(data)

    // Sau khi tạo hợp đồng, lấy CustomerID (từ payload gửi lên hoặc từ backend resolve)
    // Nếu create thành công, data.CustomerID có thể không có nếu tạo từ DepositID, 
    // trong model có logic tìm CustomerID. Mình cần trích xuất customerId từ kết quả hoặc gọi lại db.
    // Thực tế model create đang trả về { id, message }.
    // Ta lấy CustomerID truyền vào để sinh account. Nếu ko có data.CustomerID, phải tìm qua DepositID.
    let customerId = data.CustomerID;
    if (!customerId && data.DepositID) {
        const { sql } = require('../config/database');
        const pool = await sql.connect();
        const depRes = await pool.request()
            .input('DepositID', sql.VarChar, data.DepositID)
            .query(`
                SELECT pdk.MaKhachHang 
                FROM PHIEU_COC pc
                INNER JOIN PHIEU_DANG_KY pdk ON pc.MaPhieuDangKy = pdk.MaPhieuDangKy
                WHERE pc.MaPhieuCoc = @DepositID
            `);
        if (depRes.recordset.length > 0) {
            customerId = depRes.recordset[0].MaKhachHang;
        }
    }

    if (customerId) {
        try {
            const accInfo = await accountModel.generateAccountForCustomer(customerId);
            if (accInfo) {
                // Có tài khoản mới được sinh ra
                await emailService.sendAccountInfoEmail(accInfo.email, accInfo.hoTen, accInfo.username, accInfo.password);
            }
        } catch (accError) {
            console.error("Lỗi khi sinh tài khoản hoặc gửi email:", accError);
            // Không throw error để việc tạo hợp đồng vẫn thành công
        }
    }

    return result
}

// Lấy danh sách các hợp đồng mới đã ký nhưng chưa bàn giao phòng
exports.getPendingHandover = async (data) => {
    // Xử lý business logic ở đây (nếu có) trước khi gọi Model
    const result = await contractModel.getPendingHandover(data)
    // Xử lý dữ liệu trả về từ Model (nếu cần) trước khi đưa lên Controller

    return result
}

// Lấy chi tiết hợp đồng
exports.getOne = async (data) => {
    // Xử lý business logic ở đây (nếu có) trước khi gọi Model
    const result = await contractModel.getOne(data)
    // Xử lý dữ liệu trả về từ Model (nếu cần) trước khi đưa lên Controller

    return result
}

// Lay hop dong dang hieu luc cua khach hang
exports.getActiveContract = async (data) => {
    // Xử lý business logic ở đây (nếu có) trước khi gọi Model
    const result = await contractModel.getActiveContract(data)
    // Xử lý dữ liệu trả về từ Model (nếu cần) trước khi đưa lên Controller

    return result
}

