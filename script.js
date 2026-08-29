// =========================================================
// RIKY STORE — Animasi Loading (System Boot) & Reveal Konten
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  const fill = document.getElementById('loaderFill');
  const percentLabel = document.getElementById('loaderPercent');
  const statusLabel = document.getElementById('loaderLabel');
  const mainContent = document.getElementById('mainContent');

  const PAUSE = 1500; // jeda 1.5 detik antar tahap, sesuai permintaan

  const steps = [
    { percent: 25, label: 'MEMUAT KATALOG AKUN' },
    { percent: 50, label: 'MEMVERIFIKASI SISTEM' },
    { percent: 100, label: 'SIAP DIGUNAKAN' },
  ];

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function setProgress(percent, label) {
    fill.style.width = percent + '%';
    percentLabel.textContent = percent + '%';
    if (label) statusLabel.textContent = label;
  }

  async function runBootSequence() {
    for (const step of steps) {
      setProgress(step.percent, step.label);
      // beri waktu transisi CSS bar berjalan sebelum jeda dihitung
      await wait(PAUSE);
    }
    finishLoading();
  }

  function finishLoading() {
    loader.classList.add('is-hidden');
    // hilangkan loader dari alur setelah transisi opacity selesai
    setTimeout(() => { loader.style.display = 'none'; }, 650);
    revealMainContent();
  }

  function revealMainContent() {
    mainContent.classList.add('is-active');
    const revealEls = Array.from(document.querySelectorAll('.reveal'))
      .sort((a, b) => Number(a.dataset.reveal) - Number(b.dataset.reveal));

    revealEls.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('is-visible');
      }, index * 90); // animasi masuk bertahap, tidak langsung muncul semua
    });
  }

  // mulai sequence loading setelah frame pertama render
  requestAnimationFrame(() => {
    setProgress(0, 'INITIALIZING');
    runBootSequence();
  });

  // JARING PENGAMAN: kalau karena sebab apapun (mis. tab browser di-throttle,
  // atau error tak terduga) sequence di atas tidak selesai, paksa tampilkan
  // konten utama maksimal 6 detik setelah halaman dibuka.
  setTimeout(() => {
    if (!mainContent.classList.contains('is-active')) {
      finishLoading();
    }
  }, 6000);
});
