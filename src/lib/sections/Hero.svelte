<script>
  import WhatsAppCTA from '$lib/components/WhatsAppCTA.svelte';

  let counterVisible = $state(false);
  let projectCount = $state(0);

  $effect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !counterVisible) {
          counterVisible = true;
          animateCounter();
        }
      },
      { threshold: 0.3 }
    );

    const el = document.getElementById('hero');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  });

  function animateCounter() {
    const target = 15;
    const duration = 1500;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      projectCount = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
</script>

<section id="hero" class="hero">
  <div class="hero-bg"></div>
  <div class="hero-content container">
    <div class="hero-main">
      <div class="hero-text">
        <div class="hero-badge">
          <span class="badge-dot"></span>
          Web Agency Cepat & Terpercaya
        </div>
        <h1 class="text-hero">
          Website Profesional,<br/>
          <span class="hero-highlight">Jadi dalam Hitungan Hari.</span>
        </h1>
        <p class="hero-sub">
          Bukan berminggu-minggu. Kami bangun website bisnis Anda dengan teknologi modern — cepat, responsif, dan siap tumbuh bersama bisnis Anda.
        </p>
        <div class="hero-cta">
          <WhatsAppCTA size="lg" message="Halo Altertech, saya tertarik dengan layanan pembuatan website. Bisa konsultasi dulu?" />
          <a href="#harga" class="hero-secondary-cta">
            Lihat Paket Harga
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>
      </div>

      <div class="hero-visual" aria-hidden="true">
        <div class="browser">
          <div class="browser-bar">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="browser-url">altertech.id</span>
          </div>
          <div class="browser-body">
            <div class="mock-nav">
              <span class="mock-logo"></span>
              <span class="mock-links"></span>
            </div>
            <div class="mock-hero">
              <span class="mock-line w-80"></span>
              <span class="mock-line w-60"></span>
              <span class="mock-btn"></span>
            </div>
            <div class="mock-cards">
              <span class="mock-card"></span>
              <span class="mock-card"></span>
              <span class="mock-card"></span>
            </div>
          </div>
        </div>
        <div class="float-badge badge-live">
          <span class="live-dot"></span>
          Website Live
        </div>
        <div class="float-badge badge-fast">1–2 hari kerja</div>
      </div>
    </div>

    <div class="hero-stats">
      <div class="stat-card">
        <span class="stat-number">{projectCount}+</span>
        <span class="stat-label">Project Delivered</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">1–2</span>
        <span class="stat-label">Hari Kerja</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">100%</span>
        <span class="stat-label">Klien Puas</span>
      </div>
    </div>
  </div>
</section>

<style>
  .hero {
    position: relative;
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    align-items: center;
    padding-top: calc(var(--header-height) + var(--space-6));
    padding-bottom: var(--space-8);
    overflow: hidden;
  }

  .hero-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 70% 20%, rgba(37, 150, 190, 0.08) 0%, transparent 70%),
      radial-gradient(ellipse 60% 50% at 20% 80%, rgba(13, 33, 55, 0.04) 0%, transparent 70%);
    z-index: 0;
  }

  .hero-content {
    position: relative;
    z-index: 1;
  }

  .hero-main {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-6);
    align-items: center;
  }

  .hero-text {
    max-width: 640px;
    animation: heroFadeIn 0.8s ease both;
  }

  /* --- Hero visual (browser mockup) --- */
  .hero-visual {
    display: none;
    position: relative;
    animation: heroFadeIn 0.8s ease 0.2s both;
  }

  .browser {
    background: var(--color-surface-base);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    overflow: hidden;
  }

  .browser-bar {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: 12px var(--space-3);
    background: var(--color-surface-card);
    border-bottom: 1px solid var(--color-border);
  }

  .browser-bar .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--color-border-light);
  }

  .browser-url {
    margin-left: var(--space-2);
    padding: 4px 14px;
    background: var(--color-surface-base);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-pill);
    font-size: 12px;
    color: var(--color-text-secondary);
  }

  .browser-body {
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .mock-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .mock-logo {
    display: block;
    width: 72px;
    height: 16px;
    border-radius: var(--radius-sm);
    background: var(--color-primary);
  }

  .mock-links {
    display: block;
    width: 120px;
    height: 10px;
    border-radius: var(--radius-pill);
    background: var(--color-border);
  }

  .mock-hero {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    padding-block: var(--space-3);
  }

  .mock-line {
    display: block;
    height: 18px;
    border-radius: var(--radius-sm);
    background: var(--color-accent);
  }

  .mock-line.w-80 { width: 80%; }
  .mock-line.w-60 { width: 55%; background: var(--color-primary); opacity: 0.85; }

  .mock-btn {
    display: block;
    width: 110px;
    height: 32px;
    margin-top: var(--space-2);
    border-radius: var(--radius-md);
    background: var(--color-primary);
  }

  .mock-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-3);
  }

  .mock-card {
    height: 64px;
    border-radius: var(--radius-md);
    background: var(--color-surface-card);
    border: 1px solid var(--color-border);
  }

  .float-badge {
    position: absolute;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    background: var(--color-surface-base);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-pill);
    box-shadow: var(--shadow-md);
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .badge-live {
    top: -16px;
    right: -12px;
    animation: floaty 4s ease-in-out infinite;
  }

  .badge-fast {
    bottom: -16px;
    left: -12px;
    color: var(--color-primary);
    animation: floaty 4s ease-in-out 1.5s infinite;
  }

  .live-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--color-success);
    box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.2);
  }

  @keyframes floaty {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: 6px 16px;
    background: var(--color-primary-light);
    color: var(--color-primary);
    border-radius: var(--radius-pill);
    font-size: 13px;
    font-weight: 600;
    margin-bottom: var(--space-4);
  }

  .badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--color-primary);
    animation: dotPulse 2s infinite;
  }

  .hero-highlight {
    color: var(--color-primary);
  }

  .hero-sub {
    font-size: var(--text-body-lg-size);
    color: var(--color-text-secondary);
    margin-top: var(--space-4);
    max-width: 520px;
    line-height: 1.7;
  }

  .hero-cta {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    margin-top: var(--space-5);
  }

  .hero-secondary-cta {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    color: var(--color-primary);
    font-weight: 600;
    font-size: 15px;
    transition: gap var(--transition-fast);
  }

  .hero-secondary-cta:hover {
    gap: var(--space-3);
  }

  .hero-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-3);
    margin-top: var(--space-8);
    animation: heroFadeIn 0.8s ease 0.3s both;
  }

  .stat-card {
    text-align: center;
    padding: var(--space-4) var(--space-3);
    background: var(--color-surface-base);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
  }

  .stat-number {
    display: block;
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 800;
    color: var(--color-primary);
    line-height: 1.2;
  }

  .stat-label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: var(--color-text-secondary);
    margin-top: var(--space-1);
  }

  @keyframes heroFadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes dotPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  @media (min-width: 768px) {
    .hero-cta {
      flex-direction: row;
      align-items: center;
    }

    .hero-stats {
      max-width: 500px;
    }
  }

  @media (min-width: 1024px) {
    .hero {
      min-height: auto;
      padding-block: calc(var(--header-height) + var(--space-10)) var(--space-10);
    }

    .hero-main {
      grid-template-columns: 1.05fr 0.95fr;
      gap: var(--space-8);
    }

    .hero-visual {
      display: block;
    }

    .hero-stats {
      max-width: 560px;
      margin-top: var(--space-8);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .badge-live,
    .badge-fast {
      animation: none;
    }
  }
</style>
