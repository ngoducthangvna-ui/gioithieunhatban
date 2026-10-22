# Nhật Bản — trang giới thiệu

Trang web tĩnh giới thiệu Nhật Bản: 8 phần nội dung, **41 thẻ bấm được** để xem **ảnh thật**
kèm lời giới thiệu (42 ảnh từ Wikimedia Commons), bốn mùa dạng tab, lịch trình 7 ngày.

- Chỉ dùng HTML, CSS, JavaScript thuần — **không cần build**, không phụ thuộc framework.
- Ảnh tải theo nhu cầu khi mở hộp xem ảnh.

## Chạy thử trên máy

Mở trực tiếp `index.html`, hoặc chạy máy chủ tĩnh:

```powershell
python -m http.server 8000
# mở http://localhost:8000
```

## Cấu trúc

```
index.html
assets/
├── css/styles.css
├── js/main.js
├── js/lightbox.js
├── js/photos.js
└── img/ (favicon + photos/*.jpg)
```

## Đưa lên mạng

**Cloudflare Pages (khuyến nghị):**

1. Đẩy repo này lên GitHub.
2. Cloudflare dashboard → **Workers & Pages** → **Create application** → **Pages** →
   **Import an existing Git repository** → chọn repo → **Begin setup**.
3. Cấu hình:

   | Mục | Giá trị |
   |---|---|
   | Production branch | `main` |
   | Build command | `exit 0` |
   | Build output directory | `.` |

4. **Save and Deploy** → nhận `https://<tên-project>.pages.dev`.
   Từ đó mỗi lần push lên `main`, Cloudflare tự build và deploy lại.

Cũng có thể dùng Netlify (kéo–thả thư mục này) hoặc GitHub Pages (Settings → Pages).

## Ảnh

Xem [CREDITS.md](CREDITS.md) — tác giả và giấy phép từng ảnh (Wikimedia Commons).
