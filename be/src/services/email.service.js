const nodemailer = require('nodemailer')
require('dotenv').config()

const createTransporter = async () => {
    // If real credentials are provided in .env, use them
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        return nodemailer.createTransport({
            service: 'gmail', // Assume Gmail for simplicity if they provide real credentials
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })
    }
    
    // Otherwise, create an Ethereal test account (dev only)
    console.log("No EMAIL_USER found in .env, generating Ethereal test account...")
    const testAccount = await nodemailer.createTestAccount()
    return nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    })
}

exports.sendAccountInfoEmail = async (email, hoTen, username, password) => {
    try {
        const transporter = await createTransporter()
        
        // If email is missing or empty, fallback to a dummy email for demo purposes
        const targetEmail = email || "khachhang_demo@example.com"
        
        const mailOptions = {
            from: '"Ban Quản Lý Ký Túc Xá" <noreply.homestaydorm@gmail.com>',
            to: targetEmail,
            subject: 'Thông tin tài khoản đăng nhập hệ thống HomeStay Dorm',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #EAD3CC; border-radius: 10px;">
                    <h2 style="color: #8C4A3A; text-align: center;">Kính chào quý khách ${hoTen},</h2>
                    <p style="color: #333; line-height: 1.6;">Chúc mừng bạn đã hoàn tất hợp đồng thuê phòng tại HomeStay Dorm. Đây là thông tin tài khoản để bạn đăng nhập vào hệ thống, quản lý hợp đồng, hóa đơn và gửi yêu cầu hỗ trợ:</p>
                    
                    <div style="background-color: #FAF5F3; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>Tên đăng nhập:</strong> <span style="color: #B7705F;">${username}</span></p>
                        <p style="margin: 5px 0;"><strong>Mật khẩu:</strong> <span style="color: #B7705F;">${password}</span></p>
                    </div>
                    
                    <p style="color: #333; line-height: 1.6;">Vui lòng bảo mật thông tin này và đăng nhập để đổi mật khẩu trong lần đầu tiên sử dụng hệ thống.</p>
                    <p style="color: #333; line-height: 1.6;">Trân trọng,<br/><strong>Ban Quản Lý HomeStay Dorm</strong></p>
                </div>
            `
        }

        const info = await transporter.sendMail(mailOptions)
        
        console.log("Message sent: %s", info.messageId)
        
        // Preview only available when sending through an Ethereal account
        const previewUrl = nodemailer.getTestMessageUrl(info)
        if (previewUrl) {
            console.log("Preview URL: %s", previewUrl)
        }
        
        return info
    } catch (error) {
        console.error("Error sending email:", error)
        throw error
    }
}
