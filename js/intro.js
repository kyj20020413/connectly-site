/* =========================================================
   CONNECTLY — intro.js
   히어로 인트로
     1) 흩어진 점들이 떠다니며 가까운 점끼리 선으로 이어짐 (연결)
     2) 점들이 로고의 ∞ 고리 경로로 차례로 날아가 모이고, 선이 고리 윤곽이 됨 (무한)
     3) 점·선이 진짜 로고 획으로 바뀜 → C-O 자리로 튕겨 들어가며 CONNECTLY 워드마크가 펼쳐짐
     4) 글자가 사라지고 ∞ 만 남아, 히어로 배경에서 돌고 있는 고리 자리로 들어가며 막이 걷힘
   - 탭(세션)당 1회. ?intro=1 을 붙이면 항상 재생 (검토용)
   - 움직임 줄이기 설정·딥링크(#about 등)·WAAPI 미지원 시 생략
   - 아무 곳이나 클릭하거나 Esc/Enter/Space 로 건너뜀
   - 끝나면 document 에 'introdone' 이벤트 (main.js 가 히어로 등장을 이어받음)
   ========================================================= */
(function () {
  'use strict';

  var intro = document.getElementById('intro');
  var body = document.body;
  if (!intro) { body.classList.remove('is-intro'); return; }

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var force = /[?&]intro=1(&|$)/.test(location.search);
  var seen = false;
  try { seen = sessionStorage.getItem('connectly.intro') === '1'; } catch (e) {}
  var deep = location.hash && location.hash !== '#' && location.hash !== '#hero';
  var canAnimate = typeof intro.animate === 'function';

  function finish(skipped) {
    if (!intro.parentNode) return;
    stopLoop();
    body.classList.remove('is-intro');
    intro.remove();
    document.dispatchEvent(new CustomEvent('introdone', { detail: { skipped: !!skipped } }));
  }

  if (reduce || (seen && !force) || deep || !canAnimate) { finish(true); return; }
  try { sessionStorage.setItem('connectly.intro', '1'); } catch (e) {}

  /* ---------- 이징 (style.css 의 스프링 토큰) ---------- */
  var cs = getComputedStyle(document.documentElement);
  function ease(name, fallback) { var v = cs.getPropertyValue(name).trim(); return v || fallback; }
  var SPR_SLOW = ease('--m-expressive-spatial-slow', 'cubic-bezier(0.34,1.15,0.64,1)');
  var EFF = ease('--m-effects-default', 'ease-out');
  var EFF_SLOW = ease('--m-effects-slow', 'ease-out');
  var STD = 'cubic-bezier(0.4, 0, 0.2, 1)';

  /* ---------- 요소 ---------- */
  var canvas = intro.querySelector('.intro__net');
  var logo = intro.querySelector('.intro__logo');
  var word = intro.querySelector('.intro__word');
  var wrap = intro.querySelector('.intro__markwrap');
  var path = intro.querySelector('.intro__mark path');
  var heroLoop = document.querySelector('.hero__loop');

  var anims = [], timers = [], done = false, raf = 0;
  function run(el, kf, opt) { var a = el.animate(kf, Object.assign({ fill: 'both' }, opt)); anims.push(a); return a; }
  function at(ms, fn) { timers.push(setTimeout(fn, ms)); }
  function stopLoop() { if (raf) cancelAnimationFrame(raf); raf = 0; }

  /* ---------- 기하: 마크(316×169)는 워드마크(1280×169)의 왼쪽 316/1280 ---------- */
  var box = logo.getBoundingClientRect();
  var slotW = box.width * 316 / 1280;
  var bigH = Math.min(190, window.innerHeight * 0.24, box.width * 0.66 * 169 / 316);
  var S = bigH / box.height;
  var dx = box.width / 2 - slotW / 2;
  var bigT = 'translate(' + dx + 'px, 0px) scale(' + S + ')';
  var slotT = 'translate(0px, 0px) scale(1)';

  /* 큰 상태의 마크 위치를 먼저 잡아 두고(투명), 점들의 목표 좌표를 거기서 읽는다 */
  wrap.style.transform = bigT;
  wrap.style.opacity = '0';
  var markRect = wrap.getBoundingClientRect();
  var sx = markRect.width / 316, sy = markRect.height / 169;
  var L = path.getTotalLength();

  /* ---------- 시간표 (ms) ---------- */
  var T_LINK = 350;     /* 선 이어지기 시작 */
  var T_CONV = 1350;    /* 수렴 시작 (경로 순서대로 650ms 에 걸쳐 출발) */
  var T_STAGGER = 650;
  var T_STROKE = 2450;  /* 진짜 획이 나타나고 점·선은 사라짐 */
  var T_SLOT = 2950;    /* C-O 자리로 튕겨 들어감 */
  var T_WIPE = 3160;    /* 워드마크 펼침 */
  var T_MARKOUT = 3600; /* 그려진 획은 워드마크 속 C-O 로 바뀜 */
  var T_SPLIT = 4450;   /* 글자가 사라지고 ∞ 만 남음 */
  var T_FLY = 4800;     /* ∞ 가 히어로 배경 고리 자리로 */

  /* ---------- 캔버스 네트워크 ---------- */
  var ctx = canvas.getContext('2d');
  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var W = window.innerWidth, H = window.innerHeight;
  canvas.width = W * DPR; canvas.height = H * DPR;
  canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
  ctx.scale(DPR, DPR);

  var N = W < 600 ? 56 : 84;
  var LINK_D = W < 600 ? 92 : 120;
  var COLORS = ['139,108,255', '34,211,238', '255,255,255', '139,108,255', '34,211,238'];
  var pts = [];
  var cx = markRect.left + markRect.width / 2, cy = markRect.top + markRect.height / 2;
  var spreadX = Math.min(W * 0.46, 620), spreadY = Math.min(H * 0.40, 340);
  var i, p;
  for (i = 0; i < N; i++) {
    var ang = Math.random() * Math.PI * 2, rad = Math.sqrt(Math.random());
    p = {
      x: cx + Math.cos(ang) * rad * spreadX,
      y: cy + Math.sin(ang) * rad * spreadY,
      vx: (Math.random() - 0.5) * 0.05,
      vy: (Math.random() - 0.5) * 0.05,
      r: Math.random() < 0.14 ? 3.4 : 2.1,
      c: COLORS[i % COLORS.length],
      tx: 0, ty: 0, order: i, start: 0, arrived: false
    };
    pts.push(p);
  }
  /* 목표: 경로 위 N 개 지점. 점은 무작위로 섞어 배정하되, 출발 시각은 경로 순서(order) 를 따른다 → 획을 긋듯 모임 */
  var shuffled = pts.slice().sort(function () { return Math.random() - 0.5; });
  for (i = 0; i < N; i++) {
    var pt = path.getPointAtLength(L * i / (N - 1));
    shuffled[i].tx = markRect.left + pt.x * sx;
    shuffled[i].ty = markRect.top + pt.y * sy;
    shuffled[i].order = i;
    shuffled[i].start = T_CONV + T_STAGGER * i / (N - 1);
  }
  var byOrder = pts.slice().sort(function (a, b) { return a.order - b.order; });

  var OMEGA = 0.017, ZETA = 0.68;   /* 점의 스프링: 주기 약 370ms, 살짝 넘겼다 돌아옴 */
  var t0 = performance.now(), last = t0;

  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  function frame(now) {
    var t = now - t0;
    var dt = Math.min(34, now - last); last = now;
    ctx.clearRect(0, 0, W, H);

    var dotsIn = clamp01(t / 500);
    var linkIn = clamp01((t - T_LINK) / 700);
    var fadeOut = 1 - clamp01((t - T_STROKE) / 420);     /* 획이 나타나면 점·선은 사라짐 */
    if (fadeOut <= 0) { stopLoop(); ctx.clearRect(0, 0, W, H); return; }

    var k;
    for (k = 0; k < N; k++) {
      p = pts[k];
      if (t < p.start) {
        /* 떠다니기: 가운데로 아주 약하게 당기고, 가장자리에서 되돌아옴 */
        p.vx += (cx - p.x) * 0.00000012 * dt;
        p.vy += (cy - p.y) * 0.00000012 * dt;
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.x < 16 || p.x > W - 16) p.vx *= -1;
        if (p.y < 16 || p.y > H - 16) p.vy *= -1;
      } else {
        /* 스프링으로 목표 지점에 */
        var ax = -OMEGA * OMEGA * (p.x - p.tx) - 2 * ZETA * OMEGA * p.vx;
        var ay = -OMEGA * OMEGA * (p.y - p.ty) - 2 * ZETA * OMEGA * p.vy;
        p.vx += ax * dt; p.vy += ay * dt;
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (!p.arrived && Math.abs(p.x - p.tx) < 1.5 && Math.abs(p.y - p.ty) < 1.5) p.arrived = true;
      }
    }

    /* 선: 가까운 점끼리 */
    ctx.lineWidth = 1;
    if (linkIn > 0) {
      for (k = 0; k < N; k++) {
        var a = pts[k];
        for (var m = k + 1; m < N; m++) {
          var b = pts[m];
          var ddx = a.x - b.x, ddy = a.y - b.y;
          var d2 = ddx * ddx + ddy * ddy;
          if (d2 > LINK_D * LINK_D) continue;
          var d = Math.sqrt(d2);
          var alpha = (1 - d / LINK_D) * 0.42 * linkIn * fadeOut;
          ctx.strokeStyle = 'rgba(' + (k % 2 ? '34,211,238' : '139,108,255') + ',' + alpha.toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    /* 선: 경로 순서로 이웃한 점끼리 — 도착할수록 또렷해져 고리 윤곽이 됨 */
    if (t > T_CONV) {
      ctx.lineWidth = 2;
      for (k = 0; k < N - 1; k++) {
        var q1 = byOrder[k], q2 = byOrder[k + 1];
        var near1 = 1 - clamp01((Math.abs(q1.x - q1.tx) + Math.abs(q1.y - q1.ty)) / 40);
        var near2 = 1 - clamp01((Math.abs(q2.x - q2.tx) + Math.abs(q2.y - q2.ty)) / 40);
        var al = Math.min(near1, near2) * 0.9 * fadeOut;
        if (al <= 0.01) continue;
        ctx.strokeStyle = 'rgba(255,255,255,' + al.toFixed(3) + ')';
        ctx.beginPath(); ctx.moveTo(q1.x, q1.y); ctx.lineTo(q2.x, q2.y); ctx.stroke();
      }
    }

    /* 점 */
    for (k = 0; k < N; k++) {
      p = pts[k];
      var glow = p.arrived ? 1.35 : 1;
      ctx.fillStyle = 'rgba(' + p.c + ',' + (0.95 * dotsIn * fadeOut).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * glow, 0, Math.PI * 2); ctx.fill();
      if (p.r > 3) {
        ctx.fillStyle = 'rgba(' + p.c + ',' + (0.18 * dotsIn * fadeOut).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3.2, 0, Math.PI * 2); ctx.fill();
      }
    }

    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  /* ---------- 획 → 워드마크 → ∞ 만 남김 → 히어로 배경 고리로 ---------- */
  at(T_STROKE, function () {
    run(wrap, [{ opacity: 0 }, { opacity: 1 }], { duration: 420, easing: EFF });
  });
  at(T_SLOT, function () {
    run(wrap, [{ transform: bigT }, { transform: slotT }], { duration: 720, easing: SPR_SLOW });
  });
  at(T_WIPE, function () {
    run(word, [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }], { duration: 680, easing: STD });
  });
  at(T_MARKOUT, function () {
    run(wrap, [{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: EFF });
  });
  /* 글자가 사라지고 그려진 ∞ 가 같은 자리에 다시 나타남 */
  at(T_SPLIT, function () {
    run(word, [{ opacity: 1 }, { opacity: 0 }], { duration: 320, easing: EFF });
    run(wrap, [{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: EFF });
  });
  at(T_FLY, fly);

  function fly() {
    if (done) return;
    done = true;
    stopLoop();

    var dur = 900;
    var moved = false;
    if (heroLoop) {
      var from = wrap.getBoundingClientRect();           /* 슬롯 상태(워드마크 속 C-O 자리) */
      var to = heroLoop.getBoundingClientRect();         /* 히어로 배경에서 돌고 있는 고리 */
      if (from.width > 0 && to.width > 0) {
        var sc = to.width / from.width;
        var tx = (to.left + to.width / 2) - (from.left + from.width / 2);
        var ty = (to.top + to.height / 2) - (from.top + from.height / 2);
        run(wrap, [{ transform: slotT }, { transform: 'translate(' + tx + 'px, ' + ty + 'px) scale(' + sc + ')' }], { duration: dur, easing: SPR_SLOW });
        /* 굵은 흰 획이 배경 고리의 가는 윤곽선 굵기로 */
        run(path, [{ strokeWidth: 30 }, { strokeWidth: 8 }], { duration: dur, easing: STD });
        moved = true;
      }
    }
    if (!moved) run(wrap, [{ opacity: 1 }, { opacity: 0 }], { duration: 400, easing: EFF });

    /* 막이 걷히며 흰 획은 배경 고리의 희미한 윤곽선으로 바뀐다 */
    at(dur - 260, function () {
      body.classList.remove('is-intro');
      run(intro, [{ opacity: 1 }, { opacity: 0 }], { duration: 560, easing: EFF_SLOW });
    });
    at(dur + 320, function () { finish(false); });
  }

  /* ---------- 건너뛰기 ---------- */
  function skipNow() {
    if (done) return;
    done = true;
    stopLoop();
    timers.forEach(clearTimeout);
    anims.forEach(function (a) { try { a.cancel(); } catch (e) {} });
    body.classList.remove('is-intro');
    var a = intro.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 240, easing: EFF, fill: 'both' });
    a.onfinish = function () { finish(true); };
    setTimeout(function () { finish(true); }, 400);
  }
  intro.addEventListener('click', skipNow);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') skipNow();
  }, { once: true });

  /* 안전장치 */
  setTimeout(function () { if (intro.parentNode) finish(true); }, 9000);
})();
