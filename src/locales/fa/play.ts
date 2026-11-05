/**
 * Phase 2 practice rooms: sight reading, rhythm, and backing loops.
 * English text is the key; see src/lib/i18n.tsx.
 */
export const faPlay: Record<string, string> = {
  // ── Sight reading ────────────────────────────────────────────────
  'Read before you play': 'پیش از نواختن بخوانید',
  'Sight-reading room': 'اتاق نت‌خوانی',
  'Four bars at a time. Read the score, then play it on your instrument in order. The count-in and click keep the pulse honest.':
    'هر بار چهار میزان. نت را بخوانید، سپس به ترتیب روی ساز بنوازید. شمارش ورودی و کلیک نبض را دقیق نگه می‌دارند.',
  'Choose a level': 'یک سطح انتخاب کنید',
  'Current level': 'سطح فعلی',
  'From steps to accidentals': 'از پله‌ها تا علامت‌های تغییردهنده',
  'New example': 'نمونهٔ تازه',
  'Reference tempo': 'تمپوی مرجع',
  'Note slots': 'خانه‌های نُت',
  '{n} / {total} notes': '{n} / {total} نُت',
  Undo: 'واگرد',
  Clear: 'پاک کردن',
  'Check reading': 'بررسی خواندن',
  'Clean read — every pitch in order.': 'خواندنِ بی‌غلط — همهٔ نُت‌ها به ترتیب.',
  '{matched} of {total} pitches matched.': '{matched} از {total} نُت درست بود.',
  'You played {played} of {total} notes.': '{played} از {total} نُت را نواختید.',
  'Note {n}: expected {expected}, you played {played}.':
    'نُت {n}: انتظار {expected} بود، {played} نواختید.',
  'Note {n}: expected {expected}, not played.': 'نُت {n}: انتظار {expected} بود، نواخته نشد.',
  'Now try it once more at the same tempo without looking at the note names.':
    'حالا یک بار دیگر با همان تمپو و بدون نگاه کردن به نام نُت‌ها امتحان کنید.',
  'How to read it': 'چگونه بخوانیم',
  'Eyes ahead, hands steady': 'چشم جلوتر، دست آرام',
  'Say the first three notes in your head before you play.':
    'پیش از نواختن، سه نُت اول را در ذهن بگویید.',
  'Start the count-in, then play one note per click unless the score shows a pair.':
    'شمارش ورودی را شروع کنید، سپس تا وقتی نت جفت‌نُت نشان نداده، با هر کلیک یک نُت بنوازید.',
  'If you miss a note, keep going. Stopping to fix it breaks the read.':
    'اگر نُتی را از دست دادید، ادامه بدهید. توقف برای درست کردنش خواندن را می‌شکند.',
  'Repeat the same example until it is clean, then raise the tempo.':
    'همان نمونه را تا بی‌غلط شدن تکرار کنید، سپس تمپو را بالا ببرید.',
  'Treble steps': 'پله‌های کلید سل',
  'C4 to G4, quarter notes, stepwise motion only.':
    'از C4 تا G4، سیاه‌ها، فقط حرکت پله‌ای.',
  'Treble leaps': 'جهش‌های کلید سل',
  'A full octave in C major with small leaps and eighth-note pairs.':
    'یک اکتاو کامل در C ماژور با جهش‌های کوچک و جفت‌های چنگ.',
  'Bass clef': 'کلید فا',
  'C3 to G3 in bass clef, one note per beat.':
    'از C3 تا G3 در کلید فا، هر ضرب یک نُت.',
  Accidentals: 'علامت‌های تغییردهنده',
  'C major with occasional sharps and flats in the melody.':
    'C ماژور با دیز و بمول‌های گاه‌به‌گاه در ملودی.',

  // ── Rhythm ───────────────────────────────────────────────────────
  'Move the pulse': 'نبض را حرکت بده',
  'Rhythm room': 'اتاق ریتم',
  'Listen to a two-bar pattern, then tap it back. The score compares the spacing of your attacks, not when you happened to start.':
    'به یک الگوی دو‌میزانی گوش دهید، سپس آن را با ضربه تکرار کنید. نمره فاصلهٔ ضربه‌ها را می‌سنجد، نه زمان شروع شما را.',
  '{n} attacks per pattern': '{n} ضربه در هر الگو',
  'From steady quarters to syncopation': 'از سیاه‌های یکنواخت تا سینکوپ',
  'Rhythm mode': 'حالت ریتم',
  Listen: 'گوش دادن',
  'Tap back': 'تکرار با ضربه',
  'Hear the two-bar pattern': 'الگوی دو‌میزانی را بشنوید',
  'New rhythm': 'ریتم تازه',
  'Rhythm tempo': 'تمپوی ریتم',
  'Count one bar in, then say the pattern to yourself while it plays. When you can hear it before it arrives, switch to Tap back.':
    'یک میزان بشمارید، سپس وقتی پخش می‌شود الگو را در ذهن بگویید. وقتی پیش از رسیدنش آن را می‌شنوید، به «تکرار با ضربه» بروید.',
  'Echo the rhythm': 'ریتم را پس بده',
  'Click tempo': 'تمپوی کلیک',
  'Tap the rhythm': 'ریتم را بزن',
  Tap: 'ضربه',
  'Every attack you hear': 'هر ضربه‌ای که می‌شنوید',
  '{n} taps': '{n} ضربه',
  '{n} expected': '{n} انتظار',
  'Clear taps': 'پاک کردن ضربه‌ها',
  'Check taps': 'بررسی ضربه‌ها',
  'The first tap starts your clock. Only the spacing between taps is judged, so a late start is fine.':
    'اولین ضربه ساعت شما را شروع می‌کند. فقط فاصلهٔ ضربه‌ها سنجیده می‌شود، پس شروع دیر اشکالی ندارد.',
  '{matched} of {total} attacks matched.': '{matched} از {total} ضربه درست بود.',
  'Average timing error: {ms} ms.': 'میانگین خطای زمان‌بندی: {ms} میلی‌ثانیه.',
  '{n} extra taps.': '{n} ضربهٔ اضافه.',
  'Perfect echo. Keep that internal pulse.': 'تکرار بی‌نقص. همان نبض درونی را نگه دارید.',
  'Close. Hold the long notes for their full value and keep the short ones light.':
    'نزدیک بود. نُت‌های بلند را تا ارزش کامل نگه دارید و کوتاه‌ها را سبک بزنید.',
  'Listen once more before tapping. Feel the pulse in your body first.':
    'پیش از ضربه زدن یک بار دیگر گوش دهید. اول نبض را در بدن حس کنید.',
  'Listen, tap, then play': 'بشنوید، ضربه بزنید، سپس بنوازید',
  'Listen to the whole pattern twice without tapping.':
    'دو بار به کل الگو گوش دهید، بدون ضربه زدن.',
  'Tap only the downbeats, then add the notes between them.':
    'فقط ضرب‌های قوی را بزنید، سپس نُت‌های بین آن‌ها را اضافه کنید.',
  'Echo the pattern, check the score, and listen again.':
    'الگو را تکرار کنید، نمره را ببینید و دوباره گوش دهید.',
  'Play the same rhythm on one note of your instrument.':
    'همان ریتم را روی یک نُت سازتان بنوازید.',
  'Steady pulse': 'نبض یکنواخت',
  'Quarter and half notes in 4/4. One attack per beat or every two beats.':
    'سیاه و سفید در ۴/۴. هر ضرب یا هر دو ضرب یک ضربه.',
  'Split the beat': 'شکستن ضرب',
  'Adds eighth notes, so some beats carry two attacks.':
    'چنگ‌ها اضافه می‌شوند، پس بعضی ضرب‌ها دو ضربه دارند.',
  Rests: 'سکوت‌ها',
  'Eighth and quarter values with silent beats you must feel through.':
    'ارزش‌های چنگ و سیاه با ضرب‌های خاموشی که باید درونشان حس شوند.',
  'Dotted and syncopated': 'نقطه‌دار و سینکوپ',
  'Dotted quarters and off-beat attacks against a steady pulse.':
    'سیاه‌های نقطه‌دار و ضربه‌های خارج از ضرب در برابر نبضی یکنواخت.',

  // ── Backing loops ────────────────────────────────────────────────
  'Backing loops': 'حلقه‌های همراهی',
  'Play over a band': 'روی یک گروه بنوازید',
  'A bass line and chords in a repeating four-bar progression. Pick a style and key, start the loop, then solo with the scale shown.':
    'یک خط باس و آکوردها در پیشروی چهار‌میزانی تکرارشونده. سبک و مایه را انتخاب کنید، حلقه را شروع کنید و با گام نمایش‌داده‌شده سولو بزنید.',
  'Now playing': 'در حال پخش',
  '{key} · {style}': '{key} · {style}',
  'Choose a style': 'یک سبک انتخاب کنید',
  'Six feels, one transport': 'شش حس، یک کنترل',
  Key: 'مایه',
  'Practice loop': 'حلقهٔ تمرین',
  '{style} in {key}': '{style} در {key}',
  'Loop tempo': 'تمپوی حلقه',
  'Chord progression': 'پیشروی آکورد',
  'Bar {n}': 'میزان {n}',
  'Solo scale': 'گام سولو',
  'How to practice': 'چگونه تمرین کنیم',
  'From roots to a solo': 'از پایه‌ها تا سولو',
  'Play only the root of each chord for one full pass.':
    'یک دور کامل فقط پایهٔ هر آکورد را بنوازید.',
  'Add the fifth, then the third, until you can outline every chord.':
    'پنجم و سپس سوم را اضافه کنید تا بتوانید هر آکورد را ترسیم کنید.',
  'Improvise with two notes from the scale, then four, then the whole scale.':
    'با دو نُت از گام بداهه بزنید، سپس چهار، و بعد کل گام.',
  'Loop one chord change until the voice leading is smooth, then add the next.':
    'یک تغییر آکورد را تا روان شدن صداگردی تکرار کنید، سپس بعدی را اضافه کنید.',
  'Explore the scale': 'کاوش گام',
  'Play a piece': 'نواختن یک قطعه',
  'Practice reading': 'تمرین نت‌خوانی',
  Pop: 'پاپ',
  'I–V–vi–IV, the four-chord loop behind countless songs.':
    'I–V–vi–IV، حلقهٔ چهار آکوردی پشت بی‌شمار آهنگ.',
  'Keep the chords light and let the bass carry the pulse. Aim for an even strum or a clean block chord on beats 2 and 4.':
    'آکوردها را سبک نگه دارید و بگذارید باس نبض را حمل کند. هدف، مضراب یکنواخت یا آکوردِ تمیز روی ضرب‌های ۲ و ۴ است.',
  Rock: 'راک',
  'I–♭VII–IV–I with power-chord stabs and a driving bass.':
    'I–♭VII–IV–I با ضربه‌های پاورکورد و باسی پیش‌برنده.',
  'Lock the bass to the kick and keep the stabs short. Leave space between attacks so the riff breathes.':
    'باس را به کیک قفل کنید و ضربه‌ها را کوتاه نگه دارید. بین ضربه‌ها فاصله بگذارید تا ریف نفس بکشد.',
  Jazz: 'جَز',
  'ii–V–I with seventh chords and a relaxed off-beat comp.':
    'ii–V–I با آکوردهای هفت و همراهی آرام خارج از ضرب.',
  'Comp on the “and” of beats 2 and 4. Guide tones — thirds and sevenths — matter more than the roots.':
    'روی «و»ِ ضرب‌های ۲ و ۴ همراهی کنید. نُت‌های راهنما — سوم و هفتم — مهم‌تر از پایه‌ها هستند.',
  Blues: 'بلوز',
  'Twelve-bar colour in a four-bar loop: I7–IV7–I7–V7.':
    'رنگ دوازده‌میزانی در حلقه‌ای چهار‌میزانی: I7–IV7–I7–V7.',
  'Feel the shuffle in the click. Keep the comp sparse and answer the vocal with short phrases rather than filling every beat.':
    'شافل را در کلیک حس کنید. همراهی را کم‌پشت کنید و به‌جای پر کردن هر ضرب، با عبارت‌های کوتاه به آواز پاسخ دهید.',
  Waltz: 'والس',
  'I–IV–V–I in 3/4: bass on one, chords on two and three.':
    'I–IV–V–I در ۳/۴: باس روی یک، آکوردها روی دو و سه.',
  'Make beat one strong but not heavy. Let the two lighter chords lean into the next downbeat.':
    'ضرب یک را قوی اما نه سنگین کنید. بگذارید دو آکورد سبک‌تر به ضرب قوی بعدی تکیه کنند.',
  Folk: 'فولک',
  'I–IV–I–V with an open, acoustic strum.':
    'I–IV–I–V با مضراب باز و آکوستیک.',
  'Keep the right hand moving in eighth notes and change chords early. The bass note should arrive with the click.':
    'دست راست را در چنگ‌ها متحرک نگه دارید و آکورد را زود عوض کنید. نُت باس باید با کلیک برسد.',
  'Major pentatonic': 'پنتاتونیک ماژور',
  'Minor pentatonic': 'پنتاتونیک مینور',
  Mixolydian: 'میکسولیدین',
  'Blues scale': 'گام بلوز',
  'Major scale': 'گام ماژور',

  // ── Tools cards and route metadata ───────────────────────────────
  'Sight reading': 'نت‌خوانی',
  Read: 'خواندن',
  'Open sight reading': 'باز کردن نت‌خوانی',
  'Four-bar melodies in treble or bass clef. Read the score, play it back in order, and check every pitch. The click keeps the pulse honest.':
    'ملودی‌های چهار‌میزانی در کلید سل یا فا. نت را بخوانید، به ترتیب بنوازید و هر نُت را بررسی کنید. کلیک نبض را دقیق نگه می‌دارد.',
  'Four levels from steps to accidentals': 'چهار سطح از پله‌ها تا علامت‌های تغییردهنده',
  'Count-in, click, and reference tempo': 'شمارش ورودی، کلیک و تمپوی مرجع',
  'Pitch-by-pitch feedback on piano or guitar': 'بازخورد نُت‌به‌نُت روی پیانو یا گیتار',
  'Open rhythm room': 'باز کردن اتاق ریتم',
  'Hear a two-bar rhythm and echo it back by tapping. The score judges the spacing of your attacks, not when you happened to begin.':
    'ریتمی دو‌میزانی را بشنوید و با ضربه تکرار کنید. نمره فاصلهٔ ضربه‌ها را می‌سنجد، نه زمان شروع شما را.',
  'Quarters, eighths, rests, and syncopation': 'سیاه، چنگ، سکوت و سینکوپ',
  'Tap back with an internal clock': 'تکرار با ضربه و ساعت درونی',
  'Timing accuracy and per-attack feedback': 'دقت زمان‌بندی و بازخورد هر ضربه',
  'Open backing loops': 'باز کردن حلقه‌های همراهی',
  'A bass line and chord progression that repeats while you solo. Six styles, twelve keys, and the matching scale on the staff and your instrument.':
    'خط باس و پیشروی آکوردی که هنگام سولو تکرار می‌شود. شش سبک، دوازده مایه و گام متناظر روی نُت و ساز شما.',
  'Pop, rock, jazz, blues, waltz, and folk': 'پاپ، راک، جَز، بلوز، والس و فولک',
  'Four-bar loops in every key': 'حلقه‌های چهار‌میزانی در همهٔ مایه‌ها',
  'Two-octave solo scale on piano and guitar': 'گام سولوی دو اکتاوی روی پیانو و گیتار',
  'The utilities that sit beside the curriculum: a clock to keep time, a tuner to keep pitch honest, graded pieces to play, an explorer for every scale and chord, and rooms for sight-reading, rhythm, and backing loops. Everything works offline.':
    'ابزارهایی که کنار برنامهٔ درسی می‌نشینند: ساعتی برای نگه داشتن زمان، تیونری برای درست نگه داشتن کوک، قطعه‌های درجه‌بندی‌شده برای نواختن، کاوشگری برای هر گام و آکورد، و اتاق‌هایی برای نت‌خوانی، ریتم و حلقه‌های همراهی. همه‌چیز آفلاین کار می‌کند.',
  'Read four bars of music and play them back in order, with a count-in, click, and pitch-by-pitch feedback.':
    'چهار میزان موسیقی را بخوانید و به ترتیب بنوازید، با شمارش ورودی، کلیک و بازخورد نُت‌به‌نُت.',
  'Listen to a two-bar rhythm and tap it back. The score judges the spacing of your attacks.':
    'به ریتمی دو‌میزانی گوش دهید و آن را با ضربه تکرار کنید. نمره فاصلهٔ ضربه‌ها را می‌سنجد.',
  'A bass line and chords in a repeating four-bar progression, with a solo scale in every key.':
    'خط باس و آکوردها در پیشروی چهار‌میزانی تکرارشونده، با گام سولو در هر مایه.',
};

