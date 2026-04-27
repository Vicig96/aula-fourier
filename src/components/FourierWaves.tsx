import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { animate, stagger } from 'animejs';

// Mirrors Scene2 from the HTML animation: 3 harmonic tracks + composite
const TRACKS = [
  { freq: 1, amp: 55, color: '#38bdf8', glyph: 'ω₁', label: 'armónico fundamental' },
  { freq: 3, amp: 34, color: '#f43f5e', glyph: 'ω₃', label: '3er armónico'         },
  { freq: 5, amp: 22, color: '#fbbf24', glyph: 'ω₅', label: '5º armónico'          },
];
// Track y-center positions (fraction of canvas height)
const TRACK_Y = [0.18, 0.38, 0.58, 0.82];

export default function FourierWaves() {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const svgRef    = useRef<SVGPathElement>(null);
  const dprRef    = useRef(1);
  const rafRef    = useRef(0);
  const entered   = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  // ── Resize ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current, wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const resize = () => {
      dprRef.current = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = wrap.getBoundingClientRect();
      if (!width || !height) return;
      canvas.width  = Math.round(width  * dprRef.current);
      canvas.height = Math.round(height * dprRef.current);
      canvas.style.width  = `${width}px`;
      canvas.style.height = `${height}px`;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  // ── RAF draw loop ───────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let t0 = 0;

    const frame = (ts: number) => {
      if (!t0) t0 = ts;
      const t   = prefersReducedMotion ? 0 : (ts - t0) * 0.001;
      const dpr = dprRef.current;
      const ctx = canvas.getContext('2d')!;
      const W   = canvas.width  / dpr;
      const H   = canvas.height / dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // Dark background
      ctx.fillStyle = '#07101f';
      ctx.fillRect(0, 0, W, H);

      // Dot grid
      const cols = 48, rows = 27;
      const cw = W / cols, rh = H / rows;
      ctx.fillStyle = 'rgba(248,250,252,0.045)';
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          ctx.beginPath();
          ctx.arc((c + 0.5) * cw, (r + 0.5) * rh, 1.1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const N = Math.min(500, Math.round(W));

      // ── 3 harmonic waves (from Scene2) ────────────────────────────────────
      TRACKS.forEach((w, wi) => {
        const yCenter = H * TRACK_Y[wi];
        const scaledAmp = (w.amp / 55) * H * 0.1;

        // Axis hairline
        ctx.beginPath(); ctx.moveTo(0, yCenter); ctx.lineTo(W, yCenter);
        ctx.strokeStyle = 'rgba(248,250,252,0.06)'; ctx.lineWidth = 0.5; ctx.stroke();

        // Wave trace
        ctx.beginPath();
        for (let i = 0; i <= N; i++) {
          const x = (i / N) * W;
          const y = yCenter + scaledAmp * Math.sin(w.freq * (i / N) * Math.PI * 4 + t * (0.9 + wi * 0.2));
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = w.color; ctx.lineWidth = 1.8; ctx.globalAlpha = 0.58; ctx.stroke(); ctx.globalAlpha = 1;
      });

      // ── Composite wave — ∑ f(x) ───────────────────────────────────────────
      const compY = H * TRACK_Y[3];
      ctx.beginPath(); ctx.moveTo(0, compY); ctx.lineTo(W, compY);
      ctx.strokeStyle = 'rgba(248,250,252,0.06)'; ctx.lineWidth = 0.5; ctx.stroke();

      ctx.beginPath();
      for (let i = 0; i <= N; i++) {
        const x = (i / N) * W;
        const p = i / N;
        const y = compY
          + (55 / 55) * H * 0.1 * Math.sin(1 * p * Math.PI * 4 + t * 0.9)
          + (34 / 55) * H * 0.1 * Math.sin(3 * p * Math.PI * 4 + t * 1.1)
          + (22 / 55) * H * 0.1 * Math.sin(5 * p * Math.PI * 4 + t * 0.6);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(248,250,252,0.9)'; ctx.lineWidth = 2.8; ctx.stroke();

      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(rafRef.current); };
  }, [prefersReducedMotion]);

  // ── AnimeJS scroll-triggered entry ──────────────────────────────────────────
  useEffect(() => {
    if (prefersReducedMotion) return;

    const pathEl  = svgRef.current;
    const labsEl  = labelsRef.current;
    if (!pathEl || !labsEl) return;

    const rows = Array.from(labsEl.querySelectorAll<HTMLElement>('[data-row]'));
    rows.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(6px)'; });

    const len = pathEl.getTotalLength();
    pathEl.style.strokeDasharray  = String(len);
    pathEl.style.strokeDashoffset = String(len);

    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting || entered.current) return;
      entered.current = true;

      // SVG sine path draws in
      animate(pathEl, { strokeDashoffset: [len, 0], duration: 1100, ease: 'inOutCubic' });

      // Labels stagger in after path is ~half drawn
      setTimeout(() => {
        animate(rows, { opacity: [0, 1], translateY: [6, 0], delay: stagger(80), duration: 400, ease: 'outExpo' });
      }, 450);
    }, { threshold: 0.25 });

    observer.observe(labsEl);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  return (
    <motion.div
      className="fourier-panel"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
    >
      {/* Header row: animated SVG wave + labels */}
      <div className="fourier-panel-head">
        {/* Gradient sine wave — animejs draws this in on scroll */}
        <svg viewBox="0 0 480 28" className="fourier-panel-svg" aria-hidden="true">
          <defs>
            <linearGradient id="fw-grad" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
              <stop offset="0%"   stopColor="#38bdf8" />
              <stop offset="45%"  stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
          </defs>
          <path
            ref={svgRef}
            d="M0,14 C26,3 53,25 80,14 C107,3 134,25 160,14 C187,3 214,25 240,14 C267,3 294,25 320,14 C347,3 374,25 400,14 C427,3 454,25 480,14"
            fill="none"
            stroke="url(#fw-grad)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>

        {/* Overlay labels — animejs staggers these in */}
        <div ref={labelsRef} className="fourier-panel-tags">
          {TRACKS.map(w => (
            <span
              key={w.glyph}
              data-row
              className="fourier-tag"
              style={{
                color: w.color,
                opacity: prefersReducedMotion ? 1 : 0,
              }}
            >
              <span className="fourier-tag-glyph">{w.glyph}</span>
              <span className="fourier-tag-label">{w.label}</span>
            </span>
          ))}
          <span
            data-row
            className="fourier-tag fourier-tag-sum"
            style={{ opacity: prefersReducedMotion ? 1 : 0 }}
          >
            <span className="fourier-tag-glyph">∑ f(x)</span>
            <span className="fourier-tag-label">señal compuesta</span>
          </span>
        </div>
      </div>

      {/* Canvas */}
      <div ref={wrapRef} className="fourier-panel-canvas-wrap">
        <canvas ref={canvasRef} className="fourier-panel-canvas" />
      </div>

      {/* Caption — direct from the HTML animation */}
      <p className="fourier-panel-caption">
        Cualquier señal compleja se puede descomponer en ondas simples.
        <br className="hidden sm:inline" />
        {' '}Y cualquier concepto difícil, también.
      </p>
    </motion.div>
  );
}
