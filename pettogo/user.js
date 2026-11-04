/* pettogo: показывает, что пользователь вошёл, на любой странице.
   Слот — элемент с атрибутом data-user-slot. Данные входа — localStorage "pettogo_user" (в макете). */
(function () {
  var user = null;
  try { user = JSON.parse(localStorage.getItem('pettogo_user')); } catch (e) {}

  var css = '' +
    '.pt-user{position:relative;display:inline-flex}' +
    '.pt-user-btn{display:flex;align-items:center;gap:8px;border:1px solid var(--line,#E5E2DC);background:#fff;border-radius:40px;padding:3px 12px 3px 3px;cursor:pointer;font:400 14px var(--sans,Jost,Arial,sans-serif);color:var(--ink,#22262E);height:40px}' +
    '.pt-user-btn:hover{border-color:var(--green,#24324A)}' +
    '.pt-user-ava{width:32px;height:32px;border-radius:50%;background:var(--green,#24324A);color:#fff;display:grid;place-items:center;font-family:var(--serif,Georgia,serif);font-size:17px;font-weight:600;flex-shrink:0}' +
    '.pt-user-btn svg{width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2;opacity:.6}' +
    '.pt-user-menu{display:none;position:absolute;right:0;top:calc(100% + 8px);min-width:260px;background:#fff;border:1px solid var(--line,#E5E2DC);border-radius:4px;box-shadow:0 14px 30px rgba(26,37,56,.14);z-index:50;padding:6px 0;text-align:left}' +
    '.pt-user.open .pt-user-menu{display:block}' +
    '.pt-user-menu .hd{padding:10px 16px 10px;border-bottom:1px solid var(--line,#E5E2DC);margin-bottom:4px;font-size:13px;color:var(--ink-soft,#696C73)}' +
    '.pt-user-menu .hd b{display:block;font-weight:400;font-size:15px;color:var(--ink,#22262E)}' +
    '.pt-user-menu a,.pt-user-menu button{display:block;width:100%;text-align:left;padding:9px 16px;font:300 14.5px var(--sans,Jost,Arial,sans-serif);color:var(--ink,#22262E);background:none;border:0;cursor:pointer}' +
    '.pt-user-menu a:hover,.pt-user-menu button:hover{background:var(--green-mist,#F3F1EC)}' +
    '.pt-user-menu .soon{display:block;white-space:nowrap;padding:9px 16px;font-size:14.5px;color:var(--ink-soft,#696C73);cursor:default}' +
    '.pt-user-menu .soon:hover{background:none}' +
    '.pt-user-menu .soon small{font-size:11px;letter-spacing:.08em;text-transform:uppercase;margin-left:6px;color:var(--coral-text,#C4543A)}' +
    '.pt-user-menu .out{border-top:1px solid var(--line,#E5E2DC);margin-top:4px;color:var(--coral-text,#C4543A)}' +
    '.pt-login{display:inline-flex;align-items:center;height:40px;padding:0 16px;border-radius:4px;background:var(--green,#24324A);color:#fff !important;font:400 14px var(--sans,Jost,Arial,sans-serif)}' +
    '.pt-login:hover{background:var(--green-dark,#1A2538)}' +
    '@media (max-width:1020px){.nav>[data-user-slot],.nav>.pt-user{margin-left:auto}}' +
    '@media (max-width:640px){.pt-user-btn .nm,.pt-user-btn svg{display:none}.pt-user-btn{padding:3px;height:38px}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var here = location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('[data-user-slot]').forEach(function (slot) {
    if (!user || !user.name) {
      if (slot.hasAttribute('data-keep-guest')) return; // оставить исходную кнопку (иконку) для гостя
      slot.innerHTML = '<a class="pt-login" href="auth.html?next=' + encodeURIComponent(here) + '">Войти</a>';
      return;
    }
    var name = esc(user.name), first = esc(user.name.charAt(0).toUpperCase());
    var wrap = document.createElement('div');
    wrap.className = 'pt-user';
    wrap.innerHTML =
      '<button class="pt-user-btn" type="button" aria-haspopup="true" aria-expanded="false" title="Вы вошли как ' + name + '">' +
        '<span class="pt-user-ava">' + first + '</span><span class="nm">' + name + '</span>' +
        '<svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></button>' +
      '<div class="pt-user-menu" role="menu">' +
        '<div class="hd">Вы вошли как<b>' + name + '</b></div>' +
        '<span class="soon">Мой профиль и собаки<small>скоро</small></span>' +
        '<a href="new-story.html">Рассказать историю</a>' +
        '<a href="planner.html">Конструктор поездки</a>' +
        '<a href="places.html">Пет-френдли места</a>' +
        '<button class="out" type="button">Выйти</button>' +
      '</div>';
    slot.replaceWith(wrap);
    var btn = wrap.querySelector('.pt-user-btn');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = wrap.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function () { wrap.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') wrap.classList.remove('open'); });
    wrap.querySelector('.out').addEventListener('click', function () {
      try { localStorage.removeItem('pettogo_user'); } catch (e) {}
      location.href = 'index.html';
    });
  });
})();
