/* Сайт Андрея Ковалева: кнопка «Отбивка» и просмотр грамот. Общий для RU и EN. */
(function () {
  'use strict';

  function logError(where, err) {
    // Формат пригоден для отправки во внешнюю систему логов
    console.error(JSON.stringify({ level: 'error', where: where, message: String(err && err.message || err), stack: err && err.stack || null, page: location.pathname }));
  }

  /* Отбивка: звук только по нажатию – браузеры запрещают автозапуск со звуком */
  var btn = document.querySelector('.jingle');
  if (btn) {
    var audio = new Audio();
    audio.preload = 'none';
    var ico = btn.querySelector('.jingle-ico');
    var setPlaying = function (on) {
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.classList.toggle('is-playing', on);
      if (ico) ico.textContent = on ? '❚❚' : '▶';
    };
    btn.addEventListener('click', function () {
      if (!audio.src) audio.src = btn.getAttribute('data-src');
      if (audio.paused) {
        audio.currentTime = 0;
        var p = audio.play();
        if (p && p.then) p.then(function () { setPlaying(true); }).catch(function (e) { setPlaying(false); logError('jingle.play', e); });
        else setPlaying(true);
      } else {
        audio.pause();
        setPlaying(false);
      }
    });
    audio.addEventListener('ended', function () { setPlaying(false); });
    audio.addEventListener('error', function () { setPlaying(false); logError('jingle.load', audio.error && audio.error.code); });
  }

  /* Грамоты: открыть скан поверх страницы; без поддержки <dialog> работает обычная ссылка */
  var view = document.querySelector('.doc-view');
  if (view && typeof view.showModal === 'function') {
    var big = view.querySelector('img');
    document.querySelectorAll('.doc').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var thumb = link.querySelector('img');
        big.src = link.getAttribute('href');
        big.alt = thumb ? thumb.alt : '';
        view.showModal();
      });
    });
    view.querySelector('.doc-close').addEventListener('click', function () { view.close(); });
    view.addEventListener('click', function (e) { if (e.target === view) view.close(); });
    view.addEventListener('close', function () { big.removeAttribute('src'); });
  }
})();
