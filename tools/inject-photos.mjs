// Gắn dữ liệu ảnh thật vào từng thẻ trong index.html (chạy một lần khi xây dựng)
import fs from 'node:fs';

const FILE = 'D:\\Ngo_Duc_Thang\\DeepSeek\\nhat-ban\\index.html';
let html = fs.readFileSync(FILE, 'utf8');

const CAMERA = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="7" width="18" height="13" rx="2.6" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="13.6" r="3.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M8.6 7l1.3-2.1h4.2L15.4 7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>';

const escapeAttr = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const cards = [
  // ---------- Vùng miền ----------
  {
    tag: '<article class="region-card reveal" style="--i:0" data-group="bac">',
    badgeAfter: '<div class="region-art art-hokkaido">',
    photo: 'hokkaido',
    title: 'Hokkaidō · 北海道',
    caption: 'Cánh đồng hoa oải hương ở Furano nhuộm tím cả sườn đồi vào giữa mùa hè Hokkaido.'
  },
  {
    tag: '<article class="region-card reveal" style="--i:1" data-group="bac">',
    badgeAfter: '<div class="region-art art-tohoku">',
    photo: 'tohoku',
    title: 'Tōhoku · 東北',
    caption: 'Đèn lồng Nebuta khổng lồ của lễ hội Aomori, được thắp sáng và diễu hành suốt đêm hè.'
  },
  {
    tag: '<article class="region-card reveal" style="--i:2" data-group="trung">',
    badgeAfter: '<div class="region-art art-kanto">',
    photo: 'kanto',
    title: 'Kantō · 関東',
    caption: 'Vạch sang đường Shibuya nhìn từ trên cao — nơi hàng nghìn người băng qua mỗi lượt đèn xanh.'
  },
  {
    tag: '<article class="region-card reveal" style="--i:3" data-group="trung">',
    badgeAfter: '<div class="region-art art-chubu">',
    photo: 'chubu',
    title: 'Chūbu · 中部',
    caption: 'Những ngôi nhà gasshō-zukuri mái tranh dốc đứng ở làng cổ Shirakawa-gō, tỉnh Gifu.'
  },
  {
    tag: '<article class="region-card reveal" style="--i:4" data-group="trung">',
    badgeAfter: '<div class="region-art art-kansai">',
    photo: 'kansai',
    title: 'Kansai · 関西',
    caption: 'Đường hầm cổng torii đỏ dẫn lên núi Inari — ngôi đền nổi tiếng nhất của Kyoto.'
  },
  {
    tag: '<article class="region-card reveal" style="--i:5" data-group="trung">',
    badgeAfter: '<div class="region-art art-chugoku">',
    photo: 'chugoku',
    title: 'Chūgoku & Shikoku · 中国・四国',
    caption: 'Cổng torii lớn của đền Itsukushima đứng giữa mặt nước khi thủy triều lên, đảo Miyajima.'
  },
  {
    tag: '<article class="region-card reveal" style="--i:6" data-group="nam">',
    badgeAfter: '<div class="region-art art-kyushu">',
    photo: 'kyushu',
    title: 'Kyūshū · 九州',
    caption: 'Núi lửa Sakurajima nhả khói trắng phía trên vịnh Kagoshima.'
  },
  {
    tag: '<article class="region-card reveal" style="--i:7" data-group="nam">',
    badgeAfter: '<div class="region-art art-okinawa">',
    photo: 'okinawa',
    title: 'Okinawa · 沖縄',
    caption: 'Bãi Kondoi trên đảo Taketomi: cát trắng mịn và nước biển xanh ngọc nông đến đầu gối.'
  },

  // ---------- Văn hóa ----------
  {
    tag: '<article class="culture-card reveal" style="--i:0">',
    photo: 'tea',
    title: 'Trà đạo · 茶道',
    caption: 'Những bát matcha được dâng theo từng động tác chậm rãi trong một buổi trà đạo trên chiếu tatami.'
  },
  {
    tag: '<article class="culture-card reveal" style="--i:1">',
    photo: 'kimono',
    title: 'Kimono · 着物',
    caption: 'Một maiko trong bộ kimono đỏ, che ô giấy truyền thống trên con phố cổ Kyoto.'
  },
  {
    tag: '<article class="culture-card reveal" style="--i:2">',
    photo: 'sumo',
    title: 'Sumo · 相撲',
    caption: 'Võ đài sumo (dohyō) giữa nhà thi đấu, nơi mỗi trận đấu có thể chỉ kéo dài vài giây.'
  },
  {
    tag: '<article class="culture-card reveal" style="--i:3">',
    photo: 'hanami',
    title: 'Hanami · 花見',
    caption: 'Người Nhật trải bạt dưới tán anh đào để ăn uống, trò chuyện và ngắm hoa nở.'
  },
  {
    tag: '<article class="culture-card reveal" style="--i:4">',
    photo: 'matsuri',
    title: 'Matsuri · 祭り',
    caption: 'Đoàn rước kiệu mikoshi đi qua cổng torii trong một lễ hội mùa hè.'
  },
  {
    tag: '<article class="culture-card reveal" style="--i:5">',
    photo: 'onsen',
    title: 'Onsen · 温泉',
    caption: 'Bồn onsen ngoài trời xây bằng đá, nhìn ra khu vườn chuyển màu mùa thu.'
  },

  // ---------- Ẩm thực ----------
  {
    tag: '<article class="food-card reveal" style="--i:0">',
    photo: 'sushi',
    title: 'Sushi · 寿司',
    caption: 'Đĩa nigiri với cá ngừ, tôm và trứng — món sushi cơ bản nhất trong bữa ăn Nhật.'
  },
  {
    tag: '<article class="food-card reveal" style="--i:1">',
    photo: 'ramen',
    title: 'Ramen · ラーメン',
    caption: 'Bát ramen shōyu nóng hổi với thịt heo, trứng và rong biển nori.'
  },
  {
    tag: '<article class="food-card reveal" style="--i:2">',
    photo: 'tempura',
    title: 'Tempura · 天ぷら',
    caption: 'Tôm lăn bột chiên giòn vàng ruộm, dùng nóng cùng nước chấm tensuyu.'
  },
  {
    tag: '<article class="food-card reveal" style="--i:3">',
    photo: 'wagyu',
    title: 'Wagyu · 和牛',
    caption: 'Miếng thịt bò wagyu với vân mỡ trắng như hoa, loại thịt nổi tiếng nhất Nhật Bản.'
  },
  {
    tag: '<article class="food-card reveal" style="--i:4">',
    photo: 'okonomiyaki',
    title: 'Okonomiyaki · お好み焼き',
    caption: 'Chiếc okonomiyaki phủ sốt, mayonnaise, cá bào và rong biển xanh.'
  },
  {
    tag: '<article class="food-card reveal" style="--i:5">',
    photo: 'matcha',
    title: 'Matcha · 抹茶',
    caption: 'Bát matcha xanh đậm vừa đánh bọt — loại trà dùng trong trà đạo.'
  },
  {
    tag: '<article class="food-card reveal" style="--i:6">',
    photo: 'takoyaki',
    title: 'Takoyaki · たこ焼き',
    caption: 'Những viên takoyaki nóng hổi rắc cá bào và sốt, món ăn đường phố nổi tiếng Osaka.'
  },
  {
    tag: '<article class="food-card reveal" style="--i:7">',
    photo: 'soba',
    title: 'Soba · 蕎麦',
    caption: 'Mì soba lạnh xếp trên khay tre (zaru soba), ăn cùng nước tương pha.'
  },

  // ---------- Lý do ----------
  {
    tag: '<article class="reason reveal" style="--i:0">',
    photo: 'fourseasons',
    title: 'Bốn mùa, bốn Nhật Bản',
    caption: 'Chùa Chureito, núi Phú Sĩ và hoa anh đào — khung cảnh biểu tượng nhất của Nhật Bản.'
  },
  {
    tag: '<article class="reason reveal" style="--i:1">',
    photo: 'craft',
    title: 'Tinh tế đến từng chi tiết',
    caption: 'Vườn thiền Ryoan-ji: mười lăm tảng đá xếp trên nền sỏi trắng được cào phẳng mỗi ngày.'
  },
  {
    tag: '<article class="reason reveal" style="--i:2">',
    photo: 'safe',
    title: 'An tâm và thuận tiện',
    caption: 'Tàu Shinkansen E5 — biểu tượng của hệ thống đường sắt đúng giờ nhất thế giới.'
  },

  // ---------- Thông tin nhanh ----------
  {
    tag: '<aside class="fact-card reveal" style="--i:2" aria-labelledby="factCardTitle">',
    photo: 'tokyo',
    title: 'Thông tin nhanh',
    caption: 'Tokyo, thủ đô Nhật Bản: vùng đô thị lớn nhất thế giới với hơn 37 triệu người.'
  },

  // ---------- Bốn từ khó dịch ----------
  {
    tag: '<li class="word reveal" style="--i:0">',
    photo: 'tea',
    title: '一期一会 · ichigo ichie',
    caption: 'Mỗi cuộc gặp chỉ đến một lần, như bát trà trong trà đạo — nên được nâng niu trọn vẹn.'
  },
  {
    tag: '<li class="word reveal" style="--i:1">',
    photo: 'spring',
    title: '物の哀れ · mono no aware',
    caption: 'Cánh anh đào nở rồi rơi: vẻ đẹp càng rực rỡ thì càng gợi nỗi tiếc nuối.'
  },
  {
    tag: '<li class="word reveal" style="--i:2">',
    photo: 'craft',
    title: '侘寂 · wabi-sabi',
    caption: 'Vườn đá Ryoan-ji — vẻ đẹp của sự giản dị, mộc mạc và không hoàn hảo.'
  },
  {
    tag: '<li class="word reveal" style="--i:3">',
    photo: 'day5',
    title: '木漏れ日 · komorebi',
    caption: 'Ánh nắng lọt qua những thân tre cao vút trong rừng tre Arashiyama.'
  },

  // ---------- Bốn mùa ----------
  {
    tag: '<div class="season-panel is-active" id="panel-haru" role="tabpanel" aria-labelledby="tab-haru" data-season="haru">',
    badgeAfter: '<div class="season-art">',
    photo: 'spring',
    title: 'Xuân · 春',
    caption: 'Hoa anh đào nở rộ trên nền trời xanh — dấu hiệu mùa xuân đã về khắp Nhật Bản.'
  },
  {
    tag: '<div class="season-panel" id="panel-natsu" role="tabpanel" aria-labelledby="tab-natsu" data-season="natsu" hidden>',
    badgeAfter: '<div class="season-art">',
    photo: 'summer',
    title: 'Hạ · 夏',
    caption: 'Pháo hoa hanabi bung nở trên thành phố trong một lễ hội mùa hè tháng Tám.'
  },
  {
    tag: '<div class="season-panel" id="panel-aki" role="tabpanel" aria-labelledby="tab-aki" data-season="aki" hidden>',
    badgeAfter: '<div class="season-art">',
    photo: 'autumn',
    title: 'Thu · 秋',
    caption: 'Hành lang gỗ của ngôi chùa nhìn ra những tán lá momiji đỏ rực giữa mùa thu.'
  },
  {
    tag: '<div class="season-panel" id="panel-fuyu" role="tabpanel" aria-labelledby="tab-fuyu" data-season="fuyu" hidden>',
    badgeAfter: '<div class="season-art">',
    photo: 'winter',
    title: 'Đông · 冬',
    caption: 'Tác phẩm điêu khắc tuyết được chiếu sáng tại lễ hội tuyết Sapporo.'
  },

  // ---------- Lịch trình ----------
  {
    tag: '<li class="day reveal" style="--i:0">',
    photo: 'day1',
    title: 'Ngày 1 · Tokyo — Shinjuku & Shibuya',
    caption: 'Shinjuku về đêm: những tòa nhà chọc trời sáng đèn của Tokyo.'
  },
  {
    tag: '<li class="day reveal" style="--i:1">',
    photo: 'day2',
    title: 'Ngày 2 · Tokyo — Asakusa, Ueno, Akihabara',
    caption: 'Cổng Kaminarimon của đền Sensō-ji ở Asakusa — nơi du khách dừng chân chụp ảnh mỗi ngày.'
  },
  {
    tag: '<li class="day reveal" style="--i:2">',
    photo: 'day3',
    title: 'Ngày 3 · Hakone — ngắm Phú Sĩ, nghỉ onsen',
    caption: 'Mặt hồ Kawaguchi phẳng lặng phản chiếu núi Phú Sĩ dưới nắng sớm.'
  },
  {
    tag: '<li class="day reveal" style="--i:3">',
    photo: 'day4',
    title: 'Ngày 4 · Kyoto — Fushimi Inari & Gion',
    caption: 'Chùa Kiyomizu-dera giữa mùa lá đỏ, nhìn từ sân chùa xuống thành phố Kyoto.'
  },
  {
    tag: '<li class="day reveal" style="--i:4">',
    photo: 'day5',
    title: 'Ngày 5 · Kyoto — Arashiyama & trà đạo',
    caption: 'Con đường tre Arashiyama, hai bên là tre cao vút che kín ánh nắng.'
  },
  {
    tag: '<li class="day reveal" style="--i:5">',
    photo: 'day6',
    title: 'Ngày 6 · Nara & Osaka',
    caption: 'Những chú nai đi lại giữa sân chùa Tōdai-ji ở Nara.'
  },
  {
    tag: '<li class="day reveal" style="--i:6">',
    photo: 'day7',
    title: 'Ngày 7 · Osaka — mua sắm và về nước',
    caption: 'Phố Dotonbori bên kênh đào, bảng hiệu và đèn lồng rực rỡ về đêm.'
  }
];

// Bỏ aria-hidden ở phần minh họa mùa để nút ảnh bên trong vẫn đọc được
html = html.split('<div class="season-art" aria-hidden="true">').join('<div class="season-art">');

let failed = 0;
const used = new Map();

for (const card of cards) {
  const count = html.split(card.tag).length - 1;
  if (count !== 1) {
    console.error(`KHÔNG KHỚP (${count} lần): ${card.tag}`);
    failed++;
    continue;
  }
  const attrs =
    ` data-photo="${escapeAttr(card.photo)}"` +
    ` data-photo-title="${escapeAttr(card.title)}"` +
    ` data-photo-caption="${escapeAttr(card.caption)}"`;
  const openTag = card.tag.slice(0, -1) + attrs + '>';

  const badge =
    `<button class="card-photo" type="button" data-photo-open` +
    ` aria-label="Xem ảnh thực tế: ${escapeAttr(card.title)}">${CAMERA}</button>`;

  let replacement = openTag;
  if (card.badgeAfter) {
    // Chèn nút vào bên trong phần minh họa (sau thẻ mở của nó)
    replacement += '\n          ' + card.badgeAfter.replace('>', '>') + '\n            ' + badge;
    // Phần còn lại của tag gốc đã nằm trong openTag, nên thay toàn bộ tag gốc
    const afterIndex = html.indexOf(card.tag) + card.tag.length;
    const rest = html.slice(afterIndex);
    const badgeAnchorIndex = rest.indexOf(card.badgeAfter);
    if (badgeAnchorIndex === -1) {
      console.error('KHÔNG TÌM THẤY NEO NÚT:', card.badgeAfter);
      failed++;
      continue;
    }
    const newRest =
      rest.slice(0, badgeAnchorIndex + card.badgeAfter.length) +
      '\n            ' + badge +
      rest.slice(badgeAnchorIndex + card.badgeAfter.length);
    html = html.slice(0, html.indexOf(card.tag)) + openTag + newRest;
  } else {
    replacement += '\n          ' + badge;
    html = html.replace(card.tag, replacement);
  }
  used.set(card.photo, (used.get(card.photo) || 0) + 1);
}

if (failed) {
  console.error(`\nDỪNG: ${failed} thẻ không chèn được, không ghi tệp.`);
  process.exit(1);
}

fs.writeFileSync(FILE, html, 'utf8');

const total = html.split('data-photo="').length - 1;
console.log(`Đã gắn ảnh cho ${cards.length} thẻ (${total} thẻ có data-photo trong tệp).`);
console.log('Số lần dùng mỗi ảnh:', [...used.entries()].map(([k, v]) => `${k}×${v}`).join(', '));
