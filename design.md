# Altertech Website Design System

## Overview

Altertech adalah platform web modern yang mengutamakan kecepatan eksekusi, kesiapan eskalasi bisnis, dan kejelasan operasional. Desain sistem ini dibuat dengan pendekatan **mobile-first**, clean, dan profesional, memadukan warna biru brand yang dinamis dengan deep navy yang kokoh untuk memberikan impresi premium dan terpercaya.

---

## Colors

- **Color Primary** (#2596BE): Primary actions, active highlights, interactive elements, and key CTA buttons
- **Color Accent / Dark** (#0D2137): Deep Navy for headers, dark backgrounds, and strong accents
- **Surface Base** (#FFFFFF): Page background
- **Surface Area / Card** (#F8FAFC): Card backgrounds, alternating table rows, and secondary surfaces
- **Text Primary** (#0D2137): Primary reading text, headings, and labels
- **Text Secondary** (#64748B): Sub-taglines, captions, metadata, and description text
- **Color Success** (#16A34A): Success messages, completed project status
- **Color Warning** (#D97706): Alert callouts, pending status
- **Color Error** (#DC2626): Validation errors, system alerts

> **Catatan Kontras:** Pastikan warna tulisan tidak pernah sama dengan warna background. Jika menggunakan background gelap seperti **Color Accent / Dark** (#0D2137) atau **Color Primary** (#2596BE), warna teks wajib diganti menjadi putih/terang (#FFFFFF) untuk menjaga aksesibilitas dan keterbacaan.

## Typography

- **Display / Heading Font**: Plus Jakarta Sans (weight 700–800) — modern and professional
- **Body Font**: Plus Jakarta Sans (weight 400–500) — clean and highly readable

- **text-hero**: Plus Jakarta Sans 48px to 72px extra-bold, 1.1 line height
- **text-h1**: Plus Jakarta Sans 36px to 48px bold, 1.2 line height
- **text-h2**: Plus Jakarta Sans 24px to 32px semibold, 1.2 line height
- **text-h3**: Plus Jakarta Sans 20px to 24px semibold, 1.3 line height
- **text-body-lg**: Plus Jakarta Sans 18px regular, 1.6 line height
- **text-body**: Plus Jakarta Sans 16px regular, 1.6 line height
- **text-caption**: Plus Jakarta Sans 13px medium/regular, 1.5 line height

---

## Spacing

Base unit: **8px**.
- **space-1**: 4px — Tight inline gaps
- **space-2**: 8px — Icon/label spacing
- **space-3**: 16px — Within component groups
- **space-4**: 24px — Card inner padding
- **space-5**: 32px — Between components
- **space-6**: 48px — Section internal padding
- **space-8**: 64px — Between sections
- **space-10**: 80px — Hero-level vertical rhythm

## Border Radius

- **radius-sm** (4px): Small elements, tags, badge indicators
- **radius-md** (8px): Buttons, inputs, standard cards
- **radius-lg** (16px): Large feature cards, panels, modals
- **radius-pill** (9999px): Pills, status indicators

## Elevation & Focus

- **shadow-sm**: 0 1px 2px 0 rgba(13, 33, 55, 0.05)
- **shadow-md**: 0 4px 6px -1px rgba(13, 33, 55, 0.1), 0 2px 4px -1px rgba(13, 33, 55, 0.06)
- **shadow-lg**: 0 10px 15px -3px rgba(13, 33, 55, 0.1), 0 4px 6px -2px rgba(13, 33, 55, 0.05)
- **shadow-focus**: 0 0 0 3px rgba(37, 150, 190, 0.35) — Primary Blue focus ring

---

## Components

### Buttons
Buttons use `border-radius: 8px` with bold brand fills and smooth 150ms transitions.
#### Variants
| Variant     | Background  | Text Color  | Border             |
| ----------- | ----------- | ----------- | ------------------ |
| Primary     | #2596BE     | #FFFFFF     | none               |
| Secondary   | #0D2137     | #FFFFFF     | none               |
| Ghost       | transparent | #2596BE     | 1.5px #2596BE      |
| Destructive | #DC2626     | #FFFFFF     | none               |
#### Sizes
| Size   | Height | Padding (h)  | Font Size | Min Width |
| ------ | ------ | ------------ | --------- | --------- |
| Small  | 32px   | 14px         | 13px      | 72px      |
| Medium | 40px   | 20px         | 14px      | 100px     |
| Large  | 48px   | 28px         | 16px      | 140px     |
#### Disabled State
0.4 opacity, `not-allowed` cursor. No hover elevation or color shift.

### Cards
| Property        | Value                                   |
| --------------- | --------------------------------------- |
| Background      | #FFFFFF or #F8FAFC                      |
| Border          | 1px #E5E7EB                             |
| Border Radius   | 12px atau 16px                          |
| Padding         | 24px                                    |
| Shadow          | shadow-sm                               |
| Hover           | Scale 1.01, shadow-md                   |

### Inputs
| State    | Border Color  | Background  | Shadow              |
| -------- | ------------- | ----------- | -------------------- |
| Default  | #D1D5DB       | #FFFFFF     | none                 |
| Hover    | #9CA3AF       | #FFFFFF     | none                 |
| Focus    | #2596BE       | #FFFFFF     | shadow-focus         |
| Error    | #DC2626       | #FEF2F2     | 3px ring #DC2626 20% |
| Disabled | #E5E7EB       | #F8FAFC     | none                 |
Height: 40px. Font: Plus Jakarta Sans 14px. Border radius: 8px.

### Chips
#### Filter Chips
| State    | Background  | Text Color | Border             |
| -------- | ----------- | ---------- | ------------------ |
| Default  | #F8FAFC     | #0D2137    | 1px #E5E7EB        |
| Selected | #2596BE     | #FFFFFF    | 1px #2596BE        |
| Hover    | #E5E7EB     | #0D2137    | 1px #D1D5DB        |
#### Status Chips
| Type       | Background  | Text Color | Icon     |
| ---------- | ----------- | ---------- | -------- |
| Active     | #DBEAFE     | #1E40AF    | Pulse    |
| Complete   | #DCFCE7     | #166534    | Check    |
| In Review  | #FEF3C7     | #92400E    | Clock    |
| Archived   | #F8FAFC     | #64748B    | Archive  |
Font: Plus Jakarta Sans 13px, weight 500. Height: 30px.

### Lists
| Property          | Value                          |
| ----------------- | ------------------------------ |
| Row height        | 48px                           |
| Padding           | 16px horizontal                |
| Divider           | 1px #E5E7EB                    |
| Hover background  | #F8FAFC                        |
| Active background | #E8F4F8                        |
| Border radius     | 8px (container)                |
| Icon size         | 20px, 12px gap from label      |

### Checkboxes
| State     | Fill        | Border          | Check Color |
| --------- | ----------- | --------------- | ----------- |
| Unchecked | #FFFFFF     | 1.5px #D1D5DB   | --          |
| Checked   | #2596BE     | 1.5px #2596BE   | #FFFFFF     |
| Disabled  | #F8FAFC     | 1.5px #E5E7EB   | #9CA3AF     |

### Radio Buttons
| State      | Fill        | Border            | Dot Color   |
| ---------- | ----------- | ----------------- | ----------- |
| Unselected | #FFFFFF     | 1.5px #D1D5DB     | --          |
| Selected   | #FFFFFF     | 1.5px #2596BE     | #2596BE     |
| Disabled   | #F8FAFC     | 1.5px #E5E7EB     | #9CA3AF     |

### Tooltips
| Property     | Value                            |
| ------------ | -------------------------------- |
| Background   | #0D2137                          |
| Text color   | #FFFFFF                          |
| Font size    | 13px Plus Jakarta Sans           |
| Padding      | 8px 14px                         |
| Border radius| 8px                              |
| Max width    | 240px                            |
| Arrow        | 6px triangle                     |
| Delay        | 200ms show, 50ms hide            |
| Shadow       | shadow-md                        |

---

## Do's and Don'ts

1. **Do** prioritaskan layout mobile-first agar tampilan responsif dan intuitif di layar smartphone.
2. **Don't** menggunakan warna Teal atau warna brand sekunder tambahan; gunakan `#2596BE` sebagai primary dan `#0D2137` sebagai warna gelap/aksen.
3. **Do** gunakan font `Plus Jakarta Sans` secara konsisten baik untuk Heading maupun Body.
4. **Do** pastikan contrast ratio antara teks dan background memenuhi standar aksesibilitas (minimal 4.5:1).
5. **Don't** memberikan animasi transisi yang berlebihan; pertahankan transisi yang halus dan responsif (150ms-300ms).
6. **Do** gunakan padding yang konsisten (mengikuti kelipatan 8px) untuk menjaga harmoni tata letak visual.
7. **Don't** membuat link/CTA yang terlalu kecil di mobile browser; pastikan target sentuhan mudah ditekan oleh pengguna.
8. **Don't** menggunakan warna teks yang sama atau terlalu dekat dengan warna background (misalnya teks `#0D2137` di atas background `#0D2137`); selalu gunakan warna kontras tinggi seperti putih (`#FFFFFF`) untuk area gelap.

---

## Copywriting & Tone of Voice (Anti-AI Style)

Untuk menjaga kualitas konten agar tidak terkesan sebagai tulisan buatan AI, setiap teks pemasaran dan operasional di website wajib mengikuti aturan berikut:

1. **Do** gunakan kombinasi variasi kalimat pendek dan panjang untuk memberikan ritme alami. Hindari struktur paragraf yang terlalu seragam dan kaku.
2. **Don't** menggunakan pola tanda baca yang berlebihan seperti tanda hubung panjang (em-dash "—") atau koma bertumpuk hanya untuk bertele-tele menjelaskan suatu poin.
3. **Don't** menggunakan kosakata klise, kaku, dan kalimat pasif (hindari frasa template AI seperti *"penting untuk dicatat"*, *"selain itu"*, *"pada akhirnya"*).
4. **Do** gunakan gaya bahasa aktif, hangat, dan bersahabat yang mencerminkan empati serta sudut pandang nyata manusia.
5. **Don't** mengulang-ulang ide atau gagasan yang sama menggunakan kata-kata berbeda hanya untuk memperpanjang kalimat.