<script>
  import Icon from '$lib/components/Icon.svelte';
  import { ADVANTAGES, COMPARISON_TABLE } from '$lib/data/mock.js';
</script>

<section id="keunggulan" class="section section-alt">
  <div class="container">
    <div class="section-header reveal">
      <h2 class="text-h1">Kenapa Altertech?</h2>
      <p class="section-subtitle">Bukan janji manis. Ini yang benar-benar membedakan kami dari web agency lain.</p>
    </div>

    <div class="advantages-grid">
      {#each ADVANTAGES as adv, i}
        <div class="advantage-card reveal" style="transition-delay: {i * 120}ms">
          <div class="adv-icon"><Icon name={adv.icon} size={28} /></div>
          <div class="adv-metric">{adv.metric}</div>
          <h3 class="text-h3">{adv.title}</h3>
          <p class="adv-desc">{adv.description}</p>
        </div>
      {/each}
    </div>

    <div class="comparison reveal">
      <h3 class="text-h2 comparison-title">Altertech vs Web Agency Lain</h3>
      <div class="table-wrapper">
        <table class="comparison-table">
          <thead>
            <tr>
              <th>Fitur</th>
              <th class="col-alt">Altertech</th>
              <th>Agency Lain</th>
            </tr>
          </thead>
          <tbody>
            {#each COMPARISON_TABLE as row}
              <tr>
                <td class="feature-name">{row.feature}</td>
                <td class="col-alt">{row.altertech}</td>
                <td class="col-comp">{row.competitor}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
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

  .advantages-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-4);
    margin-bottom: var(--space-8);
  }

  .advantage-card {
    text-align: center;
    padding: var(--space-5) var(--space-4);
    background: var(--color-surface-base);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  }

  .advantage-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
  }

  .adv-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: var(--radius-lg);
    background: var(--color-primary-light);
    color: var(--color-primary);
    margin-bottom: var(--space-3);
  }

  .adv-metric {
    display: inline-block;
    padding: 4px 12px;
    background: var(--color-primary-light);
    color: var(--color-primary);
    font-size: 13px;
    font-weight: 700;
    border-radius: var(--radius-pill);
    margin-bottom: var(--space-3);
  }

  .adv-desc {
    color: var(--color-text-secondary);
    font-size: 14px;
    line-height: 1.6;
    margin-top: var(--space-2);
  }

  .comparison {
    margin-top: var(--space-6);
  }

  .comparison-title {
    text-align: center;
    margin-bottom: var(--space-4);
  }

  .table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
  }

  .comparison-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }

  .comparison-table th {
    padding: var(--space-3) var(--space-3);
    text-align: left;
    font-weight: 700;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    background: var(--color-surface-card);
    border-bottom: 1px solid var(--color-border);
    white-space: nowrap;
  }

  .comparison-table td {
    padding: var(--space-3);
    border-bottom: 1px solid var(--color-border);
    vertical-align: top;
  }

  .comparison-table tr:last-child td {
    border-bottom: none;
  }

  .col-alt {
    color: var(--color-primary);
    font-weight: 600;
  }

  .col-comp {
    color: var(--color-text-secondary);
  }

  .feature-name {
    font-weight: 500;
    white-space: nowrap;
  }

  @media (min-width: 768px) {
    .advantages-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>
