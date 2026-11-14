/* =========================================================
   shautech — main.js · © 2026 shautech. All rights reserved.
   Vanilla JS, zero dependencies, works from file://
   ========================================================= */
(function () {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;
  const io = (cb, opts) => new IntersectionObserver(cb, opts);
  const safe = fn => { try { fn(); } catch (e) { console.error('[shautech]', e); } };
  document.documentElement.classList.remove('no-js');

  /* ---------------------------------------------------------
     1. BOOT SEQUENCE
  --------------------------------------------------------- */
  const boot = $('#boot'), bootLog = $('#bootLog'), bootBar = $('#bootBar');
  document.body.classList.add('boot-lock');
  const bootLines = [
    ['dim', 'shautech os 2.0 · booting'],
    ['ok', '[ ok ] identity        entra id · 412/412 users'],
    ['ok', '[ ok ] endpoints       intune · defender · healthy'],
    ['ok', '[ ok ] mail flow       exchange online · 0 queued'],
    ['ok', '[ ok ] backups         last run 02:00 · verified'],
    ['acc', 'ready. bringing order →']
  ];
  function runBoot() {
    if (reduce) { finishBoot(); return; }
    let i = 0;
    const step = () => {
      if (i < bootLines.length) {
        const [cls, txt] = bootLines[i++];
        const s = document.createElement('span');
        s.className = cls; s.textContent = txt + '\n';
        bootLog.appendChild(s);
        bootBar.style.width = (i / bootLines.length * 100) + '%';
        setTimeout(step, i === bootLines.length ? 420 : 140 + Math.random() * 120);
      } else finishBoot();
    };
    setTimeout(step, 180);
  }
  function finishBoot() {
    boot.classList.add('done');
    document.body.classList.remove('boot-lock');
    document.body.classList.add('ready');
    setTimeout(() => { const ht = $('#heroTitle'); if (ht) ht.classList.add('in'); $$('.hero [data-reveal]').forEach(e => e.classList.add('in')); }, 250);
    setTimeout(() => chaos && chaos.intro(), 900);
    setTimeout(() => boot.remove(), 1500);
  }

  /* ---------------------------------------------------------
     2. CUSTOM CURSOR
  --------------------------------------------------------- */
  const cursor = $('#cursor'), cursorLabel = $('#cursorLabel');
  let cx = innerWidth / 2, cy = innerHeight / 2, rx = cx, ry = cy;
  if (finePointer && !reduce) {
    document.body.classList.add('has-cursor');
    addEventListener('pointermove', e => { cx = e.clientX; cy = e.clientY; }, { passive: true });
    document.addEventListener('mouseleave', () => cursor.classList.add('is-hidden'));
    document.addEventListener('mouseenter', () => cursor.classList.remove('is-hidden'));
    (function loopCursor() {
      rx = lerp(rx, cx, .22); ry = lerp(ry, cy, .22);
      cursor.style.transform = `translate(${rx}px,${ry}px)`;
      requestAnimationFrame(loopCursor);
    })();
    document.addEventListener('pointerover', e => {
      const t = e.target.closest('[data-hover], a, button');
      const lab = e.target.closest('[data-cursor]');
      cursor.classList.toggle('is-hover', !!t);
      if (lab) { cursorLabel.textContent = lab.dataset.cursor; cursor.classList.add('is-label'); }
      else cursor.classList.remove('is-label');
      cursor.classList.toggle('is-drag', !!e.target.closest('.compare'));
    });
  }

  /* ---------------------------------------------------------
     3. NAV
  --------------------------------------------------------- */
  const nav = $('#nav'), navProgress = $('#navProgress'), burger = $('#burger'), navLinks = $('#navLinks');
  const sections = $$('main section[id]');
  const linkMap = new Map($$('.nav__links a').map(a => [a.getAttribute('href').slice(1), a]));
  function onScroll() {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    nav.classList.toggle('scrolled', y > 24);
    navProgress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      burger.classList.toggle('open', open); burger.setAttribute('aria-expanded', String(open));
    });
    navLinks.addEventListener('click', e => { if (e.target.tagName === 'A') { navLinks.classList.remove('open'); burger.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); } });
  }
  sections.forEach(s => io(entries => entries.forEach(en => {
    const a = linkMap.get(en.target.id); if (!a) return;
    if (en.isIntersecting) { $$('.nav__links a').forEach(x => x.classList.remove('active')); a.classList.add('active'); }
  }), { rootMargin: '-40% 0px -55% 0px' }).observe(s));

  /* ---------------------------------------------------------
     4. SPLIT TEXT (kinetic headlines)
  --------------------------------------------------------- */
  $$('.split').forEach(el => {
    const nodes = Array.from(el.childNodes);
    el.innerHTML = '';
    let d = 0;
    const addWord = (text, parent) => {
      text.split(/(\s+)/).forEach(tok => {
        if (!tok) return;
        if (/^\s+$/.test(tok)) { parent.appendChild(document.createTextNode(' ')); return; }
        const w = document.createElement('span'); w.className = 'w';
        for (const ch of tok) { const c = document.createElement('span'); c.className = 'c'; c.textContent = ch; c.style.setProperty('--d', d); d += 22; w.appendChild(c); }
        parent.appendChild(w);
      });
    };
    nodes.forEach(n => {
      if (n.nodeType === 3) addWord(n.textContent, el);
      else { const wrap = n.cloneNode(false); addWord(n.textContent, wrap); el.appendChild(wrap); }
    });
  });

  /* ---------------------------------------------------------
     5. REVEAL ON SCROLL
  --------------------------------------------------------- */
  const revealIO = io(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add('in');
    if (en.target.classList.contains('split')) en.target.classList.add('in');
    revealIO.unobserve(en.target);
  }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  $$('[data-reveal], .split:not(#heroTitle)').forEach(el => { if (!el.closest('.hero')) revealIO.observe(el); });

  /* ---------------------------------------------------------
     6. CHAOS → ORDER PARTICLE ENGINE (hero)
  --------------------------------------------------------- */
  const chaos = (function () {
    const canvas = $('#chaos'); if (!canvas) return null;
    const ctx = canvas.getContext('2d', { alpha: true });
    const hero = $('#hero'), hint = $('#heroHint'), meter = $('#orderMeter');
    const WORD = 'chaos';
    const MAX = finePointer ? 4200 : 2400;
    let W = 0, H = 0, P = [], t = 0, order = 1, target = 1, scrollOrder = 0, raf = null, visible = true, introDone = false;
    const mouse = { x: -1e4, y: -1e4, r: finePointer ? 170 : 130, down: false };
    const palette = [
      'rgba(165,172,190,.80)', 'rgba(160,175,205,.85)', 'rgba(120,165,230,.9)',
      'rgba(77,159,255,.95)', 'rgba(130,195,255,1)', 'rgba(185,222,255,1)'
    ];
    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }
    function build() {
      const oc = document.createElement('canvas'); oc.width = W; oc.height = H;
      const o = oc.getContext('2d');
      // fit the word in the free band between the headline block and the lead/CTA block
      const cr = canvas.getBoundingClientRect();
      const topEl = hero.querySelector('.hero__top'), botEl = hero.querySelector('.hero__bottom');
      const bandTop = topEl ? topEl.getBoundingClientRect().bottom - cr.top : H * 0.3;
      const bandBot = botEl ? botEl.getBoundingClientRect().top - cr.top : H * 0.7;
      const gap = Math.max(80, bandBot - bandTop);
      const fs = Math.min(W * 0.30, gap * 1.15);
      const cy = (bandTop + bandBot) / 2;
      o.font = `700 ${fs}px "Space Grotesk", system-ui, sans-serif`;
      o.textAlign = 'center'; o.textBaseline = 'middle'; o.fillStyle = '#fff';
      o.fillText(WORD, W / 2, cy);
      const d = o.getImageData(0, 0, W, H).data;
      const step = Math.max(3, Math.round(fs / 62));
      const pts = [];
      for (let y = 0; y < H; y += step) for (let x = 0; x < W; x += step)
        if (d[(y * W + x) * 4 + 3] > 120) pts.push([x, y]);
      let sel = pts;
      if (pts.length > MAX) { const stride = pts.length / MAX; sel = []; for (let i = 0; i < MAX; i++) sel.push(pts[Math.floor(i * stride)]); }
      const keep = P.length === sel.length;
      P = sel.map(([tx, ty], i) => {
        const o = keep ? P[i] : null;
        return { x: o ? o.x : Math.random() * W, y: o ? o.y : Math.random() * H, vx: o ? o.vx : 0, vy: o ? o.vy : 0, tx, ty, j: Math.random() * 6.28 };
      });
    }
    function frame() {
      raf = null;
      if (!visible) return;
      t += 0.009;
      target = Math.max(scrollOrder, mouse.down ? 1 : 0, introDone ? 0 : 1);
      order += (target - order) * 0.045;
      ctx.clearRect(0, 0, W, H);
      const mx = mouse.x, my = mouse.y, r = mouse.r, r2 = r * r;
      const buckets = [[], [], [], [], [], []];
      for (let i = 0; i < P.length; i++) {
        const p = P[i];
        const dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
        let m = 0;
        if (d2 < r2) { m = 1 - Math.sqrt(d2) / r; m = m * m * (3 - 2 * m); }
        const k = Math.min(1, order + m * (1 - order));
        const a = Math.sin(p.x * 0.005 + t * 1.4) + Math.cos(p.y * 0.0045 - t * 1.1) + Math.sin((p.x + p.y) * 0.0025 + t * 0.7 + p.j);
        const ck = 1 - k;
        p.vx += Math.cos(a * 2.2) * 0.42 * ck + (p.tx - p.x) * 0.11 * k;
        p.vy += Math.sin(a * 1.8) * 0.42 * ck + (p.ty - p.y) * 0.11 * k;
        const damp = 0.84 + 0.11 * ck;
        p.vx *= damp; p.vy *= damp;
        p.x += p.vx; p.y += p.vy;
        if (p.x < -30) p.x = W + 30; else if (p.x > W + 30) p.x = -30;
        if (p.y < -30) p.y = H + 30; else if (p.y > H + 30) p.y = -30;
        buckets[Math.min(5, (k * 5.99) | 0)].push(p);
      }
      for (let b = 0; b < 6; b++) {
        const list = buckets[b]; if (!list.length) continue;
        ctx.fillStyle = palette[b];
        const s = 2.1 + b * 0.22, h = s / 2;
        for (let i = 0; i < list.length; i++) ctx.fillRect(list[i].x - h, list[i].y - h, s, s);
      }
      if (meter) meter.style.setProperty('--o', order.toFixed(3));
      raf = requestAnimationFrame(frame);
    }
    function start() { if (!raf && visible) raf = requestAnimationFrame(frame); }
    // pointer
    const setMouse = (x, y) => { const r = canvas.getBoundingClientRect(); mouse.x = x - r.left; mouse.y = y - r.top; };
    hero.addEventListener('pointermove', e => setMouse(e.clientX, e.clientY), { passive: true });
    hero.addEventListener('pointerleave', () => { mouse.x = -1e4; mouse.y = -1e4; });
    hero.addEventListener('touchstart', e => { const tt = e.touches[0]; setMouse(tt.clientX, tt.clientY); }, { passive: true });
    hero.addEventListener('touchmove', e => { const tt = e.touches[0]; setMouse(tt.clientX, tt.clientY); }, { passive: true });
    hero.addEventListener('touchend', () => { mouse.x = -1e4; mouse.y = -1e4; });
    hero.addEventListener('pointerdown', e => { if (e.target === canvas) { mouse.down = true; } });
    addEventListener('pointerup', () => { mouse.down = false; });
    // scroll → order
    const onS = () => {
      const h = hero.getBoundingClientRect();
      const travel = h.height - innerHeight;
      scrollOrder = travel > 0 ? clamp((-h.top) / (travel * 0.75), 0, 1) : 0;
      if (hint && scrollOrder > 0.15) hint.classList.remove('show');
    };
    addEventListener('scroll', onS, { passive: true }); onS();
    io(en => { visible = en[0].isIntersecting; if (visible) start(); }).observe(hero);
    let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 120); });
    if (document.fonts && document.fonts.load) document.fonts.load('700 100px "Space Grotesk"').then(resize).catch(resize); else resize();
    resize(); start();
    return {
      intro() {
        if (reduce) { introDone = true; return; }
        setTimeout(() => { introDone = true; setTimeout(() => hint && hint.classList.add('show'), 900); }, 1100);
      }
    };
  })();

  /* ---------------------------------------------------------
     7. BEFORE / AFTER COMPARE
  --------------------------------------------------------- */
  safe(function () {
    const cmp = $('#compare'); if (!cmp) return;
    const before = $('#cmpBefore'), after = $('#cmpAfter'), handle = $('#cmpHandle');
    const NS = 'http://www.w3.org/2000/svg';
    const rnd = (seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; })(20260610);
    const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

    /* BEFORE — the tangle */
    (function buildBefore() {
      const labels = ['AD 2008 R2', 'shared admin', 'no MFA', 'open RDP', 'flat network', 'USB backups', 'Excel inventory', 'ex-employee access', 'unpatched', 'shadow IT', 'EOL firewall', 'local admin everywhere', 'no docs', 'password123', 'print server?', 'legacy VPN', 'unknown owner', 'free AV', 'SMBv1', 'single DC', 'orphan mailbox', 'no logging', 'guest wifi = LAN', 'mystery NAS'];
      const warn = new Set(['no MFA', 'shared admin', 'open RDP', 'ex-employee access', 'password123', 'SMBv1', 'unpatched']);
      const COLS = 6, ROWS = 4, cw = 820 / COLS, ch = 440 / ROWS;
      const nodes = labels.map((l, i) => { const c = i % COLS, r = (i / COLS) | 0; return { l, x: 90 + (c + 0.5 + (rnd() - .5) * 0.75) * cw, y: 80 + (r + 0.5 + (rnd() - .5) * 0.75) * ch, i }; });
      let s = `<svg class="cmp-before" xmlns="${NS}" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">`;
      s += `<defs><filter id="blurB"><feGaussianBlur stdDeviation="1.2"/></filter></defs>`;
      // tangled links
      nodes.forEach((n, i) => {
        const links = 2 + Math.floor(rnd() * 3);
        for (let k = 0; k < links; k++) {
          const m = nodes[Math.floor(rnd() * nodes.length)]; if (m === n) continue;
          const c1x = n.x + (rnd() - .5) * 400, c1y = n.y + (rnd() - .5) * 400, c2x = m.x + (rnd() - .5) * 400, c2y = m.y + (rnd() - .5) * 400;
          const hue = 345 + rnd() * 40; const op = .25 + rnd() * .3;
          s += `<path class="tangle" d="M${n.x} ${n.y} C${c1x} ${c1y} ${c2x} ${c2y} ${m.x} ${m.y}" stroke="hsla(${hue},90%,62%,${op})" style="animation-duration:${4 + rnd() * 6}s;animation-direction:${rnd() > .5 ? 'reverse' : 'normal'}"/>`;
        }
      });
      // nodes
      nodes.forEach(n => {
        const w = warn.has(n.l);
        s += `<g class="bn${w ? ' warn' : ''}" style="--d:${(rnd() * 3).toFixed(2)}s">`;
        if (w) s += `<circle class="ring" cx="${n.x}" cy="${n.y}" r="9" style="--d:${(rnd() * 2).toFixed(2)}s"/>`;
        s += `<circle cx="${n.x}" cy="${n.y}" r="${w ? 7 : 5}"/>`;
        if (w) s += `<text class="bang" x="${n.x}" y="${n.y + 3.5}" text-anchor="middle">!</text>`;
        s += `<text x="${n.x + 12}" y="${n.y + 4}">${esc(n.l)}</text></g>`;
      });
      s += `<g transform="rotate(-8 250 555)"><rect class="stamp" x="130" y="535" width="240" height="40" rx="6"/><text class="stamp-text" x="250" y="561" text-anchor="middle">UNDOCUMENTED</text></g>`;
      s += `</svg>`;
      before.innerHTML = s;
    })();

    /* AFTER — hub & spoke */
    (function buildAfter() {
      const cx = 500, cy = 300, RX = 330, RY = 190;
      const spokes = ['Intune · endpoints', 'Defender · XDR', 'Exchange Online', 'SharePoint · Teams', 'Azure · landing zone', 'On-prem AD · Entra Connect', 'Backup · DR', 'Conditional Access'];
      let s = `<svg class="cmp-after" xmlns="${NS}" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">`;
      s += `<defs><linearGradient id="spokeGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4D9FFF"/><stop offset="1" stop-color="#7CF2C4"/></linearGradient></defs>`;
      for (let x = 0; x <= 1000; x += 50) s += `<line class="grid" x1="${x}" y1="0" x2="${x}" y2="600"/>`;
      for (let y = 0; y <= 600; y += 50) s += `<line class="grid" x1="0" y1="${y}" x2="1000" y2="${y}"/>`;
      const pts = spokes.map((l, i) => { const a = (i / spokes.length) * Math.PI * 2 - Math.PI / 2; return { l, x: cx + Math.cos(a) * RX, y: cy + Math.sin(a) * RY, i }; });
      pts.forEach(p => {
        s += `<path id="sp${p.i}" class="spoke" d="M${cx} ${cy} L${p.x} ${p.y}"/>`;
        s += `<circle class="packet" r="3.2"><animateMotion dur="${2.2 + p.i * 0.25}s" repeatCount="indefinite" begin="${(p.i * 0.35).toFixed(2)}s"><mpath href="#sp${p.i}"/></animateMotion></circle>`;
        s += `<circle class="packet" r="2.2" style="opacity:.6"><animateMotion dur="${3 + p.i * 0.2}s" repeatCount="indefinite" begin="${(p.i * 0.5 + 1).toFixed(2)}s" keyPoints="1;0" keyTimes="0;1" calcMode="linear"><mpath href="#sp${p.i}"/></animateMotion></circle>`;
      });
      pts.forEach(p => {
        const w = 12 + p.l.length * 7.2, h = 30;
        s += `<g class="node" transform="translate(${p.x - w / 2} ${p.y - h / 2})"><rect width="${w}" height="${h}" rx="9"/><circle class="ok" cx="14" cy="${h / 2}" r="3.5" style="--d:${(p.i * .25).toFixed(2)}s"/><text x="26" y="${h / 2 + 4}">${esc(p.l)}</text></g>`;
      });
      s += `<circle class="hub-ring2" cx="${cx}" cy="${cy}" r="86"/><circle class="hub-ring" cx="${cx}" cy="${cy}" r="66"/>`;
      s += `<circle class="hub" cx="${cx}" cy="${cy}" r="50"/><text class="hub-text" x="${cx}" y="${cy + 2}">Entra ID</text><text class="hub-sub" x="${cx}" y="${cy + 18}">IDENTITY · MFA · PIM</text>`;
      s += `<g transform="rotate(-6 760 555)"><rect class="stamp" x="590" y="535" width="340" height="40" rx="6"/><text class="stamp-text" x="760" y="561" text-anchor="middle">DOCUMENTED · MONITORED · 99.98%</text></g>`;
      s += `</svg>`;
      after.innerHTML = s;
    })();

    /* drag */
    let pos = 50, dragging = false, auto = null;
    const setPos = v => { pos = clamp(v, 2, 98); cmp.style.setProperty('--pos', pos + '%'); handle.setAttribute('aria-valuenow', Math.round(pos)); };
    const fromEvent = e => { const r = cmp.getBoundingClientRect(); setPos((e.clientX - r.left) / r.width * 100); };
    cmp.addEventListener('pointerdown', e => { dragging = true; cmp.classList.add('dragging'); cmp.setPointerCapture(e.pointerId); stopAuto(); fromEvent(e); });
    cmp.addEventListener('pointermove', e => { if (dragging) fromEvent(e); });
    const up = () => { dragging = false; cmp.classList.remove('dragging'); };
    cmp.addEventListener('pointerup', up); cmp.addEventListener('pointercancel', up);
    handle.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') { stopAuto(); setPos(pos - 4); } if (e.key === 'ArrowRight') { stopAuto(); setPos(pos + 4); } });
    function stopAuto() { if (auto) { cancelAnimationFrame(auto); auto = null; } }
    // teaser sweep on first view
    io((en, obs) => {
      if (!en[0].isIntersecting || reduce) return; obs.disconnect();
      const t0 = performance.now(), dur = 2600;
      const tick = now => {
        const p = clamp((now - t0) / dur, 0, 1);
        setPos(50 + Math.sin(p * Math.PI * 2) * 28 * (1 - p * 0.3));
        if (p < 1) auto = requestAnimationFrame(tick); else { setPos(50); auto = null; }
      };
      auto = requestAnimationFrame(tick);
    }, { threshold: .5 }).observe(cmp);
    setPos(50);
  });

  /* ---------------------------------------------------------
     8. SERVICES — live console
  --------------------------------------------------------- */
  safe(function () {
    const body = $('#consoleBody'), title = $('#consoleTitle'), stat = $('#consoleStat'); if (!body) return;
    const scripts = {
      m365: { title: 'shautech@core: ~/clients/northgate-ltd · pwsh', stat: 'identity 412/412 · mailboxes 142 migrated · 0 items lost', lines: [
        ['cmd', 'Connect-MgGraph -Scopes "Directory.Read.All","Policy.ReadWrite.ConditionalAccess"'],
        ['ok', '✔ Welcome · tenant northgate.onmicrosoft.com'],
        ['cmd', '(Get-MgUser -All).Count'],
        ['dim', '412'],
        ['cmd', 'New-CAPolicy -Name "Require MFA — all users" -State reportOnly'],
        ['ok', '✔ policy created · report-only · 0 lockouts predicted'],
        ['cmd', 'Start-MailboxMigration -Batch Wave-01 -Source "Exchange 2016" -Target ExchangeOnline'],
        ['dim', '  syncing  ████████████████████ 142/142'],
        ['ok', '✔ complete · 142 mailboxes · 0 items lost · 0 tickets']
      ]},
      infra: { title: 'shautech@core: ~/clients/northgate-ltd · bash', stat: 'sites 3/3 · vpn up · dc01 dc02 in sync · 0 alerts', lines: [
        ['cmd', 'ssh ops@fw-01 "show vpn tunnels"'],
        ['dim', 'hq ↔ branch-01   UP   latency 9ms\nhq ↔ branch-02   UP   latency 14ms\nhq ↔ azure-hub   UP   latency 6ms'],
        ['cmd', 'repadmin /replsummary'],
        ['ok', '✔ DC01 ↔ DC02 · 0 fails · last sync 00:02 ago'],
        ['cmd', 'ansible-playbook harden-servers.yml --check'],
        ['dim', 'PLAY RECAP  ok=38  changed=0  failed=0'],
        ['ok', '✔ network map exported → docs/network-2026.pdf'],
        ['dim', 'boring. in the best possible way.']
      ]},
      sec: { title: 'shautech@core: ~/clients/northgate-ltd · audit', stat: 'baseline CIS L1 · score 91/100 · MFA 100% · 0 legacy auth', lines: [
        ['cmd', 'Invoke-TenantAudit -Baseline CIS-L1 -ReadOnly'],
        ['dim', '  scanning identity · mail · endpoints · sharing · defender'],
        ['warn', '▲ legacy auth enabled for 3 service accounts'],
        ['warn', '▲ 2 global admins without PIM'],
        ['cmd', 'Invoke-Remediation -Plan .\\remediate.json -ChangeWindow "Sat 06:00"'],
        ['ok', '✔ MFA enforced · 412/412 · 0 users locked out'],
        ['ok', '✔ Defender baseline applied · 1,180 endpoints compliant'],
        ['ok', '✔ score 54 → 91 /100 · auditor-ready report attached']
      ]},
      auto: { title: 'shautech@core: ~/clients/northgate-ltd · automation', stat: 'weekly report 6h → 41s · onboarding 2 days → 11 min', lines: [
        ['cmd', '.\\Invoke-WeeklyReport.ps1 -Recipients finance@ -Format xlsx'],
        ['dim', '  licences · mailbox sizes · stale accounts · patch status'],
        ['ok', '✔ done in 00:00:41  (was 6 hours, every Monday)'],
        ['cmd', '.\\New-Starter.ps1 -Name "Ana Ionescu" -Dept Sales -Device Laptop'],
        ['dim', '  user ✓  licence ✓  groups ✓  mailbox ✓  autopilot ✓  welcome mail ✓'],
        ['ok', '✔ onboarded in 11 minutes · zero tickets'],
        ['cmd', 'crontab -l | grep cleanup'],
        ['dim', '0 2 * * 0  /opt/shautech/cleanup-stale.sh   # the job nobody wants to do twice']
      ]}
    };
    let token = 0, current = null;
    async function play(key) {
      if (key === current) return; current = key;
      const my = ++token, sc = scripts[key]; if (!sc) return;
      title.textContent = sc.title; stat.textContent = sc.stat; body.innerHTML = '';
      const sleep = ms => new Promise(r => setTimeout(r, ms));
      for (const [type, text] of sc.lines) {
        if (my !== token) return;
        if (type === 'cmd') {
          const line = document.createElement('div'); line.innerHTML = '<span class="p">❯ </span><span class="cmd"></span><span class="cur"></span>';
          body.appendChild(line); const tgt = line.querySelector('.cmd');
          if (reduce) tgt.textContent = text; else for (const ch of text) { if (my !== token) return; tgt.textContent += ch; await sleep(8 + Math.random() * 14); }
          line.querySelector('.cur').remove(); await sleep(reduce ? 0 : 220);
        } else {
          const line = document.createElement('div'); line.className = type; line.textContent = text; body.appendChild(line);
          await sleep(reduce ? 0 : 160 + Math.random() * 180);
        }
        body.scrollTop = body.scrollHeight;
      }
      const end = document.createElement('div'); end.innerHTML = '<span class="p">❯ </span><span class="cur"></span>'; body.appendChild(end);
    }
    const svcs = $$('.svc');
    const activate = el => { svcs.forEach(x => x.classList.remove('active')); el.classList.add('active'); play(el.dataset.svc); };
    svcs.forEach(s => io(entries => entries.forEach(en => { if (en.isIntersecting) activate(en.target); }), { rootMargin: '-40% 0px -40% 0px', threshold: 0 }).observe(s));
    svcs.forEach(s => s.addEventListener('click', () => activate(s)));
    io(en => { if (en[0].isIntersecting && !current) { svcs[0].classList.add('active'); play('m365'); } }, { threshold: .3 }).observe($('#console'));
  });

  /* ---------------------------------------------------------
     9. TEAM — holographic tilt
  --------------------------------------------------------- */
  if (finePointer && !reduce) $$('.holo').forEach(card => {
    const inner = $('.holo__inner', card);
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect(); const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      inner.style.setProperty('--ry', ((px - .5) * 14).toFixed(2) + 'deg');
      inner.style.setProperty('--rx', ((.5 - py) * 12).toFixed(2) + 'deg');
      inner.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
      inner.style.setProperty('--my', (py * 100).toFixed(1) + '%');
    });
    card.addEventListener('pointerleave', () => { inner.style.setProperty('--rx', '0deg'); inner.style.setProperty('--ry', '0deg'); });
  });

  /* ---------------------------------------------------------
     10. PROCESS — line draws with scroll
  --------------------------------------------------------- */
  safe(function () {
    const steps = $('#steps'); if (!steps) return;
    const items = $$('.step', steps);
    const tick = () => {
      const r = steps.getBoundingClientRect();
      const p = clamp((innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.25), 0, 1);
      steps.style.setProperty('--p', p.toFixed(3));
      items.forEach((s, i) => s.classList.toggle('lit', p >= (i + 0.6) / items.length));
    };
    addEventListener('scroll', tick, { passive: true }); addEventListener('resize', tick); tick();
  });

  /* ---------------------------------------------------------
     11. RESULTS — counters
  --------------------------------------------------------- */
  safe(function () {
    const fmt = (v, dec) => v.toLocaleString('en-GB', { minimumFractionDigits: dec, maximumFractionDigits: dec });
    const run = el => {
      const end = parseFloat(el.dataset.count), dec = +(el.dataset.decimals || 0), suf = el.dataset.suffix || '';
      if (reduce) { el.textContent = fmt(end, dec) + suf; return; }
      const t0 = performance.now(), dur = 1800;
      const f = now => { const p = clamp((now - t0) / dur, 0, 1), e = 1 - Math.pow(2, -10 * p); el.textContent = fmt(end * e, dec) + suf; if (p < 1) requestAnimationFrame(f); else el.textContent = fmt(end, dec) + suf; };
      requestAnimationFrame(f);
    };
    $$('.stat, .report__score').forEach(st => io((en, obs) => { if (en[0].isIntersecting) { st.classList.add('in'); $$('[data-count]', st).forEach(run); obs.disconnect(); } }, { threshold: .4 }).observe(st));
  });

  /* ---------------------------------------------------------
     12. MAGNETIC BUTTONS + spotlight
  --------------------------------------------------------- */
  if (finePointer && !reduce) $$('.magnet').forEach(b => {
    const inner = $('span', b);
    b.addEventListener('pointermove', e => {
      const r = b.getBoundingClientRect(); const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      b.style.transform = `translate(${dx * .18}px,${dy * .22}px)`; if (inner) inner.style.transform = `translate(${dx * .08}px,${dy * .1}px)`;
      b.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%'); b.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
    b.addEventListener('pointerleave', () => { b.style.transform = ''; if (inner) inner.style.transform = ''; });
  });

  /* ---------------------------------------------------------
     13. misc
  --------------------------------------------------------- */
  safe(() => { $$('[data-year]').forEach(e => e.textContent = new Date().getFullYear()); });
  safe(() => { const b = $('[data-booking]'); if (!b) return; const d = new Date(); d.setMonth(d.getMonth() + 1, 1); b.textContent = 'Now booking · ' + d.toLocaleString('en-GB', { month: 'long' }) + ' ' + d.getFullYear(); });
  if (document.readyState === 'complete') runBoot(); else addEventListener('load', runBoot);
})();
