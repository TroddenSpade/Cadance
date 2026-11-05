/**
 * Assignments & worksheets: the builder, the printable sheet, the timed task
 * catalogue, and the five focuses. English display text is the key.
 */
export const faWorksheets: Record<string, string> = {
  // ── Page chrome ──────────────────────────────────────────────────
  'Assignments & worksheets': 'تکالیف و برگه‌های تمرین',
  'Plan the week': 'هفته را برنامه‌ریزی کن',
  'Build a timed practice sheet from the rooms in Cadence. Choose a focus and a length, print it, and tick off each task as you go.':
    'از اتاق‌های کادنس یک برگهٔ تمرین زمان‌دار بسازید. تمرکز و طول را انتخاب کنید، چاپش کنید و هر کار را هنگام انجام تیک بزنید.',
  Printable: 'قابل چاپ',
  'Minutes in this sheet': 'دقیقه در این برگه',
  'Worksheet builder': 'سازندهٔ برگهٔ تمرین',
  'Choose a focus': 'یک تمرکز انتخاب کنید',
  'Five ways to practise': 'پنج روش تمرین',
  Time: 'زمان',
  Minutes: 'دقیقه',
  Include: 'شامل',
  'Student or ensemble (optional)': 'دانش‌آموز یا گروه (اختیاری)',
  'Name on the sheet': 'نام روی برگه',
  'Print worksheet': 'چاپ برگهٔ تمرین',
  Reset: 'بازنشانی',
  Preview: 'پیش‌نمایش',
  'Your sheet': 'برگهٔ شما',
  '{n} tasks · {minutes} minutes': '{n} کار · {minutes} دقیقه',
  '{n} min': '{n} دقیقه',
  '{n} minutes': '{n} دقیقه',
  'No activities selected. Choose at least one to build a sheet.':
    'هیچ فعالیتی انتخاب نشده است. برای ساختن برگه دست‌کم یکی را انتخاب کنید.',
  'Cadence practice sheet': 'برگهٔ تمرین کادنس',
  Total: 'مجموع',
  Date: 'تاریخ',
  Student: 'دانش‌آموز',
  'Piano or guitar': 'پیانو یا گیتار',
  'Open in Cadence': 'باز کردن در کادنس',
  Notes: 'یادداشت‌ها',
  'Read, hear, play. One task at a time.': 'بخوان، بشنو، بنواز. هر بار یک کار.',
  'How to use a sheet': 'چگونه از برگه استفاده کنیم',
  'Short enough to finish': 'به‌قدر کافی کوتاه تا تمام شود',
  'Fifteen minutes is a full session for a beginner; forty-five is a focused block for an intermediate player. Keep the sheet visible, tick each box, and stop when the time is up rather than when everything feels perfect.':
    'پانزده دقیقه برای یک مبتدی یک جلسهٔ کامل است؛ چهل‌وپنج دقیقه برای نوازندهٔ متوسط یک بلوک متمرکز. برگه را پیش چشم نگه دارید، هر خانه را تیک بزنید و وقتی زمان تمام شد دست بکشید، نه وقتی همه‌چیز بی‌نقص حس می‌شود.',

  // ── Activities ───────────────────────────────────────────────────
  'Warm-up': 'گرم‌کردن',
  'Set a comfortable metronome pulse and play a slow scale or open chords.':
    'نبضی راحت روی مترونوم بگذارید و گامی آهسته یا آکوردهای باز بنوازید.',
  'Read one four-bar example, play it in order, then check every pitch.':
    'یک نمونهٔ چهار‌میزانی بخوانید، به ترتیب بنوازید، سپس هر نُت را بررسی کنید.',
  'Rhythm echo': 'تکرار ریتم',
  'Listen to two bars, tap them back, then play the rhythm on one note.':
    'به دو میزان گوش دهید، با ضربه تکرار کنید، سپس ریتم را روی یک نُت بنوازید.',
  'Choose one graded piece, loop the harder two bars, then play it at half tempo.':
    'یک قطعهٔ درجه‌بندی‌شده انتخاب کنید، دو میزان سخت‌تر را حلقه کنید، سپس با نصف تمپو بنوازید.',
  'Complete one round of interval and progression questions in the trainer.':
    'یک دور پرسش فاصله و پیشروی را در مربی کامل کنید.',
  Improvisation: 'بداهه‌نوازی',
  'Start a backing loop and solo with two notes, then four, then the whole scale.':
    'یک حلقهٔ همراهی شروع کنید و با دو نُت سولو بزنید، سپس چهار، و بعد کل گام.',
  'Label the Roman numerals and name the cadence in one progression.':
    'اعداد رومی را برچسب بزنید و کادنس را در یک پیشروی نام‌گذاری کنید.',
  'Theory review': 'مرور تئوری',
  'Clear the due skills in your spaced-review queue.':
    'مهارت‌های سررسیده در صف مرور فاصله‌دار را پاک کنید.',

  // ── Focuses ──────────────────────────────────────────────────────
  Balanced: 'متوازن',
  'A little reading, rhythm, repertoire, and listening in every sheet.':
    'کمی نت‌خوانی، ریتم، رپرتوار و گوش‌دادن در هر برگه.',
  Reading: 'نت‌خوانی',
  'More time on the staff and fewer notes to hide behind.':
    'زمان بیشتر روی خطوط حامل و نُت‌های کمتر برای پنهان شدن پشتشان.',
  'Pulse first: echo, count, then put the rhythm on the instrument.':
    'اول نبض: تکرار کنید، بشمارید، سپس ریتم را روی ساز بگذارید.',
  'One piece, hands separate, then together, with a recording at the end.':
    'یک قطعه، دست‌ها جدا، سپس با هم، و در پایان یک ضبط.',
  'Name functions, hear cadences, then improvise over the progression.':
    'کارکردها را نام ببرید، کادنس‌ها را بشنوید، سپس روی پیشروی بداهه بزنید.',

  // ── Route metadata ───────────────────────────────────────────────
  'Build a timed, printable practice sheet with a focus, a length, and tasks from every room in Cadence.':
    'برگهٔ تمرین زمان‌دار و قابل چاپ با یک تمرکز، یک طول و کارهایی از هر اتاق کادنس بسازید.',
};
