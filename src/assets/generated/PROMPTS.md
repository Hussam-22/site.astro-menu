# Image slots and generation prompts

Drop finished images in **this folder**. `FoodImage.astro` picks them up by
filename stem — save `owner.webp` and the `owner` slot fills itself. No code
changes, no imports to add. Until a file exists the site renders a captioned
placeholder, so nothing ever looks broken.

**Format:** WebP or JPG. **Never PNG** for photographs — a photo saved as PNG is
roughly ten times the bytes for no visible gain. Astro re-encodes and resizes on
build, so upload generously sized originals and let the build shrink them.

---

## House style — paste this in front of every prompt

> Editorial food-and-people photography for a hospitality brand. Warm natural
> daylight, shallow depth of field, candid documentary feel — real working
> venues, not a studio. Warm cream and off-white surfaces (#FDF6EC). Accents of
> warm orange (#FF8904) and coral pink (#FF637E) appear naturally in props,
> clothing or packaging — never as a filter over the whole frame. Middle
> Eastern and international mix of people, Gulf café culture, Dubai and Al Ain.
> Genuine unposed expressions; nobody grinning at the lens like stock
> photography. No text, no logos, no watermarks, no visible brand names, no
> distorted hands, no extra fingers.

Then add the per-slot prompt below.

---

## Slot list

Aspect ratios are what the layout expects. Generating at a different ratio is
fine — the CSS crops to fill — but you lose control of what gets cut.

### Hero

| Slot | Ratio | Prompt |
| --- | --- | --- |
| `hero-cut` | 1:1 | Extreme close-up of one beautiful dish from directly above, filling the whole square — a flat white with latte art, or shakshuka in a copper pan. It is cropped into a circle inside a giant headline, so keep the subject dead centre and leave no important detail near the edges. Rich colour, high contrast against a plain background. |
| `hero-float` | 4:3 | Two hands holding a loaded burger just before the first bite, cut out cleanly and floating on a flat warm-orange background. Playful and appetising, slightly tilted energy. Product-shot lighting, crisp edges. |

### The three pillars — "everybody at the table wins"

These carry the emotional argument. Each is a different person, genuinely happy.

| Slot | Ratio | Prompt |
| --- | --- | --- |
| `owner` | 16:10 | A café owner in their thirties standing behind the counter, holding a phone, laughing at something off-camera. Espresso machine and pastry case behind them, warm morning light through a window. Relaxed and in control, not performing for the camera. |
| `staff` | 16:10 | A barista mid-service, steam wand in one hand, laughing with a colleague out of frame. Motion and warmth, a genuinely good shift rather than a stressful one. Shallow depth of field, café interior softly blurred behind. |
| `guests` | 16:10 | Two friends at a café table, one holding a phone up to scan a small QR code on a table tent, both smiling at what has just appeared on screen. Coffee and a shared plate on the table. Natural window light. |

### Use cases

| Slot | Ratio | Prompt |
| --- | --- | --- |
| `uc-cafe` | 5:4 | Busy speciality café floor at mid-morning, shot low across a table with a small QR table tent sharp in the foreground and the room warm and out of focus behind. |
| `uc-truck` | 5:4 | A coffee truck serving hatch in evening light, owner leaning out to hand over a cup, a QR sticker on the counter edge. String lights, dusk sky. |
| `uc-hotel` | 5:4 | A hotel room breakfast card resting on crisp white bedding beside a phone showing a menu, morning light from a balcony door. Calm, upscale, uncluttered. |
| `uc-bakery` | 5:4 | A bakery counter loaded with croissants and pastries, a hand reaching into frame holding a phone. Golden crusts, warm interior light. |
| `uc-clinic` | 5:4 | A bright modern staff canteen counter with a tray of clearly labelled healthy dishes, clean surfaces, cool daylight — calmer and more clinical than the café shots. |
| `uc-lounge` | 5:4 | A low evening lounge table with cushions and mezze plates, a phone glowing with a menu. Moody warm lighting, relaxed late-night mood. |

### Testimonial avatars

Square portraits, cropped to a circle at 56px, so faces must be large in frame.

| Slot | Ratio | Prompt |
| --- | --- | --- |
| `avatar-saeed` | 1:1 | Head-and-shoulders portrait of a man in his thirties, speciality coffee shop blurred behind, warm and approachable, natural light. |
| `avatar-mayed` | 1:1 | Head-and-shoulders portrait of a man in his late twenties beside a coffee truck, daylight, friendly and casual. |
| `avatar-ahmed` | 1:1 | Head-and-shoulders portrait of a man in his forties in a bright modern café, calm and confident. |

> **A note worth taking seriously.** These three are real named customers who
> gave you real testimonials. An AI-generated face presented as a real person's
> photograph is a misrepresentation, and it is the kind of thing that damages
> trust badly if noticed. Ask Saeed, Mayed and Ahmed for a real photo, or leave
> these three slots empty — the layout is fine without them, and the placeholder
> reads as a neutral avatar rather than a fake person.

### Supporting

| Slot | Ratio | Prompt |
| --- | --- | --- |
| `faq-flatlay` | 4:3 | Overhead flat-lay on a warm cream table: a flat white, a croissant on a small plate, and a phone showing a food menu. Neat, generous negative space, soft daylight from one side. |
| `onboarding` | 4:3 | A restaurant owner photographing their printed paper menu with a phone, standing at a counter. Shows the "just send us what you have" idea in one frame. |
| `contact` | 4:5 | A café owner sitting at a table with a laptop and a coffee, mid-afternoon light, unhurried and content. Portrait orientation. |

---

## After generating

1. Save as `<slot>.webp` in this folder.
2. `npm run build` — Astro resizes and re-encodes automatically.
3. Run `node scripts/qa.mjs` with the dev server up to confirm nothing broke.

Slots you do not fill keep their placeholder. Filling them in any order is fine.
