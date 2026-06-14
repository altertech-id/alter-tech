<script>
  import Card from '$lib/components/Card.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import Button from '$lib/components/Button.svelte';
  import { fetchPortfolio } from '$lib/data/api.js';
  import { onMount } from 'svelte';

  let items = $state([]);
  let selectedItem = $state(null);
  let modalOpen = $state(false);

  $effect(() => {
    fetchPortfolio().then(data => { items = data; });
  });

  function openDetail(item) {
    selectedItem = item;
    modalOpen = true;
  }

  onMount(() => {
    if (CSS.supports && CSS.supports('animation-timeline: view()')) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  });
</script>

<svelte:head>
  <title>Portfolio — Altertech | Project Website yang Sudah Kami Selesaikan</title>
  <meta name="description" content="Lihat portfolio project website yang sudah dikerjakan Altertech. Dari company profile hingga web app custom, untuk UMKM sampai enterprise." />
  <link rel="canonical" href="https://altertech.id/portfolio" />
  <meta property="og:title" content="Portfolio — Altertech" />
  <meta property="og:description" content="Project website yang sudah kami selesaikan. UMKM hingga enterprise." />
  <meta property="og:url" content="https://altertech.id/portfolio" />
</svelte:head>

<section class="portfolio-page">
  <div class="container">
    <div class="page-header reveal">
      <a href="/" class="back-link">← Kembali ke Beranda</a>
      <h1 class="text-h1">Portfolio Kami</h1>
      <p class="page-subtitle">Setiap project punya tantangan unik. Ini beberapa yang sudah kami selesaikan.</p>
    </div>

    <div class="portfolio-grid">
      {#each items as item, i}
        <div class="reveal" style="transition-delay: {i * 80}ms">
          <button class="portfolio-card-btn" onclick={() => openDetail(item)}>
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
                  <div class="portfolio-overlay">
                    <span>Lihat Detail</span>
                  </div>
                </div>
                <h3 class="portfolio-name">{item.name}</h3>
                <p class="portfolio-desc">{item.description}</p>
              </div>
            </Card>
          </button>
        </div>
      {/each}
    </div>

    <div class="enterprise-section reveal">
      <div class="enterprise-card">
        <div class="enterprise-icon">🏢</div>
        <h3 class="text-h3">Enterprise & Confidential Projects</h3>
        <p class="enterprise-desc">
          Selain project yang ditampilkan, kami juga dipercaya menangani project internal berskala besar untuk perusahaan enterprise — termasuk <strong>Petrokimia Gresik</strong> (BUMN) dan <strong>HM Sampoerna</strong> (multinasional). Detail project bersifat konfidensial sesuai NDA.
        </p>
      </div>
    </div>
  </div>
</section>

<Modal bind:open={modalOpen} title={selectedItem?.name || ''}>
  {#if selectedItem}
    <div class="detail-content">
      <div class="detail-thumb">
        {#if selectedItem.screenshot_url}
          <img src={selectedItem.screenshot_url} alt={selectedItem.name} class="portfolio-img large" />
        {:else}
          <div class="portfolio-placeholder large">
            <span class="placeholder-initial">{selectedItem.name.charAt(0)}</span>
          </div>
        {/if}
      </div>
      <p class="detail-desc">{selectedItem.description}</p>
      {#if selectedItem.website_url}
        <Button href={selectedItem.website_url} variant="primary" size="md">
          Kunjungi Website →
        </Button>
      {/if}
    </div>
  {/if}
</Modal>

<style>
  .portfolio-page {
    padding-top: calc(var(--header-height) + var(--space-6));
    padding-bottom: var(--space-8);
    min-height: 100vh;
  }

  .page-header {
    margin-bottom: var(--space-6);
  }

  .back-link {
    display: inline-block;
    font-size: 14px;
    color: var(--color-primary);
    font-weight: 500;
    margin-bottom: var(--space-4);
    transition: gap var(--transition-fast);
  }

  .back-link:hover {
    opacity: 0.8;
  }

  .page-subtitle {
    color: var(--color-text-secondary);
    font-size: var(--text-body-lg-size);
    margin-top: var(--space-3);
    max-width: 500px;
  }

  .portfolio-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  .portfolio-card-btn {
    display: block;
    width: 100%;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    text-align: left;
    -webkit-tap-highlight-color: transparent;
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
    position: relative;
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

  .portfolio-img.large {
    aspect-ratio: 16/10;
    border-radius: var(--radius-md);
  }

  .portfolio-placeholder.large {
    aspect-ratio: 16/10;
    border-radius: var(--radius-md);
  }

  .placeholder-initial {
    font-size: 3rem;
    font-weight: 800;
    color: var(--color-primary);
    opacity: 0.4;
  }

  .portfolio-overlay {
    position: absolute;
    inset: 0;
    background: rgba(13, 33, 55, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity var(--transition-normal);
  }

  .portfolio-overlay span {
    color: white;
    font-weight: 600;
    font-size: 14px;
    padding: 8px 20px;
    background: var(--color-primary);
    border-radius: var(--radius-md);
  }

  .portfolio-card-btn:hover .portfolio-overlay {
    opacity: 1;
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

  .enterprise-section {
    margin-top: var(--space-8);
  }

  .enterprise-card {
    text-align: center;
    padding: var(--space-6) var(--space-4);
    background: linear-gradient(135deg, rgba(37, 150, 190, 0.05), rgba(13, 33, 55, 0.03));
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
  }

  .enterprise-icon {
    font-size: 3rem;
    margin-bottom: var(--space-3);
  }

  .enterprise-desc {
    font-size: 14px;
    color: var(--color-text-secondary);
    line-height: 1.7;
    max-width: 560px;
    margin-inline: auto;
    margin-top: var(--space-3);
  }

  .enterprise-desc strong {
    color: var(--color-text-primary);
  }

  /* Modal detail */
  .detail-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .detail-desc {
    font-size: 15px;
    color: var(--color-text-secondary);
    line-height: 1.7;
  }

  @media (min-width: 768px) {
    .portfolio-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .portfolio-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>
