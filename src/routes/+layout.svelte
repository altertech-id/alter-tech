<script>
  import '../app.css';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import WhatsAppCTA from '$lib/components/WhatsAppCTA.svelte';
  import { page } from '$app/stores';

  let { children } = $props();

  const isAdmin = $derived($page.url.pathname.startsWith('/admin'));
</script>

<svelte:head>
  <meta name="author" content="Altertech" />
  <meta property="og:site_name" content="Altertech" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

{#if !isAdmin}
  <Header />
  <main>
    {@render children()}
  </main>
  <Footer />
  <WhatsAppCTA variant="floating" message="Halo Altertech, saya tertarik dengan layanan pembuatan website. Bisa konsultasi?" />
{:else}
  {@render children()}
{/if}

<style>
  main {
    min-height: 100vh;
  }
</style>
