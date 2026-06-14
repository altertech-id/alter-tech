<script>
  import Card from '$lib/components/Card.svelte';
  import WhatsAppCTA from '$lib/components/WhatsAppCTA.svelte';
  import { fetchPackages } from '$lib/data/api.js';

  /** @type {Array} */
  let packages = $state([]);

  $effect(() => {
    fetchPackages().then(data => { packages = data; });
  });

  function formatPrice(price) {
    return new Intl.NumberFormat('id-ID').format(price);
  }
</script>

<section id="harga" class="section">
  <div class="container">
    <div class="section-header reveal">
      <h2 class="text-h1">Paket Harga Transparan</h2>
      <p class="section-subtitle">Pilih paket yang sesuai kebutuhan bisnis Anda. Tanpa biaya tersembunyi, tanpa markup berlebihan.</p>
    </div>

    <div class="pricing-grid">
      {#each packages as pkg, i}
        <div class="reveal" style="transition-delay: {i * 120}ms">
          <Card variant={pkg.is_highlighted ? 'highlighted' : 'default'}>
            <div class="pricing-card">
              {#if pkg.is_highlighted}
                <div class="popular-badge">POPULER</div>
              {/if}
              <h3 class="pkg-name">{pkg.name}</h3>
              <div class="pkg-price">
                <span class="price-prefix">Rp</span>
                <span class="price-amount">{formatPrice(pkg.price)}</span>
                {#if pkg.name === 'Custom'}
                  <span class="price-suffix">+</span>
                {/if}
              </div>
              {#if pkg.renewal_price}
                <p class="pkg-renewal">Renewal: Rp {formatPrice(pkg.renewal_price)}/tahun</p>
              {:else}
                <p class="pkg-renewal">Harga disesuaikan scope project</p>
              {/if}

              <ul class="feature-list">
                {#each pkg.features as feature}
                  <li class="feature-item" class:included={feature.included} class:excluded={!feature.included}>
                    {#if feature.included}
                      <svg class="feature-icon check" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    {:else}
                      <svg class="feature-icon cross" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                    {/if}
                    <span>{feature.name}</span>
                  </li>
                {/each}
              </ul>

              <WhatsAppCTA
                size="md"
                variant={pkg.is_highlighted ? 'primary' : 'ghost'}
                message="Halo Altertech, saya tertarik dengan paket {pkg.name} (Rp {formatPrice(pkg.price)}). Bisa diskusi lebih lanjut?"
              />
            </div>
          </Card>
        </div>
      {/each}
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

  .pricing-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-4);
    align-items: start;
  }

  .pricing-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    position: relative;
  }

  .popular-badge {
    position: absolute;
    top: -12px;
    right: -8px;
    background: var(--color-primary);
    color: white;
    font-size: 11px;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: var(--radius-pill);
    letter-spacing: 0.05em;
  }

  .pkg-name {
    font-size: var(--text-h2-size);
    font-weight: 700;
  }

  .pkg-price {
    display: flex;
    align-items: baseline;
    gap: 4px;
  }

  .price-prefix {
    font-size: 16px;
    font-weight: 600;
    color: var(--color-text-secondary);
  }

  .price-amount {
    font-size: clamp(1.75rem, 3vw, 2.25rem);
    font-weight: 800;
    color: var(--color-primary);
    line-height: 1;
  }

  .price-suffix {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-primary);
  }

  .pkg-renewal {
    font-size: 13px;
    color: var(--color-text-secondary);
  }

  .feature-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    padding-block: var(--space-3);
    border-top: 1px solid var(--color-border);
    flex: 1;
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: 14px;
  }

  .feature-item.included {
    color: var(--color-text-primary);
  }

  .feature-item.excluded {
    color: var(--color-text-secondary);
    opacity: 0.6;
  }

  .feature-icon {
    flex-shrink: 0;
  }

  .feature-icon.check {
    color: var(--color-success);
  }

  .feature-icon.cross {
    color: var(--color-text-secondary);
  }

  .pricing-card :global(.wa-cta) {
    width: 100%;
    margin-top: auto;
  }

  @media (min-width: 768px) {
    .pricing-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>
