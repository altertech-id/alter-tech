<script>
  import Icon from '$lib/components/Icon.svelte';

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Layanan', href: '/#layanan' },
    { label: 'Harga', href: '/#harga' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Tracking Project', href: '/#tracking' },
  ];
</script>

<footer class="footer">
  <div class="footer-inner container">
    <div class="footer-grid">
      <!-- Brand -->
      <div class="footer-brand">
        <img src="/images/logo-horizontal.png" alt="Altertech" class="footer-logo" width="150" height="32" loading="lazy" />
        <p class="footer-desc">
          Web agency cepat dan terpercaya. Dari UMKM sampai enterprise, kami bikin website yang bekerja untuk bisnis Anda.
        </p>
      </div>

      <!-- Quick Links -->
      <div class="footer-section">
        <h4 class="footer-heading">Menu</h4>
        <ul class="footer-links">
          {#each quickLinks as link}
            <li><a href={link.href}>{link.label}</a></li>
          {/each}
        </ul>
      </div>

      <!-- Contact -->
      <div class="footer-section">
        <h4 class="footer-heading">Kontak</h4>
        <ul class="footer-links">
          <li>
            <a href="https://wa.me/6281399484916" target="_blank" rel="noopener noreferrer">
              <Icon name="phone" size={16} /> WhatsApp
            </a>
          </li>
          <li>
            <a href="mailto:hello@altertech.id">
              <Icon name="mail" size={16} /> hello@altertech.id
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <p class="footer-copyright">© {currentYear} Altertech. All rights reserved.</p>
      <a href="/admin/login" class="admin-link">Admin Panel</a>
    </div>
  </div>
</footer>

<style>
  .footer {
    background-color: var(--color-accent);
    color: var(--color-text-inverse);
    padding-block: var(--space-8) var(--space-5);
  }

  .footer-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-6);
    margin-bottom: var(--space-6);
  }

  .footer-logo {
    height: 32px;
    width: auto;
    margin-bottom: var(--space-3);
    filter: brightness(0) invert(1);
  }

  .footer-desc {
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    line-height: 1.6;
    max-width: 320px;
  }

  .footer-heading {
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: var(--space-3);
    color: rgba(255, 255, 255, 0.5);
  }

  .footer-links {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .footer-links a {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
    transition: color var(--transition-fast);
  }

  .footer-links a:hover {
    color: var(--color-primary);
  }

  .footer-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: var(--space-4);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .footer-copyright {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.5);
  }

  .admin-link {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.3);
    transition: color var(--transition-fast);
  }

  .admin-link:hover {
    color: rgba(255, 255, 255, 0.6);
  }

  @media (min-width: 768px) {
    .footer-grid {
      grid-template-columns: 2fr 1fr 1fr;
    }
  }
</style>
