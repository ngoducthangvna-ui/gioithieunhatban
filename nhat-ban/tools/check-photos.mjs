// Kiểm tra tính nhất quán giữa thẻ, tệp ảnh và credit
import fs from 'node:fs';

const SITE = 'D:\\Ngo_Duc_Thang\\DeepSeek\\nhat-ban';
const html = fs.readFileSync(SITE + '\\index.html', 'utf8');
const creditsJs = fs.readFileSync(SITE + '\\assets\\js\\photos.js', 'utf8');

const ids = [...html.matchAll(/data-photo="([^"]+)"/g)].map((m) => m[1]);
const unique = [...new Set(ids)];
const missingFiles = unique.filter((id) => !fs.existsSync(`${SITE}\\assets\\img\\photos\\${id}.jpg`));
const missingCredit = unique.filter((id) => !creditsJs.includes(`"${id}":`));
const missingCaption = [...html.matchAll(/data-photo="([^"]+)"([^>]*)>/g)].filter(
  (m) => !/data-photo-caption="[^"]+"/.test(m[2]) || !/data-photo-title="[^"]+"/.test(m[2])
);

console.log('Thẻ có ảnh:', ids.length);
console.log('Ảnh khác nhau:', unique.length);
console.log('Thiếu tệp ảnh:', missingFiles.length ? missingFiles : 'không');
console.log('Thiếu credit:', missingCredit.length ? missingCredit : 'không');
console.log('Thiếu tiêu đề/mô tả:', missingCaption.length ? missingCaption.map((m) => m[1]) : 'không');

const buttons = [...html.matchAll(/class="card-photo"/g)].length;
console.log('Nút mở ảnh:', buttons);
const ok = !missingFiles.length && !missingCredit.length && !missingCaption.length && buttons === ids.length;
console.log('KẾT QUẢ:', ok ? 'ĐẠT' : 'CÓ LỖI');
process.exit(ok ? 0 : 1);
