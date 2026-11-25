/* =========================================================
   CONNECTLY — main.js
   헤더 스크롤 / 모바일 메뉴 / 등장 애니메이션 / 숫자 카운터 / 문의 폼
   ========================================================= */
(function () {
  'use strict';

  var header = document.getElementById('header');
  var I18N = window.CONNECTLY_I18N;
  function msg(key) { return I18N ? I18N.msg(key) : ''; }
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');

  /* ---------- 헤더: 스크롤 시 배경 ---------- */
  function onScroll() {
    if (window.scrollY > 12) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 모바일 메뉴 ---------- */
  function closeNav() {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', msg('menuOpen'));
    document.body.style.overflow = '';
    document.body.classList.remove('nav-open');
  }
  toggle.addEventListener('click', function () {
    var open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? msg('menuClose') : msg('menuOpen'));
    document.body.style.overflow = open ? 'hidden' : '';
    document.body.classList.toggle('nav-open', open);
  });
  toggle.setAttribute('aria-label', msg('menuOpen'));
  document.addEventListener('langchange', function () {
    var open = nav.classList.contains('is-open');
    toggle.setAttribute('aria-label', open ? msg('menuClose') : msg('menuOpen'));
  });
  nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
  window.addEventListener('resize', function () { if (window.innerWidth > 900) closeNav(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });

  /* ---------- 히어로 배경 고리: 정확한 경로 길이, 화면 밖이면 정지 ---------- */
  var hero = document.querySelector('.hero');
  var loop = hero && hero.querySelector('.hero__loop');
  if (loop) {
    var loopPath = loop.querySelector('path');
    try { loop.style.setProperty('--loop-len', String(Math.round(loopPath.getTotalLength()))); } catch (e) {}
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { hero.classList.toggle('is-offscreen', !en.isIntersecting); });
      }, { threshold: 0 }).observe(hero);
    }
  }

  /* ---------- 연결 지도: 화면 가운데에 온 항목의 연결선을 켠다 ---------- */
  var whyMap = document.querySelector('.why__map');
  var whyItems = document.querySelectorAll('.why__item[data-map]');
  if (whyMap && whyItems.length) {
    var MAP_NODES = {
      1: ['sup', 'buyer'], 2: ['buyer', 'cons'], 3: ['staff', 'part'],
      4: ['sup', 'buyer', 'cons', 'part', 'staff', 'brand']
    };
    var mapCurrent = 0;
    function setMap(n) {
      if (n === mapCurrent) return;
      mapCurrent = n;
      whyMap.classList.remove('is-1', 'is-2', 'is-3', 'is-4');
      if (n) whyMap.classList.add('is-' + n);
      whyItems.forEach(function (li) { li.classList.toggle('is-active', parseInt(li.getAttribute('data-map'), 10) === n); });
      var list = whyItems[0] && whyItems[0].parentNode;
      if (list) list.classList.toggle('has-active', !!n);
      var on = MAP_NODES[n] || [];
      whyMap.querySelectorAll('.why__map-node').forEach(function (g) {
        var id = (g.className.baseVal || '').replace(/.*\bn-(\w+).*/, '$1');
        g.classList.toggle('is-on', on.indexOf(id) !== -1);
      });
    }
    var narrow = window.matchMedia('(max-width: 900px)');
    if (narrow.matches || !('IntersectionObserver' in window)) {
      /* 모바일: 지도가 보이는 동안 1→4 를 순환 */
      var cycle = 1, cycleTimer = null;
      setMap(1);
      function startCycle() { if (cycleTimer) return; cycleTimer = setInterval(function () { cycle = cycle % 4 + 1; setMap(cycle); }, 2400); }
      function stopCycle() { clearInterval(cycleTimer); cycleTimer = null; }
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          entries.forEach(function (en) { if (en.isIntersecting) startCycle(); else stopCycle(); });
        }, { threshold: 0.3 }).observe(whyMap);
      } else { startCycle(); }
    } else {
      setMap(1);
      var mio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) setMap(parseInt(en.target.getAttribute('data-map'), 10)); });
      }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
      whyItems.forEach(function (li) { mio.observe(li); });
    }
  }

  /* ---------- 앵커 이동 시 헤더 높이 보정 ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: top, behavior: 'smooth' });
      history.replaceState(null, '', id);
    });
  });

  /* ---------- 등장 애니메이션 ---------- */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fadeEls = document.querySelectorAll('.fade-up');
  /* 인트로가 진행 중이면 히어로의 등장은 인트로가 끝난 뒤 순서대로 */
  var introRunning = document.body.classList.contains('is-intro') && document.getElementById('intro');
  if (introRunning) {
    var heroFades = Array.prototype.slice.call(document.querySelectorAll('.hero .fade-up'));
    fadeEls = Array.prototype.filter.call(fadeEls, function (el) { return heroFades.indexOf(el) === -1; });
    document.addEventListener('introdone', function () {
      heroFades.forEach(function (el, i) { setTimeout(function () { el.classList.add('is-visible'); }, 80 + i * 110); });
    });
  }
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    fadeEls.forEach(function (el) { io.observe(el); });
  } else {
    fadeEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- 숫자 오도미터 ----------
     data-count 의 각 자릿수를 0~9 두 바퀴짜리 기둥으로 만들고, 한 바퀴를 돌아 목표 숫자에
     스프링으로 멈추게 한다(살짝 넘겼다 돌아옴). 뒤의 "+" 는 멈춘 뒤 튀어나온다. */
  var cssRoot = getComputedStyle(document.documentElement);
  var SPR_NUM = (cssRoot.getPropertyValue('--m-expressive-spatial-default') || '').trim() || 'cubic-bezier(0.34,1.15,0.64,1)';
  var canWaapi = typeof document.body.animate === 'function';

  function formatCount(el) {
    var n = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(n)) return null;
    return el.getAttribute('data-sep') === 'true' ? n.toLocaleString('en-US') : String(n);
  }
  function buildOdometer(el) {
    var end = formatCount(el);
    if (end === null) return null;
    el.textContent = '';
    el.classList.add('odo');
    var sr = document.createElement('span'); sr.className = 'sr-only'; sr.textContent = end;
    el.appendChild(sr);
    var rolls = [];
    for (var i = 0; i < end.length; i++) {
      var ch = end.charAt(i);
      if (!/\d/.test(ch)) { var sep = document.createElement('span'); sep.className = 'odo__sep'; sep.textContent = ch; sep.setAttribute('aria-hidden', 'true'); el.appendChild(sep); continue; }
      var d = parseInt(ch, 10);
      var col = document.createElement('span'); col.className = 'odo__col'; col.setAttribute('aria-hidden', 'true');
      var roll = document.createElement('span'); roll.className = 'odo__roll';
      for (var n = 0; n < 20; n++) {
        var sp = document.createElement('span'); sp.className = 'odo__d'; sp.textContent = String(n % 10);
        roll.appendChild(sp);
      }
      col.appendChild(roll); el.appendChild(col);
      rolls.push({ el: roll, target: 10 + d });
    }
    return rolls;
  }

  function animateCount(el) {
    var end = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(end)) return;
    var wrapNum = el.closest('.stat__num, .capability__tiles strong');
    if (reduceMotion || !canWaapi) {
      el.textContent = formatCount(el) || String(end);
      if (wrapNum) wrapNum.classList.remove('is-pending');
      return;
    }
    var rolls = buildOdometer(el);
    if (!rolls) return;
    var longest = 0;
    rolls.forEach(function (r, i) {
      var dur = 1100 + i * 110;
      longest = Math.max(longest, dur);
      r.el.animate(
        [{ transform: 'translateY(0)' }, { transform: 'translateY(' + (-r.target * 1.1) + 'em)' }],
        { duration: dur, easing: SPR_NUM, fill: 'forwards' }
      );
    });
    if (wrapNum) setTimeout(function () { wrapNum.classList.remove('is-pending'); }, longest - 250);
  }
  var counters = document.querySelectorAll('[data-count]');
  counters.forEach(function (el) {
    var w = el.closest('.stat__num, .capability__tiles strong');
    if (w && w.querySelector('em')) w.classList.add('is-pending');
    if (!reduceMotion && canWaapi) el.textContent = '0';
  });
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCount(en.target); cio.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- 문의 폼 ----------
     Web3Forms(https://web3forms.com) 로 제출 → contact@connectly.co.kr 로 메일 전달.
     JS 가 꺼져 있으면 form 의 action/method 로 일반 제출되어 Web3Forms 결과 페이지로 이동한다. */
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');
  var submitBtn = form ? form.querySelector('button[type="submit"]') : null;

  function setNote(msg, cls) {
    note.textContent = msg;
    note.className = 'form__note' + (cls ? ' ' + cls : '');
  }

  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = true;
    form.querySelectorAll('.field').forEach(function (f) { f.classList.remove('is-invalid'); });
    form.querySelectorAll('[required]').forEach(function (input) {
      var ok = input.type === 'checkbox' ? input.checked : (input.value.trim() !== '' && (input.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)));
      if (!ok) { valid = false; input.closest('.field').classList.add('is-invalid'); }
    });
    if (!valid) { setNote(msg('required'), 'is-err'); return; }
    if (form.querySelector('[name="botcheck"]').checked) return; /* 스팸 봇 */

    var topicEl = form.querySelector('#topic');
    var topic = topicEl ? topicEl.options[topicEl.selectedIndex].text : '';
    var fd = new FormData(form);
    fd.delete('botcheck');
    fd.delete('agree');
    fd.set('topic', topic);
    fd.set('subject', msg('subject') + ' ' + topic + ' - ' + (fd.get('name') || ''));
    fd.set('replyto', fd.get('email') || '');

    submitBtn.disabled = true;
    setNote(msg('sending'), '');
    fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd, headers: { 'Accept': 'application/json' } })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok && j.success, j: j }; }); })
      .then(function (res) {
        if (res.ok) {
          if (typeof window.gtag === 'function') window.gtag('event', 'generate_lead', { form: 'contact', topic: topic });
          form.reset(); setNote(msg('sent'), 'is-ok');
        }
        else { setNote(msg('failed'), 'is-err'); }
      })
      .catch(function () { setNote(msg('failed'), 'is-err'); })
      .then(function () { submitBtn.disabled = false; });
  });

  /* ---------- 연도 ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
})();
