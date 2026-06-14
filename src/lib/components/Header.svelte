<script>
  import { page } from '$app/stores';
  import WhatsAppCTA from './WhatsAppCTA.svelte';

  let { isLandingPage = false } = $props();
  let mobileMenuOpen = $state(false);
  let scrolled = $state(false);

  const navItems = [
    { label: 'Layanan', href: '/#layanan' },
    { label: 'Keunggulan', href: '/#keunggulan' },
    { label: 'Harga', href: '/#harga' },
    { label: 'Alur Kerja', href: '/#alur-kerja' },
    { label: 'Tracking', href: '/#tracking' },
    { label: 'Portfolio', href: '/portfolio' },
  ];

  $effect(() => {
    function handleScroll() {
      scrolled = window.scrollY > 20;
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  });

  function closeMobileMenu() {
    mobileMenuOpen = false;
  }
</script>

<header class="header" class:scrolled class:menu-open={mobileMenuOpen}>
  <div class="header-inner container">
    <a href="/" class="logo" aria-label="Altertech Home">
      <img src="/images/logo-horizontal.png" alt="Altertech" class="logo-img" width="150" height="36" />
    </a>

    <nav class="nav-desktop" aria-label="Navigasi utama">
      {#each navItems as item}
        <a href={item.href} class="nav-link">{item.label}</a>
      {/each}
    </nav>

    <div class="header-actions">
      <WhatsAppCTA size="sm" message="Halo Altertech, saya tertarik dengan layanan pembuatan website. Bisa konsultasi dulu?" />
    </div>

    <button
      class="mobile-toggle"
      onclick={() => mobileMenuOpen = !mobileMenuOpen}
      aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
      aria-expanded={mobileMenuOpen}
    >
      <span class="hamburger" class:open={mobileMenuOpen}>
        <span></span>
        <span></span>
        <span></span>
      </span>
    </button>
  </div>

  {#if mobileMenuOpen}
    <div class="mobile-overlay" onclick={closeMobileMenu} role="presentation"></div>
    <nav class="nav-mobile" aria-label="Navigasi mobile">
      {#each navItems as item}
        <a href={item.href} class="nav-link-mobile" onclick={closeMobileMenu}>{item.label}</a>
      {/each}
      <div class="mobile-cta">
        <WhatsAppCTA size="lg" message="Halo Altertech, saya tertarik dengan layanan pembuatan website. Bisa konsultasi dulu?" />
      </div>
    </nav>
  {/if}
</header>

<style>
  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: var(--header-height);
    z-index: 1000;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    transition: all var(--transition-normal);
  }

  .header.scrolled {
    background: rgba(255, 255, 255, 0.95);
    box-shadow: var(--shadow-sm);
    height: 60px;
  }

  .header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    gap: var(--space-4);
  }

  .logo {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .logo-img {
    height: 36px;
    width: auto;
    transition: height var(--transition-normal);
  }

  .header.scrolled .logo-img {
    height: 30px;
  }

  /* Desktop nav */
  .nav-desktop {
    display: none;
    align-items: center;
    gap: var(--space-4);
  }

  .nav-link {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text-secondary);
    transition: color var(--transition-fast);
    white-space: nowrap;
  }

  .nav-link:hover {
    color: var(--color-primary);
  }

  .header-actions {
    display: none;
  }

  /* Mobile toggle */
  .mobile-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: none;
    background: transparent;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .hamburger {
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 22px;
  }

  .hamburger span {
    display: block;
    height: 2px;
    width: 100%;
    background: var(--color-text-primary);
    border-radius: 2px;
    transition: all var(--transition-normal);
    transform-origin: center;
  }

  .hamburger.open span:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }
  .hamburger.open span:nth-child(2) {
    opacity: 0;
  }
  .hamburger.open span:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }

  /* Mobile nav */
  .mobile-overlay {
    position: fixed;
    inset: 0;
    background: rgba(13, 33, 55, 0.3);
    z-index: -1;
    animation: fadeIn 200ms ease;
  }

  .nav-mobile {
    position: fixed;
    top: var(--header-height);
    left: 0;
    right: 0;
    background: var(--color-surface-base);
    padding: var(--space-3);
    box-shadow: var(--shadow-lg);
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    animation: slideDown 250ms ease;
    z-index: 999;
  }


  .header.scrolled .nav-mobile {
    top: 60px;
  }

  .nav-link-mobile {
    display: block;
    padding: var(--space-3);
    font-size: 15px;
    font-weight: 500;
    color: var(--color-text-primary);
    border-radius: var(--radius-md);
    transition: background var(--transition-fast);
  }

  .nav-link-mobile:hover,
  .nav-link-mobile:active {
    background: var(--color-surface-card);
    color: var(--color-primary);
  }

  .mobile-cta {
    padding: var(--space-3);
    padding-top: var(--space-3);
    border-top: 1px solid var(--color-border);
    margin-top: var(--space-2);
  }

  .mobile-cta :global(.wa-cta) {
    width: 100%;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Desktop breakpoint */
  @media (min-width: 1024px) {
    .nav-desktop {
      display: flex;
    }
    .header-actions {
      display: flex;
      align-items: center;
    }
    .mobile-toggle {
      display: none;
    }
  }
</style>
