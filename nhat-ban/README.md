# Nhật Bản — Trang giới thiệu

Trang web tĩnh giới thiệu về Nhật Bản, viết bằng HTML, CSS và JavaScript thuần
(không dùng framework, không cần bước build). Nội dung tiếng Việt, bố cục một trang
với 8 phần chính, menu cố định và **41 thẻ bấm được để xem ảnh thật kèm lời giới thiệu**.

## Cách mở

Cách nhanh nhất: mở trực tiếp tệp `index.html` bằng trình duyệt (nhấp đúp).

Nếu muốn chạy qua một máy chủ tĩnh (khuyến nghị khi kiểm tra hiệu năng hoặc khi
mở từ thiết bị khác trong mạng LAN):

```powershell
# Python 3
python -m http.server 8000 --directory .
# rồi mở http://localhost:8000
```

hoặc

```powershell
# Node.js
npx serve .
```

## Xem trước

![Giao diện trang chủ trên desktop](preview/desktop-hero.png)

![Phần vùng miền và điểm đến, mỗi thẻ có nút mở ảnh](preview/desktop-regions.png)

![Phần ẩm thực với nền tối](preview/desktop-food.png)

![Mở một mục Kinh nghiệm để xem ảnh thật kèm chú thích](preview/tips-photo.png)

![Hộp xem ảnh thật kèm lời giới thiệu](preview/lightbox-desktop.png)

![Hộp xem ảnh trên điện thoại](preview/lightbox-mobile.png)

## Thẻ bấm được và ảnh thật

Mỗi thẻ nội dung — vùng miền, văn hóa, ẩm thực, lý do, bốn mùa, lịch trình, bốn từ
khó dịch và bảng thông tin nhanh — đều có nút camera nhỏ ở góc. Bấm vào thẻ (hoặc nút
camera) sẽ mở hộp ảnh gồm:

- **ảnh thật** độ phân giải 1600px, tải theo nhu cầu (chỉ tải khi bạn mở lần đầu);
- **dòng giới thiệu** mô tả đúng nội dung bức ảnh;
- **tác giả và giấy phép** kèm liên kết tới trang gốc trên Wikimedia Commons;
- số thứ tự ảnh và nút chuyển ảnh trước/sau.

Cách điều khiển:

| Thao tác | Tác dụng |
|---|---|
| Bấm thẻ hoặc nút camera | Mở ảnh của thẻ đó |
| `←` `→` | Ảnh trước / ảnh sau (chỉ tính các thẻ đang hiển thị) |
| `Esc` hoặc bấm nền / nút × | Đóng và trả tiêu điểm về thẻ vừa xem |
| Vuốt ngang (trên điện thoại) | Chuyển ảnh |

Khi đang lọc vùng miền hoặc ở tab mùa khác, hộp ảnh chỉ đếm và chuyển giữa những thẻ
đang hiển thị, nên không bao giờ nhảy sang ảnh của thẻ bị ẩn.

## Cấu trúc

```
nhat-ban/
├── index.html                 # Nội dung, minh họa SVG, hộp xem ảnh
├── assets/
│   ├── css/styles.css         # Bảng màu, bố cục, responsive, hiệu ứng, hộp ảnh
│   ├── js/main.js             # Điều hướng, hiệu ứng cuộn, cánh hoa, tab, bộ lọc
│   ├── js/lightbox.js         # Mở/đóng hộp ảnh, bàn phím, vuốt, focus trap
│   ├── js/photos.js           # Credit từng ảnh (sinh tự động từ tools/photos-raw.json)
│   ├── img/favicon.svg        # Biểu tượng cổng torii
│   └── img/photos/*.jpg       # 37 ảnh thật (~13,5 MB)
├── preview/                   # Ảnh chụp giao diện để xem nhanh
├── tools/                     # Script tải ảnh, sinh credit, kiểm tra (không cần khi dùng trang)
└── README.md
```

## Các phần của trang

| Phần | Liên kết | Nội dung |
|---|---|---|
| Hero | `#hero` | Cảnh Phú Sĩ – cổng torii vẽ bằng SVG, hoa anh đào rơi |
| Tổng quan | `#tong-quan` | Số liệu, thông tin nhanh, lý do nên đến |
| Vùng miền | `#vung-mien` | 8 vùng/điểm đến, lọc theo miền |
| Văn hóa | `#van-hoa` | Trà đạo, kimono, sumo, hanami, matsuri, onsen |
| Ẩm thực | `#am-thuc` | 8 món tiêu biểu |
| Bốn mùa | `#bon-mua` | Tab xuân – hạ – thu – đông |
| Kinh nghiệm | `#kinh-nghiem` | 6 nhóm lưu ý thực tế (accordion) |
| Lịch trình | `#lich-trinh` | Gợi ý 7 ngày Tokyo – Hakone – Kyoto – Nara – Osaka |

## Điểm kỹ thuật

- **Không phụ thuộc thư viện**: HTML/CSS/JS thuần; Google Fonts có font dự phòng khi ngoại tuyến.
- **Minh họa nền 100% SVG/CSS**: cảnh hero, họa tiết sóng, biểu tượng đều vẽ bằng mã.
- **Ảnh tải theo nhu cầu**: ảnh chỉ được tải khi mở hộp xem, ảnh kế bên được tải trước
  để chuyển ảnh mượt; ảnh đã xem được ghi nhớ trong phiên.
- **Hộp ảnh truy cập được**: `role="dialog"`, `aria-modal`, gắn nhãn bằng tiêu đề và mô tả,
  khóa cuộn nền, giữ tiêu điểm trong hộp thoại (focus trap), `Esc` để đóng, trả tiêu điểm
  về thẻ đã mở.
- **Bàn phím đầy đủ**: mỗi thẻ có nút camera thật (không phải div giả lập), tab mùa hỗ trợ
  phím mũi tên/Home/End, accordion dùng `<details>` gốc.
- **Tôn trọng chuyển động giảm**: bật *giảm chuyển động* thì mọi hiệu ứng động và cánh hoa tắt.
- **Vẫn đọc được khi tắt JS**: nội dung và bố cục hiện đầy đủ (khi đó chỉ không mở được ảnh).

## Ảnh và giấy phép

37 ảnh được tải từ **Wikimedia Commons** và lưu cục bộ trong `assets/img/photos/`.
Phần lớn theo giấy phép CC BY / CC BY-SA / CC0 / public domain — mỗi ảnh đều hiển thị
tên tác giả và giấy phép ngay trong hộp xem ảnh, kèm liên kết tới trang mô tả gốc.

Danh sách đầy đủ (tên tệp, tác giả, giấy phép, URL nguồn) nằm trong
`tools/photos-raw.json`. Nếu dùng lại ảnh cho mục đích khác, hãy kiểm tra giấy phép
riêng của từng ảnh và giữ ghi công tác giả.

## Tùy chỉnh nhanh

- **Màu sắc**: sửa biến trong `:root` ở đầu `assets/css/styles.css`.
- **Phông chữ**: đổi `--font-body`, `--font-display`, `--font-jp` và cập nhật link Google Fonts.
- **Thêm thẻ có ảnh**: thêm thẻ mới với `data-photo="mã"`, `data-photo-title`, `data-photo-caption`,
  một nút `<button class="card-photo" data-photo-open>` bên trong thẻ, đặt ảnh
  `assets/img/photos/mã.jpg` và thêm credit vào `assets/js/photos.js`. Thẻ mới tự động
  tham gia danh sách chuyển ảnh.
- **Thêm vùng miền**: sao chép một `<article class="region-card">`, đặt `data-group`
  là `bac`, `trung` hoặc `nam`.
- **Đổi ảnh nền vùng**: các lớp `.art-hokkaido`, `.art-kanto`, … trong CSS.

## Ghi chú nội dung

Số liệu dân số (~124 triệu), diện tích (377.975 km²) và số đảo (6.852) mang tính
tham khảo. Thông tin du lịch chỉ nhằm mục đích giới thiệu; trước khi đi nên kiểm tra
lại giá vé, giờ mở cửa và quy định nhập cảnh từ nguồn chính thức.
