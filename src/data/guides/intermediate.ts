import type { GuideContent } from './types';

export const INTERMEDIATE_GUIDES: GuideContent[] = [
  {
    id: 'diatonic-functions',
    idea: `Chords have jobs, not just names. Tonic is home, subdominant is departure, dominant is the pull back. A chord's function comes from the tones it shares and the tendencies it contains, so vi can stand in for I and ii for IV. Hear the job and the Roman numeral becomes a description, not a label to memorise.`,
    practice: `**Try this:** Play I–IV–V–I slowly and name each station before it sounds. Then substitute vi for I and ii for IV, and notice how little the journey changes.

- **Watch out:** Labelling function by root alone. A chord's behaviour depends on context, inversion, and what surrounds it.
- **You have it when:** You can hear a chord leave home and return without knowing its name first.
- **Going further:** Take a progression you like and replace one chord with a functional substitute; keep the melody and judge the result.`,
    faIdea: `آکوردها کار دارند، نه فقط نام. تُنیک خانه است، زیرغالب حرکت به بیرون و غالب کشش بازگشت. نقش یک آکورد از نُت‌های مشترک و گرایش‌های درونی‌اش می‌آید؛ به همین دلیل vi می‌تواند جای I و ii جای IV بنشیند. کار را بشنو تا عدد رومی توصیف شود، نه برچسبی برای حفظ.`,
    faPractice: `**این را امتحان کن:** I–IV–V–I را کند بنواز و پیش از شنیدن هر آکورد، ایستگاهش را نام ببر. بعد vi را جای I و ii را جای IV بگذار و ببین چقدر سفر کم عوض می‌شود.

- **مراقب باش:** نقش را فقط از پایه تعیین کنی. رفتار آکورد به زمینه، وارونگی و همسایگانش بستگی دارد.
- **وقتی آماده‌ای که:** بتوانی بشنوی آکورد از خانه بیرون می‌رود و برمی‌گردد، پیش از آنکه نامش را بدانی.
- **یک قدم جلوتر:** پیشروی‌ای را که دوست داری بردار و یک آکورد را با جانشین کارکردی عوض کن؛ ملودی را نگه دار و نتیجه را قضاوت کن.`,
  },
  {
    id: 'cadences-ii-v-i',
    idea: `A cadence is punctuation: it tells the ear whether a phrase is finished, paused, or deceived. The ii–V–I is a complete sentence — preparation, tension, arrival — and its power lives in two small motions, 7→1 and 4→3. Learn the cadence by its voice leading, not by its chord names.`,
    practice: `**Try this:** Play a perfect authentic cadence, an imperfect one, a half cadence, and a deceptive cadence in C. Sing the leading tone through each and feel where it resolves.

- **Watch out:** Calling every V–I "perfect". It is perfect only when both chords are in root position and the melody lands on the tonic.
- **You have it when:** You can identify the four cadence types by ear and choose one to end a phrase.
- **Going further:** Write four different four-bar phrases, each ending with a different cadence, and perform them back to back.`,
    faIdea: `کادانس همان نقطه‌گذاری است: به گوش می‌گوید عبارت تمام شد، مکث کرد یا فریب خورد. ii–V–I یک جملهٔ کامل است — آماده‌سازی، تنش، رسیدن — و قدرتش در دو حرکت کوچک زندگی می‌کند: ۷→۱ و ۴→۳. کادانس را از حرکت صداها بیاموز، نه از نام آکوردها.`,
    faPractice: `**این را امتحان کن:** در C یک کادانس کاملِ اصیل، یک ناقص، یک نیمه و یک فریبنده بنواز. نُتِ راهنما را در هرکدام بخوان و ببین کجا حل می‌شود.

- **مراقب باش:** هر V–I را «کامل» بنامی. فقط وقتی کامل است که هر دو آکورد در حالت پایه باشند و ملودی روی تُنیک بنشیند.
- **وقتی آماده‌ای که:** چهار نوع کادانس را با گوش تشخیص بدهی و برای پایان یک عبارت یکی را انتخاب کنی.
- **یک قدم جلوتر:** چهار عبارت چهارمیزانی بنویس که هرکدام با کادانسی متفاوت تمام شود و پشت‌سرهم اجرا کن.`,
  },
  {
    id: 'seventh-chords',
    idea: `A seventh chord adds one more third, so it contains two intervals that can pull in different directions. The dominant seventh is the clearest case: its tritone wants to resolve. Sevenths are not "jazzier triads"; they are four-note tensions with a grammar of preparation and resolution.`,
    practice: `**Try this:** Build the five common sevenths from C: Cmaj7, Cm7, C7, Cm7♭5, Cdim7. Play G7 to C and hold the tritone (B–F) until it resolves to C–E.

- **Watch out:** Spelling the seventh by ear alone. A minor seventh above C is B♭; a major seventh is B. The letter changes the chord.
- **You have it when:** You can build all five qualities from one root and hear which one wants to move.
- **Going further:** Harmonize a ii–V–I with sevenths and then revoice the same chords with the seventh in the melody.`,
    faIdea: `آکورد هفت یک سومِ دیگر اضافه می‌کند، پس دو فاصله دارد که می‌توانند به دو جهت بکشند. هفتِ غالب روشن‌ترین نمونه است: تریتونش می‌خواهد حل شود. آکوردهای هفت «سه‌صداییِ جَزی‌تر» نیستند؛ تنش‌های چهارنُتی‌اند با دستورِ آماده‌سازی و حل.`,
    faPractice: `**این را امتحان کن:** پنج هفتِ رایج را از C بساز: Cmaj7، Cm7، C7، Cm7♭5 و Cdim7. G7 را به C بنواز و تریتون (B–F) را نگه دار تا به C–E حل شود.

- **مراقب باش:** هفتم را فقط با گوش بنویسی. هفتمِ کوچک بالای C، B♭ است؛ هفتمِ بزرگ B. حرف، آکورد را عوض می‌کند.
- **وقتی آماده‌ای که:** هر پنج کیفیت را از یک پایه بسازی و بشنوی کدام یک می‌خواهد حرکت کند.
- **یک قدم جلوتر:** ii–V–I را با هفت‌ها هارمونیزه کن، بعد همان آکوردها را طوری بچین که هفتم در ملودی بیاید.`,
  },
  {
    id: 'seven-modes',
    idea: `A mode is the same set of notes with a different home — or, more usefully, a major scale with one or two degrees altered. The characteristic note is what your ear remembers: ♯4 for Lydian, ♭7 for Mixolydian, ♮6 for Dorian, ♭2 for Phrygian. The tonic, not the note collection, decides the mode.`,
    practice: `**Try this:** Play all seven modes from C by altering the major scale, and sing the characteristic note against a C drone. Then play D Dorian and name which note makes it Dorian rather than C major.

- **Watch out:** Playing the white keys from D and calling it Dorian without hearing D as home. The drone is what makes the mode audible.
- **You have it when:** You can identify a mode by its characteristic note and tonic, not by counting white keys.
- **Going further:** Improvise eight bars in Dorian, then change one note to make it Aeolian and describe the shift.`,
    faIdea: `مُد همان مجموعهٔ نُت‌هاست با خانه‌ای دیگر — یا به شکلی کاربردی‌تر، گامی ماژور با یکی دو درجهٔ تغییریافته. نُتِ مشخصه چیزی است که گوش به یاد می‌سپارد: ♯۴ برای لیدین، ♭۷ برای میکسولیدین، ♮۶ برای دورین و ♭۲ برای فریجین. تُنیک تصمیم می‌گیرد، نه مجموعهٔ نُت‌ها.`,
    faPractice: `**این را امتحان کن:** هر هفت مُد را از C با تغییر گام ماژور بنواز و نُتِ مشخصه را روی یک درونِ C بخوان. بعد D دورین را بنواز و بگو کدام نُت آن را دورین می‌کند، نه C ماژور.

- **مراقب باش:** کلیدهای سفید را از D بنوازی و بدون شنیدن D به‌عنوان خانه، اسمش را دورین بگذاری. درون است که مُد را شنیدنی می‌کند.
- **وقتی آماده‌ای که:** مُد را از نُتِ مشخصه و تُنیک بشناسی، نه از شمردن کلیدهای سفید.
- **یک قدم جلوتر:** هشت میزان در دورین بداهه بنواز، بعد یک نُت را عوض کن تا اِئولین شود و تغییر را توصیف کن.`,
  },
  {
    id: 'modal-ear',
    idea: `Modes are heard as colours against a stable home, not as scales run up and down. A drone or vamp holds the tonic still while the characteristic note does the colouring. Functional harmony pulls the ear home through V–I; modal music usually circles instead of cadencing.`,
    practice: `**Try this:** Hold a C drone and sing the characteristic note of each mode above it. Then improvise four bars over a two-chord vamp, returning to the tonic note often.

- **Watch out:** Adding a leading tone and a V chord. That turns a modal vamp into functional harmony and erases the colour.
- **You have it when:** You can name the mode of a vamp within a few seconds and reproduce its characteristic note.
- **Going further:** Take a familiar song in a major key and rewrite its harmony as a modal vamp; keep the melody.`,
    faIdea: `مُدها به‌صورت رنگ در برابر یک خانهٔ ثابت شنیده می‌شوند، نه گامی که بالا و پایین می‌رود. درون یا ومپ تُنیک را ثابت نگه می‌دارد و نُتِ مشخصه رنگ‌آمیزی می‌کند. هارمونی کارکردی گوش را با V–I به خانه می‌کشد؛ موسیقی مُدال معمولاً دور می‌زند و کادانس نمی‌کند.`,
    faPractice: `**این را امتحان کن:** یک درونِ C نگه دار و نُتِ مشخصهٔ هر مُد را بالای آن بخوان. بعد روی یک ومپِ دو‌آکوردی چهار میزان بداهه بنواز و مکرراً به نُتِ تُنیک برگرد.

- **مراقب باش:** نُتِ راهنما و آکورد V اضافه کنی. این ومپِ مُدال را به هارمونی کارکردی تبدیل می‌کند و رنگ را پاک می‌کند.
- **وقتی آماده‌ای که:** مُدِ یک ومپ را در چند ثانیه نام ببری و نُتِ مشخصه‌اش را بازتولید کنی.
- **یک قدم جلوتر:** آهنگی آشنا در گام ماژور بردار و هارمونی‌اش را به ومپِ مُدال بازنویسی کن؛ ملودی را نگه دار.`,
  },
  {
    id: 'melodic-dictation',
    idea: `Dictation is not transcription by brute force. Hear the contour first, then the rhythm, then the intervals, and hold the phrase in two- to four-note chunks. If you can sing it, you can name it; writing is the last step, not the first.`,
    practice: `**Try this:** Play a four-note phrase, sing it back, then write scale degrees rather than letters. Check on your instrument only after you have committed an answer.

- **Watch out:** Writing one note at a time while the phrase keeps moving. You lose the shape and start guessing.
- **You have it when:** You can reproduce and notate a four-bar diatonic phrase after three hearings.
- **Going further:** Transcribe a phrase with one chromatic note and mark where it leans.`,
    faIdea: `دیکته، رونویسیِ زورکی نیست. اول خطِ ملودی را بشنو، بعد ریتم و بعد فاصله‌ها؛ عبارت را در تکه‌های دو تا چهارنُتی نگه دار. اگر بتوانی بخوانی، می‌توانی نام بگذاری؛ نوشتن آخرین قدم است، نه اولین.`,
    faPractice: `**این را امتحان کن:** یک عبارت چهارنُتی بنواز، بازبخوان و بعد به‌جای حروف، درجه‌های گام را بنویس. فقط پس از آنکه پاسخ را قطعی کردی، با ساز بررسی کن.

- **مراقب باش:** نُت‌به‌نُت بنویسی در حالی که عبارت جلو می‌رود. شکل را گم می‌کنی و شروع به حدس می‌کنی.
- **وقتی آماده‌ای که:** یک عبارت دیاتونیک چهارمیزانی را بعد از سه بار شنیدن بازتولید و نت‌نویسی کنی.
- **یک قدم جلوتر:** عبارتی با یک نُتِ کروماتیک را رونویسی کن و علامت بزن کجا تکیه می‌کند.`,
  },
  {
    id: 'chord-progression-recognition',
    idea: `Hear harmony in layers: bass line first, then chord quality, then function. A progression is a route, not a stack of isolated chords. Cadences and common loops — I–V–vi–IV, ii–V–I — give you landmarks, so you can recognise the destination before naming every chord.`,
    practice: `**Try this:** Loop four chords and sing the bass line before naming anything. Then label functions (T/S/D) and only afterwards assign Roman numerals.

- **Watch out:** Identifying chords one at a time with no key centre. Without a tonic, every chord is an isolated guess.
- **You have it when:** You can follow a four-chord loop by bass and function after two hearings.
- **Going further:** Transcribe the chorus of a song you know and mark its cadence.`,
    faIdea: `هارمونی را لایه‌لایه بشنو: اول خط باس، بعد کیفیت آکورد و بعد نقش. پیشروی یک مسیر است، نه انبوهی از آکوردهای جدا. کادانس‌ها و چرخه‌های رایج — I–V–vi–IV و ii–V–I — نقطه‌های شاخص می‌دهند تا پیش از نام‌بردن هر آکورد، مقصد را بشناسی.`,
    faPractice: `**این را امتحان کن:** چهار آکورد را در حلقه بگذار و پیش از نام‌بردن هر چیز، خط باس را بخوان. بعد نقش‌ها را برچسب بزن (T/S/D) و تنها بعد از آن اعداد رومی بده.

- **مراقب باش:** آکوردها را یکی‌یکی و بدون مرکز گام تشخیص بدهی. بدون تُنیک، هر آکورد حدسی جداگانه است.
- **وقتی آماده‌ای که:** یک چرخهٔ چهارآکوردی را بعد از دو بار شنیدن با باس و نقش دنبال کنی.
- **یک قدم جلوتر:** کورس آهنگی آشنا را رونویسی کن و کادانسش را علامت بزن.`,
  },
  {
    id: 'rhythmic-dictation',
    idea: `Rhythm dictation starts with the pulse, then the meter, then the smallest subdivision. Notate in layers: beats first, then divisions, then the notes that cross them. A rhythm you can count is a rhythm you can write.`,
    practice: `**Try this:** Tap the pulse, decide whether the bar is duple or triple, then notate two bars using only quarter and eighth notes. Add sixteenths only after the skeleton is correct.

- **Watch out:** Writing note values before finding the pulse. The symbols then describe a rhythm that is not there.
- **You have it when:** You can notate a two-bar pattern with syncopation after three hearings.
- **Going further:** Transcribe a drum groove and mark which instrument carries the backbeat.`,
    faIdea: `دیکتهٔ ریتم با ضرب شروع می‌شود، بعد میزان و بعد کوچک‌ترین تقسیم. لایه‌لایه بنویس: اول ضرب‌ها، بعد تقسیم‌ها و بعد نُت‌هایی که از آن‌ها عبور می‌کنند. ریتمی که بتوانی بشماری، ریتمی است که بتوانی بنویسی.`,
    faPractice: `**این را امتحان کن:** ضرب را با پا بزن، تصمیم بگیر میزان دوتایی است یا سه‌تایی، بعد دو میزان را فقط با سیاه و چنگ بنویس. دولاها را تنها بعد از درست‌شدن اسکلت اضافه کن.

- **مراقب باش:** پیش از یافتن ضرب، ارزش نُت‌ها را بنویسی. آن‌وقت نمادها ریتمی را توصیف می‌کنند که وجود ندارد.
- **وقتی آماده‌ای که:** یک الگوی دومیزانی با سینکوپ پس از سه بار شنیدن بنویسی.
- **یک قدم جلوتر:** یک گروهِ درام را رونویسی کن و علامت بزن کدام ساز ضربِ پشت را می‌برد.`,
  },
  {
    id: 'tuplets-syncopation',
    idea: `A tuplet divides a beat into a number that does not match its natural split: three in the time of two, five in the time of four. Syncopation is the opposite face of the same grid — the accent moves off the beat while the beat stays. Neither works unless the underlying pulse is felt.`,
    practice: `**Try this:** Tap a steady beat and fit three even notes into two beats, then four into three. Clap a syncopated pattern while your foot keeps the pulse; do not let the foot follow the hand.

- **Watch out:** Dropping the pulse when the tuplet arrives. The tuplet is a division of the beat, not a new tempo.
- **You have it when:** You can keep a 3:2 tuplet and a syncopated phrase steady against a metronome.
- **Going further:** Improvise two bars of syncopation over a loop and land on beat 1 every time.`,
    faIdea: `توپلت ضرب را به عددی تقسیم می‌کند که با تقسیم طبیعی‌اش نمی‌خواند: سه در زمان دو، پنج در زمان چهار. سینکوپ روی دیگر همان شبکه است — تأکید از ضرب بیرون می‌رود و ضرب سر جایش می‌ماند. هیچ‌کدام بدون حس‌کردن ضربِ زیرین کار نمی‌کنند.`,
    faPractice: `**این را امتحان کن:** ضرب ثابتی با پا بزن و سه نُتِ مساوی را در دو ضرب جا بده، بعد چهار را در سه. یک الگوی سینکوپ‌دار دست بزن و بگذار پا ضرب را نگه دارد؛ نگذار پا از دست پیروی کند.

- **مراقب باش:** وقتی توپلت می‌رسد ضرب را رها کنی. توپلت تقسیم ضرب است، نه تمپوی تازه.
- **وقتی آماده‌ای که:** بتوانی توپلت ۳:۲ و یک عبارت سینکوپ‌دار را در برابر مترونوم ثابت نگه داری.
- **یک قدم جلوتر:** دو میزان سینکوپ روی یک حلقه بداهه بنواز و هر بار روی ضرب اول فرود بیا.`,
  },
  {
    id: 'odd-meters-hemiola',
    idea: `Odd meters are additive, not irregular: 5/8 is usually 3+2 or 2+3, 7/8 is 4+3 or 3+4. The grouping is the meter. Hemiola sets two against three at the level of the bar, making a duple feel appear inside a triple one.`,
    practice: `**Try this:** Count 5/8 as "1 2 3, 1 2" and clap the groups. Then play a 3/4 pattern and re-accent it as two groups of three eighths to create a hemiola.

- **Watch out:** Forcing odd bars into equal groups. The accent pattern is what makes 5 or 7 feel intentional.
- **You have it when:** You can keep a 7/8 grouping steady and switch between 4+3 and 3+4 on purpose.
- **Going further:** Write an eight-bar phrase in 7/8 with one bar of 5/8 and perform the change smoothly.`,
    faIdea: `میزان‌های فردی جمعی‌اند، نه بی‌قاعده: ۵/۸ معمولاً ۳+۲ یا ۲+۳ است و ۷/۸ برابر ۴+۳ یا ۳+۴. گروه‌بندی همان میزان است. همیولا دو را در برابر سه در سطح میزان می‌گذارد و حس دوتایی را داخل حس سه‌تایی می‌آورد.`,
    faPractice: `**این را امتحان کن:** ۵/۸ را «۱ ۲ ۳، ۱ ۲» بشمار و گروه‌ها را دست بزن. بعد یک الگوی ۳/۴ بنواز و آن را به‌صورت دو گروه سه‌چنگ تأکید کن تا همیولا بسازی.

- **مراقب باش:** میزان‌های فردی را به گروه‌های مساوی بچپانی. الگوی تأکید است که ۵ یا ۷ را عمدی می‌کند.
- **وقتی آماده‌ای که:** گروه‌بندی ۷/۸ را ثابت نگه داری و آگاهانه بین ۴+۳ و ۳+۴ جابه‌جا شوی.
- **یک قدم جلوتر:** عبارتی هشت‌میزانی در ۷/۸ بنویس که یک میزان ۵/۸ داشته باشد و تغییر را نرم اجرا کن.`,
  },
  {
    id: 'polyrhythm-groove',
    idea: `Polyrhythm is two different divisions sounding at once; polymeter is two different meters. A groove is usually interlocking patterns sharing one pulse, not everyone playing the same rhythm. Metric modulation changes tempo by turning a note value into the new beat.`,
    practice: `**Try this:** Tap 3 against 2 with both hands, then sing one layer while tapping the other. Set a metronome and keep both layers even; swap which hand leads.

- **Watch out:** Rushing the layer that feels "faster". Both patterns must share the same beat grid.
- **You have it when:** You can hold a 3:2 polyrhythm for eight bars without slowing one side.
- **Going further:** Take a groove you know and move the backbeat one eighth later; describe the new feel.`,
    faIdea: `پلی‌ریتم دو تقسیم متفاوت است که هم‌زمان شنیده می‌شوند؛ پلی‌متر دو میزان متفاوت است. گروو معمولاً از الگوهای درهم‌بافته ساخته می‌شود که یک ضرب مشترک دارند، نه از نواختن یک ریتم توسط همه. تغییر متریک با تبدیل یک ارزش نُت به ضرب تازه، تمپو را عوض می‌کند.`,
    faPractice: `**این را امتحان کن:** با دو دست ۳ در برابر ۲ را دست بزن، بعد یک لایه را بخوان و لایهٔ دیگر را با دست نگه دار. مترونوم بگذار و هر دو لایه را مساوی نگه دار؛ جای دست‌ها را عوض کن.

- **مراقب باش:** لایه‌ای را که «تندتر» حس می‌شود جلو بیندازی. هر دو الگو باید همان شبکهٔ ضرب را شریک باشند.
- **وقتی آماده‌ای که:** پلی‌ریتم ۳:۲ را هشت میزان نگه داری بی‌آنکه یک طرف کند شود.
- **یک قدم جلوتر:** گروویی آشنا را بردار و ضربِ پشت را یک چنگ عقب ببر؛ حس تازه را توصیف کن.`,
  },
  {
    id: 'non-chord-tones',
    idea: `Every melody note is either a chord tone or a decoration of one. Passing, neighbour, suspension, appoggiatura, escape tone, and anticipation are names for how a decoration is prepared and resolved. Classify by behaviour, not by a list; the same note can be a passing tone in one harmonization and a chord tone in another.`,
    practice: `**Try this:** Take a melody you know and mark chord tones with a stem and non-chord tones with an x. Then label each x by how it arrives and leaves: step, leap, hold, resolve.

- **Watch out:** Calling every non-chord note a passing tone. The label depends on the notes before and after it.
- **You have it when:** You can analyze a four-bar melody and explain every decoration's preparation and resolution.
- **Going further:** Compose an eight-bar line that uses a suspension, an appoggiatura, and an escape tone, and label them.`,
    faIdea: `هر نُتِ ملودی یا نُتِ آکورد است یا تزیینِ آن. گذر، همسایه، تعلیق، آپوجاتورا، گریز و پیش‌بینی نام‌هایی برای چگونگی آماده‌شدن و حل‌شدن تزیین‌اند. بر اساس رفتار دسته‌بندی کن، نه بر اساس فهرست؛ همان نُت در یک هارمونی گذر است و در هارمونی دیگر نُتِ آکورد.`,
    faPractice: `**این را امتحان کن:** ملودی‌ای آشنا بردار و نُت‌های آکورد را با ساقه و نُت‌های غیرآکورد را با ضربدر علامت بزن. بعد هر ضربدر را بر اساس ورود و خروجش برچسب بزن: پله، پرش، نگه‌داشتن، حل.

- **مراقب باش:** هر نُتِ غیرآکورد را «گذر» بنامی. برچسب به نُت‌های قبل و بعد بستگی دارد.
- **وقتی آماده‌ای که:** یک ملودی چهارمیزانی را تحلیل کنی و آماده‌سازی و حل هر تزیین را توضیح بدهی.
- **یک قدم جلوتر:** خطی هشت‌میزانی بساز که تعلیق، آپوجاتورا و گریز داشته باشد و برچسبشان بزن.`,
  },
  {
    id: 'contour-motive',
    idea: `A melody is contour plus rhythm plus motive. The motive is the smallest idea you can remember and vary; the contour is its shape over time. Composers develop motives by inversion, retrograde, sequence, augmentation, and diminution — the same few notes seen from new angles.`,
    practice: `**Try this:** Sing a two-bar melody and draw its contour as a line. Then develop a three-note motive four ways: up, inverted, backwards, and twice as slow.

- **Watch out:** Confusing a motive with a phrase. A phrase has a cadence; a motive is the seed inside it.
- **You have it when:** You can find the motive in a piece you know and name one way the composer develops it.
- **Going further:** Write an eight-bar period from a three-note motive, with a half cadence and a full cadence.`,
    faIdea: `ملودی از خطِ حرکت، ریتم و موتیو ساخته می‌شود. موتیو کوچک‌ترین ایده‌ای است که می‌توانی به یاد بسپاری و تغییر بدهی؛ خطِ حرکت شکل آن در زمان است. آهنگسازان موتیو را با وارونگی، بازگشت، سکانس، بزرگ‌کردن و کوچک‌کردن بسط می‌دهند — همان چند نُت از زاویه‌های تازه.`,
    faPractice: `**این را امتحان کن:** یک ملودی دومیزانی بخوان و خطِ حرکتش را رسم کن. بعد یک موتیوِ سه‌نُتی را چهار شکل بسط بده: بالا، وارونه، برعکس و دو برابر کند.

- **مراقب باش:** موتیو را با عبارت اشتباه بگیری. عبارت کادانس دارد؛ موتیو بذرِ درون آن است.
- **وقتی آماده‌ای که:** بتوانی موتیو را در قطعه‌ای آشنا پیدا کنی و یک راه بسط آهنگساز را نام ببری.
- **یک قدم جلوتر:** از یک موتیوِ سه‌نُتی، دوره‌ای هشت‌میزانی بنویس با یک کادانس نیمه و یک کادانس کامل.`,
  },
  {
    id: 'harmonization-texture',
    idea: `Harmonization is choosing chords that support the melody's structural notes; texture is how many layers you use and how they relate. Homophony moves together, polyphony keeps independent lines, and a countermelody is a second line with its own shape. The melody decides the harmony, not the other way round.`,
    practice: `**Try this:** Harmonize an eight-bar melody with I, IV, and V, changing chord only when the melody's structural note changes. Then add a countermelody that moves mostly in contrary motion.

- **Watch out:** Changing chords on every melody note. That hides the phrase and sounds busy.
- **You have it when:** You can harmonize a simple tune with two or three chords per phrase and add one independent line.
- **Going further:** Reharmonize the same melody with inversions and one borrowed chord, keeping the countermelody.`,
    faIdea: `هارمونیزه‌کردن یعنی انتخاب آکوردهایی که نُت‌های ساختاری ملودی را پشتیبانی کنند؛ بافت یعنی چند لایه داری و چه نسبتی با هم دارند. هموفونی با هم حرکت می‌کند، پلی‌فونی خطوط مستقل را نگه می‌دارد و کنترملودی خط دومی با شکل خودش است. ملودی هارمونی را تعیین می‌کند، نه برعکس.`,
    faPractice: `**این را امتحان کن:** یک ملودی هشت‌میزانی را با I، IV و V هارمونیزه کن و آکورد را فقط وقتی عوض کن که نُتِ ساختاری ملودی عوض می‌شود. بعد کنترملودی‌ای اضافه کن که بیشتر در حرکت مخالف باشد.

- **مراقب باش:** روی هر نُتِ ملودی آکورد عوض کنی. این عبارت را پنهان می‌کند و شلوغ به گوش می‌رسد.
- **وقتی آماده‌ای که:** بتوانی آهنگی ساده را با دو یا سه آکورد در هر عبارت هارمونیزه کنی و یک خط مستقل اضافه کنی.
- **یک قدم جلوتر:** همان ملودی را با وارونگی‌ها و یک آکورد قرضی بازهارمونیزه کن و کنترملودی را نگه دار.`,
  },
  {
    id: 'caged-barre-capo',
    idea: `CAGED is one fretboard seen through five movable shapes: C, A, G, E, D. A barre chord is simply an open shape with the nut replaced by your finger; a capo does the same job without flattening your index. The shape is not the chord — the root inside it is.`,
    practice: `**Try this:** Play a C-shaped chord at the first, third, and fifth positions and name the root each time. Then barre an E shape and an A shape up the neck, saying the root aloud.

- **Watch out:** Memorising shapes without their roots. A shape is only a chord when you know which string names it.
- **You have it when:** You can play the same chord in five CAGED positions and find its root instantly.
- **Going further:** Arrange a two-chord song using only barre shapes above the fifth fret, then capo and transpose it.`,
    faIdea: `CAGED یک دسته‌ٔ گیتار است که از پنج شکل متحرک دیده می‌شود: C، A، G، E و D. آکورد باره همان شکل باز است که خرک با انگشت جایگزین شده؛ کاپو هم همان کار را بدون خواباندن انگشت اشاره می‌کند. شکل، آکورد نیست — پایهٔ درون آن آکورد است.`,
    faPractice: `**این را امتحان کن:** یک آکورد با شکل C را در پردهٔ اول، سوم و پنجم بنواز و هر بار پایه را نام ببر. بعد شکل E و شکل A را باره کن و بالا برو، در حالی که پایه را بلند می‌گویی.

- **مراقب باش:** شکل‌ها را بدون پایه‌شان حفظ کنی. شکل فقط وقتی آکورد است که بدانی کدام سیم نامش را می‌برد.
- **وقتی آماده‌ای که:** بتوانی یک آکورد را در پنج موقعیت CAGED بنوازی و پایه‌اش را بی‌درنگ پیدا کنی.
- **یک قدم جلوتر:** آهنگی دو‌آکوردی را فقط با شکل‌های باره بالای پردهٔ پنجم تنظیم کن، بعد کاپو بگذار و ترانسه کن.`,
  },
  {
    id: 'fingerstyle-neck-piano',
    idea: `Fingerstyle is independence: the thumb holds time and bass while the fingers carry melody and inner voices. Neck scales are patterns, not fixed boxes — the same scale appears in several positions with different fingerings. Piano accompaniment works the same way: bass, chord, melody, and pedal as three separate jobs.`,
    practice: `**Try this:** Play a thumb bass on beats 1 and 3 while one finger plays a melody on the offbeats. Then play a major scale in three neck positions and name the root of each.

- **Watch out:** Letting the thumb rush when the melody gets busy. The bass is the floor; it should not follow the hands.
- **You have it when:** You can keep a steady bass and a melody together for eight bars, and move one scale through three positions.
- **Going further:** Arrange a song with bass, chord, and melody on guitar, then play the same arrangement on piano.`,
    faIdea: `فینگراستایل یعنی استقلال: شست زمان و باس را نگه می‌دارد و انگشتان ملودی و صداهای میانی را می‌برند. گام‌های دسته الگو هستند، نه جعبه‌های ثابت — همان گام در چند موقعیت با انگشت‌گذاری متفاوت ظاهر می‌شود. همراهی پیانو هم همین‌طور کار می‌کند: باس، آکورد، ملودی و پدال سه وظیفهٔ جدا.`,
    faPractice: `**این را امتحان کن:** باس شست را روی ضرب ۱ و ۳ بنواز و هم‌زمان یک انگشت ملودی را روی ضدضرب‌ها بزن. بعد گام ماژور را در سه موقعیت دسته بنواز و پایهٔ هرکدام را نام ببر.

- **مراقب باش:** وقتی ملودی شلوغ می‌شود شست جلو بیفتد. باس کف اتاق است؛ نباید از دست‌ها پیروی کند.
- **وقتی آماده‌ای که:** بتوانی هشت میزان باس ثابت و ملودی را با هم نگه داری و یک گام را در سه موقعیت جابه‌جا کنی.
- **یک قدم جلوتر:** آهنگی را با باس، آکورد و ملودی روی گیتار تنظیم کن، بعد همان تنظیم را روی پیانو بنواز.`,
  },
  {
    id: 'chord-scale-blues-bebop',
    idea: `A chord-scale is the scale that fits a chord's function, not a rule that every note is equally welcome. Dorian fits minor sevenths, Mixolydian fits dominant sevenths, and the avoid note is the one that clashes with the chord's third. The blues scale is a pentatonic with a lowered fifth; bebop scales add chromatic passing tones to keep the line moving.`,
    practice: `**Try this:** Improvise two bars of Dorian over Dm7 and two of Mixolydian over G7, then resolve to Cmaj7. Play a twelve-bar blues and use only the blues scale for one chorus.

- **Watch out:** Running scales up and down instead of making phrases. A chord-scale is a vocabulary, not an étude.
- **You have it when:** You can choose a scale for each chord in a ii–V–I and make a four-bar line that lands on chord tones.
- **Going further:** Add one chromatic passing tone to each phrase and keep the line singable.`,
    faIdea: `آکورد-گام گامی است که با نقش آکورد می‌خواند، نه قاعده‌ای که همهٔ نُت‌ها را یکسان خوشامد می‌گوید. دورین با هفتِ کوچک، میکسولیدین با هفتِ غالب و نُتِ پرهیزی نُتی است که با سوم آکورد برخورد می‌کند. گام بلوز یک پنتاتونیک با پنجمِ پایین‌آمده است؛ گام‌های بی‌باپ نُت‌های گذرِ کروماتیک اضافه می‌کنند تا خط حرکت کند.`,
    faPractice: `**این را امتحان کن:** دو میزان دورین روی Dm7 و دو میزان میکسولیدین روی G7 بداهه بنواز، بعد به Cmaj7 حل کن. یک بلوز دوازده‌میزانی بنواز و یک کورس فقط با گام بلوز بمان.

- **مراقب باش:** گام را بالا و پایین بدوی، به‌جای ساختن عبارت. آکورد-گام واژگان است، نه اتود.
- **وقتی آماده‌ای که:** برای هر آکورد در ii–V–I گام انتخاب کنی و خطی چهارمیزانی بسازی که روی نُت‌های آکورد فرود بیاید.
- **یک قدم جلوتر:** به هر عبارت یک نُتِ گذرِ کروماتیک اضافه کن و خط را خواندنی نگه دار.`,
  },
  {
    id: 'voicings-improvisation',
    idea: `A voicing is a choice: which chord tones, in which order, in which register. Jazz comping often drops the root and keeps the guide tones — the third and seventh — because they define the chord and move smoothly. Improvisation grows from motifs and space, not from filling every beat.`,
    practice: `**Try this:** Comp a ii–V–I using only guide tones in the left hand. Then improvise four bars using a three-note motif, leaving at least one beat of silence per bar.

- **Watch out:** Playing too many notes. Density hides the harmony and gives the ear nothing to remember.
- **You have it when:** You can comp a progression with guide tones and improvise a melody that clearly follows the changes.
- **Going further:** Trade four-bar phrases with a recording, answering rather than copying.`,
    faIdea: `چیدمان یک انتخاب است: کدام نُت‌های آکورد، به چه ترتیب و در کدام ثبت. همراهی جَز اغلب پایه را حذف می‌کند و نُت‌های راهنما — سوم و هفتم — را نگه می‌دارد، چون آکورد را تعریف می‌کنند و نرم حرکت می‌کنند. بداهه از موتیو و فضای خالی رشد می‌کند، نه از پرکردن هر ضرب.`,
    faPractice: `**این را امتحان کن:** یک ii–V–I را فقط با نُت‌های راهنما در دست چپ همراهی کن. بعد چهار میزان با یک موتیوِ سه‌نُتی بداهه بنواز و در هر میزان دست‌کم یک ضرب سکوت بگذار.

- **مراقب باش:** نُت زیاد بزنی. تراکم هارمونی را پنهان می‌کند و چیزی برای به‌یادسپردن به گوش نمی‌دهد.
- **وقتی آماده‌ای که:** بتوانی پیشروی را با نُت‌های راهنما همراهی کنی و ملودی‌ای بداهه بسازی که تغییرات را روشن دنبال کند.
- **یک قدم جلوتر:** با یک ضبط چهارمیزانی رد و بدل کن؛ پاسخ بده، نه کپی.`,
  },
  {
    id: 'sight-singing',
    idea: `Sight singing is hearing with the inner ear before the voice arrives. Movable do anchors every key to the same syllables, so scale degrees keep their names; fixed do keeps absolute pitch names. Use solfège as a tool for relationships, not as a test of perfect pitch.`,
    practice: `**Try this:** Sing a major scale on movable-do syllables, then a simple stepwise melody without the instrument. Check only after you finish the phrase.

- **Watch out:** Sliding to the pitch instead of hearing it first. The slide hides whether you actually knew the note.
- **You have it when:** You can sing a diatonic phrase at sight with correct scale degrees, even if the tone is not beautiful.
- **Going further:** Sing the bass line of a four-part passage while the upper voices play.`,
    faIdea: `سایت‌سینگینگ یعنی پیش از رسیدن صدا، با گوش درونی شنیدن. «دو»ی متحرک هر گام را به همان هجاها وصل می‌کند تا درجه‌های گام نام خودشان را نگه دارند؛ «دو»ی ثابت نام‌های مطلق را حفظ می‌کند. سلفژ را ابزار رابطه بدان، نه آزمون گوش مطلق.`,
    faPractice: `**این را امتحان کن:** گام ماژور را با هجاهای «دو»ی متحرک بخوان، بعد یک ملودی سادهٔ پله‌ای را بدون ساز. فقط بعد از تمام‌شدن عبارت بررسی کن.

- **مراقب باش:** به‌جای شنیدنِ نُت، به آن سُر بخوری. سُر خوردن پنهان می‌کند که آیا نُت را می‌دانستی یا نه.
- **وقتی آماده‌ای که:** یک عبارت دیاتونیک را در نگاه اول با درجه‌های درست بخوانی، حتی اگر صدا زیبا نباشد.
- **یک قدم جلوتر:** خط باس یک گذر چهارصدایی را بخوان در حالی که صداهای بالا نواخته می‌شوند.`,
  },
  {
    id: 'harmonic-dictation-error',
    idea: `Harmonic dictation is layered listening: bass first, soprano second, inner voices last. Error detection is faster than full transcription because you compare what you expected with what you heard. A schema — cadence, sequence, circle of fifths — gives you something to expect.`,
    practice: `**Try this:** Listen to a four-part cadence and hum the bass. Then listen again and mark the one note that does not belong. Explain what it should have been.

- **Watch out:** Trying to identify every chord from scratch. Use the cadence schema and check the likely chords first.
- **You have it when:** You can spot a wrong inner voice in a familiar progression within two hearings.
- **Going further:** Notate the outer voices of a short chorale phrase and check them against the score.`,
    faIdea: `دیکتهٔ هارمونیک شنیدنِ لایه‌ای است: اول باس، بعد سوپرانو و آخر صداهای میانی. خطایابی از رونویسی کامل سریع‌تر است، چون آنچه انتظار داشتی را با آنچه شنیدی مقایسه می‌کنی. طرح‌واره — کادانس، سکانس، دایرهٔ پنجم‌ها — چیزی برای انتظار به تو می‌دهد.`,
    faPractice: `**این را امتحان کن:** به یک کادانس چهارصدایی گوش بده و باس را زمزمه کن. بعد دوباره گوش بده و تنها نُتی را که جا ندارد علامت بزن. توضیح بده باید چه می‌بود.

- **مراقب باش:** بخواهی هر آکورد را از صفر تشخیص بدهی. از طرح‌وارهٔ کادانس استفاده کن و اول آکوردهای محتمل را بررسی کن.
- **وقتی آماده‌ای که:** در یک پیشروی آشنا، صدای میانیِ غلط را بعد از دو بار شنیدن پیدا کنی.
- **یک قدم جلوتر:** صداهای بیرونی یک عبارت کورال کوتاه را بنویس و با پارتیتور مقایسه کن.`,
  },
  {
    id: 'transcription-inner-hearing',
    idea: `Transcription is a workflow, not a talent: loop a short passage, sing the bass, then the melody, then the harmony. Inner hearing means audiating the next note before you play or write it. Slow playback is a tool, not cheating — it lets the ear catch up with the music.`,
    practice: `**Try this:** Transcribe four bars of a song you like. Sing the bass line first, then the melody, and only then write the chords. Play your transcription against the recording.

- **Watch out:** Writing notes without singing them. The hand can guess; the ear cannot be fooled.
- **You have it when:** You can transcribe a four-bar phrase with bass, melody, and two or three chords, then perform it.
- **Going further:** Transcribe a full chorus by memory, then check only the tricky bars against the recording.`,
    faIdea: `رونویسی یک روند است، نه استعداد: یک گذر کوتاه را حلقه کن، باس را بخوان، بعد ملودی و بعد هارمونی. گوش درونی یعنی نُت بعدی را پیش از نواختن یا نوشتن در ذهن بشنوی. پخش کند ابزار است، نه تقلب — به گوش فرصت می‌دهد به موسیقی برسد.`,
    faPractice: `**این را امتحان کن:** چهار میزان از آهنگی که دوست داری را رونویسی کن. اول خط باس را بخوان، بعد ملودی و تنها بعد آکوردها را بنویس. رونویسی‌ات را همراه با ضبط بنواز.

- **مراقب باش:** بدون خواندن، نُت بنویسی. دست می‌تواند حدس بزند؛ گوش را نمی‌توان فریب داد.
- **وقتی آماده‌ای که:** عبارتی چهارمیزانی را با باس، ملودی و دو یا سه آکورد رونویسی کنی و بعد اجرا کنی.
- **یک قدم جلوتر:** یک کورس کامل را از حافظه رونویسی کن و فقط میزان‌های سخت را با ضبط بررسی کن.`,
  },
];
