<script>
  import Hero from '$lib/sections/Hero.svelte';
  import Tracking from '$lib/sections/Tracking.svelte';
  import Layanan from '$lib/sections/Layanan.svelte';
  import Keunggulan from '$lib/sections/Keunggulan.svelte';
  import Harga from '$lib/sections/Harga.svelte';
  import Maintenance from '$lib/sections/Maintenance.svelte';
  import AlurKerja from '$lib/sections/AlurKerja.svelte';
  import PortfolioPreview from '$lib/sections/PortfolioPreview.svelte';
  import CtaBanner from '$lib/sections/CtaBanner.svelte';
  import { onMount } from 'svelte';

  // IntersectionObserver fallback for scroll-reveal
  onMount(() => {
    if (CSS.supports && CSS.supports('animation-timeline: view()')) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  });
</script>

<svelte:head>
  <title>Altertech — Jasa Pembuatan Website Cepat & Profesional | Web Agency Indonesia</title>
  <meta name="description" content="Jasa pembuatan website profesional mulai Rp 800.000. Website bisnis Anda jadi dalam 1–2 hari kerja. Company profile, landing page, web app custom. Konsultasi gratis via WhatsApp." />
  <meta name="keywords" content="jasa pembuatan website, web agency Indonesia, jasa website murah profesional, pembuatan website company profile, jasa web developer cepat" />
  <link rel="canonical" href="https://altertech.id" />

  <!-- Open Graph -->
  <meta property="og:title" content="Altertech — Jasa Pembuatan Website Cepat & Profesional" />
  <meta property="og:description" content="Website bisnis Anda jadi dalam 1–2 hari kerja. Mulai Rp 800.000. Konsultasi gratis!" />
  <meta property="og:url" content="https://altertech.id" />
  <meta property="og:image" content="https://altertech.id/images/logo-square.png" />

  <!-- Twitter -->
  <meta name="twitter:title" content="Altertech — Jasa Pembuatan Website Cepat & Profesional" />
  <meta name="twitter:description" content="Website bisnis Anda jadi dalam 1–2 hari kerja. Mulai Rp 800.000." />
  <meta name="twitter:image" content="https://altertech.id/images/logo-square.png" />

  <!-- JSON-LD Structured Data -->
  {@html `<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Altertech",
    "url": "https://altertech.id",
    "logo": "https://altertech.id/images/logo-square.png",
    "description": "Web agency cepat dan terpercaya untuk UMKM hingga enterprise.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+6281399484916",
      "contactType": "sales",
      "availableLanguage": "Indonesian"
    }
  }
  </script>`}

  {@html `<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Web Development",
    "provider": {
      "@type": "Organization",
      "name": "Altertech"
    },
    "areaServed": "ID",
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": "800000",
      "highPrice": "5000000",
      "priceCurrency": "IDR"
    }
  }
  </script>`}
</svelte:head>

<Hero />
<Tracking />
<Layanan />
<Keunggulan />
<Harga />
<Maintenance />
<AlurKerja />
<PortfolioPreview />
<CtaBanner />
