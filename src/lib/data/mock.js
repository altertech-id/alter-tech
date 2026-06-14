/**
 * Mock Data — Altertech Website
 * All mock constants used by the API service layer.
 * These will be replaced by real API responses in Phase 2.
 */

export const MOCK_PACKAGES = [
  {
    id: 'pkg-001',
    name: 'Starter',
    price: 800000,
    renewal_price: 600000,
    is_highlighted: false,
    sort_order: 1,
    features: [
      { name: 'Landing page 1 halaman', included: true },
      { name: 'Desain responsif (mobile + desktop)', included: true },
      { name: 'Domain .com gratis 1 tahun', included: true },
      { name: 'Hosting 1 tahun', included: true },
      { name: 'SSL gratis', included: true },
      { name: 'Waktu pengerjaan 1–2 hari kerja', included: true },
      { name: 'Revisi desain 1x', included: true },
      { name: 'Integrasi WhatsApp CTA', included: true },
      { name: 'SEO dasar', included: true },
      { name: 'Halaman tambahan', included: false },
      { name: 'CMS / admin panel', included: false },
      { name: 'Fitur custom', included: false },
    ]
  },
  {
    id: 'pkg-002',
    name: 'Premium',
    price: 1250000,
    renewal_price: 800000,
    is_highlighted: true,
    sort_order: 2,
    features: [
      { name: 'Hingga 5 halaman', included: true },
      { name: 'Desain responsif (mobile + desktop)', included: true },
      { name: 'Domain .com gratis 1 tahun', included: true },
      { name: 'Hosting 1 tahun', included: true },
      { name: 'SSL gratis', included: true },
      { name: 'Waktu pengerjaan 2–4 hari kerja', included: true },
      { name: 'Revisi desain 3x', included: true },
      { name: 'Integrasi WhatsApp CTA', included: true },
      { name: 'SEO optimal', included: true },
      { name: 'Contact form / email', included: true },
      { name: 'Google Analytics', included: true },
      { name: 'Fitur custom', included: false },
    ]
  },
  {
    id: 'pkg-003',
    name: 'Custom',
    price: 5000000,
    renewal_price: null,
    is_highlighted: false,
    sort_order: 3,
    features: [
      { name: 'Halaman unlimited', included: true },
      { name: 'Desain premium custom', included: true },
      { name: 'Domain gratis 1 tahun', included: true },
      { name: 'Hosting 1 tahun', included: true },
      { name: 'SSL gratis', included: true },
      { name: 'Waktu pengerjaan 5–10 hari kerja', included: true },
      { name: 'Revisi unlimited', included: true },
      { name: 'Integrasi WhatsApp + semua sosmed', included: true },
      { name: 'SEO advanced', included: true },
      { name: 'CMS / admin panel', included: true },
      { name: 'Dashboard & analytics', included: true },
      { name: 'Fitur custom sesuai kebutuhan', included: true },
    ]
  }
];

export const MOCK_PORTFOLIO_ITEMS = [
  {
    id: 'pf-001',
    name: 'NDNE',
    description: 'Website company profile modern untuk NDNE dengan desain clean dan navigasi intuitif.',
    screenshot_url: '/images/portfolio/ndne.jpg',
    website_url: 'https://ndne.id',
    is_confidential: false,
    sort_order: 1
  },
  {
    id: 'pf-002',
    name: 'Digiomandira',
    description: 'Platform digital Digiomandira dengan fitur interaktif dan tampilan profesional.',
    screenshot_url: '/images/portfolio/digiomandira.jpg',
    website_url: 'https://digiomandira.com',
    is_confidential: false,
    sort_order: 2
  },
  {
    id: 'pf-003',
    name: 'Asclepio',
    description: 'Website untuk Asclepio dengan fokus pada user experience di bidang kesehatan.',
    screenshot_url: '/images/portfolio/asclepio.jpg',
    website_url: 'https://asclepio.id',
    is_confidential: false,
    sort_order: 3
  },
  {
    id: 'pf-004',
    name: 'Sekardadung',
    description: 'Website Sekardadung yang menampilkan layanan dengan visual yang menarik.',
    screenshot_url: '/images/portfolio/sekardadung.jpg',
    website_url: 'https://sekardadung.com',
    is_confidential: false,
    sort_order: 4
  },
  {
    id: 'pf-005',
    name: 'Kebun Bibit Alamku Asri',
    description: 'E-commerce dan katalog tanaman untuk Kebun Bibit Alamku Asri.',
    screenshot_url: '/images/portfolio/kebunbibit.jpg',
    website_url: 'https://kebunbibitaslam.com',
    is_confidential: false,
    sort_order: 5
  },
  {
    id: 'pf-006',
    name: 'Javameka',
    description: 'Company profile Javameka dengan tampilan industrial yang profesional.',
    screenshot_url: '/images/portfolio/javameka.jpg',
    website_url: 'https://javameka.com',
    is_confidential: false,
    sort_order: 6
  },
  {
    id: 'pf-007',
    name: 'Petrokimia Gresik',
    description: 'Internal project untuk salah satu BUMN terbesar di Indonesia.',
    screenshot_url: null,
    website_url: null,
    is_confidential: true,
    sort_order: 97
  },
  {
    id: 'pf-008',
    name: 'HM Sampoerna',
    description: 'Internal project untuk perusahaan multinasional terkemuka.',
    screenshot_url: null,
    website_url: null,
    is_confidential: true,
    sort_order: 98
  }
];

/** @type {Array<{id: string, invoice_code: string, project_name: string, client_name: string, client_contact: string, current_stage: string, progress_percent: number, notes: string, package_type: string, started_at: string, updated_at: string, payment_status: string, published_to_portfolio?: boolean, costs: Array<{id: string, label: string, amount: number, cost_type: string}>}>} */
export const MOCK_PROJECTS = [
  {
    id: 'prj-001',
    invoice_code: 'ALT-2025-001',
    project_name: 'Website Toko Bintang Jaya',
    client_name: 'Budi Santoso',
    client_contact: '081234567890',
    current_stage: 'Closing',
    progress_percent: 100,
    notes: 'Project selesai, sudah live.',
    package_type: 'Starter',
    started_at: '2025-05-01',
    updated_at: '2025-05-03',
    payment_status: 'Lunas',
    costs: [
      { id: 'c-001', label: 'Fee Developer', amount: 500000, cost_type: 'developer_fee' },
      { id: 'c-002', label: 'Domain .com', amount: 150000, cost_type: 'domain' },
    ]
  },
  {
    id: 'prj-002',
    invoice_code: 'ALT-2025-002',
    project_name: 'Platform E-Learning Cerdas',
    client_name: 'Siti Rahmawati',
    client_contact: '089876543210',
    current_stage: 'Produksi',
    progress_percent: 65,
    notes: 'Sedang integrasi payment gateway.',
    package_type: 'Custom',
    started_at: '2025-05-10',
    updated_at: '2025-05-18',
    payment_status: 'DP',
    costs: [
      { id: 'c-003', label: 'Fee Developer', amount: 3000000, cost_type: 'developer_fee' },
      { id: 'c-004', label: 'Domain .com', amount: 150000, cost_type: 'domain' },
      { id: 'c-005', label: 'Hosting VPS', amount: 300000, cost_type: 'hosting' },
      { id: 'c-006', label: 'SSL Premium', amount: 200000, cost_type: 'other' },
    ]
  },
  {
    id: 'prj-003',
    invoice_code: 'ALT-2025-003',
    project_name: 'Company Profile CV Makmur',
    client_name: 'Dian Purnama',
    client_contact: '081555666777',
    current_stage: 'DP',
    progress_percent: 25,
    notes: 'Menunggu konten dari klien.',
    package_type: 'Premium',
    started_at: '2025-06-01',
    updated_at: '2025-06-02',
    payment_status: 'DP',
    costs: [
      { id: 'c-007', label: 'Fee Developer', amount: 750000, cost_type: 'developer_fee' },
      { id: 'c-008', label: 'Domain .com', amount: 150000, cost_type: 'domain' },
    ]
  },
  {
    id: 'prj-004',
    invoice_code: 'ALT-2025-004',
    project_name: 'Landing Page Promo Ramadan',
    client_name: 'Ahmad Fauzi',
    client_contact: '081999888777',
    current_stage: 'Closing',
    progress_percent: 100,
    notes: 'Sudah go live.',
    package_type: 'Starter',
    started_at: '2025-03-15',
    updated_at: '2025-03-17',
    payment_status: 'Lunas',
    costs: [
      { id: 'c-009', label: 'Fee Developer', amount: 500000, cost_type: 'developer_fee' },
    ]
  },
  {
    id: 'prj-005',
    invoice_code: 'ALT-2025-005',
    project_name: 'Website Klinik Sehat Abadi',
    client_name: 'Dr. Rini Wulandari',
    client_contact: '081333444555',
    current_stage: 'Pre-Deal',
    progress_percent: 10,
    notes: 'Diskusi scope project.',
    package_type: 'Premium',
    started_at: '2025-06-10',
    updated_at: '2025-06-10',
    payment_status: 'Pending',
    costs: [
      { id: 'c-010', label: 'Fee Developer', amount: 750000, cost_type: 'developer_fee' },
    ]
  }
];

export const MOCK_FINANCE_MONTHLY = [
  { month: 'Jan', revenue: 800000, expense: 500000 },
  { month: 'Feb', revenue: 0, expense: 0 },
  { month: 'Mar', revenue: 800000, expense: 500000 },
  { month: 'Apr', revenue: 1250000, expense: 900000 },
  { month: 'Mei', revenue: 6050000, expense: 4300000 },
  { month: 'Jun', revenue: 1250000, expense: 900000 },
];

export const PROJECT_STAGES = ['Kualifikasi', 'Pre-Deal', 'DP', 'Produksi', 'Closing'];

export const SERVICES = [
  {
    icon: 'globe',
    title: 'Website Company Profile',
    description: 'Website profesional yang merepresentasikan bisnis Anda secara online. Desain modern, responsif, dan SEO-friendly.',
    wa_message: 'Halo Altertech, saya tertarik dengan jasa pembuatan website company profile. Bisa diskusi lebih lanjut?'
  },
  {
    icon: 'megaphone',
    title: 'Landing Page & Promosi',
    description: 'Halaman promosi yang dirancang untuk mengkonversi pengunjung menjadi pelanggan. Cocok untuk campaign marketing.',
    wa_message: 'Halo Altertech, saya butuh landing page untuk promosi produk/layanan. Bisa bantu?'
  },
  {
    icon: 'code',
    title: 'Web Application Custom',
    description: 'Solusi web custom sesuai kebutuhan bisnis — mulai dari dashboard, sistem manajemen, hingga platform e-learning.',
    wa_message: 'Halo Altertech, saya butuh web application custom. Bisa konsultasi dulu?'
  },
  {
    icon: 'wrench',
    title: 'Maintenance & Support',
    description: 'Tidak mau repot urus website? Serahkan ke kami. Update konten, backup, security, semua terhandle.',
    wa_message: 'Halo Altertech, saya ingin tanya soal paket maintenance website. Ada info lebih lanjut?'
  }
];

export const ADVANTAGES = [
  {
    icon: 'zap',
    title: 'Cepat. 1–2 Hari Kerja.',
    description: 'Kami nggak bikin Anda nunggu berminggu-minggu. Website starter bisa live dalam 1–2 hari kerja, project besar go live maks 7–10 hari.',
    metric: '1–2 hari'
  },
  {
    icon: 'target',
    title: 'Teknologi Tepat Sasaran',
    description: 'Kami pilih stack yang pas — bukan yang paling trending. Hasilnya? Performa tinggi, maintenance gampang, dan biaya nggak bengkak.',
    metric: 'Zero bloat'
  },
  {
    icon: 'trending-up',
    title: 'Siap Eskalasi Bisnis',
    description: 'Website Anda tumbuh seiring bisnis. Arsitektur kami dirancang untuk scale — dari UMKM sampai enterprise, tanpa harus bikin ulang.',
    metric: 'Scalable'
  }
];

export const COMPARISON_TABLE = [
  { feature: 'Waktu pengerjaan', altertech: '1–2 hari kerja', competitor: '1–4 minggu' },
  { feature: 'Harga mulai dari', altertech: 'Rp 800.000', competitor: 'Rp 1.500.000+' },
  { feature: 'Revisi desain', altertech: 'Termasuk paket', competitor: 'Tambahan biaya' },
  { feature: 'Teknologi modern', altertech: '✓ SvelteKit, Go, dsb', competitor: '— WordPress / template' },
  { feature: 'Support after launch', altertech: '✓ Maintenance plans', competitor: '— Selesai = lepas' },
  { feature: 'SEO optimization', altertech: '✓ Built-in', competitor: '— Addon berbayar' },
];

export const MAINTENANCE_COMPARISON = [
  { aspect: 'Update security & plugin', sendiri: 'Harus pantau sendiri', altertech: 'Otomatis kami handle' },
  { aspect: 'Backup rutin', sendiri: 'Manual, sering lupa', altertech: 'Terjadwal & aman' },
  { aspect: 'Downtime handling', sendiri: 'Panik cari solusi', altertech: 'Respons cepat, kami tangani' },
  { aspect: 'Update konten', sendiri: 'Belajar sendiri', altertech: 'Tinggal kirim, kami update' },
  { aspect: 'Biaya tak terduga', sendiri: 'Bisa melonjak', altertech: 'Fix per tahun, transparan' },
];

export const WORKFLOW_STEPS = [
  {
    stage: 'Kualifikasi',
    title: 'Kenali Kebutuhan',
    description: 'Kami dengarkan apa yang bisnis Anda butuhkan. Tanpa template jawaban — setiap klien punya cerita dan tantangan yang berbeda.'
  },
  {
    stage: 'Pre-Deal',
    title: 'Proposal & Kesepakatan',
    description: 'Kami susun proposal dengan scope jelas, timeline realistis, dan harga transparan. Tidak ada biaya tersembunyi.'
  },
  {
    stage: 'DP',
    title: 'Down Payment',
    description: 'Setelah deal, DP 50% dan project langsung masuk pipeline produksi. Kode invoice Anda siap untuk tracking progress.'
  },
  {
    stage: 'Produksi',
    title: 'Development & Review',
    description: 'Tim kami mulai develop. Anda bisa pantau progress via tracking di website kapan saja, tanpa harus login.'
  },
  {
    stage: 'Closing',
    title: 'Go Live! 🚀',
    description: 'Website Anda live. Pelunasan, serah terima akses, dan briefing maintenance. Hubungan kita nggak berhenti di sini.'
  }
];
