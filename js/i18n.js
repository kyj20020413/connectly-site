/* =========================================================
   CONNECTLY — i18n.js
   KO / EN 전환. 국문은 HTML 에 그대로 두고(원본), 영문만 아래 사전에 둔다.
   - 요소:   data-i18n="key"              → innerHTML 교체
   - 속성:   data-i18n-placeholder="key"  → placeholder 교체
             data-i18n-aria="key"         → aria-label 교체
   - 선택:   ?lang=en 또는 ?lang=ko → 저장값(localStorage) → 브라우저 언어(ko 가 아니면 en) → ko
   ========================================================= */
(function () {
  'use strict';

  var STORAGE_KEY = 'connectly.lang';
  var DEFAULT = 'ko';

  /* ---------- 영문 사전 (화면 문구) ---------- */
  var EN = {
    'meta.title': 'CONNECTLY — Connect, infinitely.',
    'meta.desc': 'Connectly is the technology subsidiary of Trexi. We build TOS (a B2B order system), a Seller OMS and a work-management system that connect suppliers, buyers, consumers and people, and lead the AI transformation of distribution.',

    'a11y.home': 'Connectly home',
    'a11y.nav': 'Main menu',

    'hero.title': 'Infinite value,<br>\n          <span class="gradient-text">made by connection</span>',
    'hero.desc': 'Connectly builds the systems that link suppliers with buyers, buyers with consumers, people with people and businesses with businesses, and on top of them leads the <strong>AX</strong> (AI transformation) of the distribution floor.',
    'hero.cta1': 'See what we build',
    'hero.cta2': 'Partner inquiry',

    'about.title': 'A commerce tech company<br>that knows the distribution floor',
    'about.desc': 'Since its founding in 2020, Connectly has planned, built and operated B2C commerce platforms of many kinds. After joining Trexi in 2023, we have developed and operated Trexi\u2019s B2C and B2B platforms and its internal collaboration systems, leading Trexi\u2019s AI transformation.',
    'stat.1': 'Founded',
    'stat.2': 'Systems in operation (TOS · Seller OMS · Work management)',
    'stat.3': 'Became a Trexi subsidiary',
    'stat.4': 'Brands distributed by Trexi',
    'about.mission': 'We let systems handle the repetitive, manual work of distribution so that people can spend their time on deals and partner relationships.',
    'about.vision': 'We build a distribution platform where suppliers and buyers, buyers and consumers, and people and people stay connected on one system without a break.',
    'about.how': 'Every new feature is first applied and proven in Trexi\u2019s day-to-day operations; only what has been proven is expanded into the platform.',

    'build.title': 'What we build',
    'build.desc': 'Three systems Connectly develops and operates, and the engineering capability behind them.',
    'p1.badge1': 'In internal use',
    'p1.badge2': 'Expanding to B2B platform',
    'p1.sub': 'Trexi Order System · working title',
    'p1.desc': 'A B2B system that manages Trexi\u2019s offer and order workflow. AI converts offers received from suppliers into a standard format, and staff reviews and buyer delivery history are managed in one place. We plan to expand it into a B2B platform where suppliers and buyers take part directly.',
    'p1.f1': '<em>Live</em>AI offer standardization (header mapping · metadata extraction · size recognition)',
    'p1.f2': '<em>Live</em>Offer registration · review · buyer delivery history',
    'p1.f3': '<em class="is-next">Next</em>Direct offer upload by suppliers · buyer sign-up',
    'p1.f4': '<em class="is-next">Next</em>Order-fit recommendations · instant offer access and ordering for buyers',
    'p1.link': 'See TOS on trexi.kr',
    'p2.badge': 'Live',
    'p2.sub': 'Seller onboarding order management · NAVER SmartStore integration',
    'p2.desc': 'An order management system where sellers onboard, list products and process orders. Product and order data syncs both ways with the Disney brand shop on NAVER SmartStore, so product management, order collection, shipping and customer service are all handled inside the OMS.',
    'p2.f1': 'Seller sign-up · product listing and updates',
    'p2.f2': 'Two-way automatic sync of products and orders (NAVER SmartStore)',
    'p2.f3': 'Order collection · shipping · customer service',
    'p2.f4': 'More channels planned (currently NAVER SmartStore)',
    'p3.badge': 'Used across Trexi',
    'p3.title': 'Work Management System <small>Collaboration · task management · working title</small>',
    'p3.desc': 'A collaboration and task-management system used by Trexi employees. Tasks are registered per project, and related departments and outside partners track progress together. It has been in use since November 2026 as part of Trexi\u2019s AI transformation.',
    'p3.f1': 'Task registration · assignment · status tracking',
    'p3.f2': 'Cross-department collaboration per project',
    'p3.f3': 'Invite outside partners · work together',
    'p3.f4': 'Designed around Trexi\u2019s workflow',
    'p4.sub': 'Platform development · data · AI',
    'p4.desc': 'We design new systems on experience that includes running a 100,000-item product catalog, consolidating multi-channel orders, integrating overseas marketplaces and building AI features on distribution data.',

    'shot.note': 'Illustration · not real data',
    'shot.today': 'Today',
    'shot.yesterday': 'Yesterday',
    'shot.tos.title': 'TOS · Offer overview',
    'shot.tos.s1': 'Inflow (3 mo.)',
    'shot.tos.s2': 'In review',
    'shot.tos.s3': 'Completed',
    'shot.tos.h1': 'All teams · in progress',
    'shot.tos.h1b': '13 offers',
    'shot.tos.h2': 'Due soon',
    'shot.tos.h2b': '47 within D-3',
    'shot.tos.pending': 'Pending',
    'shot.oms.title': 'Seller OMS · Dashboard',
    'shot.oms.k1': 'To ship',
    'shot.oms.k2': 'Preparing',
    'shot.oms.k3': 'Delayed',
    'shot.oms.k4': 'Cancel requests',
    'shot.oms.k5': 'Return requests',
    'shot.oms.k6': 'Unanswered',
    'shot.oms.p1': 'Orders',
    'shot.oms.p2': 'Revenue',
    'shot.oms.sync': 'NAVER SmartStore sync · last at 15:16',
    'shot.wm.title': 'Work Management · Project board',
    'shot.wm.proj': 'Trexi AX project',
    'shot.wm.inprog': 'In progress',
    'shot.wm.todo': 'To do',
    'shot.wm.done': 'Done',
    'shot.wm.members': '44 members',
    'shot.wm.t1': 'Summary', 'shot.wm.t2': 'Board', 'shot.wm.t3': 'Calendar', 'shot.wm.t4': 'Timeline',
    'shot.wm.c1': 'To do', 'shot.wm.c2': 'In progress', 'shot.wm.c3': 'Done',
    'shot.wm.k1': 'Define offer auto-sorting rules',
    'shot.wm.k2': 'Review partner invite flow',
    'shot.wm.k3': 'Build in-task messenger',
    'shot.wm.k4': 'Meeting recording · AI summary',
    'shot.wm.k5': 'Personal calendar sync',
    'cap.1': 'Product catalog in operation',
    'cap.2': 'Domestic and overseas channel APIs',
    'cap.3': 'Commerce platforms designed and run',
    'cap.4': 'Line-sheet standardization · pricing analysis · business AX',
    'why.title': 'What we<br>connect',
    'why.desc': 'Every Connectly product stands on four connections. Offers and orders for hundreds of brands move every day and become the starting point of our requirements; when those connections keep circulating without a break, value grows without limit.',
    'why.1.h': 'Connecting suppliers and buyers',
    'why.1.p': 'AI standardizes offers that arrive in a different format from every supplier, delivers them to buyers and turns them into orders.',
    'why.1.chip': 'TOS',
    'why.2.h': 'Connecting buyers and consumers',
    'why.2.p': 'Sellers\u2019 products and orders sync both ways with sales channels and reach consumers.',
    'why.2.chip': 'Seller OMS',
    'why.3.h': 'Connecting people and people',
    'why.3.p': 'Collaboration across departments and with outside partners is managed in one system, organized by project and task.',
    'why.3.chip': 'Work Management System',
    'why.4.h': 'Connecting businesses and businesses',
    'why.4.p': 'On the network of brands, suppliers and buyers that Trexi has built over 27 years, we move business-to-business trade onto a platform.',
    'why.4.chip': 'Trexi network',
    'map.sup': 'Supplier',
    'map.buyer': 'Buyer',
    'map.cons': 'Consumer',
    'map.part': 'Partner',
    'map.staff': 'Team',
    'map.brand': 'Brand',

    'history.title': 'From B2C commerce to the AX of distribution',
    'history.desc': 'Starting from B2C commerce platforms, we have expanded into Trexi\u2019s B2B and business systems.',
    'h.2020.t': 'Connectly Inc. founded',
    'h.2020.1': 'Jan : Company founded',
    'h.2020.2': 'Aug : Launched <b>zzimcong</b>, a kids\u2019 meta-commerce platform',
    'h.2020.3': 'Dec : Investment from FuturePlay',
    'h.2021.t': 'Angel investment',
    'h.2021.1': 'Apr : Investment from AAA Angel Investment Partnership',
    'h.2022.t': 'Launched luxury commerce platform <b>Beborn</b>',
    'h.2022.1': 'Aug : First investment from Trexi',
    'h.2022.2': 'Oct : Launched B2C luxury fashion platform',
    'h.2022.3': 'Dec : Passed 100,000 listed products',
    'h.2023.t': 'Became a Trexi subsidiary',
    'h.2023.1': 'Mar : Became a subsidiary of Trexi',
    'h.2023.2': 'May : Began converting Beborn into <b>SETOF</b>, Trexi\u2019s official store',
    'h.2023.3': 'May : Shifted role to Trexi\u2019s technology company',
    'h.2024.t': 'Launched <b>SETOF</b>, Trexi\u2019s official store',
    'h.2024.1': 'Apr : Relaunched Beborn as SETOF after a full renewal',
    'h.2024.2': 'Jul : API integration with 5 domestic and overseas commerce channels, B2B2C onboarding',
    'h.2025.t': 'Launched B2B system <b>TOS</b>',
    'h.2025.1': 'May : Started development of TOS (Trexi Order System, working title)',
    'h.2025.2': 'Sep : TOS launched, internal operation at Trexi began',
    'h.2025.3': 'Oct : Converted the SETOF admin into Seller OMS, integrated with the Disney brand shop on NAVER SmartStore',
    'h.2026.t': 'Trexi\u2019s <b>AX</b> in full swing',
    'h.2026.1': 'Jul : Built AI line-sheet standardization for TOS',
    'h.2026.2': 'Nov : Completed the work-management system (working title), rolled out across Trexi',

    'group.title': 'Trexi, a global brand distribution specialist',
    'group.desc': 'Trexi started as a small sports shop in 1999 and has grown into a distribution specialist that connects global brands to the Korean market through a verified global supply network. With wholesale (B2B), global sourcing, online commerce (B2C) and brand distribution, and the B2B platform TOS (working title) on the way, Trexi links five businesses into one network.',
    'group.btn': 'Visit trexi.kr',
    'group.f1.dt': 'In distribution',
    'group.f1.dd': '27 years <small>Founded 1999 · Incorporated 2009</small>',
    'group.f2.dt': 'Partner network',
    'group.f2.dd': '300+ <small>Brands · suppliers · buyers</small>',
    'group.f3.dt': 'Key channels',
    'group.f4.dt': 'Business lines',
    'group.f4.dd': 'Wholesale (B2B) · Global sourcing · Online commerce (B2C) · Brand distribution · B2B platform TOS (working title)',

    'contact.title': 'Looking for partners<br>to build with',
    'contact.desc': 'We welcome inquiries about platform partnerships, channel integration and careers.',
    'contact.email': 'Email',
    'contact.tel': 'Phone',
    'contact.telno': '+82 10-3352-5686',
    'contact.addr': 'Address',
    'contact.address': 'B020, 3F, 25-11 Seongji-gil, Mapo-gu, Seoul, Korea (Ogu Bldg., Hapjeong-dong)',
    'form.name': 'Name <em>*</em>',
    'form.name.ph': 'Your name',
    'form.email': 'Email <em>*</em>',
    'form.company': 'Company',
    'form.company.ph': 'Company (optional)',
    'form.topic': 'Inquiry type',
    'form.opt1': 'Partnership',
    'form.opt2': 'Platform · channel integration',
    'form.opt3': 'Careers',
    'form.opt4': 'Other',
    'form.message': 'Message <em>*</em>',
    'form.message.ph': 'Tell us what you have in mind',
    'form.submit': 'Send inquiry',

    'form.agree': '(Required) I agree to the collection and use of my personal data. <a href="privacy.html" target="_blank" rel="noopener">Details</a>',
    'footer.privacy': 'Privacy Policy',
    'pp.back': '← Back to home',
    'pp.label': 'Privacy Policy',
    'pp.title': 'Privacy Policy',
    'pp.intro': 'Connectly Inc. (the "Company") protects users\u2019 personal data under the Personal Information Protection Act of Korea and publishes this policy to handle related concerns promptly. It applies to the contact feature of the Company website (connectly.co.kr).',
    'pp.s1.h': '1. Data we collect and how',
    'pp.s1.p': 'The Company collects the information below through the "Contact" form on the website. Submissions are relayed by email to the Company\u2019s address through a form-processing service (Web3Forms); the website itself stores nothing.',
    'pp.s1.l1': 'Required: name, email address, message',
    'pp.s1.l2': 'Optional: company name, inquiry type',
    'pp.s1.l3': 'If you contact us directly by phone or email, the contact details and content you provide in that process',
    'pp.s2.h': '2. Purpose of use',
    'pp.s2.l1': 'Reviewing and answering inquiries',
    'pp.s2.l2': 'Follow-up on partnership, platform/channel integration, careers and other inquiry types',
    'pp.s3.h': '3. Retention period',
    'pp.s3.p': 'Data is kept for one year after the inquiry is closed and then deleted without delay. It is deleted immediately on request. Where a law requires retention, data is kept for the period that law prescribes.',
    'pp.s4.h': '4. Third parties and processors',
    'pp.s4.p': 'The Company does not provide personal data to third parties. The following processors are used: Web3Forms (form submission relay) delivers what you enter in the contact form to the Company by email, Google Workspace (email service) by Google LLC stores the Company\u2019s email, and Google Analytics by Google LLC processes visit statistics. In that process data may be transferred overseas to those providers\u2019 data centers.',
    'pp.s5.h': '5. Your rights',
    'pp.s5.p': 'You may request access to, correction or deletion of, or suspension of processing of your personal data at any time. Requests sent by email to the data protection officer below are handled without delay.',
    'pp.s6.h': '6. Cookies and visit analytics',
    'pp.s6.p': 'The website uses Google Analytics by Google LLC for visit statistics. It uses cookies to collect pages visited, time on site, referral source, approximate region and device/browser information; IP addresses are anonymized and do not identify individuals. The data may be processed on Google servers overseas. You can block this by refusing cookies in your browser or installing the Google Analytics opt-out add-on (tools.google.com/dlpage/gaoptout). The site also uses browser storage (localStorage, sessionStorage) to remember your language choice and whether the intro has played; these values stay in your browser. No advertising cookies are used.',
    'pp.s7.h': '7. Security measures',
    'pp.s7.p': 'The Company limits staff access to inquiry emails to the minimum, applies two-step verification to the email account, and deletes data past its retention period in a non-recoverable way.',
    'pp.s8.h': '8. Data protection officer',
    'pp.s8.l1': 'Officer: Yongjin Kwon (CEO)',
    'pp.s8.l2': 'Email: contact@connectly.co.kr',
    'pp.s8.l3': 'Phone: +82 10-3352-5686',
    'pp.s8.l4': 'Address: B020, 3F, 25-11 Seongji-gil, Mapo-gu, Seoul, Korea (Ogu Bldg., Hapjeong-dong)',
    'pp.s8.p': 'Reports and counselling on personal data infringement are also available from the Korea Personal Information Infringement Report Center (118) and the Personal Information Dispute Mediation Committee (1833-6972).',
    'pp.s9.h': '9. Changes to this policy',
    'pp.s9.p': 'Changes to this policy are announced on the website at least 7 days before they take effect.',
    'pp.date': 'Effective date: November 25, 2026',
    'footer.tagline': 'Connect, infinitely.',
    'footer.info1': 'Connectly Inc. | CEO Yongjin Kwon | Business registration no. 870-86-01697',
    'footer.info2': 'B020, 3F, 25-11 Seongji-gil, Mapo-gu, Seoul, Korea | +82 10-3352-5686'
  };

  /* ---------- 스크립트 전용 문구 (main.js 에서 사용) ---------- */
  var MSG = {
    ko: {
      menuOpen: '메뉴 열기', menuClose: '메뉴 닫기',
      required: '필수 항목을 확인해 주세요.',
      subject: '[커넥틀리 홈페이지 문의]',
      fName: '이름', fEmail: '이메일', fCompany: '회사명', fTopic: '문의 유형',
      sending: '보내는 중…',
      sent: '문의가 접수되었습니다. 확인 후 입력하신 이메일로 답변드리겠습니다.',
      failed: '전송에 실패했습니다. 잠시 후 다시 시도하거나 contact@connectly.co.kr 로 보내 주세요.'
    },
    en: {
      menuOpen: 'Open menu', menuClose: 'Close menu',
      required: 'Please fill in the required fields.',
      subject: '[Connectly website inquiry]',
      fName: 'Name', fEmail: 'Email', fCompany: 'Company', fTopic: 'Inquiry type',
      sending: 'Sending…',
      sent: 'Your inquiry has been received. We will reply to the email address you entered.',
      failed: 'Sending failed. Please try again later or email contact@connectly.co.kr directly.'
    }
  };

  /* ---------- 국문 원본 수집 ---------- */
  var KO = {};
  var KO_ATTR = { placeholder: {}, aria: {} };
  var metaDesc = document.querySelector('meta[name="description"]');
  KO['meta.title'] = document.title;
  KO['meta.desc'] = metaDesc ? metaDesc.getAttribute('content') : '';

  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    KO[el.getAttribute('data-i18n')] = el.innerHTML;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
    KO_ATTR.placeholder[el.getAttribute('data-i18n-placeholder')] = el.getAttribute('placeholder') || '';
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
    KO_ATTR.aria[el.getAttribute('data-i18n-aria')] = el.getAttribute('aria-label') || '';
  });

  var current = DEFAULT;

  function dict(lang) { return lang === 'en' ? EN : KO; }
  function t(key) { var d = dict(current); return key in d ? d[key] : (KO[key] || ''); }
  function msg(key) { return (MSG[current] || MSG.ko)[key] || MSG.ko[key] || ''; }

  function apply(lang) {
    if (lang !== 'en') lang = 'ko';
    current = lang;
    var d = dict(lang);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (k in d) el.innerHTML = d[k];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-placeholder');
      var v = lang === 'en' ? EN[k] : KO_ATTR.placeholder[k];
      if (v != null) el.setAttribute('placeholder', v);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-aria');
      var v = lang === 'en' ? EN[k] : KO_ATTR.aria[k];
      if (v != null) el.setAttribute('aria-label', v);
    });

    document.documentElement.lang = lang;
    var pageTitleEn = document.documentElement.getAttribute('data-title-en');
    document.title = lang === 'en' ? (pageTitleEn || d['meta.title'] || KO['meta.title']) : KO['meta.title'];
    if (metaDesc) metaDesc.setAttribute('content', d['meta.desc'] || KO['meta.desc']);

    document.querySelectorAll('.lang__btn').forEach(function (b) {
      var on = b.getAttribute('data-lang') === lang;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));
  }

  function detect() {
    var q = null;
    try { q = new URLSearchParams(location.search).get('lang'); } catch (e) {}
    if (q === 'en' || q === 'ko') return q;
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (saved === 'en' || saved === 'ko') return saved;
    var nav = (navigator.language || navigator.userLanguage || 'ko').toLowerCase();
    return nav.indexOf('ko') === 0 ? 'ko' : 'en';
  }

  /* ---------- 토글 알약 위치 ---------- */
  var langBox = document.querySelector('.lang');
  var pill = langBox ? langBox.querySelector('.lang__pill') : null;
  function placePill() {
    if (!pill) return;
    var b = langBox.querySelector('.lang__btn.is-active');
    if (!b) return;
    pill.style.width = b.offsetWidth + 'px';
    pill.style.transform = 'translateX(' + b.offsetLeft + 'px)';
    if (!pill.classList.contains('is-ready')) {
      requestAnimationFrame(function () { requestAnimationFrame(function () { pill.classList.add('is-ready'); }); });
    }
  }
  document.addEventListener('langchange', placePill);
  window.addEventListener('resize', placePill);
  window.addEventListener('load', placePill);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(placePill);

  /* ---------- 사용자가 눌러서 바꿀 때: 본문 페이드스루 ---------- */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function switchTo(lang) {
    if (lang === current) return;
    if (reduceMotion) { apply(lang); return; }
    document.body.classList.add('is-lang-switching');
    setTimeout(function () {
      apply(lang);
      requestAnimationFrame(function () { requestAnimationFrame(function () { document.body.classList.remove('is-lang-switching'); }); });
    }, 150);
  }
  document.querySelectorAll('.lang__btn').forEach(function (b) {
    b.addEventListener('click', function () { switchTo(b.getAttribute('data-lang')); });
  });

  window.CONNECTLY_I18N = { apply: apply, t: t, msg: msg, get lang() { return current; } };

  var initial = detect();
  if (initial !== DEFAULT) apply(initial);
  else apply(DEFAULT);
})();
