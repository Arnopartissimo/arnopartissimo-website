#!/usr/bin/env python3
"""Extract content from Wix site into structured JSON (image URLs only)."""

import json
import re
import ssl
import urllib.request
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse
from pathlib import Path

BASE_DIR = Path("/Users/arnopartissimo/Documents/WEBSITE DEV DO NOT REMOVE/wix-export")
PAGES_DIR = BASE_DIR / "pages"
PROJECTS_DIR = BASE_DIR / "projects"

USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"

# Project pages to migrate (order matches creative-direction page listing)
PROJECT_SLUGS = [
    "finalshow",            # DJ Snake - Stade de France
    "upinthesky",           # Henri PFR - Up In The Sky
    "delxps13",             # Dell XPS 13
    "complicated",          # DJ Snake - Complicated
    "wannabeloved",         # Henri PFR - Wanna Be Loved
    # "alexgermys"          # ALEX GERMYS - WE KNOW NOTHING (slug unknown; not in sitemap)
    "stadedefranceapplication",  # crew application form (not a portfolio project)
]

# Main site pages
MAIN_PAGES = [
    ("", "index"),          # real homepage
    ("home", "home"),       # Wix store template page (separate)
    ("creative", "creative"),
    ("contact", "contact"),
]

SSL_CONTEXT = ssl.create_default_context()


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, context=SSL_CONTEXT, timeout=60) as resp:
        return resp.read().decode("utf-8", errors="replace")


def normalize_wix_image_url(url: str) -> str:
    url = url.split("?")[0].split(" ")[0]
    url = url.replace("%7E", "~").replace("%7C", "|").replace("%2C", ",").replace("%2F", "/")
    return url


def base_image_id(url: str) -> str:
    m = re.search(r"/media/([a-f0-9]+_[a-f0-9]+)~?mv2", url, re.I)
    if m:
        return m.group(1)
    m = re.search(r"/media/([a-f0-9]+_[a-f0-9]+)%7Emv2", url, re.I)
    if m:
        return m.group(1)
    return urlparse(url).path.split("/")[-1]


def is_placeholder_or_non_image(url: str) -> bool:
    if not url or url.rstrip("/").endswith("/media"):
        return True
    if "/ufonts/" in url:
        return True
    if ".woff" in url or ".ttf" in url:
        return True
    return False


class WixPageParser(HTMLParser):
    def __init__(self, url: str):
        super().__init__()
        self.url = url
        self.title = ""
        self.meta_description = ""
        self.og_title = ""
        self.og_description = ""
        self.og_image = ""
        self.canonical = ""
        self.favicon = ""
        self.json_ld = []
        self.image_urls = []
        self.text_parts = []
        self.in_title = False
        self.in_script = False
        self.in_style = False
        self.current_tag = None

    def handle_starttag(self, tag, attrs):
        self.current_tag = tag
        if tag in ("script", "style", "noscript"):
            if tag == "script":
                self.in_script = True
            elif tag == "style":
                self.in_style = True
            return
        attr = dict(attrs)
        if tag == "title":
            self.in_title = True
        if tag == "meta":
            name = attr.get("name", "").lower()
            prop = attr.get("property", "").lower()
            if name == "description":
                self.meta_description = attr.get("content", "")
            if prop == "og:title":
                self.og_title = attr.get("content", "")
            if prop == "og:description":
                self.og_description = attr.get("content", "")
            if prop == "og:image":
                self.og_image = attr.get("content", "")
            if name == "twitter:image":
                if not self.og_image:
                    self.og_image = attr.get("content", "")
        if tag == "link":
            rel = attr.get("rel", "").lower()
            if rel == "canonical":
                self.canonical = attr.get("href", "")
            if rel in ("icon", "shortcut icon") and attr.get("href", "").startswith("http"):
                self.favicon = attr.get("href", "")
        if tag == "img":
            src = attr.get("src") or attr.get("data-src") or attr.get("srcset")
            if src:
                self.image_urls.extend(self._extract_image_urls(src))
        if tag == "image":
            href = attr.get("href") or attr.get("xlink:href")
            if href:
                self.image_urls.extend(self._extract_image_urls(href))

    def handle_endtag(self, tag):
        if tag == "script":
            self.in_script = False
        if tag == "style":
            self.in_style = False
        if tag == "title":
            self.in_title = False
        self.current_tag = None

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        if self.in_script:
            if data.strip().startswith("{") and '"@type"' in data:
                try:
                    self.json_ld.append(json.loads(data))
                except Exception:
                    pass
            return
        if self.in_style:
            urls = re.findall(r'url\(["\']?(https?://[^\)"\']+)["\']?\)', data, re.I)
            self.image_urls.extend(urls)
            return
        if self.current_tag in ("script", "style", "noscript"):
            return
        text = data.strip()
        if text:
            self.text_parts.append(text)

    def _extract_image_urls(self, value: str):
        urls = []
        for part in re.split(r",\s*", value):
            u = part.strip().split(" ")[0]
            if u.startswith("http"):
                urls.append(u)
        return urls

    def extract_images_from_html(self, html: str):
        urls = re.findall(r'https://static\.wixstatic\.com/[^\s"\'<>\)]+', html)
        self.image_urls.extend(urls)


def extract_page(url_path: str, slug_override: str | None = None):
    url = urljoin("https://www.arnopartissimo.com/", url_path)
    print(f"Fetching {url} ...")
    html = fetch(url)
    parser = WixPageParser(url)
    parser.feed(html)
    parser.extract_images_from_html(html)

    seen_ids = {}
    for img in parser.image_urls:
        norm = normalize_wix_image_url(img)
        if is_placeholder_or_non_image(norm):
            continue
        img_id = base_image_id(norm)
        # Prefer URLs without resize params; longer URL usually means more info
        if img_id not in seen_ids or len(norm) > len(seen_ids[img_id]):
            seen_ids[img_id] = norm

    images = sorted(set(seen_ids.values()))

    # Drop tiny Wix placeholder thumbnails unless they are the only image
    filtered = []
    for img in images:
        if "/fill/w_32" in img or "/fill/w_192" in img or "/fill/w_180" in img:
            continue
        if "/fill/w_147,h_" in img and ("blur_2" in img or "q_80" in img):
            continue
        if "PayPal" in img or "Master%20Card" in img or "American%20Express" in img or "Visa" in img or "Diners" in img or "Discover" in img or "JCB" in img or "China%20Union%20Pay" in img:
            continue
        filtered.append(img)

    text = " ".join(parser.text_parts)
    text = re.sub(r"\s+", " ", text).strip()

    slug = slug_override if slug_override else (url_path.strip("/") if url_path.strip("/") else "home")

    return {
        "url": url,
        "slug": slug,
        "title": parser.title.strip(),
        "metaDescription": parser.meta_description.strip(),
        "ogTitle": parser.og_title.strip(),
        "ogDescription": parser.og_description.strip(),
        "ogImage": parser.og_image,
        "favicon": parser.favicon,
        "canonical": parser.canonical,
        "jsonLd": parser.json_ld,
        "images": filtered,
        "text": text,
        "rawHtmlPath": f"pages/{slug}.html",
    }


def clean_text(text: str) -> str:
    # Remove zero-width spaces and similar invisible chars
    text = text.replace("\u200b", " ").replace("\u200c", " ").replace("\u200d", " ")
    text = re.sub(r"\s+", " ", text)
    return text.strip(". \t\n")


def parse_project_metadata(text: str, slug: str, title: str) -> dict:
    """Best-effort parse of project metadata from visible text."""
    display_title = title.split(" | ")[0].strip() if " | " in title else title.strip()
    meta = {
        "title": display_title,
        "slug": slug,
        "year": None,
        "client": None,
        "role": None,
        "location": None,
        "tags": [],
        "description": None,
        "credits": None,
        "management": None,
        "label": None,
        "agency": None,
        "model": None,
        "brand": None,
    }

    body = clean_text(text)
    body = re.sub(r"top of page|bottom of page", "", body, flags=re.I)
    body = re.sub(r"ARNO PARTISSIMO\.", "", body)
    body = re.sub(r"PHOTO\. CREATIVE DIRECTION\. CONTACT STORE\.", "", body)
    body = re.sub(r"MY ACCOUNT FAQ", "", body, flags=re.I)
    body = re.sub(r"ARNO PARTISSIMO INSTAGRAM\.", "", body)
    body = re.sub(r"AVAILABLE WORLDWIDE BOOKING / GENERAL INQUIRIES ARNO@ARNOPARTISSIMO\.COM", "", body)
    body = clean_text(body)

    # Extract the project content block
    content_match = re.search(
        rf"{re.escape(display_title.upper())}\s+(.*?)(?=\b(MY ACCOUNT|AVAILABLE WORLDWIDE|ARNO PARTISSIMO INSTAGRAM|BOOKING/GENERAL)\b)",
        body,
        re.S | re.I,
    )
    if not content_match:
        content_match = re.search(rf"{re.escape(display_title)}\s+(.*)", body, re.S | re.I)
    content = clean_text(content_match.group(1)) if content_match else body

    # Header-based extraction: each "Header : value" ends at the next "Header :".
    headers = ["Roles", "Management", "Label", "Brand", "Agency", "Model", "Graphic design"]
    # Sort by length descending so "Graphic design" is matched before "Design" if ever added
    header_pattern = re.compile(
        r"\b(" + "|".join(re.escape(h) for h in sorted(headers, key=len, reverse=True)) + r")\s*[:\-–]\s*", re.I
    )
    matches = list(header_pattern.finditer(content))
    fields: dict[str, str] = {}
    for i, m in enumerate(matches):
        key = m.group(1).strip().lower()
        start = m.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(content)
        val = clean_text(content[start:end])
        fields[key] = val

    meta["role"] = fields.get("roles")
    meta["management"] = fields.get("management")
    meta["label"] = fields.get("label")
    meta["brand"] = fields.get("brand")
    meta["agency"] = fields.get("agency")
    meta["model"] = fields.get("model")
    meta["credits"] = fields.get("graphic design")

    if meta["role"]:
        meta["tags"] = [clean_text(t) for t in re.split(r"[,/]", meta["role"]) if t.strip()]

    if meta["brand"]:
        meta["client"] = meta["brand"]
    elif meta["label"]:
        meta["client"] = meta["label"]

    # Description: visible subtitle + metadata summary
    subtitle_match = re.search(
        rf"{re.escape(display_title.upper())}\s+([A-Z][^|]*?)\s+(?=Roles|Management|Label|Brand|Agency|Model|Graphic)",
        content,
        re.I,
    )
    subtitle = clean_text(subtitle_match.group(1)) if subtitle_match else display_title

    parts = [p for p in [subtitle, meta["role"], meta["management"], meta["label"], meta["brand"], meta["agency"], meta["model"], meta["credits"]] if p]
    meta["description"] = "\n".join(parts)

    return meta


def main():
    PAGES_DIR.mkdir(parents=True, exist_ok=True)
    PROJECTS_DIR.mkdir(parents=True, exist_ok=True)

    results = {
        "site": None,
        "pages": {},
        "projects": {},
    }

    # Main pages
    for path, slug in MAIN_PAGES:
        page = extract_page(path, slug_override=slug)
        results["pages"][slug] = page
        (PAGES_DIR / f"{slug}.html").write_text(fetch(page["url"]), encoding="utf-8")

    # Project pages
    for slug in PROJECT_SLUGS:
        page = extract_page(slug)
        page["metadata"] = parse_project_metadata(page["text"], slug, page["title"])
        results["projects"][slug] = page
        (PROJECTS_DIR / f"{slug}.json").write_text(
            json.dumps(page, indent=2, ensure_ascii=False), encoding="utf-8"
        )
        (PAGES_DIR / f"{slug}.html").write_text(fetch(page["url"]), encoding="utf-8")

    # Site-wide settings
    home = results["pages"].get("index", {})
    contact = results["pages"].get("contact", {})
    email_match = re.search(r"[\w.-]+@[\w.-]+\.\w+", contact.get("text", ""))
    site = {
        "title": "Arno Partissimo",
        "description": home.get("ogDescription") or home.get("metaDescription") or "",
        "favicon": home.get("favicon", ""),
        "contactEmail": email_match.group(0) if email_match else "",
        "footerText": "AVAILABLE WORLDWIDE BOOKING / GENERAL INQUIRIES ARNO@ARNOPARTISSIMO.COM",
        "socialLinks": [
            {"platform": "Instagram", "url": "https://www.instagram.com/arnopartissimo/"}
        ],
    }
    results["site"] = site

    # Save aggregate JSON
    (BASE_DIR / "site-settings.json").write_text(
        json.dumps(site, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    (BASE_DIR / "pages.json").write_text(
        json.dumps(results["pages"], indent=2, ensure_ascii=False), encoding="utf-8"
    )
    (BASE_DIR / "projects.json").write_text(
        json.dumps(results["projects"], indent=2, ensure_ascii=False), encoding="utf-8"
    )

    print("\nExtraction complete.")
    print(f"Pages extracted: {list(results['pages'].keys())}")
    print(f"Projects extracted: {list(results['projects'].keys())}")
    print(f"Total project images found: {sum(len(p['images']) for p in results['projects'].values())}")
    print(f"Total page images found: {sum(len(p['images']) for p in results['pages'].values())}")


if __name__ == "__main__":
    main()
