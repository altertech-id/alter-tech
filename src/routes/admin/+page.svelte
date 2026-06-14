<script>
  import Card from '$lib/components/Card.svelte';
  import { fetchDashboard } from '$lib/data/api.js';

  let summary = $state(null);
  let loading = $state(true);

  $effect(() => {
    fetchDashboard().then(data => {
      summary = data;
      loading = false;
    });
  });

  function formatMoney(amount) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  }

  function getStatusColor(status) {
    if (status === 'Lunas') return 'success';
    if (status === 'DP') return 'warning';
    return 'neutral';
  }
</script>

<div class="dashboard">
  {#if loading}
    <div class="loading-state">Memuat data dashboard...</div>
  {:else if summary}
    <!-- Top Stats Cards -->
    <div class="stats-grid">
      <Card>
        <div class="stat-box">
          <span class="stat-title">Project Aktif</span>
          <span class="stat-value">{summary.activeProjects}</span>
          <span class="stat-desc">Sedang berjalan</span>
        </div>
      </Card>
      <Card>
        <div class="stat-box">
          <span class="stat-title">Project Selesai</span>
          <span class="stat-value">{summary.completedProjects}</span>
          <span class="stat-desc">Total portofolio</span>
        </div>
      </Card>
      <Card>
        <div class="stat-box">
          <span class="stat-title">Laba Bersih</span>
          <span class="stat-value highlight">{formatMoney(summary.netProfit)}</span>
          <span class="stat-desc">Pendapatan - Pengeluaran</span>
        </div>
      </Card>
    </div>

    <div class="dashboard-grid">
      <!-- Finance Summary -->
      <Card class="chart-card">
        <h3 class="card-heading">Ringkasan Keuangan</h3>
        <div class="finance-totals">
          <div class="total-item">
            <span class="total-label">Total Pendapatan</span>
            <span class="total-val text-success">{formatMoney(summary.totalRevenue)}</span>
          </div>
          <div class="total-item">
            <span class="total-label">Total Pengeluaran</span>
            <span class="total-val text-error">{formatMoney(summary.totalExpense)}</span>
          </div>
        </div>

        <div class="simple-chart">
          {#each summary.monthlyData as month}
            <div class="chart-bar-wrapper">
              <div class="chart-bars">
                <!-- Revenue Bar -->
                <div class="bar bar-revenue" style="height: {Math.max((month.revenue / 7000000) * 100, 5)}%" title="Pendapatan: {formatMoney(month.revenue)}"></div>
                <!-- Expense Bar -->
                <div class="bar bar-expense" style="height: {Math.max((month.expense / 7000000) * 100, 5)}%" title="Pengeluaran: {formatMoney(month.expense)}"></div>
              </div>
              <span class="chart-label">{month.month}</span>
            </div>
          {/each}
        </div>
        <div class="chart-legend">
          <span class="legend-item"><span class="dot rev-dot"></span>Pendapatan</span>
          <span class="legend-item"><span class="dot exp-dot"></span>Pengeluaran</span>
        </div>
      </Card>

      <!-- Recent Projects -->
      <Card class="recent-projects-card">
        <div class="card-header">
          <h3 class="card-heading">Project Terbaru</h3>
          <a href="/admin/projects" class="view-all">Lihat Semua</a>
        </div>
        
        <div class="project-list">
          {#each summary.recentProjects as project}
            <div class="project-item">
              <div class="project-info">
                <span class="project-code">{project.invoice_code}</span>
                <span class="project-name">{project.project_name}</span>
                <span class="project-client">{project.client_name}</span>
              </div>
              <div class="project-meta">
                <span class="badge stage-badge">{project.current_stage}</span>
                <span class="badge status-{getStatusColor(project.payment_status)}">{project.payment_status}</span>
              </div>
            </div>
          {/each}
        </div>
      </Card>
    </div>
  {/if}
</div>

<style>
  .dashboard {
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
  }

  .loading-state {
    padding: var(--space-8);
    text-align: center;
    color: var(--color-text-secondary);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: var(--space-4);
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
    font-size: 2rem;
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

  .dashboard-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  @media (min-width: 1024px) {
    .dashboard-grid {
      grid-template-columns: 3fr 2fr;
    }
  }

  .card-heading {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: var(--space-4);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-4);
  }

  .card-header .card-heading {
    margin-bottom: 0;
  }

  .view-all {
    font-size: 13px;
    color: var(--color-primary);
    font-weight: 500;
  }

  /* Finance Styles */
  .finance-totals {
    display: flex;
    gap: var(--space-4);
    margin-bottom: var(--space-6);
    padding-bottom: var(--space-4);
    border-bottom: 1px solid var(--color-border);
  }

  .total-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .total-label {
    font-size: 13px;
    color: var(--color-text-secondary);
  }

  .total-val {
    font-size: 18px;
    font-weight: 700;
  }

  .text-success { color: var(--color-success); }
  .text-error { color: var(--color-error); }

  .simple-chart {
    height: 200px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--space-2);
    padding-top: var(--space-4);
    border-bottom: 1px solid var(--color-border);
    margin-bottom: var(--space-3);
  }

  .chart-bar-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    flex: 1;
    height: 100%;
    justify-content: flex-end;
  }

  .chart-bars {
    display: flex;
    gap: 4px;
    align-items: flex-end;
    height: 100%;
    width: 100%;
    justify-content: center;
  }

  .bar {
    width: 16px;
    border-radius: 4px 4px 0 0;
    transition: height 0.3s ease;
  }

  .bar-revenue { background: var(--color-primary); }
  .bar-expense { background: var(--color-text-secondary); opacity: 0.5; }

  .chart-label {
    font-size: 12px;
    color: var(--color-text-secondary);
  }

  .chart-legend {
    display: flex;
    justify-content: center;
    gap: var(--space-4);
    font-size: 12px;
    color: var(--color-text-secondary);
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }

  .rev-dot { background: var(--color-primary); }
  .exp-dot { background: var(--color-text-secondary); opacity: 0.5; }

  /* Project List Styles */
  .project-list {
    display: flex;
    flex-direction: column;
  }

  .project-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-block: var(--space-3);
    border-bottom: 1px solid var(--color-border);
  }

  .project-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .project-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .project-code {
    font-size: 11px;
    color: var(--color-text-secondary);
    font-family: monospace;
  }

  .project-name {
    font-size: 14px;
    font-weight: 600;
  }

  .project-client {
    font-size: 13px;
    color: var(--color-text-secondary);
  }

  .project-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
  }

  .badge {
    padding: 2px 8px;
    border-radius: var(--radius-pill);
    font-size: 11px;
    font-weight: 600;
  }

  .stage-badge {
    background: var(--color-surface-card);
    border: 1px solid var(--color-border);
    color: var(--color-text-secondary);
  }

  .status-success { background: var(--color-success-bg); color: #166534; }
  .status-warning { background: var(--color-warning-bg); color: #92400e; }
  .status-neutral { background: var(--color-surface-card); color: var(--color-text-secondary); }
</style>
