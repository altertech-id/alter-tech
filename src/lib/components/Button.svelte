<script>
  /** @type {{ variant?: 'primary' | 'secondary' | 'ghost' | 'destructive', size?: 'sm' | 'md' | 'lg', disabled?: boolean, href?: string, type?: string, onclick?: Function, class?: string }} */
  let { variant = 'primary', size = 'md', disabled = false, href, type = 'button', onclick, class: className = '', children, ...rest } = $props();
</script>

{#if href && !disabled}
  <a {href} class="btn btn-{variant} btn-{size} {className}" {...rest}>
    {@render children()}
  </a>
{:else}
  <button
    {type}
    {disabled}
    class="btn btn-{variant} btn-{size} {className}"
    onclick={onclick}
    {...rest}
  >
    {@render children()}
  </button>
{/if}

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    border: none;
    border-radius: var(--radius-md);
    font-family: var(--font-family);
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    transition: all var(--transition-fast);
    white-space: nowrap;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .btn:focus-visible {
    box-shadow: var(--shadow-focus);
  }

  /* Variants */
  .btn-primary {
    background-color: var(--color-primary);
    color: var(--color-text-inverse);
  }
  .btn-primary:hover:not(:disabled) {
    background-color: var(--color-primary-hover);
    box-shadow: var(--shadow-md);
  }

  .btn-secondary {
    background-color: var(--color-accent);
    color: var(--color-text-inverse);
  }
  .btn-secondary:hover:not(:disabled) {
    background-color: #162c45;
    box-shadow: var(--shadow-md);
  }

  .btn-ghost {
    background-color: transparent;
    color: var(--color-primary);
    border: 1.5px solid var(--color-primary);
  }
  .btn-ghost:hover:not(:disabled) {
    background-color: var(--color-primary-light);
  }

  .btn-destructive {
    background-color: var(--color-error);
    color: var(--color-text-inverse);
  }
  .btn-destructive:hover:not(:disabled) {
    background-color: #b91c1c;
    box-shadow: var(--shadow-md);
  }

  /* Sizes */
  .btn-sm {
    height: 32px;
    padding-inline: 14px;
    font-size: 13px;
    min-width: 72px;
  }

  .btn-md {
    height: 40px;
    padding-inline: 20px;
    font-size: 14px;
    min-width: 100px;
  }

  .btn-lg {
    height: 48px;
    padding-inline: 28px;
    font-size: 16px;
    min-width: 140px;
  }

  /* Disabled */
  .btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
</style>
