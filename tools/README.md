# tools — script xây dựng & kiểm tra

Thư mục này **không cần thiết để xem trang**. Nó lưu lại cách ảnh được lấy về và cách
trang được kiểm tra, để sau này có thể làm lại hoặc thay ảnh.

| Tệp | Công dụng |
|---|---|
| `fetch-photos.mjs` | Tìm và tải ảnh từ Wikimedia Commons theo từ khóa (có giãn cách, thử lại khi bị giới hạn tần suất). Dùng `--only id1,id2` để tải lại một vài ảnh. |
| `fetch-lead.mjs` | Lấy ảnh đại diện của một bài Wikipedia: `node fetch-lead.mjs <id> "<tên bài>" [ngôn ngữ]`. |
| `inject-photos.mjs` | Gắn `data-photo`, tiêu đề, mô tả và nút camera vào 41 thẻ trong `index.html`. |
| `inject-tip-photos.mjs` | Chèn ảnh + chú thích vào phần mở rộng của 6 dòng "Kinh nghiệm". |
| `prepare-assets.py` | Nén ảnh (tối đa 1600px, JPEG q84) và sinh `assets/js/photos.js` từ `photos-raw.json`. |
| `contact-sheet.py` | Tạo bảng ảnh thu nhỏ `contact-sheet.jpg` để rà soát nhanh toàn bộ ảnh. |
| `check-photos.mjs` | Kiểm tra mọi thẻ có ảnh, đủ tệp, đủ credit. |
| `validate.py` | Kiểm tra cấu trúc HTML, id trùng, liên kết hỏng, cân bằng ngoặc CSS. |
| `test-lightbox.mjs` | Kiểm thử hộp xem ảnh trong Edge headless: mở/đóng, phím, vuốt, đếm ảnh, tiêu điểm. |
| `shots-sections.mjs` | Chụp ảnh từng phần của trang để kiểm tra giao diện. |
| `photos-raw.json` | **Nguồn gốc ảnh**: tên tệp, tác giả, giấy phép, URL Wikimedia Commons. |

Các script dùng Node.js (>= 18, có `fetch`) và Python 3 với Pillow. Các script chạy
trình duyệt cần Edge/Chrome và tham số `--no-sandbox` khi chạy trong môi trường bị hạn chế.
