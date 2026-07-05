import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App.tsx';

// Creamos una instancia de QueryClient para manejar el caché de las peticiones
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Evita peticiones duplicadas al cambiar de pestaña
      retry: 1, // Limita los reintentos en caso de error de red
      staleTime: 5 * 60 * 1000, // Los datos se consideran frescos por 5 minutos
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
