// Tải ảnh thật từ Wikimedia Commons cho từng thẻ (chỉ dùng khi xây dựng trang)
// Dùng: node fetch-photos.mjs [--only id1,id2] [--force]
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = 'D:\\Ngo_Duc_Thang\\DeepSeek\\nhat-ban\\assets\\img\\photos';
const META_OUT = 'D:\\Ngo_Duc_Thang\\DeepSeek\\nhat-ban\\tools\\photos-raw.json';
const UA = 'NhatBanIntroPage/1.0 (static demo page; build script)';

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(path.dirname(META_OUT), { recursive: true });

const argv = process.argv.slice(2);
const onlyArg = argv.includes('--only') ? argv[argv.indexOf('--only') + 1] : '';
const only = onlyArg ? new Set(onlyArg.split(',')) : null;
const force = argv.includes('--force');

const topics = [
  { id: 'hokkaido', query: 'Furano lavender farm Hokkaido' },
  { id: 'tohoku', query: 'Aomori Nebuta festival' },
  { id: 'kanto', query: 'Shibuya Crossing Tokyo night' },
  { id: 'chubu', query: 'Shirakawa-go gassho village' },
  { id: 'kansai', query: 'Fushimi Inari torii gates' },
  { id: 'chugoku', query: 'Itsukushima Shrine torii Miyajima' },
  { id: 'kyushu', query: 'Sakurajima volcano Kagoshima' },
  { id: 'okinawa', query: 'Kondoi Beach Taketomi', fallback: 'Okinawa beach', force: true,
    negative: 'iss|satellite|aerial|map|nasa|from space|hotel|resort' },
  { id: 'tea', query: 'Japanese tea ceremony matcha', fallback: 'Tea ceremony Kyoto', force: true,
    negative: '1914|festival|laughing|postcard|archive|vintage' },
  { id: 'kimono', query: 'Maiko kimono Kyoto street', fallback: 'Kimono woman Japan' },
  { id: 'sumo', query: 'Sumo wrestlers tournament', fallback: 'Sumo wrestler Japan' },
  { id: 'hanami', query: 'Hanami cherry blossom picnic park' },
  { id: 'matsuri', query: 'Mikoshi festival procession Japan' },
  { id: 'onsen', query: 'Rotenburo outdoor onsen bath' },
  { id: 'sushi', query: 'Sushi nigiri plate' },
  { id: 'ramen', query: 'Ramen noodle soup bowl', fallback: 'Shoyu ramen bowl', force: true,
    negative: 'sukiya|jakarta|combo|gyudon|fast food|shop|restaurant|kazan|philippines|store|front|exterior|interior' },
  { id: 'tempura', query: 'Tempura shrimp', fallback: 'Tempura plate', force: true,
    negative: 'tomato|plastic|supermarket' },
  { id: 'wagyu', query: 'Wagyu beef steak' },
  { id: 'okonomiyaki', query: 'Okonomiyaki Japanese pancake' },
  { id: 'matcha', query: 'Matcha tea bowl whisk' },
  { id: 'takoyaki', query: 'Takoyaki plate', fallback: 'Takoyaki octopus balls', force: true },
  { id: 'soba', query: 'Zaru soba noodles', fallback: 'Soba buckwheat noodles', force: true,
    negative: 'sobá|soup' },
  { id: 'spring', query: 'Cherry blossoms Japan spring' },
  { id: 'summer', query: 'Fireworks festival Japan hanabi' },
  { id: 'autumn', query: 'Autumn maple leaves temple Kyoto' },
  { id: 'winter', query: 'Sapporo Snow Festival', fallback: 'Snow sculpture festival Japan', force: true,
    negative: 'navy|misawa|military|team attend|air force' },
  { id: 'fourseasons', query: 'Chureito Pagoda cherry blossom Fuji' },
  { id: 'craft', query: 'Japanese rock garden karesansui' },
  { id: 'safe', query: 'Shinkansen E5 series train', fallback: 'Tokaido Shinkansen', force: true,
    must: 'shinkansen|bullet train' },
  { id: 'day1', query: 'Shinjuku Tokyo night skyline' },
  { id: 'day2', query: 'Sensoji Kaminarimon gate', fallback: 'Asakusa Sensoji temple', force: true,
    negative: 'postcard|taisho|vintage|1914' },
  { id: 'day3', query: 'Mount Fuji Lake Kawaguchi', fallback: 'Lake Ashi Hakone', force: true,
    negative: 'postcard|vintage|sepia|archive' },
  { id: 'day4', query: 'Kiyomizu-dera Kyoto temple' },
  { id: 'day5', query: 'Arashiyama bamboo grove' },
  { id: 'day6', query: 'Nara deer park temple' },
  { id: 'day7', query: 'Dotonbori Osaka night' },
  { id: 'tips-transport', query: 'Shinkansen platform station' },
  { id: 'tips-money', query: 'Japanese yen banknotes', fallback: 'Japanese coins yen', force: true,
    negative: 'chart|graph|infographic|stamp|coin catalogue' },
  { id: 'tips-connect', query: 'Akihabara electronics store', fallback: 'Electronics shop Japan interior', force: true,
    negative: 'earthquake|news|disaster|map' },
  { id: 'tips-etiquette', query: 'Yamanote line platform waiting passengers', fallback: 'Tokyo train platform', force: true,
    negative: 'earthquake|disaster' },
  { id: 'tips-language', query: 'Ramen shop menu board', fallback: 'Izakaya menu Japan', force: true,
    negative: 'facade|exterior|window|building' }
];

const BAD = /(map|diagram|logo|flag|chart|graph|sign|poster|book|cover|plan|drawing|print|woodblock|ukiyo|stamp|coin|seal|manhole|license plate|menu|screenshot|panorama|postcard|archive|1914|1920|1930|meiji|taisho|edo-era|black and white)/i;

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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function apiSearch(query) {
  const url = 'https://commons.wikimedia.org/w/api.php?' + new URLSearchParams({
    action: 'query',
    format: 'json',
    formatversion: '2',
    generator: 'search',
    gsrsearch: query,
    gsrnamespace: '6',
    gsrlimit: '20',
    prop: 'imageinfo',
    iiprop: 'url|size|mime|extmetadata',
    iiurlwidth: '1500'
  });

  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (res.status === 429) {
      const wait = 6000 * (attempt + 1);
      console.log(`    429, chờ ${wait / 1000}s rồi thử lại...`);
      await sleep(wait);
      continue;
    }
    if (!res.ok) throw new Error('API ' + res.status);
    const data = await res.json();
    return (data.query && data.query.pages) || [];
  }
  throw new Error('API 429 quá số lần thử');
}

function score(page, topic) {
  const info = (page.imageinfo || [])[0];
  if (!info) return -1;
  const w = info.width, h = info.height;
  const ratio = w / h;
  if (info.mime !== 'image/jpeg' && info.mime !== 'image/png') return -1;
  if (w < 1100) return -1;
  if (ratio < 1.25 || ratio > 2.4) return -1;
  if (!info.thumburl) return -1;
  if (BAD.test(page.title)) return -1;
  if (topic.negative && new RegExp(topic.negative, 'i').test(page.title)) return -1;
  if (topic.must && !new RegExp(topic.must, 'i').test(page.title)) return -1;
  return 1000 - Math.abs(ratio - 1.6) * 100;
}

async function download(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error('tải ' + res.status);
  return Buffer.from(await res.arrayBuffer());
}

const results = [];

for (const topic of topics) {
  if (only && !only.has(topic.id)) continue;

  const target = path.join(OUT_DIR, topic.id + '.jpg');
  const hasFile = fs.existsSync(target) && fs.statSync(target).size > 40000;
  const mustRedo = topic.force || (only && only.has(topic.id));
  if (hasFile && !mustRedo) {
    console.log('skip (đã có)', topic.id);
    continue;
  }

  let done = false;
  const queries = [topic.query, topic.fallback].filter(Boolean);

  for (const q of queries) {
    if (done) break;
    try {
      console.log('…', topic.id, '|', q);
      const pages = await apiSearch(q);
      const ranked = pages
        .map((p) => ({ p, s: score(p, topic) }))
        .filter((x) => x.s > 0)
        .sort((a, b) => b.s - a.s);

      for (const { p } of ranked) {
        const info = p.imageinfo[0];
        try {
          const buf = await download(info.thumburl);
          if (buf.length < 40000) continue;
          fs.writeFileSync(target, buf);
          const meta = info.extmetadata || {};
          results.push({
            id: topic.id,
            query: q,
            title: stripHtml(p.title.replace(/^File:/, '')),
            page: info.descriptionurl,
            artist: stripHtml((meta.Artist && meta.Artist.value) || 'Không rõ'),
            license: stripHtml((meta.LicenseShortName && meta.LicenseShortName.value) || 'Xem trang nguồn'),
            licenseUrl: (meta.LicenseUrl && meta.LicenseUrl.value) || '',
            width: info.width,
            height: info.height
          });
          console.log('  ok →', p.title, `(${Math.round(buf.length / 1024)} KB)`);
          done = true;
          break;
        } catch (err) {
          console.log('  lỗi tải:', err.message);
          if (/429/.test(err.message)) await sleep(6000);
        }
      }
      if (!done) console.log('  không có ứng viên phù hợp');
    } catch (err) {
      console.log('  LỖI API:', err.message);
    }
    await sleep(1200);
  }
  if (!done) console.log('KHÔNG CÓ ẢNH', topic.id);
  await sleep(1500);
}

let existing = [];
if (fs.existsSync(META_OUT)) {
  try { existing = JSON.parse(fs.readFileSync(META_OUT, 'utf8')); } catch { existing = []; }
}
const byId = new Map(existing.map((m) => [m.id, m]));
for (const m of results) byId.set(m.id, m);
fs.writeFileSync(META_OUT, JSON.stringify([...byId.values()], null, 2), 'utf8');

const files = fs.readdirSync(OUT_DIR).filter((f) => f.endsWith('.jpg'));
const total = files.reduce((sum, f) => sum + fs.statSync(path.join(OUT_DIR, f)).size, 0);
console.log(`\nTổng: ${files.length} ảnh, ${(total / 1024 / 1024).toFixed(1)} MB`);
