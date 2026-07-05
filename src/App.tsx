import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FavoritesProvider } from './favorites/presentation/context/FavoritesContext';
import { Sidebar } from './shared/components/Sidebar';
import { Navbar } from './shared/components/Navbar';
import { ErrorBoundary } from './shared/components/ErrorBoundary';
import HomePage from './home/presentation/HomePage';
import CharactersPage from './characters/presentation/pages/CharactersPage';
import CharacterDetailPage from './characters/presentation/pages/CharacterDetailPage';
import EpisodesPage from './episodes/presentation/pages/EpisodesPage';
import EpisodeDetailPage from './episodes/presentation/pages/EpisodeDetailPage';
import LocationsPage from './locations/presentation/pages/LocationsPage';
import LocationDetailPage from './locations/presentation/pages/LocationDetailPage';
import FavoritesPage from './favorites/presentation/pages/FavoritesPage';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <FavoritesProvider>
      <BrowserRouter>
        <div className="flex flex-col h-screen bg-background text-on-background selection:bg-primary/30 selection:text-primary overflow-hidden">
          {/* Header / Navbar superior */}
          <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />

          {/* Área inferior de contenido y navegación lateral */}
          <div className="flex flex-1 overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} />

            {/* Pantalla o página activa */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/characters" element={<CharactersPage />} />
                  <Route path="/character/:id" element={<CharacterDetailPage />} />
                  <Route path="/episodes" element={<EpisodesPage />} />
                  <Route path="/episode/:id" element={<EpisodeDetailPage />} />
                  <Route path="/locations" element={<LocationsPage />} />
                  <Route path="/location/:id" element={<LocationDetailPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  {/* Redirección por defecto */}
                  <Route path="*" element={<HomePage />} />
                </Routes>
              </ErrorBoundary>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </FavoritesProvider>
  );
}

export default App;
