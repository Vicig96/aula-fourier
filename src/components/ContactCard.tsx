import { Mail } from 'lucide-react';
import { SiGithub, SiWhatsapp } from '@icons-pack/react-simple-icons';

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor">
    <title>LinkedIn</title>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

async function openContact(type: 'email' | 'whatsapp') {
  const res = await fetch(`/api/contact/${type}`);
  const { url } = await res.json() as { url: string };
  if (type === 'whatsapp') {
    window.open(url, '_blank', 'noopener,noreferrer');
  } else {
    window.location.href = url;
  }
}

const socialLinks = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/antonio-viciana-g%C3%A1lvez-a4930b23b',
    icon: LinkedinIcon,
    onClick: undefined as undefined | (() => void),
  },
  {
    label: 'GitHub',
    href: 'https://github.com/Vicig96',
    icon: SiGithub,
    onClick: undefined as undefined | (() => void),
  },
  {
    label: 'WhatsApp',
    href: '#',
    icon: SiWhatsapp,
    onClick: () => openContact('whatsapp'),
  },
];

export default function ContactCard() {
  return (
    <div className="cc3d-parent">
      <div className="cc3d-card">
        <div className="cc3d-logo">
          <span className="cc3d-circle cc3d-circle1" />
          <span className="cc3d-circle cc3d-circle2" />
          <span className="cc3d-circle cc3d-circle3" />
          <span className="cc3d-circle cc3d-circle4" />
          <span className="cc3d-circle cc3d-circle5">
            <Mail className="h-5 w-5 cc3d-icon" strokeWidth={1.8} />
          </span>
        </div>
        <div className="cc3d-glass" />
        <div className="cc3d-content">
          <span className="cc3d-eyebrow">CONTACTO</span>
          <h2 className="cc3d-title">Hablemos. Cuéntame qué necesitas y lo organizamos.</h2>
          <p className="cc3d-text">
            Ya sea un examen que se acerca, una asignatura que no avanza o un proyecto técnico: escríbeme y vemos cómo ayudarte. Sin compromiso, sin rodeos.
          </p>
          <button
            onClick={() => openContact('email')}
            className="cc3d-email-btn"
            title="Enviar correo"
            type="button"
          >
            <Mail className="h-4 w-4 shrink-0" />
          </button>
          <p className="cc3d-hint">Respondo en menos de 24 h · Sin permanencia · Primera sesión sin compromiso</p>
        </div>
        <div className="cc3d-bottom">
          <div className="cc3d-socials">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.onClick ? undefined : '_blank'}
                  rel={link.onClick ? undefined : 'noopener noreferrer'}
                  className="cc3d-social-btn"
                  title={link.label}
                  onClick={link.onClick ? (e) => { e.preventDefault(); link.onClick!(); } : undefined}
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
