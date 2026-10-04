(function () {
  var $ = function (id) { return document.getElementById(id); };
  var WA = '79268583976';

  /* статус по Москве: ежедневно 9:00–21:00 */
  var st = $('open-status'), txt = $('open-text');
  try {
    var p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Moscow', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    var o = {}; p.forEach(function (x) { o[x.type] = x.value; });
    var cur = (parseInt(o.hour, 10) % 24) + parseInt(o.minute, 10) / 60;
    if (st && txt) {
      if (cur >= 9 && cur < 21) { txt.textContent = 'Сейчас открыто, до 21:00'; st.classList.remove('is-closed'); }
      else { txt.textContent = 'Сейчас закрыто, с 9:00 до 21:00'; st.classList.add('is-closed'); }
    }
  } catch (e) {}

  /* «Что с диском?»: вкладки, текст сообщения */
  var picks = [].slice.call(document.querySelectorAll('.pick'));
  var panels = [].slice.call(document.querySelectorAll('.case'));
  var rim = $('rim'), car = $('car'), bubble = $('bubble'), wa = $('wa-send');
  if (!picks.length) return;
  var cur_i = 0;

  function say() {
    var s = 'Здравствуйте! Пишу в DiskiPravka (Братиславская, 26). ' + picks[cur_i].getAttribute('data-say').replace(/^./, function (c) { return c.toUpperCase(); }) + '.';
    var c = (car.value || '').trim();
    if (c) s += ' Машина и колёса: ' + c + '.';
    s += ' Фото пришлю. Когда можно подъехать?';
    return s;
  }
  function render() {
    var t = say();
    bubble.textContent = t;
    wa.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(t);
  }
  function select(i, focus, initial) {
    cur_i = i;
    picks.forEach(function (b, k) {
      b.setAttribute('aria-selected', k === i ? 'true' : 'false');
      b.tabIndex = k === i ? 0 : -1;
      panels[k].hidden = k !== i;
    });
    if (focus) picks[i].focus();
    if (rim && !initial) { rim.classList.remove('spin'); void rim.getBoundingClientRect(); rim.classList.add('spin'); }
    render();
  }
  picks.forEach(function (b, i) {
    b.addEventListener('click', function () { select(i); });
    b.addEventListener('keydown', function (e) {
      var n = picks.length;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); select((i + 1) % n, true); }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); select((i + n - 1) % n, true); }
    });
  });
  car.addEventListener('input', render);
  $('send').addEventListener('submit', function (e) { e.preventDefault(); });
  ['wa-hero', 'wa-foot'].forEach(function (id) {
    var a = $(id); if (!a) return;
    a.addEventListener('click', function () { a.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(say()); });
  });
  document.documentElement.classList.add('js');
  select(0, false, true);
})();
