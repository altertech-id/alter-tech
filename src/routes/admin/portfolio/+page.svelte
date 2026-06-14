<script>
  import Card from '$lib/components/Card.svelte';
  import Button from '$lib/components/Button.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import { fetchAllPortfolio, createPortfolioItem, updatePortfolioItem, deletePortfolioItem, uploadImage } from '$lib/data/api.js';

  let items = $state([]);
  let loading = $state(true);
  let modalOpen = $state(false);
  let isEditing = $state(false);
  let uploading = $state(false);
  let formError = $state('');

  let formData = $state({
    id: '',
    name: '',
    description: '',
    screenshot_url: '',
    website_url: '',
    is_confidential: false,
    sort_order: 1
  });

  $effect(() => {
    fetchAllPortfolio().then(data => {
      items = data;
      loading = false;
    });
  });

  function openCreate() {
    isEditing = false;
    formError = '';
    formData = {
      id: '',
      name: '',
      description: '',
      screenshot_url: '',
      website_url: '',
      is_confidential: false,
      sort_order: items.length > 0 ? Math.max(...items.map(i => i.sort_order || 0)) + 1 : 1
    };
    modalOpen = true;
  }

  function openEdit(item) {
    isEditing = true;
    formError = '';
    formData = JSON.parse(JSON.stringify(item));
    modalOpen = true;
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    uploading = true;
    formError = '';
    try {
      formData.screenshot_url = await uploadImage(file);
    } catch {
      formError = 'Gagal mengunggah foto. Coba lagi.';
    } finally {
      uploading = false;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.screenshot_url) {
      formError = 'Foto wajib diisi.';
      return;
    }
    if (isEditing) {
      await updatePortfolioItem(formData.id, formData);
    } else {
      await createPortfolioItem(formData);
    }
    items = await fetchAllPortfolio();
    modalOpen = false;
  }

  async function handleDelete(id) {
    if (confirm('Yakin ingin menghapus item portfolio ini?')) {
      await deletePortfolioItem(id);
      items = await fetchAllPortfolio();
    }
  }
</script>

<div class="page-header">
  <h1 class="page-title">Kelola Portfolio</h1>
  <Button onclick={openCreate} size="sm">
    + Item Baru
  </Button>
</div>

<Card>
  {#if loading}
    <div class="loading-state">Memuat data portfolio...</div>
  {:else}
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th class="w-12">Urutan</th>
            <th>Nama Klien</th>
            <th>Website</th>
            <th>Status</th>
            <th class="actions-col">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {#each items as item}
            <tr>
              <td class="text-center">{item.sort_order}</td>
              <td class="font-medium">{item.name}</td>
              <td>
                {#if item.website_url}
                  <a href={item.website_url} target="_blank" class="text-primary link-text">{item.website_url}</a>
                {:else}
                  <span class="text-secondary">-</span>
                {/if}
              </td>
              <td>
                {#if item.is_confidential}
                  <span class="badge status-warning">Konfidensial</span>
                {:else}
                  <span class="badge status-success">Publik</span>
                {/if}
              </td>
              <td class="actions-col">
                <button class="action-btn text-primary" onclick={() => openEdit(item)}>Edit</button>
                <button class="action-btn text-error" onclick={() => handleDelete(item.id)}>Hapus</button>
              </td>
            </tr>
          {/each}
          {#if items.length === 0}
            <tr>
              <td colspan="5" class="text-center py-4">Belum ada data portfolio.</td>
            </tr>
          {/if}
        </tbody>
      </table>
    </div>
  {/if}
</Card>

<Modal bind:open={modalOpen} title={isEditing ? 'Edit Portfolio' : 'Portfolio Baru'}>
  <form onsubmit={handleSubmit} class="form-grid">
    <div class="form-group checkbox-group">
      <label class="checkbox-label">
        <input type="checkbox" bind:checked={formData.is_confidential} />
        <span class="checkbox-text">Project Internal / Konfidensial (Enterprise)</span>
      </label>
      <p class="help-text">Jika dicentang, portfolio tidak akan ditampilkan di halaman depan, hanya di-mention namanya di bagian bawah portfolio.</p>
    </div>

    <div class="form-row">
      <div class="form-group flex-3">
        <label for="name">Nama Klien / Project</label>
        <input type="text" id="name" bind:value={formData.name} required class="form-input" />
      </div>
      <div class="form-group flex-1">
        <label for="sort_order">Urutan Tampil</label>
        <input type="number" id="sort_order" bind:value={formData.sort_order} required class="form-input" />
      </div>
    </div>

    <div class="form-group">
      <label for="description">Deskripsi Singkat</label>
      <textarea id="description" bind:value={formData.description} required class="form-input" rows="3"></textarea>
    </div>

    <div class="form-group">
      <label for="photo">Foto Portfolio <span class="required">*</span></label>
      {#if formData.screenshot_url}
        <div class="photo-preview">
          <img src={formData.screenshot_url} alt="Preview foto portfolio" />
        </div>
      {/if}
      <input type="file" id="photo" accept="image/*" onchange={handleFileChange} class="file-input" />
      <span class="help-text">
        {#if uploading}Mengunggah foto...{:else}Wajib untuk semua portfolio (publik & konfidensial).{/if}
      </span>
    </div>

    {#if !formData.is_confidential}
      <div class="form-group">
        <label for="website_url">URL Website Klien (opsional)</label>
        <input type="url" id="website_url" bind:value={formData.website_url} class="form-input" placeholder="https://..." />
      </div>
    {/if}

    {#if formError}
      <div class="form-error" role="alert">{formError}</div>
    {/if}

    <div class="form-actions">
      <Button type="button" variant="ghost" onclick={() => modalOpen = false}>Batal</Button>
      <Button type="submit" disabled={uploading}>Simpan</Button>
    </div>
  </form>
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

  .w-12 { width: 48px; }
  .text-center { text-align: center; }
  .font-medium { font-weight: 500; }
  .text-secondary { color: var(--color-text-secondary); }
  .link-text:hover { text-decoration: underline; }
  .py-4 { padding-block: var(--space-4); }

  .badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: var(--radius-pill);
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
  }

  .status-success { background: var(--color-success-bg); color: #166534; }
  .status-warning { background: var(--color-warning-bg); color: #92400e; }

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
  .text-primary:hover { text-decoration: underline; }
  .text-error:hover { text-decoration: underline; }

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

  .flex-1 { flex: 1; }
  .flex-3 { flex: 3; }

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

  .checkbox-group {
    background: var(--color-surface-card);
    padding: var(--space-3);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    margin-bottom: 4px;
  }

  .checkbox-label input {
    width: 16px;
    height: 16px;
    accent-color: var(--color-primary);
  }

  .checkbox-text {
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .help-text {
    font-size: 12px;
    color: var(--color-text-secondary);
    margin-left: 24px;
  }

  .required {
    color: var(--color-error);
  }

  .form-group .help-text {
    margin-left: 0;
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

  .form-error {
    padding: var(--space-3);
    background: var(--color-error-bg);
    color: var(--color-error);
    border: 1px solid rgba(220, 38, 38, 0.2);
    border-radius: var(--radius-md);
    font-size: 13px;
    font-weight: 500;
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
