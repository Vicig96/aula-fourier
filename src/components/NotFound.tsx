export default function NotFound() {
  return (
    <section style={{
      padding: '40px 0',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Arvo', serif",
    }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Arvo&display=swap" />
      <div style={{ textAlign: 'center', maxWidth: 600, width: '100%', padding: '0 20px' }}>
        <div style={{
          backgroundImage: 'url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)',
          height: 400,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <h1 style={{
            fontSize: 80,
            fontWeight: 700,
            color: '#16324f',
            margin: 0,
            fontFamily: "'Arvo', serif",
          }}>404</h1>
        </div>

        <div style={{ marginTop: -50 }}>
          <h3 style={{
            fontSize: 28,
            fontWeight: 700,
            color: '#16324f',
            margin: '0 0 12px',
            fontFamily: "'Arvo', serif",
          }}>
            Parece que te has perdido
          </h3>
          <p style={{ color: '#4a6fa5', marginBottom: 24, fontSize: 16 }}>
            La página que buscas no existe.
          </p>
          <a
            href="/"
            style={{
              color: '#fff',
              padding: '12px 28px',
              background: '#39ac31',
              display: 'inline-block',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 15,
              textDecoration: 'none',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#2e8f27')}
            onMouseLeave={e => (e.currentTarget.style.background = '#39ac31')}
          >
            Ir al inicio
          </a>
        </div>
      </div>
    </section>
  );
}
