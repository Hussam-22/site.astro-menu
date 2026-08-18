/**
 * Generates public/opengraph.jpg — the card that appears whenever any page of
 * the site is shared on WhatsApp, LinkedIn, Slack, X or Facebook.
 *
 * The repo previously shipped the Astroship starter template's promo image,
 * which advertised somebody else's product on every share. This renders a real
 * card in the site's own type and colours instead.
 *
 * Run: node scripts/make-og.mjs
 */
import { chromium } from 'playwright'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const b64 = async (p) => (await readFile(path.join(root, p))).toString('base64')

const anton = await b64('node_modules/@fontsource/anton/files/anton-latin-400-normal.woff2')
const afacad = await b64(
	'node_modules/@fontsource-variable/afacad/files/afacad-latin-wght-normal.woff2'
)
const phone = await b64('src/assets/screens/menu-sections.png')

const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
@font-face{font-family:Anton;src:url(data:font/woff2;base64,${anton}) format('woff2');font-weight:400}
@font-face{font-family:Afacad;src:url(data:font/woff2;base64,${afacad}) format('woff2');font-weight:100 900}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#fdf6ec;font-family:Afacad,sans-serif;color:#0d0b09;
     display:flex;align-items:center;gap:56px;padding:64px 72px;overflow:hidden;position:relative}
.left{flex:1;min-width:0}
.brand{display:flex;align-items:center;gap:14px;margin-bottom:34px}
.mark{width:56px;height:56px;border-radius:16px;border:3px solid #0d0b09;
      background:linear-gradient(135deg,#FF8904,#FF637E);display:grid;place-items:center}
.wordmark{font-family:Anton;font-size:42px;letter-spacing:-.01em;text-transform:uppercase}
h1{font-family:Anton;font-size:82px;line-height:.92;letter-spacing:-.02em;text-transform:uppercase}
h1 .dot{color:#CA3500}
p{font-size:30px;color:#5b5148;margin-top:26px;max-width:22ch}
.pills{display:flex;gap:12px;margin-top:34px;flex-wrap:wrap}
.pill{font-family:Anton;font-size:21px;text-transform:uppercase;padding:9px 20px;border-radius:999px;
      border:3px solid #0d0b09}
.o{background:#FF8904}.r{background:#FF637E}.w{background:#fff}
.phone{width:290px;flex:none;border:5px solid #0d0b09;border-radius:44px;background:#000;padding:9px;
       box-shadow:12px 12px 0 #FF8904;transform:rotate(3deg)}
.phone img{display:block;width:100%;border-radius:34px}
</style></head><body>
  <div class="left">
    <div class="brand">
      <span class="mark">
        <svg viewBox="0 0 24 24" width="30" height="30" fill="none">
          <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z" stroke="#fff" stroke-width="2.6" stroke-linejoin="round"/>
          <path d="M14 14h2.5v2.5H14zM17.5 17.5H20V20h-2.5z" fill="#fff"/>
        </svg>
      </span>
      <span class="wordmark">Astro-Menu</span>
    </div>
    <h1>The menu they<br>actually read<span class="dot">.</span></h1>
    <p>A fast, photo-led QR menu you change in seconds.</p>
    <div class="pills">
      <span class="pill o">$15.99 / month</span>
      <span class="pill r">No commission</span>
      <span class="pill w">No app</span>
    </div>
  </div>
  <div class="phone"><img src="data:image/png;base64,${phone}" alt=""></div>
</body></html>`

const tmpDir = path.join(root, '.shots')
await mkdir(tmpDir, { recursive: true })
const tmp = path.join(tmpDir, 'og.html')
await writeFile(tmp, html)

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
await page.goto(pathToFileURL(tmp).href, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(500)
await page.screenshot({ path: path.join(root, 'public/opengraph.jpg'), type: 'jpeg', quality: 90 })
await browser.close()
console.log('wrote public/opengraph.jpg (1200x630)')
