<script>
  import Card from '$lib/components/Card.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import WhatsAppCTA from '$lib/components/WhatsAppCTA.svelte';
  import { SERVICES } from '$lib/data/mock.js';
</script>

<section id="layanan" class="section">
  <div class="container">
    <div class="section-header reveal">
      <h2 class="text-h1">Layanan Kami</h2>
      <p class="section-subtitle">Solusi web yang tepat, tanpa komplikasi. Kami sesuaikan teknologi dengan kebutuhan, bukan sebaliknya.</p>
    </div>

    <div class="services-grid">
      {#each SERVICES as service, i}
        <div class="reveal" style="transition-delay: {i * 100}ms">
          <Card>
            <div class="service-card">
              <span class="service-icon">
                <Icon name={service.icon} size={24} />
              </span>
              <h3 class="text-h3">{service.title}</h3>
              <p class="service-desc">{service.description}</p>
              <div class="service-cta">
                <WhatsAppCTA size="sm" variant="ghost" label="Konsultasi Gratis" message={service.wa_message} />
              </div>
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

  .services-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  .service-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .service-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: var(--radius-md);
    background: var(--color-primary-light);
    color: var(--color-primary);
  }

  .service-desc {
    color: var(--color-text-secondary);
    font-size: 14px;
    line-height: 1.6;
    flex: 1;
  }

  .service-cta {
    margin-top: var(--space-1);
  }

  .service-cta :global(.wa-cta) {
    width: 100%;
  }

  @media (min-width: 768px) {
    .services-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .services-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }
</style>
