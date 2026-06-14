<script>
  /** @type {{ message?: string, size?: 'sm' | 'md' | 'lg', variant?: 'primary' | 'ghost' | 'floating', label?: string, class?: string }} */
  let { message = 'Halo Altertech, saya tertarik dengan layanan pembuatan website. Bisa diskusi lebih lanjut?', size = 'md', variant = 'primary', label = '', class: className = '' } = $props();
  
  const waUrl = $derived(`https://wa.me/6281399484916?text=${encodeURIComponent(message)}`);
</script>

<a href={waUrl} target="_blank" rel="noopener noreferrer" class="wa-cta wa-{variant} wa-{size} {className}" aria-label="Konsultasi via WhatsApp">
  <svg class="wa-icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
  <span class="wa-text">
    {#if variant === 'floating'}
      <span class="wa-text-desktop">Konsultasi Gratis</span>
    {:else}
      {label || 'Konsultasi Gratis via WhatsApp'}
    {/if}
  </span>
</a>

<style>
  .wa-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    border-radius: var(--radius-md);
    font-weight: 600;
    text-decoration: none;
    transition: all var(--transition-fast);
    cursor: pointer;
    white-space: nowrap;
    -webkit-tap-highlight-color: transparent;
  }

  .wa-icon {
    flex-shrink: 0;
  }

  /* Variants */
  .wa-primary {
    background: #25D366;
    color: white;
  }
  .wa-primary:hover {
    background: #1ebe5d;
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
  }

  .wa-ghost {
    background: transparent;
    color: #25D366;
    border: 1.5px solid #25D366;
  }
  .wa-ghost:hover {
    background: rgba(37, 211, 102, 0.08);
  }

  .wa-floating {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: #25D366;
    color: white;
    border-radius: var(--radius-pill);
    box-shadow: var(--shadow-lg);
    z-index: 100;
    animation: bounceIn 0.5s ease 1s both;
  }
  .wa-floating:hover {
    background: #1ebe5d;
    transform: scale(1.05);
    box-shadow: 0 8px 25px rgba(37, 211, 102, 0.4);
  }

  /* Sizes */
  .wa-sm {
    height: 36px;
    padding-inline: 14px;
    font-size: 13px;
  }
  .wa-sm .wa-icon { width: 16px; height: 16px; }

  .wa-md {
    height: 44px;
    padding-inline: 20px;
    font-size: 14px;
  }
  .wa-md .wa-icon { width: 18px; height: 18px; }

  .wa-lg {
    height: 52px;
    padding-inline: 28px;
    font-size: 16px;
  }
  .wa-lg .wa-icon { width: 20px; height: 20px; }

  .wa-floating {
    height: 52px;
    padding-inline: 20px;
  }
  .wa-floating .wa-icon { width: 22px; height: 22px; }

  .wa-text-desktop {
    display: none;
  }

  @media (min-width: 768px) {
    .wa-text-desktop {
      display: inline;
    }
  }

  @media (max-width: 767px) {
    .wa-floating {
      width: 56px;
      height: 56px;
      padding: 0;
      border-radius: 50%;
    }
    .wa-floating .wa-text {
      display: none;
    }
  }

  @keyframes bounceIn {
    from {
      opacity: 0;
      transform: scale(0.3);
    }
    50% {
      transform: scale(1.05);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
</style>
