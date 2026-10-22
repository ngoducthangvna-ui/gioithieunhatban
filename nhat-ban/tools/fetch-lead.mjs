// Lấy ảnh đại diện của một bài Wikipedia (thường là ảnh đẹp, đúng chủ đề)
// Dùng: node fetch-lead.mjs <id> "<tên bài wiki>" [ngôn ngữ]
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = 'D:\\Ngo_Duc_Thang\\DeepSeek\\nhat-ban\\assets\\img\\photos';
const META_OUT = 'D:\\Ngo_Duc_Thang\\DeepSeek\\nhat-ban\\tools\\photos-raw.json';
const UA = 'NhatBanIntroPage/1.0 (static demo page; build script)';

const [id, wikiTitle, lang = 'en'] = process.argv.slice(2);
if (!id || !wikiTitle) {
  console.error('Thiếu tham số: <id> "<tên bài wiki>"');
  process.exit(1);
}

function stripHtml(value) {
  return String(value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const api = async (host, params) => {
  const url = `https://${host}/w/api.php?` + new URLSearchParams({ format: 'json', formatversion: '2', ...params });
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error('API ' + res.status);
  return res.json();
};

const pageData = await api(lang + '.wikipedia.org', {
  action: 'query',
  titles: wikiTitle,
  prop: 'pageimages',
  piprop: 'name|thumbnail|original',
  pithumbsize: '1600'
});
const page = (pageData.query && pageData.query.pages && pageData.query.pages[0]) || {};
const fileName = page.pageimage;
if (!fileName) {
  console.error('Bài không có ảnh đại diện:', wikiTitle);
  process.exit(1);
}
console.log('ảnh đại diện:', fileName);

const infoData = await api('commons.wikimedia.org', {
  action: 'query',
  titles: 'File:' + fileName,
  prop: 'imageinfo',
  iiprop: 'url|size|mime|extmetadata',
  iiurlwidth: '1500'
});
const info = (infoData.query.pages[0].imageinfo || [])[0];
if (!info) {
  console.error('Không lấy được thông tin tệp');
  process.exit(1);
}

const res = await fetch(info.thumburl, { headers: { 'User-Agent': UA } });
if (!res.ok) throw new Error('Tải ảnh lỗi ' + res.status);
const buf = Buffer.from(await res.arrayBuffer());
if (buf.length < 40000) throw new Error('Ảnh quá nhỏ');

fs.writeFileSync(path.join(OUT_DIR, id + '.jpg'), buf);
console.log('đã lưu', id + '.jpg', Math.round(buf.length / 1024) + ' KB');

const meta = info.extmetadata || {};
const record = {
  id,
  query: 'Wikipedia lead: ' + wikiTitle,
  title: stripHtml(fileName),
  page: info.descriptionurl,
  artist: stripHtml((meta.Artist && meta.Artist.value) || 'Không rõ'),
  license: stripHtml((meta.LicenseShortName && meta.LicenseShortName.value) || 'Xem trang nguồn'),
  licenseUrl: (meta.LicenseUrl && meta.LicenseUrl.value) || '',
  width: info.width,
  height: info.height
};

let existing = [];
if (fs.existsSync(META_OUT)) {
  try { existing = JSON.parse(fs.readFileSync(META_OUT, 'utf8')); } catch { existing = []; }
}
const byId = new Map(existing.map((m) => [m.id, m]));
byId.set(id, record);
fs.writeFileSync(META_OUT, JSON.stringify([...byId.values()], null, 2), 'utf8');
console.log('credit:', record.artist, '|', record.license);
