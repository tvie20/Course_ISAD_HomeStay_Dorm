USE master;
GO

IF DB_ID('HomeStayDorm') IS NOT NULL
BEGIN
    ALTER DATABASE HomeStayDorm SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE HomeStayDorm;
END
GO

CREATE DATABASE HomeStayDorm;
GO

USE HomeStayDorm;
GO

CREATE TABLE PHIEU_DANG_KY (
	MaPhieuDangKy  CHAR(6)        PRIMARY KEY,
	SoNguoiDuKien  INT,
	GioiTinhYeuCau NVARCHAR(3)    CHECK(GioiTinhYeuCau IN(N'Nam', N'Nữ')),
	KhuVucMongMuon NVARCHAR(100),
	LoaiThue       NVARCHAR(100),
	MucGiaMongMuon INT,
	NgayDuKienO    DATE,
	ThoiHanThue    INT,
	YeuCauKhac     NVARCHAR(100),
	TrangThai      NVARCHAR(100)  CHECK(TrangThai IN(N'Đang xử lý', N'Đã xử lý', N'Chờ phản hồi')),
	MaNhanVien     CHAR(6),
	MaKhachHang    CHAR(6)
);

CREATE TABLE LICH_XEM_PHONG (
	MaPhieuDangKy CHAR(6),
	NgayGioHen    DATETIME,
	KetQua        NVARCHAR(100)

	PRIMARY KEY (MaPhieuDangKy, NgayGioHen)
);

CREATE TABLE PHIEU_COC (
	MaPhieuCoc        CHAR(6)        PRIMARY KEY,
	SoTienCoc         INT,
	NgayDatCoc        DATE,
	HanThanhToan      INT,
	HinhThucThanhToan NVARCHAR(100),
	TrangThai         NVARCHAR(100)  CHECK(TrangThai IN(N'Chờ thanh toán', N'Đã thanh toán', N'Quá hạn thanh toán')),
	MaPhieuDangKy     CHAR(6)
);

CREATE TABLE LICH_NHAN_PHONG (
	MaPhieuCoc CHAR(6),
	NgayGioHen DATETIME,
	GhiChu     NVARCHAR(100),
	TrangThai  NVARCHAR(100)

	PRIMARY KEY (MaPhieuCoc, NgayGioHen)
);

CREATE TABLE PHONG (
	MaPhong    CHAR(6)        PRIMARY KEY,
	TenPhong   NVARCHAR(100),
	LoaiPhong  NVARCHAR(100),
	Tang       INT,
	SucChua    INT,
	TrangThai  NVARCHAR(100)  CHECK(TrangThai IN(N'Đã thuê', N'Trống')),
	MoTa       NVARCHAR(100),
	MaChiNhanh CHAR(6)
);

CREATE TABLE GIUONG (
	MaPhong   CHAR(6),
	SoThuTu   INT,
	GiaGiuong INT,
	TrangThai NVARCHAR(100) CHECK(TrangThai IN(N'Đã thuê', N'Trống')),
	GhiChu    NVARCHAR(100)

	PRIMARY KEY (MaPhong, SoThuTu)
);

CREATE TABLE CHI_NHANH (
	MaChiNhanh  CHAR(6)        PRIMARY KEY,
	TenChiNhanh NVARCHAR(100),
	DiaChi      NVARCHAR(100),
	SDT         CHAR(10),
	Email       VARCHAR(100),
	TrangThai   NVARCHAR(100)  CHECK(TrangThai IN(N'Đang hoạt động', N'Không hoạt động')),
	MaNhanVien  CHAR(6)
);

CREATE TABLE DIEU_KIEN_LUU_TRU (
	MaDieuKien      CHAR(6)        PRIMARY KEY,
	MoTa            NVARCHAR(100),
	TrangThaiApDung NVARCHAR(100),
	ThoiGianApDung  INT
);

CREATE TABLE QUY_DINH (
	MaQuyDinh   CHAR(6)        PRIMARY KEY,
	TieuDe      NVARCHAR(100),
	NoiDung     NVARCHAR(100),
	LoaiQuyDinh NVARCHAR(100),
	NgayBanHanh NVARCHAR(100),
	TrangThai   NVARCHAR(100)  CHECK(TrangThai IN(N'Đang áp dụng', N'Ngưng áp dụng'))
);

CREATE TABLE HOP_DONG_THUE (
	MaHopDong   CHAR(6)        PRIMARY KEY,
	NgayLap     DATE,
	NgayBatDau  DATE,
	NgayKetThuc DATE,
	GiaThue     INT,
	KyThanhToan NVARCHAR(100),
	PhiDichVu   INT,
	TrangThai   NVARCHAR(100)  CHECK(TrangThai IN(N'Còn hiệu lực', N'Đã thanh lý')),
	MaPhieuCoc  CHAR(6)
);

CREATE TABLE BANG_GIA_DICH_VU (
	MaDichVu  CHAR(6)        PRIMARY KEY,
	TenDichVu NVARCHAR(100),
	GiaDichVu INT
);

CREATE TABLE CHI_SO_DICH_VU (
	MaChiSo      CHAR(6) PRIMARY KEY,
	NgayChot     DATE,
	ChiSoCu      INT,
	ChiSoMoi     INT,
	DonGiaApDung INT,
	MaPhong      CHAR(6),
	MaDichVu     CHAR(6)
);

CREATE TABLE PHIEU_KIEM_TRA (
	MaPhieuKiemTra CHAR(6)        PRIMARY KEY,
	NgayKiemTra    DATE,
	LoaiKiemTra    NVARCHAR(100)  CHECK(LoaiKiemTra IN(N'Định kỳ', N'Trả phòng', N'Bất thường')),
	MaPhong        CHAR(6),
	MaNhanVien     CHAR(6)
);

CREATE TABLE BIEN_BAN_BAN_GIAO (
	MaBienBan   CHAR(6)        PRIMARY KEY,
	NgayBanGiao DATE,
	SoChiaKhoa  INT,
	GhiChu      NVARCHAR(100),
	TrangThai   NVARCHAR(100)  CHECK(TrangThai IN(N'Chưa bàn giao', N'Đã bàn giao')),
	MaHopDong   CHAR(6)
);

CREATE TABLE BIEN_BAN_TRA_PHONG (
	MaBienBan      CHAR(6)        PRIMARY KEY,
	NgayTra        DATE,
	TinhTrangPhong NVARCHAR(100),
	MaHopDong      CHAR(6),
	MaNhanVien     CHAR(6),
	MaYeuCau       CHAR(6)
);

CREATE TABLE BANG_GIA_DEN_BU (
	MaDenBu       CHAR(6)        PRIMARY KEY,
	TenLoi        NVARCHAR(100),
	MucDo         NVARCHAR(100),
	PhanTramDenBu FLOAT,
	TrangThai     NVARCHAR(100)  CHECK(TrangThai IN(N'Đang áp dụng', N'Ngưng áp dụng'))
);

CREATE TABLE TAI_SAN (
	MaVatDung  CHAR(6)        PRIMARY KEY,
	TenVatDung NVARCHAR(100),
	LoaiTaiSan NVARCHAR(100),
	SoLuongTon INT,
	DonGia     INT
);

CREATE TABLE CHI_TIET_KIEM_TRA (
	MaPhieuKiemTra CHAR(6),
	MaVatDung      CHAR(6),
	MaDenBu        CHAR(6),
	SoLuong        INT,
	TinhTrang      NVARCHAR(100),
	GhiChu         NVARCHAR(100)

	PRIMARY KEY (MaPhieuKiemTra, MaVatDung, MaDenBu)
);

CREATE TABLE DOI_SOAT_HOAN_COC (
	MaDoiSoat   CHAR(6) PRIMARY KEY,
	TyLeHoan    FLOAT,
	TienHoan    INT,
	NgayDoiSoat DATE,
	MaHopDong   CHAR(6),
	MaNhanVien  CHAR(6)
);

CREATE TABLE CHI_TIET_DOI_SOAT (
	MaPhieuKiemTra CHAR(6),
	MaDoiSoat      CHAR(6),
	MaLoaiKhauTru  CHAR(6),
	SoTienKhauTru  INT,
	LyDoChiTiet    NVARCHAR(100)

	PRIMARY KEY (MaPhieuKiemTra, MaDoiSoat, MaLoaiKhauTru)
);

CREATE TABLE NHAN_VIEN (
	MaNhanVien  CHAR(6)        PRIMARY KEY,
	HoTen       NVARCHAR(100),
	GioiTinh    NVARCHAR(3)    CHECK(GioiTinh IN(N'Nam', N'Nữ')),
	NgaySinh    DATE,
	SoDienThoai CHAR(12),
	Email       VARCHAR(100),
	DiaChi      NVARCHAR(100),
	ChucVu      NVARCHAR(100),
	HeSoLuong   FLOAT,
	LuongCoBan  INT,
	TrangThai   NVARCHAR(100)  CHECK(TrangThai IN (N'Đang làm', N'Đã nghỉ')),
	MaTaiKhoan  CHAR(6)
);

CREATE TABLE QUAN_LY (
	MaNhanVien  CHAR(6) PRIMARY KEY,
	NgayBoNhiem DATE
);

CREATE TABLE KE_TOAN (
	MaNhanVien CHAR(6) PRIMARY KEY
);

CREATE TABLE KINH_DOANH (
	MaNhanVien      CHAR(6) PRIMARY KEY,
	KPIThang        NVARCHAR(100),
	SoHopDongDaXuLy INT,
	HoaHong         INT
);

CREATE TABLE KHACH_HANG (
	MaKhachHang     CHAR(6)        PRIMARY KEY,
	HoTen           NVARCHAR(100),
	GioiTinh        NVARCHAR(3)    CHECK(GioiTinh IN(N'Nam', N'Nữ')),
	NgaySinh        DATE,
	CCCD            CHAR(12),
	QuocTich        NVARCHAR(100),
	SDT             CHAR(12),
	Email           VARCHAR(100),
	DiaChiThuongTru NVARCHAR(100),
	NgheNghiep      NVARCHAR(100),
	NgayDangKy      DATE,
	TrangThai       NVARCHAR(100)  CHECK(TrangThai IN(N'Đang quyết định', N'Đang ở', N'Kết thúc lưu trú')),
	MaTaiKhoan      CHAR(6)
);

CREATE TABLE NHOM (
	MaNhom           CHAR(6)   PRIMARY KEY,
	SoLuongThanhVien INT,
	MaKhachHang      CHAR(6)
);

CREATE TABLE TAI_KHOAN (
	MaTaiKhoan  CHAR(6)        PRIMARY KEY,
	TenDangNhap VARCHAR(100)   UNIQUE,
	MatKhau     VARCHAR(100),
	TrangThai   NVARCHAR(100)  CHECK(TrangThai IN(N'Đang hoạt động', N'Đang nghỉ phép', N'Ngưng hoạt động'))
);

CREATE TABLE PHIEU_THANH_TOAN (
	MaPhieuThanhToan    CHAR(6)        PRIMARY KEY,
	PhuongThucThanhToan NVARCHAR(100),
	TrangThaiThanhToan  NVARCHAR(100)  CHECK(TrangThaiThanhToan IN (N'Chờ thanh toán', N'Đã thanh toán')),
	ThoiGianThanhToan   DATETIME,
	SoTien              INT,
	MaKhachHang         CHAR(6),
	MaNhanVien          CHAR(6)
);

CREATE TABLE COC (
	MaPhieuThanhToan CHAR(6) PRIMARY KEY,
	MaPhieuCoc       CHAR(6)
);

CREATE TABLE HOAN_COC (
	MaPhieuThanhToan CHAR(6) PRIMARY KEY,
	TienHoanCoc      INT,
	MaDoiSoat        CHAR(6)
);

CREATE TABLE HOP_DONG (
	MaPhieuThanhToan CHAR(6) PRIMARY KEY,
	MaHopDong        CHAR(6)
);

CREATE TABLE DIEN_NUOC (
	MaPhieuThanhToan CHAR(6) PRIMARY KEY,
	MaPhong          CHAR(6)
);

CREATE TABLE KHACHHANG_HOPDONGTHUE (
	MaKhachHang CHAR(6),
	MaHopDong   CHAR(6)

	PRIMARY KEY (MaKhachHang, MaHopDong)
);

CREATE TABLE PHIEUCOC_PHONG (
	MaPhieuCoc CHAR(6),
	MaPhong    CHAR(6)

	PRIMARY KEY (MaPhieuCoc, MaPhong)
);

CREATE TABLE PHIEUCOC_GIUONG (
	MaPhieuCoc CHAR(6),
	MaPhong    CHAR(6),
	SoThuTu    INT

	PRIMARY KEY (MaPhieuCoc, MaPhong, SoThuTu)
);

CREATE TABLE CHINHANH_QUYDINH (
	MaChiNhanh CHAR(6),
	MaQuyDinh  CHAR(6)

	PRIMARY KEY (MaChiNhanh, MaQuyDinh)
);

CREATE TABLE TAISAN_CHINHANH (
	MaVatDung  CHAR(6),
	MaChiNhanh CHAR(6),
	SoLuong    CHAR(6)

	PRIMARY KEY (MaVatDung, MaChiNhanh)
);

CREATE TABLE TAISAN_PHONG (
	MaVatDung CHAR(6),
	MaPhong   CHAR(6),
	SoLuong   INT

	PRIMARY KEY (MaVatDung, MaPhong)
);

CREATE TABLE CHINHANH_DIEUKIENLUUTRU (
	MaChiNhanh CHAR(6),
	MaDieuKien CHAR(6)

	PRIMARY KEY (MaChiNhanh, MaDieuKien)
);

CREATE TABLE BIENBANBANGIAO_QUYDINH (
	MaBienBan CHAR(6),
	MaQuyDinh CHAR(6)

	PRIMARY KEY (MaBienBan, MaQuyDinh)
);

CREATE TABLE BANGGIADENBU_TAISAN (
	MaDenBu   CHAR(6),
	MaVatDung CHAR(6)

	PRIMARY KEY (MaDenBu, MaVatDung)
);

CREATE TABLE KHACHHANG_NHOM (
	MaKhachHang CHAR(6),
	MaNhom      CHAR(6)

	PRIMARY KEY (MaKhachHang, MaNhom)
);

CREATE TABLE HOPDONGTHUE_BANGGIADICHVU (
	MaHopDong CHAR(6),
	MaDichVu  CHAR(6),
	SoLuong   INT

	PRIMARY KEY (MaHopDong, MaDichVu)
);

CREATE TABLE YEU_CAU_TRA_PHONG (
	MaYeuCau      CHAR(6)        PRIMARY KEY,
	NgayDuKienTra DATE,
	LyDo          NVARCHAR(100),
	GhiChu        NVARCHAR(100),
	TrangThai     NVARCHAR(100),
	MaHopDong     CHAR(6)
);

ALTER TABLE PHIEU_COC
ADD CONSTRAINT FK_PHIEU_COC_PHIEU_DANG_KY
FOREIGN KEY (MaPhieuDangKy)
REFERENCES PHIEU_DANG_KY(MaPhieuDangKy);

ALTER TABLE PHIEU_DANG_KY
ADD CONSTRAINT FK_PHIEU_DANG_KY_KINH_DOANH
FOREIGN KEY (MaNhanVien)
REFERENCES KINH_DOANH(MaNhanVien);

ALTER TABLE PHIEU_DANG_KY
ADD CONSTRAINT FK_PHIEU_DANG_KY_KHACH_HANG
FOREIGN KEY (MaKhachHang)
REFERENCES KHACH_HANG(MaKhachHang);

ALTER TABLE HOP_DONG_THUE
ADD CONSTRAINT FK_HOP_DONG_THUE_PHIEU_COC
FOREIGN KEY (MaPhieuCoc)
REFERENCES PHIEU_COC(MaPhieuCoc);

ALTER TABLE COC
ADD CONSTRAINT FK_COC_PHIEU_COC
FOREIGN KEY (MaPhieuCoc)
REFERENCES PHIEU_COC(MaPhieuCoc);

ALTER TABLE CHI_NHANH
ADD CONSTRAINT FK_CHI_NHANH_QUAN_LY
FOREIGN KEY (MaNhanVien)
REFERENCES QUAN_LY(MaNhanVien);

ALTER TABLE PHONG
ADD CONSTRAINT FK_PHONG_CHI_NHANH
FOREIGN KEY (MaChiNhanh)
REFERENCES CHI_NHANH(MaChiNhanh);

ALTER TABLE PHIEU_KIEM_TRA
ADD CONSTRAINT FK_PHIEU_KIEM_TRA_PHONG
FOREIGN KEY (MaPhong)
REFERENCES PHONG(MaPhong);

ALTER TABLE CHI_SO_DICH_VU
ADD CONSTRAINT FK_CHI_SO_DICH_VU_PHONG
FOREIGN KEY (MaPhong)
REFERENCES PHONG(MaPhong);

ALTER TABLE CHI_SO_DICH_VU
ADD CONSTRAINT FK_CHI_SO_DICH_VU_BANG_GIA_DICH_VU
FOREIGN KEY (MaDichVu)
REFERENCES BANG_GIA_DICH_VU(MaDichVu);

ALTER TABLE DOI_SOAT_HOAN_COC
ADD CONSTRAINT FK_DOI_SOAT_HOAN_COC_HOP_DONG_THUE
FOREIGN KEY (MaHopDong)
REFERENCES HOP_DONG_THUE(MaHopDong);

ALTER TABLE HOAN_COC
ADD CONSTRAINT FK_HOAN_COC_DOI_SOAT_HOAN_COC
FOREIGN KEY (MaDoiSoat)
REFERENCES DOI_SOAT_HOAN_COC(MaDoiSoat);

ALTER TABLE DOI_SOAT_HOAN_COC
ADD CONSTRAINT FK_DOI_SOAT_HOAN_COC_KE_TOAN
FOREIGN KEY (MaNhanVien)
REFERENCES KE_TOAN(MaNhanVien);

ALTER TABLE BIEN_BAN_TRA_PHONG
ADD CONSTRAINT FK_BIEN_BAN_TRA_PHONG_HOP_DONG_THUE
FOREIGN KEY (MaHopDong)
REFERENCES HOP_DONG_THUE(MaHopDong);

ALTER TABLE BIEN_BAN_TRA_PHONG
ADD CONSTRAINT FK_BIEN_BAN_TRA_PHONG_QUAN_LY
FOREIGN KEY (MaNhanVien)
REFERENCES QUAN_LY(MaNhanVien);

ALTER TABLE BIEN_BAN_BAN_GIAO
ADD CONSTRAINT FK_BIEN_BAN_BAN_GIAO_HOP_DONG_THUE
FOREIGN KEY (MaHopDong)
REFERENCES HOP_DONG_THUE(MaHopDong);

ALTER TABLE HOP_DONG
ADD CONSTRAINT FK_HOP_DONG_HOP_DONG_THUE
FOREIGN KEY (MaHopDong)
REFERENCES HOP_DONG_THUE(MaHopDong);

ALTER TABLE DIEN_NUOC
ADD CONSTRAINT FK_DIEN_NUOC_PHONG
FOREIGN KEY (MaPhong)
REFERENCES PHONG(MaPhong);

ALTER TABLE PHIEU_THANH_TOAN
ADD CONSTRAINT FK_PHIEU_THANH_TOAN_KHACH_HANG
FOREIGN KEY (MaKhachHang)
REFERENCES KHACH_HANG(MaKhachHang);

ALTER TABLE PHIEU_THANH_TOAN
ADD CONSTRAINT FK_PHIEU_THANH_TOAN_KE_TOAN
FOREIGN KEY (MaNhanVien)
REFERENCES KE_TOAN(MaNhanVien);

ALTER TABLE PHIEU_KIEM_TRA
ADD CONSTRAINT FK_PHIEU_KIEM_TRA_QUAN_LY
FOREIGN KEY (MaNhanVien)
REFERENCES QUAN_LY(MaNhanVien);

ALTER TABLE NHAN_VIEN
ADD CONSTRAINT FK_NHAN_VIEN_TAI_KHOAN
FOREIGN KEY (MaTaiKhoan)
REFERENCES TAI_KHOAN(MaTaiKhoan);

ALTER TABLE KHACH_HANG
ADD CONSTRAINT FK_KHACH_HANG_TAI_KHOAN
FOREIGN KEY (MaTaiKhoan)
REFERENCES TAI_KHOAN(MaTaiKhoan);

ALTER TABLE KHACHHANG_HOPDONGTHUE
ADD CONSTRAINT FK_KHHDT_KHACH_HANG
FOREIGN KEY (MaKhachHang)
REFERENCES KHACH_HANG(MaKhachHang);

ALTER TABLE KHACHHANG_HOPDONGTHUE
ADD CONSTRAINT FK_KHHDT_HOP_DONG_THUE
FOREIGN KEY (MaHopDong)
REFERENCES HOP_DONG_THUE(MaHopDong);

ALTER TABLE PHIEUCOC_PHONG
ADD CONSTRAINT FK_PHIEUCOC_PHONG_PHIEU_COC
FOREIGN KEY (MaPhieuCoc)
REFERENCES PHIEU_COC(MaPhieuCoc);

ALTER TABLE PHIEUCOC_PHONG
ADD CONSTRAINT FK_PHIEUCOC_PHONG_PHONG
FOREIGN KEY (MaPhong)
REFERENCES PHONG(MaPhong);

ALTER TABLE PHIEUCOC_GIUONG
ADD CONSTRAINT FK_PHIEUCOC_GIUONG_PHIEU_COC
FOREIGN KEY (MaPhieuCoc)
REFERENCES PHIEU_COC(MaPhieuCoc);

ALTER TABLE PHIEUCOC_GIUONG
ADD CONSTRAINT FK_PHIEUCOC_GIUONG_GIUONG
FOREIGN KEY (MaPhong, SoThuTu)
REFERENCES GIUONG(MaPhong, SoThuTu);

ALTER TABLE CHINHANH_QUYDINH
ADD CONSTRAINT FK_CHINHANH_QUYDINH_CHI_NHANH
FOREIGN KEY (MaChiNhanh)
REFERENCES CHI_NHANH(MaChiNhanh);

ALTER TABLE CHINHANH_QUYDINH
ADD CONSTRAINT FK_CHINHANH_QUYDINH_QUY_DINH
FOREIGN KEY (MaQuyDinh)
REFERENCES QUY_DINH(MaQuyDinh);

ALTER TABLE TAISAN_CHINHANH
ADD CONSTRAINT FK_TAISAN_CHINHANH_TAI_SAN
FOREIGN KEY (MaVatDung)
REFERENCES TAI_SAN(MaVatDung);

ALTER TABLE TAISAN_CHINHANH
ADD CONSTRAINT FK_TAISAN_CHINHANH_CHI_NHANH
FOREIGN KEY (MaChiNhanh)
REFERENCES CHI_NHANH(MaChiNhanh);

ALTER TABLE TAISAN_PHONG
ADD CONSTRAINT FK_TAISAN_PHONG_TAI_SAN
FOREIGN KEY (MaVatDung)
REFERENCES TAI_SAN(MaVatDung);

ALTER TABLE TAISAN_PHONG
ADD CONSTRAINT FK_TAISAN_PHONG_PHONG
FOREIGN KEY (MaPhong)
REFERENCES PHONG(MaPhong);

ALTER TABLE CHINHANH_DIEUKIENLUUTRU
ADD CONSTRAINT FK_CN_DIEUKIENLUUTRU_CHI_NHANH
FOREIGN KEY (MaChiNhanh)
REFERENCES CHI_NHANH(MaChiNhanh);

ALTER TABLE CHINHANH_DIEUKIENLUUTRU
ADD CONSTRAINT FK_CN_DIEUKIENLUUTRU_DIEU_KIEN_LUU_TRU
FOREIGN KEY (MaDieuKien)
REFERENCES DIEU_KIEN_LUU_TRU(MaDieuKien);

ALTER TABLE BIENBANBANGIAO_QUYDINH
ADD CONSTRAINT FK_BBBG_QUYDINH_BIEN_BAN_BAN_GIAO
FOREIGN KEY (MaBienBan)
REFERENCES BIEN_BAN_BAN_GIAO(MaBienBan);

ALTER TABLE BIENBANBANGIAO_QUYDINH
ADD CONSTRAINT FK_BBBG_QUYDINH_QUY_DINH
FOREIGN KEY (MaQuyDinh)
REFERENCES QUY_DINH(MaQuyDinh);

ALTER TABLE BANGGIADENBU_TAISAN
ADD CONSTRAINT FK_BGDB_TAISAN_BANG_GIA_DEN_BU
FOREIGN KEY (MaDenBu)
REFERENCES BANG_GIA_DEN_BU(MaDenBu);

ALTER TABLE BANGGIADENBU_TAISAN
ADD CONSTRAINT FK_BGDB_TAISAN_TAI_SAN
FOREIGN KEY (MaVatDung)
REFERENCES TAI_SAN(MaVatDung);

ALTER TABLE KHACHHANG_NHOM
ADD CONSTRAINT FK_KHACHHANG_NHOM_KHACH_HANG
FOREIGN KEY (MaKhachHang)
REFERENCES KHACH_HANG(MaKhachHang);

ALTER TABLE KHACHHANG_NHOM
ADD CONSTRAINT FK_KHACHHANG_NHOM_NHOM
FOREIGN KEY (MaNhom)
REFERENCES NHOM(MaNhom);

ALTER TABLE YEU_CAU_TRA_PHONG
ADD CONSTRAINT FK_YEU_CAU_TRA_PHONG_HOP_DONG_THUE
FOREIGN KEY (MaHopDong)
REFERENCES HOP_DONG_THUE(MaHopDong);

ALTER TABLE BIEN_BAN_TRA_PHONG
ADD CONSTRAINT FK_BIEN_BAN_TRA_PHONG_YEU_CAU_TRA_PHONG
FOREIGN KEY (MaYeuCau)
REFERENCES YEU_CAU_TRA_PHONG(MaYeuCau);
GO

/* =========================================================
   PHẦN DỮ LIỆU MẪU (INSERT) - Dữ liệu được mở rộng cho đầy đủ
   và giống thực tế hơn cho tất cả các bảng
   ========================================================= */

-- 1. TAI_KHOAN
INSERT INTO TAI_KHOAN (MaTaiKhoan, TenDangNhap, MatKhau, TrangThai) VALUES
('TK0001', 'sale01',      '123', N'Đang hoạt động'),
('TK0002', 'sale02',      '123', N'Đang hoạt động'),
('TK0003', 'accountant01','123', N'Đang hoạt động'),
('TK0004', 'accountant02','123', N'Đang nghỉ phép'),
('TK0005', 'manager01',   '123', N'Đang hoạt động'),
('TK0006', 'manager02',   '123', N'Đang hoạt động'),
('TK0007', 'admin',       '123', N'Đang hoạt động'),
('TK0008', 'khachhang01', '123', N'Đang hoạt động'),
('TK0009', 'khachhang02', '123', N'Đang hoạt động'),
('TK0010', 'khachhang03', '123', N'Đang hoạt động'),
('TK0011', 'khachhang04', '123', N'Đang hoạt động'),
('TK0012', 'khachhang05', '123', N'Ngưng hoạt động'),
('TK0013', 'manager03',   '123', N'Đang hoạt động'),
('TK0014', 'manager04',   '123', N'Đang hoạt động');

-- 2. NHAN_VIEN
INSERT INTO NHAN_VIEN (MaNhanVien, HoTen, GioiTinh, NgaySinh, SoDienThoai, Email, DiaChi, ChucVu, HeSoLuong, LuongCoBan, TrangThai, MaTaiKhoan) VALUES
('NV0001', N'Nguyễn Văn An',    N'Nam', '1995-03-12', '0901234567', 'an.nguyen@homestaydorm.com',   N'Q.1, TP.HCM',    N'Kinh doanh',    2.34, 6500000, N'Đang làm', 'TK0001'),
('NV0002', N'Trần Thị Bích',    N'Nữ',  '1997-07-25', '0912345678', 'bich.tran@homestaydorm.com',   N'Q.3, TP.HCM',    N'Kinh doanh',    2.10, 6000000, N'Đang làm', 'TK0002'),
('NV0003', N'Lê Thị Hạnh',      N'Nữ',  '1990-11-02', '0923456789', 'hanh.le@homestaydorm.com',     N'Q.7, TP.HCM',    N'Kế toán',       2.67, 7500000, N'Đang làm', 'TK0003'),
('NV0004', N'Phạm Văn Đức',     N'Nam', '1988-05-19', '0934567890', 'duc.pham@homestaydorm.com',    N'Bình Thạnh, TP.HCM', N'Kế toán',   2.50, 7200000, N'Đã nghỉ',  'TK0004'),
('NV0005', N'Hoàng Văn Cường',  N'Nam', '1985-09-08', '0945678901', 'cuong.hoang@homestaydorm.com', N'Q.2, TP.HCM',    N'Quản lý',       3.00, 9000000, N'Đang làm', 'TK0005'),
('NV0006', N'Đỗ Thị Mai',       N'Nữ',  '1992-01-30', '0956789012', 'mai.do@homestaydorm.com',      N'Q.10, TP.HCM',   N'Quản lý',       2.85, 8800000, N'Đang làm', 'TK0006'),
('NV0007', N'Vũ Thị Ngọc',      N'Nữ',  '1993-04-17', '0967890123', 'ngoc.vu@homestaydorm.com',     N'Q.5, TP.HCM',    N'Quản trị viên', 3.20, 9500000, N'Đang làm', 'TK0007'),
('NV0008', N'Bùi Văn Sơn',      N'Nam', '1998-12-24', '0978901234', 'son.bui@homestaydorm.com',     N'Q.4, TP.HCM',    N'Kinh doanh',    1.90, 5800000, N'Đang làm', NULL),
('NV0009', N'Ngô Thị Thanh Trúc',N'Nữ', '1989-06-14', '0989112233', 'truc.ngo@homestaydorm.com',    N'Q.Thủ Đức, TP.HCM', N'Quản lý',    2.90, 8900000, N'Đang làm', 'TK0013'),
('NV0010', N'Trịnh Văn Kiên',   N'Nam', '1987-02-27', '0990223344', 'kien.trinh@homestaydorm.com',  N'TP.Nha Trang, Khánh Hòa', N'Quản lý', 2.75, 8600000, N'Đang làm', 'TK0014');

-- 3. Vai trò nhân viên
INSERT INTO KINH_DOANH (MaNhanVien, KPIThang, SoHopDongDaXuLy, HoaHong) VALUES
('NV0001', N'15 phiếu đăng ký/tháng', 12, 3500000),
('NV0002', N'15 phiếu đăng ký/tháng', 9,  2600000),
('NV0008', N'10 phiếu đăng ký/tháng', 4,  1200000);

INSERT INTO KE_TOAN (MaNhanVien) VALUES
('NV0003'),
('NV0004');

INSERT INTO QUAN_LY (MaNhanVien, NgayBoNhiem) VALUES
('NV0005', '2022-06-01'),
('NV0006', '2023-02-15'),
('NV0009', '2023-08-01'),
('NV0010', '2024-01-10');

-- 4. CHI_NHANH (MaNhanVien: quản lý phụ trách chi nhánh, tham chiếu QUAN_LY)
INSERT INTO CHI_NHANH (MaChiNhanh, TenChiNhanh, DiaChi, SDT, Email, TrangThai, MaNhanVien) VALUES
('CN0001', N'Homestay Central Park',   N'123 Nguyễn Hữu Cảnh, Q.Bình Thạnh, TP.HCM', '0283822111', 'central@homestaydorm.com',   N'Đang hoạt động', 'NV0005'),
('CN0002', N'Sunrise Riverside',       N'456 Mai Chí Thọ, Q.2, TP.HCM',              '0283822222', 'sunrise@homestaydorm.com',   N'Đang hoạt động', 'NV0006'),
('CN0003', N'Homestay Sky Garden',     N'789 Phạm Văn Đồng, Q.Thủ Đức, TP.HCM',       '0283822333', 'skygarden@homestaydorm.com', N'Đang hoạt động', 'NV0009'),
('CN0004', N'Homestay Ocean View',     N'12 Trần Phú, TP.Nha Trang, Khánh Hòa',       '0258386444', 'oceanview@homestaydorm.com', N'Không hoạt động', 'NV0010');

-- 5. KHACH_HANG
INSERT INTO KHACH_HANG (MaKhachHang, HoTen, GioiTinh, NgaySinh, CCCD, QuocTich, SDT, Email, DiaChiThuongTru, NgheNghiep, NgayDangKy, TrangThai, MaTaiKhoan) VALUES
('KH0001', N'Phạm Văn Hải',   N'Nam', '2000-01-15', '079200001234', N'Việt Nam',   '0945678901', 'hai.pham@gmail.com',   N'Hà Nội',        N'Sinh viên',      '2026-06-01', N'Đang ở',          'TK0008'),
('KH0002', N'Lê Thị Ngọc Bích', N'Nữ', '1999-05-20', '079299005678', N'Việt Nam',  '0956789012', 'bich.le@gmail.com',    N'TP.HCM',        N'Nhân viên văn phòng', '2026-06-05', N'Đang quyết định', 'TK0009'),
('KH0003', N'Trần Minh Khoa',  N'Nam', '2001-08-09', '079201009876', N'Việt Nam',  '0967890123', 'khoa.tran@gmail.com',  N'Đà Nẵng',       N'Sinh viên',      '2026-06-10', N'Đang ở',          'TK0010'),
('KH0004', N'Nguyễn Thị Thu',  N'Nữ',  '1998-03-03', '079298003344', N'Việt Nam',  '0978901234', 'thu.nguyen@gmail.com', N'Cần Thơ',       N'Kế toán',        '2026-06-15', N'Kết thúc lưu trú','TK0011'),
('KH0005', N'John Smith',      N'Nam', '1994-11-11', '079294112233', N'Hoa Kỳ',    '0989012345', 'john.smith@gmail.com', N'California, USA', N'Kỹ sư phần mềm', '2026-06-18', N'Đang ở',          'TK0012'),
('KH0006', N'Đặng Văn Long',   N'Nam', '1996-07-07', '079296007788', N'Việt Nam',  '0990123456', 'long.dang@gmail.com',  N'Hải Phòng',     N'Nhân viên kinh doanh', '2026-06-20', N'Đang quyết định', NULL),
('KH0007', N'Vương Thị Kim Anh',N'Nữ', '2002-02-14', '079202001122', N'Việt Nam',  '0901122334', 'kimanh.vuong@gmail.com', N'Huế',         N'Sinh viên',      '2026-06-22', N'Đang ở',          NULL),
('KH0008', N'Hồ Văn Phúc',     N'Nam', '1997-10-28', '079297009900', N'Việt Nam',  '0912233445', 'phuc.ho@gmail.com',    N'Nghệ An',       N'Freelancer',     '2026-06-25', N'Đang quyết định', NULL),
('KH0009', N'Lý Thị Diễm',     N'Nữ',  '2000-09-09', '079200003399', N'Việt Nam',  '0923344556', 'diem.ly@gmail.com',    N'Vũng Tàu',      N'Nhân viên spa',  '2026-07-01', N'Đang ở',          NULL),
('KH0010', N'Mai Anh Tuấn',    N'Nam', '1995-04-04', '079295004455', N'Việt Nam',  '0934455667', 'tuan.mai@gmail.com',   N'Bình Dương',    N'Kỹ thuật viên',  '2026-07-05', N'Đang quyết định', NULL);

-- 6. NHOM (nhóm ở ghép, đại diện là 1 khách hàng)
INSERT INTO NHOM (MaNhom, SoLuongThanhVien, MaKhachHang) VALUES
('NH0001', 2, 'KH0001'),
('NH0002', 3, 'KH0005');

INSERT INTO KHACHHANG_NHOM (MaKhachHang, MaNhom) VALUES
('KH0001', 'NH0001'),
('KH0003', 'NH0001'),
('KH0005', 'NH0002'),
('KH0007', 'NH0002'),
('KH0009', 'NH0002');

-- 7. PHONG
INSERT INTO PHONG (MaPhong, TenPhong, LoaiPhong, Tang, SucChua, TrangThai, MoTa, MaChiNhanh) VALUES
('PH0001', N'Phòng 101', N'Dorm Nam',   1, 6, N'Đã thuê', N'Phòng dorm 6 giường tầng, có ban công', 'CN0001'),
('PH0002', N'Phòng 102', N'Dorm Nữ',    1, 4, N'Đã thuê', N'Phòng dorm 4 giường tầng, gần thang máy', 'CN0001'),
('PH0003', N'Phòng 103', N'Dorm Hỗn hợp', 1, 6, N'Trống',  N'Phòng dorm hỗn hợp, có tủ khóa riêng',  'CN0001'),
('PH0004', N'Phòng 201', N'Phòng Đơn',  2, 1, N'Đã thuê', N'Phòng đơn có cửa sổ, đầy đủ nội thất',  'CN0002'),
('PH0005', N'Phòng 202', N'Phòng Đôi',  2, 2, N'Trống',   N'Phòng đôi view sông, có ban công riêng', 'CN0002'),
('PH0006', N'Phòng 203', N'Dorm Nữ',    2, 4, N'Đã thuê', N'Phòng dorm nữ, có máy lạnh riêng',       'CN0002'),
('PH0007', N'Phòng 301', N'Phòng Đơn',  3, 1, N'Đã thuê', N'Phòng đơn nhỏ gọn, giá tốt',              'CN0003'),
('PH0008', N'Phòng 302', N'Dorm Nam',   3, 8, N'Đã thuê', N'Phòng dorm lớn 8 giường, phù hợp nhóm bạn', 'CN0003'),
('PH0009', N'Phòng 303', N'Studio',     3, 2, N'Trống',   N'Phòng studio đầy đủ tiện nghi, có bếp nhỏ', 'CN0003'),
('PH0010', N'Phòng 401', N'Phòng Đôi',  4, 2, N'Trống',   N'Phòng đôi cao cấp view biển',             'CN0004');

-- 8. GIUONG
INSERT INTO GIUONG (MaPhong, SoThuTu, GiaGiuong, TrangThai, GhiChu) VALUES
('PH0001', 1, 1500000, N'Đã thuê', N'Giường tầng dưới, sát cửa sổ'),
('PH0001', 2, 1400000, N'Trống',   N'Giường tầng trên'),
('PH0001', 3, 1500000, N'Đã thuê', N'Giường tầng dưới'),
('PH0001', 4, 1400000, N'Trống',   N'Giường tầng trên'),
('PH0001', 5, 1450000, N'Trống',   N'Giường tầng dưới, gần cửa'),
('PH0001', 6, 1350000, N'Trống',   N'Giường tầng trên'),
('PH0002', 1, 1500000, N'Đã thuê', N'Giường tầng dưới'),
('PH0002', 2, 1400000, N'Trống',   N'Giường tầng trên'),
('PH0002', 3, 1500000, N'Trống',   N'Giường tầng dưới'),
('PH0002', 4, 1400000, N'Trống',   N'Giường tầng trên'),
('PH0003', 1, 1300000, N'Trống',   N'Giường tầng dưới'),
('PH0003', 2, 1250000, N'Trống',   N'Giường tầng trên'),
('PH0003', 3, 1300000, N'Trống',   N'Giường tầng dưới'),
('PH0004', 1, 4000000, N'Đã thuê', N'Giường đơn cao cấp'),
('PH0005', 1, 3200000, N'Trống',   N'Giường đôi'),
('PH0005', 2, 3200000, N'Trống',   N'Giường đôi phụ'),
('PH0006', 1, 1600000, N'Đã thuê', N'Giường tầng dưới'),
('PH0006', 2, 1500000, N'Trống',   N'Giường tầng trên'),
('PH0006', 3, 1600000, N'Đã thuê', N'Giường tầng dưới'),
('PH0006', 4, 1500000, N'Trống',   N'Giường tầng trên'),
('PH0007', 1, 3800000, N'Đã thuê', N'Giường đơn'),
('PH0008', 1, 1300000, N'Đã thuê', N'Giường tầng dưới'),
('PH0008', 2, 1200000, N'Trống',   N'Giường tầng trên'),
('PH0008', 3, 1300000, N'Đã thuê', N'Giường tầng dưới'),
('PH0008', 4, 1200000, N'Trống',   N'Giường tầng trên'),
('PH0008', 5, 1300000, N'Trống',   N'Giường tầng dưới'),
('PH0008', 6, 1200000, N'Trống',   N'Giường tầng trên'),
('PH0009', 1, 4500000, N'Trống',   N'Giường đôi studio'),
('PH0010', 1, 4200000, N'Trống',   N'Giường đôi view biển'),
('PH0010', 2, 4200000, N'Trống',   N'Giường đôi phụ');

-- 9. DIEU_KIEN_LUU_TRU
INSERT INTO DIEU_KIEN_LUU_TRU (MaDieuKien, MoTa, TrangThaiApDung, ThoiGianApDung) VALUES
('DK0001', N'Không hút thuốc trong phòng',        N'Áp dụng', 0),
('DK0002', N'Giới nghiêm sau 23h00',               N'Áp dụng', 23),
('DK0003', N'Không mang thú cưng vào homestay',    N'Áp dụng', 0),
('DK0004', N'Giữ yên lặng sau 22h00',              N'Áp dụng', 22),
('DK0005', N'Không được chuyển nhượng phòng cho người khác', N'Áp dụng', 0);

-- 10. QUY_DINH
INSERT INTO QUY_DINH (MaQuyDinh, TieuDe, NoiDung, LoaiQuyDinh, NgayBanHanh, TrangThai) VALUES
('QD0001', N'Quy định vệ sinh chung',   N'Khách phải giữ gìn vệ sinh khu vực chung và phòng ở',            N'Nội quy', '2025-01-01', N'Đang áp dụng'),
('QD0002', N'Quy định thanh toán',      N'Thanh toán tiền phòng trước ngày 05 hàng tháng',                  N'Tài chính', '2025-01-01', N'Đang áp dụng'),
('QD0003', N'Quy định an ninh',         N'Không cho người lạ vào khu vực lưu trú khi chưa đăng ký',         N'An ninh',   '2025-03-01', N'Đang áp dụng'),
('QD0004', N'Quy định phòng cháy chữa cháy', N'Không sử dụng bếp gas, bếp điện tự do trong phòng',           N'An toàn',   '2025-03-15', N'Đang áp dụng'),
('QD0005', N'Quy định cũ về khách qua đêm', N'Không cho khách lạ ở qua đêm nếu chưa đăng ký tạm trú',        N'Nội quy',   '2023-05-01', N'Ngưng áp dụng');

-- 11. PHIEU_DANG_KY
INSERT INTO PHIEU_DANG_KY (MaPhieuDangKy, SoNguoiDuKien, GioiTinhYeuCau, KhuVucMongMuon, LoaiThue, MucGiaMongMuon, NgayDuKienO, ThoiHanThue, YeuCauKhac, TrangThai, MaNhanVien, MaKhachHang) VALUES
('PDK001', 1, N'Nam', N'Bình Thạnh', N'Dorm Nam',   1500000, '2026-06-05', 6,  N'Gần cửa sổ',              N'Đã xử lý',  'NV0001', 'KH0001'),
('PDK002', 1, N'Nữ',  N'Q.2',        N'Phòng Đơn',  4000000, '2026-06-10', 12, N'Yên tĩnh',                N'Đã xử lý',  'NV0001', 'KH0002'),
('PDK003', 2, N'Nam', N'Thủ Đức',    N'Dorm Nam',   1300000, '2026-06-15', 3,  N'Gần trường đại học',      N'Đã xử lý',  'NV0002', 'KH0003'),
('PDK004', 1, N'Nữ',  N'Bình Thạnh', N'Dorm Nữ',    1500000, '2026-06-20', 6,  N'',                        N'Đã xử lý',  'NV0002', 'KH0004'),
('PDK005', 1, N'Nam', N'Q.2',        N'Phòng Đơn',  4000000, '2026-06-25', 12, N'Có bàn làm việc',         N'Đã xử lý',  'NV0001', 'KH0005'),
('PDK006', 1, N'Nam', N'Bình Thạnh', N'Dorm Nam',   1500000, '2026-07-02', 3,  N'',                        N'Đang xử lý','NV0008', 'KH0006'),
('PDK007', 1, N'Nữ',  N'Q.2',        N'Dorm Nữ',    1600000, '2026-07-05', 6,  N'Gần thang máy',           N'Đã xử lý',  'NV0002', 'KH0007'),
('PDK008', 1, N'Nam', N'Thủ Đức',    N'Dorm Nam',   1300000, '2026-07-08', 1,  N'',                        N'Đang xử lý','NV0001', 'KH0008'),
('PDK009', 1, N'Nữ',  N'Bình Thạnh', N'Dorm Nữ',    1500000, '2026-07-10', 3,  N'Yêu cầu tủ khóa riêng',   N'Đã xử lý',  'NV0008', 'KH0009'),
('PDK010', 2, N'Nam', N'Thủ Đức',    N'Studio',     4500000, '2026-07-12', 12, N'Có bếp nhỏ',              N'Đang xử lý','NV0002', 'KH0010');

-- 12. LICH_XEM_PHONG
INSERT INTO LICH_XEM_PHONG (MaPhieuDangKy, NgayGioHen, KetQua) VALUES
('PDK001', '2026-06-03 09:00:00', N'Đã xem, khách hài lòng'),
('PDK002', '2026-06-08 14:00:00', N'Đã xem, khách hài lòng'),
('PDK003', '2026-06-13 10:30:00', N'Đã xem, đồng ý thuê'),
('PDK005', '2026-06-23 15:00:00', N'Đã xem, cân nhắc thêm'),
('PDK006', '2026-06-30 09:30:00', N'Chưa đến xem'),
('PDK008', '2026-07-07 11:00:00', N'Đã lên lịch'),
('PDK010', '2026-07-11 16:00:00', N'Đã lên lịch');

-- 13. PHIEU_COC
INSERT INTO PHIEU_COC (MaPhieuCoc, SoTienCoc, NgayDatCoc, HanThanhToan, HinhThucThanhToan, TrangThai, MaPhieuDangKy) VALUES
('PC0001', 500000,  '2026-06-04', 24, N'Chuyển khoản', N'Đã thanh toán',   'PDK001'),
('PC0002', 1000000, '2026-06-09', 24, N'Tiền mặt',     N'Đã thanh toán',   'PDK002'),
('PC0003', 400000,  '2026-06-14', 24, N'Chuyển khoản', N'Đã thanh toán',   'PDK003'),
('PC0004', 500000,  '2026-06-21', 24, N'Ví điện tử',   N'Đã thanh toán',   'PDK004'),
('PC0005', 1000000, '2026-06-26', 48, N'Chuyển khoản', N'Đã thanh toán',   'PDK005'),
('PC0006', 500000,  '2026-07-06', 24, N'Tiền mặt',     N'Chờ thanh toán',  'PDK007'),
('PC0007', 500000,  '2026-07-11', 12, N'Chuyển khoản', N'Đã thanh toán',   'PDK009');

-- 14. LICH_NHAN_PHONG
INSERT INTO LICH_NHAN_PHONG (MaPhieuCoc, NgayGioHen, GhiChu, TrangThai) VALUES
('PC0001', '2026-06-05 14:00:00', N'Khách nhận phòng đúng hẹn', N'Đã nhận phòng'),
('PC0002', '2026-06-10 15:00:00', N'', N'Đã nhận phòng'),
('PC0003', '2026-06-15 10:00:00', N'Khách đến trễ 30 phút', N'Đã nhận phòng'),
('PC0004', '2026-06-20 09:00:00', N'', N'Đã nhận phòng'),
('PC0005', '2026-06-25 16:00:00', N'', N'Đã nhận phòng'),
('PC0007', '2026-07-10 13:00:00', N'', N'Sắp nhận phòng');

-- 15. PHIEUCOC_PHONG / PHIEUCOC_GIUONG
INSERT INTO PHIEUCOC_PHONG (MaPhieuCoc, MaPhong) VALUES
('PC0001', 'PH0001'),
('PC0002', 'PH0004'),
('PC0003', 'PH0008'),
('PC0004', 'PH0002'),
('PC0005', 'PH0007'),
('PC0006', 'PH0006'),
('PC0007', 'PH0006');

INSERT INTO PHIEUCOC_GIUONG (MaPhieuCoc, MaPhong, SoThuTu) VALUES
('PC0001', 'PH0001', 1),
('PC0002', 'PH0004', 1),
('PC0003', 'PH0008', 1),
('PC0004', 'PH0002', 1),
('PC0006', 'PH0006', 3),
('PC0007', 'PH0006', 1);

-- 16. HOP_DONG_THUE
INSERT INTO HOP_DONG_THUE (MaHopDong, NgayLap, NgayBatDau, NgayKetThuc, GiaThue, KyThanhToan, PhiDichVu, TrangThai, MaPhieuCoc) VALUES
('HD0001', '2026-06-05', '2026-06-05', '2026-12-05', 1500000, N'Hàng tháng', 200000, N'Còn hiệu lực', 'PC0001'),
('HD0002', '2026-06-10', '2026-06-10', '2027-06-10', 4000000, N'Hàng tháng', 300000, N'Còn hiệu lực', 'PC0002'),
('HD0003', '2026-06-15', '2026-06-15', '2026-09-15', 1300000, N'Hàng tháng', 180000, N'Còn hiệu lực', 'PC0003'),
('HD0004', '2026-01-05', '2026-01-05', '2026-07-05', 1500000, N'Hàng tháng', 200000, N'Đã thanh lý',   'PC0004'),
('HD0005', '2026-06-25', '2026-06-25', '2027-06-25', 4000000, N'Hàng tháng', 300000, N'Còn hiệu lực', 'PC0005');

-- 17. KHACHHANG_HOPDONGTHUE
INSERT INTO KHACHHANG_HOPDONGTHUE (MaKhachHang, MaHopDong) VALUES
('KH0001', 'HD0001'),
('KH0002', 'HD0002'),
('KH0003', 'HD0003'),
('KH0004', 'HD0004'),
('KH0005', 'HD0005');

-- 18. BANG_GIA_DICH_VU
INSERT INTO BANG_GIA_DICH_VU (MaDichVu, TenDichVu, GiaDichVu) VALUES
('DV0001', N'Điện',            3500),
('DV0002', N'Nước',            15000),
('DV0003', N'Internet/Wifi',   100000),
('DV0004', N'Giặt ủi',         50000),
('DV0005', N'Dọn phòng hàng tuần', 80000),
('DV0006', N'Gửi xe máy',      150000);

-- 19. CHI_SO_DICH_VU
INSERT INTO CHI_SO_DICH_VU (MaChiSo, NgayChot, ChiSoCu, ChiSoMoi, DonGiaApDung, MaPhong, MaDichVu) VALUES
('CS0001', '2026-07-01', 120, 180, 3500,  'PH0001', 'DV0001'),
('CS0002', '2026-07-01', 15,  22,  15000, 'PH0001', 'DV0002'),
('CS0003', '2026-07-01', 200, 260, 3500,  'PH0004', 'DV0001'),
('CS0004', '2026-07-01', 20,  28,  15000, 'PH0004', 'DV0002'),
('CS0005', '2026-07-01', 90,  140, 3500,  'PH0008', 'DV0001'),
('CS0006', '2026-07-01', 10,  16,  15000, 'PH0008', 'DV0002');

-- 20. TAI_SAN
INSERT INTO TAI_SAN (MaVatDung, TenVatDung, LoaiTaiSan, SoLuongTon, DonGia) VALUES
('TS0001', N'Máy lạnh Daikin 1.5 HP', N'Điện lạnh',    10, 8500000),
('TS0002', N'Giường tầng sắt',        N'Nội thất',     20, 2500000),
('TS0003', N'Tủ quần áo cá nhân',     N'Nội thất',     30, 1200000),
('TS0004', N'Bàn ghế làm việc',       N'Nội thất',     15, 1500000),
('TS0005', N'Quạt treo tường',        N'Điện gia dụng',25,  450000),
('TS0006', N'Giường đôi cao cấp',     N'Nội thất',      5, 5000000),
('TS0007', N'Bình nóng lạnh',         N'Điện gia dụng',12, 2200000),
('TS0008', N'Kệ giày dép',            N'Nội thất',     20,  350000),
('TS0009', N'Rèm cửa sổ',             N'Nội thất',     25,  400000),
('TS0010', N'Khóa cửa vân tay',       N'An ninh',      10, 1800000);

-- 21. TAISAN_PHONG
INSERT INTO TAISAN_PHONG (MaVatDung, MaPhong, SoLuong) VALUES
('TS0001', 'PH0001', 1), ('TS0002', 'PH0001', 3), ('TS0003', 'PH0001', 6), ('TS0005', 'PH0001', 2), ('TS0009', 'PH0001', 1),
('TS0001', 'PH0002', 1), ('TS0002', 'PH0002', 2), ('TS0003', 'PH0002', 4), ('TS0005', 'PH0002', 2),
('TS0001', 'PH0003', 1), ('TS0002', 'PH0003', 2), ('TS0003', 'PH0003', 3),
('TS0001', 'PH0004', 1), ('TS0006', 'PH0004', 1), ('TS0003', 'PH0004', 1), ('TS0004', 'PH0004', 1), ('TS0010', 'PH0004', 1),
('TS0001', 'PH0005', 1), ('TS0006', 'PH0005', 1), ('TS0007', 'PH0005', 1),
('TS0001', 'PH0006', 1), ('TS0002', 'PH0006', 2), ('TS0003', 'PH0006', 4),
('TS0001', 'PH0007', 1), ('TS0003', 'PH0007', 1), ('TS0004', 'PH0007', 1),
('TS0001', 'PH0008', 2), ('TS0002', 'PH0008', 4), ('TS0003', 'PH0008', 8),
('TS0001', 'PH0009', 1), ('TS0006', 'PH0009', 1), ('TS0007', 'PH0009', 1), ('TS0010', 'PH0009', 1),
('TS0001', 'PH0010', 1), ('TS0006', 'PH0010', 1), ('TS0009', 'PH0010', 2);

-- 22. TAISAN_CHINHANH
INSERT INTO TAISAN_CHINHANH (MaVatDung, MaChiNhanh, SoLuong) VALUES
('TS0001', 'CN0001', '000006'),
('TS0002', 'CN0001', '000007'),
('TS0001', 'CN0002', '000004'),
('TS0006', 'CN0002', '000002'),
('TS0001', 'CN0003', '000003'),
('TS0002', 'CN0003', '000006'),
('TS0010', 'CN0004', '000002');

-- 23. CHINHANH_QUYDINH
INSERT INTO CHINHANH_QUYDINH (MaChiNhanh, MaQuyDinh) VALUES
('CN0001', 'QD0001'), ('CN0001', 'QD0002'), ('CN0001', 'QD0003'),
('CN0002', 'QD0001'), ('CN0002', 'QD0002'), ('CN0002', 'QD0004'),
('CN0003', 'QD0001'), ('CN0003', 'QD0003'),
('CN0004', 'QD0001'), ('CN0004', 'QD0002');

-- 24. CHINHANH_DIEUKIENLUUTRU
INSERT INTO CHINHANH_DIEUKIENLUUTRU (MaChiNhanh, MaDieuKien) VALUES
('CN0001', 'DK0001'), ('CN0001', 'DK0002'), ('CN0001', 'DK0004'),
('CN0002', 'DK0001'), ('CN0002', 'DK0003'),
('CN0003', 'DK0001'), ('CN0003', 'DK0002'), ('CN0003', 'DK0005'),
('CN0004', 'DK0001'), ('CN0004', 'DK0003');

-- 25. BANG_GIA_DEN_BU
INSERT INTO BANG_GIA_DEN_BU (MaDenBu, TenLoi, MucDo, PhanTramDenBu, TrangThai) VALUES
('DB0001', N'Trầy xước nhẹ',       N'Nhẹ',        10, N'Đang áp dụng'),
('DB0002', N'Hư hỏng do sử dụng sai cách', N'Trung bình', 50, N'Đang áp dụng'),
('DB0003', N'Mất tài sản',         N'Nặng',       100, N'Đang áp dụng'),
('DB0004', N'Cháy/hỏng do chập điện', N'Nặng',    100, N'Đang áp dụng'),
('DB0005', N'Bẩn cần vệ sinh lại', N'Nhẹ',        5,  N'Ngưng áp dụng');

-- 26. BANGGIADENBU_TAISAN
INSERT INTO BANGGIADENBU_TAISAN (MaDenBu, MaVatDung) VALUES
('DB0001', 'TS0003'), ('DB0001', 'TS0009'),
('DB0002', 'TS0001'), ('DB0002', 'TS0007'),
('DB0003', 'TS0010'), ('DB0003', 'TS0005'),
('DB0004', 'TS0001'), ('DB0004', 'TS0007');

-- 27. PHIEU_KIEM_TRA
INSERT INTO PHIEU_KIEM_TRA (MaPhieuKiemTra, NgayKiemTra, LoaiKiemTra, MaPhong, MaNhanVien) VALUES
('PK0001', '2026-07-01', N'Định kỳ',   'PH0001', 'NV0005'),
('PK0002', '2026-07-01', N'Định kỳ',   'PH0004', 'NV0006'),
('PK0003', '2026-06-28', N'Bất thường','PH0008', 'NV0009'),
('PK0004', '2026-07-05', N'Trả phòng', 'PH0002', 'NV0005'),
('PK0005', '2026-07-08', N'Định kỳ',   'PH0006', 'NV0006'),
('PK0006', '2026-06-30', N'Trả phòng', 'PH0004', 'NV0006');

-- 28. CHI_TIET_KIEM_TRA
INSERT INTO CHI_TIET_KIEM_TRA (MaPhieuKiemTra, MaVatDung, MaDenBu, SoLuong, TinhTrang, GhiChu) VALUES
('PK0001', 'TS0001', 'DB0005', 1, N'Bình thường', N'Máy lạnh hoạt động tốt, hơi bụi'),
('PK0002', 'TS0006', 'DB0001', 1, N'Trầy xước nhẹ', N'Trầy nhẹ ở góc giường'),
('PK0003', 'TS0005', 'DB0003', 1, N'Mất',          N'Quạt bị mất, khách chưa báo'),
('PK0004', 'TS0003', 'DB0005', 1, N'Cần vệ sinh',  N'Tủ quần áo bị bẩn'),
('PK0006', 'TS0007', 'DB0002', 1, N'Hư hỏng',      N'Bình nóng lạnh không hoạt động do dùng sai cách');

-- 29. BIEN_BAN_BAN_GIAO
INSERT INTO BIEN_BAN_BAN_GIAO (MaBienBan, NgayBanGiao, SoChiaKhoa, GhiChu, TrangThai, MaHopDong) VALUES
('BB0001', '2026-06-05', 1, N'Bàn giao đầy đủ nội thất',        N'Đã bàn giao', 'HD0001'),
('BB0002', '2026-06-10', 2, N'Bàn giao kèm thẻ từ',             N'Đã bàn giao', 'HD0002'),
('BB0003', '2026-06-15', 1, N'',                                N'Đã bàn giao', 'HD0003'),
('BB0004', '2026-01-05', 1, N'',                                N'Đã bàn giao', 'HD0004'),
('BB0005', '2026-06-25', 2, N'Bàn giao kèm mã khóa vân tay',    N'Đã bàn giao', 'HD0005');

-- 30. BIENBANBANGIAO_QUYDINH
INSERT INTO BIENBANBANGIAO_QUYDINH (MaBienBan, MaQuyDinh) VALUES
('BB0001', 'QD0001'), ('BB0001', 'QD0002'),
('BB0002', 'QD0001'), ('BB0002', 'QD0004'),
('BB0003', 'QD0001'),
('BB0004', 'QD0001'), ('BB0004', 'QD0002'),
('BB0005', 'QD0001'), ('BB0005', 'QD0002');

-- 31. YEU_CAU_TRA_PHONG
INSERT INTO YEU_CAU_TRA_PHONG (MaYeuCau, NgayDuKienTra, LyDo, GhiChu, TrangThai, MaHopDong) VALUES
('YC0001', '2026-07-05', N'Chuyển công tác',      N'Khách yêu cầu trả phòng sớm', N'Đã xử lý',  'HD0004'),
('YC0002', '2026-07-15', N'Về quê',               N'',                            N'Đang xử lý','HD0003'),
('YC0003', '2026-08-01', N'Hết nhu cầu lưu trú',  N'Yêu cầu hoàn cọc sớm',        N'Đang xử lý','HD0001');

-- 32. BIEN_BAN_TRA_PHONG
INSERT INTO BIEN_BAN_TRA_PHONG (MaBienBan, NgayTra, TinhTrangPhong, MaHopDong, MaNhanVien, MaYeuCau) VALUES
('BT0001', '2026-07-05', N'Phòng còn tốt, có trầy xước nhẹ nội thất', 'HD0004', 'NV0005', 'YC0001'),
('BT0002', '2026-06-30', N'Phòng sạch sẽ, thiếu 1 vật dụng',          'HD0004', 'NV0005', 'YC0001');

-- 33. DOI_SOAT_HOAN_COC
INSERT INTO DOI_SOAT_HOAN_COC (MaDoiSoat, TyLeHoan, TienHoan, NgayDoiSoat, MaHopDong, MaNhanVien) VALUES
('DS0001', 0.8, 400000, '2026-07-06', 'HD0004', 'NV0003'),
('DS0002', 1.0, 500000, '2026-06-16', 'HD0004', 'NV0004');

-- 34. CHI_TIET_DOI_SOAT (MaLoaiKhauTru là mã khấu trừ nội bộ, không có bảng tham chiếu riêng)
INSERT INTO CHI_TIET_DOI_SOAT (MaPhieuKiemTra, MaDoiSoat, MaLoaiKhauTru, SoTienKhauTru, LyDoChiTiet) VALUES
('PK0004', 'DS0001', 'KT0001', 50000,  N'Phí vệ sinh lại tủ quần áo'),
('PK0006', 'DS0001', 'KT0002', 50000,  N'Khấu trừ hư hỏng bình nóng lạnh nhẹ'),
('PK0002', 'DS0002', 'KT0003', 0,      N'Không phát sinh khấu trừ');

-- 35. PHIEU_THANH_TOAN
INSERT INTO PHIEU_THANH_TOAN (MaPhieuThanhToan, PhuongThucThanhToan, TrangThaiThanhToan, ThoiGianThanhToan, SoTien, MaKhachHang, MaNhanVien) VALUES
('PTT001', N'Tiền mặt',     N'Đã thanh toán', '2026-06-05 15:00:00', 1700000, 'KH0001', 'NV0003'),
('PTT002', N'Chuyển khoản', N'Đã thanh toán', '2026-06-10 10:00:00', 4300000, 'KH0002', 'NV0003'),
('PTT003', N'Chuyển khoản', N'Đã thanh toán', '2026-06-15 09:30:00', 1480000, 'KH0003', 'NV0004'),
('PTT004', N'Ví điện tử',   N'Đã thanh toán', '2026-07-01 08:00:00', 500000,  'KH0001', 'NV0003'),
('PTT005', N'Chuyển khoản', N'Đã thanh toán', '2026-07-01 08:15:00', 400000,  'KH0002', 'NV0003'),
('PTT006', N'Tiền mặt',     N'Chờ thanh toán',NULL,                  1500000, 'KH0007', 'NV0004'),
('PTT007', N'Chuyển khoản', N'Đã thanh toán', '2026-07-06 14:00:00', 400000,  'KH0004', 'NV0003'),
('PTT008', N'Chuyển khoản', N'Đã thanh toán', '2026-06-16 11:00:00', 500000,  'KH0004', 'NV0004'),
('PTT009', N'Tiền mặt',     N'Đã thanh toán', '2026-06-25 16:30:00', 4300000, 'KH0005', 'NV0003'),
('PTT010', N'Chuyển khoản', N'Chờ thanh toán',NULL,                  1600000, 'KH0009', 'NV0004');

-- 36. COC (liên kết phiếu thanh toán ứng với phiếu cọc)
INSERT INTO COC (MaPhieuThanhToan, MaPhieuCoc) VALUES
('PTT001', 'PC0001'),
('PTT002', 'PC0002'),
('PTT003', 'PC0003');

-- 37. HOAN_COC (liên kết phiếu thanh toán ứng với đối soát hoàn cọc)
INSERT INTO HOAN_COC (MaPhieuThanhToan, TienHoanCoc, MaDoiSoat) VALUES
('PTT007', 400000, 'DS0001'),
('PTT008', 500000, 'DS0002');

-- 38. HOP_DONG (liên kết phiếu thanh toán ứng với hợp đồng thuê - tiền thuê hàng tháng)
INSERT INTO HOP_DONG (MaPhieuThanhToan, MaHopDong) VALUES
('PTT004', 'HD0001'),
('PTT005', 'HD0002'),
('PTT009', 'HD0005');

-- 39. DIEN_NUOC (liên kết phiếu thanh toán ứng với tiền điện nước theo phòng)
INSERT INTO DIEN_NUOC (MaPhieuThanhToan, MaPhong) VALUES
('PTT006', 'PH0006'),
('PTT010', 'PH0006');

-- 40. HOPDONGTHUE_BANGGIADICHVU
INSERT INTO HOPDONGTHUE_BANGGIADICHVU (MaHopDong, MaDichVu, SoLuong) VALUES
('HD0001', 'DV0003', 1),
('HD0001', 'DV0005', 1),
('HD0002', 'DV0003', 1),
('HD0002', 'DV0004', 4),
('HD0002', 'DV0006', 1),
('HD0003', 'DV0003', 1),
('HD0004', 'DV0003', 1),
('HD0005', 'DV0003', 1),
('HD0005', 'DV0005', 1),
('HD0005', 'DV0006', 1);
GO