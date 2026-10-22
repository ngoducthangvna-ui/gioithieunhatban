/* ==========================================================================
   Nhật Bản — trang giới thiệu
   JavaScript thuần: điều hướng, hiệu ứng cuộn, cánh hoa, bộ lọc, tab mùa
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };

  /* ---------- 1. Header: nền khi cuộn + thanh tiến trình ---------- */
  var header = $('#siteHeader');
  var progress = $('#scrollProgress');
  var toTop = $('#toTop');
  var ticking = false;

  function onScrollFrame() {
    var y = window.pageYOffset || document.documentElement.scrollTop;

    if (header) header.classList.toggle('is-scrolled', y > 24);
    if (toTop) toTop.classList.toggle('is-visible', y > 640);

    if (progress) {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var ratio = max > 0 ? Math.min(y / max, 1) : 0;
      progress.style.transform = 'scaleX(' + ratio.toFixed(4) + ')';
    }

    updateActiveNav(y);
    ticking = false;
  }

  function requestScrollFrame() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScrollFrame);
    }
  }

  window.addEventListener('scroll', requestScrollFrame, { passive: true });
  window.addEventListener('resize', requestScrollFrame);

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- 2. Menu di động ---------- */
  var navToggle = $('#navToggle');
  var primaryNav = $('#primaryNav');

  function setNav(open) {
    document.body.classList.toggle('nav-open', open);
    if (navToggle) navToggle.setAttribute('aria-expanded', String(open));
  }

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      setNav(!document.body.classList.contains('nav-open'));
    });
  }

  if (primaryNav) {
    primaryNav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setNav(false);
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') setNav(false);
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 980) setNav(false);
  });

  /* ---------- 3. Thanh điều hướng theo vị trí cuộn ---------- */
  var navLinks = $$('.primary-nav a');
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute('href');
      if (!id || id.charAt(0) !== '#') return null;
      var el = document.querySelector(id);
      return el ? { link: link, el: el } : null;
    })
    .filter(Boolean);

  function updateActiveNav(y) {
    if (!sections.length) return;
    var probe = y + (window.innerHeight * 0.22);
    var current = sections[0];

    for (var i = 0; i < sections.length; i++) {
      var top = sections[i].el.offsetTop;
      if (top <= probe) current = sections[i];
    }

    // Ở gần cuối trang, giữ mục cuối cùng được chọn
    if (y + window.innerHeight >= document.documentElement.scrollHeight - 80) {
      current = sections[sections.length - 1];
    }

    sections.forEach(function (item) {
      var active = item === current;
      item.link.classList.toggle('is-active', active);
      if (active) item.link.setAttribute('aria-current', 'true');
      else item.link.removeAttribute('aria-current');
    });
  }

  /* ---------- 4. Hiện dần khi cuộn ---------- */
  var revealEls = $$('.reveal');

  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- 5. Đếm số liệu ---------- */
  var counters = $$('[data-count]');
  var numberFormat = new Intl.NumberFormat('vi-VN');

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;
    var duration = 1500;
    var start = null;

    function step(now) {
      if (start === null) start = now;
      var t = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = numberFormat.format(Math.round(target * eased));
      if (t < 1) window.requestAnimationFrame(step);
      else el.textContent = numberFormat.format(target);
    }

    window.requestAnimationFrame(step);
  }

  if (counters.length) {
    if ('IntersectionObserver' in window && !reduceMotion) {
      var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });

      counters.forEach(function (el) { counterObserver.observe(el); });
    } else {
      counters.forEach(function (el) {
        el.textContent = numberFormat.format(parseInt(el.getAttribute('data-count'), 10) || 0);
      });
    }
  }

  /* ---------- 6. Bộ lọc vùng miền ---------- */
  var filterButtons = $$('.filter-btn');
  var regionCards = $$('.region-card');
  var filterStatus = $('#filterStatus');
  var groupLabels = { all: 'Tất cả', bac: 'Miền Bắc', trung: 'Miền Trung', nam: 'Miền Nam' };

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.getAttribute('data-filter');

      filterButtons.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });

      var shown = 0;
      regionCards.forEach(function (card) {
        var match = filter === 'all' || card.getAttribute('data-group') === filter;
        card.classList.toggle('is-hidden', !match);
        if (match) shown++;
      });

      if (filterStatus) {
        filterStatus.textContent = 'Đang hiển thị ' + shown + ' điểm đến · ' +
          (groupLabels[filter] || '');
      }
    });
  });

  /* ---------- 7. Tab bốn mùa ---------- */
  var seasonTabs = $$('.season-tab');
  var seasonPanels = $$('.season-panel');

  function selectSeason(index) {
    seasonTabs.forEach(function (tab, i) {
      var active = i === index;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.setAttribute('tabindex', active ? '0' : '-1');
    });

    seasonPanels.forEach(function (panel, i) {
      var active = i === index;
      panel.classList.toggle('is-active', active);
      if (active) panel.removeAttribute('hidden');
      else panel.setAttribute('hidden', '');
    });
  }

  seasonTabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () { selectSeason(index); });

    tab.addEventListener('keydown', function (event) {
      var last = seasonTabs.length - 1;
      var next = null;

      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = index === last ? 0 : index + 1;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = index === 0 ? last : index - 1;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = last;

      if (next !== null) {
        event.preventDefault();
        selectSeason(next);
        seasonTabs[next].focus();
      }
    });
  });

  /* ---------- 8. Accordion: chỉ mở một mục ---------- */
  var allTips = $$('.tips details');
  allTips.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      allTips.forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });

  /* ---------- 9. Cánh hoa anh đào trên hero ---------- */
  var canvas = $('#petals');
  var hero = $('#hero');

  if (canvas && hero && !reduceMotion) {
    var ctx = canvas.getContext('2d');
    var petals = [];
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var width = 0;
    var height = 0;
    var rafId = null;
    var colors = ['#e9a9b8', '#f3c3cd', '#e59aa9', '#f7d6dd', '#de8f9f'];

    function resizeCanvas() {
      var rect = hero.getBoundingClientRect();
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function makePetal(initial) {
      return {
        x: Math.random() * width,
        y: initial ? Math.random() * height : -20 - Math.random() * 80,
        size: 3.6 + Math.random() * 4.2,
        speedY: 0.26 + Math.random() * 0.5,
        speedX: -0.2 + Math.random() * 0.45,
        angle: Math.random() * Math.PI * 2,
        spin: (-0.6 + Math.random() * 1.2) * 0.012,
        swing: Math.random() * Math.PI * 2,
        swingSpeed: 0.008 + Math.random() * 0.014,
        opacity: 0.26 + Math.random() * 0.42,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
    }

    function seedPetals() {
      var count = Math.max(14, Math.min(30, Math.round(width / 55)));
      petals = [];
      for (var i = 0; i < count; i++) petals.push(makePetal(true));
    }

    function drawPetal(petal) {
      var s = petal.size;
      ctx.save();
      ctx.translate(petal.x, petal.y);
      ctx.rotate(petal.angle);
      ctx.globalAlpha = petal.opacity;
      ctx.fillStyle = petal.color;

      // hình cánh hoa: hai đường cong đối xứng
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.92, -s * 0.78, s * 0.66, s * 0.72, 0, s);
      ctx.bezierCurveTo(-s * 0.66, s * 0.72, -s * 0.92, -s * 0.78, 0, -s);
      ctx.closePath();
      ctx.fill();

      // gân cánh
      ctx.globalAlpha = petal.opacity * 0.35;
      ctx.strokeStyle = '#c97e8e';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.7);
      ctx.quadraticCurveTo(s * 0.12, 0, 0, s * 0.7);
      ctx.stroke();

      ctx.restore();
    }

    function frame() {
      ctx.clearRect(0, 0, width, height);

      for (var i = 0; i < petals.length; i++) {
        var p = petals[i];
        p.swing += p.swingSpeed;
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.swing) * 0.55;
        p.angle += p.spin;

        if (p.y > height + 30 || p.x < -40 || p.x > width + 40) {
          petals[i] = makePetal(false);
          petals[i].x = Math.random() * width;
          continue;
        }
        drawPetal(p);
      }

      rafId = window.requestAnimationFrame(frame);
    }

    function startPetals() {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(frame);
    }

    function stopPetals() {
      if (rafId === null) return;
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }

    resizeCanvas();
    seedPetals();
    startPetals();

    var resizeTimer = null;
    window.addEventListener('resize', function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        resizeCanvas();
        seedPetals();
      }, 180);
    });

    if ('IntersectionObserver' in window) {
      var heroObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) startPetals();
          else stopPetals();
        });
      }, { threshold: 0.02 });
      heroObserver.observe(hero);
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stopPetals();
      else startPetals();
    });
  }

  /* ---------- 10. Thị sai nhẹ cho phần nền hero ---------- */
  var heroArt = $('.hero-art-wrap');

  if (heroArt && hero && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    var parallaxTarget = null;
    var parallaxRaf = null;

    hero.addEventListener('pointermove', function (event) {
      parallaxTarget = event;
      if (parallaxRaf !== null) return;

      parallaxRaf = window.requestAnimationFrame(function () {
        parallaxRaf = null;
        if (!parallaxTarget) return;
        var rect = hero.getBoundingClientRect();
        var relX = (parallaxTarget.clientX - rect.left) / rect.width - 0.5;
        var relY = (parallaxTarget.clientY - rect.top) / rect.height - 0.5;
        heroArt.style.setProperty('--hx', (relX * -26).toFixed(1) + 'px');
        heroArt.style.setProperty('--hy', (relY * -18).toFixed(1) + 'px');
      });
    });

    hero.addEventListener('pointerleave', function () {
      heroArt.style.setProperty('--hx', '0px');
      heroArt.style.setProperty('--hy', '0px');
    });
  }

  /* ---------- 11. Năm hiện tại ở chân trang ---------- */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- 12. Khởi tạo ---------- */
  onScrollFrame();
})();
