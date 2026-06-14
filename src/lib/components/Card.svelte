<script>
  let { variant = 'default', hoverable = true, class: className = '', children, ...rest } = $props();
</script>

<div class="card card-{variant}" class:hoverable {...rest}>
  {@render children()}
</div>

<style>
  .card {
    background-color: var(--color-surface-base);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: var(--space-4);
    box-shadow: var(--shadow-sm);
    transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  }

  .card-surface {
    background-color: var(--color-surface-card);
  }

  .card-highlighted {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 1px var(--color-primary), var(--shadow-md);
  }

  .card.hoverable:hover {
    transform: scale(1.01);
    box-shadow: var(--shadow-md);
  }

  .card-highlighted.hoverable:hover {
    box-shadow: 0 0 0 1px var(--color-primary), var(--shadow-lg);
  }
</style>
