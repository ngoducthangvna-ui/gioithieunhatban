/* ==========================================================================
   Nhật Bản — hộp xem ảnh thực tế
   Mỗi thẻ có data-photo (mã ảnh), data-photo-title, data-photo-caption.
   Ảnh nằm ở assets/img/photos/<mã>.jpg, credit lấy từ assets/js/photos.js.
   ========================================================================== */
(function () {
  'use strict';

  var lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  var triggers = Array.prototype.slice.call(document.querySelectorAll('[data-photo]'));
  if (!triggers.length) return;

  var media = document.getElementById('lightboxMedia');
  var image = document.getElementById('lightboxImage');
  var titleEl = document.getElementById('lightboxTitle');
  var captionEl = document.getElementById('lightboxCaption');
  var creditEl = document.getElementById('lightboxCredit');
  var sourceEl = document.getElementById('lightboxSource');
  var countEl = document.getElementById('lightboxCount');
  var closeBtn = lightbox.querySelector('.lightbox-close');
  var credits = window.JAPAN_PHOTOS || {};
  var photoBase = 'assets/img/photos/';

  var active = [];
  var current = -1;
  var lastFocus = null;
  var lastTrigger = null;
  var loadedCache = {};

  function isVisible(el) {
    return !!el.getClientRects().length;
  }

  function preload(index) {
    if (index < 0 || index >= active.length) return;
    var id = active[index].getAttribute('data-photo');
    if (!id || loadedCache[id]) return;
    loadedCache[id] = true;
    var pre = new Image();
    pre.src = photoBase + id + '.jpg';
  }

  function render(index) {
    var el = active[index];
    if (!el) return;
    current = index;

    var id = el.getAttribute('data-photo');
    var title = el.getAttribute('data-photo-title') || '';
    var caption = el.getAttribute('data-photo-caption') || '';
    var src = photoBase + id + '.jpg';

    media.classList.remove('is-loaded', 'is-error');
    image.alt = caption ? title + '. ' + caption : title;
    image.onload = function () { media.classList.add('is-loaded'); };
    image.onerror = function () { media.classList.add('is-error'); };
    image.src = src;
    if (image.complete && image.naturalWidth) media.classList.add('is-loaded');

    titleEl.textContent = title;
    captionEl.textContent = caption;

    var meta = credits[id];
    if (meta) {
      creditEl.textContent = meta.credit || 'Wikimedia Commons';
      if (meta.source) {
        sourceEl.href = meta.source;
        sourceEl.hidden = false;
      } else {
        sourceEl.hidden = true;
      }
    } else {
      creditEl.textContent = 'Wikimedia Commons';
      sourceEl.hidden = true;
    }

    countEl.textContent = 'Ảnh ' + (index + 1) + ' / ' + active.length;
    preload(index + 1);
    preload(index - 1);
  }

  function openFrom(element) {
    lastFocus = document.activeElement;
    lastTrigger = element;

    active = triggers.filter(isVisible);
    var index = active.indexOf(element);
    if (index === -1) {
      active = triggers.slice();
      index = triggers.indexOf(element);
    }
    if (index === -1) return;

    lightbox.hidden = false;
    document.documentElement.classList.add('lightbox-open');
    document.body.classList.add('lightbox-open');

    var scrollbar = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbar > 0) document.body.style.paddingRight = scrollbar + 'px';

    render(index);
    window.requestAnimationFrame(function () { closeBtn.focus(); });
  }

  function close() {
    lightbox.hidden = true;
    document.documentElement.classList.remove('lightbox-open');
    document.body.classList.remove('lightbox-open');
    document.body.style.paddingRight = '';
    media.classList.remove('is-loaded', 'is-error');
    image.removeAttribute('src');
    current = -1;

    /* Trả tiêu điểm về nơi đã mở ảnh; nếu là chuột (tiêu điểm ở body)
       thì đưa về nút camera của thẻ vừa xem để dùng tiếp bằng bàn phím. */
    var target = lastFocus;
    if (!target || target === document.body || target === document.documentElement) {
      target = lastTrigger ? lastTrigger.querySelector('.card-photo') : null;
    }
    if (target && typeof target.focus === 'function') target.focus();
    lastFocus = null;
  }

  function step(delta) {
    if (current < 0 || !active.length) return;
    var next = (current + delta + active.length) % active.length;
    render(next);
  }

  document.addEventListener('click', function (event) {
    if (lightbox.contains(event.target)) {
      if (event.target.closest('[data-lightbox-close]')) close();
      else if (event.target.closest('[data-lightbox-prev]')) step(-1);
      else if (event.target.closest('[data-lightbox-next]')) step(1);
      return;
    }

    var card = event.target.closest ? event.target.closest('[data-photo]') : null;
    if (card) {
      event.preventDefault();
      openFrom(card);
    }
  });

  document.addEventListener('keydown', function (event) {
    if (lightbox.hidden) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      step(1);
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      step(-1);
      return;
    }
    if (event.key !== 'Tab') return;

    var focusables = Array.prototype.filter.call(
      lightbox.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])'),
      function (el) { return !el.hidden && el.getClientRects().length; }
    );
    if (!focusables.length) return;

    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  /* Vuốt ngang trên di động để chuyển ảnh */
  var touchStartX = 0;
  var touchStartY = 0;
  var touchActive = false;

  lightbox.addEventListener('touchstart', function (event) {
    if (event.touches.length !== 1) return;
    touchActive = true;
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  }, { passive: true });

  lightbox.addEventListener('touchend', function (event) {
    if (!touchActive || !event.changedTouches.length) return;
    touchActive = false;
    var dx = event.changedTouches[0].clientX - touchStartX;
    var dy = event.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      step(dx < 0 ? 1 : -1);
    }
  }, { passive: true });

  /* Nếu tiêu điểm thoát khỏi hộp thoại bằng cách khác, kéo lại */
  document.addEventListener('focusin', function (event) {
    if (lightbox.hidden) return;
    if (!lightbox.contains(event.target)) closeBtn.focus();
  });
})();
