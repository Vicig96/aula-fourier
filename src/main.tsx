import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import NotFound from './components/NotFound.tsx';
import './index.css';

const isRoot = window.location.pathname === '/' || window.location.pathname === '';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isRoot ? <App /> : <NotFound />}
  </StrictMode>,
);
