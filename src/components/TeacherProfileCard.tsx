import styled from 'styled-components';

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  .card {
    width: 300px;
    height: 300px;
    background: white;
    border-radius: 32px;
    padding: 3px;
    position: relative;
    box-shadow: #604b4a30 0px 70px 30px -50px;
    transition: all 0.5s ease-in-out;
  }

  [data-theme="dark"] & .card {
    background: #1a1f2e;
    box-shadow: rgba(0, 0, 0, 0.5) 0px 70px 30px -50px;
  }

  .card .mail {
    position: absolute;
    right: 2rem;
    top: 1.4rem;
    background: transparent;
    border: none;
    cursor: pointer;
    z-index: 10;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card .mail svg {
    stroke: #fbb9b6;
    stroke-width: 3px;
    transition: stroke 0.2s;
  }

  [data-theme="dark"] & .card .mail svg {
    stroke: #f87171;
  }

  .card .mail svg:hover {
    stroke: #f55d56;
  }

  .card .profile-pic {
    position: absolute;
    width: 82%;
    height: 82%;
    top: 2%;
    left: 9%;
    border-radius: 29px;
    z-index: 1;
    border: 0px solid #fbb9b6;
    overflow: hidden;
    transition: all 0.5s ease-in-out 0.2s, z-index 0.5s ease-in-out 0.2s;
  }

  [data-theme="dark"] & .card .profile-pic {
    filter: brightness(0.88) contrast(1.05);
  }

  .card .profile-pic img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center center;
    transform-origin: 50% 50%;
    transition: all 0.5s ease-in-out 0s;
  }

  .card .bottom {
    position: absolute;
    bottom: 3px;
    left: 3px;
    right: 3px;
    background: #bae6fd;
    background: linear-gradient(135deg, #7dd3fc 0%, #bae6fd 100%);
    top: 80%;
    border-radius: 29px;
    z-index: 2;
    box-shadow: rgba(14, 165, 233, 0.18) 0px 5px 5px 0px inset;
    overflow: hidden;
    transition: all 0.5s cubic-bezier(0.645, 0.045, 0.355, 1) 0s;
  }

  [data-theme="dark"] & .card .bottom {
    background: linear-gradient(135deg, #0c4a6e 0%, #0f3759 100%);
    box-shadow: rgba(0, 0, 0, 0.3) 0px 5px 5px 0px inset;
  }

  .card .bottom .content {
    position: absolute;
    bottom: 0;
    left: 1.5rem;
    right: 1.5rem;
    height: 160px;
  }

  .card .bottom .content .name {
    display: block;
    font-size: 1.2rem;
    color: #0c4a6e;
    font-weight: bold;
  }

  [data-theme="dark"] & .card .bottom .content .name {
    color: #e0f2fe;
  }

  .card .bottom .content .about-me {
    display: block;
    font-size: 0.9rem;
    color: #0369a1;
    margin-top: 1rem;
  }

  [data-theme="dark"] & .card .bottom .content .about-me {
    color: #7dd3fc;
  }

  .card .bottom .bottom-bottom {
    position: absolute;
    bottom: 1rem;
    left: 1.5rem;
    right: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .card .bottom .bottom-bottom .social-links-container {
    display: flex;
    gap: 1rem;
  }

  .card .bottom .bottom-bottom .social-links-container svg {
    height: 20px;
    fill: #0369a1;
    filter: drop-shadow(0 5px 5px rgba(14, 165, 233, 0.18));
    transition: fill 0.2s, transform 0.2s;
    cursor: pointer;
  }

  [data-theme="dark"] & .card .bottom .bottom-bottom .social-links-container svg {
    fill: #7dd3fc;
    filter: drop-shadow(0 5px 5px rgba(56, 189, 248, 0.2));
  }

  .card .bottom .bottom-bottom .social-links-container svg:hover {
    fill: #0ea5e9;
    transform: scale(1.2);
  }

  [data-theme="dark"] & .card .bottom .bottom-bottom .social-links-container svg:hover {
    fill: #38bdf8;
  }

  .card .bottom .bottom-bottom .button {
    background: white;
    color: #0ea5e9;
    border: none;
    border-radius: 20px;
    font-size: 0.6rem;
    padding: 0.4rem 0.6rem;
    box-shadow: rgba(14, 165, 233, 0.18) 0px 5px 5px 0px;
    cursor: pointer;
    text-decoration: none;
    font-weight: 600;
    transition: background 0.2s, color 0.2s;
  }

  [data-theme="dark"] & .card .bottom .bottom-bottom .button {
    background: rgba(255, 255, 255, 0.1);
    color: #e0f2fe;
    box-shadow: rgba(56, 189, 248, 0.18) 0px 5px 5px 0px;
  }

  .card .bottom .bottom-bottom .button:hover {
    background: #0ea5e9;
    color: white;
  }

  [data-theme="dark"] & .card .bottom .bottom-bottom .button:hover {
    background: #0284c7;
    color: white;
  }

  .card:hover {
    border-top-left-radius: 55px;
  }

  .card:hover .bottom {
    top: 20%;
    border-radius: 80px 29px 29px 29px;
    transition: all 0.5s cubic-bezier(0.645, 0.045, 0.355, 1) 0.2s;
  }

  .card:hover .profile-pic {
    width: 100px;
    height: 100px;
    aspect-ratio: 1;
    top: 10px;
    left: 10px;
    border-radius: 50%;
    z-index: 3;
    border: 7px solid #7dd3fc;
    box-shadow: rgba(14, 165, 233, 0.25) 0px 5px 5px 0px;
    transition: all 0.5s ease-in-out, z-index 0.5s ease-in-out 0.1s;
  }

  [data-theme="dark"] & .card:hover .profile-pic {
    border-color: #0ea5e9;
  }

  .card:hover .profile-pic:hover {
    transform: scale(1.3);
    border-radius: 0px;
  }

  .card:hover .profile-pic img {
    transform: scale(1.5);
    transition: all 0.5s ease-in-out 0.5s;
  }
`;

export default function TeacherProfileCard() {
  const profileImageSrc = `${import.meta.env.BASE_URL}antonio.jpg`;

  return (
    <StyledWrapper>
      <div className="card">
        <a className="mail" href="#contacto" aria-label="Contactar">
          <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect width={20} height={16} x={2} y={4} rx={2} />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </a>

        <div className="profile-pic">
          <img src={profileImageSrc} alt="Antonio Viciana" />
        </div>

        <div className="bottom">
          <div className="content">
            <span className="name">Antonio Viciana</span>
            <span className="about-me">Ingeniero y docente STEM · Explico hasta que se entiende</span>
          </div>
          <div className="bottom-bottom">
            <div className="social-links-container">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z" /></svg>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" /></svg>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" /></svg>
            </div>
            <a href="#contacto" className="button">Contáctame</a>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}
