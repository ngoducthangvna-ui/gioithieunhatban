// Chèn ảnh thật vào phần nội dung mở rộng của 6 dòng "Kinh nghiệm"
import fs from 'node:fs';

const FILE = 'D:\\Ngo_Duc_Thang\\DeepSeek\\nhat-ban\\index.html';
const ANCHOR = '<div class="tip-body">';
let html = fs.readFileSync(FILE, 'utf8');

const figures = [
  {
    photo: 'tips-transport',
    caption: 'Tàu Shinkansen chờ khởi hành tại ga Furukawa, Miyagi — đúng giờ đến từng phút.'
  },
  {
    photo: 'tips-money',
    caption: 'Đồng 500 yên — tiền mặt vẫn được dùng rộng rãi ở Nhật, kể cả ở quán nhỏ và chùa.'
  },
  {
    photo: 'tips-connect',
    caption: 'Cửa hàng linh kiện điện tử ở Akihabara, Tokyo — thiết bị và phụ kiện công nghệ bày kín kệ.'
  },
  {
    photo: 'tips-etiquette',
    caption: 'Hành khách xếp hàng ngay ngắn trên sân ga — giữ trật tự và yên lặng khi chờ tàu.'
  },
  {
    photo: 'onsen',
    caption: 'Bồn onsen ngoài trời xây bằng đá — tắm sạch trước khi ngâm và giữ yên lặng.'
  },
  {
    photo: 'tips-language',
    caption: 'Bảng hiệu và đèn lồng tiếng Nhật trước một quán izakaya — học vài từ sẽ giúp bạn gọi món.'
  }
];

const parts = html.split(ANCHOR);
if (parts.length - 1 !== figures.length) {
  console.error(`Số dòng kinh nghiệm (${parts.length - 1}) khác số ảnh (${figures.length}) — dừng.`);
  process.exit(1);
}

const esc = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

let out = parts[0];
for (let i = 0; i < figures.length; i++) {
  const f = figures[i];
  const caption = esc(f.caption);
  const figure =
    `\n            <figure class="tip-figure">` +
    `\n              <img src="assets/img/photos/${f.photo}.jpg" alt="${caption}" loading="lazy" decoding="async">` +
    `\n              <figcaption>${caption}</figcaption>` +
    `\n            </figure>`;
  out += ANCHOR + figure + parts[i + 1];
}

fs.writeFileSync(FILE, out, 'utf8');
console.log('Đã chèn', figures.length, 'ảnh vào phần kinh nghiệm.');
console.log('Số figure trong tệp:', (out.split('class="tip-figure"').length - 1));
