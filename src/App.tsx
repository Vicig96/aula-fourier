import { useEffect, useRef, useState } from 'react';
import type { Key } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import type { MotionValue } from 'motion/react';
import Lenis from 'lenis';
import type { LucideIcon } from 'lucide-react';
import {
  Atom,
  BookOpen,
  Calculator,
  ChevronDown,
  Cpu,
  FlaskConical,
  Heart,
  Lightbulb,
  Mail,
  Rocket,
  Send,
  Settings,
  Smile,
  Target,
  Terminal,
  Wrench,
  Zap,
} from 'lucide-react';

import Chatbot from './components/Chatbot';
import ContactCard from './components/ContactCard';
import LoadingScreen from './components/LoadingScreen';
import TeacherProfileCard from './components/TeacherProfileCard';
import ThemeSwitch from './components/ThemeSwitch';

type SectionId = 'inicio' | 'sobre-mi' | 'que-enseno' | 'como-enseno' | 'recursos' | 'contacto';

type Subject = {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  tags: string[];
};

const navigationItems: { id: SectionId; label: string }[] = [
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'que-enseno', label: 'Materias' },
  { id: 'como-enseno', label: 'Método' },
  { id: 'recursos', label: 'Recursos' },
];

const subjects: Subject[] = [
  {
    title: 'Matemáticas',
    description: 'Álgebra, cálculo, geometría y resolución de problemas explicados con orden y mucha claridad.',
    icon: Calculator,
    accent: 'from-sky-500/20 via-sky-500/5 to-transparent text-sky-700',
    tags: ['ESO', 'Bachillerato', 'Universidad'],
  },
  {
    title: 'Física',
    description: 'Mecánica, campos, electricidad y física aplicada conectadas con ejemplos del mundo real.',
    icon: Atom,
    accent: 'from-indigo-500/20 via-indigo-500/5 to-transparent text-indigo-700',
    tags: ['Ejercicios guiados', 'Selectividad', 'Bases sólidas'],
  },
  {
    title: 'Química',
    description: 'Formulación, enlaces, estequiometría y reacciones paso a paso, sin memorizar a ciegas.',
    icon: FlaskConical,
    accent: 'from-emerald-500/20 via-emerald-500/5 to-transparent text-emerald-700',
    tags: ['Problemas tipo', 'Mapa visual', 'Seguimiento'],
  },
  {
    title: 'Tecnología',
    description: 'Electrónica, mecánica, robótica y proyectos técnicos con una visión práctica y aplicada.',
    icon: Cpu,
    accent: 'from-amber-500/20 via-amber-500/5 to-transparent text-amber-700',
    tags: ['Maker', 'Arduino', 'Ingeniería'],
  },
  {
    title: 'Programación e IA',
    description: 'Lógica, software, herramientas modernas e IA explicadas de forma útil y aterrizada.',
    icon: Terminal,
    accent: 'from-rose-500/20 via-rose-500/5 to-transparent text-rose-700',
    tags: ['DAM', 'Proyectos', 'Automatización'],
  },
];

const methodology = [
  {
    title: 'Calma y confianza',
    description: 'Creamos un espacio donde preguntar es fácil y equivocarse forma parte natural del aprendizaje.',
    icon: Smile,
    accent: 'text-sky-700 bg-sky-500/10 ring-sky-500/20',
  },
  {
    title: 'Explicaciones visuales',
    description: 'Transformo conceptos abstractos en esquemas, analogías y pasos concretos que sí se entienden.',
    icon: Lightbulb,
    accent: 'text-amber-700 bg-amber-500/10 ring-amber-500/20',
  },
  {
    title: 'Práctica con sentido',
    description: 'Cada clase aterriza en ejercicios útiles para que avances en exámenes, tareas y confianza real.',
    icon: Target,
    accent: 'text-rose-700 bg-rose-500/10 ring-rose-500/20',
  },
  {
    title: 'Energía positiva',
    description: 'Mantengo el ritmo alto, celebro el progreso y convierto la materia en algo mucho más amable.',
    icon: Rocket,
    accent: 'text-violet-700 bg-violet-500/10 ring-violet-500/20',
  },
];

const resourcePoints = [
  {
    title: 'Apuntes visuales',
    description: 'Resúmenes, esquemas y mapas mentales que ayudan a estudiar sin perderse.',
    icon: BookOpen,
  },
  {
    title: 'Proyectos prácticos',
    description: 'Electrónica, impresión 3D y cultura maker para tocar la tecnología con las manos.',
    icon: Wrench,
  },
  {
    title: 'Rutinas de estudio',
    description: 'Planificación sencilla para que cada semana tenga foco, progreso y menos bloqueo.',
    icon: Zap,
  },
];

const trustPillars = [
  {
    title: 'Diagnóstico claro desde el inicio',
    description: 'Antes de avanzar, identificamos exactamente qué está fallando: base, método, ritmo o tipo de ejercicio.',
    icon: Target,
    tone: 'from-sky-500/14 via-sky-500/5 to-transparent text-sky-700',
  },
  {
    title: 'Rigor técnico sin distancia',
    description: 'La explicación es seria y bien estructurada, pero siempre aterrizada a tu nivel para que no se quede en teoría vacía.',
    icon: Lightbulb,
    tone: 'from-amber-500/14 via-amber-500/5 to-transparent text-amber-700',
  },
  {
    title: 'Seguimiento para consolidar',
    description: 'La idea no es solo resolver una clase suelta, sino dejar una forma de pensar que te sirva también después.',
    icon: Heart,
    tone: 'from-rose-500/14 via-rose-500/5 to-transparent text-rose-700',
  },
];

const classProcess = [
  {
    step: '01',
    title: 'Me cuentas qué necesitas',
    description: 'Asignatura, nivel, examen cercano, proyecto o bloqueo concreto. Empezamos por tu situación real.',
  },
  {
    step: '02',
    title: 'Ubicamos el punto exacto',
    description: 'Detectamos si falta base, si el problema es de enfoque o si simplemente hace falta otra manera de explicarlo.',
  },
  {
    step: '03',
    title: 'Trabajamos con orden',
    description: 'Clase a clase, con ejemplos, ejercicios guiados y una progresión pensada para que avances sin saltos raros.',
  },
  {
    step: '04',
    title: 'Sales con claridad y siguiente paso',
    description: 'Cada sesión debe dejarte con algo concreto: comprensión, material útil y una dirección clara para continuar.',
  },
];

const faqItems = [
  {
    question: '¿Las clases son solo para alumnos que van muy mal?',
    answer:
      'No. Algunas personas llegan para remontar una asignatura y otras para afinar, preparar exámenes exigentes o ganar seguridad antes de que aparezca el bloqueo.',
  },
  {
    question: '¿Se puede empezar con poca base?',
    answer:
      'Sí. De hecho, muchas veces la mejora real llega cuando se reconstruyen bien los fundamentos en lugar de seguir acumulando dudas encima.',
  },
  {
    question: '¿Trabajas problemas concretos, exámenes o proyectos?',
    answer:
      'Sí. La idea es combinar comprensión de fondo con trabajo práctico sobre ejercicios reales, tareas, entregas o pruebas cercanas.',
  },
  {
    question: '¿Las clases pueden ser puntuales o tienen que ser continuas?',
    answer:
      'Pueden ser ambas cosas. Hay alumnos que necesitan una ayuda puntual y otros que prefieren un acompañamiento más estable durante el curso.',
  },
];

const formulas = [
  { text: 'E = mc²', top: '12%', left: '8%', delay: 0, rotation: -8, className: '' },
  { text: '∫ eˣ dx = eˣ + C', top: '19%', left: '72%', delay: 1.2, rotation: 7, className: 'hidden md:flex' },
  { text: 'x = (-b ± √(b² - 4ac)) / 2a', top: '67%', left: '7%', delay: 2.1, rotation: -4, className: 'hidden lg:flex' },
  { text: 'V = I · R', top: '80%', left: '78%', delay: 3.2, rotation: 10, className: '' },
  { text: '∑ F = 0', top: '48%', left: '84%', delay: 4.1, rotation: -12, className: '' },
  { text: 'CH₄ + 2O₂ → CO₂ + 2H₂O', top: '86%', left: '32%', delay: 5.3, rotation: 4, className: 'hidden md:flex' },
];

const planes = [
  {
    top: ['72%', '46%', '20%'] as [string, string, string],
    left: ['-8%', '38%', '108%'] as [string, string, string],
    rotate: [-16, -5, 10] as [number, number, number],
    duration: 18,
    delay: 0,
    sizeClass: 'h-10 w-10 md:h-12 md:w-12',
    toneClass: 'text-sky-500/45',
  },
  {
    top: ['22%', '34%', '78%'] as [string, string, string],
    left: ['108%', '56%', '-12%'] as [string, string, string],
    rotate: [170, 186, 200] as [number, number, number],
    duration: 23,
    delay: 5,
    sizeClass: 'h-12 w-12 md:h-14 md:w-14',
    toneClass: 'text-rose-500/35',
  },
  {
    top: ['88%', '62%', '42%'] as [string, string, string],
    left: ['12%', '56%', '100%'] as [string, string, string],
    rotate: [12, 0, -18] as [number, number, number],
    duration: 21,
    delay: 10,
    sizeClass: 'hidden lg:block h-9 w-9',
    toneClass: 'text-emerald-500/30',
  },
];



const revealUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-120px' },
  transition: { duration: 0.6, ease: 'easeOut' as const },
};

function FloatingFormula({
  text,
  top,
  left,
  delay,
  rotation,
  className,
}: {
  text: string;
  top: string;
  left: string;
  delay: number;
  rotation: number;
  className: string;
  key?: Key;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`formula-chip absolute ${className}`}
      style={{ top, left }}
      initial={{ opacity: 0, scale: 0.92, rotate: rotation }}
      animate={
        shouldReduceMotion
          ? { opacity: 0.42, scale: 1, rotate: rotation }
          : {
              opacity: [0.18, 0.46, 0.22],
              x: [0, 18, -12, 0],
              y: [0, -22, 10, 0],
              rotate: [rotation, rotation + 5, rotation - 3, rotation],
              scale: [0.98, 1.03, 1],
            }
      }
      transition={{
        duration: shouldReduceMotion ? 0.4 : 11,
        delay,
        repeat: shouldReduceMotion ? 0 : Infinity,
        ease: 'easeInOut',
      }}
    >
      {text}
    </motion.div>
  );
}

function PaperPlane({
  top,
  left,
  rotate,
  duration,
  delay,
  sizeClass,
  toneClass,
}: {
  top: [string, string, string];
  left: [string, string, string];
  rotate: [number, number, number];
  duration: number;
  delay: number;
  sizeClass: string;
  toneClass: string;
  key?: Key;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`absolute ${toneClass}`}
      initial={{ top: top[0], left: left[0], rotate: rotate[0], opacity: 0, scale: 0.84 }}
      animate={
        shouldReduceMotion
          ? { top: top[1], left: left[1], rotate: rotate[1], opacity: 0.28, scale: 1 }
          : { top, left, rotate, opacity: [0, 0.88, 0.3], scale: [0.82, 1, 0.92] }
      }
      transition={{ duration, delay, ease: 'easeInOut', repeat: shouldReduceMotion ? 0 : Infinity }}
    >
      <div className="plane-trail" />
      <Send className={`${sizeClass} rotate-[26deg]`} strokeWidth={1.7} />
    </motion.div>
  );
}

function BackgroundScene({ y }: { y: MotionValue<number> }) {
  return (
    <motion.div style={{ y }} className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(244,114,182,0.14),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(250,204,21,0.12),_transparent_26%)]" />
      <div className="absolute left-[8%] top-[10%] h-48 w-48 rounded-full bg-sky-300/20 blur-3xl" />
      <div className="absolute right-[8%] top-[28%] h-56 w-56 rounded-full bg-rose-300/20 blur-3xl" />
      <div className="absolute bottom-[12%] left-[24%] h-64 w-64 rounded-full bg-amber-200/20 blur-3xl" />

      {planes.map((plane, index) => (
        <PaperPlane
          key={index}
          top={plane.top}
          left={plane.left}
          rotate={plane.rotate}
          duration={plane.duration}
          delay={plane.delay}
          sizeClass={plane.sizeClass}
          toneClass={plane.toneClass}
        />
      ))}

      {formulas.map((formula) => (
        <FloatingFormula
          key={formula.text}
          text={formula.text}
          top={formula.top}
          left={formula.left}
          delay={formula.delay}
          rotation={formula.rotation}
          className={formula.className}
        />
      ))}

      <motion.div
        className="absolute left-[74%] top-[24%] hidden text-slate-500/18 lg:block"
        animate={{ rotate: 360 }}
        transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
      >
        <Settings className="h-20 w-20" strokeWidth={1.6} />
      </motion.div>
      <motion.div
        className="absolute left-[24%] top-[74%] hidden text-amber-500/25 md:block"
        animate={{ scale: [1, 1.15, 1], rotate: [0, 8, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Zap className="h-14 w-14" strokeWidth={1.8} />
      </motion.div>
    </motion.div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div {...revealUp} className="mx-auto mb-16 max-w-3xl text-center">
      <span className="section-eyebrow">{eyebrow}</span>
      <h2 className="font-display mt-6 text-4xl font-bold text-slate-900 md:text-5xl lg:text-6xl">{title}</h2>
      <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">{description}</p>
    </motion.div>
  );
}

export default function App() {
  const shouldReduceMotion = useReducedMotion();
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<SectionId>('inicio');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const lenisRef = useRef<Lenis | null>(null);
  const { scrollYProgress, scrollY } = useScroll();

  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  const backgroundY = useTransform(scrollY, [0, 2600], [0, -180]);
  const heroCardY = useTransform(scrollY, [0, 600], [0, -40]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      gestureOrientation: 'vertical',
      easing: (t) => 1 - Math.pow(1 - t, 4),
    });

    lenisRef.current = lenis;
    let frameId = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };

    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [shouldReduceMotion]);

  useEffect(() => {
    const handleScroll = () => {
      const sections: SectionId[] = ['inicio', 'sobre-mi', 'que-enseno', 'como-enseno', 'recursos', 'contacto'];
      const scrollPosition = window.scrollY + 160;

      setIsScrolled(window.scrollY > 24);

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition && element.offsetTop + element.offsetHeight > scrollPosition) {
          setActiveSection(section);
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: SectionId) => {
    const element = document.getElementById(id);
    if (!element) {
      return;
    }

    if (lenisRef.current) {
      lenisRef.current.scrollTo(element, { offset: -96 });
      return;
    }

    window.scrollTo({
      top: element.offsetTop - 96,
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen key="loading" />}
      </AnimatePresence>
      <div className="site-shell min-h-screen overflow-x-hidden text-slate-800 selection:bg-sky-200 selection:text-sky-950">
      <motion.div className="progress-bar" style={{ scaleX: progress }} />
      <BackgroundScene y={backgroundY} />

      <nav className="fixed left-1/2 top-4 z-50 w-[calc(100%-1.5rem)] max-w-6xl -translate-x-1/2 px-2">
        <div className={`glass-nav mobile-glass-nav flex items-center justify-between gap-4 px-4 py-3 md:px-6 ${isScrolled ? 'glass-nav-scrolled' : ''}`}>
          <button onClick={() => scrollTo('inicio')} className="flex items-center gap-3 text-left" aria-label="Volver al inicio">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/12 text-sky-800 ring-1 ring-sky-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M2 12 Q 7 2 12 12 T 22 12" />
              </svg>
            </div>
            <div>
              <p className="font-display text-lg font-bold text-slate-900">Aula Fourier</p>
              <p className="hidden text-sm text-slate-500 sm:block">Clases particulares STEM</p>
            </div>
          </button>

          <div className="hidden items-center gap-2 lg:flex">
            {navigationItems.map((item) => (
              <button key={item.id} onClick={() => scrollTo(item.id)} className={`nav-link ${activeSection === item.id ? 'nav-link-active' : ''}`}>
                {activeSection === item.id && <motion.span layoutId="nav-pill" className="nav-pill" transition={{ type: 'spring', stiffness: 340, damping: 28 }} />}
                <span className="relative z-10">{item.label}</span>
              </button>
            ))}
          </div>

          <button onClick={() => scrollTo('contacto')} className="button-primary hidden sm:inline-flex">
            Reserva una clase
          </button>
          <ThemeSwitch isDark={isDark} onToggle={() => setIsDark(d => !d)} />
        </div>
        <div className="mobile-nav-strip lg:hidden">
          <div className="mobile-nav-scroll">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`mobile-nav-link ${activeSection === item.id ? 'mobile-nav-link-active' : ''}`}
              >
                {item.label}
              </button>
            ))}
            <button onClick={() => scrollTo('contacto')} className="mobile-nav-link mobile-nav-link-cta">
              Contacto
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        <section id="inicio" className="hero-section relative px-6 pb-20 pt-32 md:px-8 md:pt-36">
          <div className="hero-grid mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }} className="hero-copy max-w-3xl">
              <span className="section-eyebrow">ESO · Bachillerato · Universidad · FP y ciclos técnicos</span>
              <h1 className="font-display mt-7 text-5xl font-bold leading-[1.02] text-slate-950 md:text-7xl lg:text-[5.5rem]">
                De &quot;no entiendo nada&quot; a{' '}
                <span className="highlight-text">&quot;&#161;ahora tiene sentido!&quot;</span>.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
                Soy Antonio, ingeniero y docente. Mis clases son técnicamente rigurosas y humanamente cercanas: empezamos donde estás y avanzamos hasta que cada concepto encaja.
              </p>

              <div className="hero-chip-row mt-8 flex flex-wrap gap-3">
                {['Online y presencial', 'Material propio incluido', 'Ritmo adaptado a ti'].map((item, i) => (
                  <span key={item} className="note-chip">
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${i === 0 ? 'bg-sky-400' : i === 1 ? 'bg-rose-400' : 'bg-amber-400'}`} />
                    {item}
                  </span>
                ))}
              </div>

              <div className="hero-actions mt-10 flex flex-col gap-4 sm:flex-row">
                <button onClick={() => scrollTo('contacto')} className="button-primary">
                  Reserva tu primera clase
                </button>
                <button onClick={() => scrollTo('como-enseno')} className="button-secondary">
                  Conocer el método <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              <div className="hero-stats mt-12 grid gap-4 sm:grid-cols-3">
                <div className="stat-card">
                  <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-[2rem] bg-gradient-to-r from-sky-400 to-cyan-300 opacity-80" />
                  <span className="font-note text-3xl text-sky-700">Ingeniero titulado</span>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Formación real en electrónica e ingeniería mecánica que se nota en cada explicación.</p>
                </div>
                <div className="stat-card">
                  <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-[2rem] bg-gradient-to-r from-rose-400 to-pink-400 opacity-80" />
                  <span className="font-note text-3xl text-rose-700">Explicación humana</span>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Paso a paso, con lenguaje cercano y ejemplos concretos, hasta que cada concepto encaja.</p>
                </div>
                <div className="stat-card">
                  <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-[2rem] bg-gradient-to-r from-amber-400 to-yellow-300 opacity-80" />
                  <span className="font-note text-3xl text-amber-700">100% adaptado</span>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Empezamos donde estás tú: refuerzo, exámenes, proyectos o cualquier bloqueo activo.</p>
                </div>
              </div>
            </motion.div>

            <motion.div style={{ y: heroCardY }} className="hero-card-wrap self-start pt-4 lg:pt-2">
              <TeacherProfileCard />
            </motion.div>
          </div>
        </section>

        <section id="sobre-mi" className="px-6 py-20 md:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Sobre mí"
              title="Formación de ingeniero, vocación de docente"
              description="Estudié electrónica e ingeniería mecánica, y encontré mi verdadera vocación en hacer que lo técnico resulte claro y accesible para cualquier nivel."
            />

            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <motion.div {...revealUp} className="surface-panel p-8 md:p-10">
                <div className="flex items-center gap-3 text-slate-900">
                  <div className="icon-chip">
                    <Heart className="h-5 w-5" />
                  </div>
                  <p className="font-display text-2xl font-bold">De los motores a las aulas</p>
                </div>

                <div className="mt-8 space-y-5 text-lg leading-8 text-slate-600">
                  <p>
                    Estudié <strong className="font-semibold text-slate-900">Ingeniería Electrónica Industrial</strong> e <strong className="font-semibold text-slate-900">Ingeniería Mecánica</strong>, así que me siento muy cómodo entre fórmulas, circuitos, mecanismos y problemas que parecen imposibles al principio.
                  </p>
                  <p>
                    Con el tiempo vi que disfrutaba aún más cuando ayudaba a otra persona a entender lo que estaba estudiando. Ahí apareció mi verdadera vocación: enseñar sin hacer sentir pequeño a nadie.
                  </p>
                  <p>
                    Mi objetivo no es solo que apruebes. Quiero que entiendas, ganes seguridad y salgas de cada clase con la sensación de "esto ya lo veo".
                  </p>
                </div>
              </motion.div>

              <motion.div {...revealUp} transition={{ ...revealUp.transition, delay: 0.08 }} className="surface-panel mini-grid p-8 md:p-10">
                <p className="font-note text-4xl text-sky-700">Cómo se siente una clase conmigo</p>
                <div className="mt-8 grid gap-3">
                  {['Estructura clara desde el minuto uno.', 'Ejemplos aterrizados y adaptados a tu nivel.', 'Seguimiento para que no te quedes solo entre clase y clase.'].map((item) => (
                    <div key={item} className="flex items-start gap-4 rounded-3xl bg-white/88 px-5 py-4 shadow-[0_2px_10px_-2px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.92)] ring-1 ring-slate-900/6 backdrop-blur">
                      <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-sky-500 to-rose-500" />
                      <p className="text-base leading-7 text-slate-700">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.75rem] bg-gradient-to-br from-slate-900 to-slate-950 px-6 py-6 text-white shadow-[0_22px_44px_-16px_rgba(15,23,42,0.5),inset_0_1px_0_rgba(255,255,255,0.07)]">
                    <p className="text-sm uppercase tracking-[0.18em] text-white/60">Especialidad</p>
                    <p className="mt-3 text-2xl font-semibold">STEM con explicación humana</p>
                  </div>
                  <div className="rounded-[1.75rem] bg-gradient-to-br from-amber-50 to-rose-100 px-6 py-6 text-slate-900 shadow-[0_8px_22px_-8px_rgba(244,114,182,0.18),inset_0_1px_0_rgba(255,255,255,0.92)] ring-1 ring-white/80">
                    <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Promesa</p>
                    <p className="mt-3 text-2xl font-semibold">Más claridad, menos ansiedad</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="que-enseno" className="px-6 py-20 md:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Qué enseño"
              title="Las materias que más cuestan, con la profundidad y la claridad que necesitan"
              description="Desde la ESO hasta la universidad, cada materia con el nivel adecuado, ejemplos del mundo real y una progresión concreta sin saltar pasos."
            />

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {subjects.map((subject, index) => (
                <motion.article key={subject.title} {...revealUp} transition={{ ...revealUp.transition, delay: index * 0.06 }} whileHover={shouldReduceMotion ? undefined : { y: -8, scale: 1.01 }} className="subject-card">
                  <div className={`absolute inset-0 rounded-[2rem] bg-gradient-to-br ${subject.accent}`} />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-4">
                      <div className={`icon-chip ${subject.accent.split(' ').at(-1) ?? ''}`}>
                        <subject.icon className="h-6 w-6" strokeWidth={1.9} />
                      </div>
                      <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 shadow-sm ring-1 ring-slate-900/6 backdrop-blur-sm">
                        Aula particular
                      </span>
                    </div>
                    <h3 className="font-display mt-8 text-3xl font-bold text-slate-950">{subject.title}</h3>
                    <p className="mt-4 text-base leading-7 text-slate-600">{subject.description}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {subject.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-white/65 px-3 py-1.5 text-sm font-medium text-slate-600 ring-1 ring-slate-900/8 backdrop-blur-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="como-enseno" className="px-6 py-20 md:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Cómo enseño"
              title="Un método pensado para que el bloqueo no dure y el avance se note desde el principio"
              description="Cada clase arranca donde estás tú, sin saltarse pasos ni hacer que parezca fácil lo que no lo es todavía."
            />

            <div className="grid gap-6 md:grid-cols-2">
              {methodology.map((item, index) => (
                <motion.article key={item.title} {...revealUp} transition={{ ...revealUp.transition, delay: index * 0.08 }} className="surface-panel lift-card p-7 md:p-8">
                  <span aria-hidden="true" className="font-display pointer-events-none absolute -right-2 -top-3 select-none text-[7rem] font-bold leading-none text-slate-900/[0.035]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex items-center gap-4">
                    <div className={`icon-chip ring-1 ${item.accent}`}>
                      <item.icon className="h-5 w-5" strokeWidth={1.9} />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-slate-950">{item.title}</h3>
                  </div>
                  <p className="mt-5 text-base leading-7 text-slate-600 md:text-lg">{item.description}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="recursos" className="px-6 py-20 md:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Recursos"
              title="Más allá de la pizarra: materiales, proyectos y recursos para aprender haciendo"
              description="Los apuntes, las rutinas y los proyectos prácticos que acompañan a las clases para que el aprendizaje tenga continuidad."
            />

            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
              <motion.div {...revealUp} className="surface-panel p-8 md:p-10">
                <p className="font-note text-4xl text-rose-700">Lo que acompaña a las clases</p>
                <div className="mt-8 space-y-4">
                  {resourcePoints.map((item) => (
                    <div key={item.title} className="rounded-[1.75rem] bg-white/85 px-5 py-5 shadow-[0_2px_10px_-2px_rgba(15,23,42,0.07),inset_0_1px_0_rgba(255,255,255,0.92)] ring-1 ring-slate-900/6 backdrop-blur">
                      <div className="flex items-center gap-3">
                        <div className="icon-chip">
                          <item.icon className="h-5 w-5" strokeWidth={1.9} />
                        </div>
                        <p className="font-display text-xl font-bold text-slate-900">{item.title}</p>
                      </div>
                      <p className="mt-3 text-base leading-7 text-slate-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div {...revealUp} transition={{ ...revealUp.transition, delay: 0.08 }} className="resource-stage">
                <div className="resource-window">
                  <div className="resource-window-bar">
                    <span className="dot bg-rose-400" />
                    <span className="dot bg-amber-400" />
                    <span className="dot bg-emerald-400" />
                  </div>
                  <div className="grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
                    <div className="rounded-[1.6rem] bg-gradient-to-br from-slate-900 to-slate-950 p-6 text-white shadow-[0_22px_50px_-16px_rgba(15,23,42,0.55),inset_0_1px_0_rgba(255,255,255,0.07)]">
                      <p className="text-sm uppercase tracking-[0.22em] text-white/45">Sesión ejemplo</p>
                      <p className="mt-4 text-3xl font-semibold">Problema, intuición, solución</p>
                      <p className="mt-4 text-sm leading-7 text-white/70">
                        Una clase no es solo resolver: primero entendemos qué ocurre, luego construimos el método y al final fijamos el aprendizaje con práctica útil.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="rounded-[1.6rem] bg-gradient-to-br from-sky-100 to-white px-5 py-6 shadow-[0_4px_16px_-4px_rgba(14,165,233,0.15),inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-sky-500/10">
                        <p className="font-note text-3xl text-sky-700">Esquemas limpios</p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">Más aire, mejor jerarquía y bloques que se entienden de un vistazo.</p>
                      </div>
                      <div className="rounded-[1.6rem] bg-gradient-to-br from-amber-100 to-white px-5 py-6 shadow-[0_4px_16px_-4px_rgba(245,158,11,0.15),inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-amber-500/10">
                        <p className="font-note text-3xl text-amber-700">Proyectos reales</p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">Electrónica, maker, programación y materiales creados para aprender haciendo.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="px-6 py-20 md:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Confianza"
              title="Una forma de trabajar clara, seria y fácil de seguir"
              description="La web puede ser visual y cercana, pero lo importante es que detrás haya una manera de enseñar consistente, ordenada y pensada para que avances de verdad."
            />

            <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
              <motion.div {...revealUp} className="surface-panel mini-grid p-8 md:p-10">
                <p className="font-note text-4xl text-sky-700">Por qué esta ayuda funciona</p>
                <div className="mt-8 grid gap-4">
                  {trustPillars.map((item, index) => (
                    <motion.article
                      key={item.title}
                      {...revealUp}
                      transition={{ ...revealUp.transition, delay: index * 0.06 }}
                      className="trust-card"
                    >
                      <div className={`absolute inset-0 rounded-[1.75rem] bg-gradient-to-br ${item.tone}`} />
                      <div className="relative z-10 flex items-start gap-4">
                        <div className={`icon-chip ${item.tone.split(' ').at(-1) ?? ''}`}>
                          <item.icon className="h-5 w-5" strokeWidth={1.9} />
                        </div>
                        <div>
                          <h3 className="font-display text-2xl font-bold text-slate-950">{item.title}</h3>
                          <p className="mt-3 text-base leading-7 text-slate-600">{item.description}</p>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </motion.div>

              <motion.div {...revealUp} transition={{ ...revealUp.transition, delay: 0.08 }} className="resource-window p-8 md:p-10">
                <div className="resource-window-bar">
                  <span className="dot bg-sky-400" />
                  <span className="dot bg-amber-400" />
                  <span className="dot bg-rose-400" />
                </div>
                <p className="font-note text-4xl text-rose-700">Cómo suelen funcionar las clases</p>
                <div className="mt-8 grid gap-4">
                  {classProcess.map((item) => (
                    <div key={item.step} className="process-step">
                      <div className="process-step-number">{item.step}</div>
                      <div>
                        <p className="font-display text-xl font-bold text-slate-950">{item.title}</p>
                        <p className="mt-2 text-base leading-7 text-slate-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-[1.75rem] bg-gradient-to-br from-slate-900 to-slate-950 px-6 py-6 text-white shadow-[0_22px_50px_-16px_rgba(15,23,42,0.55),inset_0_1px_0_rgba(255,255,255,0.07)]">
                  <p className="text-sm uppercase tracking-[0.2em] text-white/45">Encaja especialmente bien si...</p>
                  <div className="mt-4 grid gap-3 text-sm leading-7 text-white/78 sm:grid-cols-2">
                    <p className="trust-check">Te cuesta entender aunque estudies.</p>
                    <p className="trust-check">Necesitas preparar un examen con criterio.</p>
                    <p className="trust-check">Quieres reforzar base sin sentirte perdido.</p>
                    <p className="trust-check">Buscas una explicación técnica y cercana a la vez.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="px-6 py-20 md:px-8">
          <div className="mx-auto max-w-5xl">
            <SectionHeading
              eyebrow="Preguntas frecuentes"
              title="Objeciones habituales, respondidas con claridad"
              description="Si estás valorando pedir ayuda, estas son algunas de las dudas más normales antes de empezar."
            />

            <div className="grid gap-4">
              {faqItems.map((item, index) => (
                <motion.details
                  key={item.question}
                  {...revealUp}
                  transition={{ ...revealUp.transition, delay: index * 0.05 }}
                  className="faq-item"
                >
                  <summary className="faq-summary">
                    <span className="font-display text-xl font-bold text-slate-950">{item.question}</span>
                    <span aria-hidden="true" className="faq-symbol" />
                  </summary>
                  <p className="faq-answer">{item.answer}</p>
                </motion.details>
              ))}
            </div>

            <motion.div {...revealUp} transition={{ ...revealUp.transition, delay: 0.12 }} className="mt-10 flex justify-center">
              <button onClick={() => scrollTo('contacto')} className="button-secondary">
                Resolver mi caso concreto <ChevronDown className="h-4 w-4" />
              </button>
            </motion.div>
          </div>
        </section>

        <section id="contacto" className="px-6 pb-24 pt-20 md:px-8">
          <div className="mx-auto max-w-xl">
            <motion.div {...revealUp}>
              <ContactCard />
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="site-footer relative z-10 px-6 pb-10 pt-8 text-center text-sm text-slate-400 md:px-8">
        <p>
          Diseñado con <Heart className="mx-1 inline h-4 w-4 fill-current text-rose-500" /> para que la web transmita la misma calma y energía que una buena clase.
        </p>
      </footer>

      <Chatbot />
    </div>
    </>
  );
}
