<script>
  import Card from '$lib/components/Card.svelte';
  import Button from '$lib/components/Button.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import { invalidateAll } from '$app/navigation';
  import { updateProject } from '$lib/data/api.js';

  let { data } = $props();
  let projects = $derived(data.projects ?? []);

  let searchQuery = $state('');
  let filterTab = $state('all'); // all, due_soon, overdue, active, no_maintenance

  // Quick Edit Modal state
  let editModalOpen = $state(false);
  let editTarget = $state(null);
  let editForm = $state({
    domain_url: '',
    domain_bought_at: '',
    domain_duration_years: 1,
    domain_price: 150000,
    has_maintenance: true,
    maintenance_fee: 600000,
    maintenance_due_date: ''
  });
  let saving = $state(false);

  function formatMoney(amount) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount || 0);
  }

  function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(d);
  }

  function getDomainExpiry(p) {
    if (!p.domain_bought_at) return null;
    const d = new Date(p.domain_bought_at);
    if (Number.isNaN(d.getTime())) return null;
    const years = Number(p.domain_duration_years) || 1;
    d.setFullYear(d.getFullYear() + years);
    return d.toISOString().split('T')[0];
  }

  // Automatic calculation of maintenance due date (defaults to 1 year from domain purchase or start date)
  function getMaintenanceDueDate(p) {
    if (p.maintenance_due_date) return p.maintenance_due_date;
    if (!p.has_maintenance) return null;
    const baseDate = p.domain_bought_at || p.started_at;
    if (!baseDate) return null;
    const d = new Date(baseDate);
    if (Number.isNaN(d.getTime())) return null;
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
  }

  function getDaysUntil(dateStr) {
    if (!dateStr) return null;
    const target = new Date(dateStr);
    if (Number.isNaN(target.getTime())) return null;
    const now = new Date();
    // Normalize to date boundaries (midnight)
    target.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diffMs = target - now;
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }

  function getMaintenanceStatus(p) {
    if (!p.has_maintenance) return 'none';
    const dueDate = getMaintenanceDueDate(p);
    if (!dueDate) return 'active';
    const days = getDaysUntil(dueDate);
    if (days === null) return 'active';
    if (days < 0) return 'overdue';
    if (days <= 30) return 'due_soon';
    return 'active';
  }

  function getDomainStatus(p) {
    const expiry = getDomainExpiry(p);
    if (!expiry) return 'none';
    const days = getDaysUntil(expiry);
    if (days === null) return 'none';
    if (days < 0) return 'overdue';
    if (days <= 30) return 'due_soon';
    return 'active';
  }

  function getTotalRenewalFee(p) {
    const maint = p.has_maintenance ? (Number(p.maintenance_fee) || 0) : 0;
    const dom = Number(p.domain_price) || 0;
    return maint + dom;
  }

  // Summary Metrics
  let stats = $derived.by(() => {
    let activeMaintCount = 0;
    let dueSoonCount = 0;
    let overdueCount = 0;
    let totalAnnualRev = 0;

    for (const p of projects) {
      if (p.has_maintenance) {
        activeMaintCount++;
        totalAnnualRev += getTotalRenewalFee(p);
        const status = getMaintenanceStatus(p);
        if (status === 'due_soon') dueSoonCount++;
        else if (status === 'overdue') overdueCount++;
      }
    }

    return {
      activeMaintCount,
      dueSoonCount,
      overdueCount,
      totalAnnualRev
    };
  });

  // Filtered List
  let filteredProjects = $derived.by(() => {
    return projects.filter((p) => {
      // Tab filter
      if (filterTab === 'due_soon' && getMaintenanceStatus(p) !== 'due_soon' && getDomainStatus(p) !== 'due_soon') return false;
      if (filterTab === 'overdue' && getMaintenanceStatus(p) !== 'overdue' && getDomainStatus(p) !== 'overdue') return false;
      if (filterTab === 'active' && (getMaintenanceStatus(p) !== 'active' || !p.has_maintenance)) return false;
      if (filterTab === 'no_maintenance' && p.has_maintenance) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchProject = p.project_name?.toLowerCase().includes(q);
        const matchClient = p.client_name?.toLowerCase().includes(q);
        const matchPic = p.client_pic?.toLowerCase().includes(q);
        const matchDomain = p.domain_url?.toLowerCase().includes(q);
        const matchContact = p.client_contact?.toLowerCase().includes(q);
        return matchProject || matchClient || matchPic || matchDomain || matchContact;
      }

      return true;
    });
  });

  // WhatsApp Reminder Link Generator
  function openWhatsAppReminder(p) {
    if (!p.client_contact) {
      alert('Nomor kontak WhatsApp klien belum diisi. Silakan edit project untuk menambahkan kontak.');
      return;
    }

    let phone = p.client_contact.replace(/[^0-9]/g, '');
    if (phone.startsWith('0')) {
      phone = '62' + phone.slice(1);
    }

    const greetingName = p.client_name || p.client_pic || 'Bapak/Ibu';
    const domainText = p.domain_url ? p.domain_url : p.project_name;
    const dueDate = formatDate(getMaintenanceDueDate(p) || getDomainExpiry(p));
    const totalFee = formatMoney(getTotalRenewalFee(p));

    let breakdown = '';
    if (p.has_maintenance) {
      breakdown += `• Maintenance & Cloud Server: ${formatMoney(p.maintenance_fee || 0)}\n`;
    }
    if (p.domain_price) {
      breakdown += `• Perpanjangan Domain: ${formatMoney(p.domain_price || 0)}\n`;
    }

    const message = `Halo ${greetingName},
Semoga sehat dan sukses selalu. 

Kami dari *Altertech* ingin menginformasikan jadwal perpanjangan layanan website untuk *${domainText}*.

Berikut rincian tagihan perpanjangan tahunan:
${breakdown}------------------------------
*Total Perpanjangan: ${totalFee}*
*Jatuh Tempo:* ${dueDate}

Layanan server dan domain akan diperpanjang secara otomatis setelah konfirmasi pembayaran. Mohon konfirmasi jika ada yang perlu disesuaikan. Terima kasih banyak! 🙏`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  // Quick Edit Modal
  function openQuickEdit(p) {
    editTarget = p;
    const autoDue = getMaintenanceDueDate(p) || '';
    editForm = {
      client_name: p.client_name || p.client_pic || '',
      client_pic: p.client_pic || p.client_name || '',
      client_contact: p.client_contact || '',
      domain_url: p.domain_url || '',
      domain_bought_at: p.domain_bought_at || '',
      domain_duration_years: p.domain_duration_years || 1,
      domain_price: p.domain_price ?? 150000,
      has_maintenance: Boolean(p.has_maintenance),
      maintenance_fee: p.maintenance_fee ?? 600000,
      maintenance_due_date: p.maintenance_due_date || autoDue
    };
    editModalOpen = true;
  }

  function handleQuickEditDomainDate() {
    if (editForm.domain_bought_at) {
      const d = new Date(editForm.domain_bought_at);
      if (!Number.isNaN(d.getTime())) {
        d.setFullYear(d.getFullYear() + 1);
        editForm.maintenance_due_date = d.toISOString().split('T')[0];
      }
    }
  }

  async function handleQuickEditSave(e) {
    e.preventDefault();
    if (!editTarget) return;
    saving = true;

    // Automatically calculate 1 year if maintenance is active and due date wasn't manually specified
    let finalDueDate = editForm.maintenance_due_date;
    if (editForm.has_maintenance && !finalDueDate) {
      const base = editForm.domain_bought_at ? new Date(editForm.domain_bought_at) : new Date();
      base.setFullYear(base.getFullYear() + 1);
      finalDueDate = base.toISOString().split('T')[0];
    }

    try {
      await updateProject(editTarget.id, {
        client_name: editForm.client_name || null,
        client_pic: editForm.client_name || null,
        client_contact: editForm.client_contact || null,
        domain_url: editForm.domain_url,
        domain_bought_at: editForm.domain_bought_at || null,
        domain_duration_years: Number(editForm.domain_duration_years) || 1,
        domain_price: Number(editForm.domain_price) || 0,
        has_maintenance: Boolean(editForm.has_maintenance),
        maintenance_fee: Number(editForm.maintenance_fee) || 0,
        maintenance_due_date: editForm.has_maintenance ? finalDueDate : null
      });
      await invalidateAll();
      editModalOpen = false;
    } catch (err) {
      alert('Gagal menyimpan perubahan: ' + err.message);
    } finally {
      saving = false;
    }
  }

  // Quick 1-Year Extension
  async function extendOneYear(p) {
    const confirmMsg = `Perpanjang jadwal renewal untuk "${p.client_name}" selama 1 tahun ke depan?`;
    if (!confirm(confirmMsg)) return;

    const baseDueDate = p.maintenance_due_date ? new Date(p.maintenance_due_date) : new Date();
    baseDueDate.setFullYear(baseDueDate.getFullYear() + 1);
    const newDueDate = baseDueDate.toISOString().split('T')[0];

    let newBoughtAt = p.domain_bought_at;
    if (p.domain_bought_at) {
      const d = new Date(p.domain_bought_at);
      d.setFullYear(d.getFullYear() + (p.domain_duration_years || 1));
      newBoughtAt = d.toISOString().split('T')[0];
    }

    try {
      await updateProject(p.id, {
        maintenance_due_date: newDueDate,
        domain_bought_at: newBoughtAt
      });
      await invalidateAll();
    } catch (err) {
      alert('Gagal memperbarui perpanjangan: ' + err.message);
    }
  }
</script>

<div class="maintenance-page">
  <div class="page-header">
    <div>
      <h1 class="page-title">Monitoring Klien &amp; Maintenance</h1>
      <p class="page-subtitle">Pantau masa aktif domain, jadwal tagihan maintenance tahunan, dan kirim reminder langsung ke WhatsApp klien.</p>
    </div>
  </div>

  <!-- Stats Grid -->
  <div class="stats-grid">
    <Card>
      <div class="stat-box">
        <span class="stat-title">Klien Maintenance Aktif</span>
        <span class="stat-value">{stats.activeMaintCount}</span>
        <span class="stat-desc">Server &amp; support terkelola</span>
      </div>
    </Card>
    <Card>
      <div class="stat-box">
        <span class="stat-title">Segera Perpanjang</span>
        <span class="stat-value warning">{stats.dueSoonCount}</span>
        <span class="stat-desc">Jatuh tempo &lt; 30 hari</span>
      </div>
    </Card>
    <Card>
      <div class="stat-box">
        <span class="stat-title">Lewat Jatuh Tempo</span>
        <span class="stat-value error">{stats.overdueCount}</span>
        <span class="stat-desc">Perlu ditindaklanjuti</span>
      </div>
    </Card>
    <Card>
      <div class="stat-box">
        <span class="stat-title">Estimasi Recurring Tahunan</span>
        <span class="stat-value highlight">{formatMoney(stats.totalAnnualRev)}</span>
        <span class="stat-desc">Maintenance + Renewal Domain</span>
      </div>
    </Card>
  </div>

  <!-- Controls: Tabs & Search -->
  <div class="controls-bar">
    <div class="filter-tabs">
      <button class="tab-btn" class:active={filterTab === 'all'} onclick={() => filterTab = 'all'}>
        Semua Klien ({projects.length})
      </button>
      <button class="tab-btn tab-warning" class:active={filterTab === 'due_soon'} onclick={() => filterTab = 'due_soon'}>
        Perlu Diingatkan ({stats.dueSoonCount})
      </button>
      <button class="tab-btn tab-error" class:active={filterTab === 'overdue'} onclick={() => filterTab = 'overdue'}>
        Overdue ({stats.overdueCount})
      </button>
      <button class="tab-btn" class:active={filterTab === 'active'} onclick={() => filterTab = 'active'}>
        Maintenance Aktif ({stats.activeMaintCount})
      </button>
      <button class="tab-btn" class:active={filterTab === 'no_maintenance'} onclick={() => filterTab = 'no_maintenance'}>
        Tanpa Maintenance
      </button>
    </div>

    <div class="search-box">
      <input
        type="text"
        placeholder="Cari klien, PIC, domain..."
        bind:value={searchQuery}
        class="search-input"
      />
    </div>
  </div>

  <!-- Table -->
  <Card>
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>Klien (PIC) &amp; Bisnis</th>
            <th>Kontak</th>
            <th>Domain &amp; Masa Aktif</th>
            <th>Status</th>
            <th>Jatuh Tempo</th>
            <th class="text-right">Total Tagihan</th>
            <th class="actions-col">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {#each filteredProjects as p}
            {@const domExpiry = getDomainExpiry(p)}
            {@const domDays = domExpiry ? getDaysUntil(domExpiry) : null}
            {@const maintDue = getMaintenanceDueDate(p)}
            {@const maintDays = maintDue ? getDaysUntil(maintDue) : null}
            {@const maintStatus = getMaintenanceStatus(p)}

            <tr>
              <!-- Klien (PIC) / Bisnis -->
              <td>
                <div class="client-cell">
                  <span class="font-bold text-dark">{p.client_name || p.client_pic || '-'}</span>
                  <span class="text-xs text-secondary">{p.project_name}</span>
                  <span class="badge-mini">{p.package_type || 'Starter'}</span>
                </div>
              </td>

              <!-- Kontak WhatsApp -->
              <td>
                <div class="contact-cell">
                  {#if p.client_contact}
                    <a
                      href="https://wa.me/{p.client_contact.replace(/[^0-9]/g, '').replace(/^0/, '62')}"
                      target="_blank"
                      rel="noreferrer"
                      class="contact-link"
                      title="Kirim pesan WhatsApp"
                    >
                      <Icon name="phone" size={13} />
                      {p.client_contact}
                    </a>
                  {:else}
                    <span class="text-xs text-muted">Belum ada no WA</span>
                  {/if}
                </div>
              </td>

              <!-- Domain -->
              <td>
                <div class="domain-cell">
                  {#if p.domain_url}
                    <a
                      href={p.domain_url.startsWith('http') ? p.domain_url : 'https://' + p.domain_url}
                      target="_blank"
                      rel="noreferrer"
                      class="domain-link"
                    >
                      {p.domain_url}
                      <span class="ext-icon">↗</span>
                    </a>
                  {:else}
                    <span class="text-xs text-muted">-</span>
                  {/if}

                  {#if domExpiry}
                    <div class="date-meta">
                      <span>Exp: {formatDate(domExpiry)}</span>
                      {#if domDays !== null}
                        {#if domDays < 0}
                          <span class="status-chip chip-error">Expired {Math.abs(domDays)} hr lalu</span>
                        {:else if domDays <= 30}
                          <span class="status-chip chip-warning">{domDays} hari lagi</span>
                        {:else}
                          <span class="status-chip chip-neutral">{domDays} hr</span>
                        {/if}
                      {/if}
                    </div>
                  {/if}
                </div>
              </td>

              <!-- Status Maintenance -->
              <td>
                {#if p.has_maintenance}
                  <div class="maint-status-wrap">
                    {#if maintStatus === 'overdue'}
                      <span class="badge status-error">Overdue</span>
                    {:else if maintStatus === 'due_soon'}
                      <span class="badge status-warning">Segera Perpanjang</span>
                    {:else}
                      <span class="badge status-success">Aktif</span>
                    {/if}
                    <span class="fee-sub">{formatMoney(p.maintenance_fee)} / thn</span>
                  </div>
                {:else}
                  <span class="badge status-neutral">Tanpa Maintenance</span>
                {/if}
              </td>

              <!-- Jatuh Tempo -->
              <td>
                {#if p.has_maintenance && maintDue}
                  <div class="due-cell">
                    <span class="font-medium">{formatDate(maintDue)}</span>
                    {#if maintDays !== null}
                      {#if maintDays < 0}
                        <span class="text-xs text-error font-semibold">Lewat {Math.abs(maintDays)} hari!</span>
                      {:else if maintDays <= 30}
                        <span class="text-xs text-warning font-semibold">Sisa {maintDays} hari</span>
                      {:else}
                        <span class="text-xs text-secondary">{maintDays} hari lagi</span>
                      {/if}
                    {/if}
                  </div>
                {:else}
                  <span class="text-xs text-muted">-</span>
                {/if}
              </td>

              <!-- Total Tagihan -->
              <td class="text-right">
                <span class="font-bold text-primary">{formatMoney(getTotalRenewalFee(p))}</span>
                <span class="text-xs text-secondary d-block">
                  Maint: {p.has_maintenance ? formatMoney(p.maintenance_fee) : 'Rp 0'} + Dom: {formatMoney(p.domain_price || 0)}
                </span>
              </td>

              <!-- Aksi -->
              <td class="actions-col">
                <div class="action-buttons">
                  <button
                    class="btn-wa"
                    onclick={() => openWhatsAppReminder(p)}
                    title="Kirim pesan WhatsApp"
                  >
                    <Icon name="phone" size={13} />
                    WA
                  </button>

                  <button
                    class="btn-action-ghost"
                    onclick={() => openQuickEdit(p)}
                    title="Edit Data Renewal / Maintenance"
                  >
                    Edit
                  </button>

                  {#if p.has_maintenance}
                    <button
                      class="btn-action-extend"
                      onclick={() => extendOneYear(p)}
                      title="Perpanjang 1 Tahun (Tandai Lunas)"
                    >
                      +1 Thn
                    </button>
                  {/if}
                </div>
              </td>
            </tr>
          {/each}

          {#if filteredProjects.length === 0}
            <tr>
              <td colspan="7" class="text-center py-5 text-secondary">
                Tidak ada data klien yang cocok dengan filter.
              </td>
            </tr>
          {/if}
        </tbody>
      </table>
    </div>
  </Card>
</div>

<!-- Modal Quick Edit Maintenance -->
<Modal bind:open={editModalOpen} title="Edit Jadwal Maintenance &amp; Domain">
  {#if editTarget}
    <form onsubmit={handleQuickEditSave} class="modal-form">
      <div class="target-summary">
        <strong>{editTarget.client_name}</strong> — {editTarget.project_name}
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="edit_client_name">Nama Klien (PIC)</label>
          <input type="text" id="edit_client_name" bind:value={editForm.client_name} class="form-input" placeholder="Nama Klien / PIC" />
        </div>
        <div class="form-group">
          <label for="edit_client_contact">Kontak WhatsApp</label>
          <input type="text" id="edit_client_contact" bind:value={editForm.client_contact} class="form-input" placeholder="08xxxxxxxxxx" />
        </div>
      </div>

      <div class="form-group">
        <label for="edit_domain_url">Link Domain / Website</label>
        <input type="text" id="edit_domain_url" bind:value={editForm.domain_url} class="form-input" placeholder="contoh: domainklien.com" />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="edit_domain_bought_at">Tanggal Beli Domain</label>
          <input type="date" id="edit_domain_bought_at" bind:value={editForm.domain_bought_at} onchange={handleQuickEditDomainDate} class="form-input" />
        </div>
        <div class="form-group">
          <label for="edit_domain_duration">Durasi Beli</label>
          <select id="edit_domain_duration" bind:value={editForm.domain_duration_years} class="form-input">
            <option value={1}>1 Tahun</option>
            <option value={2}>2 Tahun</option>
            <option value={3}>3 Tahun</option>
            <option value={5}>5 Tahun</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label for="edit_domain_price">Biaya Perpanjangan Domain (Rp)</label>
        <input type="number" id="edit_domain_price" bind:value={editForm.domain_price} step="10000" class="form-input" />
      </div>

      <div class="maint-toggle-box">
        <label class="checkbox-label">
          <input type="checkbox" bind:checked={editForm.has_maintenance} />
          <span class="checkbox-text font-bold">Klien Mengambil Paket Maintenance Altertech</span>
        </label>
      </div>

      {#if editForm.has_maintenance}
        <div class="form-row">
          <div class="form-group">
            <label for="edit_maintenance_fee">Biaya Maintenance Tahunan (Rp)</label>
            <input type="number" id="edit_maintenance_fee" bind:value={editForm.maintenance_fee} step="50000" class="form-input" />
            {#if editForm.maintenance_fee}
              <span class="hint-fee">{formatMoney(editForm.maintenance_fee)} / thn</span>
            {/if}
          </div>
          <div class="form-group">
            <label for="edit_maintenance_due">Jatuh Tempo Maintenance</label>
            <input type="date" id="edit_maintenance_due" bind:value={editForm.maintenance_due_date} class="form-input" />
          </div>
        </div>

        <div class="calc-highlight">
          Total Tagihan Tahunan: <strong>{formatMoney((Number(editForm.maintenance_fee) || 0) + (Number(editForm.domain_price) || 0))}</strong> (Maintenance + Domain)
        </div>
      {/if}

      <div class="modal-actions">
        <Button type="button" variant="ghost" onclick={() => editModalOpen = false}>Batal</Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </div>
    </form>
  {/if}
</Modal>

<style>
  .maintenance-page {
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .page-title {
    font-size: var(--text-h2-size);
    font-weight: 700;
  }

  .page-subtitle {
    color: var(--color-text-secondary);
    font-size: 14px;
    margin-top: 4px;
  }

  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
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

  .stat-value.highlight { color: var(--color-primary); }
  .stat-value.warning { color: var(--color-warning); }
  .stat-value.error { color: var(--color-error); }

  .stat-desc {
    font-size: 12px;
    color: var(--color-text-secondary);
    margin-top: 4px;
  }

  /* Controls */
  .controls-bar {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-3);
  }

  .filter-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    background: var(--color-surface-card);
    padding: 4px;
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
  }

  .tab-btn {
    padding: 6px 14px;
    border-radius: 6px;
    border: none;
    background: transparent;
    font-size: 13px;
    font-weight: 500;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 150ms ease;
  }

  .tab-btn:hover {
    color: var(--color-text-primary);
  }

  .tab-btn.active {
    background: #FFFFFF;
    color: var(--color-primary);
    font-weight: 600;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  }

  .tab-btn.tab-warning.active { color: #b45309; }
  .tab-btn.tab-error.active { color: var(--color-error); }

  .search-input {
    height: 38px;
    padding: 0 14px;
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
    font-size: 13px;
    min-width: 260px;
    outline: none;
  }

  .search-input:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(37, 150, 190, 0.15);
  }

  /* Table styling */
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

  .text-right { text-align: right; }
  .text-center { text-align: center; }
  .py-5 { padding-block: 2.5rem; }
  .font-bold { font-weight: 700; }
  .font-medium { font-weight: 500; }
  .text-xs { font-size: 12px; }
  .text-secondary { color: var(--color-text-secondary); }
  .text-muted { color: #94a3b8; }
  .text-error { color: var(--color-error); }
  .text-warning { color: var(--color-warning); }
  .text-primary { color: var(--color-primary); }
  .text-dark { color: var(--color-text-primary); }
  .d-block { display: block; }

  .client-cell {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .badge-mini {
    display: inline-block;
    align-self: flex-start;
    padding: 2px 6px;
    border-radius: 4px;
    background: #f1f5f9;
    color: #475569;
    font-size: 10px;
    font-weight: 600;
    margin-top: 2px;
  }

  .contact-cell {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .contact-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #16a34a;
    font-weight: 500;
    text-decoration: none;
  }

  .contact-link:hover {
    text-decoration: underline;
  }

  .domain-cell {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .domain-link {
    font-weight: 600;
    color: var(--color-primary);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 3px;
  }

  .domain-link:hover {
    text-decoration: underline;
  }

  .ext-icon {
    font-size: 11px;
    opacity: 0.7;
  }

  .date-meta {
    font-size: 11px;
    color: var(--color-text-secondary);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .status-chip {
    display: inline-block;
    padding: 1px 6px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 600;
  }

  .chip-neutral { background: #f1f5f9; color: #475569; }
  .chip-warning { background: #fef3c7; color: #92400e; }
  .chip-error { background: #fee2e2; color: #991b1b; }

  .maint-status-wrap {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .fee-sub {
    font-size: 11px;
    color: var(--color-text-secondary);
  }

  .due-cell {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: var(--radius-pill);
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
    align-self: flex-start;
  }

  .status-success { background: var(--color-success-bg); color: #166534; }
  .status-warning { background: var(--color-warning-bg); color: #92400e; }
  .status-error { background: var(--color-error-bg); color: #991b1b; }
  .status-neutral { background: #f1f5f9; color: #64748b; }

  /* Actions */
  .actions-col {
    text-align: right;
    white-space: nowrap;
  }

  .action-buttons {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 6px;
  }

  .btn-wa {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 6px 12px;
    border-radius: var(--radius-md);
    background: #25D366;
    color: #FFFFFF;
    border: none;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 150ms ease;
  }

  .btn-wa:hover {
    background: #1eb857;
    box-shadow: 0 2px 6px rgba(37, 211, 102, 0.35);
  }

  .btn-action-ghost {
    padding: 6px 10px;
    border: 1px solid var(--color-border);
    background: #FFFFFF;
    border-radius: var(--radius-md);
    font-size: 12px;
    font-weight: 500;
    color: var(--color-text-primary);
    cursor: pointer;
  }

  .btn-action-ghost:hover {
    background: var(--color-surface-card);
  }

  .btn-action-extend {
    padding: 6px 10px;
    border: 1px solid #bfdbfe;
    background: #eff6ff;
    color: #1d4ed8;
    border-radius: var(--radius-md);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
  }

  .btn-action-extend:hover {
    background: #dbeafe;
  }

  /* Modal Form */
  .modal-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .target-summary {
    padding: 10px 14px;
    background: var(--color-surface-card);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
    font-size: 14px;
  }

  .form-row {
    display: flex;
    gap: var(--space-3);
  }

  .form-row > .form-group {
    flex: 1;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .form-group label {
    font-size: 13px;
    font-weight: 600;
  }

  .form-input {
    height: 38px;
    padding: 0 var(--space-3);
    border: 1px solid var(--color-border-light);
    border-radius: var(--radius-md);
    font-size: 14px;
    font-family: inherit;
    outline: none;
  }

  .form-input:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(37, 150, 190, 0.15);
  }

  .checkbox-label {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    cursor: pointer;
  }

  .checkbox-label input {
    width: 16px;
    height: 16px;
  }

  .maint-toggle-box {
    padding: 12px;
    background: #f8fafc;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
  }

  .hint-fee {
    font-size: 12px;
    font-weight: 600;
    color: var(--color-primary);
    margin-top: 2px;
  }

  .calc-highlight {
    padding: 10px 14px;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: var(--radius-md);
    font-size: 13px;
    color: #166534;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-3);
    margin-top: var(--space-2);
  }

  @media (max-width: 768px) {
    .controls-bar {
      flex-direction: column;
      align-items: stretch;
    }
    .search-input {
      width: 100%;
    }
    .form-row {
      flex-direction: column;
    }
  }
</style>
