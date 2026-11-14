/* =========================================================
   shautech labs — shared engine
   © 2026 shautech. All rights reserved.
   Vanilla JS · zero dependencies · works from file://
   Public API: window.Lab  (see /labs/DEV-SPEC.md)
   ========================================================= */
(function () {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c) => (c || document).querySelector(s);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const shuffle = a => { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[r[i], r[j]] = [r[j], r[i]]; } return r; };
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  /* ---------------------------------------------------------
     ICONS — 24×24 stroke icons, currentColor. Lab.icon(name)
  --------------------------------------------------------- */
  const P = {
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.6 7.2L4 21l1.8-5.4A8 8 0 1 1 21 12z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="3"/><path d="M16 15.5a5.5 5.5 0 0 1 5.5 4.5"/>',
    'user-x': '<circle cx="10" cy="8" r="4"/><path d="M2 21a8 8 0 0 1 14-4.5"/><path d="m17 15 5 5m0-5-5 5"/>',
    'user-check': '<circle cx="10" cy="8" r="4"/><path d="M2 21a8 8 0 0 1 14-4.5"/><path d="m15.5 18 2 2 4-4.5"/>',
    'user-plus': '<circle cx="10" cy="8" r="4"/><path d="M2 21a8 8 0 0 1 14-4.5"/><path d="M19 14v6m-3-3h6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    printer: '<path d="M7 8V4h10v4"/><rect x="3" y="8" width="18" height="9" rx="2"/><path d="M7 14h10v6H7z"/>',
    license: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M8 15h3"/>',
    plug: '<path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4"/>',
    shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/>',
    'shield-check': '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    'shield-alert': '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="M12 8v4m0 3v.5"/>',
    'shield-off': '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m4 4 16 16"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    unlock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.5-2"/>',
    key: '<circle cx="8" cy="14" r="4"/><path d="m11 11 9-9m-3 3 3 3m-6 0 2 2"/>',
    laptop: '<rect x="4" y="5" width="16" height="11" rx="2"/><path d="M2 19h20"/>',
    phone: '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>',
    server: '<rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/><path d="M7 7h.01M7 17h.01"/>',
    database: '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    cloud: '<path d="M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9a4.5 4.5 0 0 1 0 9z"/>',
    'cloud-up': '<path d="M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9a4.5 4.5 0 0 1 0 9"/><path d="M12 21v-8m-3 3 3-3 3 3"/>',
    'cloud-check': '<path d="M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9a4.5 4.5 0 0 1 0 9z"/><path d="m9 13 2 2 4-4"/>',
    'cloud-off': '<path d="M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9a4.5 4.5 0 0 1 0 9z"/><path d="m4 4 16 16"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/>',
    map: '<path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14m6-12v14"/>',
    ticket: '<path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z"/><path d="M10 9v6"/>',
    flask: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3"/><path d="M7.5 15h9"/>',
    truck: '<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    switch: '<path d="M4 6h5l6 12h5M4 18h5m6-12h5"/><path d="m18 4 2 2-2 2m0 8 2 2-2 2"/>',
    check: '<path d="m5 12 5 5L20 7"/>',
    'check-circle': '<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    x: '<path d="m6 6 12 12M18 6 6 18"/>',
    'x-circle': '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6m0-6-6 6"/>',
    flag: '<path d="M5 21V4m0 0h12l-2 4 2 4H5"/>',
    bug: '<path d="M8 9a4 4 0 0 1 8 0v5a4 4 0 0 1-8 0zM8 11H4m16 0h-4M8 15H5m14 0h-3M9 5 7 3m8 2 2-2"/>',
    alert: '<path d="M12 3 2 20h20z"/><path d="M12 9v5m0 3v.5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8v.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4m8-4v4"/>',
    star: '<path d="m12 3 2.8 5.8 6.2.9-4.5 4.4 1.1 6.3L12 17.4 6.4 20.4l1.1-6.3L3 9.7l6.2-.9z"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4m8-4h3a3 3 0 0 1-3 4M12 13v4m-4 4h8m-4-4a4 4 0 0 0-4 4m4-4a4 4 0 0 1 4 4"/>',
    medal: '<circle cx="12" cy="15" r="5"/><path d="m8.5 10.5-3-7.5h5l2 5 2-5h5l-3 7.5"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.5-4M4 13a8 8 0 0 0 14.5 4"/><path d="M20 4v7h-7M4 20v-7h7"/>',
    play: '<path d="M7 4v16l13-8z"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    'eye-off': '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><path d="m4 4 16 16"/>',
    file: '<path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5"/>',
    'file-text': '<path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5M9 13h6m-6 4h6"/>',
    'file-lock': '<path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5"/><rect x="9" y="13" width="6" height="5" rx="1"/><path d="M10.5 13v-1.5a1.5 1.5 0 0 1 3 0V13"/>',
    sheet: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M3 14h18M9 4v16"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.6.4l3-3a4 4 0 0 0-5.6-5.6l-1.5 1.5"/><path d="M14 10a4 4 0 0 0-5.6-.4l-3 3a4 4 0 0 0 5.6 5.6l1.5-1.5"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.7 13.5 6.6 3.8m0-10.6-6.6 3.8"/>',
    tag: '<path d="M3 3h8l10 10-8 8L3 11z"/><path d="M7.5 7.5h.01"/>',
    filter: '<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M4.9 4.9l2.1 2.1m10 10 2.1 2.1M4.9 19.1 7 17m10-10 2.1-2.1"/>',
    'arrow-right': '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    'arrow-left': '<path d="M20 12H4m6-6-6 6 6 6"/>',
    'arrow-up': '<path d="M12 20V4m-6 6 6-6 6 6"/>',
    'arrow-down': '<path d="M12 4v16m-6-6 6 6 6-6"/>',
    'chevron-right': '<path d="m9 6 6 6-6 6"/>',
    download: '<path d="M12 4v12m-5-5 5 5 5-5M4 20h16"/>',
    upload: '<path d="M12 16V4m-5 5 5-5 5 5M4 20h16"/>',
    wifi: '<path d="M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0"/><path d="M12 19.5v.01"/>',
    home: '<path d="m3 11 9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
    building: '<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M8 7h2m4 0h2M8 11h2m4 0h2M8 15h2m4 0h2M10 21v-3h4v3"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/>',
    euro: '<path d="M18 6.5A7 7 0 0 0 7 9m11 8.5A7 7 0 0 1 7 15M4 11h9m-9 3h9"/>',
    chart: '<path d="M4 20V4m0 16h16"/><path d="m7 15 4-5 3 3 5-6"/>',
    bars: '<path d="M5 20v-6m5 6V9m5 11v-8m5 8V4"/>',
    pin: '<path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
    'bell-off': '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4M4 4l16 16"/>',
    hourglass: '<path d="M6 3h12M6 21h12M8 3v3l4 4 4-4V3M8 21v-3l4-4 4 4v3"/>',
    fire: '<path d="M12 22c4 0 7-3 7-7 0-3-2-5-3-7-1 2-2 3-3 3 0-3-1-6-3-8-1 4-5 6-5 12a7 7 0 0 0 7 7z"/>',
    skull: '<path d="M4 11a8 8 0 0 1 16 0c0 3-2 5-3 6v3H7v-3c-1-1-3-3-3-6z"/><circle cx="9" cy="11" r="1.5"/><circle cx="15" cy="11" r="1.5"/><path d="M10 20v-2m4 2v-2"/>',
    sparkles: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8zM5 3l.6 1.6L7 5l-1.4.6L5 7l-.6-1.4L3 5l1.4-.4z"/>',
    robot: '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4m-3 6h.01M15 14h.01M9 17h6"/>',
    cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="10" y="10" width="4" height="4"/><path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4"/>',
    terminal: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3m5 0h5"/>',
    code: '<path d="m8 8-5 4 5 4m8-8 5 4-5 4m-3-10-2 12"/>',
    git: '<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="8" r="2.5"/><path d="M6 8.5v7M18 10.5a6 6 0 0 1-6 6H8.5"/>',
    box: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>',
    boxes: '<path d="M3 15l4.5-2.5L12 15v6l-4.5 2.5L3 21zM12 15l4.5-2.5L21 15v6l-4.5 2.5L12 21zM7.5 4 12 1.5 16.5 4v6L12 12.5 7.5 10z"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5M3 17l9 5 9-5"/>',
    'hard-drive': '<rect x="3" y="12" width="18" height="8" rx="2"/><path d="M5 12 7.5 4.5h9L19 12M7 16h.01M11 16h.01"/>',
    'save': '<path d="M5 3h11l3 3v15H5z"/><path d="M8 3v5h7V3M8 21v-7h8v7"/>',
    history: '<path d="M4 12a8 8 0 1 1 2.3 5.7"/><path d="M4 7v5h5M12 8v4l3 2"/>',
    'rotate-ccw': '<path d="M4 12a8 8 0 1 1 2.3 5.7"/><path d="M4 7v5h5"/>',
    power: '<path d="M12 3v8M6.3 7.3a8 8 0 1 0 11.4 0"/>',
    moon: '<path d="M20 15A8 8 0 0 1 9 4a8 8 0 1 0 11 11z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    coffee: '<path d="M4 9h12v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM16 10h2a2 2 0 1 1 0 4h-2M7 3v3m3-3v3m3-3v3"/>',
    heart: '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
    gift: '<rect x="3" y="9" width="18" height="12" rx="1.5"/><path d="M3 13h18M12 9v12M12 9c-3 0-5-1-5-3s3-3 5 3c2-6 5-4 5-3s-2 3-5 3"/>',
    door: '<path d="M4 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17M4 21h16M12 12h.01"/>',
    'door-open': '<path d="M3 21h18M5 21V4h8v17M13 4l6 2v15"/><path d="M10 12h.01"/>',
    badge: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><circle cx="12" cy="11" r="2.5"/>',
    scan: '<path d="M3 8V5a2 2 0 0 1 2-2h3m8 0h3a2 2 0 0 1 2 2v3m0 8v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3"/><path d="M3 12h18"/>',
    radar: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 12 18 6"/><path d="M12 12v.01"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    network: '<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M12 7.5v4m0 0-5.5 5.5m5.5-5.5 5.5 5.5"/>',
    route: '<circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M8.5 19H14a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h5.5"/>',
    inbox: '<path d="M4 4h16v16H4z"/><path d="M4 14h5l1.5 2h3L15 14h5"/>',
    send: '<path d="m3 11 18-8-8 18-2-8z"/>',
    'thumbs-up': '<path d="M7 11v10H4V11zM7 11l4-8a2.5 2.5 0 0 1 2.5 2.5V9h5a2 2 0 0 1 2 2.3l-1.3 7a2 2 0 0 1-2 1.7H7"/>',
    'thumbs-down': '<path d="M7 13V3H4v10zM7 13l4 8a2.5 2.5 0 0 0 2.5-2.5V15h5a2 2 0 0 0 2-2.3l-1.3-7a2 2 0 0 0-2-1.7H7"/>',
    pause: '<path d="M8 5v14m8-14v14"/>',
    'list-check': '<path d="M9 6h12M9 12h12M9 18h12M3 6l1.5 1.5L7 5M3 12l1.5 1.5L7 11M3 18l1.5 1.5L7 17"/>',
    percent: '<path d="m5 19 14-14"/><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/>',
    wrench: '<path d="M14.5 6.5a4 4 0 0 0 5 5L9 22l-3-3z"/><path d="M15 5l4 4"/>',
    spinner: '<path d="M12 3v3m0 12v3m9-9h-3M6 12H3m14.4-6.4-2.1 2.1M8.7 15.3l-2.1 2.1m0-10.8 2.1 2.1m6.6 6.6 2.1 2.1"/>',
    zap: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    camera: '<path d="M4 8h3l2-3h6l2 3h3v12H4z"/><circle cx="12" cy="13" r="3.5"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8m-4-4v4"/>',
    usb: '<path d="M12 2v16m0 0-3-3m3 3 3-3M9 8l3-3 3 3M6 10h4v4H6zm10 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>',
    'battery-low': '<rect x="3" y="7" width="16" height="10" rx="2"/><path d="M22 10v4M6 10v4"/>',
    vpn: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="M8 12h8m-8 0 2-2m-2 2 2 2m6-2-2-2m2 2-2 2"/>',
    'credit-card': '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 15h3"/>',
    'at': '<circle cx="12" cy="12" r="4"/><path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1"/>',
    'hash': '<path d="M5 9h14M5 15h14M10 4 8 20M16 4l-2 16"/>',
    'graduation': '<path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5M22 9v6"/>',
    'help': '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7M12 17v.5"/>'
  };
  const icon = (name, cls) => {
    const d = P[name] || P.help;
    return `<svg class="ic${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${d}</svg>`;
  };
  // Allow `<i data-ic="name"></i>` placeholders inside template strings.
  const hydrateIcons = root => {
    (root || document).querySelectorAll('[data-ic]').forEach(el => {
      const n = el.getAttribute('data-ic'), cls = el.getAttribute('data-cls') || '';
      el.outerHTML = icon(n, cls);
    });
  };

  /* ---------------------------------------------------------
     STATE
  --------------------------------------------------------- */
  const Lab = {
    score: 0, level: 0, cfg: null, scene: null, reduced,
    util: { clamp, lerp, pick, shuffle, esc, $ },
    icon, hydrateIcons
  };
  let screenEl, stageEl, scoreEl, pillEl, mapEl, topbar;

  /* ---------------------------------------------------------
     INIT
  --------------------------------------------------------- */
  Lab.init = function (cfg) {
    Lab.cfg = cfg;
    document.documentElement.classList.remove('no-js');
    screenEl = $('#screen'); stageEl = $('#stage'); scoreEl = $('#score'); pillEl = $('#scorePill'); mapEl = $('#lvlmap'); topbar = $('#topbar');
    const nj = $('#nojs'); if (nj) nj.remove();
    const sn = $('#simName'); if (sn && cfg.codename) sn.textContent = cfg.codename;
    if (cfg.title) document.title = cfg.title + ' — shautech labs';
    // level map
    if (mapEl) {
      mapEl.innerHTML = '';
      cfg.levels.forEach((l, i) => {
        const d = document.createElement('div');
        d.className = 'lvl'; d.id = 'lvl' + i; d.setAttribute('title', `Level ${i} · ${l.name}`);
        d.innerHTML = `<div class="bubble">${icon(l.icon)}</div><span>${esc(l.name)}</span>`;
        mapEl.appendChild(d);
      });
    }
    // pill icon
    if (pillEl && !pillEl.querySelector('svg')) pillEl.insertAdjacentHTML('afterbegin', icon('bolt'));
    fitStage(); addEventListener('resize', fitStage);
    if (cfg.scene) Lab.scene = makeScene(cfg.scene);
    Lab.refreshMap();
    try { Lab.goto(0); } catch (e) { console.error(e); screenEl.innerHTML = `<div class="say alert" data-who="error">This lab hit a snag while starting. Reload the page or <a href="index.html" style="color:var(--accent2)">go back to all labs</a>.</div>`; }
    addEventListener('error', ev => { console.error(ev.error || ev.message); });
  };

  function fitStage() {
    if (!stageEl || !topbar) return;
    stageEl.style.top = (topbar.offsetHeight + 6) + 'px';
  }

  Lab.refreshMap = function () {
    if (!mapEl) return;
    Lab.cfg.levels.forEach((l, i) => {
      const el = document.getElementById('lvl' + i); if (!el) return;
      el.classList.toggle('now', i === Lab.level);
      el.classList.toggle('done', i < Lab.level);
      if (i < Lab.level) el.querySelector('.bubble').innerHTML = icon('check');
      else el.querySelector('.bubble').innerHTML = icon(l.icon);
    });
  };

  /* ---------------------------------------------------------
     SCREEN / NAVIGATION
  --------------------------------------------------------- */
  Lab.show = function (html) {
    screenEl.style.animation = 'none'; void screenEl.offsetHeight; screenEl.style.animation = '';
    screenEl.innerHTML = html;
    hydrateIcons(screenEl);
    stageEl.scrollTop = 0;
    Lab.refreshMap();
    fitStage();
    if (Lab.scene) Lab.scene.set('level', Lab.level);
  };
  Lab.goto = function (n) {
    Lab.level = n;
    const fn = Lab.cfg.render[n];
    if (typeof fn !== 'function') throw new Error('No renderer for level ' + n);
    fn();
  };
  Lab.mood = function (m) {
    document.body.classList.remove('mood-night', 'mood-alert', 'mood-calm');
    if (m) document.body.classList.add('mood-' + m);
    if (Lab.scene) Lab.scene.set('mood', m || '');
  };
  Lab.patch = function (sel, html) { const el = $(sel); if (el) { el.innerHTML = html; hydrateIcons(el); } };

  /* ---------------------------------------------------------
     SCORE
  --------------------------------------------------------- */
  Lab.addScore = function (n, x, y) {
    Lab.score = Math.max(0, Lab.score + n);
    if (scoreEl) scoreEl.textContent = Lab.score;
    if (pillEl) { pillEl.classList.add('bump'); setTimeout(() => pillEl.classList.remove('bump'), 160); }
    if (x !== undefined && y !== undefined && !reduced) {
      const f = document.createElement('div'); f.className = 'float-pts' + (n < 0 ? ' neg' : '');
      f.textContent = (n > 0 ? '+' : '') + n; f.style.left = x + 'px'; f.style.top = y + 'px';
      document.body.appendChild(f); setTimeout(() => f.remove(), 900);
    }
  };
  // convenience: addScore from a click event
  Lab.scoreAt = (n, e) => Lab.addScore(n, e && e.clientX, e && e.clientY);

  /* ---------------------------------------------------------
     TOAST
  --------------------------------------------------------- */
  let toastEl, toastT;
  Lab.toast = function (msg, ic) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.innerHTML = (ic ? icon(ic) : '') + '<span></span>'; toastEl.querySelector('span').textContent = msg;
    toastEl.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('show'), 2600);
  };

  /* ---------------------------------------------------------
     HTML HELPERS
  --------------------------------------------------------- */
  Lab.avatar = (initials, hue, cls) => `<span class="avatar${cls ? ' ' + cls : ''}" style="--h:${hue == null ? 215 : hue}" aria-hidden="true">${esc(initials)}</span>`;
  Lab.sev = (kind, text) => `<span class="sev sev--${kind}">${esc(text || kind)}</span>`;
  Lab.badge = (text, ic) => `<div class="badge">${ic ? icon(ic) : ''}${esc(text)}</div>`;
  Lab.say = (who, html, kind) => `<div class="say${kind ? ' ' + kind : ''}" data-who="${esc(who)}">${html}</div>`;
  Lab.btn = (label, onclick, kind, ic) => `<button class="btn ${kind || ''}" onclick="${onclick}">${ic ? icon(ic) : ''}${label}</button>`;
  Lab.typeLines = async function (el, lines, speed) {
    // lines: [[cls, text], ...] → terminal-style output into a .log element
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    for (const [cls, text] of lines) {
      const d = document.createElement('div'); d.className = cls || ''; el.appendChild(d);
      if (reduced || speed === 0) d.textContent = text;
      else { for (const ch of text) { d.textContent += ch; await sleep(speed || 8); } }
      el.scrollTop = el.scrollHeight;
      if (!reduced) await sleep(120);
    }
  };

  /* ---------------------------------------------------------
     FINALE
  --------------------------------------------------------- */
  Lab.finale = function (opts) {
    opts = opts || {};
    const cfg = Lab.cfg;
    const ranks = (opts.ranks || cfg.ranks || []).slice().sort((a, b) => b.min - a.min);
    let rank = ranks.find(r => Lab.score >= r.min) || ranks[ranks.length - 1] || { title: 'Finished', icon: 'medal', msg: '' };
    Lab.level = cfg.levels.length; Lab.refreshMap();
    Lab.mood(opts.mood === undefined ? 'calm' : opts.mood);
    burst();
    const target = opts.into ? $(opts.into) : screenEl;
    const html = `
      <div class="finale reveal-in">
        <h2>${esc(opts.heading || 'Mission accomplished.')}</h2>
        <div class="rank-big">${icon(rank.icon || 'trophy')}${esc(rank.title)}</div>
        <div class="score-line">SCORE ${Lab.score}${cfg.maxScore ? ' / ' + cfg.maxScore : ''}</div>
        <p class="muted" style="margin:10px auto;max-width:540px">${rank.msg || ''}</p>
        ${opts.summary || cfg.summary ? `<div class="say tip" data-who="remember">${opts.summary || cfg.summary}</div>` : ''}
        <div class="row row--center">
          <button class="btn blue" onclick="location.reload()">${icon('refresh')}Play again</button>
          <a class="btn green" href="../index.html#contact">${icon('users')}Run this live with your team</a>
          <a class="btn" href="index.html">${icon('arrow-left')}All labs</a>
        </div>
        <p class="small" style="margin-top:22px">shautech labs · © ${new Date().getFullYear()} shautech · <a href="mailto:contact@shautech.com" style="color:var(--accent2)">contact@shautech.com</a></p>
      </div>`;
    if (opts.into && target) { target.innerHTML = html; hydrateIcons(target); target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); }
    else Lab.show(html);
  };

  // celebratory particle burst (replaces emoji confetti)
  function burst() {
    if (reduced) return;
    let c = $('#burst'); if (!c) { c = document.createElement('canvas'); c.id = 'burst'; document.body.appendChild(c); }
    const ctx = c.getContext('2d'); const dpr = Math.min(devicePixelRatio || 1, 2);
    c.width = innerWidth * dpr; c.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cols = ['#4D9FFF', '#8CC2FF', '#7CF2C4', '#FFB84D', '#F2F4F8'];
    const parts = [];
    for (let i = 0; i < 160; i++) {
      const a = Math.random() * Math.PI * 2, sp = 4 + Math.random() * 9;
      parts.push({ x: innerWidth / 2, y: innerHeight * 0.35, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 6, r: 2 + Math.random() * 3, c: pick(cols), rot: Math.random() * 6, vr: (Math.random() - .5) * .3, life: 1 });
    }
    let t0 = performance.now();
    const tick = now => {
      const dt = Math.min((now - t0) / 16.7, 2); t0 = now;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      let alive = 0;
      for (const p of parts) {
        if (p.life <= 0) continue; alive++;
        p.vy += 0.18 * dt; p.vx *= 0.99; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt; p.life -= 0.009 * dt;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.c; ctx.fillRect(-p.r, -p.r * .6, p.r * 2, p.r * 1.2); ctx.restore();
      }
      if (alive) requestAnimationFrame(tick); else c.remove();
    };
    requestAnimationFrame(tick);
  }

  /* ---------------------------------------------------------
     SCENE — ambient canvas background
     spec: { init(s, W, H), draw(ctx, s, W, H, t, dt) }
     s is a free state object; Lab.scene.set(k, v) mutates it.
  --------------------------------------------------------- */
  function makeScene(spec) {
    const cv = $('#labbg'); if (!cv) return null;
    const ctx = cv.getContext('2d');
    const s = spec.state || {}; let W = 0, H = 0, raf = null, last = 0, t = 0, visible = true;
    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = innerWidth; H = innerHeight; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (spec.init) spec.init(s, W, H);
      if (reduced) frameOnce();
    }
    function frameOnce() { ctx.clearRect(0, 0, W, H); try { spec.draw(ctx, s, W, H, 0, 0); } catch (e) { console.error(e); } }
    function loop(now) {
      raf = null; if (!visible) return;
      const dt = Math.min((now - last) / 1000 || 0, 0.05); last = now; t += dt;
      ctx.clearRect(0, 0, W, H);
      try { spec.draw(ctx, s, W, H, t, dt); } catch (e) { console.error(e); return; }
      raf = requestAnimationFrame(loop);
    }
    function start() { if (!reduced && !raf && visible) { last = performance.now(); raf = requestAnimationFrame(loop); } }
    document.addEventListener('visibilitychange', () => { visible = !document.hidden; if (visible) start(); });
    let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 120); });
    resize(); start();
    return { state: s, set(k, v) { s[k] = v; if (spec.onChange) spec.onChange(s, k, v, W, H); if (reduced) frameOnce(); }, redraw: frameOnce };
  }

  /* drawing helpers for scenes */
  const D = {
    rr(ctx, x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); },
    // a server/tenant rack with LED slots
    rack(ctx, x, y, w, h, o) {
      o = o || {}; const col = o.color || 'rgba(77,159,255,.6)';
      ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 1.2; ctx.fillStyle = o.fill || 'rgba(16,19,23,.75)';
      D.rr(ctx, x, y, w, h, 8); ctx.fill(); ctx.stroke();
      const n = o.slots || Math.floor(h / 26);
      for (let i = 0; i < n; i++) {
        const sy = y + 10 + i * ((h - 20) / n);
        ctx.globalAlpha = .55; ctx.fillStyle = 'rgba(255,255,255,.08)'; D.rr(ctx, x + 8, sy, w - 16, 10, 2); ctx.fill();
        ctx.globalAlpha = 1; ctx.fillStyle = (o.led && o.led(i)) || col; ctx.beginPath(); ctx.arc(x + w - 14, sy + 5, 2, 0, 7); ctx.fill();
      }
      if (o.label) { ctx.globalAlpha = .9; ctx.fillStyle = 'rgba(169,177,192,.9)'; ctx.font = '600 10px "JetBrains Mono", monospace'; ctx.textAlign = 'center'; ctx.fillText(o.label, x + w / 2, y - 10); }
      ctx.restore();
    },
    // cubic bezier sampled into points
    curve(p0, p1, p2, p3, n) { const pts = []; for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t; pts.push([u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]]); } return pts; },
    posOn(pts, t) { const f = clamp(t, 0, 1) * (pts.length - 1), i = Math.floor(f), j = Math.min(i + 1, pts.length - 1), k = f - i; return [lerp(pts[i][0], pts[j][0], k), lerp(pts[i][1], pts[j][1], k)]; },
    path(ctx, pts, style, width, dash) { ctx.save(); ctx.strokeStyle = style; ctx.lineWidth = width || 1; if (dash) ctx.setLineDash(dash); ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.restore(); },
    glowDot(ctx, x, y, r, col) { ctx.save(); const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 3, 0, 7); ctx.fill(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.restore(); },
    // small wireframe glyphs for packets: 'mail' | 'file' | 'user' | 'key' | 'shield' | 'bit' | 'bug'
    glyph(ctx, kind, x, y, s, col) {
      ctx.save(); ctx.translate(x, y); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 1.2; ctx.lineJoin = 'round';
      switch (kind) {
        case 'mail': ctx.strokeRect(-s, -s * .65, s * 2, s * 1.3); ctx.beginPath(); ctx.moveTo(-s, -s * .65); ctx.lineTo(0, s * .1); ctx.lineTo(s, -s * .65); ctx.stroke(); break;
        case 'file': ctx.beginPath(); ctx.moveTo(-s * .7, -s); ctx.lineTo(s * .3, -s); ctx.lineTo(s * .7, -s * .6); ctx.lineTo(s * .7, s); ctx.lineTo(-s * .7, s); ctx.closePath(); ctx.stroke(); break;
        case 'user': ctx.beginPath(); ctx.arc(0, -s * .4, s * .45, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(0, s * .9, s * .9, Math.PI, 0); ctx.stroke(); break;
        case 'key': ctx.beginPath(); ctx.arc(-s * .4, 0, s * .45, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(s, 0); ctx.lineTo(s, s * .4); ctx.stroke(); break;
        case 'shield': ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(s * .9, -s * .6); ctx.lineTo(s * .8, s * .3); ctx.lineTo(0, s); ctx.lineTo(-s * .8, s * .3); ctx.lineTo(-s * .9, -s * .6); ctx.closePath(); ctx.stroke(); break;
        case 'bug': ctx.beginPath(); ctx.ellipse(0, 0, s * .6, s * .9, 0, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-s, -s * .3); ctx.lineTo(-s * .6, 0); ctx.moveTo(s, -s * .3); ctx.lineTo(s * .6, 0); ctx.moveTo(-s, s * .6); ctx.lineTo(-s * .6, s * .3); ctx.moveTo(s, s * .6); ctx.lineTo(s * .6, s * .3); ctx.stroke(); break;
        case 'lock': ctx.strokeRect(-s * .7, -s * .1, s * 1.4, s * 1.1); ctx.beginPath(); ctx.arc(0, -s * .1, s * .5, Math.PI, 0); ctx.stroke(); break;
        default: ctx.beginPath(); ctx.arc(0, 0, s * .45, 0, 7); ctx.fill();
      }
      ctx.restore();
    },
    grid(ctx, W, H, step, col) { ctx.save(); ctx.strokeStyle = col || 'rgba(255,255,255,.04)'; ctx.lineWidth = 1; ctx.beginPath(); for (let x = 0; x <= W; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, H); } for (let y = 0; y <= H; y += step) { ctx.moveTo(0, y); ctx.lineTo(W, y); } ctx.stroke(); ctx.restore(); },
    text(ctx, str, x, y, o) { o = o || {}; ctx.save(); ctx.fillStyle = o.color || 'rgba(169,177,192,.8)'; ctx.font = (o.weight || 600) + ' ' + (o.size || 10) + 'px "JetBrains Mono", monospace'; ctx.textAlign = o.align || 'center'; ctx.textBaseline = o.baseline || 'alphabetic'; ctx.fillText(str, x, y); ctx.restore(); }
  };
  Lab.draw = D;
  Lab.colors = { accent: '#4D9FFF', accent2: '#8CC2FF', mint: '#7CF2C4', amber: '#FFB84D', red: '#FF5C7A', violet: '#9A8CFF', ink: '#F2F4F8', ink2: '#A9B1C0', ink3: '#6B7484' };
  Lab.rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };

  window.Lab = Lab;
})();
