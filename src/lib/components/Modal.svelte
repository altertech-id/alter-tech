<script>
  let { open = $bindable(false), title = '', children, onclose } = $props();
  
  /** @type {HTMLDialogElement|undefined} */
  let dialogEl;

  $effect(() => {
    if (!dialogEl) return;
    if (open) {
      dialogEl.showModal();
    } else {
      dialogEl.close();
    }
  });

  function handleClose() {
    open = false;
    onclose?.();
  }

  function handleBackdropClick(e) {
    if (e.target === dialogEl) {
      handleClose();
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') {
      handleClose();
    }
  }
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog
  bind:this={dialogEl}
  class="modal"
  onclick={handleBackdropClick}
  onkeydown={handleKeydown}
  onclose={handleClose}
>
  <div class="modal-content">
    <div class="modal-header">
      {#if title}
        <h3 class="modal-title">{title}</h3>
      {/if}
      <button class="modal-close" onclick={handleClose} aria-label="Tutup">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
    <div class="modal-body">
      {@render children()}
    </div>
  </div>
</dialog>

<style>
  .modal {
    border: none;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    padding: 0;
    max-width: min(520px, calc(100vw - 32px));
    width: 100%;
    max-height: 85vh;
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    margin: 0;
    background: var(--color-surface-base);
    box-shadow: var(--shadow-lg);
    overflow: hidden;
  }

  .modal::backdrop {
    background: rgba(13, 33, 55, 0.5);
    animation: fadeIn 200ms ease forwards;
  }

  /* Entry animation */
  .modal[open] {
    display: flex;
    flex-direction: column;
    animation: slideUp 300ms ease forwards;
  }

  @keyframes slideUp {
    from {
      transform: translateX(-50%) translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @media (min-width: 768px) {
    .modal {
      border-radius: var(--radius-lg);
      bottom: auto;
      top: 50%;
      transform: translate(-50%, -50%);
      max-height: 80vh;
    }

    .modal[open] {
      animation: scaleIn 250ms ease forwards;
    }

    @keyframes scaleIn {
      from {
        transform: translate(-50%, -50%) scale(0.95);
        opacity: 0;
      }
      to {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
      }
    }
  }

  .modal-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-4);
    border-bottom: 1px solid var(--color-border);
    flex-shrink: 0;
  }

  .modal-title {
    font-size: var(--text-h3-size);
    font-weight: var(--text-h3-weight);
    color: var(--color-text-primary);
    margin: 0;
  }

  .modal-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: none;
    border-radius: var(--radius-md);
    background: transparent;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all var(--transition-fast);
    flex-shrink: 0;
  }

  .modal-close:hover {
    background-color: var(--color-surface-card);
    color: var(--color-text-primary);
  }

  .modal-body {
    padding: var(--space-4);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    flex: 1;
    min-height: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .modal[open],
    .modal::backdrop {
      animation: none;
    }
  }
</style>
