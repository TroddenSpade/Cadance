import type { GuideContent } from './types';

export const ADVANCED_GUIDES: GuideContent[] = [
  {
    id: 'voice-leading-principles',
    idea: `Voice leading is horizontal: every voice must be a line worth singing. The rules about parallel fifths and octaves are not etiquette — they protect the independence of those lines. Prefer contrary and oblique motion, keep common tones, and let each voice move by step when it can.`,
    practice: `**Try this:** Write a two-voice exercise over a slow cantus firmus using mostly contrary motion. Sing each voice alone, then together; mark any place where one line disappears into the other.

- **Watch out:** Thinking chord to chord vertically. The chord is the result of the lines, not a block you place under them.
- **You have it when:** You can write eight bars of two-voice counterpoint with no parallel perfect intervals and sing both lines.
- **Going further:** Invert the two voices at the octave and check whether the counterpoint still works.`,
    faIdea: `هدایت صدا افقی است: هر صدا باید خطی باشد که ارزش خواندن داشته باشد. قواعدِ پنجم و اکتاوِ موازی آداب‌دانی نیستند — استقلال همان خطوط را حفظ می‌کنند. حرکت مخالف و مایل را ترجیح بده، نُت‌های مشترک را نگه دار و بگذار هر صدا تا جای ممکن پله‌ای حرکت کند.`,
    faPractice: `**این را امتحان کن:** روی یک کانتوس فیرموسِ کند، تمرینی دو‌صدایی با حرکت بیشتر مخالف بنویس. هر صدا را تنها و بعد با هم بخوان؛ جایی را که یک خط در دیگری گم می‌شود علامت بزن.

- **مراقب باش:** آکورد‌به‌آکورد و عمودی فکر کنی. آکورد نتیجهٔ خطوط است، نه بلوکی که زیرشان می‌گذاری.
- **وقتی آماده‌ای که:** هشت میزان کنترپوان دو‌صدایی بدون فاصلهٔ کاملِ موازی بنویسی و هر دو خط را بخوانی.
- **یک قدم جلوتر:** دو صدا را در اکتاو وارونه کن و ببین کنترپوان هنوز کار می‌کند.`,
  },
  {
    id: 'part-writing-doubling',
    idea: `Four-part writing is four melodies sharing one chord. Double the root when you can, the fifth when you must, and the third only when the texture needs it. Never double a tendency tone — the leading tone, a seventh, or a chromatically altered note — because two voices would resolve in parallel.`,
    practice: `**Try this:** Harmonize a I–IV–V–I cadence in SATB. Check every chord for doubling, spacing, and crossing before you play it. Then sing the alto and tenor lines alone.

- **Watch out:** Doubling the third or the leading tone by habit. It sounds full for a moment and creates parallel octaves at the resolution.
- **You have it when:** You can part-write a cadence with correct doubling and explain each doubling choice.
- **Going further:** Write a deceptive cadence where doubling the third of vi is the best option, and justify it.`,
    faIdea: `نگارش چهارصدایی یعنی چهار ملودی که یک آکورد را شریک‌اند. تا می‌توانی پایه را دوبرابر کن، در صورت نیاز پنجم را و سوم را فقط وقتی بافت می‌خواهد. نُتِ گرایشی را هرگز دوبرابر نکن — نُتِ راهنما، هفتم یا نُتِ کروماتیک — چون دو صدا موازی حل می‌شوند.`,
    faPractice: `**این را امتحان کن:** یک کادانس I–IV–V–I را در چهار صدا (سوپرانو، آلتو، تنور، باس) هارمونیزه کن. پیش از نواختن، هر آکورد را از نظر دوبرابرکردن، فاصله و تلاقی صداها بررسی کن. بعد خط آلتو و تنور را تنها بخوان.

- **مراقب باش:** سوم یا نُتِ راهنما را از روی عادت دوبرابر کنی. لحظه‌ای پر صدا می‌شود و در حل، اکتاو موازی می‌سازد.
- **وقتی آماده‌ای که:** کادانسی را با دوبرابرکردن درست بنویسی و دلیل هر انتخاب را توضیح بدهی.
- **یک قدم جلوتر:** کادانس فریبنده‌ای بنویس که دوبرابرکردن سومِ vi بهترین گزینه باشد و توجیهش کن.`,
  },
  {
    id: 'secondary-dominants',
    idea: `A secondary dominant is the V of a chord that is not the tonic: V/V, V/ii, V/vi. It borrows one chromatic note, creates a local pull, and resolves to its target. The accidental is the signal; the target is the meaning.`,
    practice: `**Try this:** In C, turn Dm into D7 (V/V) and resolve to G, then to C. Do the same with A7 (V/ii) to Dm and E7 (V/vi) to Am.

- **Watch out:** Treating every secondary dominant as a modulation. A tonicization is local; a modulation needs a cadence and a new tonic.
- **You have it when:** You can identify a secondary dominant in a score and name its target without hearing the whole piece.
- **Going further:** Chain two secondary dominants and resolve the second one to its target.`,
    faIdea: `دومینانتِ فرعی، V آکوردی است که تُنیک نیست: V/V، V/ii، V/vi. یک نُتِ کروماتیک قرض می‌گیرد، کشش محلی می‌سازد و به هدفش حل می‌شود. علامت عرضی نشانه است؛ هدف معنا.`,
    faPractice: `**این را امتحان کن:** در C، Dm را به D7 (V/V) تبدیل کن و به G و بعد به C حل کن. همین کار را با A7 (V/ii) به Dm و E7 (V/vi) به Am انجام بده.

- **مراقب باش:** هر دومینانتِ فرعی را مُدگردی بپنداری. تونیکالیزاسیون محلی است؛ مُدگردی به کادانس و تُنیک تازه نیاز دارد.
- **وقتی آماده‌ای که:** دومینانتِ فرعی را در پارتیتور تشخیص بدهی و بدون شنیدن کل قطعه هدفش را نام ببری.
- **یک قدم جلوتر:** دو دومینانتِ فرعی را زنجیر کن و دومی را به هدفش حل کن.`,
  },
  {
    id: 'modulation-tonicization',
    idea: `Tonicization visits a chord; modulation moves house. A modulation is established by a cadence in the new key, not by a single accidental. The three common routes are pivot chord, chromatic approach, and enharmonic reinterpretation — each one changes how far the new key feels.`,
    practice: `**Try this:** Modulate from C to G using ii (Am) as a pivot to vi of G. Then modulate to E♭ with a chromatic mediant. End each example with a clear cadence in the new key.

- **Watch out:** Calling a tonicization a modulation. If the old tonic returns immediately, you never left.
- **You have it when:** You can modulate to the dominant and to a remote key, and explain which chord did the pivoting.
- **Going further:** Modulate from C to B major in four bars and make the arrival convincing.`,
    faIdea: `تونیکالیزاسیون به آکوردی سر می‌زند؛ مُدگردی خانه عوض می‌کند. مُدگردی با کادانس در گام تازه تثبیت می‌شود، نه با یک علامت عرضی. سه راه رایج: آکورد محور، رویکرد کروماتیک و بازتفسیر انهارمونیک — هرکدام تعیین می‌کند گام تازه چقدر دور حس شود.`,
    faPractice: `**این را امتحان کن:** از C به G با آکورد محور Am (ii در C، vi در G) مُدگردی کن. بعد با یک واسطهٔ کروماتیک به E♭ برو. هر مثال را با کادانسی روشن در گام تازه تمام کن.

- **مراقب باش:** تونیکالیزاسیون را مُدگردی بنامی. اگر تُنیک قبلی بی‌درنگ برگردد، هرگز خارج نشده‌ای.
- **وقتی آماده‌ای که:** بتوانی به دومینانت و به گامی دور مُدگردی کنی و بگویی کدام آکورد محور بود.
- **یک قدم جلوتر:** در چهار میزان از C به B ماژور مُدگردی کن و رسیدن را قانع‌کننده بساز.`,
  },
  {
    id: 'cadential-six-four',
    idea: `The cadential six-four is not a tonic chord; it is a double appoggiatura over a dominant bass. The sixth resolves to the fifth and the fourth to the third, both into the V chord. Passing and neighbouring six-fours behave differently, so identify the bass and the resolution before naming the chord.`,
    practice: `**Try this:** Play I–I6/4–V–I in C and hold the bass on G through the six-four. Listen to 6→5 and 4→3 resolve. Then find a passing six-four between I and I6.

- **Watch out:** Labelling the cadential six-four as a tonic in root position. The bass is already the dominant; the chord is decoration over it.
- **You have it when:** You can distinguish cadential, passing, and neighbouring six-fours by their bass motion.
- **Going further:** Write a phrase where a cadential six-four is delayed by a passing six-four and explain the harmonic rhythm.`,
    faIdea: `شش‌چهارِ کادانسی آکورد تُنیک نیست؛ آپوجاتورای دوگانه روی باسِ غالب است. ششم به پنجم و چهارم به سوم حل می‌شود، هر دو به آکورد V. شش‌چهارِ گذر و همسایه رفتار دیگری دارند، پس پیش از نام‌گذاری، باس و حل را بررسی کن.`,
    faPractice: `**این را امتحان کن:** در C، I–I6/4–V–I را بنواز و باس را روی G در طول شش‌چهار نگه دار. حل ۶→۵ و ۴→۳ را بشنو. بعد یک شش‌چهارِ گذر بین I و I6 پیدا کن.

- **مراقب باش:** شش‌چهارِ کادانسی را تُنیکِ حالت پایه بنامی. باس از قبل غالب است؛ آکورد تزیینی روی آن است.
- **وقتی آماده‌ای که:** شش‌چهارِ کادانسی، گذر و همسایه را از حرکت باس تشخیص بدهی.
- **یک قدم جلوتر:** عبارتی بنویس که شش‌چهارِ کادانسی با یک شش‌چهارِ گذر عقب بیفتد و ریتم هارمونیک را توضیح بده.`,
  },
  {
    id: 'neapolitan-augmented-sixths',
    idea: `The Neapolitan is a major triad on the lowered second degree, usually in first inversion, working as a dark predominant. An augmented sixth is an interval that resolves outward to an octave; Italian, French, and German sixths differ in the inner notes. Both are chromatic preparations for the dominant, not new tonics.`,
    practice: `**Try this:** In C, play N6 (D♭–F–B♭) to V to I. Then build Italian (A♭–C–F♯), French (A♭–C–D–F♯), and German (A♭–C–E♭–F♯) sixths and resolve each to G.

- **Watch out:** Spelling the augmented sixth as a minor seventh. A♭–F♯ resolves outward; A♭–G♭ does not.
- **You have it when:** You can build and resolve all three augmented sixths and the Neapolitan in one key.
- **Going further:** Use a German sixth to modulate to the dominant and handle the parallel fifths that can appear.`,
    faIdea: `آکورد ناپلی یک سه‌صداییِ ماژور روی درجهٔ دومِ پایین‌آمده است، معمولاً در وارونگی اول، و نقش پیش‌غالبِ تیره دارد. ششمِ افزوده فاصله‌ای است که به بیرون به اکتاو حل می‌شود؛ ششمِ ایتالیایی، فرانسوی و آلمانی در نُت‌های میانی تفاوت دارند. هر دو آماده‌سازی کروماتیک برای غالب‌اند، نه تُنیک تازه.`,
    faPractice: `**این را امتحان کن:** در C، N6 (D♭–F–B♭) را به V و بعد I بنواز. بعد ششمِ ایتالیایی (A♭–C–F♯)، فرانسوی (A♭–C–D–F♯) و آلمانی (A♭–C–E♭–F♯) را بساز و هرکدام را به G حل کن.

- **مراقب باش:** ششمِ افزوده را به‌صورت هفتمِ کوچک بنویسی. A♭–F♯ به بیرون حل می‌شود؛ A♭–G♭ نه.
- **وقتی آماده‌ای که:** هر سه ششمِ افزوده و ناپلی را در یک گام بسازی و حل کنی.
- **یک قدم جلوتر:** با ششمِ آلمانی به دومینانت مُدگردی کن و پنجم‌های موازیِ احتمالی را مدیریت کن.`,
  },
  {
    id: 'chromatic-mediants-dim7',
    idea: `A chromatic mediant moves the root by a third and keeps the chord quality, often sharing one note with the previous chord. It colours a progression without preparing a new key. The common-tone diminished seventh is symmetrical: it can resolve to four different tonics, each time keeping one note in common.`,
    practice: `**Try this:** Play C major to A♭ major and hold the common tone C. Then play Cdim7 and resolve it to C, E♭, G♭, and A, listening to the shared note each time.

- **Watch out:** Treating every chromatic mediant as a modulation. It is a colour chord until a cadence says otherwise.
- **You have it when:** You can use a chromatic mediant in a phrase and explain which note is common and which voice moves farthest.
- **Going further:** Write an eight-bar film cue that uses two chromatic mediants and one common-tone diminished seventh.`,
    faIdea: `واسطهٔ کروماتیک پایه را یک سوم جابه‌جا می‌کند و کیفیت آکورد را نگه می‌دارد؛ اغلب یک نُت مشترک با آکورد قبلی دارد. پیشروی را رنگ می‌کند بدون آنکه گام تازه‌ای آماده کند. هفتِ کاستهٔ نُتِ مشترک متقارن است: می‌تواند به چهار تُنیک متفاوت حل شود و هر بار یک نُت را مشترک نگه دارد.`,
    faPractice: `**این را امتحان کن:** C ماژور را به A♭ ماژور بنواز و نُتِ مشترک C را نگه دار. بعد Cdim7 را بنواز و به C، E♭، G♭ و A حل کن و هر بار نُتِ مشترک را بشنو.

- **مراقب باش:** هر واسطهٔ کروماتیک را مُدگردی بپنداری. تا کادانس خلافش را نگوید، آکوردی رنگی است.
- **وقتی آماده‌ای که:** واسطهٔ کروماتیک را در یک عبارت به کار ببری و بگویی کدام نُت مشترک است و کدام صدا بیشترین حرکت را دارد.
- **یک قدم جلوتر:** هشت میزان موسیقی فیلم بنویس که دو واسطهٔ کروماتیک و یک هفتِ کاستهٔ نُتِ مشترک داشته باشد.`,
  },
  {
    id: 'enharmonic-modulation-pedal',
    idea: `Enharmonic reinterpretation changes a chord's function without changing its sound: a German sixth becomes a dominant seventh, a diminished seventh becomes four possible dominants. A pedal point holds one note while the harmony moves above it, turning a static bass into tension or stability.`,
    practice: `**Try this:** Spell a German sixth in C, then reinterpret the same notes as a dominant seventh and resolve to a different key. Hold a tonic pedal for eight bars while the chords above it move.

- **Watch out:** Losing the pedal note when the harmony gets chromatic. The held note is the anchor; check it every bar.
- **You have it when:** You can modulate by reinterpretation and explain which note changed its function.
- **Going further:** Use a diminished seventh to reach a key three semitones away, then return with a pedal.`,
    faIdea: `بازتفسیر انهارمونیک کارکرد آکورد را بدون تغییر صدا عوض می‌کند: ششمِ آلمانی به هفتِ غالب تبدیل می‌شود و هفتِ کاسته به چهار غالبِ ممکن. نقطهٔ پدال یک نُت را نگه می‌دارد و هارمونی بالای آن حرکت می‌کند؛ باسِ ثابت به تنش یا پایداری تبدیل می‌شود.`,
    faPractice: `**این را امتحان کن:** ششمِ آلمانی را در C بنویس، بعد همان نُت‌ها را هفتِ غالب بازتفسیر کن و به گام دیگری حل کن. هشت میزان پدالِ تُنیک نگه دار و بگذار آکوردهای بالای آن حرکت کنند.

- **مراقب باش:** وقتی هارمونی کروماتیک می‌شود، نُتِ پدال را گم کنی. نُتِ نگه‌داشته‌شده لنگر است؛ هر میزان بررسی‌اش کن.
- **وقتی آماده‌ای که:** با بازتفسیر مُدگردی کنی و بگویی کدام نُت کارکردش عوض شد.
- **یک قدم جلوتر:** با هفتِ کاسته به گامی سه نیم‌پرده دورتر برو و با پدال برگرد.`,
  },
  {
    id: 'florid-invertible',
    idea: `Fourth species turns dissonance into suspension: prepare, hold across the beat, resolve down by step. Fifth species mixes all of it into a florid line. Invertible counterpoint means the voices can swap register; the interval of inversion decides which parallels remain legal.`,
    practice: `**Try this:** Write a chain of 7–6 suspensions over a descending bass. Then invert the two voices at the octave and check for crossings and parallels.

- **Watch out:** Forgetting that a suspension must be prepared. The held note has to be a consonance before it becomes a dissonance.
- **You have it when:** You can write four bars of florid counterpoint and invert it without breaking the rules.
- **Going further:** Invert the same pair at the tenth and describe which intervals become problematic.`,
    faIdea: `گونهٔ چهارم، ناسازگاری را به تعلیق تبدیل می‌کند: آماده کن، از ضرب نگه دار و پله‌ای پایین حل کن. گونهٔ پنجم همه را در خطی گل‌دار می‌آمیزد. کنترپوانِ وارونه یعنی صداها می‌توانند جای هم را بگیرند؛ فاصلهٔ وارونگی تعیین می‌کند کدام موازی‌ها هنوز مجازند.`,
    faPractice: `**این را امتحان کن:** زنجیره‌ای از تعلیق‌های ۷–۶ روی باسی نزولی بنویس. بعد دو صدا را در اکتاو وارونه کن و تلاقی و موازی‌ها را بررسی کن.

- **مراقب باش:** فراموش کنی تعلیق باید آماده شود. نُتِ نگه‌داشته‌شده پیش از ناسازگاری باید هم‌ساز باشد.
- **وقتی آماده‌ای که:** چهار میزان کنترپوان گل‌دار بنویسی و بدون شکستن قواعد وارونه‌اش کنی.
- **یک قدم جلوتر:** همان جفت را در دهم وارونه کن و بگو کدام فاصله‌ها مشکل‌ساز می‌شوند.`,
  },
  {
    id: 'fugue-canon-ground',
    idea: `A fugue is a conversation built from one subject: exposition, answer, countersubject, episodes, and returns. A canon is stricter imitation with a fixed delay; a ground bass is a repeating bass over which the upper voices vary. All three make form out of imitation rather than out of chord loops.`,
    practice: `**Try this:** Map the exposition of a fugue: subject, answer, countersubject, episode. Then write a canon at the fifth with a two-bar delay, and a ground-bass variation.

- **Watch out:** Confusing the subject with the countersubject. The subject returns; the countersubject accompanies it.
- **You have it when:** You can follow a fugue's subject through its entries and write a short canon that stays consonant.
- **Going further:** Write a three-voice canon at the octave and mark every entry.`,
    faIdea: `فوگ گفت‌وگویی است ساخته‌شده از یک سوژه: نمایش، پاسخ، کنترسوژه، اپیزودها و بازگشت‌ها. کانون تقلیدِ سخت‌گیرانه‌تر با تأخیر ثابت است؛ باسِ زمینی باسی تکرارشونده است که صداهای بالا روی آن تغییر می‌کنند. هر سه، فرم را از تقلید می‌سازند، نه از چرخهٔ آکورد.`,
    faPractice: `**این را امتحان کن:** نمایش یک فوگ را نقشه کن: سوژه، پاسخ، کنترسوژه، اپیزود. بعد کانونی در پنجم با تأخیر دومیزانی و یک واریاسیون روی باسِ زمینی بنویس.

- **مراقب باش:** سوژه را با کنترسوژه اشتباه بگیری. سوژه برمی‌گردد؛ کنترسوژه همراهی‌اش می‌کند.
- **وقتی آماده‌ای که:** ورودهای سوژه را در فوگ دنبال کنی و کانونی کوتاه و هم‌ساز بنویسی.
- **یک قدم جلوتر:** کانونی سه‌صدایی در اکتاو بنویس و هر ورود را علامت بزن.`,
  },
  {
    id: 'binary-ternary-rondo-variations',
    idea: `Form is a map of returns and contrasts. Binary is A–B, ternary is A–B–A, rondo is A–B–A–C–A, and theme-and-variations keeps a skeleton while changing the surface. The tonal plan matters as much as the letters: where the music leaves and where it comes home.`,
    practice: `**Try this:** Map three pieces you know as letters and keys. Then compose an eight-bar binary form with a half cadence in the first half and a full cadence in the second.

- **Watch out:** Calling any A–B–A ternary. If the return is changed beyond recognition, the form may be rounded binary or something else.
- **You have it when:** You can hear a return approaching and name the form before the piece ends.
- **Going further:** Turn your binary piece into a rondo by adding a contrasting C section and a final return.`,
    faIdea: `فرم نقشهٔ بازگشت‌ها و تضادهاست. دوتایی A–B است، سه‌تایی A–B–A، روندو A–B–A–C–A و تم و واریاسیون اسکلتی را نگه می‌دارد و سطح را عوض می‌کند. نقشهٔ تُنال به‌اندازهٔ حروف مهم است: موسیقی کجا می‌رود و کجا به خانه برمی‌گردد.`,
    faPractice: `**این را امتحان کن:** سه قطعهٔ آشنا را با حروف و گام‌ها نقشه کن. بعد فرمی دوتایی هشت‌میزانی بساز که نیمهٔ اول کادانس نیمه و نیمهٔ دوم کادانس کامل داشته باشد.

- **مراقب باش:** هر A–B–A را سه‌تایی بنامی. اگر بازگشت بیش از حد تغییر کرده، ممکن است دوتاییِ گرد یا فرم دیگری باشد.
- **وقتی آماده‌ای که:** نزدیک‌شدن بازگشت را بشنوی و پیش از پایان قطعه فرم را نام ببری.
- **یک قدم جلوتر:** قطعهٔ دوتایی‌ات را با افزودن بخش C متضاد و یک بازگشت پایانی به روندو تبدیل کن.`,
  },
  {
    id: 'concerto-da-capo-programme',
    idea: `Concerto form is a conversation between tutti and solo, with ritornellos marking the map. A da capo aria is A–B–A, where the return is ornamented and the drama happens in the repeat. Programme music attaches a story or character; a leitmotif makes that character portable. Genre and form are different questions.`,
    practice: `**Try this:** Map the ritornello returns in a concerto movement. Then outline a da capo aria: A in the tonic, B in a related key, A returning with added ornaments.

- **Watch out:** Confusing form with genre. A concerto is a genre; ritornello is a form. A pop song can use a da capo-like return too.
- **You have it when:** You can follow the solo–tutti alternation and explain what the da capo repeat adds.
- **Going further:** Analyze a film cue or pop song with the same map: returns, contrasts, and the moment of homecoming.`,
    faIdea: `فرم کنسرتو گفت‌وگویی است بین tutti و سولو، با ریتورنلوهایی که نقشه را علامت می‌زنند. آریای دا کاپو A–B–A است؛ بازگشت تزیین می‌شود و درام در تکرار رخ می‌دهد. موسیقی برنامه‌ای داستان یا شخصیتی را می‌چسباند و لایت‌موتیف آن شخصیت را قابل‌حمل می‌کند. ژانر و فرم دو پرسش جدا هستند.`,
    faPractice: `**این را امتحان کن:** بازگشت‌های ریتورنلو را در یک موومان کنسرتو نقشه کن. بعد طرح یک آریای دا کاپو را بنویس: A در تُنیک، B در گام مرتبط و A با تزیین‌های تازه.

- **مراقب باش:** فرم را با ژانر اشتباه بگیری. کنسرتو ژانر است؛ ریتورنلو فرم. آهنگ پاپ هم می‌تواند بازگشتی شبیه دا کاپو داشته باشد.
- **وقتی آماده‌ای که:** تناوب سولو و tutti را دنبال کنی و بگویی تکرار دا کاپو چه چیزی اضافه می‌کند.
- **یک قدم جلوتر:** یک قطعهٔ فیلم یا آهنگ پاپ را با همین نقشه تحلیل کن: بازگشت‌ها، تضادها و لحظهٔ بازگشت به خانه.`,
  },
];
