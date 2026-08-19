# Image slots — Gemini "Nano Banana" prompts

Sixteen empty slots. Each prompt below is complete and standalone: copy one,
paste it, generate, save the file here under the slot name. Nothing in the code
changes — `FoodImage.astro` resolves each slot by filename stem, so saving
`owner.webp` fills the `owner` slot. Until a file exists the site renders a
captioned placeholder, so it is never broken mid-shoot.

## Using Nano Banana

Nano Banana is Gemini 2.5 Flash Image, in the [Gemini app](https://gemini.google.com)
or [AI Studio](https://aistudio.google.com). Two things about it shape how these
prompts are written:

**It wants prose, not tags.** Midjourney-style keyword soup with `--ar 16:9
--style raw` flags does nothing here — the flags land as literal text in the
prompt and the keywords give it less to work with than a sentence does. Every
prompt below is a described scene.

**It edits conversationally.** Do not re-roll from scratch when something is
close. Reply to the image: "warmer light", "lose the sign on the back wall",
"same shot but she is looking away from camera". That is where it beats other
models, so spend your effort there.

**Aspect ratio.** Set it in AI Studio, or add "Generate this as a 16:9 image" to
the prompt in the app. Each slot's target is listed. Exact is nice but not
critical — the CSS crops to fill, so keep the subject centred and it will
survive a mismatch.

**Consistency.** The three pillar shots sit in one row and must feel like one
shoot. Generate `owner` first, then start the next two with: *"Same photographic
style, lighting and colour grade as the previous image."*

**Save as WebP or JPG. Never PNG** — a photo saved as PNG is roughly ten times
the bytes for no visible gain. Generate large; the build resizes and re-encodes.

---

## Hero

### `hero-cut` — 1:1

This one is cropped into a circle inside a giant headline, at roughly 120px. It
must read instantly at thumbnail size, so it needs one clear subject, strong
colour, and nothing important near the edges.

> A tight overhead photograph of a single flat white coffee in a white ceramic
> cup, filling almost the entire square frame, shot from directly above. The
> latte art rosetta is crisp and centred. Warm natural daylight from the left
> throws a soft shadow to the right. The cup sits on a warm cream surface. Rich
> contrast, appetising, editorial food photography. The cup is centred with a
> little breathing room on all four sides. No text, no logos, no watermarks, no
> hands, no cutlery.

If the coffee feels too quiet next to the headline, try the same prompt with
*shakshuka in a small copper pan* — more colour, same composition.

### `hero-float` — 4:3

Sits tilted at the corner of the phone mockup, so it wants a flat background it
can be cut against rather than a busy scene.

> A pair of hands holding a tall loaded cheeseburger up towards the camera, just
> before the first bite, photographed against a completely flat solid orange
> background the colour of #FF8904. Studio product lighting, crisp edges, sharp
> focus on the burger. Sesame bun, melted cheese, fresh lettuce and tomato
> visible. The mood is playful and appetising, slightly energetic, as if caught
> mid-motion. Natural relaxed hands with correct anatomy. No text, no logos, no
> watermarks, no background detail of any kind.

---

## The three pillars — "everybody at the table wins"

These carry the emotional argument of the whole page: the owner stops
reprinting, the staff stop apologising, the guest stops squinting. Each is a
different person and each is genuinely happy. Generate `owner` first and ask for
the other two in the same style.

### `owner` — 16:9

> A candid photograph of a café owner in her thirties standing behind a counter
> in her own coffee shop, holding a phone in one hand and laughing at something
> just off camera. Behind her, a chrome espresso machine and a glass case of
> pastries, softly out of focus. Warm morning light comes through a large window
> to her left. She looks relaxed and in control of her own business, not posing
> for a photographer. Shot on a 50mm lens at a wide aperture, shallow depth of
> field, warm natural colour grade, documentary style. No text, no logos, no
> watermarks, no visible brand names.

### `staff` — 16:9

> Same photographic style, lighting and colour grade as the previous image. A
> candid photograph of a barista mid-service, one hand on the steam wand of an
> espresso machine, laughing with a colleague who is out of frame. There is a
> sense of movement and warmth — a good shift, not a stressful one. Café
> interior softly blurred behind him. Warm daylight, shallow depth of field,
> documentary style. No text, no logos, no watermarks, no visible brand names.

### `guests` — 16:9

> Same photographic style, lighting and colour grade as the previous image. Two
> friends sitting at a café table, one holding up a phone to scan a small QR
> code on a wooden table tent, both smiling at what has just appeared on the
> screen. Coffee cups and a shared plate of food on the table between them.
> Natural window light from the side. Candid and unposed, mid-conversation.
> Shallow depth of field, warm colour grade. No text on the table tent, no
> readable text anywhere, no logos, no watermarks.

---

## Use cases — 5:4 each

Six tiles in a grid. They should feel like one set, so keep the same warm
daylight treatment across all six.

### `uc-cafe`

> A busy speciality café at mid-morning, photographed low across a wooden table.
> A small QR code table tent stands sharp in the foreground on the left, while
> the room behind — customers, counter, warm interior — falls away into soft
> focus. Warm natural daylight, shallow depth of field, documentary style. No
> readable text on the table tent, no logos, no watermarks.

### `uc-truck`

> A coffee truck serving hatch photographed in golden evening light, the owner
> leaning out to hand a takeaway cup to a customer. A small QR code sticker is
> visible on the counter edge of the hatch. Warm string lights above, dusk sky
> behind. Candid, friendly, documentary style, shallow depth of field. No
> readable text, no logos, no watermarks, no brand names on the truck.

### `uc-hotel`

> A hotel room breakfast card resting on crisp white bedding beside a
> smartphone, photographed in soft morning light from a balcony door. The room
> is upscale, calm and uncluttered — pale linen, a corner of a wooden
> nightstand. Shot from slightly above at an angle. Quiet, premium, restrained
> colour. No readable text on the card or the phone, no logos, no watermarks.

### `uc-bakery`

> A bakery counter loaded with golden croissants and pastries in trays,
> photographed from just above counter height. A hand reaches into the frame
> from the right holding a phone. Warm interior lighting, golden crusts, rich
> texture and shallow depth of field. Appetising and abundant. No readable text
> on the phone, no logos, no watermarks, no price labels.

### `uc-clinic`

> A bright modern staff canteen counter with a tray of clearly labelled healthy
> dishes — grain bowls, salads, fruit. Clean pale surfaces, cool even daylight
> from large windows. Calmer and more clinical than a café: orderly, hygienic,
> uncluttered. Shot straight on at counter height, moderate depth of field. No
> readable text on the labels, no logos, no watermarks.

### `uc-lounge`

> A low evening lounge table surrounded by cushions, spread with small mezze
> plates, with a smartphone glowing softly on the table. Moody warm lighting
> from lamps overhead, deep shadows, relaxed late-night atmosphere. Shot from
> above at an angle. Rich warm colour, shallow depth of field. No readable text
> on the phone, no logos, no watermarks.

---

## Testimonial avatars — 1:1

**Read this before generating these three.**

Saeed, Mayed and Ahmed are real named customers who gave you real testimonials.
An AI-generated face presented as a real person's photograph is a
misrepresentation, and it is the kind of thing that costs a lot of trust if
anyone notices. Ask the three of them for a real photo, or leave these slots
empty — the layout is fine without them and the placeholder reads as a neutral
avatar rather than a fabricated person.

If you do generate them, use them as generic illustrative avatars and do not
attach real names to invented faces.

The prompts, should you have permission and want a consistent crop: these are
cropped to a circle at 56px, so the face must be large in frame and centred.

> A natural head-and-shoulders portrait of a man in his thirties, photographed
> in a speciality coffee shop with the interior blurred warmly behind him. Warm
> approachable expression, natural window light from the side. The face fills
> most of the frame and is centred, with a little space above the head. Shot on
> an 85mm lens at a wide aperture, documentary portrait style. No text, no
> logos, no watermarks.

Vary the second and third by setting and age: *beside a coffee truck in
daylight, late twenties, friendly and casual*; *in a bright modern café, forties,
calm and confident*.

---

## Supporting

### `faq-flatlay` — 4:3

> A neat overhead flat-lay on a warm cream table: a flat white coffee in a white
> cup, a croissant on a small plate, and a smartphone lying beside them. Soft
> daylight from one side casting gentle shadows. Generous empty space around the
> objects, calm and uncluttered, styled but not fussy. Shot straight down. No
> readable text on the phone screen, no logos, no watermarks.

### `onboarding` — 4:3

This one has a job: it shows "just send us whatever you have" in a single frame.

> A restaurant owner standing at a counter photographing his own printed paper
> menu with a smartphone, holding the phone above the menu to capture it. The
> printed menu is a plain folded card on the counter. Warm daylight from a
> window, café interior soft behind him. Candid and practical, documentary
> style, shallow depth of field. No readable text on the menu or the phone, no
> logos, no watermarks.

### `contact` — 4:5 (portrait)

> A portrait-orientation photograph of a café owner sitting at a table with an
> open laptop and a cup of coffee, mid-afternoon light falling across the table
> from a window. She looks unhurried and content, glancing down at the screen.
> The café is warm and quiet behind her, softly out of focus. Vertical
> composition with room above her head. Natural colour grade, shallow depth of
> field. No readable text on the laptop screen, no logos, no watermarks.

---

## After generating

1. Save as `<slot>.webp` (or `.jpg`) in this folder — `owner.webp`, `uc-cafe.webp`, and so on.
2. `npm run build` — Astro resizes and re-encodes automatically.
3. With the dev server running, `node scripts/qa.mjs` to confirm nothing broke.

Fill them in any order. Every slot you skip keeps its placeholder.
