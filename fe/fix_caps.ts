import * as fs from 'fs';
import * as path from 'path';

function walkDir(dir: string, callback: (filePath: string) => void) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? 
            walkDir(dirPath, callback) : callback(dirPath);
    });
}

function sentenceCase(str: string) {
    if (!str) return str;
    // Don't modify acronyms if possible, or just force lower case and uppercase first letter
    // Wait, just let it be, the safest is to strictly lowercase everything except the first letter.
    // However, what if we have "Ký túc xá" -> "Ký túc xá"?
    // Let's just fix known patterns:
    
    // We will find parts outside {} and lowercase them!
    
    // Actually, let's just do a blanket regex:
    const replaces: Record<string, string> = {
        'Quản lý Phòng & Giường': 'Quản lý phòng & giường',
        'Chi tiết Phòng & Giường': 'Chi tiết phòng & giường',
        'Danh sách Giường': 'Danh sách giường',
        'Thêm Giường Mới': 'Thêm giường mới',
        'Thêm Phòng Mới': 'Thêm phòng mới',
        'Thêm phòng Mới': 'Thêm phòng mới',
        'Cập nhật Phòng': 'Cập nhật phòng',
        
        'Danh sách Chủ nhà': 'Danh sách chủ nhà',
        'Thêm Chủ nhà Mới': 'Thêm chủ nhà mới',
        'Cập nhật Chủ nhà': 'Cập nhật chủ nhà',

        'Quản lý Chi Nhánh': 'Quản lý chi nhánh',
        'Thêm Chi Nhánh': 'Thêm chi nhánh',
        'Thêm Chi Nhánh Mới': 'Thêm chi nhánh mới',
        'Chi tiết Chi Nhánh': 'Chi tiết chi nhánh',
        
        'Quản lý Tài Sản': 'Quản lý tài sản',
        'Danh sách Mức độ': 'Danh sách mức độ',
        'Danh sách Loại Tài Sản': 'Danh sách loại tài sản',
        'Thanh lý / Sử dụng': 'Thanh lý / sử dụng',
        'Thêm Mới Loại Tài Sản': 'Thêm mới loại tài sản',
        'Thêm Mức Độ Hư Hỏng Mới': 'Thêm mức độ hư hỏng mới',

        'Lập Hợp Đồng Thuê': 'Lập hợp đồng thuê',
        'Lập Hợp Đồng Thử Việc': 'Lập hợp đồng thử việc',
        'Ký túc xá Homestay dorm': 'Ký túc xá Homestay Dorm',
        
        'Ký Túc Xá': 'Ký túc xá',
        'Tình trạng Phòng/Giường': 'Tình trạng phòng/giường',
        'Xét duyệt Lưu Trú': 'Xét duyệt lưu trú',
        'Thanh toán Cọc': 'Thanh toán cọc',
        'Chi tiết Thanh toán': 'Chi tiết thanh toán',
        'Xem Hợp Đồng Thuê': 'Xem hợp đồng thuê',
        'Yêu cầu Trả phòng': 'Yêu cầu trả phòng',
        'Thanh toán Dịch vụ': 'Thanh toán dịch vụ',
        
        'Đăng ký Thuê Phòng': 'Đăng ký thuê phòng',
        'Hồ sơ định danh Khách hàng': 'Hồ sơ định danh khách hàng',
        'Đối soát Nhóm/Người ở cùng': 'Đối soát nhóm/người ở cùng',
        'Thông tin Đặt cọc': 'Thông tin đặt cọc',
        'Điều kiện lưu trú': 'Điều kiện lưu trú',
        'Tính Tiền Cọc & Gửi Yêu Cầu': 'Tính tiền cọc & gửi yêu cầu'
    };

    let result = str;
    for (const [key, value] of Object.entries(replaces)) {
        // use regex globally, case insensitive to catch variations
        const regex = new RegExp(key.replace(/[.*+?^${}()|[]\\]/g, '\\$&'), 'g');
        result = result.replace(regex, value);
    }
    
    // generic matching inside <h1>...</h1> where there's no {}, very aggressively.
    // Let's just do a regex replace for the contents inside <h1> and <h2>
    // This is safer:
    result = result.replace(/<h[12][^>]*>(.*?)<\/h[12]>/gs, (match, content) => {
        if (content.includes('{')) return match; // skip if it contains logic
        if (content.includes('<')) return match; // skip if it contains other html
        // Title case to Sentence case: Capitalize the first letter, lowercase the rest
        // Except for specific known acronyms and names like RM-, VNĐ, Homestay
        let trimmed = content.trim();
        if(trimmed === '') return match;
        
        // uppercase first letter
        let firstLetter = trimmed.charAt(0).toUpperCase();
        let rest = trimmed.slice(1).toLowerCase();
        
        // Fix some proper names lost to lowercase
        let sentenceCase = firstLetter + rest;
        sentenceCase = sentenceCase.replace(/homestay/g, 'Homestay');
        sentenceCase = sentenceCase.replace(/dorm/g, 'Dorm');
        sentenceCase = sentenceCase.replace(/vnd/g, 'VNĐ');
        
        return match.replace(content, sentenceCase);
    });

    return result;
}

walkDir('src/views', (filePath) => {
    if (filePath.endsWith('.tsx')) {
        let content = fs.readFileSync(filePath, 'utf-8');
        let newContent = sentenceCase(content);
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf-8');
            console.log('Fixed caps in', filePath);
        }
    }
});
