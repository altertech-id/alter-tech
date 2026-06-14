<script>
  import Button from '$lib/components/Button.svelte';
  import { login } from '$lib/data/api.js';
  import { goto, invalidateAll } from '$app/navigation';

  let email = $state('');
  let password = $state('');
  let error = $state('');
  let loading = $state(false);

  async function handleLogin(e) {
    e.preventDefault();
    error = '';
    loading = true;

    try {
      const result = await login(email, password);
      if (result.success) {
        // Session cookie is now set; refresh layout data, then enter the panel.
        await invalidateAll();
        await goto('/admin');
      } else {
        error = result.error;
      }
    } catch (e) {
      error = 'Terjadi kesalahan. Silakan coba lagi.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Admin Login — Altertech</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="login-page">
  <div class="login-card">
    <div class="login-header">
      <img src="/images/logo-square.png" alt="Altertech" class="login-logo" width="64" height="64" />
      <h1 class="login-title">Admin Panel</h1>
      <p class="login-subtitle">Masuk untuk mengelola Altertech</p>
    </div>

    <form onsubmit={handleLogin} class="login-form">
      {#if error}
        <div class="error-banner" role="alert">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
            <path d="M8 5v3M8 10.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          {error}
        </div>
      {/if}

      <div class="form-group">
        <label for="email" class="form-label">Email</label>
        <input
          type="email"
          id="email"
          bind:value={email}
          placeholder="admin@altertech.id"
          required
          autocomplete="email"
          class="form-input"
        />
      </div>

      <div class="form-group">
        <label for="password" class="form-label">Password</label>
        <input
          type="password"
          id="password"
          bind:value={password}
          placeholder="••••••••"
          required
          autocomplete="current-password"
          class="form-input"
        />
      </div>

      <Button type="submit" size="lg" disabled={loading}>
        {#if loading}
          Memproses...
        {:else}
          Masuk
        {/if}
      </Button>
    </form>

    <a href="/" class="back-link">← Kembali ke Beranda</a>
  </div>
</div>

<style>
  .login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-4);
    background: var(--color-surface-card);
  }

  .login-card {
    width: 100%;
    max-width: 400px;
    background: var(--color-surface-base);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--space-6);
    box-shadow: var(--shadow-md);
  }

  .login-header {
    text-align: center;
    margin-bottom: var(--space-5);
  }

  .login-logo {
    width: 64px;
    height: 64px;
    margin-inline: auto;
    margin-bottom: var(--space-4);
    border-radius: var(--radius-md);
  }

  .login-title {
    font-size: var(--text-h2-size);
    font-weight: 700;
  }

  .login-subtitle {
    font-size: 14px;
    color: var(--color-text-secondary);
    margin-top: var(--space-1);
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .error-banner {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3);
    background: var(--color-error-bg);
    color: var(--color-error);
    border: 1px solid rgba(220, 38, 38, 0.2);
    border-radius: var(--radius-md);
    font-size: 14px;
    font-weight: 500;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .form-label {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .form-input {
    height: 44px;
    padding-inline: var(--space-3);
    border: 1.5px solid var(--color-border-light);
    border-radius: var(--radius-md);
    font-size: 14px;
    background: var(--color-surface-base);
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
    outline: none;
  }

  .form-input:focus {
    border-color: var(--color-primary);
    box-shadow: var(--shadow-focus);
  }

  .login-form :global(.btn) {
    width: 100%;
    margin-top: var(--space-2);
  }

  .back-link {
    display: block;
    text-align: center;
    margin-top: var(--space-4);
    font-size: 14px;
    color: var(--color-text-secondary);
    transition: color var(--transition-fast);
  }

  .back-link:hover {
    color: var(--color-primary);
  }
</style>
