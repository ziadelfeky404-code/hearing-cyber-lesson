/* ===== سلوك الموقع المشترك: تفضيلات العرض، النوافذ، تدريب الإشارة ===== */
(function () {
  "use strict";

  var KEY = "hearing-lesson-prefs-v1";
  var ONBOARDING_KEY = "hearing-onboarding-done-v1";
  var prefs = { scale: 1, contrast: "normal", lang: "sign" };
  try {
    var saved = JSON.parse(localStorage.getItem(KEY) || "{}");
    if (saved && typeof saved === "object") {
      if (typeof saved.scale === "number") prefs.scale = saved.scale;
      if (saved.contrast === "high") prefs.contrast = "high";
      if (saved.lang === "ar" || saved.lang === "sign") prefs.lang = saved.lang;
    }
  } catch (err) { /* التخزين غير متاح */ }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch (err) {}
  }

  function arNum(n) {
    return String(n).replace(/[0-9]/g, function (d) { return "٠١٢٣٤٥٦٧٨٩"[+d]; });
  }

  function apply() {
    document.documentElement.style.setProperty("--text-scale", String(prefs.scale));
    document.documentElement.setAttribute("data-contrast", prefs.contrast);
    var label = document.getElementById("scaleLabel");
    if (label) label.textContent = arNum(Math.round(prefs.scale * 100)) + "٪";
  }

  /* ===== وضع اللغة: لغة الإشارة (افتراضي) أو العربية =====
     النص العربي يبقى في الصفحة كما هو، ووضع الإشارة يُدخل ZWNJ بين كل حرفين
     حتى يبقى كل حرف بشكل يد منفصل، ثم يُطبَّق خط ishara. الضغط على الزرّ يعيد
     النص العربي كما كان بالحرف نفسه (لا نسخة مكررة من المحتوى). */
  var AR_RE = /[\u0621-\u064A\u0660-\u0669\u066E-\u06D3]/;
  var ZWNJ = "\u200c";
  var SIXTH = "\u2006";
  var MARK_RE = /[\u064B-\u0652\u0670\u0640]/;
  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1, SVG: 1, CODE: 1, PRE: 1 };
  var langBusy = false;
  var langObserver = null;

  function handify(text) {
    var out = "", i, ch, nx;
    for (i = 0; i < text.length; i++) {
      ch = text.charAt(i);
      /* الحركات والتطويل تُسقَط: هذا الخط يرسم الحركة شكلًا منفصلًا فوق
         شكل اليد فتفسده، والمطلوب شكل اليد المنفرد للحرف. */
      if (MARK_RE.test(ch)) continue;
      out += ch;
      if (AR_RE.test(ch)) {
        out += ZWNJ;
        /* فراغ سادس الإم بين اليدين فقط، لا قبل مسافة أصلية،
           لأن عرض الحبر يساوي العرض الأصلي فتتلاصق الأشكال. */
        nx = text.charAt(i + 1);
        if (nx && AR_RE.test(nx)) out += SIXTH;
      }
    }
    return out;
  }

  function isBlocked(el) {
    for (; el && el.nodeType === 1; el = el.parentNode) {
      var tag = el.tagName ? el.tagName.toUpperCase() : "";
      if (SKIP_TAGS[tag]) return true;
      if (el.getAttribute && (el.getAttribute("data-nosign") !== null ||
          el.getAttribute("data-signonly") !== null)) return true;
    }
    return false;
  }

  function eachText(root, fn) {
    if (!root) return;
    if (root.nodeType === 3) { fn(root); return; }
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var node = walker.nextNode();
    while (node) { fn(node); node = walker.nextNode(); }
  }

  function doText(node) {
    var val = node.nodeValue;
    if (!val || !AR_RE.test(val)) return;
    if (isBlocked(node.parentNode)) return;
    if (typeof node.__ar !== "string") node.__ar = val;
    var next = handify(node.__ar);
    if (val !== next) {
      langBusy = true;
      node.nodeValue = next;
      langBusy = false;
    }
  }

  function undoText(node) {
    if (typeof node.__ar === "string" && node.nodeValue !== node.__ar) {
      langBusy = true;
      node.nodeValue = node.__ar;
      langBusy = false;
    }
  }

  function watchNewText() {
    if (langObserver || typeof MutationObserver !== "function") return;
    langObserver = new MutationObserver(function (records) {
      if (langBusy || prefs.lang !== "sign") return;
      langBusy = true;
      try {
        for (var i = 0; i < records.length; i++) {
          var rec = records[i];
          if (rec.type === "characterData") { doText(rec.target); continue; }
          for (var j = 0; j < rec.addedNodes.length; j++) {
            eachText(rec.addedNodes[j], doText);
          }
        }
      } finally { langBusy = false; }
    });
    langObserver.observe(document.body, { subtree: true, childList: true, characterData: true });
  }

  function syncLangButton() {
    var sign = prefs.lang === "sign";
    var btn = document.querySelector("[data-lang-toggle]");
    if (btn) {
      btn.setAttribute("aria-pressed", sign ? "true" : "false");
      /* لا نكتب نص الزرّ من هنا: الزرّ يحتوي تسميتين، العربية وتسمية
         إشارية جاهزة، والقصّ (CSS) يُظهر المناسبة للوضع الحالي.
         والاسم الميسَّر يُؤخذ من التسمية الظاهرة نفسها حرفًا بحرف — بما فيها
         الفاصل الصفري وفراغ سادس الإم — حتى يتحقق شرط «النص المرئي داخل
         الاسم الميسَّر» (WCAG 2.5.3)، ويبقى ما يسمعه قارئ الشاشة هو الكلمة
         نفسها بلا اختلاف. */
      var shown = btn.querySelector(sign ? ".ls-ar" : ".ls-sign");
      var name = shown && shown.textContent
        ? shown.textContent.replace(/[\t\n\r ]+/g, " ").replace(/^ | $/g, "")
        : "";
      btn.setAttribute("aria-label", name || (sign ? "عرض النص العربي" : "حول للغة الإشارة"));
      btn.title = sign
        ? "أنت الآن في وضع لغة الإشارة. اضغط لتحويل الدرس كله إلى النص العربي."
        : "أنت الآن في وضع النص العربي. اضغط لعرض الدرس بلغة الإشارة.";
    }
    var now = document.querySelector("[data-lang-state]");
    if (now) now.textContent = sign ? "الوضع الحالي: لغة الإشارة" : "الوضع الحالي: العربية";
  }

  function setLang(mode, silent) {
    prefs.lang = mode === "ar" ? "ar" : "sign";
    save();
    if (prefs.lang === "sign") {
      eachText(document.body, doText);
      document.documentElement.setAttribute("data-lang", "sign");
      watchNewText();
    } else {
      eachText(document.body, undoText);
      document.documentElement.setAttribute("data-lang", "ar");
      if (langObserver) { langObserver.disconnect(); langObserver = null; }
    }
    syncLangButton();
    if (!silent) {
      announce(prefs.lang === "sign"
        ? "صار الدرس معروضًا بلغة الإشارة: كل حرف في شكل يد منفصل. زرّ «عرض النص العربي» يُعيده عربيًا."
        : "صار الدرس معروضًا بالنص العربي. زرّ «حول للغة الإشارة» — مكتوب بأشكال اليد — يُعيده إشاريًا.");
      document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: prefs.lang } }));
    }
  }

  function toggleLang() { setLang(prefs.lang === "sign" ? "ar" : "sign"); }

  var timer = 0;
  function announce(msg, hold) {
    var box = document.getElementById("liveEcho");
    if (!box) return;
    box.hidden = false;
    box.textContent = msg;
    window.clearTimeout(timer);
    timer = window.setTimeout(function () { box.hidden = true; }, hold || 5000);
  }

  function setScale(next) {
    prefs.scale = Math.min(1.7, Math.max(0.9, Math.round(next * 10) / 10));
    save(); apply();
    announce("حجم النص الآن " + arNum(Math.round(prefs.scale * 100)) + "٪. استخدم الزرّين «−» و«+» للتغيير.");
  }

  function setContrast() {
    prefs.contrast = prefs.contrast === "high" ? "normal" : "high";
    save(); apply();
    announce(prefs.contrast === "high" ? "تم تشغيل التباين العالي." : "تم إرجاع التباين العادي.");
  }

  /* نوافذ: فتح وإغلاق مع إعادة التركيز */
  var lastFocus = null;
  function focusables(container) {
    return Array.prototype.filter.call(
      container.querySelectorAll("button, a[href], input, select, textarea, [tabindex]:not([tabindex='-1'])"),
      function (el) { return !el.disabled && el.offsetParent !== null; }
    );
  }
  function openDialog(id) {
    var dlg = document.getElementById(id);
    if (!dlg) return;
    if (dlg.hidden) lastFocus = document.activeElement;
    dlg.hidden = false;
    var target = dlg.querySelector("[data-autofocus]");
    if (!target || target.disabled) target = focusables(dlg)[0];
    if (target) target.focus();
  }
  function closeDialog(id) {
    var dlg = document.getElementById(id);
    if (!dlg || dlg.hidden) return;
    dlg.hidden = true;
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }
  function anyOpen() {
    var list = document.querySelectorAll(".tour:not([hidden])");
    return list.length > 0;
  }
  function closeAll() {
    closeDialog("helpDlg"); closeDialog("tourDlg"); closeDialog("drillDlg");
  }

  /* جولة تعريفية قصيرة: كل خطوة تشرح زرًا ظاهرًا، بلا اختصارات */
  var tourSteps = [
    ["الخطوة 1: شاهد الفيديو", "اضغط على «شاهد الفيديو أولاً» في الصفحة الرئيسية. الفيديو يشرح الدرس مع ترجمة إشارية внутри الصورة، ولا تحتاج لسماع أي صوت."],
    ["الخطوة 2: اقرأ الدرس", "بعد الفيديو، اضغط على «اقرأ الدرس». انتقل بين الشرائح بأزرار «التالي» و«السابق». كل شريحة فيها رسم وكلمة بالإشارة."],
    ["الخطوة 3: حل الأسئلة", "بعد الدرس، اضغط على «حل الأسئلة». اختر الإجابة ثم اضغط «تحقق من الإجابة» لمعرفة إن كنت صوابًا أم خطأً."],
    ["أزرار التحكم", "زر «−» يصغر النص، وزر «+» يكبّره. زر «تباين» يجعل الألوان أوضح. زر «عرض النص العربي» يحوّل أشكال اليد إلى نص عربي، وبضغطة أخرى يعود للإشارة."],
    ["إنهاء الجولة", "الآن أنت مستعد للبدء. اضغط «إنهاء الجولة» للانتقال إلى الفيديو."]
  ];
  var tourIndex = 0;
  function showTour(i) {
    tourIndex = Math.max(0, Math.min(tourSteps.length - 1, i));
    var t = tourSteps[tourIndex];
    var title = document.getElementById("tourTitle");
    var text = document.getElementById("tourText");
    var counter = document.getElementById("tourCounter");
    var prev = document.getElementById("tourPrev");
    var next = document.getElementById("tourNext");
    if (!title || !text) return;
    title.textContent = t[0];
    text.textContent = t[1];
    if (counter) counter.textContent = "الخطوة " + arNum(tourIndex + 1) + " من " + arNum(tourSteps.length);
    if (prev) prev.disabled = tourIndex === 0;
    if (next) next.textContent = tourIndex === tourSteps.length - 1 ? "إنهاء الجولة" : "الخطوة التالية";
  }

  /* تدريب الإشارة */
  var drillWords = Array.isArray(window.SIGN_DRILL) ? window.SIGN_DRILL : [];
  var drillCurrent = null;
  function newDrill() {
    if (!drillWords.length) return;
    var pick = drillWords[Math.floor(Math.random() * drillWords.length)];
    if (drillWords.length > 1 && drillCurrent && pick.word === drillCurrent.word) {
      return newDrill();
    }
    drillCurrent = pick;
    var img = document.getElementById("drillImg");
    var word = document.getElementById("drillWord");
    var hint = document.getElementById("drillHint");
    var reveal = document.getElementById("drillReveal");
    if (img) { img.src = pick.file; img.alt = pick.alt; img.width = pick.w || 978; img.height = pick.h || 452; }
    if (word) { word.textContent = pick.word; word.hidden = true; }
    if (hint) { hint.textContent = pick.hint; hint.hidden = true; }
    if (reveal) reveal.hidden = false;
    var again = document.getElementById("drillAgain");
    if (again) again.hidden = true;
    announce("تدريب الإشارة: انظر إلى الصورة، ثم اضغط زر «اكشف الكلمة».");
  }
  function revealDrill() {
    if (!drillCurrent) return;
    var word = document.getElementById("drillWord");
    var hint = document.getElementById("drillHint");
    var reveal = document.getElementById("drillReveal");
    var again = document.getElementById("drillAgain");
    if (word) { word.hidden = false; word.textContent = "الكلمة: " + drillCurrent.word; }
    if (hint) { hint.hidden = false; hint.textContent = drillCurrent.hint; }
    if (reveal) reveal.hidden = true;
    if (again) { again.hidden = false; again.focus(); }
    announce("الكلمة هي " + drillCurrent.word + ". " + drillCurrent.hint);
  }

  /* لوحة المفاتيح: Esc للإغلاق و Tab داخل النافذة فقط — لا اختصارات أخرى */
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey || e.altKey || e.metaKey) return;

    if (e.key === "Escape") {
      if (anyOpen()) { closeAll(); e.preventDefault(); announce("تم إغلاق النافذة."); return; }
      var video = document.querySelector("video");
      if (video && !video.paused) { video.pause(); e.preventDefault(); announce("تم إيقاف الفيديو."); return; }
      return;
    }

    if (e.key === "Tab" && anyOpen()) {
      var open = document.querySelector(".tour:not([hidden])");
      var items = focusables(open);
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-close]");
    if (t) { closeAll(); }
    if (e.target.closest("[data-scale-up]")) setScale(prefs.scale + 0.1);
    if (e.target.closest("[data-scale-down]")) setScale(prefs.scale - 0.1);
    if (e.target.closest("button[data-contrast]")) setContrast();
    if (e.target.closest("[data-lang-toggle]")) toggleLang();
    if (e.target.closest("[data-help]")) openDialog("helpDlg");
    if (e.target.closest("[data-tour]")) { showTour(0); openDialog("tourDlg"); }
    if (e.target.closest("[data-drill]")) { newDrill(); openDialog("drillDlg"); }
    if (e.target.closest("#drillReveal")) revealDrill();
    if (e.target.closest("#drillAgain")) newDrill();
    if (e.target.closest("#tourNext")) {
      if (tourIndex === tourSteps.length - 1) {
        try { localStorage.setItem(ONBOARDING_KEY, "1"); } catch (err) {}
        closeDialog("tourDlg");
        announce("انتهت الجولة. ابدأ بمشاهدة الفيديو.");
      } else showTour(tourIndex + 1);
    }
    if (e.target.closest("#tourPrev")) showTour(tourIndex - 1);
  });

  document.addEventListener("DOMContentLoaded", function () {
    apply();
    setLang(prefs.lang, true);
    var drillBtn = document.querySelector("[data-drill]");
    if (drillBtn && !drillWords.length) drillBtn.hidden = true;
    if (window.initPage) window.initPage();
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: prefs.lang } }));

    /* خطوات التحكم في الموقع: تظهر تلقائيًا عند فتح أي صفحة فيها الجولة */
    if (document.getElementById("tourDlg")) {
      openDialog("tourDlg");
      showTour(0);
    }
  });

  window.LessonUI = {
    announce: announce,
    closeAll: closeAll,
    openDialog: openDialog,
    closeDialog: closeDialog,
    setScale: setScale,
    setContrast: setContrast,
    setLang: setLang,
    getLang: function () { return prefs.lang; }
  };
})();
