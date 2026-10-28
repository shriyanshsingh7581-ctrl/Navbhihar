/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { NewsProvider } from './context/NewsContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HomePage } from './pages/HomePage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { CategoryPage } from './pages/CategoryPage';
import { VideosPage } from './pages/VideosPage';
import { SearchPage } from './pages/SearchPage';
import { InfoPage } from './pages/InfoPage';
import { AdminPage } from './pages/AdminPage';

function ScrollToTopOnNavigate() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <NewsProvider>
      <BrowserRouter>
        <ScrollToTopOnNavigate />
        <div className="min-h-screen flex flex-col bg-white text-slate-900">
          <Header />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/news/:slug" element={<ArticleDetailPage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/latest" element={<CategoryPage />} />
              <Route path="/categories" element={<CategoryPage />} />
              <Route path="/videos" element={<VideosPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/info/:slug" element={<InfoPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </div>
          <Footer />
          <MobileBottomNav />
        </div>
      </BrowserRouter>
    </NewsProvider>
  );
}
