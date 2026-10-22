import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(r"D:\Ngo_Duc_Thang\DeepSeek\nhat-ban")
html = (ROOT / "index.html").read_text(encoding="utf-8")

VOID = {
    "area", "base", "br", "col", "embed", "hr", "img", "input", "link",
    "meta", "param", "source", "track", "wbr",
}


class Checker(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.errors = []
        self.ids = []
        self.hrefs = []
        self.controls = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            self.ids.append(a["id"])
        if tag == "a" and a.get("href", "").startswith("#"):
            self.hrefs.append(a["href"][1:])
        for key in ("aria-controls", "aria-labelledby", "aria-describedby"):
            if key in a:
                self.controls.extend(a[key].split())
        if tag in VOID:
            return
        self.stack.append((tag, self.getpos()))

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID and self.stack and self.stack[-1][0] == tag:
            self.stack.pop()

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        if not self.stack:
            self.errors.append(f"thẻ đóng thừa </{tag}> tại {self.getpos()}")
            return
        if self.stack[-1][0] == tag:
            self.stack.pop()
            return
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                for t, pos in self.stack[i + 1:]:
                    self.errors.append(f"thiếu thẻ đóng </{t}> (mở tại {pos})")
                del self.stack[i:]
                return
        self.errors.append(f"thẻ đóng không khớp </{tag}> tại {self.getpos()}")


checker = Checker()
checker.feed(html)
for tag, pos in checker.stack:
    checker.errors.append(f"thiếu thẻ đóng </{tag}> (mở tại {pos})")

dupe_ids = sorted({i for i in checker.ids if checker.ids.count(i) > 1})
missing_href = sorted({h for h in checker.hrefs if h and h not in checker.ids})
missing_controls = sorted({c for c in checker.controls if c not in checker.ids})

css = (ROOT / "assets" / "css" / "styles.css").read_text(encoding="utf-8")
local_refs = re.findall(r'(?:href|src)="(?!https?:|#|mailto:)([^"]+)"', html)
missing_files = sorted({r for r in local_refs if not (ROOT / r).exists()})

print("HTML:")
print("  lỗi cấu trúc:", checker.errors or "không có")
print("  id trùng:", dupe_ids or "không có")
print(f"  tổng id: {len(checker.ids)}, liên kết nội bộ: {len(checker.hrefs)}")
print("  href không có đích:", missing_href or "không có")
print("  aria trỏ tới id không tồn tại:", missing_controls or "không có")
print("  tệp cục bộ thiếu:", missing_files or "không có")
print("CSS:")
print("  lệch ngoặc nhọn:", css.count("{") - css.count("}"))
print("  lệch ngoặc tròn:", css.count("(") - css.count(")"))
print(f"  số dòng: {css.count(chr(10)) + 1}")
print("Ảnh:")
print("  data-photo:", html.count('data-photo="'))
print("  nút card-photo:", html.count('class="card-photo"'))
print("  tệp ảnh:", len(list((ROOT / "assets" / "img" / "photos").glob("*.jpg"))))

ok = (
    not checker.errors and not dupe_ids and not missing_href and not missing_controls
    and not missing_files
    and css.count("{") == css.count("}")
    and css.count("(") == css.count(")")
    and html.count('data-photo="') == html.count('class="card-photo"')
)
print("KẾT QUẢ:", "ĐẠT" if ok else "CÓ LỖI")
sys.exit(0 if ok else 1)
