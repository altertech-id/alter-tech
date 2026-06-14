<script>
  import Card from '$lib/components/Card.svelte';
  import Button from '$lib/components/Button.svelte';
  import { fetchFinancialReport } from '$lib/data/api.js';

  let report = $state(null);
  let loading = $state(true);
  let selectedMonth = $state('all');

  $effect(() => {
    fetchFinancialReport().then(data => {
      report = data;
      loading = false;
    });
  });

  // Monthly rows filtered by the period selector
  let visibleMonths = $derived(
    !report ? [] : (selectedMonth === 'all'
      ? report.monthlyData
      : report.monthlyData.filter(m => m.month === selectedMonth))
  );

  // Summary recalculated from the visible period (monthly recap basis)
  let periodTotals = $derived(
    visibleMonths.reduce(
      (acc, m) => ({
        revenue: acc.revenue + m.revenue,
        expense: acc.expense + m.expense,
        profit: acc.profit + m.profit,
      }),
      { revenue: 0, expense: 0, profit: 0 }
    )
  );

  function formatMoney(amount) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  }

  function getStatusColor(status) {
    if (status === 'Lunas') return 'success';
    if (status === 'DP') return 'warning';
    return 'neutral';
  }

  function exportCsv() {
    if (!report) return;
    const headers = ['Invoice', 'Project', 'Klien', 'Paket', 'Status Bayar', 'Pendapatan', 'Biaya', 'Laba', 'Margin (%)'];
    const rows = report.projects.map(p => [
      p.invoice_code, p.project_name, p.client_name, p.package_type, p.payment_status,
      p.revenue, p.expense, p.profit, p.margin,
    ]);
    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-keuangan-altertech-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
</script>

<div class="page-header">
  <h1 class="page-title">Laporan Keuangan</h1>
  <div class="header-actions">
    <Button variant="ghost" size="sm" onclick={() => window.print()}>Print</Button>
    <Button size="sm" onclick={exportCsv}>Export CSV</Button>
  </div>
</div>

{#if loading}
  <div class="loading-state">Memuat laporan keuangan...</div>
{:else if report}
  <!-- Period Filter -->
  <div class="filter-bar">
    <label for="period" class="filter-label">Periode</label>
    <select id="period" bind:value={selectedMonth} class="form-input filter-select">
      <option value="all">Semua Bulan</option>
      {#each report.monthlyData as m}
        <option value={m.month}>{m.month}</option>
      {/each}
    </select>
  </div>

  <!-- Summary Cards -->
  <div class="stats-grid">
    <Card>
      <div class="stat-box">
        <span class="stat-title">Total Pendapatan</span>
        <span class="stat-value text-success">{formatMoney(periodTotals.revenue)}</span>
        <span class="stat-desc">{selectedMonth === 'all' ? 'Seluruh periode' : `Bulan ${selectedMonth}`}</span>
      </div>
    </Card>
    <Card>
      <div class="stat-box">
        <span class="stat-title">Total Pengeluaran</span>
        <span class="stat-value text-error">{formatMoney(periodTotals.expense)}</span>
        <span class="stat-desc">Biaya operasional & produksi</span>
      </div>
    </Card>
    <Card>
      <div class="stat-box">
        <span class="stat-title">Laba Bersih</span>
        <span class="stat-value highlight">{formatMoney(periodTotals.profit)}</span>
        <span class="stat-desc">Pendapatan - Pengeluaran</span>
      </div>
    </Card>
    <Card>
      <div class="stat-box">
        <span class="stat-title">Margin Laba</span>
        <span class="stat-value">{periodTotals.revenue > 0 ? Math.round((periodTotals.profit / periodTotals.revenue) * 100) : 0}%</span>
        <span class="stat-desc">Rasio laba terhadap pendapatan</span>
      </div>
    </Card>
    <Card>
      <div class="stat-box">
        <span class="stat-title">Piutang Belum Tertagih</span>
        <span class="stat-value text-error">{formatMoney(report.outstanding)}</span>
        <span class="stat-desc">{report.unpaidCount} proyek belum lunas</span>
      </div>
    </Card>
  </div>

  <!-- Monthly Recap -->
  <Card>
    <h3 class="card-heading">Rekap Bulanan</h3>
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>Bulan</th>
            <th class="text-right">Pendapatan</th>
            <th class="text-right">Pengeluaran</th>
            <th class="text-right">Laba</th>
          </tr>
        </thead>
        <tbody>
          {#each visibleMonths as m}
            <tr>
              <td class="font-medium">{m.month}</td>
              <td class="text-right text-success">{formatMoney(m.revenue)}</td>
              <td class="text-right text-error">{formatMoney(m.expense)}</td>
              <td class="text-right font-medium">{formatMoney(m.profit)}</td>
            </tr>
          {/each}
        </tbody>
        <tfoot>
          <tr class="total-row">
            <td>Total</td>
            <td class="text-right text-success">{formatMoney(periodTotals.revenue)}</td>
            <td class="text-right text-error">{formatMoney(periodTotals.expense)}</td>
            <td class="text-right">{formatMoney(periodTotals.profit)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </Card>

  <!-- Per-Project Profitability -->
  <Card>
    <h3 class="card-heading">Profitabilitas per Proyek</h3>
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>Invoice</th>
            <th>Project</th>
            <th>Klien</th>
            <th class="text-right">Pendapatan</th>
            <th class="text-right">Biaya</th>
            <th class="text-right">Laba</th>
            <th class="text-right">Margin</th>
            <th>Status Bayar</th>
          </tr>
        </thead>
        <tbody>
          {#each report.projects as p}
            <tr>
              <td class="font-mono text-sm">{p.invoice_code}</td>
              <td class="font-medium">{p.project_name}</td>
              <td>{p.client_name}</td>
              <td class="text-right text-success">{formatMoney(p.revenue)}</td>
              <td class="text-right text-error">{formatMoney(p.expense)}</td>
              <td class="text-right font-medium" class:text-error={p.profit < 0}>{formatMoney(p.profit)}</td>
              <td class="text-right">{p.margin}%</td>
              <td><span class="badge status-{getStatusColor(p.payment_status)}">{p.payment_status}</span></td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </Card>
{/if}

<style>
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-4);
    gap: var(--space-3);
  }

  .page-title {
    font-size: var(--text-h2-size);
    font-weight: 700;
  }

  .header-actions {
    display: flex;
    gap: var(--space-2);
  }

  .loading-state {
    padding: var(--space-8);
    text-align: center;
    color: var(--color-text-secondary);
  }

  .filter-bar {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-bottom: var(--space-4);
  }

  .filter-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text-secondary);
  }

  .form-input {
    height: 38px;
    padding-inline: 12px;
    border: 1px solid var(--color-border-light);
    border-radius: var(--radius-md);
    font-size: 14px;
    font-family: inherit;
    background: var(--color-surface-base);
  }

  .filter-select {
    min-width: 180px;
  }

  .form-input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(37, 150, 190, 0.2);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: var(--space-4);
    margin-bottom: var(--space-5);
  }

  .stat-box {
    display: flex;
    flex-direction: column;
  }

  .stat-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: var(--space-2);
  }

  .stat-value {
    font-size: 1.6rem;
    font-weight: 700;
    color: var(--color-text-primary);
    line-height: 1.2;
  }

  .stat-value.highlight {
    color: var(--color-primary);
  }

  .stat-desc {
    font-size: 13px;
    color: var(--color-text-secondary);
    margin-top: var(--space-1);
  }

  .card-heading {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: var(--space-4);
  }

  /* Stack the two report tables */
  :global(.container-admin) > :global(.card) + :global(.card) {
    margin-top: var(--space-4);
  }

  .table-responsive {
    overflow-x: auto;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    text-align: left;
  }

  .data-table th {
    padding: var(--space-3);
    border-bottom: 2px solid var(--color-border);
    color: var(--color-text-secondary);
    font-weight: 600;
    white-space: nowrap;
  }

  .data-table td {
    padding: var(--space-3);
    border-bottom: 1px solid var(--color-border);
    vertical-align: middle;
  }

  .total-row td {
    border-top: 2px solid var(--color-border);
    border-bottom: none;
    font-weight: 700;
  }

  .font-mono { font-family: monospace; }
  .text-sm { font-size: 13px; }
  .font-medium { font-weight: 500; }
  .text-right { text-align: right; }
  .text-success { color: var(--color-success); }
  .text-error { color: var(--color-error); }

  .badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: var(--radius-pill);
    font-size: 12px;
    font-weight: 600;
    background: var(--color-surface-card);
    border: 1px solid var(--color-border);
    color: var(--color-text-secondary);
    white-space: nowrap;
  }

  .status-success { background: var(--color-success-bg); color: #166534; border-color: rgba(22, 163, 74, 0.2); }
  .status-warning { background: var(--color-warning-bg); color: #92400e; border-color: rgba(217, 119, 6, 0.2); }
  .status-neutral { background: var(--color-surface-card); color: var(--color-text-secondary); }

  @media (max-width: 600px) {
    .page-header {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
