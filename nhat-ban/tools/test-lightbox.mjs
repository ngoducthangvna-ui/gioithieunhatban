// Kiểm tra hộp xem ảnh: mở/đóng, ảnh tải được, nội dung, bàn phím, đếm ảnh, ảnh chụp
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const SITE = 'D:\\Ngo_Duc_Thang\\DeepSeek\\nhat-ban';
const SHOTS = path.join(SITE, 'tools', 'shots');
const PORT = 9466;
const PAGE = 'file:///D:/Ngo_Duc_Thang/DeepSeek/nhat-ban/index.html';

fs.mkdirSync(SHOTS, { recursive: true });

const child = spawn(EDGE, [
  '--headless', '--no-sandbox', '--disable-gpu', '--disable-crash-reporter',
  '--disable-breakpad', '--no-first-run', '--no-default-browser-check',
  '--disable-sync', '--hide-scrollbars', '--force-device-scale-factor=1',
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${path.join(SITE, '.edge-test')}`,
  'about:blank'
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url, tries = 80) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return res.json();
    } catch { /* chờ */ }
    await sleep(250);
  }
  throw new Error('DevTools không sẵn sàng');
}

const list = await getJson(`http://127.0.0.1:${PORT}/json/list`);
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = () => rej(new Error('ws')); });

let nextId = 1;
const pending = new Map();
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(new Error(msg.error.message));
    else resolve(msg.result);
  }
};
function send(method, params = {}) {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
    setTimeout(() => { if (pending.has(id)) { pending.delete(id); reject(new Error('timeout ' + method)); } }, 25000);
  });
}
async function ev(expression) {
  const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + ' ' + (r.exceptionDetails.exception?.description || ''));
  return r.result.value;
}
async function ready() {
  for (let i = 0; i < 100; i++) {
    try { if (await ev('document.readyState') === 'complete') return; } catch { /* chờ */ }
    await sleep(200);
  }
}
async function shot(name) {
  const { data } = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(SHOTS, name + '.png'), Buffer.from(data, 'base64'));
  console.log('  ảnh chụp:', name);
}
async function key(k, code, vk) {
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: k, code, windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code, windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk });
}

const results = [];
function check(name, pass, detail) {
  results.push({ name, pass });
  console.log((pass ? 'PASS' : 'FAIL') + '  ' + name + (detail !== undefined ? '  → ' + JSON.stringify(detail) : ''));
}

try {
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: PAGE });
  await ready();
  await sleep(1200);

  // 1. Số thẻ và nút
  const counts = await ev(`({
    triggers: document.querySelectorAll('[data-photo]').length,
    buttons: document.querySelectorAll('.card-photo').length,
    visible: Array.prototype.filter.call(document.querySelectorAll('[data-photo]'), function (el) { return el.getClientRects().length > 0; }).length,
    badCharset: (window.JAPAN_PHOTOS ? window.JAPAN_PHOTOS.kansai.credit : ''),
    overflow: document.documentElement.scrollWidth - window.innerWidth
  })`);
  check('41 thẻ có ảnh và 41 nút mở ảnh', counts.triggers === 41 && counts.buttons === 41, counts);
  check('Credit đọc đúng (không lỗi font)', /CC|Public|CC0/i.test(counts.badCharset), counts.badCharset);
  check('Không tràn ngang sau khi thêm nút', counts.overflow <= 0, { overflow: counts.overflow });

  // 2. Mở bằng cách bấm vào thẻ ảnh Kansai
  await ev('document.querySelector(\'[data-photo="kansai"]\').click()');
  await sleep(900);
  const opened = await ev(`(function () {
    var lb = document.getElementById('lightbox');
    var img = document.getElementById('lightboxImage');
    return {
      hidden: lb.hidden,
      title: document.getElementById('lightboxTitle').textContent,
      caption: document.getElementById('lightboxCaption').textContent,
      credit: document.getElementById('lightboxCredit').textContent,
      source: document.getElementById('lightboxSource').getAttribute('href'),
      count: document.getElementById('lightboxCount').textContent,
      loaded: img.complete && img.naturalWidth > 0,
      width: img.naturalWidth,
      focus: document.activeElement.className,
      bodyLocked: document.documentElement.classList.contains('lightbox-open')
    };
  })()`);
  check('Bấm thẻ mở hộp ảnh', opened.hidden === false, { hidden: opened.hidden });
  check('Ảnh thật tải được', opened.loaded === true, { loaded: opened.loaded, width: opened.width });
  check('Có tiêu đề + dòng giới thiệu + credit', opened.title.includes('Kansai') && opened.caption.length > 20 && opened.credit.length > 3, {
    title: opened.title, caption: opened.caption.slice(0, 60) + '…', credit: opened.credit
  });
  check('Có liên kết nguồn Wikimedia', opened.source.startsWith('https://commons.wikimedia.org/'), { source: opened.source });
  check('Đếm ảnh + khóa cuộn + focus vào nút đóng', new RegExp('^Ảnh \\d+ / ' + counts.visible + '$').test(opened.count) && opened.bodyLocked === true && /lightbox-close/.test(opened.focus), {
    count: opened.count, visible: counts.visible, locked: opened.bodyLocked, focus: opened.focus
  });
  await shot('01-lightbox-desktop');

  // 3. Phím mũi tên chuyển ảnh
  const firstTitle = opened.title;
  await key('ArrowRight', 'ArrowRight', 39);
  await sleep(700);
  const afterNext = await ev(`({
    title: document.getElementById('lightboxTitle').textContent,
    count: document.getElementById('lightboxCount').textContent,
    loaded: (function(){ var i = document.getElementById('lightboxImage'); return i.complete && i.naturalWidth > 0; })()
  })`);
  check('Phím → chuyển ảnh kế tiếp', afterNext.title !== firstTitle && afterNext.loaded === true, afterNext);
  await shot('02-lightbox-next');

  // 4. Escape đóng và trả tiêu điểm
  await key('Escape', 'Escape', 27);
  await sleep(500);
  const closed = await ev(`({
    hidden: document.getElementById('lightbox').hidden,
    locked: document.documentElement.classList.contains('lightbox-open'),
    focus: document.activeElement.getAttribute && document.activeElement.getAttribute('aria-label')
  })`);
  check('Escape đóng hộp ảnh, mở khóa cuộn', closed.hidden === true && closed.locked === false, closed);
  check('Tiêu điểm trả về nút vừa bấm', /Xem ảnh thực tế: Kansai/.test(closed.focus || ''), { focus: closed.focus });

  // 5. Mở từ nút nhỏ (bàn phím) + ảnh món ăn, chụp màn hình
  await ev('document.querySelector(\'[data-photo="sushi"] .card-photo\').click()');
  await sleep(900);
  const food = await ev(`({
    hidden: document.getElementById('lightbox').hidden,
    title: document.getElementById('lightboxTitle').textContent,
    loaded: (function(){ var i = document.getElementById('lightboxImage'); return i.complete && i.naturalWidth > 0; })()
  })`);
  check('Nút camera mở đúng ảnh món ăn', food.hidden === false && food.loaded === true && /Sushi/.test(food.title), food);
  await shot('03-lightbox-food');

  // 6. Lọc vùng miền rồi mở: số ảnh phải theo số thẻ đang hiện
  await key('Escape', 'Escape', 27);
  await sleep(300);
  await ev('document.querySelector(\'[data-filter="bac"]\').click()');
  await sleep(400);
  await ev('document.querySelector(\'[data-photo="hokkaido"]\').click()');
  await sleep(700);
  const filtered = await ev(`({
    count: document.getElementById('lightboxCount').textContent,
    visibleTriggers: Array.prototype.filter.call(document.querySelectorAll('[data-photo]'), function (el) { return el.getClientRects().length > 0; }).length
  })`);
  const denominator = Number((filtered.count.match(/\/ (\d+)$/) || [])[1]);
  check('Khi lọc, hộp ảnh chỉ đếm thẻ đang hiển thị', denominator === filtered.visibleTriggers, filtered);
  await key('Escape', 'Escape', 27);
  await sleep(200);
  await ev('document.querySelector(\'[data-filter="all"]\').click()');
  await sleep(300);

  // 7. Bốn mùa: nút ảnh trong panel đang mở
  await ev('document.getElementById("tab-natsu").click()');
  await sleep(600);
  const season = await ev(`(function () {
    var panel = document.getElementById('panel-natsu');
    var btn = panel.querySelector('.card-photo');
    btn.click();
    return { exists: !!btn };
  })()`);
  await sleep(800);
  const seasonOpen = await ev(`({
    hidden: document.getElementById('lightbox').hidden,
    title: document.getElementById('lightboxTitle').textContent,
    loaded: (function(){ var i = document.getElementById('lightboxImage'); return i.complete && i.naturalWidth > 0; })()
  })`);
  check('Mở ảnh mùa Hạ từ tab mùa', season.exists && seasonOpen.hidden === false && seasonOpen.loaded && /Hạ/.test(seasonOpen.title), seasonOpen);
  await shot('04-lightbox-season');
  await key('Escape', 'Escape', 27);
  await sleep(300);

  // 8. Di động
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await send('Page.navigate', { url: PAGE });
  await ready();
  await sleep(1200);
  await ev('document.querySelector(\'[data-photo="kansai"]\').click()');
  await sleep(1000);
  const mobile = await ev(`({
    hidden: document.getElementById('lightbox').hidden,
    loaded: (function(){ var i = document.getElementById('lightboxImage'); return i.complete && i.naturalWidth > 0; })(),
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    panelWidth: Math.round(document.querySelector('.lightbox-panel').getBoundingClientRect().width)
  })`);
  check('Trên di động hộp ảnh mở đúng, ảnh tải được', mobile.hidden === false && mobile.loaded === true, mobile);
  check('Di động không tràn ngang', mobile.overflow <= 0, { overflow: mobile.overflow });
  await shot('05-lightbox-mobile');

  // 9. Vuốt ngang trên di động để chuyển ảnh
  const beforeSwipe = await ev('document.getElementById("lightboxTitle").textContent');
  await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 320, y: 380 }] });
  await send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 180, y: 384 }] });
  await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await sleep(700);
  const afterSwipe = await ev(`({
    title: document.getElementById('lightboxTitle').textContent,
    count: document.getElementById('lightboxCount').textContent
  })`);
  check('Vuốt ngang chuyển sang ảnh kế tiếp', afterSwipe.title !== beforeSwipe, {
    before: beforeSwipe, after: afterSwipe.title, count: afterSwipe.count
  });

  check('Tổng số kiểm tra đạt', results.every((r) => r.pass), {
    passed: results.filter((r) => r.pass).length, total: results.length
  });
} finally {
  try { await send('Browser.close'); } catch { /* bỏ qua */ }
  ws.close();
  child.kill();
  await sleep(300);
}
