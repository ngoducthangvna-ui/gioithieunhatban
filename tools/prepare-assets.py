"""Nén ảnh cho nhẹ và sinh tệp credit (assets/js/photos.js) từ tools/photos-raw.json."""
import json
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(r"D:\Ngo_Duc_Thang\DeepSeek\nhat-ban")
PHOTOS = ROOT / "assets" / "img" / "photos"
RAW = ROOT / "tools" / "photos-raw.json"
JS = ROOT / "assets" / "js" / "photos.js"

MAX_W = 1600
QUALITY = 84

before = after = 0
for file in sorted(PHOTOS.glob("*.jpg")):
    size_before = file.stat().st_size
    before += size_before
    with Image.open(file) as img:
        img = ImageOps.exif_transpose(img).convert("RGB")
        if img.width > MAX_W:
            height = round(img.height * MAX_W / img.width)
            img = img.resize((MAX_W, height), Image.LANCZOS)
        img.save(file, "JPEG", quality=QUALITY, optimize=True, progressive=True)
    after += file.stat().st_size
    print(f"{file.name:22s} {size_before/1024:7.0f} KB → {file.stat().st_size/1024:7.0f} KB")

print(f"Tổng: {before/1024/1024:.1f} MB → {after/1024/1024:.1f} MB")

raw = {item["id"]: item for item in json.loads(RAW.read_text(encoding="utf-8"))}

lines = [
    "/* Ảnh thật cho từng thẻ: sinh tự động từ tools/photos-raw.json",
    "   Nguồn: Wikimedia Commons. Giấy phép ghi kèm từng ảnh. */",
    "window.JAPAN_PHOTOS = {",
]
for photo_id in sorted(raw):
    item = raw[photo_id]
    artist = (item.get("artist") or "Không rõ").strip()
    if len(artist) > 70:
        artist = artist[:67].rstrip() + "…"
    license_name = (item.get("license") or "Xem trang nguồn").strip()
    credit = f"{artist} · {license_name}"
    source = item.get("page") or ""
    title = (item.get("title") or "").replace('"', "'")
    lines.append(f'  {json.dumps(photo_id)}: {{ credit: {json.dumps(credit, ensure_ascii=False)}, '
                 f'source: {json.dumps(source, ensure_ascii=False)}, file: {json.dumps(title, ensure_ascii=False)} }},')
lines.append("};")
lines.append("")

JS.write_text("\n".join(lines), encoding="utf-8")
print("Đã ghi", JS, "với", len(raw), "ảnh")
