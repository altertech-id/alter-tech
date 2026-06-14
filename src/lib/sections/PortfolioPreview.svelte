<script>
  import Card from '$lib/components/Card.svelte';
  import Button from '$lib/components/Button.svelte';
  import { fetchPortfolioPreview } from '$lib/data/api.js';

  let items = $state([]);

  $effect(() => {
    fetchPortfolioPreview().then(data => { items = data; });
  });
</script>

<section id="portofolio-preview" class="section">
  <div class="container">
    <div class="section-header reveal">
      <h2 class="text-h1">Portfolio Kami</h2>
      <p class="section-subtitle">Beberapa project yang sudah kami selesaikan. Setiap klien punya cerita dan kebutuhan yang berbeda.</p>
    </div>

    <div class="portfolio-grid">
      {#each items as item, i}
        <div class="reveal" style="transition-delay: {i * 100}ms">
          <Card>
            <div class="portfolio-card">
              <div class="portfolio-thumb">
                {#if item.screenshot_url}
                  <img src={item.screenshot_url} alt={item.name} class="portfolio-img" loading="lazy" />
                {:else}
                  <div class="portfolio-placeholder">
                    <span class="placeholder-initial">{item.name.charAt(0)}</span>
                  </div>
                {/if}
              </div>
              <h3 class="portfolio-name">{item.name}</h3>
              <p class="portfolio-desc">{item.description}</p>
            </div>
          </Card>
        </div>
      {/each}
    </div>

    <div class="enterprise-trust reveal">
      <div class="trust-badge">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87L10 1z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
        </svg>
        Dipercaya oleh Enterprise
      </div>
      <p class="trust-text">
        Kami juga telah dipercaya mengerjakan project internal untuk <strong>Petrokimia Gresik</strong> dan <strong>HM Sampoerna</strong> — perusahaan skala nasional dan multinasional.
      </p>
    </div>

    <div class="portfolio-cta reveal">
      <Button href="/portfolio" variant="ghost" size="lg">
        Lihat Semua Portfolio →
      </Button>
    </div>
  </div>
</section>

<style>
  .section-header {
    text-align: center;
    max-width: 600px;
    margin-inline: auto;
    margin-bottom: var(--space-6);
  }

  .section-subtitle {
    color: var(--color-text-secondary);
    font-size: var(--text-body-lg-size);
    margin-top: var(--space-3);
  }

  .portfolio-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  .portfolio-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .portfolio-thumb {
    aspect-ratio: 16/10;
    border-radius: var(--radius-md);
    overflow: hidden;
    background: var(--color-surface-card);
  }

  .portfolio-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--color-primary-light), rgba(13, 33, 55, 0.05));
  }

  .portfolio-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .placeholder-initial {
    font-size: 3rem;
    font-weight: 800;
    color: var(--color-primary);
    opacity: 0.4;
  }

  .portfolio-name {
    font-size: var(--text-h3-size);
    font-weight: 700;
  }

  .portfolio-desc {
    font-size: 14px;
    color: var(--color-text-secondary);
    line-height: 1.6;
  }

  .enterprise-trust {
    margin-top: var(--space-6);
    padding: var(--space-4);
    background: linear-gradient(135deg, rgba(37, 150, 190, 0.05), rgba(13, 33, 55, 0.03));
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    text-align: center;
  }

  .trust-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    color: var(--color-primary);
    font-weight: 700;
    font-size: 14px;
    margin-bottom: var(--space-2);
  }

  .trust-text {
    font-size: 14px;
    color: var(--color-text-secondary);
    line-height: 1.6;
    max-width: 500px;
    margin-inline: auto;
  }

  .trust-text strong {
    color: var(--color-text-primary);
  }

  .portfolio-cta {
    text-align: center;
    margin-top: var(--space-5);
  }

  @media (min-width: 768px) {
    .portfolio-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .portfolio-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }
</style>
