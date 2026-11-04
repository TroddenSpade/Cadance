/**
 * Persian strings for generated exercise questions: prompts, instructions,
 * explanations, hints, and answer choices. English text is the key.
 */
export const faExercisePrompts: Record<string, string> = {
  'on the middle line': 'روی خط میانی',
  'on the {ordinal} line': 'روی خط {ordinal}',
  'in the {ordinal} space': 'در فضای {ordinal}',
  'on a ledger line above the staff': 'روی یک خط کمکی بالای خط حامل',
  'on a ledger line below the staff': 'روی یک خط کمکی پایین خط حامل',
  'in the space above the staff': 'در فضای بالای خط حامل',
  'in the space below the staff': 'در فضای پایین خط حامل',

  'Name this note.': 'این نُت را نام ببر.',
  'Read the staff, then choose the letter name.': 'خط حامل را بخوان، سپس نام حرف را انتخاب کن.',
  'This note is {note}, written {position} of the {clef} staff.':
    'این نُت {note} است، که {position} از خط حامل {clef} نوشته شده است.',
  'Treble clef lines: E G B D F.': 'خطوط کلید سل: E G B D F.',
  'Bass clef lines: G B D F A.': 'خطوط کلید فا: G B D F A.',

  'Find {name} on the instrument.': '{name} را روی ساز پیدا کن.',
  'Any octave counts. Tap a key or fret to answer.': 'هر اکتاوی پذیرفته است. برای پاسخ یک کلید یا پرده را بزن.',
  'The target pitch class is {label}. {name} appears in every octave — on a piano as the key labelled {label}, and on a guitar at several frets across the strings.':
    'کلاس زیروبمی هدف {label} است. {name} در هر اکتاو پیدا می‌شود — روی پیانو به‌عنوان کلید با برچسب {label}، و روی گیتار در چند پرده روی سیم‌های مختلف.',
  'Use the keyboard pattern: C is always just left of the group of two black keys.':
    'از الگوی کیبورد استفاده کن: C همیشه کمی سمت چپ گروه دو کلید سیاه است.',
  '{note} sharp': '{note} دیز',
  '{note} flat': '{note} بمول',

  'What interval do you hear?': 'چه فاصله‌ای می‌شنوی؟',
  'Listen to the two notes together.': 'به دو نُت با هم گوش کن.',
  'Listen to the two notes in order.': 'به دو نُت به‌ترتیب گوش کن.',
  '{low} and {high} together': '{low} و {high} با هم',
  '{high} down to {low}': '{high} تا {low} به‌صورت نزولی',
  '{low} up to {high}': '{low} تا {high} به‌صورت صعودی',
  '{motion} spans {semitones} semitones — a {answer}.':
    '{motion} {semitones} نیم‌پرده را در بر می‌گیرد — {answer}.',
  'Anchor the sound: a major 3rd sounds bright, a minor 3rd darker; a perfect 5th is open and stable.':
    'صدا را لنگر بینداز: سوم بزرگ روشن، سوم کوچک تیره‌تر؛ پنجم کامل باز و پایدار است.',

  'What interval is written?': 'چه فاصله‌ای نوشته شده است؟',
  'Read both notes. The interval is measured upward from the first note.':
    'هر دو نُت را بخوان. فاصله از نُت اول به‌سمت بالا اندازه‌گیری می‌شود.',
  '{first} up to {second} spans {semitones} semitones — a {answer}.':
    '{first} تا {second} {semitones} نیم‌پرده را در بر می‌گیرد — {answer}.',
  'Count the letter names inclusively to get the number, then count semitones to get the quality. Major can become minor; perfect can become augmented or diminished.':
    'نام حروف را با احتساب دو سر بشمار تا عدد به دست آید، سپس نیم‌پرده‌ها را بشمار تا کیفیت را بیابی. بزرگ می‌تواند کوچک شود؛ کامل می‌تواند افزوده یا کاسته شود.',

  'What chord quality do you hear?': 'چه کیفیت آکوردی می‌شنوی؟',
  'Listen as a block chord.': 'به‌صورت آکورد بلوکی گوش کن.',
  'The chord is {root} {quality} ({notes}).': 'آکورد {root} {quality} است ({notes}).',
  'Major sounds bright, minor sounds dark, diminished is tense, augmented is suspended and wide.':
    'ماژور روشن است، مینور تیره، کاسته پرتنش، و افزوده معلق و گسترده.',
};

/** Inversions, building, scales, keys, rhythm, and dictation. */
export const faExercisePromptsPartTwo: Record<string, string> = {
  'What inversion is this {root} {quality} chord?': 'این آکورد {root} {quality} چه وارونگی‌ای دارد؟',
  'The lowest note decides the inversion. Read the chord from the bottom up.':
    'پایین‌ترین نُت وارونگی را تعیین می‌کند. آکورد را از پایین به بالا بخوان.',
  'The bass is {bass}. {answer} means the {tone} is in the bass.':
    'باس {bass} است. {answer} یعنی {tone} در باس قرار دارد.',
  'Root position = root in the bass. First inversion = third. Second inversion = fifth. Seventh chords add third inversion = seventh.':
    'وضعیت پایه = پایه در باس. وارونگی اول = سوم. وارونگی دوم = پنجم. آکوردهای هفت وارونگی سوم را هم دارند = هفتم.',

  'Build a {root} {quality} chord.': 'یک آکورد {root} {quality} بساز.',
  'Build an {root} {quality} chord.': 'یک آکورد {root} {quality} بساز.',
  'Select the chord tones in any order, then check.': 'نُت‌های آکورد را به هر ترتیبی انتخاب کن، سپس بررسی کن.',
  'The {quality} chord on {root} contains {notes}.':
    'آکورد {quality} روی {root} شامل {notes} است.',
  'A major triad is root–major 3rd–perfect 5th; a minor triad lowers the 3rd.':
    'سه‌صدایی ماژور پایه–سوم بزرگ–پنجم کامل است؛ سه‌صدایی مینور سوم را پایین می‌آورد.',

  'Build the {root} {scale} scale.': 'گام {scale} روی {root} را بساز.',
  'Select the seven notes in ascending order, then check.': 'هفت نُت را به‌ترتیب صعودی انتخاب کن، سپس بررسی کن.',
  'The {scale} scale on {root} is {notes}.': 'گام {scale} روی {root} عبارت است از {notes}.',
  'Major pattern: whole–whole–half–whole–whole–whole–half.':
    'الگوی ماژور: پرده–پرده–نیم‌پرده–پرده–پرده–پرده–نیم‌پرده.',

  'What {mode} key does this key signature represent?': 'این سرکلید نمایانگر چه مایهٔ {mode} است؟',
  'Read the clef and the number of sharps or flats.': 'کلید و تعداد دیزها یا بمول‌ها را بخوان.',
  '{key} major': '{key} ماژور',
  '{key} minor': '{key} مینور',
  'No sharps or flats means C major or A minor.': 'نبودِ دیز و بمول یعنی C ماژور یا A مینور.',
  '{count} {accidentals} means {major} major or {minor} minor.':
    '{count} {accidentals} یعنی {major} ماژور یا {minor} مینور.',
  sharp: 'دیز',
  flat: 'بمول',
  sharps: 'دیز',
  flats: 'بمول',
  'For sharps, the last sharp is a half step below the major tonic. For flats, the second-to-last flat is the tonic.':
    'در دیزها، آخرین دیز نیم‌پرده زیر تونیک ماژور است. در بمول‌ها، بمول یکی‌مانده به آخر تونیک است.',

  'How many beats are in this bar?': 'این میزان چند ضرب دارد؟',
  'Add up the note values from left to right.': 'ارزش نُت‌ها را از چپ به راست جمع کن.',
  '{name} ({beats} beat)': '{name} ({beats} ضرب)',
  '{name} ({beats} beats)': '{name} ({beats} ضرب)',
  '{n} beats': '{n} ضرب',
  '{described} = {total} beats.': '{described} = {total} ضرب.',
  'Whole = 4 beats, half = 2, quarter = 1, eighth = ½. A dot adds half of the note value.':
    'گرد = ۴ ضرب، سفید = ۲، سیاه = ۱، چنگ = ½. نقطه نیمی از ارزش نُت را اضافه می‌کند.',

  'Which rhythm do you hear?': 'کدام ریتم را می‌شنوی؟',
  'Two bars of 4/4. Listen for long notes, short notes, and rests.':
    'دو میزان ۴/۴. به نُت‌های بلند، کوتاه و سکوت‌ها گوش کن.',
  'The rhythm is {description}.': 'ریتم {description} است.',
  'Tap the pulse first, then decide which beats are silent or split into two.':
    'اول ضرب را بزن، سپس تشخیص بده کدام ضرب‌ها سکوت‌اند یا به دو نیم تقسیم شده‌اند.',

  'In {root} {scale}, which scale degree is this note?': 'در گام {scale} {root}، این نُت کدام درجهٔ گام است؟',
  'The tonic is played first, then the mystery note.': 'اول تونیک نواخته می‌شود، سپس نُت مرموز.',
  '{note} is the {degree} of {root} {scale}.': '{note} درجهٔ {degree} از گام {scale} {root} است.',
  'Hear the tonic as home, then measure how far the note pulls away from it.':
    'تونیک را خانه بشنو، سپس اندازه بگیر نُت چقدر از آن دور می‌شود.',

  'Which scale-degree pattern do you hear?': 'کدام الگوی درجه‌های گام را می‌شنوی؟',
  'The melody stays in one major key and begins on the tonic.':
    'ملودی در یک مایهٔ ماژور می‌ماند و از تونیک آغاز می‌شود.',
  'In {root} major the notes are {notes}, degrees {degrees}.':
    'در {root} ماژور نُت‌ها {notes} و درجه‌ها {degrees} هستند.',
  'Hear the first note as 1, then track whether the line steps up or down.':
    'نُت اول را ۱ بشنو، سپس دنبال کن که خط بالا می‌رود یا پایین.',

  'Which progression do you hear?': 'کدام پیشروی را می‌شنوی؟',
  'Listen to the four (or three) chords in sequence.': 'به چهار (یا سه) آکورد پشت‌سرهم گوش کن.',
  'In {root} major the chords are {chords} ({progression}).':
    'در {root} ماژور آکوردها {chords} هستند ({progression}).',
  'Focus on the bass motion and whether the phrase feels resolved, suspended, or looped.':
    'روی حرکت باس تمرکز کن و اینکه عبارت حس پایانی، معلق یا چرخشی دارد.',

  'I–V–I (authentic cadence)': 'I–V–I (کادنس کامل)',
  'I–IV–V–I': 'I–IV–V–I',
  'I–vi–IV–V (pop)': 'I–vi–IV–V (پاپ)',
  'ii–V–I (jazz cadence)': 'ii–V–I (کادنس جَز)',
  'vi–IV–I–V': 'vi–IV–I–V',
  'V–vi (deceptive cadence)': 'V–vi (کادنس فریبنده)',
  'IV–I (plagal cadence)': 'IV–I (کادنس پلاگال)',
  'I–V (half cadence)': 'I–V (کادنس نیمه)',
};
