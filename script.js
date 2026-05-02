// Custom cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animateCursor() {
  cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
  rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 60);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => observer.observe(el));

// Portfolio filter
function filterPortfolio(btn, style) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// Stories slider
let storyPos = 0;
const cardWidth = () => document.querySelector('.story-card')?.offsetWidth + 20 || 0;
function slideStories(dir) {
  const track = document.getElementById('storiesTrack');
  const max = track.children.length - 3;
  storyPos = Math.max(0, Math.min(storyPos + dir, max));
  track.style.transform = `translateX(-${storyPos * cardWidth()}px)`;
}

// FAQ toggle
function toggleFaq(item) {
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// Telegram Web App
const tg = window.Telegram?.WebApp;
const mainButton = tg?.MainButton;
const webAppBlocked = document.getElementById('webAppBlocked');
const submitBtn = document.querySelector('.submit-btn');
const bookingForm = document.getElementById('bookingForm');

function isTelegramWebApp() {
  return Boolean(tg?.initData);
}

function setWebAppBlocked(enabled) {
  if (!webAppBlocked) return;
  webAppBlocked.hidden = !enabled;
  if (enabled) {
    bookingForm?.classList.add('disabled');
    submitBtn?.setAttribute('disabled', 'disabled');
  } else {
    bookingForm?.classList.remove('disabled');
    submitBtn?.removeAttribute('disabled');
  }
}

function setupTelegramWebApp() {
  if (!tg) {
    setWebAppBlocked(true);
    return;
  }

  if (!isTelegramWebApp()) {
    setWebAppBlocked(true);
    mainButton?.hide();
    return;
  }

  tg.ready();
  tg.expand();
  mainButton?.setText('Отправить заявку');
  mainButton?.show();
  mainButton?.enable();
  tg.onEvent('mainButtonClicked', handleSubmit);
}

function collectBookingData() {
  return {
    name: document.getElementById('bookingName')?.value.trim(),
    contact: document.getElementById('bookingContact')?.value.trim(),
    idea: document.getElementById('bookingIdea')?.value.trim(),
    location: document.getElementById('bookingLocation')?.value,
    style: document.getElementById('bookingStyle')?.value,
    date: document.getElementById('bookingDate')?.value.trim(),
    attachments: Array.from(document.getElementById('fileInput')?.files || []).map(file => file.name),
  };
}

function validateBookingData(data) {
  return data.name && data.contact && data.idea;
}

function handleSubmit() {
  const data = collectBookingData();
  if (!validateBookingData(data)) {
    alert('Заполните, пожалуйста, имя, контакт и идею тату.');
    return;
  }

  if (!isTelegramWebApp()) {
    alert('Эта страница работает только внутри Telegram Mini App.');
    setWebAppBlocked(true);
    return;
  }

  const payload = {
    type: 'booking',
    data,
    initData: tg.initData,
  };

  tg.sendData(JSON.stringify(payload));
  submitBtn.textContent = 'Отправлено ✓';
  submitBtn.setAttribute('disabled', 'disabled');
  mainButton?.hide();
}

window.addEventListener('DOMContentLoaded', () => {
  setupTelegramWebApp();
});
