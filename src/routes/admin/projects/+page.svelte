<script>
  import Card from '$lib/components/Card.svelte';
  import Button from '$lib/components/Button.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import { invalidateAll } from '$app/navigation';
  import { createProject, updateProject, deleteProject, publishProjectToPortfolio, uploadImage } from '$lib/data/api.js';
  import { PROJECT_STAGES } from '$lib/data/mock.js';

  let { data } = $props();
  let projects = $derived(data.projects ?? []);
  let packages = $derived(data.packages ?? []);
  let modalOpen = $state(false);
  let isEditing = $state(false);

  // Publish-to-portfolio state
  let publishModalOpen = $state(false);
  let publishTarget = $state(null);
  let publishPhoto = $state('');
  let publishing = $state(false);
  let publishUploading = $state(false);
  let publishError = $state('');

  function canPublish(p) {
    return p.current_stage === 'Closing' && p.payment_status === 'Lunas' && !p.published_to_portfolio;
  }

  function openPublish(project) {
    publishTarget = project;
    publishPhoto = '';
    publishError = '';
    publishModalOpen = true;
  }

  async function handlePublishFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    publishUploading = true;
    publishError = '';
    try {
      publishPhoto = await uploadImage(file);
    } catch {
      publishError = 'Gagal mengunggah foto. Coba lagi.';
    } finally {
      publishUploading = false;
    }
  }

  async function doPublish(isConfidential) {
    if (!publishPhoto || !publishTarget) return;
    publishing = true;
    publishError = '';
    const result = await publishProjectToPortfolio(publishTarget.id, { isConfidential, screenshotUrl: publishPhoto });
    publishing = false;
    if (!result.success) {
      publishError = result.error || 'Gagal mempublikasikan.';
      return;
    }
    await invalidateAll();
    publishModalOpen = false;
    publishPhoto = '';
    publishTarget = null;
  }

  const todayStr = () => new Date().toISOString().split('T')[0];
  const nextYearStr = () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
  };

  let formData = $state({
    id: '',
    project_name: '',
    client_name: '',
    client_pic: '',
    client_contact: '',
    current_stage: 'Kualifikasi',
    progress_percent: 0,
    notes: '',
    package_type: 'Starter',
    deal_amount: 800000,
    payment_status: 'Pending',
    domain_url: '',
    domain_bought_at: todayStr(),
    domain_duration_years: 1,
    domain_price: 150000,
    has_maintenance: false,
    maintenance_fee: 600000,
    maintenance_due_date: nextYearStr(),
    costs: []
  });

  function openCreate() {
    isEditing = false;
    const defaultPkg = packages[0]?.name || 'Starter';
    const defaultPrice = packages[0]?.price || 800000;
    const defaultRenewal = packages[0]?.renewal_price || 600000;
    formData = {
      id: '',
      project_name: '',
      client_name: '',
      client_pic: '',
      client_contact: '',
      current_stage: 'Kualifikasi',
      progress_percent: 0,
      notes: '',
      package_type: defaultPkg,
      deal_amount: defaultPrice,
      payment_status: 'Pending',
      domain_url: '',
      domain_bought_at: todayStr(),
      domain_duration_years: 1,
      domain_price: 150000,
      has_maintenance: false,
      maintenance_fee: defaultRenewal,
      maintenance_due_date: nextYearStr(),
      costs: []
    };
    modalOpen = true;
  }

  function openEdit(project) {
    isEditing = true;
    formData = JSON.parse(JSON.stringify(project));
    formData.client_pic = formData.client_pic || '';
    formData.client_contact = formData.client_contact || '';
    if (formData.deal_amount === undefined || formData.deal_amount === null || formData.deal_amount === 0) {
      const found = packages.find(p => p.name === formData.package_type);
      formData.deal_amount = found?.price ?? 0;
    }
    if (!formData.domain_duration_years) {
      formData.domain_duration_years = 1;
    }
    if (formData.domain_price === undefined || formData.domain_price === null) {
      formData.domain_price = 150000;
    }
    if (!formData.domain_bought_at) {
      formData.domain_bought_at = formData.started_at || todayStr();
    }
    if (formData.has_maintenance === undefined || formData.has_maintenance === null) {
      formData.has_maintenance = false;
    }
    if (!formData.maintenance_fee) {
      const found = packages.find(p => p.name === formData.package_type);
      formData.maintenance_fee = found?.renewal_price ?? 600000;
    }
    if (!formData.maintenance_due_date) {
      formData.maintenance_due_date = nextYearStr();
    }
    modalOpen = true;
  }

  function handlePackageChange(newPkg) {
    formData.package_type = newPkg;
    const found = packages.find(p => p.name === newPkg);
    if (found) {
      formData.deal_amount = found.price;
      if (found.renewal_price) {
        formData.maintenance_fee = found.renewal_price;
      }
    }
  }

  function getProjectDeal(p) {
    if (p.deal_amount && Number(p.deal_amount) > 0) return Number(p.deal_amount);
    return packages.find(pkg => pkg.name === p.package_type)?.price || 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...formData,
      client_pic: formData.client_pic || formData.client_name,
      deal_amount: Number(formData.deal_amount) || 0,
      domain_duration_years: Number(formData.domain_duration_years) || 1,
      domain_price: Number(formData.domain_price) || 0,
      has_maintenance: Boolean(formData.has_maintenance),
      maintenance_fee: Number(formData.maintenance_fee) || 0,
      domain_bought_at: formData.domain_bought_at || null,
      maintenance_due_date: formData.has_maintenance ? (formData.maintenance_due_date || null) : null
    };
    try {
      if (isEditing) {
        await updateProject(formData.id, payload);
      } else {
        await createProject(payload);
      }
      await invalidateAll();
      modalOpen = false;
    } catch (err) {
      alert('Gagal menyimpan project: ' + err.message);
    }
  }

  async function handleDelete(id) {
    if (confirm('Yakin ingin menghapus project ini?')) {
      await deleteProject(id);
      await invalidateAll();
    }
  }

  function addCostItem() {
    formData.costs = [...formData.costs, { id: `c-${Date.now()}`, label: '', amount: 0, cost_type: 'other' }];
  }

  function removeCostItem(index) {
    formData.costs = formData.costs.filter((_, i) => i !== index);
  }

  function formatMoney(amount) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  }
</script>

<div class="page-header">
  <h1 class="page-title">Kelola Project</h1>
  <Button onclick={openCreate} size="sm">
    + Project Baru
  </Button>
</div>

<Card>
  <div class="table-responsive">
    <table class="data-table">
        <thead>
          <tr>
            <th>Invoice</th>
            <th>Project</th>
            <th>Klien</th>
            <th>Paket</th>
            <th class="text-right">Nilai Deal</th>
            <th>Tahap</th>
            <th>Progress</th>
            <th>Status Bayar</th>
            <th class="actions-col">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {#each projects as p}
            <tr>
              <td class="font-mono text-sm">{p.invoice_code}</td>
              <td class="font-medium">{p.project_name}</td>
              <td>
                <div class="client-cell">
                  <span class="client-name font-medium">{p.client_name}</span>
                  {#if p.client_contact}
                    <span class="client-pic-sub">
                      WA: {p.client_contact}
                    </span>
                  {/if}
                </div>
              </td>
              <td><span class="badge badge-package">{p.package_type}</span></td>
              <td class="text-right font-semibold text-primary">{formatMoney(getProjectDeal(p))}</td>
              <td><span class="badge">{p.current_stage}</span></td>
              <td>
                <div class="progress-bar-small">
                  <div class="progress-fill" style="width: {p.progress_percent}%"></div>
                </div>
                <span class="text-xs mt-1">{p.progress_percent}%</span>
              </td>
              <td><span class="badge status-{p.payment_status === 'Lunas' ? 'success' : (p.payment_status === 'DP' ? 'warning' : 'neutral')}">{p.payment_status}</span></td>
              <td class="actions-col">
                {#if canPublish(p)}
                  <button class="action-btn text-success" onclick={() => openPublish(p)}>Publikasikan</button>
                {:else if p.published_to_portfolio}
                  <span class="badge status-success">Di Portfolio</span>
                {/if}
                <button class="action-btn text-primary" onclick={() => openEdit(p)}>Edit</button>
                <button class="action-btn text-error" onclick={() => handleDelete(p.id)}>Hapus</button>
              </td>
            </tr>
          {/each}
          {#if projects.length === 0}
            <tr>
              <td colspan="9" class="text-center py-4">Belum ada data project.</td>
            </tr>
          {/if}
        </tbody>
      </table>
    </div>
</Card>

<Modal bind:open={modalOpen} title={isEditing ? 'Edit Project' : 'Project Baru'}>
  <form onsubmit={handleSubmit} class="form-grid">
    <div class="form-group">
      <label for="project_name">Nama Project / Bisnis</label>
      <input type="text" id="project_name" bind:value={formData.project_name} required class="form-input" placeholder="Contoh: Website Toko Bintang Jaya / CV Makmur" />
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="client_name">Nama Klien (PIC)</label>
        <input type="text" id="client_name" bind:value={formData.client_name} required class="form-input" placeholder="Contoh: Budi Santoso / Dr. Rini Wulandari" />
      </div>
      <div class="form-group">
        <label for="client_contact">Kontak WhatsApp</label>
        <input type="text" id="client_contact" bind:value={formData.client_contact} class="form-input" placeholder="Contoh: 08123456789" />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="package_type">Paket</label>
        <select
          id="package_type"
          value={formData.package_type}
          onchange={(e) => handlePackageChange(e.target.value)}
          class="form-input"
        >
          {#each packages as pkg}
            <option value={pkg.name}>{pkg.name}</option>
          {/each}
        </select>
      </div>
      <div class="form-group">
        <label for="deal_amount">Nilai Deal / Biaya Project (Rp)</label>
        <input
          type="number"
          id="deal_amount"
          bind:value={formData.deal_amount}
          min="0"
          step="50000"
          required
          class="form-input"
          placeholder="Nilai kesepakatan deal"
        />
        {#if formData.deal_amount}
          <span class="help-text-amount">{formatMoney(formData.deal_amount)}</span>
        {/if}
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="current_stage">Tahap Aktif</label>
        <select id="current_stage" bind:value={formData.current_stage} class="form-input">
          {#each PROJECT_STAGES as stage}
            <option value={stage}>{stage}</option>
          {/each}
        </select>
      </div>
      <div class="form-group">
        <label for="progress_percent">Progress (%)</label>
        <input type="number" id="progress_percent" bind:value={formData.progress_percent} min="0" max="100" class="form-input" />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="payment_status">Status Pembayaran</label>
        <select id="payment_status" bind:value={formData.payment_status} class="form-input">
          <option value="Pending">Pending</option>
          <option value="DP">DP</option>
          <option value="Lunas">Lunas</option>
        </select>
      </div>
    </div>

    <!-- Domain & Maintenance Section -->
    <div class="domain-maintenance-box">
      <div class="subheading">Domain & Maintenance</div>
      <div class="form-row">
        <div class="form-group">
          <label for="domain_url">Link Domain / Website</label>
          <input type="text" id="domain_url" bind:value={formData.domain_url} class="form-input" placeholder="contoh: bintangjaya.com" />
        </div>
        <div class="form-group">
          <label for="domain_price">Biaya Renewal Domain (Rp/thn)</label>
          <input type="number" id="domain_price" bind:value={formData.domain_price} min="0" step="10000" class="form-input" placeholder="150000" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="domain_bought_at">Tanggal Beli Domain</label>
          <input type="date" id="domain_bought_at" bind:value={formData.domain_bought_at} class="form-input" />
        </div>
        <div class="form-group">
          <label for="domain_duration_years">Paket Pembelian Domain</label>
          <select id="domain_duration_years" bind:value={formData.domain_duration_years} class="form-input">
            <option value={1}>1 Tahun</option>
            <option value={2}>2 Tahun</option>
            <option value={3}>3 Tahun</option>
            <option value={5}>5 Tahun</option>
          </select>
        </div>
      </div>

      <div class="maintenance-check-wrap">
        <label class="checkbox-label">
          <input type="checkbox" bind:checked={formData.has_maintenance} />
          <span class="checkbox-text font-medium">Klien Mengambil Paket Maintenance Altertech (Server &amp; Support)</span>
        </label>
      </div>

      {#if formData.has_maintenance}
        <div class="form-row mt-2">
          <div class="form-group">
            <label for="maintenance_fee">Biaya Maintenance Tahunan (Rp)</label>
            <input type="number" id="maintenance_fee" bind:value={formData.maintenance_fee} min="0" step="50000" class="form-input" placeholder="600000" />
            {#if formData.maintenance_fee}
              <span class="help-text-amount">{formatMoney(formData.maintenance_fee)} / thn</span>
            {/if}
          </div>
          <div class="form-group">
            <label for="maintenance_due_date">Tanggal Jatuh Tempo Maintenance</label>
            <input type="date" id="maintenance_due_date" bind:value={formData.maintenance_due_date} class="form-input" />
          </div>
        </div>
        <div class="renewal-calc-preview">
          Estimasi Total Tagihan Perpanjangan: <strong>{formatMoney((formData.maintenance_fee || 0) + (formData.domain_price || 0))}</strong> (Maintenance + Domain)
        </div>
      {/if}
    </div>

    <div class="form-group">
      <label for="notes">Catatan Internal</label>
      <textarea id="notes" bind:value={formData.notes} class="form-input" rows="2"></textarea>
    </div>

    <div class="costs-section">
      <div class="costs-header">
        <div class="costs-label-title">Rincian Biaya / Pengeluaran</div>
        <button type="button" class="action-btn text-primary" onclick={addCostItem}>+ Tambah Biaya</button>
      </div>
      
      {#each formData.costs as cost, i}
        <div class="cost-row">
          <input type="text" placeholder="Label (ex: Fee Dev, Domain)" bind:value={cost.label} class="form-input flex-2" required />
          <input type="number" placeholder="Nominal" bind:value={cost.amount} class="form-input flex-1" required />
          <button type="button" class="action-btn text-error" aria-label="Hapus" onclick={() => removeCostItem(i)}>×</button>
        </div>
      {/each}
      {#if formData.costs.length > 0}
        <div class="costs-total">
          Total Pengeluaran: <strong>{formatMoney(formData.costs.reduce((sum, c) => sum + c.amount, 0))}</strong>
        </div>
      {/if}
    </div>

    <div class="form-actions">
      <Button type="button" variant="ghost" onclick={() => modalOpen = false}>Batal</Button>
      <Button type="submit">Simpan</Button>
    </div>
  </form>
</Modal>

<Modal bind:open={publishModalOpen} title="Publikasikan ke Portfolio">
  {#if publishTarget}
    <div class="publish-content">
      <p class="publish-desc">
        Publikasikan <strong>{publishTarget.project_name}</strong> ke portfolio. Foto wajib diunggah, lalu pilih jenis publikasi.
      </p>

      <div class="form-group">
        <label for="publish-photo">Foto Portfolio <span class="required">*</span></label>
        {#if publishPhoto}
          <div class="photo-preview">
            <img src={publishPhoto} alt="Preview foto portfolio" />
          </div>
        {/if}
        <input type="file" id="publish-photo" accept="image/*" onchange={handlePublishFile} class="file-input" />
        {#if publishUploading}
          <span class="help-text">Mengunggah foto...</span>
        {/if}
      </div>

      {#if publishError}
        <div class="form-error" role="alert">{publishError}</div>
      {/if}

      <div class="publish-actions">
        <Button type="button" variant="ghost" onclick={() => publishModalOpen = false}>Batal</Button>
        <Button type="button" variant="secondary" disabled={!publishPhoto || publishing || publishUploading} onclick={() => doPublish(true)}>
          Konfidensial
        </Button>
        <Button type="button" disabled={!publishPhoto || publishing || publishUploading} onclick={() => doPublish(false)}>
          {publishing ? 'Memproses...' : 'Publikasikan sebagai Publik'}
        </Button>
      </div>
    </div>
  {/if}
</Modal>

<style>
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-4);
  }

  .page-title {
    font-size: var(--text-h2-size);
    font-weight: 700;
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

  .font-mono { font-family: monospace; }
  .text-sm { font-size: 13px; }
  .text-xs { font-size: 12px; }
  .font-medium { font-weight: 500; }
  .text-center { text-align: center; }
  .py-4 { padding-block: var(--space-4); }
  .mt-1 { margin-top: 4px; display: block; color: var(--color-text-secondary); }

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

  .progress-bar-small {
    width: 100%;
    min-width: 80px;
    height: 6px;
    background: var(--color-surface-card);
    border-radius: var(--radius-pill);
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: var(--color-primary);
    border-radius: var(--radius-pill);
  }

  .actions-col {
    text-align: right;
    white-space: nowrap;
  }

  .client-cell {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .client-pic-sub {
    font-size: 11px;
    color: var(--color-text-muted);
  }

  .text-right { text-align: right; }
  .font-semibold { font-weight: 600; }

  .help-text-amount {
    font-size: 13px;
    font-weight: 700;
    color: var(--color-primary);
    margin-top: 4px;
    display: block;
  }

  .badge-package {
    background: #eff6ff;
    color: #1d4ed8;
    border-color: #bfdbfe;
    font-size: 11px;
    font-weight: 600;
  }

  .action-btn {
    background: none;
    border: none;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    margin-left: var(--space-2);
  }

  .text-primary { color: var(--color-primary); }
  .text-error { color: var(--color-error); }
  .text-success { color: var(--color-success); }
  .text-primary:hover { text-decoration: underline; }
  .text-error:hover { text-decoration: underline; }
  .text-success:hover { text-decoration: underline; }

  /* Publish modal */
  .publish-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .publish-desc {
    font-size: 14px;
    color: var(--color-text-secondary);
    line-height: 1.6;
  }

  .publish-desc strong {
    color: var(--color-text-primary);
  }

  .required {
    color: var(--color-error);
  }

  .photo-preview {
    width: 100%;
    max-width: 240px;
    aspect-ratio: 16 / 10;
    border-radius: var(--radius-md);
    overflow: hidden;
    border: 1px solid var(--color-border);
    background: var(--color-surface-card);
  }

  .photo-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .file-input {
    font-size: 13px;
    color: var(--color-text-secondary);
  }

  .file-input::file-selector-button {
    margin-right: var(--space-3);
    padding: 8px 12px;
    border: 1px solid var(--color-border-light);
    border-radius: var(--radius-md);
    background: var(--color-surface-base);
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text-primary);
    cursor: pointer;
  }

  .file-input::file-selector-button:hover {
    background: var(--color-surface-card);
  }

  .help-text {
    font-size: 12px;
    color: var(--color-text-secondary);
  }

  .form-error {
    padding: var(--space-3);
    background: var(--color-error-bg);
    color: var(--color-error);
    border: 1px solid rgba(220, 38, 38, 0.2);
    border-radius: var(--radius-md);
    font-size: 13px;
    font-weight: 500;
  }

  .publish-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: var(--space-2);
  }

  /* Form Styles */
  .form-grid {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
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
    padding-inline: 12px;
    border: 1px solid var(--color-border-light);
    border-radius: var(--radius-md);
    font-size: 14px;
    font-family: inherit;
    background: var(--color-surface-base);
  }

  textarea.form-input {
    height: auto;
    padding-block: 8px;
    resize: vertical;
  }

  .form-input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(37, 150, 190, 0.2);
  }

  /* Costs Section */
  .costs-section {
    padding: var(--space-3);
    background: var(--color-surface-card);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
  }

  .costs-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-2);
  }

  .costs-header .costs-label-title {
    font-size: 13px;
    font-weight: 600;
  }

  .cost-row {
    display: flex;
    gap: var(--space-2);
    margin-bottom: var(--space-2);
    align-items: center;
  }

  .flex-2 { flex: 2; }
  .flex-1 { flex: 1; min-width: 100px; }

  .cost-row .action-btn {
    font-size: 18px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
  }

  .costs-total {
    margin-top: var(--space-3);
    padding-top: var(--space-2);
    border-top: 1px dashed var(--color-border-light);
    font-size: 14px;
    text-align: right;
  }

  .domain-maintenance-box {
    background: var(--color-surface-card);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .subheading {
    font-size: 14px;
    font-weight: 700;
    color: var(--color-text-primary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .checkbox-label {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    cursor: pointer;
  }

  .checkbox-label input[type="checkbox"] {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  .checkbox-text {
    font-size: 13px;
    color: var(--color-text-primary);
  }

  .maintenance-check-wrap {
    padding-top: var(--space-1);
  }

  .renewal-calc-preview {
    margin-top: var(--space-2);
    padding: 8px 12px;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: var(--radius-md);
    font-size: 13px;
    color: #166534;
  }

  .mt-2 { margin-top: var(--space-2); }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-3);
    margin-top: var(--space-2);
  }

  @media (max-width: 600px) {
    .form-row {
      flex-direction: column;
    }
  }
</style>
