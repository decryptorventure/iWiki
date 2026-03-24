import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import '@frontend-team/ui-kit/style.css';
import '@frontend-team/tiptap-kit/styles.css';
import { TooltipProvider, Toaster } from '@frontend-team/ui-kit';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TooltipProvider>
      <App />
      <Toaster />
    </TooltipProvider>
  </StrictMode>
);
