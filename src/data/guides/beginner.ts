import type { GuideContent } from './types';

export const BEGINNER_GUIDES: GuideContent[] = [
  {
    id: 'order-of-sharps',
    idea: `The sharp order — F C G D A E B — is not a list to memorise. Each new sharp is a perfect fifth above the one before, so the order is the circle of fifths written in a line. The key name is one semitone above the last sharp. Learn the chain once and the signatures generate themselves.`,
    practice: `**Try this:** Write F C G D A E B from memory, then build the keys: one sharp is G, two is D, three is A. Play each scale and say the sharped note aloud as it appears.

- **Watch out:** Calling the last sharp the key. F♯ is the last sharp of G major, not the tonic.
- **You have it when:** You can name the major key from any number of sharps, and write the sharps in order, in under a minute.
- **Going further:** Derive the flat order by reversing the chain. Explain why the two orders mirror each other.`,
    faIdea: `ترتیب دی‌ها — F C G D A E B — فهرستی برای حفظ‌کردن نیست. هر دیِ تازه یک پنجمِ کامل بالاتر از قبلی است، پس این ترتیب همان دایرهٔ پنجم‌هاست که در یک خط نوشته شده. نام گام یک نیم‌پرده بالاتر از آخرین دی است. زنجیره را یک‌بار یاد بگیر و امضاها خودشان ساخته می‌شوند.`,
    faPractice: `**این را امتحان کن:** F C G D A E B را از حافظه بنویس، بعد گام‌ها را بساز: یک دی G است، دو دی D و سه دی A. هر گام را بنواز و نُتِ دی‌دار را هم‌زمان بلند بگو.

- **مراقب باش:** آخرین دی را تُنیک گام بپنداری. F♯ آخرین دیِ گام G است، نه پایهٔ آن.
- **وقتی آماده‌ای که:** بتوانی از هر تعداد دی، گام ماژور را نام ببری و ترتیب دی‌ها را در کمتر از یک دقیقه بنویسی.
- **یک قدم جلوتر:** ترتیب بمل‌ها را با وارونه‌کردن زنجیره به دست بیاور و توضیح بده چرا این دو ترتیب آینهٔ هم‌اند.`,
  },
  {
    id: 'order-of-flats',
    idea: `Flats are the mirror image of sharps: B E A D G C F, a chain of perfect fourths. The key is named by the second-to-last flat — except F major, which has only one. If you know the sharp side, you already know the flat side; you are reading the same circle backwards.`,
    practice: `**Try this:** Build F, B♭, E♭, and A♭ major from the flat order. Play each scale and stop on the flat of the moment. Then cover the page and name the key from one, three, and five flats.

- **Watch out:** Counting from the first flat instead of the second-to-last. B♭ alone is F major; B♭ and E♭ together are B♭ major.
- **You have it when:** You can move between a key name and its flats in both directions without reciting the whole list.
- **Going further:** Find the enharmonic pairs (B/C♭, F♯/G♭) and explain why composers choose one side of the circle.`,
    faIdea: `بمل‌ها تصویر آینه‌ای دی‌ها هستند: B E A D G C F، زنجیره‌ای از چهارم‌های کامل. نام گام با یک‌بمل‌مانده به آخر مشخص می‌شود — جز F ماژور که فقط یک بمل دارد. اگر سمت دی‌ها را بدانی، سمت بمل‌ها را هم می‌دانی؛ همان دایره را برعکس می‌خوانی.`,
    faPractice: `**این را امتحان کن:** از ترتیب بمل‌ها، گام‌های F، B♭، E♭ و A♭ را بساز. هر گام را بنواز و روی بملِ همان لحظه توقف کن. بعد صفحه را بپوشان و از یک، سه و پنج بمل، گام را نام ببر.

- **مراقب باش:** از اولین بمل بشماری، نه از یک‌بمل‌مانده به آخر. B♭ تنها گام F است؛ B♭ و E♭ با هم گام B♭.
- **وقتی آماده‌ای که:** بتوانی دوطرفه بین نام گام و بمل‌هایش جابه‌جا شوی، بدون خواندن کل فهرست.
- **یک قدم جلوتر:** جفت‌های انهارمونیک (B/C♭، F♯/G♭) را پیدا کن و بگو چرا آهنگساز یک سمت دایره را انتخاب می‌کند.`,
  },
  {
    id: 'circle-of-fifths',
    idea: `The circle of fifths is a map of relationships, not a poster to memorise. Each step clockwise adds one sharp or removes one flat; neighbours share six of their seven notes. That is why the circle predicts which keys transpose easily, which chords sit together, and where a modulation will feel close.`,
    practice: `**Try this:** Draw the circle from memory, then play a I–IV–V–I progression in C and in G. Notice that only F becomes F♯. Move one step around the circle and transpose the same progression.

- **Watch out:** Learning the diagram without hearing the distance. A fifth should sound like a step, not like a fact on paper.
- **You have it when:** You can find the relative minor, the dominant, and the two neighbouring keys of any key without counting from C.
- **Going further:** Map a ii–V–I in three keys a fifth apart and listen to how little the notes change.`,
    faIdea: `دایرهٔ پنجم‌ها نقشهٔ رابطه‌هاست، نه پوستری برای حفظ‌کردن. هر قدم در جهت عقربه‌های ساعت یک دی اضافه می‌کند یا یک بمل برمی‌دارد؛ همسایه‌ها شش نُت از هفت نُت را مشترک دارند. به همین دلیل دایره پیش‌بینی می‌کند کدام گام‌ها راحت ترانسه می‌شوند، کدام آکوردها کنار هم می‌نشینند و کدام مُدگردی نزدیک حس می‌شود.`,
    faPractice: `**این را امتحان کن:** دایره را از حافظه بکش، بعد پیشروی I–IV–V–I را در C و در G بنواز. ببین فقط F به F♯ تبدیل می‌شود. یک قدم روی دایره جابه‌جا شو و همان پیشروی را ترانسه کن.

- **مراقب باش:** نمودار را بدون شنیدن فاصله یاد بگیری. پنجم باید مثل یک قدم شنیده شود، نه مثل یک واقعیت روی کاغذ.
- **وقتی آماده‌ای که:** بتوانی مینورِ نسبی، دومینانت و دو گام همسایهٔ هر گام را بدون شمردن از C پیدا کنی.
- **یک قدم جلوتر:** ii–V–I را در سه گام که فاصلهٔ پنجم دارند بنویس و بشنو چقدر نُت‌ها کم عوض می‌شوند.`,
  },
  {
    id: 'relative-keys-reading',
    idea: `A key signature tells you two keys, not one: a major key and its relative minor, whose tonic sits a minor third below. Read the signature first, then look for the tonic and the leading tone to decide which one the music is actually in. The signature narrows the field; the notes finish the job.`,
    practice: `**Try this:** Given three signatures, name both keys, play the major scale, then the relative minor scale from the sixth degree. End each on its tonic and listen to how the same notes change home.

- **Watch out:** Assuming the first or last note is the key. A piece can begin on the dominant or on the relative minor.
- **You have it when:** You can identify the key of a short excerpt from its final chord, its accidentals, and its melodic centre — not from the signature alone.
- **Going further:** Take a piece you know and rewrite its first phrase in the relative key. Notice which chords change function.`,
    faIdea: `امضای گام دو گام را نشان می‌دهد، نه یکی: یک گام ماژور و مینورِ نسبی‌اش که تُنیکش یک سومِ کوچک پایین‌تر است. اول امضا را بخوان، بعد تُنیک و نُتِ راهنما را بجوی تا بفهمی موسیقی واقعاً در کدام گام است. امضا میدان را تنگ می‌کند؛ نُت‌ها کار را تمام می‌کنند.`,
    faPractice: `**این را امتحان کن:** با سه امضای گام، هر دو گام را نام ببر، گام ماژور را بنواز و بعد مینورِ نسبی را از درجهٔ ششم شروع کن. هرکدام را روی تُنیک خودش تمام کن و بشنو چگونه همان نُت‌ها خانهٔ دیگری پیدا می‌کنند.

- **مراقب باش:** فرض کنی اولین یا آخرین نُت، گام است. یک قطعه می‌تواند روی دومینانت یا مینورِ نسبی شروع شود.
- **وقتی آماده‌ای که:** گام یک قطعهٔ کوتاه را از آکورد پایانی، عرضی‌ها و مرکز ملودیک تشخیص بدهی، نه فقط از امضا.
- **یک قدم جلوتر:** قطعه‌ای آشنا را بردار و عبارت اولش را در گام نسبی بازنویسی کن. ببین کدام آکوردها نقش عوض می‌کنند.`,
  },
  {
    id: 'major-minor-triads',
    idea: `A triad is three notes stacked in thirds: root, third, fifth. The third decides the quality; the fifth only frames it. Major and minor differ by a single semitone in that third, which is why one finger can change the entire mood. Learn the shape as an interval recipe, not as a picture on a keyboard.`,
    practice: `**Try this:** Play C major, then lower E to E♭ and hold everything else. Sing root–third–fifth for each. Build the same two shapes from F, G, and B♭, and check the third by ear before checking the keys.

- **Watch out:** Counting semitones without spelling the letters. C–E♭–G is minor; C–D♯–G is not the same written chord, even if it sounds alike.
- **You have it when:** You can build a major or minor triad from any root and name the third and fifth without an instrument.
- **Going further:** Build triads whose roots are black keys and notice when the spelling needs double sharps or flats.`,
    faIdea: `آکورد سه‌صدایی سه نُت است که با فاصلهٔ سوم روی هم چیده شده‌اند: پایه، سوم و پنجم. سوم کیفیت را تعیین می‌کند و پنجم فقط قاب آن است. ماژور و مینور فقط یک نیم‌پرده در همان سوم تفاوت دارند؛ به همین دلیل یک انگشت می‌تواند کل حال‌وهوا را عوض کند. شکل را دستورِ فاصله‌ها بدان، نه تصویری روی کیبورد.`,
    faPractice: `**این را امتحان کن:** C ماژور را بنواز، بعد E را به E♭ پایین بیاور و بقیه را نگه دار. برای هرکدام پایه–سوم–پنجم را بخوان. همان دو شکل را از F، G و B♭ بساز و سوم را اول با گوش بررسی کن، بعد با کلیدها.

- **مراقب باش:** نیم‌پرده را بدون نوشتن حروف بشماری. C–E♭–G مینور است؛ C–D♯–G آکورد نوشتاری یکسانی نیست، هرچند شبیه صدا می‌دهد.
- **وقتی آماده‌ای که:** بتوانی از هر پایه‌ای آکورد ماژور یا مینور بسازی و سوم و پنجم را بدون ساز نام ببری.
- **یک قدم جلوتر:** آکوردهایی بساز که پایه‌شان کلید سیاه است و ببین کجا املا به دیِ دوبل یا بملِ دوبل نیاز دارد.`,
  },
  {
    id: 'diminished-augmented',
    idea: `Diminished and augmented triads are built from equal thirds: two minor thirds stacked, or two major thirds. That symmetry gives them no stable home, which is exactly why they are useful. They behave like tension machines — passing, pivoting, or pushing toward a resolution — rather than resting points.`,
    practice: `**Try this:** Build C diminished (C–E♭–G♭) and C augmented (C–E–G♯). Play each, then resolve the diminished chord to D♭ major and the augmented chord to F major. Listen for which note moves.

- **Watch out:** Judging quality by mood alone. A diminished chord can sound "sad" in one context and "urgent" in another; the intervals are the fact.
- **You have it when:** You can build both qualities from any root and explain which note creates the instability.
- **Going further:** Find a diminished seventh or augmented triad in a piece you know and describe what it is doing.`,
    faIdea: `آکورد کاسته و افزوده از سوم‌های مساوی ساخته می‌شوند: دو سومِ کوچک روی هم، یا دو سومِ بزرگ. همین تقارن خانهٔ پایداری برایشان باقی نمی‌گذارد و دقیقاً به همین دلیل سودمندند. مثل ماشینِ تنش‌اند — گذر، محور یا فشار به سوی حل — نه نقطهٔ آرامش.`,
    faPractice: `**این را امتحان کن:** C کاسته (C–E♭–G♭) و C افزوده (C–E–G♯) را بساز. هرکدام را بنواز، بعد کاسته را به D♭ ماژور و افزوده را به F ماژور حل کن. گوش کن کدام نُت حرکت می‌کند.

- **مراقب باش:** کیفیت را فقط از حال‌وهوا قضاوت کنی. آکورد کاسته در یک زمینه «غمگین» و در زمینه‌ای دیگر «فوری» به گوش می‌رسد؛ فاصله‌ها واقعیت‌اند.
- **وقتی آماده‌ای که:** بتوانی هر دو کیفیت را از هر پایه بسازی و بگویی کدام نُت ناپایداری را می‌سازد.
- **یک قدم جلوتر:** در قطعه‌ای آشنا یک آکورد کاستهٔ هفت یا افزوده پیدا کن و بگو چه کاری انجام می‌دهد.`,
  },
  {
    id: 'chord-inversions',
    idea: `An inversion is not a different chord; it is the same triad with a different note in the bass. Root position puts the root at the bottom, first inversion the third, second inversion the fifth. The notes stay, the centre of gravity moves — which is why inversions are the cheapest way to make a bass line sing.`,
    practice: `**Try this:** Play C major in root position, first inversion, and second inversion. Sing the bass note each time. Then connect C–F–G using the inversion that keeps the bass moving by step.

- **Watch out:** Confusing inversion with voicing. Inversion is about the bass note; spreading the upper notes differently does not change it.
- **You have it when:** You can hear which chord tone is in the bass and choose an inversion to smooth a progression.
- **Going further:** Harmonize a descending bass line using only inversions of I, IV, and V.`,
    faIdea: `وارونگی آکوردِ متفاوت نیست؛ همان سه‌صدایی است با نُتِ دیگری در باس. حالت پایه پایه را در باس می‌گذارد، وارونگی اول سوم را و وارونگی دوم پنجم را. نُت‌ها می‌مانند و مرکز ثقل جابه‌جا می‌شود؛ به همین دلیل وارونگی ارزان‌ترین راه برای خواندنِ خط باس است.`,
    faPractice: `**این را امتحان کن:** C ماژور را در حالت پایه، وارونگی اول و وارونگی دوم بنواز. هر بار نُت باس را بخوان. بعد C–F–G را با وارونگی‌ای وصل کن که باس را پله‌ای حرکت دهد.

- **مراقب باش:** وارونگی را با چیدمان اشتباه بگیری. وارونگی مربوط به نُت باس است؛ پخش‌کردن متفاوت نُت‌های بالا آن را عوض نمی‌کند.
- **وقتی آماده‌ای که:** بتوانی بشنوی کدام نُت آکورد در باس است و وارونگی‌ای انتخاب کنی که پیشروی را نرم کند.
- **یک قدم جلوتر:** یک خط باس نزولی را فقط با وارونگی‌های I، IV و V هارمونیزه کن.`,
  },
  {
    id: 'diatonic-chords',
    idea: `Harmonize a scale by stacking thirds on each degree and a pattern appears: major, minor, minor, major, major, minor, diminished. Those seven chords are the key's family. I, IV, and V carry the main weight; ii, iii, and vi colour the journey; vii° points home.`,
    practice: `**Try this:** Build all seven triads in C and label them with Roman numerals. Play I–IV–V–I, then I–vi–IV–V, and name the function of each chord before you play it.

- **Watch out:** Treating every chord as equally stable. The quality pattern is fixed, but the job each chord does depends on context.
- **You have it when:** You can build the seven diatonic triads in any major key and predict their qualities without checking.
- **Going further:** Do the same in a minor key and notice which chord needs a raised leading tone.`,
    faIdea: `گام را با چیدن سوم‌ها روی هر درجه هارمونیزه کن و الگویی ظاهر می‌شود: ماژور، مینور، مینور، ماژور، ماژور، مینور، کاسته. این هفت آکورد خانوادهٔ گام‌اند. I، IV و V وزن اصلی را می‌برند؛ ii، iii و vi سفر را رنگ می‌کنند و vii° به خانه اشاره می‌کند.`,
    faPractice: `**این را امتحان کن:** هر هفت آکورد را در C بساز و با اعداد رومی برچسب بزن. I–IV–V–I و بعد I–vi–IV–V را بنواز و پیش از نواختن، نقش هر آکورد را بگو.

- **مراقب باش:** همهٔ آکوردها را به یک اندازه پایدار بدانی. الگوی کیفیت ثابت است، اما کارِ هر آکورد به زمینه بستگی دارد.
- **وقتی آماده‌ای که:** بتوانی هفت آکورد دیاتونیک را در هر گام ماژور بسازی و کیفیتشان را بدون نگاه پیش‌بینی کنی.
- **یک قدم جلوتر:** همین کار را در گام مینور انجام بده و ببین کدام آکورد به نُتِ راهنمای بالا‌برده نیاز دارد.`,
  },
  {
    id: 'natural-minor',
    idea: `The natural minor scale is the major scale with a different home, not a different set of notes. Start on the sixth degree and the same seven pitches reorganize around a new tonic; the third, sixth, and seventh are lower than in major. Think "same neighbourhood, different house" and the signature stops being a mystery.`,
    practice: `**Try this:** Play C major, then A natural minor with the same white keys. Sing the tonic A, then the minor third C, and hold the pair. Do the same from D minor and E minor.

- **Watch out:** Treating minor as "sad major". The notes are the same; the centre and the third are what changed.
- **You have it when:** You can find the relative minor of any major key and hear where the tonic settles.
- **Going further:** Compare A natural minor with A major (the parallel minor) and list which three notes moved.`,
    faIdea: `گام مینورِ طبیعی همان گام ماژور است با خانه‌ای دیگر، نه مجموعه‌ای دیگر از نُت‌ها. از درجهٔ ششم شروع کن و همان هفت زیروبمی حول تُنیک تازه بازآرایی می‌شوند؛ سوم، ششم و هفتم از ماژور پایین‌ترند. «همان محله، خانهٔ دیگر» را در ذهن نگه دار تا امضا دیگر معما نباشد.`,
    faPractice: `**این را امتحان کن:** C ماژور را بنواز، بعد A مینورِ طبیعی را با همان کلیدهای سفید. تُنیک A را بخوان، بعد سومِ کوچک C را و جفت را نگه دار. همین کار را از D مینور و E مینور تکرار کن.

- **مراقب باش:** مینور را «ماژورِ غمگین» بدانی. نُت‌ها همان‌اند؛ مرکز و سوم عوض شده‌اند.
- **وقتی آماده‌ای که:** بتوانی مینورِ نسبی هر گام ماژور را پیدا کنی و بشنوی تُنیک کجا می‌نشیند.
- **یک قدم جلوتر:** A مینورِ طبیعی را با A ماژور (مینورِ موازی) مقایسه کن و بگو کدام سه نُت جابه‌جا شده‌اند.`,
  },
  {
    id: 'harmonic-melodic-minor',
    idea: `Natural minor has no leading tone, so its V chord is weak. Harmonic minor raises the seventh to create that pull; melodic minor raises the sixth as well when climbing, then returns to natural minor when descending. Each form solves a specific voice-leading problem — they are tools, not three competing scales.`,
    practice: `**Try this:** Play A harmonic minor and stop on G♯, then resolve to A. Play melodic minor up (F♯–G♯–A) and down (G–F–E). Hear the augmented second in harmonic minor and notice how melodic minor avoids it.

- **Watch out:** Mixing the forms randomly. Choose the form for the harmony or the line, not by habit.
- **You have it when:** You can explain why V in minor usually takes a raised seventh and sing the three forms from one tonic.
- **Going further:** Find a minor-key piece where the sixth and seventh change within the same phrase and explain why.`,
    faIdea: `مینورِ طبیعی نُتِ راهنما ندارد، پس آکورد V آن ضعیف است. مینورِ هارمونیک هفتم را بالا می‌برد تا آن کشش ساخته شود؛ مینورِ ملودیک هنگام بالا رفتن ششم را هم بالا می‌برد و هنگام پایین آمدن به مینورِ طبیعی برمی‌گردد. هر شکل مسئلهٔ خاصی از حرکت صداها را حل می‌کند — سه گام رقیب نیستند، ابزارند.`,
    faPractice: `**این را امتحان کن:** A مینورِ هارمونیک را بنواز و روی G♯ توقف کن، بعد به A حل کن. مینورِ ملودیک را بالا (F♯–G♯–A) و پایین (G–F–E) بنواز. دومِ افزوده را در هارمونیک بشنو و ببین ملودیک چطور از آن دوری می‌کند.

- **مراقب باش:** شکل‌ها را تصادفی قاطی کنی. شکل را بر اساس هارمونی یا خط انتخاب کن، نه بر اساس عادت.
- **وقتی آماده‌ای که:** بتوانی توضیح بدهی چرا V در مینور معمولاً هفتمِ بالا‌برده می‌گیرد و هر سه شکل را از یک تُنیک بخوانی.
- **یک قدم جلوتر:** قطعه‌ای مینور پیدا کن که ششم و هفتم در همان عبارت عوض می‌شوند و دلیلش را بگو.`,
  },
  {
    id: 'minor-progressions',
    idea: `Minor keys have their own pillars: i, iv, and V (with a raised leading tone), plus VI and VII as modal colours. A progression can behave functionally — i–iv–V–i — or loop modally — i–VI–III–VII. The same key can sound tragic, folk-like, or driving depending on which pillars you choose.`,
    practice: `**Try this:** Play i–iv–V–i in A minor, then i–VI–III–VII. Name each chord's function before playing. Then replace V with v and hear how the pull disappears.

- **Watch out:** Using a minor v when the phrase needs a cadence. The raised leading tone is what makes the arrival feel final.
- **You have it when:** You can build both a functional and a modal loop in any minor key and describe the difference by ear.
- **Going further:** Reharmonize a major progression in its parallel minor and keep the melody unchanged.`,
    faIdea: `گام‌های مینور ستون‌های خودشان را دارند: i، iv و V (با نُتِ راهنمای بالا‌برده)، به‌علاوهٔ VI و VII به‌عنوان رنگ‌های مُدال. یک پیشروی می‌تواند کارکردی رفتار کند — i–iv–V–i — یا مُدال بچرخد — i–VI–III–VII. همان گام بسته به انتخاب ستون‌ها می‌تواند غمگین، فولکلور یا پرحرکت به گوش برسد.`,
    faPractice: `**این را امتحان کن:** در A مینور i–iv–V–i و بعد i–VI–III–VII را بنواز. پیش از نواختن نقش هر آکورد را بگو. بعد V را با v عوض کن و بشنو کشش چگونه محو می‌شود.

- **مراقب باش:** جایی که عبارت به کادانس نیاز دارد، از v مینور استفاده کنی. نُتِ راهنمای بالا‌برده همان چیزی است که رسیدن را قطعی می‌کند.
- **وقتی آماده‌ای که:** بتوانی در هر گام مینور هم یک چرخهٔ کارکردی و هم یک چرخهٔ مُدال بسازی و تفاوتشان را با گوش توصیف کنی.
- **یک قدم جلوتر:** یک پیشروی ماژور را در مینورِ موازی‌اش بازهارمونیزه کن و ملودی را دست‌نخورده نگه دار.`,
  },
  {
    id: 'grand-staff-reading',
    idea: `The grand staff is one map with two clefs, not two separate puzzles. Middle C bridges the staves; treble grows upward from it and bass downward. Fluent reading means taking in chunks — a beat, a chord, a contour — and letting the eyes move ahead of the hands.`,
    practice: `**Try this:** Read a four-bar exercise in one-beat chunks. Keep your eyes one beat ahead of your hands and refuse to stop for a wrong note; mark it and continue. Repeat at half speed.

- **Watch out:** Reading note by note and stopping at each one. That trains decoding, not reading.
- **You have it when:** You can sight-read a simple grand-staff passage at a steady pulse, even with one wrong note.
- **Going further:** Read a hymn or chorale and follow the alto and tenor lines as well as the outer voices.`,
    faIdea: `خط حامل بزرگ یک نقشه با دو کلید است، نه دو معما‌ی جدا. «دو وسط» دو خط حامل را به هم پل می‌زند؛ کلید سل از آن بالا می‌رود و کلید فا پایین. خواندنِ روان یعنی برداشتنِ تکه‌تکه — یک ضرب، یک آکورد، یک خط — و گذاشتنِ چشم جلوتر از دست.`,
    faPractice: `**این را امتحان کن:** یک تمرین چهارمیزانی را ضرب‌به‌ضرب بخوان. چشم یک ضرب جلوتر از دست باشد و برای نُتِ غلط توقف نکن؛ علامتش بزن و ادامه بده. با نصف سرعت تکرار کن.

- **مراقب باش:** نُت‌به‌نُت بخوانی و روی هر نُت توقف کنی. این رمزگشایی را تمرین می‌دهد، نه خواندن را.
- **وقتی آماده‌ای که:** بتوانی قطعه‌ای ساده در خط حامل بزرگ را با ضرب ثابت در نگاه اول بخوانی، حتی با یک نُتِ غلط.
- **یک قدم جلوتر:** یک سرود یا کورال بخوان و خط آلتو و تنور را هم دنبال کن، نه فقط صدای بالا و باس.`,
  },
  {
    id: 'alto-tenor-clefs',
    idea: `The C clef is a movable sign: it points at middle C. Put it on the third line and you have alto clef; on the fourth line, tenor clef. The lines do not change meaning — the clef moves the address. Read outward from C by line and space instead of importing a treble-clef poem.`,
    practice: `**Try this:** Find C4 in alto and tenor clefs, then read a five-note stepwise line upward and downward from it. Play the notes on the piano while saying the letter names.

- **Watch out:** Reusing treble mnemonics. The same line has a different letter when the clef moves.
- **You have it when:** You can find C4 in both clefs instantly and read a short viola or bassoon line without translating.
- **Going further:** Read a viola part in alto clef and a cello passage in tenor clef, and compare the register.`,
    faIdea: `کلید C نشانه‌ای متحرک است: به «دو وسط» اشاره می‌کند. آن را روی خط سوم بگذاری، کلید آلتو داری؛ روی خط چهارم، کلید تنور. خط‌ها معنی‌شان را عوض نمی‌کنند — کلید نشانی را جابه‌جا می‌کند. از C به بیرون، خط‌به‌خط و فضا‌به‌فضا بخوان، نه با شعر کلید سل.`,
    faPractice: `**این را امتحان کن:** C4 را در کلید آلتو و تنور پیدا کن، بعد یک خط پنج‌نُتیِ پله‌ای را از آن بالا و پایین بخوان. نُت‌ها را روی پیانو بنواز و نام حروف را بگو.

- **مراقب باش:** از یادآورهای کلید سل دوباره استفاده کنی. با جابه‌جا شدن کلید، همان خط حرف دیگری دارد.
- **وقتی آماده‌ای که:** C4 را در هر دو کلید بی‌درنگ پیدا کنی و یک خط کوتاه ویولا یا فاگوت را بدون ترجمه بخوانی.
- **یک قدم جلوتر:** یک بخش ویولا در کلید آلتو و یک گذر ویلنسل در کلید تنور بخوان و ثبت‌ها را مقایسه کن.`,
  },
  {
    id: 'expression-marks',
    idea: `Notation underdetermines performance: dynamics, articulation, and tempo tell you how much energy to give, not just how loud to be. Italian terms are physical instructions in disguise — *dolce* is weight, *marcato* is attack, *ritardando* is widening. Read them as gestures, not as decorations.`,
    practice: `**Try this:** Play one phrase four ways: legato, staccato, crescendo, and diminuendo. Record yourself and compare. Then play it again keeping the pitch and rhythm identical.

- **Watch out:** Adding expression only after the notes are learned. The marking changes how you practise the phrase from day one.
- **You have it when:** A listener can name the marking you intended without seeing the score.
- **Going further:** Take an unmarked melody and add dynamics, articulation, and one tempo change that tell a story.`,
    faIdea: `نت‌نویسی اجرا را کامل تعیین نمی‌کند: دینامیک، جمله‌بندی و تمپو می‌گویند چقدر انرژی بدهی، نه فقط چقدر بلند باشی. اصطلاحات ایتالیایی دستورهای فیزیکی‌اند در لباس واژه — *dolce* وزن است، *marcato* حمله است و *ritardando* باز شدن. آن‌ها را مثل حرکت بدن بخوان، نه مثل تزیین.`,
    faPractice: `**این را امتحان کن:** یک عبارت را چهار شکل بنواز: وصل، جدا، اوج‌گیرنده و کاهنده. صدای خودت را ضبط و مقایسه کن. بعد همان را با زیروبمی و ریتمِ یکسان دوباره بنواز.

- **مراقب باش:** بیان را فقط بعد از یادگیری نُت‌ها اضافه کنی. علامت از روز اول تمرین، شکل کار را عوض می‌کند.
- **وقتی آماده‌ای که:** شنونده بدون دیدن نت بتواند نام علامتی را که قصد کرده‌ای بگوید.
- **یک قدم جلوتر:** یک ملودی بی‌علامت بردار و دینامیک، جمله‌بندی و یک تغییر تمپو اضافه کن که داستانی بگوید.`,
  },
  {
    id: 'ornaments',
    idea: `Ornaments are not extra notes sprinkled on top; they are a stylistic vocabulary that decorates a principal note. Most begin on or near the beat and take time from the note they decorate. The same sign can mean different things in Baroque, Classical, and Romantic music, so style decides the execution.`,
    practice: `**Try this:** Play a trill, a mordent, and an appoggiatura slowly, then in tempo. Count the main note as the beat and let the ornament borrow from it rather than arrive early.

- **Watch out:** Starting a trill before the beat. That shifts the rhythm and makes the ornament sound like a mistake.
- **You have it when:** You can execute the standard ornaments in time and explain which note they decorate.
- **Going further:** Ornament the same repeated phrase two different ways, as a performer would in a da capo repeat.`,
    faIdea: `تزیین‌ها نُت‌های اضافه‌ای نیستند که روی موسیقی پاشیده شوند؛ واژگانی سبکی‌اند که نُتِ اصلی را می‌آرایند. بیشترشان روی ضرب یا نزدیک آن شروع می‌شوند و زمانشان را از همان نُتی می‌گیرند که تزیین می‌کنند. یک نشانه در باروک، کلاسیک و رمانتیک می‌تواند معانی متفاوت داشته باشد؛ سبک، اجرا را تعیین می‌کند.`,
    faPractice: `**این را امتحان کن:** یک تریل، موردنت و آپوجاتورا را اول کند و بعد در تمپو بنواز. نُتِ اصلی را ضرب بشمار و بگذار تزیین از آن قرض بگیرد، نه اینکه زودتر برسد.

- **مراقب باش:** تریل را پیش از ضرب شروع کنی. این ریتم را جابه‌جا می‌کند و تزیین را مثل اشتباه به گوش می‌رساند.
- **وقتی آماده‌ای که:** بتوانی تزیین‌های استاندارد را در زمان اجرا کنی و بگویی کدام نُت را می‌آرایند.
- **یک قدم جلوتر:** همان عبارت تکراری را به دو شکل متفاوت تزیین کن، همان‌طور که نوازنده در تکرار دا کاپو می‌کند.`,
  },
  {
    id: 'repeats-tab-lead-sheets',
    idea: `A score is a map with a route, not only a list of notes. Repeat signs, first and second endings, D.C., D.S., and coda marks are control flow: they tell you where to go next. Tablature adds string-and-fret positions to pitch, while a lead sheet gives melody and chord symbols and leaves the voicing to you.`,
    practice: `**Try this:** Take a lead sheet and mark its form with letters before playing: A A B A, coda, repeat. Play the melody once, then comp the chords, then combine them.

- **Watch out:** Ignoring repeat signs and first/second endings until the run-through. Learn the route first; the notes are easier inside it.
- **You have it when:** You can follow a lead sheet through every repeat without losing your place, and read tab without confusing fret numbers with rhythm.
- **Going further:** Write a lead sheet for a song you know, with melody, chords, and a clear form map.`,
    faIdea: `نت یک نقشه با مسیر است، نه فقط فهرستی از نُت‌ها. نشانه‌های تکرار، پایان اول و دوم، دا کاپو، دال سگنو و کدا همان «جریان کنترل»‌اند: می‌گویند بعدش کجا بروی. تبلچر موقعیت سیم و پرده را به زیروبمی اضافه می‌کند و لید شیت ملودی و نمادهای آکورد را می‌دهد و چیدمان را به تو می‌سپارد.`,
    faPractice: `**این را امتحان کن:** یک لید شیت بردار و پیش از نواختن، فرمش را با حروف علامت بزن: A A B A، کدا، تکرار. ملودی را یک‌بار بنواز، بعد آکوردها را همراهی کن و سپس هر دو را با هم.

- **مراقب باش:** نشانه‌های تکرار و پایان اول و دوم را تا اجرای کامل نادیده بگیری. اول مسیر را یاد بگیر؛ نُت‌ها داخل مسیر آسان‌ترند.
- **وقتی آماده‌ای که:** لید شیت را با همهٔ تکرارها بدون گم‌کردن جا دنبال کنی و تبلچر را بدون اشتباه‌گرفتن شمارهٔ پرده با ریتم بخوانی.
- **یک قدم جلوتر:** برای آهنگی که می‌شناسی لید شیت بنویس، با ملودی، آکورد و نقشهٔ فرم روشن.`,
  },
  {
    id: 'transposition-score',
    idea: `A transposing instrument does not sound the note written for it. The written pitch is a convenience for the player's hands; concert pitch is what the audience hears. A B♭ instrument sounds a major second lower, an F horn a perfect fifth lower, an E♭ saxophone a major sixth lower. Score reading is interval translation, not magic.`,
    practice: `**Try this:** Write a C major scale for a B♭ clarinet, then play the written notes and sing the sounding pitches a major second lower. Do the same for F horn and E♭ alto sax.

- **Watch out:** Confusing written pitch with sounding pitch. The player reads one note and the room hears another.
- **You have it when:** You can transpose a short melody for the three common transpositions and explain which direction the sound moves.
- **Going further:** Read a short full score at concert pitch and mark which staves need translation.`,
    faIdea: `سازِ ترانسپوزکننده نُتی را که برایش نوشته شده، همان‌طور که نوشته شده به صدا درنمی‌آورد. زیروبمیِ نوشتاری برای راحتی دست نوازنده است؛ زیروبمیِ کنسرت چیزی است که شنونده می‌شنود. ساز B♭ یک دومِ بزرگ پایین‌تر، هورن F یک پنجمِ کامل پایین‌تر و ساکسوفون E♭ یک ششمِ بزرگ پایین‌تر صدا می‌دهد. خواندن پارتیتور ترجمهٔ فاصله است، نه جادو.`,
    faPractice: `**این را امتحان کن:** گام C ماژور را برای کلارینت B♭ بنویس، بعد نُت‌های نوشتاری را بنواز و زیروبمیِ واقعی را یک دومِ بزرگ پایین‌تر بخوان. همین کار را برای هورن F و ساکسوفون E♭ تکرار کن.

- **مراقب باش:** زیروبمیِ نوشتاری را با زیروبمیِ شنیداری اشتباه بگیری. نوازنده یک نُت می‌خواند و سالن نُت دیگری می‌شنود.
- **وقتی آماده‌ای که:** بتوانی یک ملودی کوتاه را برای سه ترانسپوزیشن رایج بنویسی و بگویی صدا به کدام جهت می‌رود.
- **یک قدم جلوتر:** یک پارتیتور کوتاه را در زیروبمیِ کنسرت بخوان و علامت بزن کدام خطوط ترجمه می‌خواهند.`,
  },
  {
    id: 'figured-bass',
    idea: `Figured bass is shorthand for intervals above the bass, not a chord chart. A 6 means a first-inversion triad, 6/4 a second inversion, 7 a seventh chord. Realizing it is improvisation under rules: you choose the spacing and motion while the figures constrain the harmony.`,
    practice: `**Try this:** Realize a short bass line with the figures 5/3, 6, and 6/4 at the keyboard. Keep the upper voices close and move them by step where possible.

- **Watch out:** Reading figures as chord symbols and forgetting the bass. The bass note is given; the figures tell you what to build above it.
- **You have it when:** You can realize a simple continuo line in real time and resolve the cadence without stopping.
- **Going further:** Add a seventh (7) and its preparation and resolution to the same bass line.`,
    faIdea: `باس فیگوردار خلاصه‌ای از فاصله‌های بالای باس است، نه جدول آکورد. عدد ۶ یعنی سه‌صداییِ وارونگی اول، ۶/۴ وارونگی دوم و ۷ آکورد هفت. اجرای آن بداهه‌نوازی زیر قواعد است: تو چیدمان و حرکت را انتخاب می‌کنی و اعداد هارمونی را محدود می‌کنند.`,
    faPractice: `**این را امتحان کن:** یک خط باس کوتاه با اعداد ۵/۳، ۶ و ۶/۴ را روی کیبورد اجرا کن. صدای بالا را نزدیک نگه دار و تا جای ممکن پله‌ای حرکت بده.

- **مراقب باش:** اعداد را مثل نماد آکورد بخوانی و باس را فراموش کنی. نُت باس داده شده؛ اعداد می‌گویند بالای آن چه بسازی.
- **وقتی آماده‌ای که:** بتوانی یک خط کنتینو ساده را در زمان واقعی اجرا کنی و کادانس را بدون توقف حل کنی.
- **یک قدم جلوتر:** به همان خط باس یک هفت (۷) با آماده‌سازی و حلش اضافه کن.`,
  },
];
