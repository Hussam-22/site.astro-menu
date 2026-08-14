/**
 * Renders an illustrative printed/PDF restaurant menu and screenshots it.
 *   node scripts/make-print-menu.mjs
 *
 * The restaurant is fictional. This is an illustration of the FORMAT — a text-only
 * A4 page with dot leaders and no photos — not a real business's menu.
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'src/assets')
mkdirSync(OUT, { recursive: true })

const section = (name, items) => `
  <h2>${name}</h2>
  <ul>
    ${items
			.map(
				([dish, price]) =>
					`<li><span class="d">${dish}</span><span class="dots"></span><span class="p">${price}</span></li>`
			)
			.join('')}
  </ul>`

const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @page { size: A4; }
  * { box-sizing: border-box; }
  body {
    margin: 0; width: 794px; height: 1123px; padding: 54px 62px;
    background: #fffdf8; color: #1a1a1a;
    font-family: "Times New Roman", Times, serif;
  }
  .head { text-align:center; border-bottom: 3px double #1a1a1a; padding-bottom: 14px; margin-bottom: 22px; }
  .head h1 { font-size: 30px; letter-spacing: 5px; margin: 0 0 4px; text-transform: uppercase; }
  .head p { font-size: 11px; letter-spacing: 2px; margin: 0; text-transform: uppercase; color:#555; }
  h2 { font-size: 15px; letter-spacing: 3px; text-transform: uppercase; margin: 18px 0 8px; border-bottom:1px solid #bbb; padding-bottom:4px; }
  ul { list-style:none; margin:0; padding:0; }
  li { display:flex; align-items:baseline; font-size: 12.5px; padding: 3px 0; }
  .d { white-space: nowrap; }
  .dots { flex:1; border-bottom: 1px dotted #999; margin: 0 6px; transform: translateY(-3px); }
  .p { white-space: nowrap; font-variant-numeric: tabular-nums; }
  .cols { display:grid; grid-template-columns: 1fr 1fr; gap: 0 42px; }
  .foot { position:absolute; bottom:44px; left:62px; right:62px; text-align:center; font-size:10px; color:#777; border-top:1px solid #ccc; padding-top:10px; }
</style></head><body>
  <div class="head">
    <h1>The Corner Kitchen</h1>
    <p>Established 2016 &nbsp;·&nbsp; Prices in AED</p>
  </div>
  <div class="cols">
    <div>
      ${section('Starters', [
				['Lentil soup', '18'],
				['Hummus with warm bread', '22'],
				['Fattoush salad', '24'],
				['Grilled halloumi', '28'],
				['Stuffed vine leaves', '21'],
				['Spicy chicken wings', '26']
			])}
      ${section('From the grill', [
				['Mixed grill platter', '78'],
				['Lamb chops', '86'],
				['Chicken shish taouk', '52'],
				['Beef kofta', '48'],
				['Grilled sea bass', '74'],
				['Vegetable skewers', '38']
			])}
      ${section('Sides', [
				['Saffron rice', '14'],
				['French fries', '16'],
				['Grilled vegetables', '19'],
				['Garlic bread', '12']
			])}
    </div>
    <div>
      ${section('Main courses', [
				['Chicken machboos', '54'],
				['Lamb ouzi', '69'],
				['Seafood biryani', '62'],
				['Vegetable tagine', '44'],
				['Beef stroganoff', '58'],
				['Pasta arrabbiata', '39']
			])}
      ${section('Desserts', [
				['Umm Ali', '26'],
				['Baklava selection', '24'],
				['Chocolate fondant', '29'],
				['Seasonal fruit plate', '22']
			])}
      ${section('Drinks', [
				['Fresh orange juice', '18'],
				['Mint lemonade', '17'],
				['Arabic coffee', '14'],
				['Karak tea', '9'],
				['Still / sparkling water', '8'],
				['Soft drinks', '10']
			])}
    </div>
  </div>
  <div class="foot">
    Prices subject to change &nbsp;·&nbsp; Please inform your server of any allergies &nbsp;·&nbsp; Menu revised January 2024
  </div>
</body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 2 })
await page.setContent(html, { waitUntil: 'load' })
await page.waitForTimeout(400)
await page.screenshot({ path: join(OUT, 'print-menu.png') })
await browser.close()
console.log('saved src/assets/print-menu.png')
