<script>
  import { logout } from '$lib/data/api.js';
  import { goto, invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import Icon from '$lib/components/Icon.svelte';
  import '../../app.css'; // Ensure global styles are loaded if this layout is independent

  let { children, data } = $props();
  let mobileSidebarOpen = $state(false);

  // Route protection is enforced server-side in hooks.server.js; `data.user`
  // comes from +layout.server.js and survives page reloads.
  let user = $derived(data.user);

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: 'grid' },
    { label: 'Projects', href: '/admin/projects', icon: 'folder' },
    { label: 'Portfolio', href: '/admin/portfolio', icon: 'image' },
    { label: 'Packages', href: '/admin/packages', icon: 'package' },
    { label: 'Laporan Keuangan', href: '/admin/financial-report', icon: 'bar-chart' },
  ];

  async function handleLogout() {
    await logout();
    await invalidateAll();
    await goto('/admin/login');
  }

  function toggleSidebar() {
    mobileSidebarOpen = !mobileSidebarOpen;
  }
</script>

<svelte:head>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if $page.url.pathname === '/admin/login'}
  {@render children()}
{:else if user}
  <div class="admin-layout">
    <!-- Sidebar Desktop / Overlay Mobile -->
    {#if mobileSidebarOpen}
      <div class="sidebar-overlay" onclick={toggleSidebar} role="presentation"></div>
    {/if}

    <aside class="sidebar" class:open={mobileSidebarOpen}>
      <div class="sidebar-header">
        <img src="/images/logo-horizontal.png" alt="Altertech" class="sidebar-logo" />
      </div>

      <nav class="sidebar-nav">
        {#each navItems as item}
          <a
            href={item.href}
            class="nav-item"
            class:active={$page.url.pathname === item.href || ($page.url.pathname.startsWith(item.href) && item.href !== '/admin')}
            onclick={() => mobileSidebarOpen = false}
          >
            <span class="nav-icon"><Icon name={item.icon} size={18} /></span>
            {item.label}
          </a>
        {/each}
      </nav>

      <div class="sidebar-footer">
        <div class="user-info">
          <div class="user-avatar">{user?.name?.charAt(0) || 'A'}</div>
          <div class="user-details">
            <span class="user-name">{user?.name}</span>
            <span class="user-role">Administrator</span>
          </div>
        </div>
        <button class="logout-btn" onclick={handleLogout}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 14H4c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h2M10 11l3-3-3-3M13 8H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Logout
        </button>
      </div>
    </aside>

    <div class="main-content">
      <header class="topbar">
        <button class="mobile-toggle" onclick={toggleSidebar} aria-label="Toggle Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <div class="topbar-title">
          {navItems.find(i => $page.url.pathname === i.href || ($page.url.pathname.startsWith(i.href) && i.href !== '/admin'))?.label || 'Admin Panel'}
        </div>
        <a href="/" target="_blank" class="view-site-link">Lihat Website ↗</a>
      </header>

      <main class="content-area">
        <div class="container-admin">
          {@render children()}
        </div>
      </main>
    </div>
  </div>
{/if}

<style>
  .admin-layout {
    display: flex;
    min-height: 100vh;
    background: var(--color-surface-card);
  }

  .sidebar {
    width: 260px;
    background: var(--color-surface-base);
    border-right: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
    transition: transform var(--transition-fast);
  }

  .sidebar-header {
    height: 60px;
    display: flex;
    align-items: center;
    padding-inline: var(--space-4);
    border-bottom: 1px solid var(--color-border);
  }

  .sidebar-logo {
    height: 24px;
    width: auto;
  }

  .sidebar-nav {
    flex: 1;
    padding: var(--space-3);
    display: flex;
    flex-direction: column;
    gap: 4px;
    overflow-y: auto;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: 10px 12px;
    border-radius: var(--radius-md);
    color: var(--color-text-secondary);
    font-size: 14px;
    font-weight: 500;
    transition: all var(--transition-fast);
  }

  .nav-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .nav-item:hover {
    background: var(--color-surface-card);
    color: var(--color-text-primary);
  }

  .nav-item.active {
    background: var(--color-primary-light);
    color: var(--color-primary);
    font-weight: 600;
  }

  .sidebar-footer {
    padding: var(--space-3);
    border-top: 1px solid var(--color-border);
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-bottom: var(--space-3);
  }

  .user-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--color-accent);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
  }

  .user-details {
    display: flex;
    flex-direction: column;
  }

  .user-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .user-role {
    font-size: 12px;
    color: var(--color-text-secondary);
  }

  .logout-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    width: 100%;
    padding: 8px;
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    color: var(--color-text-secondary);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .logout-btn:hover {
    background: var(--color-error-bg);
    color: var(--color-error);
    border-color: rgba(220, 38, 38, 0.3);
  }

  .main-content {
    flex: 1;
    margin-left: 260px;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .topbar {
    height: 60px;
    background: var(--color-surface-base);
    border-bottom: 1px solid var(--color-border);
    display: flex;
    align-items: center;
    padding-inline: var(--space-4);
    position: sticky;
    top: 0;
    z-index: 90;
  }

  .mobile-toggle {
    display: none;
    background: transparent;
    border: none;
    color: var(--color-text-primary);
    cursor: pointer;
    padding: 4px;
    margin-right: var(--space-3);
  }

  .topbar-title {
    font-size: 16px;
    font-weight: 600;
  }

  .view-site-link {
    margin-left: auto;
    font-size: 13px;
    color: var(--color-primary);
    font-weight: 500;
  }

  .content-area {
    flex: 1;
    padding: var(--space-5) var(--space-4);
  }

  .container-admin {
    max-width: 1200px;
    margin-inline: auto;
  }

  .sidebar-overlay {
    display: none;
  }

  @media (max-width: 1023px) {
    .sidebar {
      transform: translateX(-100%);
    }
    .sidebar.open {
      transform: translateX(0);
    }
    .main-content {
      margin-left: 0;
    }
    .mobile-toggle {
      display: block;
    }
    .sidebar-overlay {
      display: block;
      position: fixed;
      inset: 0;
      background: rgba(13, 33, 55, 0.4);
      z-index: 99;
      animation: fadeIn 200ms;
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
</style>
