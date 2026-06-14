<script>
  import Card from '$lib/components/Card.svelte';
  import Button from '$lib/components/Button.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import { fetchAllPackages, updatePackage } from '$lib/data/api.js';

  let packages = $state([]);
  let loading = $state(true);
  let modalOpen = $state(false);

  let formData = $state({
    id: '',
    name: '',
    price: 0,
    renewal_price: 0,
    is_highlighted: false,
    sort_order: 1,
    features: []
  });

  $effect(() => {
    fetchAllPackages().then(data => {
      packages = data;
      loading = false;
    });
  });

  function openEdit(pkg) {
    formData = JSON.parse(JSON.stringify(pkg));
    modalOpen = true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await updatePackage(formData.id, formData);
    packages = await fetchAllPackages();
    modalOpen = false;
  }

  function addFeature() {
    formData.features = [...formData.features, { name: '', included: true }];
  }

  function removeFeature(index) {
    formData.features = formData.features.filter((_, i) => i !== index);
  }

  function toggleFeature(index) {
    formData.features[index].included = !formData.features[index].included;
  }

  function formatMoney(amount) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  }
</script>

<div class="page-header">
  <h1 class="page-title">Kelola Paket Harga</h1>
  <p class="text-secondary text-sm">Paket bawaan sistem. Anda dapat mengedit detail dan fiturnya.</p>
</div>

{#if loading}
  <div class="loading-state">Memuat data paket...</div>
{:else}
  <div class="packages-grid">
    {#each packages as pkg}
      <Card>
        <div class="pkg-card">
          <div class="pkg-header">
            <div>
              <h3 class="pkg-name">{pkg.name}</h3>
              {#if pkg.is_highlighted}
                <span class="badge status-success">Populer</span>
              {/if}
            </div>
            <button class="action-btn text-primary" onclick={() => openEdit(pkg)}>Edit</button>
          </div>
          <div class="pkg-price-info">
            <div class="price-row">
              <span class="label">Harga:</span>
              <span class="value">{formatMoney(pkg.price)}</span>
            </div>
            <div class="price-row">
              <span class="label">Renewal:</span>
              <span class="value">{pkg.renewal_price ? formatMoney(pkg.renewal_price) + '/thn' : 'Custom'}</span>
            </div>
          </div>
          <div class="pkg-features">
            <span class="features-label">Fitur ({pkg.features.length}):</span>
            <ul class="feature-list-mini">
              {#each pkg.features.slice(0, 4) as feature}
                <li class="feature-item" class:excluded={!feature.included}>
                  <Icon name={feature.included ? 'check' : 'x'} size={14} stroke={2.5} class="feature-icon" />
                  {feature.name}
                </li>
              {/each}
              {#if pkg.features.length > 4}
                <li class="feature-item more">... dan {pkg.features.length - 4} lainnya</li>
              {/if}
            </ul>
          </div>
        </div>
      </Card>
    {/each}
  </div>
{/if}

<Modal bind:open={modalOpen} title="Edit Paket">
  <form onsubmit={handleSubmit} class="form-grid">
    <div class="form-group checkbox-group">
      <label class="checkbox-label">
        <input type="checkbox" bind:checked={formData.is_highlighted} />
        <span class="checkbox-text">Tandai sebagai Populer / Highlight</span>
      </label>
    </div>

    <div class="form-row">
      <div class="form-group flex-2">
        <label for="name">Nama Paket</label>
        <input type="text" id="name" bind:value={formData.name} required class="form-input" />
      </div>
      <div class="form-group flex-1">
        <label for="sort_order">Urutan Tampil</label>
        <input type="number" id="sort_order" bind:value={formData.sort_order} required class="form-input" />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="price">Harga Baru (Rp)</label>
        <input type="number" id="price" bind:value={formData.price} required class="form-input" />
      </div>
      <div class="form-group">
        <label for="renewal_price">Harga Renewal per Tahun (Rp)</label>
        <input type="number" id="renewal_price" bind:value={formData.renewal_price} class="form-input" />
        <span class="help-text">Kosongkan jika harga disesuaikan.</span>
      </div>
    </div>

    <div class="features-section">
      <div class="features-header">
        <div class="features-label-title">Daftar Fitur</div>
        <button type="button" class="action-btn text-primary" onclick={addFeature}>+ Tambah Fitur</button>
      </div>
      
      <div class="features-list">
        {#each formData.features as feature, i}
          <div class="feature-row">
            <button 
              type="button" 
              class="toggle-btn" 
              class:included={feature.included}
              onclick={() => toggleFeature(i)}
              aria-label="Toggle Fitur"
            >
              <Icon name={feature.included ? 'check' : 'x'} size={16} stroke={2.5} />
            </button>
            <input type="text" bind:value={feature.name} class="form-input flex-1" required />
            <button type="button" class="action-btn text-error" aria-label="Hapus" onclick={() => removeFeature(i)}>×</button>
          </div>
        {/each}
      </div>
    </div>

    <div class="form-actions">
      <Button type="button" variant="ghost" onclick={() => modalOpen = false}>Batal</Button>
      <Button type="submit">Simpan</Button>
    </div>
  </form>
</Modal>

<style>
  .page-header {
    margin-bottom: var(--space-4);
  }

  .page-title {
    font-size: var(--text-h2-size);
    font-weight: 700;
  }

  .text-secondary { color: var(--color-text-secondary); }
  .text-sm { font-size: 14px; margin-top: var(--space-1); }

  .loading-state {
    padding: var(--space-8);
    text-align: center;
    color: var(--color-text-secondary);
  }

  .packages-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  @media (min-width: 768px) {
    .packages-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .pkg-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .pkg-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .pkg-name {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: var(--radius-pill);
    font-size: 11px;
    font-weight: 600;
  }

  .status-success { background: var(--color-success-bg); color: #166534; }

  .pkg-price-info {
    padding: var(--space-3);
    background: var(--color-surface-base);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .price-row {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
  }

  .price-row .value {
    font-weight: 600;
  }

  .pkg-features {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .features-label {
    font-size: 13px;
    font-weight: 600;
  }

  .feature-list-mini {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 13px;
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--color-text-primary);
  }

  .feature-item :global(.feature-icon) {
    flex-shrink: 0;
    color: var(--color-success);
  }

  .feature-item.excluded :global(.feature-icon) {
    color: var(--color-text-secondary);
  }

  .feature-item.excluded {
    color: var(--color-text-secondary);
    text-decoration: line-through;
    opacity: 0.7;
  }

  .feature-item.more {
    color: var(--color-primary);
    font-weight: 500;
    font-style: italic;
    text-decoration: none;
    opacity: 1;
  }

  .action-btn {
    background: none;
    border: none;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
  }

  .text-primary { color: var(--color-primary); }
  .text-error { color: var(--color-error); }
  .text-primary:hover { text-decoration: underline; }

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
  .flex-2 { flex: 2; }

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
    font-size: 11px;
    color: var(--color-text-secondary);
  }

  /* Features Section */
  .features-section {
    padding: var(--space-3);
    background: var(--color-surface-card);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
  }

  .features-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-3);
  }

  .features-header .features-label-title {
    font-size: 13px;
    font-weight: 600;
  }

  .features-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    max-height: 300px;
    overflow-y: auto;
    padding-right: 4px;
  }

  .feature-row {
    display: flex;
    gap: var(--space-2);
    align-items: center;
  }

  .toggle-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-surface-base);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    cursor: pointer;
    font-size: 14px;
    color: var(--color-text-secondary);
  }

  .toggle-btn.included {
    background: var(--color-success-bg);
    border-color: rgba(22, 163, 74, 0.3);
    color: var(--color-success);
  }

  .feature-row .action-btn {
    font-size: 18px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
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
