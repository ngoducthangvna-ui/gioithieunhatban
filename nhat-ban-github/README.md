# Nhật Bản — Xứ sở hoa anh đào & Tinh hoa văn hóa

Trang web tĩnh cao cấp giới thiệu Nhật Bản mang đậm phong cách thẩm mỹ xứ sở Phù Tang: mỹ học Wabi-sabi, họa tiết truyền thống Wagara (sóng biển Seigaiha, lá gai Asanoha), con dấu triện đỏ Hanko, thơ thiền Haiku, âm hưởng chuông gió Furin (Web Audio API) và cánh hoa anh đào rơi tương tác.

Trang web trang bị hệ thống nội dung toàn diện:
- **8 phần nội dung lớn**: Tổng quan, Vùng miền (8 vùng lớn), Văn hóa (15 nét tinh hoa truyền thống & vươn tầm thế giới), Ẩm thực UNESCO, Bốn mùa, Kinh nghiệm du lịch và 7 Lộ trình du lịch chuyên sâu.
- **Hơn 50+ thẻ bấm được** để xem **ảnh thật** chất lượng cao kèm thông tin chi tiết và bản quyền qua Lightbox.
- **Văn hóa vươn tầm thế giới**: Anime & Manga, Tinh thần Samurai & Võ sĩ đạo, Triết lý Wabi-sabi & Thiền, Nghệ thuật Kintsugi chữa lành, Origami, Tranh Phù thế Ukiyo-e, Omotenashi, Takumi...
- **7 Lộ trình du lịch chuyên sâu**:
  1. 🌸 **Cung Đường Vàng Kinh Điển (Golden Route) — 7N6Đ** (Tokyo – Hakone – Kyoto – Nara – Osaka)
  2. ❄️ **Xứ Tuyết & Thiên Nhiên Kỳ Vĩ Hokkaido — 6N5Đ** (Sapporo – Otaru – Furano – Noboribetsu)
  3. 🏮 **Cung Đường Cổ Tích & Tuyến Alps Di Sản — 5N4Đ** (Takayama – Làng Shirakawa-go – Kanazawa)
  4. ♨️ **Onsen & Miền Núi Lửa Kyushu Huyền Bí — 5N4Đ** (Fukuoka – Beppu – Yufuin – Núi lửa Aso)
  5. ⚡ **Tokyo Otaku, Pop Culture & Siêu Đô Thị Tương Lai — 4N3Đ** (Akihabara – Ghibli – Shibuya Sky – teamLab)
  6. ⛩️ **Hành Hương Linh Thiêng Koyasan & Rừng Cổ Kumano Kodo — 5N4Đ** (Osaka – Ngủ chùa Koyasan – Thác Nachi)
  7. 🏝️ **Thiên Đường Biển Nhiệt Đới & Vương Quốc Ryukyu Okinawa — 4N3Đ** (Naha – Thành Shuri – Churaumi – Đảo Kouri)

- Chỉ dùng HTML5, CSS3, JavaScript thuần — **không cần build**, không phụ thuộc framework, tốc độ tải siêu tốc.
- Hộp xem ảnh Lightbox tải ảnh theo nhu cầu, hỗ trợ bàn phím, vuốt cảm ứng trên di động.
- Tính năng **Âm hưởng Zen 🎐**: Tổng hợp tiếng chuông gió Furin và giọt nước vườn thiền Suikinkutsu thuần Web Audio API không tốn băng thông.

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
├── css/styles.css      # Toàn bộ kiểu dáng, Wagara, Hanko, layout, responsive
├── js/main.js          # Logic điều hướng, cánh hoa sakura, âm thanh Zen, tabs
├── js/lightbox.js      # Hộp xem ảnh phóng to, vuốt chạm cảm ứng, phím tắt
├── js/photos.js        # Dữ liệu ảnh Wikimedia Commons, credit và liên kết
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

Cũng có thể dùng Netlify (kéo–thả thư mục này) hoặc GitHub Pages (Settings → Pages).

## Bản quyền hình ảnh

Xem [CREDITS.md](CREDITS.md) — tác giả và giấy phép từng ảnh (Wikimedia Commons).
