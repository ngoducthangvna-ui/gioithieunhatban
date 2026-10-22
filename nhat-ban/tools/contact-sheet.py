from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(r"D:\Ngo_Duc_Thang\DeepSeek\nhat-ban")
PHOTOS = ROOT / "assets" / "img" / "photos"
ORDER = [
    "hokkaido", "tohoku", "kanto", "chubu", "kansai", "chugoku", "kyushu", "okinawa",
    "tea", "kimono", "sumo", "hanami", "matsuri", "onsen",
    "sushi", "ramen", "tempura", "wagyu", "okonomiyaki", "matcha", "takoyaki", "soba",
    "spring", "summer", "autumn", "winter", "fourseasons", "craft", "safe",
    "day1", "day2", "day3", "day4", "day5", "day6", "day7",
    "tips-transport", "tips-money", "tips-connect", "tips-etiquette", "tips-language",
]

COLS, CELL_W, CELL_H, LABEL_H = 6, 300, 200, 26
ROWS = (len(ORDER) + COLS - 1) // COLS
canvas = Image.new("RGB", (COLS * CELL_W, ROWS * (CELL_H + LABEL_H)), "#111823")
draw = ImageDraw.Draw(canvas)

try:
    font = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 17)
except OSError:
    font = ImageFont.load_default()

for index, name in enumerate(ORDER):
    x = (index % COLS) * CELL_W
    y = (index // COLS) * (CELL_H + LABEL_H)
    file = PHOTOS / (name + ".jpg")
    if not file.exists():
        draw.rectangle([x, y, x + CELL_W - 4, y + CELL_H], fill="#3a1a1a")
        draw.text((x + 8, y + 8), name + " (thiếu)", font=font, fill="#ffb4a8")
        continue
    image = Image.open(file).convert("RGB")
    # cắt giữa để lấp đầy ô
    scale = max(CELL_W / image.width, CELL_H / image.height)
    new = image.resize((int(image.width * scale + 0.5), int(image.height * scale + 0.5)), Image.LANCZOS)
    left = (new.width - CELL_W) // 2
    top = (new.height - CELL_H) // 2
    canvas.paste(new.crop((left, top, left + CELL_W, top + CELL_H)), (x, y))
    draw.rectangle([x, y + CELL_H, x + CELL_W - 4, y + CELL_H + LABEL_H - 2], fill="#0b1220")
    draw.text((x + 8, y + CELL_H + 3), f"{index + 1:02d} {name}", font=font, fill="#f2b8c6")

canvas.save(ROOT / "tools" / "contact-sheet.jpg", quality=88)
print("saved", canvas.size)
