// Chụp ảnh các phần có nút mở ảnh (kiểm tra giao diện)
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const SITE = 'D:\\Ngo_Duc_Thang\\DeepSeek\\nhat-ban';
const SHOTS = path.join(SITE, 'tools', 'shots');
const PORT = 9477;
const PAGE = 'file:///D:/Ngo_Duc_Thang/DeepSeek/nhat-ban/index.html';

fs.mkdirSync(SHOTS, { recursive: true });

const child = spawn(EDGE, [
  '--headless', '--no-sandbox', '--disable-gpu', '--disable-crash-reporter',
  '--disable-breakpad', '--no-first-run', '--no-default-browser-check',
  '--disable-sync', '--hide-scrollbars', '--force-device-scale-factor=1',
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${path.join(SITE, '.edge-shots')}`,
  'about:blank'
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url, tries = 80) {
  for (let i = 0; i < tries; i++) {
    try { const res = await fetch(url); if (res.ok) return res.json(); } catch { /* chờ */ }
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
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text);
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
  console.log('saved', name);
}

async function prepare() {
  await sleep(900);
  await ev('document.fonts.ready.then(() => true)');
  await ev(`
    document.documentElement.style.scrollBehavior = 'auto';
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
    document.querySelectorAll('[data-count]').forEach(function (el) {
      el.textContent = new Intl.NumberFormat('vi-VN').format(parseInt(el.getAttribute('data-count'), 10));
    });
    true;
  `);
  await sleep(400);
}

try {
  await send('Page.enable');
  await send('Runtime.enable');

  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: PAGE });
  await ready();
  await prepare();

  for (const [name, id] of [
    ['s1-regions', 'vung-mien'],
    ['s2-culture', 'van-hoa'],
    ['s3-food', 'am-thuc'],
    ['s4-words', 'words'],
    ['s5-seasons', 'bon-mua'],
    ['s6-overview', 'tong-quan'],
    ['s7-tips', 'kinh-nghiem']
  ]) {
    const top = await ev(`(function () {
      var el = document.querySelector('#${id}') || document.querySelector('.words');
      return Math.round(el.getBoundingClientRect().top + window.scrollY);
    })()`);
    await ev(`window.scrollTo(0, ${Math.max(0, top)}); true;`);
    await sleep(400);
    await shot(name);
  }

  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await send('Page.navigate', { url: PAGE });
  await ready();
  await prepare();
  const topMobile = await ev(`(function () {
    var el = document.getElementById('vung-mien');
    return Math.round(el.getBoundingClientRect().top + window.scrollY);
  })()`);
  await ev(`window.scrollTo(0, ${topMobile + 260}); true;`);
  await sleep(400);
  await shot('m-regions');
} finally {
  try { await send('Browser.close'); } catch { /* bỏ qua */ }
  ws.close();
  child.kill();
  await sleep(300);
}
