/* ==========================================================================
   نشاط المحاكاة الواقعي — التهديدات السيبرانية المتقدمة
   عشرة مواقف من مضمون الدرس تُعرض كشاشات أجهزة حقيقية، مع أزرار تصرف
   ونتائج فورية، ثم تحدٍّ بإشعارات متتابعة ووقت محدود (بلا أي صوت).
   ========================================================================== */
(function () {
  "use strict";

  var LETTERS = ["أ", "ب", "ج", "د"];
  var AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";
  function arNum(n) { return String(n).replace(/[0-9]/g, function (d) { return AR_DIGITS[+d]; }); }
  function say(msg) { if (window.LessonUI) window.LessonUI.announce(msg); }

  /* كل مشهد يحمل نفس معلومات الدرس، لكن في هيئة شيء يراه المتعلم فعلاً. */
  var SCENES = [
    {
      id: "a1",
      title: "الموقف ١: برامج الفدية",
      tag: "برامج الفدية",
      prompt: "هذه شاشة حاسوبك الآن. ما التصرف الآمن؟",
      device: "<div class='dev-bar'><span class='dev-dot'></span><span class='dev-dot'></span><span class='dev-dot'></span><span class='dev-title'>حاسوبي — ملفاتي</span></div>" +
        "<div class='lock-body'><div class='lock-icon' aria-hidden='true'>🔒</div><p class='lock-title'>ملفاتك مقفلة!</p><p class='lock-line'>ادفع ٥٠٠ $ خلال ٢٤ ساعة لفتحها</p><p class='lock-note'>لا تغلق هذه النافذة</p></div>",
      options: ["أدفع المبلغ فورًا لاستعادة ملفاتي", "أفصل الاتصال وأبلغ المسؤول فورًا", "أعيد تشغيل الحاسوب عدة مرات", "أرسل كلمة مروري لمن أرسل الرسالة"],
      correct: 1,
      outcomes: ["تم تحويل المبلغ… لكن المحتال لم يفتح الملفات، وخسرت المال.", "تم إبلاغ المسؤول، واستُعيدت الملفات من النسخة الاحتياطية بسلام.", "إعادة التشغيل لا تفك التشفير، وضاع وقت ثمين.", "أصبح المهاجم يملك كلمة المرور، واتسع الاختراق."],
      clue: "العلامة: طلب مال مقابل فتح ملفاتك. لا تدفع، وأبلغ فورًا.",
      fb: "هذا مثال لبرامج الفدية. لا تدفع ولا تحاول الإصلاح بنفسك، ولا تعد التشغيل عشوائيًا. الإبلاغ الفوري هو الصواب، والنسخة الاحتياطية هي الوقاية."
    },
    {
      id: "a2",
      title: "الموقف ٢: رسالة مشبوهة",
      tag: "تصيد برابط",
      prompt: "وصل إشعار على هاتفك في هذه اللحظة. ما التصرف الآمن؟",
      device: "<div class='dev-bar'><span>الرسائل</span><span class='dev-time'>٩:٤١ ص</span></div>" +
        "<div class='sms-head'><span class='avatar'>؟</span><div><b>خدمات البريد</b><small>رقم غير محفوظ · ٠٥١٢٣٤٥٦٧</small></div></div>" +
        "<div class='sms-bubble'>حسابك سيُغلق خلال ساعة!<br>اضغط لتأكيد بياناتك:<br><span class='fake-link' data-nosign>verify.account.example</span></div>" +
        "<p class='sms-meta'>وصلت الآن · لم تقرأ بعد</p>",
      options: ["أفتح الرابط فورًا لإنقاذ حسابي", "أتحقق من النطاق عبر قناة معروفة وأُبلّغ", "أرسل بياناتي لمن أرسل الرسالة", "أعيد تشغيل الهاتف وأترك الرسالة"],
      correct: 1,
      outcomes: ["فتحت صفحة مزيفة طلبت بياناتك… بدأت المشكلة.", "تأكدت من الجهة عبر قناة رسمية، وأُبلغ عن الرسالة.", "أرسلت بياناتك للمحتال مباشرة.", "إعادة التشغيل لا تحل المشكلة، وبقي الرابط خطرًا."],
      clue: "العلامة: استعجال + تهديد + نطاق غير معروف. تحقق من قناة معروفة.",
      fb: "الرسالة فيها استعجال وتهديد ونطاق غير معروف. التحقق عبر قناة معروفة والإبلاغ هو التصرف الآمن."
    },
    {
      id: "a3",
      title: "الموقف ٣: طلب بيانات حساسة",
      tag: "طلب بيانات",
      prompt: "هذا بريدك الوارد الآن. ما التصرف الآمن؟",
      device: "<div class='dev-bar'><span>صندوق الوارد</span><span class='dev-time'>١٠:٠٥ ص</span></div>" +
        "<div class='device-body'><div class='mail-row'><b>من:</b> الإدارة &lt;hr@office.example&gt;</div>" +
        "<div class='mail-row'><b>الموضوع:</b> تأكيد عاجل لبياناتك</div>" +
        "<div class='mail-body'>أرسل كلمة المرور ورقم البطاقة خلال ٣٠ دقيقة، وإلا سيُوقف حسابك.</div></div>",
      options: ["أرسل البيانات فورًا للمساعدة", "لا أرسل أي بيانات وأتحقق من هوية المرسل عبر قناة رسمية", "أرسل جزءًا من البيانات فقط", "أطلب من صديق أن يرسل بياناته بدلًا مني"],
      correct: 1,
      outcomes: ["وصلت بياناتك للمحتال.", "لم أرسل شيئًا، وتأكدت من الجهة بنفسي… حسابي آمن.", "حتى جزء البيانات يكفي للمحتال للبدء.", " بيانات صديقك في خطر أيضًا."],
      clue: "العلامة: طلب بيانات حساسة باستعجال من نطاق غير معتاد. وقت الإرسال أو اللغة ليسا دليلًا.",
      fb: "العلامة الحاسمة: طلب بيانات حساسة باستعجال من نطاق غير معتاد. وقت الإرسال أو اللغة ليسا دليلًا."
    },
    {
      id: "a4",
      title: "الموقف ٤: ادعاء المسؤولية",
      tag: "انتحال دعم فني",
      prompt: "ظهرت نافذة محادثة دعم فني. ما التصرف الآمن؟",
      device: "<div class='dev-bar'><span>محادثة دعم فني</span><span class='dev-state'>● متصل الآن</span></div>" +
        "<div class='device-body'><div class='chat-bubble them'>أهلًا! نحتاج التحقق من حسابك.</div>" +
        "<div class='chat-bubble them'>اكتب كلمة المرور هنا للتحقق 👇</div>" +
        "<div class='chat-typing'>الطرف الآخر ينتظر ردك…</div></div>",
      options: ["أكتب كلمة المرور لأنه من الدعم الفني", "أغلق المحادثة وأتحقق من النطاق عبر قناة مستقلة", "أكتب جزءًا من كلمة المرور", "أغيّر كلمة المرور إلى شيء أبسط وأرسلها"],
      correct: 1,
      outcomes: ["أعطيت السر لشخص مجهول الهوية.", "أغلقت النافذة، وتأكدت من الجهة بنفسي.", "الجزء نفسه معلومة للمحتال.", "كلمة أبسط أسهل اختراقًا، وأرسلتها أيضًا."],
      clue: "العلامة: ادعاء المسؤولية ليس دليل هوية. التحقق من النطاق عبر قناة مستقلة هو المعيار.",
      fb: "ادعاء المسؤولية ليس دليل هوية. التحقق من النطاق وعبر قناة مستقلة هو المعيار، ولا ترسل بياناتك."
    },
    {
      id: "a5",
      title: "الموقف ٥: انتحال شخصية",
      tag: "مكالمة بنكية",
      prompt: "هاتفك يرنّ الآن. المكالمة مكتوبة بالكامل لأن هذا الموقع بلا صوت. ما التصرف الآمن؟",
      device: "<div class='dev-bar'><span>مكالمة واردة</span><span class='dev-time'>١١:٢٠ ص</span></div>" +
        "<div class='call-body'><div class='call-avatar' aria-hidden='true'>🏦</div><b>البنك — خدمة العملاء</b><small>رقم غير محفوظ</small></div>" +
        "<div class='call-transcript'>النص المكتوب للمكالمة: «أنا من البنك، أعطني كلمة المرور للتحقق من حسابك.»</div>",
      options: ["أعطي كلمة المرور لأنه من البنك", "أغلق المكالمة وأتصل بالرقم الرسمي المطبوع على البطاقة", "أعطي كلمة المرور القديمة فقط", "أطلب منه أن يتصل بي لاحقًا"],
      correct: 1,
      outcomes: ["أعطيت السر لمتصل مجهول.", "اتصلت بالرقم الرسمي بنفسي وتأكدت أن حسابي سليم.", "القديمة كانت سرًّا أيضًا.", "تركت الأمر مفتوحًا للمحتال."],
      clue: "العلامة: لا جهة شرعية تطلب كلمة المرور هاتفيًا. تحقق عبر رقم رسمي.",
      fb: "هذا انتحال شخصية (Pretexting). لا جهة شرعية تطلب كلمة المرور هاتفيًا. تحقق عبر رقم رسمي."
    },
    {
      id: "a6",
      title: "الموقف ٦: استدراج (قرص مجهول)",
      tag: "استدراج",
      prompt: "وجدت هذا القرص على الطاولة. ما التصرف الآمن؟",
      device: "<div class='dev-bar'><span>طاولة المكتبة</span><span class='dev-time'>أثناء الفسحة</span></div>" +
        "<div class='usb-desk'><div class='usb-icon' aria-hidden='true'>💾</div><p>وجدت قرصًا مجهولًا عليه ملصق:</p><p class='usb-label'>«رواتب ٢٠٢٦ — سري جدًا»</p></div>",
      options: ["أوصله بحاسوبي لأرى ما فيه", "لا أوصله وأسلّمه للمسؤول", "أوصله بحاسوب صديق", "ألقيه في القمامة دون إخبار أحد"],
      correct: 1,
      outcomes: ["بمجرد التوصيل، نُفّذ برنامج ضار في حاسوبي.", "سلّمته دون توصيل… الجميع بقي آمنًا.", "نقلت الخطر إلى حاسوب صديق أيضًا.", "القرص بقي في متناول غيرك."],
      clue: "العلامة: إغراء بشيء جذاب يخفي خطرًا. توصيل قرص مجهول قد ينقل برنامجًا ضارًا.",
      fb: "هذا استدراج (Baiting). توصيل قرص مجهول قد ينقل برنامجًا ضارًا. سلّمه دون توصيل."
    },
    {
      id: "a7",
      title: "الموقف ٧: هجوم DDoS",
      tag: "حرمان من الخدمة",
      prompt: "هذه لوحة مراقبة الموقع. ما سبب توقف الخدمة؟",
      device: "<div class='dev-bar'><span>لوحة مراقبة الموقع</span><span class='alert-pill'>⚠ تحذير</span></div>" +
        "<div class='device-body'><div class='chart' aria-hidden='true'><span style='height:22%'></span><span style='height:30%'></span><span style='height:38%'></span><span style='height:55%'></span><span style='height:78%'></span><span style='height:96%'></span><span style='height:100%'></span><span style='height:92%'></span><span style='height:98%'></span></div>" +
        "<p class='dash-line'>الطلبات الآن: ٤٢٠٠٠ في الثانية من ٨٠٠٠ عنوان مختلف</p><p class='dash-line'>حالة الموقع: بطيء جدًا / متوقف</p></div>",
      options: ["تشفير الملفات وسرقة كلمات المرور", "إغراق خدمة بطلبات كثيرة من مصادر متعددة (DDoS)", "مشكلة في الكهرباء فقط", "الموقع يحتاج تحديثًا فقط"],
      correct: 1,
      outcomes: ["التشفير لا يظهر بهذا الشكل في لوحة الطلبات.", "تشخيص صحيح: الخدمة أُغرقت بطلبات كثيرة.", "الكهرباء لا تفسّر تعدد العناوين.", "التحديث لا يفسّر الارتفاع المفاجئ."],
      clue: "العلامة: طلبات كثيرة جدًا من عناوين متعددة في وقت واحد = DDoS.",
      fb: "DDoS ليس تشفيرًا للملفات ولا سرقة كلمات مرور، بل إغراق خدمة بطلبات كثيرة من مصادر متعددة."
    },
    {
      id: "a8",
      title: "الموقف ٨: مشكلة شبكة أو هجوم",
      tag: "سلوك غريب",
      prompt: "أجهزتك تتصرف بشكل غريب فجأة. ما التصرف الآمن؟",
      device: "<div class='dev-bar'><span>حاسوبي</span><span class='alert-pill'>⚠ تنبيه</span></div>" +
        "<div class='warn-body'><span aria-hidden='true'>⚠</span><p>ملفات بلا أسماء ظهرت فجأة</p><p>الشاشة تتجمد والشبكة بطيئة</p><p class='warn-small'>لم أعطِ أي أمر بهذا</p></div>",
      options: ["أشغّل أداة مجهولة من إعلان لإصلاح المشكلة", "لا أشغّل أدوات مجهولة ولا أتجاهل، وأُبلّغ فورًا", "أعيد تهيئة الحاسوب فورًا", "أترك الأجهزة وأتوقف عن استخدامها تمامًا"],
      correct: 1,
      outcomes: ["الأداة المجهولة زادت المشكلة.", "لم أشغّل شيءًا مجهولًا، وأبلغت المسؤول.", "التهيئة الفورية قد تُفقد بياناتك قبل الفحص.", "التوقف التام بلا إبلاغ لا يحل المشكلة."],
      clue: "العلامة: تغيّر غير متوقع. لا أدوات مجهولة، والإبلاغ الفوري هو التصرف المسؤول.",
      fb: "قد تكون مشكلة شبكة أو هجومًا. لا تشغّل أدوات مجهولة ولا تتجاهل. الإبلاغ الفوري هو التصرف المسؤول."
    },
    {
      id: "a9",
      title: "الموقف ٩: مشاركة كلمة المرور",
      tag: "سرّ لا يُشارك",
      prompt: "صديقك يطلب سرّك في المحادثة. ما التصرف الآمن؟",
      device: "<div class='dev-bar'><span>محادثة مع صديق</span><span class='dev-time'>١٢:١٥ م</span></div>" +
        "<div class='device-body'><div class='chat-bubble them'>أنا وأنت نكمل المشروع معًا، أعطني كلمة مرورك 😊</div><div class='chat-bubble them'>بسرعة قبل نهاية الحصة!</div></div>",
      options: ["أشاركه كلمة المرور للعمل معًا", "لا أشارك السر، ونعمل معًا دون مشاركته", "أشاركها لمدة ساعة فقط", "أغيّرها إلى كلمة أبسط وأشاركها"],
      correct: 1,
      outcomes: ["شاركت السرّ، وأصبح حسابك تحت رحمة أي خطأ.", "أنجزنا العمل دون مشاركة السرّ.", "ساعة واحدة تكفي لحدوث الضرر.", "كلمة أبسط أسهل اختراقًا."],
      clue: "العلامة: كلمة المرور لا تشارك مع أي شخص، حتى الصديق. البديل: صلاحيات محدودة.",
      fb: "كلمة المرور لا تشارك مع أي شخص. البديل الآمن: العمل معًا دون مشاركة السرّ."
    },
    {
      id: "a10",
      title: "الموقف ١٠: تصيد (Phishing)",
      tag: "جائزة مزيفة",
      prompt: "إشعار جديد يظهر على هاتفك. ما التصرف الآمن؟",
      device: "<div class='dev-bar'><span>إشعار</span><span class='dev-time'>١٢:٣٠ م</span></div>" +
        "<div class='prize-body'><div aria-hidden='true'>🎁</div><b>مبروك! ربحت ١٠٠٠ جنيه</b><p>أدخل بياناتك خلال ١٠ دقائق لتصلك الجائزة</p><span class='fake-link' data-nosign>prize-gift.example</span></div>",
      options: ["أرسل بياناتي للحصول على الجائزة", "أتجاهل الرسالة وأحذفها ولا أرسل أي شيء", "أرسل جزءًا من بياناتي فقط", "أطلب من صديقي أن يرسل بياناته بدلًا مني"],
      correct: 1,
      outcomes: ["أرسلت بياناتي لجهة مجهولة.", "حذفت الرسالة… ولا شيء وصل إليّ غيرها.", "الجزء نفسه يكفي لأن يبدأ التصيد.", "عرّضت صديقك للخطر أيضًا."],
      clue: "العلامة: استعجال + جائزة غير متوقعة + طلب بيانات = تصيد.",
      fb: "استعجال وجائزة غير متوقعة وطلب بيانات = تصيد. تجاهل واحذف ولا ترسل شيءًا."
    }
  ];

  /* أزرار التصرف داخل المشهد هي نفسها الخيارات الأربعة. */
  function actionsHTML(scene, attr) {
    return "<div class='sim-actions' role='group' aria-label='اختر التصرف الآمن'>" +
      scene.options.map(function (text, i) {
        return "<button type='button' class='action-btn' " + attr + "='" + i + "'>" +
          "<span class='action-letter'>" + LETTERS[i] + "</span><span>" + text + "</span></button>";
      }).join("") + "</div>";
  }

  function renderScenarios() {
    var list = document.getElementById("scenarioList");
    if (!list) return;
    list.innerHTML = SCENES.map(function (s, i) {
      return "<article class='scenario sim-scenario animate-fade-in' id='" + s.id + "' data-scene='" + i + "'>" +
        "<div class='sim-head'><h3>" + s.title + "</h3><span class='sim-tag'>" + s.tag + "</span></div>" +
        "<p class='sim-prompt'>" + s.prompt + "</p>" +
        "<div class='sim-stage'><div class='device'>" + s.device + "</div></div>" +
        actionsHTML(s, "data-pick") +
        "<div class='sim-tools'><button type='button' class='btn primary' data-check>تحقق من الإجابة</button>" +
        "<button type='button' class='btn ghost' data-show>أظهر الإجابة الصحيحة</button></div>" +
        "<div class='sim-outcome' hidden></div>" +
        "<div class='feedback' role='alert' aria-live='polite'></div>" +
        "</article>";
    }).join("");
  }

  /* ---------- التدريب الحر: النقاط والتغذية الراجعة ---------- */
  var state = {};
  var current = 0;

  function cardScene(card) { return SCENES[+card.getAttribute("data-scene")]; }

  function updateScore() {
    var answered = 0, right = 0;
    SCENES.forEach(function (s) {
      var st = state[s.id];
      if (st && st.checked) { answered++; if (st.correct) right++; }
    });
    var badge = document.getElementById("scoreBadge");
    if (badge) {
      var icon = right === SCENES.length ? "🌟" : (right >= 7 ? "👍" : "🏆");
      badge.innerHTML = "<span class='score-icon' aria-hidden='true'>" + icon + "</span>" +
        "<span class='score-text'>نقاطك: " + arNum(right) + " من ١٠</span>" +
        "<span class='score-detail'>أجبت عن " + arNum(answered) + " من ١٠</span>";
      badge.className = "score-badge" + (right === SCENES.length ? " excellent" : (right >= 7 ? " good" : ""));
    }
    var progress = document.getElementById("activityProgress");
    if (progress) {
      progress.style.width = (right / SCENES.length * 100) + "%";
      progress.setAttribute("aria-valuenow", right);
    }
    var done = document.getElementById("completionMessage");
    if (done) {
      if (answered === SCENES.length) {
        done.hidden = false;
        var line = document.getElementById("finalScore");
        if (line) line.textContent = "أجبت عن " + arNum(answered) + " من " + arNum(SCENES.length) +
          " مواقف، ونقاطك " + arNum(right) + " من " + arNum(SCENES.length) + ".";
      } else done.hidden = true;
    }
    return right;
  }

  function clearMarks(card) {
    var dev = card.querySelector(".device");
    if (dev) dev.classList.remove("safe", "danger");
    Array.prototype.forEach.call(card.querySelectorAll(".action-btn"), function (b) {
      b.classList.remove("selected", "correct", "wrong");
    });
    var out = card.querySelector(".sim-outcome");
    if (out) { out.hidden = true; out.className = "sim-outcome"; out.textContent = ""; }
    var fb = card.querySelector(".feedback");
    if (fb) { fb.textContent = ""; fb.className = "feedback"; }
  }

  function markAnswer(card, scene, chosen, ok) {
    Array.prototype.forEach.call(card.querySelectorAll(".action-btn"), function (b) {
      var i = +b.getAttribute("data-pick");
      b.classList.remove("selected", "correct", "wrong");
      if (i === scene.correct) b.classList.add("correct");
      else if (i === chosen && !ok) b.classList.add("wrong");
    });
    var dev = card.querySelector(".device");
    if (dev) dev.classList.add(ok ? "safe" : "danger");
    var out = card.querySelector(".sim-outcome");
    if (out) {
      out.className = "sim-outcome " + (ok ? "safe" : "danger");
      out.innerHTML = "<strong>" + (ok ? "✔ نتيجة آمنة: " : "✘ نتيجة خطرة: ") + "</strong>" +
        scene.outcomes[chosen >= 0 && chosen < 4 ? chosen : scene.correct];
      out.hidden = false;
    }
  }

  function popup(ok, right, scene, showCorrect) {
    var box = document.getElementById("feedbackPopup");
    if (!box) {
      box = document.createElement("div");
      box.id = "feedbackPopup";
      box.className = "feedback-popup";
      box.setAttribute("role", "alert");
      box.setAttribute("aria-live", "assertive");
      document.body.appendChild(box);
    }
    var gif = ok ? "assets/img/1f31f.gif" : "assets/img/ha_nguyen_monslide365-wrong-22187.gif";
    box.className = "feedback-popup " + (ok ? "ok" : "bad");
    box.innerHTML = (ok ? "<h2>صحيح ✔</h2>" : "<h2>غير صحيح ✘</h2>") +
      "<img src='" + gif + "' class='gif-feedback' alt=''>" +
      (!ok && showCorrect ? "<p class='answer-text'>الإجابة الصحيحة: " + LETTERS[scene.correct] + "</p>" : "") +
      "<p class='answer-text'>" + (ok ? "+١ نقطة" : "لم تُضف نقطة") + " — مجموعك: " + arNum(right) + " من ١٠</p>" +
      "<button type='button' class='btn primary' id='popupClose' style='margin-top:1rem'>تم</button>";
    box.hidden = false;
    var close = document.getElementById("popupClose");
    if (close) {
      close.onclick = function () { box.hidden = true; };
      close.focus();
    }
  }

  function checkScene(card) {
    var scene = cardScene(card);
    var st = state[scene.id];
    var fb = card.querySelector(".feedback");
    if (!st || st.index < 0) {
      fb.className = "feedback warn";
      fb.textContent = "اختر تصرفًا أولًا ثم اضغط «تحقق من الإجابة».";
      say(fb.textContent);
      return;
    }
    var ok = st.index === scene.correct;
    st.checked = true;
    st.correct = ok;
    markAnswer(card, scene, st.index, ok);
    var right = updateScore();
    fb.className = "feedback " + (ok ? "ok" : "bad");
    fb.innerHTML = "<h3>" + (ok ? "صحيح" : "غير صحيح") + "</h3><p>" +
      (ok ? "" : "الإجابة الصحيحة: " + LETTERS[scene.correct] + ". ") + scene.fb + "</p>" +
      "<p class='clue'>" + scene.clue + "</p>" +
      "<p class='points-line'><strong>" + (ok ? "+١ نقطة" : "لم تُضف نقطة") +
      "</strong> — مجموعك الآن: " + arNum(right) + " من ١٠.</p>";
    popup(ok, right, scene, true);
    say((ok ? "صحيح. " : "غير صحيح. ") + scene.fb);
  }

  function showAnswer(card) {
    var scene = cardScene(card);
    clearMarks(card);
    markAnswer(card, scene, -1, false);
    var fb = card.querySelector(".feedback");
    fb.className = "feedback note";
    fb.innerHTML = "<h3>الإجابة الصحيحة: " + LETTERS[scene.correct] + "</h3><p>" + scene.fb + "</p>" +
      "<p class='clue'>" + scene.clue + "</p>" +
      "<p class='points-line'><strong>مراجعة:</strong> إظهار الإجابة لا يضيف نقاطًا. اختر تصرفًا ثم اضغط «تحقق من الإجابة».</p>";
    say("الإجابة الصحيحة: " + LETTERS[scene.correct] + ". " + scene.fb);
  }

  function bindScenarios() {
    var list = document.getElementById("scenarioList");
    if (!list) return;
    list.addEventListener("click", function (e) {
      var card = e.target.closest(".sim-scenario");
      if (!card) return;
      var pick = e.target.closest("[data-pick]");
      var check = e.target.closest("[data-check]");
      var show = e.target.closest("[data-show]");
      var scene = cardScene(card);
      if (pick) {
        var index = +pick.getAttribute("data-pick");
        Array.prototype.forEach.call(card.querySelectorAll(".action-btn"), function (b) { b.classList.remove("selected"); });
        pick.classList.add("selected");
        var out = card.querySelector(".sim-outcome");
        if (out) { out.hidden = true; out.textContent = ""; }
        var fb = card.querySelector(".feedback");
        if (fb) { fb.textContent = ""; fb.className = "feedback"; }
        state[scene.id] = { index: index, checked: false, correct: false };
        updateScore();
      } else if (check) checkScene(card);
      else if (show) showAnswer(card);
    });
  }

  function goScene(n) {
    var cards = document.querySelectorAll(".sim-scenario");
    if (!cards.length) return;
    current = Math.max(0, Math.min(cards.length - 1, n));
    var card = cards[current];
    card.scrollIntoView({ block: "start", behavior: "smooth" });
    var title = card.querySelector("h3");
    if (title) { title.setAttribute("tabindex", "-1"); title.focus({ preventScroll: true }); }
    say("الموقف " + arNum(current + 1) + " من " + arNum(cards.length));
  }

  function resetAll() {
    Array.prototype.forEach.call(document.querySelectorAll(".sim-scenario"), function (card) {
      clearMarks(card);
    });
    state = {};
    updateScore();
    say("تمت إعادة المحاولة. اختر التصرفات من جديد.");
  }

  /* ---------- تحدي الإشعارات: قرار تحت ضغط الوقت، بلا صوت ---------- */
  var CH_IDS = [0, 1, 4, 5, 9];
  var LIMIT = 20;
  var ch = {
    on: false, paused: false, pos: 0, score: 0, results: [],
    remaining: LIMIT, endAt: 0, tick: null, hold: null, answered: false
  };

  function chEl(id) { return document.getElementById(id); }

  function setChallengeButtons(started) {
    var start = chEl("challengeStart"), pause = chEl("challengePause"), stop = chEl("challengeStop");
    if (start) start.disabled = started;
    if (pause) pause.disabled = !started;
    if (stop) stop.disabled = !started;
  }

  function paintTimer() {
    var bar = chEl("timerBar"), txt = chEl("timerText");
    var pct = Math.max(0, Math.min(100, ch.remaining / LIMIT * 100));
    if (bar) {
      bar.style.width = pct + "%";
      if (pct <= 30) bar.classList.add("low"); else bar.classList.remove("low");
    }
    if (txt && !ch.paused) txt.textContent = "الوقت المتبقي: " + arNum(Math.ceil(ch.remaining)) + " ثانية";
  }

  function stopTick() {
    if (ch.tick) { window.clearInterval(ch.tick); ch.tick = null; }
    if (ch.hold) { window.clearTimeout(ch.hold); ch.hold = null; }
  }

  function startTick() {
    stopTick();
    ch.endAt = Date.now() + ch.remaining * 1000;
    ch.tick = window.setInterval(function () {
      if (ch.paused || ch.answered) return;
      ch.remaining = Math.max(0, (ch.endAt - Date.now()) / 1000);
      paintTimer();
      if (ch.remaining <= 0) answerChallenge(-1, true);
    }, 100);
  }

  function renderChallengeCard(scene) {
    var card = chEl("challengeCard");
    var out = chEl("challengeOutcome");
    var nextWrap = chEl("challengeNextWrap");
    if (!card) return;
    card.innerHTML = "<div class='device'>" + scene.device + "</div>" + actionsHTML(scene, "data-ch");
    if (out) { out.hidden = true; out.className = "sim-outcome"; out.textContent = ""; }
    if (nextWrap) nextWrap.hidden = true;
    var first = card.querySelector(".action-btn");
    if (first) first.focus({ preventScroll: true });
  }

  function nextChallenge() {
    stopTick();
    if (ch.hold) { window.clearTimeout(ch.hold); ch.hold = null; }
    if (ch.pos >= CH_IDS.length) { finishChallenge(); return; }
    var scene = SCENES[CH_IDS[ch.pos]];
    ch.answered = false;
    ch.paused = false;
    ch.remaining = LIMIT;
    var stage = chEl("challengeStage");
    if (stage) stage.classList.remove("is-paused");
    var pause = chEl("challengePause");
    if (pause) pause.textContent = "إيقاف مؤقت";
    var counter = chEl("challengeCounter");
    if (counter) counter.textContent = "الإشعار " + arNum(ch.pos + 1) + " من " + arNum(CH_IDS.length);
    var score = chEl("challengeScore");
    if (score) score.textContent = "نقاط التحدي: " + arNum(ch.score) + " من " + arNum(CH_IDS.length);
    var nextBtn = chEl("challengeNext");
    if (nextBtn) nextBtn.disabled = true;
    renderChallengeCard(scene);
    paintTimer();
    startTick();
    say("الإشعار " + arNum(ch.pos + 1) + ": " + scene.title + ". أمامك " + arNum(LIMIT) + " ثانية.");
  }

  function answerChallenge(index, timedOut) {
    if (!ch.on || ch.answered) return;
    ch.answered = true;
    stopTick();
    var scene = SCENES[CH_IDS[ch.pos]];
    var ok = !timedOut && index === scene.correct;
    if (ok) ch.score++;
    ch.results.push({ scene: scene, ok: ok, timedOut: timedOut, chosen: index });
    var card = chEl("challengeCard");
    if (card) {
      var dev = card.querySelector(".device");
      if (dev) dev.classList.add(ok ? "safe" : "danger");
      Array.prototype.forEach.call(card.querySelectorAll(".action-btn"), function (b) {
        var i = +b.getAttribute("data-ch");
        b.disabled = true;
        if (i === scene.correct) b.classList.add("correct");
        else if (i === index) b.classList.add("wrong");
      });
    }
    var out = chEl("challengeOutcome");
    if (out) {
      out.className = "sim-outcome " + (ok ? "safe" : "danger");
      out.innerHTML = "<strong>" + (timedOut ? "⏱ انتهى الوقت: " : (ok ? "✔ نتيجة آمنة: " : "✘ نتيجة خطرة: ")) + "</strong>" +
        (timedOut ? "لم تتخذ قرارًا في الوقت المحدد. " + scene.clue : scene.outcomes[index]) +
        " <strong>الصواب: " + LETTERS[scene.correct] + ".</strong>";
      out.hidden = false;
    }
    var score = chEl("challengeScore");
    if (score) score.textContent = "نقاط التحدي: " + arNum(ch.score) + " من " + arNum(CH_IDS.length);
    var nextWrap = chEl("challengeNextWrap");
    if (nextWrap) nextWrap.hidden = false;
    var nextBtn = chEl("challengeNext");
    if (nextBtn) {
      nextBtn.disabled = false;
      nextBtn.textContent = (ch.pos === CH_IDS.length - 1) ? "عرض النتيجة" : "الإشعار التالي";
      nextBtn.focus({ preventScroll: true });
    }
    say((ok ? "صحيح. " : (timedOut ? "انتهى الوقت. " : "غير صحيح. ")) + "الصواب: " + LETTERS[scene.correct] + ". " + scene.fb);
    ch.pos++;
    ch.hold = window.setTimeout(nextChallenge, 2800);
  }

  function finishChallenge() {
    stopTick();
    ch.on = false;
    var stage = chEl("challengeStage");
    if (stage) stage.hidden = true;
    var result = chEl("challengeResult");
    if (!result) return;
    result.hidden = false;
    var icon = ch.score === CH_IDS.length ? "🌟" : (ch.score >= 3 ? "👍" : "💪");
    var html = "<h3>" + icon + " نتيجة التحدي: " + arNum(ch.score) + " من " + arNum(CH_IDS.length) + "</h3>" +
      "<p>هذه مواقف حقيقية من الدرس. راجع كل إشعار لتعرف العلامة التي دلّتك على الخطر.</p><ol>";
    ch.results.forEach(function (r) {
      html += "<li><span class='" + (r.ok ? "yes" : "no") + "'>" + (r.ok ? "✔" : "✘") + "</span> " +
        r.scene.title + " — الصواب: " + LETTERS[r.scene.correct] + ". " +
        (r.timedOut ? "انتهى الوقت." : (r.ok ? "تصرف آمن." : "تصرف غير آمن.")) + "</li>";
    });
    html += "</ol><div class='toolbar'><button type='button' class='btn primary' id='challengeAgain'>أعد التحدي</button>" +
      "<button type='button' class='btn' id='challengeReview'>راجع المواقف في المحاكاة</button></div>";
    result.innerHTML = html;
    setChallengeButtons(false);
    say("انتهى التحدي. نتيجتك " + arNum(ch.score) + " من " + arNum(CH_IDS.length) + ".");
  }

  function startChallenge() {
    ch.on = true;
    ch.paused = false;
    ch.pos = 0;
    ch.score = 0;
    ch.results = [];
    ch.answered = false;
    ch.remaining = LIMIT;
    var result = chEl("challengeResult");
    if (result) result.hidden = true;
    var stage = chEl("challengeStage");
    if (stage) { stage.hidden = false; stage.classList.remove("is-paused"); }
    setChallengeButtons(true);
    nextChallenge();
  }

  function bindChallenge() {
    var stage = chEl("challengeStage");
    if (stage) {
      stage.addEventListener("click", function (e) {
        var pick = e.target.closest("[data-ch]");
        if (pick && ch.on && !ch.answered && !ch.paused) answerChallenge(+pick.getAttribute("data-ch"), false);
      });
    }
    var start = chEl("challengeStart");
    if (start) start.addEventListener("click", startChallenge);
    var pause = chEl("challengePause");
    if (pause) pause.addEventListener("click", function () {
      if (!ch.on) return;
      ch.paused = !ch.paused;
      var stageEl = chEl("challengeStage");
      if (stageEl) stageEl.classList.toggle("is-paused", ch.paused);
      pause.textContent = ch.paused ? "متابعة" : "إيقاف مؤقت";
      if (ch.paused) {
        stopTick();
        var txt = chEl("timerText");
        if (txt) txt.textContent = "الوقت متوقف مؤقتًا";
      } else startTick();
      say(ch.paused ? "الوقت متوقف." : "الوقت مستمر.");
    });
    var stop = chEl("challengeStop");
    if (stop) stop.addEventListener("click", function () {
      stopTick();
      ch.on = false;
      finishChallenge();
      say("تم إنهاء التحدي.");
    });
    var next = chEl("challengeNext");
    if (next) next.addEventListener("click", function () {
      if (ch.hold) { window.clearTimeout(ch.hold); ch.hold = null; }
      nextChallenge();
    });
    var result = chEl("challengeResult");
    if (result) result.addEventListener("click", function (e) {
      if (e.target.closest("#challengeAgain")) startChallenge();
      if (e.target.closest("#challengeReview")) {
        var target = document.getElementById("simulation");
        if (target) target.scrollIntoView({ block: "start", behavior: "smooth" });
      }
    });
  }

  /* ---------- ربط الأزرار العامة ---------- */
  function bindCommon() {
    var prev = document.querySelector("[data-prev]");
    var next = document.querySelector("[data-next]");
    var reset = document.querySelector("[data-reset]");
    if (prev) prev.addEventListener("click", function () { goScene(current - 1); });
    if (next) next.addEventListener("click", function () { goScene(current + 1); });
    if (reset) reset.addEventListener("click", resetAll);
    var goSim = document.querySelector("[data-goto-simulation]");
    if (goSim) goSim.addEventListener("click", function () {
      var target = document.getElementById("simulation");
      if (target) target.scrollIntoView({ block: "start", behavior: "smooth" });
    });
    var goCh = document.querySelector("[data-goto-challenge]");
    if (goCh) goCh.addEventListener("click", function () {
      var target = document.getElementById("challenge");
      if (target) target.scrollIntoView({ block: "start", behavior: "smooth" });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderScenarios();
    updateScore();
    bindScenarios();
    bindChallenge();
    bindCommon();
  });
})();
