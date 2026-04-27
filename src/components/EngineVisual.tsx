import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { animate } from 'animejs';

// ── Fibonacci sphere (90 points), precomputed ────────────────────────────────
const N = 90;
const PTS3D = Array.from({ length: N }, (_, i) => {
  const theta = Math.acos(1 - 2 * (i + 0.5) / N);
  const phi   = Math.PI * (1 + Math.sqrt(5)) * i;
  return { x: Math.sin(theta) * Math.cos(phi), y: Math.sin(theta) * Math.sin(phi), z: Math.cos(theta) };
});

// Precompute connections (< 0.52 apart in 3D)
const CONNS: [number, number, number][] = [];
for (let i = 0; i < N; i++) {
  for (let j = i + 1; j < N; j++) {
    const dx = PTS3D[i].x - PTS3D[j].x, dy = PTS3D[i].y - PTS3D[j].y, dz = PTS3D[i].z - PTS3D[j].z;
    const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (d < 0.52) CONNS.push([i, j, d]);
  }
}

const SUBJECTS  = ['Matemáticas', 'Física', 'Química', 'Programación', 'Tecnología'];
const SUB_COLORS = ['#38bdf8',    '#f43f5e', '#10b981', '#a78bfa',      '#fbbf24'   ];

// ── Fourier wave data at bottom strip ────────────────────────────────────────
const FOURIER = [
  { freq: 1, ampF: 1.00, color: '#38bdf8', sw: 1.8 },
  { freq: 3, ampF: 0.62, color: '#f43f5e', sw: 1.5 },
  { freq: 5, ampF: 0.40, color: '#fbbf24', sw: 1.2 },
];

export default function EngineVisual() {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dprRef   = useRef(1);
  const rafRef   = useRef(0);
  const entered  = useRef(false);
  // animejs animates these plain-object properties every frame
  const anim     = useRef({ progress: 0, labelsAlpha: 0 });
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
      const t    = prefersReducedMotion ? 2 : (ts - t0) * 0.001;
      const dpr  = dprRef.current;
      const ctx  = canvas.getContext('2d')!;
      const W    = canvas.width  / dpr;
      const H    = canvas.height / dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // ── Dark background ────────────────────────────────────────────────────
      ctx.fillStyle = '#06101e';
      ctx.fillRect(0, 0, W, H);

      // ── Dot grid (from DotGrid in HTML) ─────────────────────────────────────
      const cols = 36, rows = Math.round(cols * H / W);
      const cw = W / cols, rh = H / rows;
      ctx.fillStyle = 'rgba(248,250,252,0.04)';
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          ctx.beginPath();
          ctx.arc((c + 0.5) * cw, (r + 0.5) * rh, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ── Ambient drift lines (from AmbientLines) ──────────────────────────────
      ctx.setLineDash([4, 10]);
      ctx.strokeStyle = 'rgba(248,250,252,0.04)';
      ctx.lineWidth = 0.5;
      [0.25, 0.5, 0.75].forEach((f, i) => {
        ctx.beginPath();
        ctx.moveTo(0, f * H);
        ctx.lineTo(W, f * H);
        ctx.lineDashOffset = -t * 11 * (i % 2 ? 1 : -1);
        ctx.stroke();
      });
      ctx.setLineDash([]);
      ctx.lineDashOffset = 0;

      // ── 3D Sphere (from Engine3D) ────────────────────────────────────────────
      const progress = anim.current.progress;
      const labAlpha = anim.current.labelsAlpha;
      const maxR     = Math.min(W, H * 0.90) * 0.34;
      const R        = maxR * progress;
      const cx       = W / 2;
      const cy       = H  * 0.44;

      if (R > 0.5) {
        const rotY = t * 0.28;
        const rotX = 0.28 + Math.sin(t * 0.12) * 0.18;
        const pulseBase = t * 1.4;

        const proj = PTS3D.map(p => {
          const x1 = p.x * Math.cos(rotY) + p.z * Math.sin(rotY);
          const z1 = -p.x * Math.sin(rotY) + p.z * Math.cos(rotY);
          const y2 = p.y * Math.cos(rotX) - z1 * Math.sin(rotX);
          const z2 = p.y * Math.sin(rotX) + z1 * Math.cos(rotX);
          const fov = 1100, s = fov / (fov + z2 * R);
          return { sx: x1 * R * s, sy: y2 * R * s, z: z2, depth: (z2 + 1) / 2, s };
        });

        // Outer glow
        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.35);
        grd.addColorStop(0, 'rgba(56,189,248,0.05)');
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.arc(cx, cy, R * 1.35, 0, Math.PI * 2); ctx.fill();

        // Orbit ring
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(-15 * Math.PI / 180);
        ctx.beginPath();
        ctx.ellipse(0, 0, R * 1.04, R * 0.26, 0, 0, Math.PI * 2);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 0.8;
        ctx.globalAlpha = 0.12;
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.restore();

        // Connections
        CONNS.forEach(([i, j, d], k) => {
          const pi = proj[i], pj = proj[j];
          const avg   = (pi.depth + pj.depth) / 2;
          const pulse = Math.sin(pulseBase - k * 0.08) * 0.5 + 0.5;
          const active = pulse > 0.75;
          ctx.beginPath();
          ctx.moveTo(cx + pi.sx, cy + pi.sy);
          ctx.lineTo(cx + pj.sx, cy + pj.sy);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth   = active ? 1.2 : 0.7;
          ctx.globalAlpha = avg * (active ? 0.72 : 0.18) * (1 - d / 0.52) * 0.9;
          ctx.stroke();
          ctx.globalAlpha = 1;
        });

        // Dots sorted back→front
        [...proj].sort((a, b) => a.z - b.z).forEach((p, i) => {
          const pulse = Math.sin(pulseBase - i * 0.15) * 0.5 + 0.5;
          const r = (2.5 + pulse * 2) * p.s;
          if (pulse > 0.7) {
            ctx.beginPath(); ctx.arc(cx + p.sx, cy + p.sy, r * 3, 0, Math.PI * 2);
            ctx.fillStyle = '#38bdf8'; ctx.globalAlpha = 0.35 * p.depth; ctx.fill(); ctx.globalAlpha = 1;
          }
          ctx.beginPath(); ctx.arc(cx + p.sx, cy + p.sy, r, 0, Math.PI * 2);
          ctx.fillStyle = '#f8fafc'; ctx.globalAlpha = 0.5 + p.depth * 0.5; ctx.fill(); ctx.globalAlpha = 1;
        });

        // Subject labels orbiting (from Engine3D labels)
        if (labAlpha > 0.01) {
          SUBJECTS.forEach((subj, i) => {
            const angle  = (i / SUBJECTS.length) * Math.PI * 2 + t * 0.15;
            const rx = R * 1.50, ry = R * 0.70;
            const lx = cx + rx * Math.cos(angle);
            const ly = cy + ry * Math.sin(angle);
            const pulse  = Math.sin(t * 1.1 - i * 1.2) * 0.5 + 0.5;

            // Connector line sphere edge → label
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(angle) * R * 0.97, cy + Math.sin(angle) * R * 0.47);
            ctx.lineTo(lx, ly);
            ctx.strokeStyle = SUB_COLORS[i]; ctx.lineWidth = 0.8;
            ctx.globalAlpha = 0.32 * labAlpha; ctx.stroke(); ctx.globalAlpha = 1;

            ctx.font = `700 ${Math.max(11, W * 0.022)}px "Space Grotesk", sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillStyle = SUB_COLORS[i];
            ctx.globalAlpha = (0.6 + pulse * 0.35) * labAlpha;
            ctx.fillText(subj, lx, ly - 4);
            ctx.globalAlpha = 1;
          });

          // Center caption
          const captionAlpha = Math.max(0, labAlpha - 0.5) * 2;
          if (captionAlpha > 0.01) {
            ctx.font = `300 ${Math.max(12, W * 0.024)}px "Space Grotesk", sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(248,250,252,0.4)';
            ctx.globalAlpha = captionAlpha;
            ctx.fillText('Todo conectado. Todo en un motor de enseñanza.', W / 2, H * 0.88);
            ctx.globalAlpha = 1;
          }
        }
      }

      // ── Fourier wave strip at bottom (from Scene2) ──────────────────────────
      const waveY   = H * 0.93;
      const waveAmp = H * 0.036;
      const pts     = Math.round(W);

      FOURIER.forEach(w => {
        ctx.beginPath();
        for (let i = 0; i <= pts; i++) {
          const x = (i / pts) * W;
          const y = waveY + waveAmp * w.ampF * Math.sin(w.freq * (i / pts) * Math.PI * 8 + t * (0.8 + w.freq * 0.12));
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = w.color; ctx.lineWidth = w.sw; ctx.globalAlpha = 0.45; ctx.stroke(); ctx.globalAlpha = 1;
      });

      // Composite wave
      ctx.beginPath();
      for (let i = 0; i <= pts; i++) {
        const x = (i / pts) * W;
        const p = i / pts;
        const y = waveY
          + waveAmp       * Math.sin(1 * p * Math.PI * 8 + t)
          + waveAmp * 0.6 * Math.sin(3 * p * Math.PI * 8 + t * 1.3)
          + waveAmp * 0.4 * Math.sin(5 * p * Math.PI * 8 + t * 1.6);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(248,250,252,0.72)'; ctx.lineWidth = 2; ctx.stroke();

      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(rafRef.current); };
  }, [prefersReducedMotion]);

  // ── AnimeJS scroll-triggered entry ──────────────────────────────────────────
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    if (prefersReducedMotion) {
      anim.current.progress    = 1;
      anim.current.labelsAlpha = 1;
      return;
    }

    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting || entered.current) return;
      entered.current = true;

      // Sphere grows in with outBack overshoot
      animate(anim.current, { progress: 1, duration: 1400, ease: 'outBack' });
      // Labels fade in after sphere reaches ~70%
      setTimeout(() => {
        animate(anim.current, { labelsAlpha: 1, duration: 1000, ease: 'outCubic' });
      }, 950);
    }, { threshold: 0.2 });

    observer.observe(wrap);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  return (
    <motion.div
      className="engine-visual"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <div ref={wrapRef} className="engine-canvas-wrap">
        <canvas
          ref={canvasRef}
          className="engine-canvas"
          aria-label="Visualización 3D animada de los conceptos STEM interconectados y su descomposición de Fourier"
        />
      </div>
    </motion.div>
  );
}
