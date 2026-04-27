import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { animate, stagger } from 'animejs';

// ── Helpers (from the HTML animation) ────────────────────────────────────────
const eOut   = (t: number) => 1 - Math.pow(1 - t, 3);
const c01    = (t: number) => Math.max(0, Math.min(1, t));

// ── Mini animations — ported directly from the HTML SVG scenes ───────────────

function MathMini({ lt }: { lt: number }) {
  const d = Array.from({ length: 80 }, (_, i) => {
    const x = 14 + (i / 79) * 232;
    const y = 72 + 36 * Math.sin((i / 79) * Math.PI * 4 + lt * 2);
    return `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const dotX = 14 + ((lt % Math.PI) / Math.PI) * 232;
  const dotY = 72 + 36 * Math.sin(((lt % Math.PI) / Math.PI) * Math.PI * 4 + lt * 2);
  return (
    <svg width="100%" viewBox="0 0 260 140" preserveAspectRatio="xMidYMid meet">
      <rect width="260" height="140" fill="#04040d" rx="6"/>
      <line x1="14" y1="72" x2="246" y2="72" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
      <path d={d} fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round"/>
      <circle cx={dotX} cy={dotY} r="5" fill="#38bdf8" style={{ filter: 'drop-shadow(0 0 6px #38bdf8)' }}/>
      <text x="130" y="134" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="10" fill="#38bdf8" opacity="0.55">y = sin(4πx)</text>
    </svg>
  );
}

function PhysicsMini({ lt }: { lt: number }) {
  const p   = (lt % 3) / 3;
  const bx  = 14 + p * 232;
  const by  = 115 - 94 * Math.sin(p * Math.PI);
  const trail = Array.from({ length: 18 }, (_, i) => {
    const tp = Math.max(0, p - i * 0.009);
    return { x: 14 + tp * 232, y: 115 - 94 * Math.sin(tp * Math.PI), op: (1 - i / 18) * 0.38 };
  });
  return (
    <svg width="100%" viewBox="0 0 260 140" preserveAspectRatio="xMidYMid meet">
      <rect width="260" height="140" fill="#04040d" rx="6"/>
      <line x1="14" y1="115" x2="246" y2="115" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
      {trail.map((pt, i) => <circle key={i} cx={pt.x} cy={pt.y} r="3" fill="#f43f5e" opacity={pt.op}/>)}
      <circle cx={bx} cy={by} r="9" fill="#f43f5e" style={{ filter: 'drop-shadow(0 0 6px #f43f5e)' }}/>
      <text x="130" y="134" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="10" fill="#f43f5e" opacity="0.55">y = v₀t − ½gt²</text>
    </svg>
  );
}

function ChemMini({ lt }: { lt: number }) {
  const a  = lt * 0.7;
  const cx = 130, cy = 68;
  const hAngles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
  const hAtoms  = hAngles.map(off => ({
    x: cx + 50 * Math.cos(a + off),
    y: cy + 50 * Math.sin(a + off),
  }));
  return (
    <svg width="100%" viewBox="0 0 260 140" preserveAspectRatio="xMidYMid meet">
      <rect width="260" height="140" fill="#04040d" rx="6"/>
      {hAtoms.map((h, i) => (
        <line key={i} x1={cx} y1={cy} x2={h.x} y2={h.y} stroke="rgba(255,255,255,0.18)" strokeWidth="2"/>
      ))}
      {hAtoms.map((h, i) => (
        <g key={i}>
          <circle cx={h.x} cy={h.y} r="9" fill="#7dd3fc" opacity="0.9"/>
          <text x={h.x} y={h.y + 4} textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="9" fontWeight="700" fill="#04040d">H</text>
        </g>
      ))}
      <circle cx={cx} cy={cy} r="13" fill="#10b981" opacity="0.9"/>
      <text x={cx} y={cy + 4} textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="9" fontWeight="700" fill="#04040d">C</text>
      <text x="130" y="134" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="10" fill="#10b981" opacity="0.55">CH₄ — metano</text>
    </svg>
  );
}

function CodeMini({ lt }: { lt: number }) {
  const lines = [
    'def solve(eq, x0=0):',
    '  root = newton(eq, x0)',
    '  return round(root, 4)',
    '',
    '# x²−4=0  →  x = 2.0',
  ];
  const total  = lines.join('\n').length;
  const shown  = Math.floor(eOut(c01(lt / 9)) * total);

  const gc = (line: string, ci: number): string => {
    if (line.startsWith('def')    && ci < 3) return '#a78bfa';
    if (line.startsWith('  root') && ci < 6) return '#38bdf8';
    if (line.startsWith('  ret')  && ci < 8) return '#f43f5e';
    if (line.startsWith('#'))                return 'rgba(255,255,255,0.32)';
    return '#f8fafc';
  };

  let count = 0;
  return (
    <svg width="100%" viewBox="0 0 260 140" preserveAspectRatio="xMidYMid meet">
      <rect width="260" height="140" fill="#04040d" rx="6"/>
      {lines.map((line, li) => (
        <text key={li} x="12" y={22 + li * 22} fontFamily="ui-monospace,monospace" fontSize="11">
          {line.split('').map((ch, ci) => {
            count++;
            return count <= shown
              ? <tspan key={ci} fill={gc(line, ci)}>{ch}</tspan>
              : null;
          })}
        </text>
      ))}
    </svg>
  );
}

function TechMini({ lt }: { lt: number }) {
  const cols = 8, rows = 4;
  return (
    <svg width="100%" viewBox="0 0 260 140" preserveAspectRatio="xMidYMid meet">
      <rect width="260" height="140" fill="#04040d" rx="6"/>
      {Array.from({ length: rows * cols }, (_, i) => {
        const col = i % cols, row = Math.floor(i / cols);
        const delay = col * 0.14 + row * 0.18;
        const on    = Math.sin(lt * 1.8 - delay) > 0.25;
        return (
          <g key={i}>
            {on && <circle cx={18 + col * 30} cy={20 + row * 26} r="9" fill="#fbbf24" opacity="0.12"/>}
            <circle
              cx={18 + col * 30} cy={20 + row * 26} r="4.5"
              fill={on ? '#fbbf24' : 'rgba(255,255,255,0.1)'}
              style={on ? { filter: 'drop-shadow(0 0 5px #fbbf24)' } : {}}
            />
          </g>
        );
      })}
      <text x="130" y="134" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="10" fill="#fbbf24" opacity="0.55">GPIO matrix — Arduino</text>
    </svg>
  );
}

// ── Subject data ──────────────────────────────────────────────────────────────
type SubjectEntry = {
  title: string;
  color: string;
  glyph: string;
  tags: string[];
  Mini: React.FC<{ lt: number }>;
};

const SUBJECTS: SubjectEntry[] = [
  { title: 'Matemáticas',   color: '#38bdf8', glyph: '∑',  tags: ['ESO', 'Bach', 'Univ'],          Mini: MathMini    },
  { title: 'Física',        color: '#f43f5e', glyph: '⚡',  tags: ['Ejercicios', 'Selectividad'],   Mini: PhysicsMini },
  { title: 'Química',       color: '#10b981', glyph: '⚗',  tags: ['Formulación', 'Reac.'],         Mini: ChemMini    },
  { title: 'Programación',  color: '#a78bfa', glyph: '⌨',  tags: ['IA', 'DAM', 'Proyectos'],       Mini: CodeMini    },
  { title: 'Tecnología',    color: '#fbbf24', glyph: '⚙',  tags: ['Arduino', 'Maker'],             Mini: TechMini    },
];

// ── Main component ────────────────────────────────────────────────────────────
export default function SubjectMiniCards() {
  const [lt, setLt]  = useState(0);
  const t0Ref        = useRef(0);
  const rafRef       = useRef(0);
  const visibleRef   = useRef(false);
  const wrapRef      = useRef<HTMLDivElement>(null);
  const enteredRef   = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  // ── Shared RAF (paused when off-screen) ──────────────────────────────────────
  useEffect(() => {
    if (prefersReducedMotion) return;
    const frame = (ts: number) => {
      if (visibleRef.current) {
        if (!t0Ref.current) t0Ref.current = ts;
        setLt((ts - t0Ref.current) / 1000);
      }
      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [prefersReducedMotion]);

  // ── IntersectionObserver: pause RAF + animejs entry stagger ──────────────────
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const observer = new IntersectionObserver(entries => {
      visibleRef.current = entries[0].isIntersecting;

      if (entries[0].isIntersecting && !enteredRef.current) {
        enteredRef.current = true;
        if (prefersReducedMotion) return;

        const cards = Array.from(wrap.querySelectorAll<HTMLElement>('[data-mc]'));
        animate(cards, {
          opacity:    [0, 1],
          translateY: [24, 0],
          delay:    stagger(90),
          duration: 520,
          ease:     'outExpo',
        });
      }
    }, { threshold: 0.08 });

    observer.observe(wrap);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  return (
    <div ref={wrapRef} className="smc-grid">
      {SUBJECTS.map(s => (
        <div
          key={s.title}
          data-mc
          className="smc-card"
          style={{ opacity: prefersReducedMotion ? 1 : 0 }}
        >
          {/* Card header */}
          <div className="smc-header">
            <span className="smc-glyph" aria-hidden="true">{s.glyph}</span>
            <span className="smc-title" style={{ color: s.color }}>{s.title}</span>
          </div>

          {/* Animated preview */}
          <div className="smc-preview">
            <s.Mini lt={lt} />
          </div>

          {/* Tags */}
          <div className="smc-tags">
            {s.tags.map(tag => (
              <span
                key={tag}
                className="smc-tag"
                style={{
                  color:           s.color,
                  backgroundColor: `${s.color}18`,
                  borderColor:     `${s.color}30`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
