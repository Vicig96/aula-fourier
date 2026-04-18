import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import NotFound from './components/NotFound.tsx';
import './index.css';

function trimTrailingSlash(value: string) {
  return value.length > 1 && value.endsWith('/') ? value.slice(0, -1) : value;
}

const currentPath = trimTrailingSlash(window.location.pathname);
const basePath = trimTrailingSlash(import.meta.env.BASE_URL);
const isRoot = currentPath === '/' || currentPath === '' || currentPath === basePath;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isRoot ? <App /> : <NotFound />}
  </StrictMode>,
);
