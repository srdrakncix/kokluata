# Köklü Ata Kickboks — kokluatakickboks.com

Astro 7 statik site. Three.js hero (masaüstü), GSAP + Lenis scroll, çok sayfalı SEO yapısı.

```
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/
npm run preview
```

## Yayın (Cloudflare Pages)
Build command: `npm run build` · Output: `dist` · Node 22+.
`public/_redirects` eski WordPress URL'lerini 301 ile yeni sayfalara taşır; `public/_headers` cache/güvenlik başlıkları.

## İçerik
Tüm metin/veri: `src/data/site.ts` (adres, telefon, program, SSS, yorumlar). Sayfa metinleri `src/pages/*.astro`.
Görseller `public/img` (webp). 3D eldiven `public/models/glove.glb` (poly.pizza, CC-BY J-Toastie; Loop subdivision + meshopt).
