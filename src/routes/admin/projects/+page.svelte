<script>
  import Card from '$lib/components/Card.svelte';
  import Button from '$lib/components/Button.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import { fetchProjects, createProject, updateProject, deleteProject, publishProjectToPortfolio, uploadImage } from '$lib/data/api.js';
  import { fetchPackages } from '$lib/data/api.js';
  import { PROJECT_STAGES } from '$lib/data/mock.js';

  let projects = $state([]);
  let packages = $state([]);
  let loading = $state(true);
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
    projects = await fetchProjects();
    publishModalOpen = false;
    publishPhoto = '';
    publishTarget = null;
  }

  let formData = $state({
    id: '',
    project_name: '',
    client_name: '',
    client_contact: '',
    current_stage: 'Kualifikasi',
    progress_percent: 0,
    notes: '',
    package_type: 'Starter',
    payment_status: 'Pending',
    costs: []
  });

  $effect(() => {
    Promise.all([fetchProjects(), fetchPackages()]).then(([projData, pkgData]) => {
      projects = projData;
      packages = pkgData;
      loading = false;
    });
  });

  function openCreate() {
    isEditing = false;
    formData = {
      id: '',
      project_name: '',
      client_name: '',
      client_contact: '',
      current_stage: 'Kualifikasi',
      progress_percent: 0,
      notes: '',
      package_type: 'Starter',
      payment_status: 'Pending',
      costs: []
    };
    modalOpen = true;
  }

  function openEdit(project) {
    isEditing = true;
    formData = JSON.parse(JSON.stringify(project));
    modalOpen = true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (isEditing) {
      await updateProject(formData.id, formData);
    } else {
      await createProject(formData);
    }
    projects = await fetchProjects();
    modalOpen = false;
  }

  async function handleDelete(id) {
    if (confirm('Yakin ingin menghapus project ini?')) {
      await deleteProject(id);
      projects = await fetchProjects();
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
  {#if loading}
    <div class="loading-state">Memuat data project...</div>
  {:else}
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>Invoice</th>
            <th>Project</th>
            <th>Klien</th>
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
              <td>{p.client_name}</td>
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
              <td colspan="7" class="text-center py-4">Belum ada data project.</td>
            </tr>
          {/if}
        </tbody>
      </table>
    </div>
  {/if}
</Card>

<Modal bind:open={modalOpen} title={isEditing ? 'Edit Project' : 'Project Baru'}>
  <form onsubmit={handleSubmit} class="form-grid">
    <div class="form-group">
      <label for="project_name">Nama Project</label>
      <input type="text" id="project_name" bind:value={formData.project_name} required class="form-input" />
    </div>

    <div class="form-group">
      <label for="client_name">Nama Klien</label>
      <input type="text" id="client_name" bind:value={formData.client_name} required class="form-input" />
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="client_contact">Kontak Klien (WA)</label>
        <input type="text" id="client_contact" bind:value={formData.client_contact} class="form-input" />
      </div>
      <div class="form-group">
        <label for="package_type">Paket</label>
        <select id="package_type" bind:value={formData.package_type} class="form-input">
          {#each packages as pkg}
            <option value={pkg.name}>{pkg.name}</option>
          {/each}
        </select>
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

  .loading-state {
    padding: var(--space-8);
    text-align: center;
    color: var(--color-text-secondary);
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
