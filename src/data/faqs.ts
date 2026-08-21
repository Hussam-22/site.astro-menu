import { PRICE, SITE } from '../config/site'

export type Faq = { q: string; a: string; qAr: string; aAr: string }
export type FaqGroup = { heading: string; items: Faq[]; headingAr: string }

/**
 * Grouped for /faq, and a subset is pulled onto the home page. Everything here
 * is emitted as FAQPage JSON-LD, so answers are written to stand alone — a
 * search result or an AI answer will quote one without the question around it.
 */
export const FAQ_GROUPS: FaqGroup[] = [
	{
		heading: 'Getting started',
		headingAr: 'الخطوات الأولى',
		items: [
			{
				q: 'How long does it take to set up a QR menu?',
				a: `Building the first menu is real work, and we do it for you. Send us your existing PDF, photos or printed card and we type it in by hand — every section, item, description and price — then hand it back for you to check and correct. How long that takes depends on the size of your menu and how quickly we can settle the details with you. Once it is live you are in control, and every change you make after that appears instantly. There is a ${PRICE.trialDays}-day free trial and no card is needed to start.`,
				qAr: 'كم يستغرق إعداد منيو الـQR؟',
				aAr: `إعداد المنيو الأول شغلة حقيقية، ونحن يلي منسويها لأجلك. ابعتلنا ملف الـPDF الحالي، أو الصور، أو الكرت المطبوع، ومنكتب كل شي يدويًا — كل قسم وصنف ووصف وسعر — وبعدين نرجعها لك تراجعها وتصحّح فيها. المدة بتعتمد على حجم منيوك وقد إيش منقدر نتفق على التفاصيل معك بسرعة. لما تصير مباشرة، الدفة بتصير بإيدك، وأي تعديل بتعمله بعدها بيظهر فورًا. في فترة تجربة مجانية مدتها ${PRICE.trialDays} يوم، وما بتحتاج بطاقة عشان تبلّش فيها.`
			},
			{
				q: 'Do I need to be technical to use it?',
				a: 'No. Everything is a form field in a dashboard — item name, price, description, photo. If you can post to Instagram you can run an Astro-Menu menu. There is nothing to install and nothing to host.',
				qAr: 'هل أحتاج خبرة تقنية لاستخدامه؟',
				aAr: 'لا. كل شي عبارة عن حقل بتعبّيه في لوحة التحكم — اسم الصنف، السعر، الوصف، الصورة. إذا بتعرف تنشر على إنستغرام، بتقدر تشغّل منيو Astro-Menu. ما في شي تثبّته وما في شي تستضيفه.'
			},
			{
				q: 'What do you need from me to build the first menu?',
				a: 'Your current menu in any form — a PDF, a photo of the printed card, or a spreadsheet — plus your logo and a cover photo of the venue. Dish photos are optional at the start and can be added item by item afterwards. Expect a little back and forth while we check prices and spellings with you — that is normal, and it is how the menu ends up right.',
				qAr: 'شو بتحتاجوا مني لإعداد المنيو الأول؟',
				aAr: 'منيوك الحالي بأي شكل — ملف PDF، صورة للكرت المطبوع، أو حتى جدول بيانات — بالإضافة لشعارك وصورة غلاف للمكان. صور الأطباق اختيارية في البداية وبتقدر تضيفها صنف صنف بعدين. توقّع شوية تواصل ذهابًا وإيابًا لنتأكد من الأسعار والتهجئة معك — هذا طبيعي، وهو يلي بيخلي المنيو يطلع مضبوط في النهاية.'
			},
			{
				q: 'Can I try it before paying?',
				a: `Yes. Every account starts with a ${PRICE.trialDays}-day free trial and no card is required. You can build the whole menu, print the code and put it on tables during the trial.`,
				qAr: 'هل بقدر أجربه قبل ما أدفع؟',
				aAr: `أكيد. كل حساب بيبدأ بفترة تجربة مجانية مدتها ${PRICE.trialDays} يوم، ومن دون ما تحتاج بطاقة. بتقدر تجهّز المنيو كامل، تطبع الرمز، وتحطه على الطاولات خلال فترة التجربة.`
			}
		]
	},
	{
		heading: 'Pricing',
		headingAr: 'الأسعار',
		items: [
			{
				q: 'How much does Astro-Menu cost?',
				a: `Astro-Menu is ${PRICE.monthly} per month, or ${PRICE.annualPerMonth} per month when you pay ${PRICE.annualTotal} for the year — a saving of ${PRICE.annualSaving}, about ${PRICE.annualSavingPercent}%. That is one price for everything: unlimited menus, unlimited items, unlimited views, every language and all updates. In dirhams it is ${PRICE.monthlyAed} a month or ${PRICE.annualTotalAed} a year.`,
				qAr: 'كم سعر اشتراك Astro-Menu؟',
				aAr: `سعر Astro-Menu ${PRICE.monthly} بالشهر، أو ${PRICE.annualPerMonth} بالشهر إذا دفعت ${PRICE.annualTotal} سنويًا — يعني توفير ${PRICE.annualSaving}، أي حوالي ${PRICE.annualSavingPercent}٪. وهذا السعر يشمل كل شيء: قوائم غير محدودة، أصناف غير محدودة، مشاهدات غير محدودة، كل اللغات وكل التحديثات. بالدرهم، السعر ${PRICE.monthlyAed} بالشهر أو ${PRICE.annualTotalAed} بالسنة.`
			},
			{
				q: 'Do you take a commission on orders?',
				a: 'No, and we could not — Astro-Menu does not process orders or payments at all. It is a menu. Your staff take orders the way they always have, and every dirham your customer spends goes straight to you.',
				qAr: 'هل تاخدوا عمولة على الطلبات؟',
				aAr: 'لا، وما بنقدر أصلًا — Astro-Menu ما بتعالج ولا طلب ولا دفعة على الإطلاق. هي منيو، بس. طاقمك بياخد الطلبات متل ما اعتاد دايمًا، وكل درهم بيصرفه زبونك بيوصلك مباشرة.'
			},
			{
				q: 'Are there setup fees, hardware costs or contracts?',
				a: 'None. There is no setup fee, nothing to buy and no minimum term. A printed QR code is the only hardware involved, and you can cancel from the dashboard whenever you like.',
				qAr: 'في رسوم إعداد، أو تكاليف أجهزة، أو عقود؟',
				aAr: 'ولا شيء من ذلك. ما في رسوم إعداد، ولا شيء لازم تشتريه، ولا مدة تعاقد إلزامية. رمز الـQR المطبوع هو الجهاز الوحيد المطلوب، وبتقدر تلغي اشتراكك من لوحة التحكم أي وقت بدك.'
			},
			{
				q: 'Is there a limit on scans or menu views?',
				a: 'No. Menu views are unlimited, whether you get fifty scans a month or fifty thousand.',
				qAr: 'في حد لعدد المسحات أو مشاهدات المنيو؟',
				aAr: 'لا. مشاهدات المنيو غير محدودة، سواء عندك خمسين مسحة بالشهر أو خمسين ألف.'
			},
			{
				q: 'What happens if I cancel?',
				a: 'Your menu stops being served and the QR code stops resolving. Nothing else happens — there is no exit fee and no notice period. Come back later and your menu is still there.',
				qAr: 'شو بيصير إذا ألغيت اشتراكي؟',
				aAr: 'منيوك بيتوقف عن الظهور ورمز الـQR بيتوقف عن الفتح. هذا كل شيء — ما في رسوم إنهاء ولا فترة إشعار. ارجع بأي وقت وبتلاقي منيوك لسا موجود.'
			}
		]
	},
	{
		heading: 'How the menu works',
		headingAr: 'كيف يشتغل المنيو',
		items: [
			{
				q: 'Do my customers need to download an app?',
				a: 'No. The menu opens in whatever browser is already on the phone. Point the camera at the code and it opens — no download, no account, no sign-in.',
				qAr: 'هل زبائني لازم يحمّلوا تطبيق؟',
				aAr: 'لا. المنيو بيفتح بأي متصفح موجود أصلًا على الموبايل. وجّه الكاميرا على الرمز وبيفتح فورًا — بلا تحميل، بلا حساب، بلا تسجيل دخول.'
			},
			{
				q: 'Will I have to reprint the QR code when the menu changes?',
				a: 'No, and this is the single most important thing to get right. The code points at your menu, not at a file. Change prices, add dishes, rebuild the whole menu — the printed code on the table keeps working. Codes that encode a PDF have to be reprinted every time, which is what forces most venues to start over.',
				qAr: 'هل لازم أعيد طباعة رمز الـQR كل ما تتغير المنيو؟',
				aAr: 'لا، وهاي أهم نقطة لازم تفهمها منّا. الـQR بيفتح منيو مطعمك مباشرة، مو ملف PDF. غيّر الأسعار، ضيف أطباق جديدة، أعد بناء المنيو كامل — الرمز المطبوع على الطاولة بيضل شغّال متل ما هو. أما الرموز يلي بتشفّر ملف PDF فلازم تنعاد طباعتها كل مرة، وهاد يلي بيضطر معظم المطاعم يبلّشوا من الصفر.'
			},
			{
				q: 'Can I show the menu in Arabic?',
				a: 'Yes. Add Arabic in the dashboard and the whole menu is translated and laid out right-to-left. Guests switch language from the header. Any language works the same way, and you can override an individual translation if a dish name comes back wrong.',
				qAr: 'هل بقدر أعرض المنيو بالعربي؟',
				aAr: 'أكيد. ضيف اللغة العربية من لوحة التحكم وتُترجم القائمة كلها وتُعرض من اليمين إلى اليسار. ويختار الزبون لغته من أعلى المنيو. أي لغة تانية بتشتغل بنفس الطريقة، وبتقدر تعدّل أي ترجمة يدويًا إذا طلع اسم طبق غلط.'
			},
			{
				q: 'Can I hide a dish that has sold out?',
				a: 'Yes — one toggle. The item disappears from the live menu immediately and comes back whenever you switch it on again, so nobody orders something you cannot serve.',
				qAr: 'هل بقدر أخفي طبق خلص من عندي؟',
				aAr: 'أكيد، بزر واحد بس. الصنف بيختفي من المنيو المباشر فورًا، وبيرجع يظهر لما تفعّله من جديد، وهيك ما حدا بيطلب شي ما بتقدر تقدّمه.'
			},
			{
				q: 'Can I show calories, macros and allergens?',
				a: 'Yes. Calories, carbs, fat and protein can be shown per item, and dietary and allergen tags attach to the item so they travel with it. Both are optional — switch them off for the whole menu if you would rather not display them.',
				qAr: 'هل بقدر أعرض السعرات الحرارية والعناصر الغذائية ومسببات الحساسية؟',
				aAr: 'أكيد. بتقدر تعرض السعرات الحرارية والكربوهيدرات والدهون والبروتين لكل صنف، وعلامات النظام الغذائي والحساسية بتترافق مع الصنف أينما ظهر. الاثنين اختياريين — بتقدر توقفهم للمنيو كامل إذا ما بدك تعرضهم.'
			},
			{
				q: 'Can guests filter a long menu?',
				a: 'Yes. Guests filter by meal type — hot, cold, decaf, healthy, light portion, sweet — and jump between sections from chips pinned at the top of the screen. On a 120-item menu that is the difference between finding a drink in seconds and giving up.',
				qAr: 'هل يقدر الزبون يصفّي منيو طويل؟',
				aAr: 'أكيد. الزبون بيصفّي حسب نوع الوجبة — ساخن، بارد، بلا كافيين، صحي، حصة خفيفة، حلو — وبيتنقل بين الأقسام من أزرار مثبتة أعلى الشاشة. بمنيو فيه 120 صنف، هاد هو الفرق بين إيجاد مشروب خلال ثوانٍ وبين الاستسلام.'
			},
			{
				q: 'Does it work without an internet connection?',
				a: 'The guest needs a connection to load the menu the first time, the same as opening any web page. Most venues put their Wi-Fi password on the menu page itself for exactly this reason.',
				qAr: 'هل يشتغل من دون اتصال بالإنترنت؟',
				aAr: 'الزبون محتاج اتصال ليحمّل المنيو أول مرة، تمامًا متل أي صفحة ويب عادية. لهيك بالضبط، معظم المطاعم بتحط كلمة سر الواي فاي على صفحة المنيو نفسها.'
			}
		]
	},
	{
		heading: 'Sharing and search',
		headingAr: 'المشاركة والبحث',
		items: [
			{
				q: 'Can I use the menu outside the restaurant?',
				a: 'Yes, and most of the value is there. Every menu has a plain link as well as a QR code, so the same menu opens from your Google Business profile, Google Maps, your Instagram bio, a WhatsApp reply or a printed flyer. People decide where to eat before they leave the house.',
				qAr: 'هل بقدر أستخدم المنيو برا المطعم؟',
				aAr: 'أكيد، وهون بتكون معظم قيمته. كل منيو إلو رابط بسيط لجانب رمز الـQR، وهيك نفس المنيو بيفتح من صفحة نشاطك التجاري على جوجل، أو خرائط جوجل، أو بايو الإنستغرام، أو رد على واتساب، أو حتى منشور مطبوع. الناس بتقرر وين رح تاكل قبل ما تطلع من البيت.'
			},
			{
				q: 'Will my menu show up on Google?',
				a: 'A hosted menu page can be crawled and indexed, which a PDF or a photograph of a menu effectively cannot. Adding your menu link to your Google Business profile is the highest-return thing you can do with it.',
				qAr: 'هل رح تظهر قائمتي في نتائج جوجل؟',
				aAr: 'صفحة منيو مستضافة بيقدر جوجل يزحف إليها ويفهرسها، بعكس ملف PDF أو صورة قائمة طعام ما بينفهرسوا فعليًا. إضافة رابط منيوك لصفحة نشاطك التجاري على جوجل هو أفضل استثمار بتقدر تعمله فيه.'
			},
			{
				q: 'Can I use it across several branches?',
				a: `Each branch gets its own menu, its own QR code and its own venue page, so prices and availability can differ between them. Email ${SITE.email} for a multi-branch setup.`,
				qAr: 'هل بقدر أستخدمه لعدة فروع؟',
				aAr: `كل فرع بياخد منيو خاص فيه، ورمز QR خاص فيه، وصفحة خاصة فيه، وهيك ممكن تختلف الأسعار والتوفر بين فرع وفرع. راسلنا على ${SITE.email} لنجهزلك نظام متعدد الفروع.`
			}
		]
	},
	{
		heading: 'What Astro-Menu is not',
		headingAr: 'أشياء ما بتقدمها Astro-Menu',
		items: [
			{
				q: 'Is there a POS or till system?',
				a: 'No. Astro-Menu is a digital menu and nothing else. Keep whatever till you already use — we do not replace it, integrate with it, or sit between you and your customer.',
				qAr: 'هل في نظام نقاط بيع أو صندوق كاشير؟',
				aAr: 'لا. Astro-Menu منيو رقمي، بس هيك، ولا شيء غيره. خلّي أي كاشير عندك زي ما هو — نحن ما منستبدله، ولا منتكامل معه، ولا منوقف بينك وبين زبونك.'
			},
			{
				q: 'Can customers order and pay from the menu?',
				a: 'No. There is no cart, no ordering and no payment. That is deliberate: it keeps the product simple, keeps the price at one flat fee, and means we never take a commission.',
				qAr: 'هل يقدر الزبون يطلب ويدفع من المنيو؟',
				aAr: 'لا. ما في سلة شراء، ولا استقبال طلبات، ولا دفع. هاد مقصود: بيخلي المنتج بسيط، وبيخلي السعر رسمًا واحدًا ثابتًا، وبيعني إنه ما رح ناخد عمولة أبدًا.'
			},
			{
				q: 'Do you supply tablets, printers or stands?',
				a: 'No hardware at all. You print the QR code on whatever you already use — a table tent, a sticker, a window decal, the back of a business card.',
				qAr: 'هل بتوفروا أجهزة لوحية أو طابعات أو حوامل؟',
				aAr: 'ولا جهاز واحد. بتطبع رمز الـQR على أي وسيلة عندك أصلًا — بطاقة طاولة، ملصق، ملصق على الشباك، أو ظهر بطاقة عملك.'
			}
		]
	}
]

export const ALL_FAQS: Faq[] = FAQ_GROUPS.flatMap((g) => g.items)

/** The subset shown on the home page — the questions that actually block a sale. */
const HOME_FAQ_QUESTIONS = [
	'How much does Astro-Menu cost?',
	'Will I have to reprint the QR code when the menu changes?',
	'Do my customers need to download an app?',
	'Do you take a commission on orders?',
	'Can I show the menu in Arabic?',
	'How long does it take to set up a QR menu?'
]

export const HOME_FAQS: Faq[] = HOME_FAQ_QUESTIONS.map((q) => {
	const found = ALL_FAQS.find((f) => f.q === q)
	// Fails the build rather than silently dropping a question if one is renamed.
	if (!found) throw new Error(`HOME_FAQ_QUESTIONS names a question missing from FAQ_GROUPS: ${q}`)
	return found
})
