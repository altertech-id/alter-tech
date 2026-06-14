<script>
  import Modal from '$lib/components/Modal.svelte';
  import ProgressTracker from '$lib/components/ProgressTracker.svelte';
  import Button from '$lib/components/Button.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import { trackProject } from '$lib/data/api.js';

  let invoiceCode = $state('');
  let loading = $state(false);
  let error = $state('');
  let result = $state(null);
  let modalOpen = $state(false);

  async function handleTrack() {
    if (!invoiceCode.trim()) {
      error = 'Masukkan kode invoice Anda.';
      return;
    }

    error = '';
    loading = true;

    try {
      const data = await trackProject(invoiceCode);
      if (data) {
        result = data;
        modalOpen = true;
      } else {
        error = 'Kode invoice tidak ditemukan. Pastikan kode yang Anda masukkan sudah benar.';
      }
    } catch (e) {
      error = 'Terjadi kesalahan. Silakan coba lagi.';
    } finally {
      loading = false;
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Enter') handleTrack();
  }
</script>

<section id="tracking" class="section tracking-section">
  <div class="container">
    <div class="tracking-wrapper reveal">
      <div class="tracking-card">
        <div class="tracking-info">
          <div class="tracking-icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="12" fill="var(--color-primary-light)"/>
              <path d="M13 20l4 4 10-10" stroke="var(--color-primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h2 class="text-h2">Cek Progress Project</h2>
          <p class="tracking-desc">
            Sudah jadi klien? Masukkan kode invoice yang kami berikan untuk pantau progress project Anda secara real-time.
          </p>
        </div>

        <div class="tracking-action">
          <div class="tracking-input-group">
            <div class="input-wrapper" class:has-error={!!error}>
              <input
                type="text"
                placeholder="Contoh: ALT-2025-001"
                bind:value={invoiceCode}
                onkeydown={handleKeydown}
                class="tracking-input"
                id="invoice-input"
                aria-label="Kode Invoice"
                disabled={loading}
              />
              <Button onclick={handleTrack} disabled={loading} size="md">
                {#if loading}
                  <span class="spinner"></span>
                {:else}
                  Cek Status
                {/if}
              </Button>
            </div>
            {#if error}
              <p class="error-message" role="alert">{error}</p>
            {/if}
          </div>

          <p class="tracking-hint">
            <span class="hint-icon"><Icon name="bulb" size={16} /></span>
            Coba: <button class="hint-code" onclick={() => { invoiceCode = 'ALT-2025-002'; }}>ALT-2025-002</button>
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<Modal bind:open={modalOpen} title="Status Project">
  {#if result}
    <div class="modal-project-info">
      <h4 class="project-name">{result.project_name}</h4>
      <div class="project-stage-badge">
        <span class="stage-label">Tahap saat ini:</span>
        <span class="stage-value">{result.current_stage}</span>
      </div>
    </div>
    <ProgressTracker currentStage={result.current_stage} progressPercent={result.progress_percent} />
  {/if}
</Modal>

<style>
  .tracking-section {
    background: linear-gradient(135deg, var(--color-primary), #1b7da3);
  }

  .tracking-wrapper {
    max-width: var(--container-max);
    margin-inline: auto;
  }

  .tracking-card {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-5);
    align-items: center;
    padding: var(--space-6) var(--space-4);
    background: var(--color-surface-base);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
  }

  .tracking-icon {
    display: flex;
    margin-bottom: var(--space-3);
  }

  .tracking-desc {
    color: var(--color-text-secondary);
    font-size: 15px;
    line-height: 1.6;
    margin-top: var(--space-3);
  }

  .tracking-input-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .input-wrapper {
    display: flex;
    gap: var(--space-2);
    width: 100%;
  }

  .tracking-input {
    flex: 1;
    height: 44px;
    padding-inline: var(--space-3);
    border: 1.5px solid var(--color-border-light);
    border-radius: var(--radius-md);
    font-size: 15px;
    background: var(--color-surface-base);
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
    outline: none;
  }

  .tracking-input:focus {
    border-color: var(--color-primary);
    box-shadow: var(--shadow-focus);
  }

  .has-error .tracking-input {
    border-color: var(--color-error);
    background: var(--color-error-bg);
  }

  .tracking-input:disabled {
    background: var(--color-surface-card);
    opacity: 0.7;
  }

  .error-message {
    color: var(--color-error);
    font-size: 13px;
    font-weight: 500;
    text-align: left;
  }

  .tracking-hint {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 6px;
    margin-top: var(--space-3);
    font-size: 13px;
    color: var(--color-text-secondary);
  }

  .hint-icon {
    display: inline-flex;
    color: var(--color-warning);
  }

  .hint-code {
    background: none;
    border: none;
    color: var(--color-primary);
    font-weight: 600;
    cursor: pointer;
    font-size: 13px;
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .hint-code:hover {
    color: var(--color-primary-hover);
  }

  .spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Modal content */
  .modal-project-info {
    margin-bottom: var(--space-5);
  }

  .project-name {
    font-size: var(--text-h3-size);
    font-weight: 700;
    margin-bottom: var(--space-3);
  }

  .project-stage-badge {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: 14px;
  }

  .stage-label {
    color: var(--color-text-secondary);
  }

  .stage-value {
    display: inline-block;
    padding: 4px 12px;
    background: var(--color-primary-light);
    color: var(--color-primary);
    font-weight: 600;
    border-radius: var(--radius-pill);
    font-size: 13px;
  }

  @media (max-width: 480px) {
    .input-wrapper {
      flex-direction: column;
    }

    .input-wrapper :global(.btn) {
      width: 100%;
    }
  }

  @media (min-width: 768px) {
    .tracking-card {
      grid-template-columns: 1fr 1fr;
      gap: var(--space-8);
      padding: var(--space-6);
    }
  }
</style>
