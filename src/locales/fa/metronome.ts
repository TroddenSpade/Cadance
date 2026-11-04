/**
 * Metronome page strings: header, stage controls, meter and subdivision panels,
 * tap tempo, volume, and the tuner crosslink. English text is the key; see
 * src/lib/i18n.tsx. Italian tempo markings are intentionally left untranslated.
 */
export const faMetronome: Record<string, string> = {
  Breadcrumb: 'مسیر صفحه',
  Today: 'امروز',
  Tools: 'ابزارها',
  Metronome: 'مترونوم',
  'Practice tool': 'ابزار تمرین',
  'A steady clock for lessons, scales, and repertoire. It keeps running while you move around the app, so you can start it here and shrink it into the floating dock.':
    'ساعتی یکنواخت برای درس‌ها، گام‌ها و رپرتوار. هنگام جابه‌جایی در برنامه هم به کارش ادامه می‌دهد؛ پس می‌توانی همین‌جا روشنش کنی و به داک شناور کوچکش کنی.',
  'Tempo marking': 'نشانهٔ تمپو',
  BPM: 'BPM',

  'Slower by one': 'یک واحد کندتر',
  Stop: 'توقف',
  Start: 'شروع',
  'Faster by one': 'یک واحد تندتر',
  'Tempo in beats per minute': 'تمپو بر حسب ضرب در دقیقه',
  'The brass weight follows the tempo up and down the scale. Tap':
    'وزنهٔ برنجی همراه با تمپو روی درجه‌ها بالا و پایین می‌رود. برای تعیین ضرب با حس، کلید',
  'or use Tap tempo to set the pulse by feel.': 'را بزنید یا از «تپ تمپو» استفاده کنید.',
  'starts and stops;': 'شروع و توقف می‌کند؛',
  'nudge the tempo.': 'تمپو را جزئی تغییر می‌دهند.',

  Meter: 'میزان',
  compound: 'مرکب',
  odd: 'فرد',
  simple: 'ساده',
  'In 6/8 the pulse is the eighth note and beats 1 and 4 are accented. Odd meters stay grouped in the same regular pulse.':
    'در 6/8 ضرب، چنگ است و ضرب‌های 1 و 4 تأکید می‌گیرند. میزان‌های فرد هم در همان ضرب منظم گروه‌بندی می‌شوند.',

  Subdivision: 'تقسیم‌بندی',
  'Clicks between beats': 'کلیک بین ضرب‌ها',
  'Quarter notes': 'نت‌های سیاه',
  'Eighth notes': 'نت‌های چنگ',
  Triplets: 'تریوله',
  'Accent the first beat': 'تأکید ضرب اول',
  'A higher click marks the downbeat of every bar.': 'کلیک بلندتر، ضرب اول هر میزان را مشخص می‌کند.',

  Feel: 'حس',
  'Tap tempo': 'تپ تمپو',
  'Tap four or more times in a row. The average of your taps sets the tempo.':
    'چهار بار یا بیشتر پشت سر هم بزن. میانگین تپ‌هایت تمپو را تعیین می‌کند.',

  Volume: 'بلندی صدا',
  '{n}%': '{n}٪',
  'Metronome volume': 'بلندی صدای مترونوم',
  'The metronome follows the app-wide sound switch in Settings. This slider balances it against lessons and examples.':
    'مترونوم از کلید سراسری صدا در تنظیمات پیروی می‌کند. این لغزنده آن را نسبت به درس‌ها و نمونه‌ها متعادل می‌کند.',

  'Need a reference pitch?': 'به یک صدای مرجع نیاز داری؟',
  'Open the tuner to check intonation before you practise.': 'برای بررسی کوک پیش از تمرین، کوک‌کن را باز کن.',
  'Open the tuner': 'باز کردن کوک‌کن',
};
