/**
 * Kırmızı ışık şeridi: figürün etrafında dolanan, fareyi takip eden neon iz.
 * İki kanvas: şeridin "arkadan geçen" kısmı figürün altına, öndeki kısmı üstüne çizilir.
 */
type Pt = { x: number; y: number; z: number; t: number };

export function mountRibbon(front: HTMLCanvasElement, back: HTMLCanvasElement, hero: HTMLElement, figure: HTMLElement) {
  const fctx = front.getContext('2d')!;
  const bctx = back.getContext('2d')!;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const dpr = Math.min(devicePixelRatio || 1, coarse ? 1.25 : 1.5);

  let W = 0;
  let H = 0;
  const resize = () => {
    W = hero.clientWidth;
    H = hero.clientHeight;
    for (const c of [front, back]) {
      c.width = Math.round(W * dpr);
      c.height = Math.round(H * dpr);
    }
  };
  resize();
  addEventListener('resize', resize, { passive: true });

  /* ---- hedef: fare ya da boşta yörünge ---- */
  const mouse = { x: 0, y: 0, t: -1e9 };
  if (!coarse) {
    hero.addEventListener(
      'pointermove',
      (e) => {
        const r = hero.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
        mouse.t = performance.now();
      },
      { passive: true },
    );
  }

  const TRAIL = coarse ? 2.2 : 2.8; // saniye — kare hızından bağımsız iz uzunluğu
  const pts: Pt[] = [];
  const head = { x: W / 2, y: H / 2, z: 1 };
  let phase = 0;

  /* boşta: figürün gövdesi etrafında eğik, 8 çizen yörünge (orijinal siteye selam) */
  const orbit = (t: number) => {
    const r = figure.getBoundingClientRect();
    const hr = hero.getBoundingClientRect();
    const cx = r.left - hr.left + r.width / 2;
    const cy = r.top - hr.top + r.height * 0.55;
    const rx = r.width * 0.8;
    const ry = r.height * 0.14;
    const x = cx + Math.cos(t) * rx;
    const y = cy + Math.sin(2 * t) * ry * 0.55 + Math.sin(t) * ry * 0.6;
    const z = Math.sin(t); // >0 önde, <0 arkada
    return { x, y, z };
  };

  // açılışta iz hazır olsun: geçmiş 2 sn'yi yörüngeden doldur
  {
    const t0 = performance.now();
    for (let a = -2.0; a <= 0; a += 1 / 60) {
      const o = orbit(0.85 * a);
      pts.push({ x: o.x, y: o.y, z: o.z, t: t0 + a * 1000 });
    }
    head.x = pts[pts.length - 1].x;
    head.y = pts[pts.length - 1].y;
    head.z = pts[pts.length - 1].z;
  }
  let last = performance.now();
  let visible = true;
  new IntersectionObserver(([en]) => (visible = en.isIntersecting), { threshold: 0 }).observe(hero);

  let nowRef = 0;
  const draw = (ctx: CanvasRenderingContext2D, segs: Pt[][], depthAlpha: number) => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = 'lighter';
    for (const seg of segs) {
      if (seg.length < 2) continue;
      // taper: segment sırasına göre kalınlık; passes: glow / mid / core
      const passes: [number, string, number][] = [
        [46, 'rgba(216,16,46,', 0.16 * depthAlpha],
        [18, 'rgba(255,45,77,', 0.5 * depthAlpha],
        [5, 'rgba(255,225,230,', 0.95 * depthAlpha],
      ];
      for (const [w, col, a] of passes) {
        for (let i = 1; i < seg.length; i++) {
          const k = 1 - Math.min((nowRef - seg[i].t) / (TRAIL * 1000), 1); // 1 baş → 0 kuyruk
          ctx.beginPath();
          ctx.moveTo(seg[i - 1].x, seg[i - 1].y);
          ctx.lineTo(seg[i].x, seg[i].y);
          ctx.lineWidth = w * (0.15 + 0.85 * k);
          ctx.strokeStyle = col + (a * (0.2 + 0.8 * k)).toFixed(3) + ')';
          ctx.stroke();
        }
      }
    }
    ctx.globalCompositeOperation = 'source-over';
  };

  const loop = (now: number) => {
    requestAnimationFrame(loop);
    if (!visible) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    const mouseActive = now - mouse.t < 1600;
    phase += dt * (mouseActive ? 0.5 : 0.85);
    const o = orbit(phase);
    let tx = o.x;
    let ty = o.y;
    let tz = o.z;
    if (mouseActive) {
      // fare aktifken ışık fareye koşar, önde kalır
      tx = mouse.x;
      ty = mouse.y;
      tz = 1;
    }
    const ease = mouseActive ? 0.14 : 0.1;
    head.x += (tx - head.x) * ease;
    head.y += (ty - head.y) * ease;
    head.z += (tz - head.z) * 0.15;

    pts.push({ x: head.x, y: head.y, z: head.z, t: now });
    while (pts.length && now - pts[0].t > TRAIL * 1000) pts.shift();

    // z işaretine göre ardışık parçalara böl (kuyruk→baş sırası korunur)
    const fSegs: Pt[][] = [];
    const bSegs: Pt[][] = [];
    let cur: Pt[] = [];
    let curFront = pts[0]?.z >= 0;
    for (const p of pts) {
      const isFront = p.z >= 0;
      if (isFront !== curFront) {
        // geçiş noktasını her iki tarafa da ekle (boşluk olmasın)
        cur.push(p);
        (curFront ? fSegs : bSegs).push(cur);
        cur = [cur[cur.length - 1]];
        curFront = isFront;
      }
      cur.push(p);
    }
    (curFront ? fSegs : bSegs).push(cur);

    nowRef = now;
    draw(fctx, fSegs, 1);
    draw(bctx, bSegs, 0.75);
  };
  requestAnimationFrame(loop);
}
