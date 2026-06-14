<script>
  import Icon from '$lib/components/Icon.svelte';
  import { MAINTENANCE_COMPARISON } from '$lib/data/mock.js';
</script>

<section id="maintenance" class="section section-alt">
  <div class="container">
    <div class="section-header reveal">
      <h2 class="text-h1">Maintenance & Renewal</h2>
      <p class="section-subtitle">Website yang nggak dirawat itu seperti toko yang tutup pintunya. Kami pastikan bisnis online Anda tetap jalan tanpa hambatan.</p>
    </div>

    <div class="maint-content">
      <div class="maint-info reveal">
        <div class="maint-pricing">
          <h3 class="text-h3">Harga Renewal Tahunan</h3>
          <div class="renewal-cards">
            <div class="renewal-card">
              <span class="renewal-pkg">Starter</span>
              <span class="renewal-price">Rp 600.000<small>/thn</small></span>
            </div>
            <div class="renewal-card">
              <span class="renewal-pkg">Premium</span>
              <span class="renewal-price">Rp 800.000<small>/thn</small></span>
            </div>
            <div class="renewal-card">
              <span class="renewal-pkg">Custom</span>
              <span class="renewal-price">Disesuaikan</span>
            </div>
          </div>
        </div>

        <div class="maint-includes">
          <h3 class="text-h3">Termasuk dalam Maintenance</h3>
          <ul class="include-list">
            <li><span class="li-icon check"><Icon name="check" size={18} /></span> Perpanjangan hosting & domain</li>
            <li><span class="li-icon check"><Icon name="check" size={18} /></span> Update security & SSL</li>
            <li><span class="li-icon check"><Icon name="check" size={18} /></span> Backup rutin bulanan</li>
            <li><span class="li-icon check"><Icon name="check" size={18} /></span> Minor content update (teks & gambar)</li>
            <li><span class="li-icon check"><Icon name="check" size={18} /></span> Monitoring uptime 24/7</li>
          </ul>

          <h3 class="text-h3 mt">Tidak Termasuk</h3>
          <ul class="include-list exclude">
            <li><span class="li-icon cross"><Icon name="x" size={18} /></span> Redesain total / revamp layout</li>
            <li><span class="li-icon cross"><Icon name="x" size={18} /></span> Penambahan fitur baru</li>
            <li><span class="li-icon cross"><Icon name="x" size={18} /></span> Migrasi platform</li>
          </ul>
        </div>
      </div>

      <div class="maint-comparison reveal">
        <h3 class="text-h2" style="text-align: center; margin-bottom: var(--space-4);">Kelola Sendiri vs Pakai Altertech</h3>
        <div class="table-wrapper">
          <table class="comparison-table">
            <thead>
              <tr>
                <th>Aspek</th>
                <th>Kelola Sendiri</th>
                <th class="col-alt">Altertech</th>
              </tr>
            </thead>
            <tbody>
              {#each MAINTENANCE_COMPARISON as row}
                <tr>
                  <td class="aspect-name">{row.aspect}</td>
                  <td class="col-self">{row.sendiri}</td>
                  <td class="col-alt">{row.altertech}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
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

  .maint-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-8);
  }

  .maint-info {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }

  .renewal-cards {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-3);
    margin-top: var(--space-3);
  }

  .renewal-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-3) var(--space-4);
    background: var(--color-surface-base);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
  }

  .renewal-pkg {
    font-weight: 600;
    font-size: 15px;
  }

  .renewal-price {
    font-weight: 700;
    color: var(--color-primary);
    font-size: 15px;
  }

  .renewal-price small {
    font-weight: 500;
    color: var(--color-text-secondary);
    font-size: 12px;
  }

  .include-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    margin-top: var(--space-3);
    font-size: 14px;
    line-height: 1.6;
  }

  .include-list li {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .li-icon {
    display: inline-flex;
    flex-shrink: 0;
  }

  .li-icon.check {
    color: var(--color-success);
  }

  .li-icon.cross {
    color: var(--color-text-secondary);
  }

  .include-list.exclude li {
    color: var(--color-text-secondary);
  }

  .mt {
    margin-top: var(--space-5);
  }

  .table-wrapper {
    overflow-x: auto;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
  }

  .comparison-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }

  .comparison-table th {
    padding: var(--space-3);
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
  }

  .comparison-table tr:last-child td {
    border-bottom: none;
  }

  .aspect-name {
    font-weight: 500;
    white-space: nowrap;
  }

  .col-alt {
    color: var(--color-primary);
    font-weight: 600;
  }

  .col-self {
    color: var(--color-text-secondary);
  }

  @media (min-width: 768px) {
    .maint-info {
      grid-template-columns: 1fr 1fr;
    }

    .renewal-cards {
      grid-template-columns: 1fr;
    }
  }
</style>
