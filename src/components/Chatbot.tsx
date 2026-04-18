import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, X, Loader2 } from 'lucide-react';

function normalizeText(text: string) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function getFallbackReply(message: string) {
  const text = normalizeText(message);

  if (/(hola|buenas|hey|funciona|estas ahi)/.test(text)) {
    return 'Sí, aquí estoy. En esta versión publicada te respondo en modo local y puedo orientarte sobre contacto, materias y metodología.';
  }

  if (/(contact|correo|email|mail|whatsapp|hablar|escribir|reserv|profesor|clase)/.test(text)) {
    return 'Puedes contactar con Antonio desde la sección "Contacto" al final de la página. Ahí tienes acceso directo para escribirle y contarle tu caso.';
  }

  if (/(precio|precios|tarifa|coste|cuanto cuesta|cuanto vale)/.test(text)) {
    return 'El precio no aparece publicado en la web. Lo mejor es usar la sección "Contacto" y explicar asignatura, nivel y si buscas apoyo puntual o seguimiento continuo.';
  }

  if (/(online|presencial|videollamada|remoto)/.test(text)) {
    return 'La web indica un formato flexible y adaptado. Para confirmar disponibilidad online o presencial, lo mejor es escribir desde la sección "Contacto".';
  }

  if (/(matematic|fisic|quimic|tecnolog|program|ia|dam|eso|bachillerato|universidad)/.test(text)) {
    return 'Aula Fourier está orientada a Matemáticas, Física, Química, Tecnología, Programación e IA, con apoyo para ESO, Bachillerato, Universidad y ciclos técnicos.';
  }

  if (/(metodo|como ensena|como enseña|explica|aprendo|bloqueo|nivel)/.test(text)) {
    return 'El enfoque es claro y progresivo: detectar el bloqueo real, explicar con orden y ejemplos útiles, y avanzar a tu ritmo hasta que cada concepto encaje.';
  }

  return 'Ahora mismo el chat en vivo no está disponible en esta versión publicada, pero sí puedo orientarte de forma básica. Si quieres, pregúntame por materias, metodología o cómo contactar con Antonio.';
}

const WaveIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Wave Body (Background fill) */}
    <path d="M 10 55 Q 30 80, 50 50 T 90 45 Q 80 70, 50 70 T 10 55" fill="#bfdbfe" />

    {/* Wave Lines */}
    <path d="M 10 50 Q 30 70, 50 50 T 90 50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M 15 55 Q 30 75, 50 55 T 85 55" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M 10 60 Q 30 80, 50 60 T 90 60" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

    {/* Face */}
    <circle cx="45" cy="48" r="3" fill="currentColor" />
    <circle cx="55" cy="48" r="3" fill="currentColor" />
    <path d="M 47 52 Q 50 56, 53 52" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

    {/* Speech Bubble */}
    <path d="M 65 25 C 65 15, 95 15, 95 25 C 95 35, 80 35, 75 45 C 75 35, 65 35, 65 25 Z" fill="white" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <circle cx="73" cy="25" r="1.5" fill="currentColor" />
    <circle cx="80" cy="25" r="1.5" fill="currentColor" />
    <circle cx="87" cy="25" r="1.5" fill="currentColor" />

    {/* Pencil */}
    <g transform="translate(35, 30) rotate(-45)">
      <rect x="-4" y="-12" width="8" height="24" fill="#fde047" stroke="currentColor" strokeWidth="1.5" />
      <path d="M -4 -12 L 0 -20 L 4 -12 Z" fill="white" stroke="currentColor" strokeWidth="1.5" />
      <path d="M -1.5 -17 L 0 -20 L 1.5 -17 Z" fill="currentColor" />
      <rect x="-4" y="12" width="8" height="4" fill="#cbd5e1" stroke="currentColor" strokeWidth="1.5" />
    </g>

    {/* Sparkle */}
    <path d="M 60 35 L 61 38 L 64 39 L 61 40 L 60 43 L 59 40 L 56 39 L 59 38 Z" fill="#fde047" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
  </svg>
);

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: '¡Hola! Soy el asistente virtual de Aula Fourier. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    const shouldUseLocalFallback = window.location.hostname.endsWith('github.io');
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    if (shouldUseLocalFallback) {
      setMessages(prev => [
        ...prev,
        { role: 'model', text: getFallbackReply(userMessage) }
      ]);
      setIsLoading(false);
      return;
    }

    try {
      const history = messages
        .filter((m, idx) => !(idx === 0 && m.role === 'model'))
        .map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...history, { role: 'user', parts: [{ text: userMessage }] }]
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Error en la respuesta del servidor');
      }

      setMessages(prev => [
        ...prev,
        { role: 'model', text: data.text || 'Lo siento, no pude procesar eso.' }
      ]);
    } catch (error) {
      console.error('Error calling chat API:', error);
      setMessages(prev => [
        ...prev,
        { role: 'model', text: 'Ups, parece que hubo un error de conexión. ¿Puedes intentarlo de nuevo?' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            data-chatbot="true"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed inset-x-4 bottom-22 z-50 flex h-[min(500px,68vh)] w-auto flex-col overflow-hidden rounded-[2rem] border border-white/80 bg-white/92 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:inset-x-auto sm:right-6 sm:w-[90vw] sm:max-w-[380px] sm:bottom-24"
          >
            {/* Header */}
            <div className="chatbot-header bg-sky-50/90 p-4 border-b border-slate-900/6 flex justify-between items-center rounded-t-[2rem]">
              <div className="flex items-center gap-2">
                <WaveIcon className="w-8 h-8 text-sky-700" />
                <span className="chatbot-title font-bold text-slate-900 font-sans">Asistente Fourier</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="chatbot-close text-slate-500 hover:text-slate-700 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`chatbot-bubble max-w-[85%] p-3 rounded-xl ring-1 ring-slate-900/6 ${
                    msg.role === 'user' ? 'chatbot-bubble-user bg-sky-50 text-slate-800' : 'chatbot-bubble-model bg-white text-slate-800'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="chatbot-bubble chatbot-bubble-model max-w-[85%] p-3 rounded-xl ring-1 ring-slate-900/6 bg-white text-slate-800 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Pensando...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="chatbot-composer p-4 border-t border-slate-900/6 bg-white/90 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Pregúntame algo..."
                className="chatbot-input flex-1 bg-transparent outline-none font-sans"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="p-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 ring-1 ring-sky-500/20 rounded-full disabled:opacity-50 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-white/80 bg-white/92 text-sky-700 shadow-[0_12px_30px_-14px_rgba(15,23,42,0.28)] backdrop-blur-xl sm:bottom-6 sm:right-6 sm:h-16 sm:w-16"
      >
        <WaveIcon className="h-10 w-10 sm:h-12 sm:w-12" />
      </motion.button>
    </>
  );
};

export default Chatbot;
