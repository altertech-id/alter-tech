<script>
  import WhatsAppCTA from '$lib/components/WhatsAppCTA.svelte';
</script>

<section id="cta" class="cta-section">
  <div class="container">
    <div class="cta-banner reveal">
      <div class="cta-glow"></div>
      <div class="cta-inner">
        <h2 class="text-h1 cta-title">Siap punya website yang bekerja untuk bisnis Anda?</h2>
        <p class="cta-sub">
          Ngobrol dulu, gratis. Ceritakan kebutuhan Anda dan kami bantu cari solusi paling pas — tanpa drama, tanpa biaya tersembunyi.
        </p>
        <div class="cta-actions">
          <WhatsAppCTA size="lg" message="Halo Altertech, saya mau konsultasi soal pembuatan website. Bisa dibantu?" />
          <a href="#harga" class="cta-secondary">Lihat Paket Harga</a>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .cta-section {
    padding-block: var(--space-8);
  }

  .cta-banner {
    position: relative;
    overflow: hidden;
    border-radius: var(--radius-lg);
    padding: var(--space-8) var(--space-4);
    background: linear-gradient(135deg, var(--color-primary), #1b7da3);
    box-shadow: var(--shadow-lg);
    text-align: center;
  }

  .cta-glow {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 50% 80% at 85% 20%, rgba(255, 255, 255, 0.18) 0%, transparent 60%),
      radial-gradient(ellipse 50% 70% at 10% 90%, rgba(13, 33, 55, 0.25) 0%, transparent 60%);
    pointer-events: none;
  }

  .cta-inner {
    position: relative;
    max-width: 640px;
    margin-inline: auto;
  }

  .cta-title {
    color: var(--color-text-inverse);
  }

  .cta-sub {
    color: rgba(255, 255, 255, 0.85);
    font-size: var(--text-body-lg-size);
    line-height: 1.6;
    margin-top: var(--space-3);
  }

  .cta-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-3);
    margin-top: var(--space-5);
  }

  .cta-secondary {
    display: inline-flex;
    align-items: center;
    height: 52px;
    padding-inline: 28px;
    border-radius: var(--radius-md);
    border: 1.5px solid rgba(255, 255, 255, 0.5);
    color: var(--color-text-inverse);
    font-weight: 600;
    font-size: 16px;
    transition: background var(--transition-fast), border-color var(--transition-fast);
  }

  .cta-secondary:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.8);
  }

  @media (min-width: 768px) {
    .cta-banner {
      padding: var(--space-10) var(--space-6);
    }

    .cta-actions {
      flex-direction: row;
      justify-content: center;
    }
  }
</style>
