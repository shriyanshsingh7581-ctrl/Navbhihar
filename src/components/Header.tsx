import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  ShieldCheck,
  X,
  ChevronRight,
  PlayCircle,
  Newspaper,
  Phone,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { BrandLogo } from './EditorialImage';
import { useNews } from '../context/NewsContext';
import { getTodayHindiHeaderDate } from '../utils/formatters';

export function Header() {
  const { categories, publishedArticles, settings, isAdmin } = useNews();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const activeCategorySlug = location.pathname.startsWith('/category/')
    ? location.pathname.replace('/category/', '')
    : location.pathname === '/'
      ? 'home'
      : '';

  const breakingArticles = publishedArticles.filter((a) => a.isBreaking);
  const tickerItems =
    breakingArticles.length > 0
      ? breakingArticles.map((a) => ({
          id: a.id,
          text: a.title,
          slug: a.slug,
        }))
      : settings.breakingNewsTicker
          .split('|')
          .map((item, idx) => ({
            id: `ticker-${idx}`,
            text: item.trim(),
            slug: '',
          }))
          .filter((i) => i.text.length > 0);

  return (
    <>
      {/* Main Sticky Top Header (Compact 52px on mobile to honor 15% sticky cap) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 h-13 md:h-16">
          {/* Zone 1: Brand Lockup (Official Logo + Single-line Brand Title) */}
          <Link
            to="/"
            className="flex items-center gap-2.5 whitespace-nowrap shrink-0 focus:outline-none"
          >
            <BrandLogo size="sm" className="md:w-12 md:h-12" />
            <span className="text-lg md:text-xl font-extrabold tracking-tight text-slate-950 whitespace-nowrap shrink-0">
              NavBihar <span className="text-[#C8102E]">India News</span>
            </span>
          </Link>

          {/* Zone 2: Desktop Primary Editorial Links (4-5 concise single-line links) */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-700"
          >
            <Link
              to="/"
              className="hover:text-[#C8102E] transition-colors whitespace-nowrap shrink-0"
            >
              होम
            </Link>
            <Link
              to="/category/bihar"
              className="hover:text-[#C8102E] transition-colors whitespace-nowrap shrink-0"
            >
              बिहार विशेष
            </Link>
            <Link
              to="/latest"
              className="hover:text-[#C8102E] transition-colors whitespace-nowrap shrink-0"
            >
              ताज़ा खबरें
            </Link>
            <Link
              to="/videos"
              className="hover:text-[#C8102E] transition-colors whitespace-nowrap shrink-0"
            >
              वीडियो न्यूज़
            </Link>
            <Link
              to="/admin"
              className="hover:text-[#C8102E] transition-colors whitespace-nowrap shrink-0"
            >
              एडमिन पैनल
            </Link>
          </nav>

          {/* Zone 3: Primary Action / Mobile Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => navigate('/search')}
              aria-label="खबरें खोजें"
              className="min-h-[44px] min-w-[44px] md:min-w-0 md:px-3.5 md:py-2 flex items-center justify-center gap-2 text-xs font-semibold text-slate-800 hover:text-[#C8102E] md:bg-slate-100 md:hover:bg-slate-200/80 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <Search className="w-5 h-5 md:w-4 md:h-4" />
              <span className="hidden md:inline">खबरें खोजें</span>
            </button>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="मेनू खोलें"
              className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-900 hover:text-[#C8102E] rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Horizontally Scrollable Category Navigation Strip */}
      <div className="bg-slate-950 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between gap-4">
          <div
            role="navigation"
            aria-label="समाचार कैटेगरी"
            className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1.5"
          >
            <Link
              to="/"
              className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 min-h-[36px] flex items-center ${
                activeCategorySlug === 'home'
                  ? 'bg-[#C8102E] text-white'
                  : 'text-slate-200 hover:text-white hover:bg-slate-800'
              }`}
            >
              होम
            </Link>
            {categories
              .filter((c) => c.isActive)
              .map((cat) => {
                const isActive = activeCategorySlug === cat.slug;
                return (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 min-h-[36px] flex items-center ${
                      isActive
                        ? 'bg-[#C8102E] text-white'
                        : 'text-slate-200 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {cat.name}
                  </Link>
                );
              })}
          </div>

          <div className="hidden lg:flex items-center gap-3 text-xs text-slate-300 whitespace-nowrap shrink-0">
            <span>अररिया, बिहार</span>
            <span aria-hidden="true">·</span>
            <span>संपर्क: {settings.contactPhone || '9162432466'}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-400">{getTodayHindiHeaderDate()}</span>
          </div>
        </div>
      </div>

      {/* Red Breaking News Strip */}
      {settings.breakingNewsActive && tickerItems.length > 0 && (
        <div className="bg-[#C8102E] text-white border-b border-red-900/30 overflow-hidden">
          <div className="max-w-7xl mx-auto flex items-center h-9 sm:h-10 px-3 sm:px-6">
            <div className="bg-slate-950 text-white text-[11px] sm:text-xs font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-xs shrink-0 mr-3">
              BREAKING NEWS
            </div>
            <div className="relative flex-1 overflow-hidden">
              <div className="animate-nbi-ticker items-center gap-8 text-xs sm:text-sm font-medium">
                {[...tickerItems, ...tickerItems].map((item, idx) =>
                  item.slug ? (
                    <Link
                      key={`${item.id}-${idx}`}
                      to={`/news/${item.slug}`}
                      className="hover:underline whitespace-nowrap shrink-0 inline-flex items-center gap-3"
                    >
                      <span>{item.text}</span>
                      <span aria-hidden="true" className="text-red-200">
                        |
                      </span>
                    </Link>
                  ) : (
                    <span
                      key={`${item.id}-${idx}`}
                      className="whitespace-nowrap shrink-0 inline-flex items-center gap-3"
                    >
                      <span>{item.text}</span>
                      <span aria-hidden="true" className="text-red-200">
                        |
                      </span>
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="relative w-[86%] max-w-xs bg-white h-full overflow-y-auto shadow-2xl flex flex-col justify-between z-10">
            <div>
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-950 text-white">
                <div className="flex items-center gap-3">
                  <BrandLogo size="md" />
                  <div>
                    <div className="font-extrabold text-base leading-tight">
                      NavBihar India News
                    </div>
                    <div className="text-[11px] text-slate-300">
                      NBI · अररिया और बिहार की आवाज
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="मेनू बंद करें"
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-300 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs text-slate-700 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-[#C8102E]" />
                  Araria, Bihar
                </span>
                <a
                  href={`tel:${settings.contactPhone || '9162432466'}`}
                  className="inline-flex items-center gap-1 font-bold text-[#C8102E]"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {settings.contactPhone || '9162432466'}
                </a>
              </div>

              <div className="p-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
                  प्रमुख सेक्शन
                </div>
                <div className="space-y-0.5">
                  <Link
                    to="/"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-900 hover:bg-slate-100 min-h-[44px]"
                  >
                    <span className="flex items-center gap-2.5">
                      <Newspaper className="w-4 h-4 text-[#C8102E]" />
                      होम पेज
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                  <Link
                    to="/videos"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-900 hover:bg-slate-100 min-h-[44px]"
                  >
                    <span className="flex items-center gap-2.5">
                      <PlayCircle className="w-4 h-4 text-[#C8102E]" />
                      वीडियो न्यूज़ बुलेटिन
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                </div>

                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 pt-4 pb-2">
                  समाचार कैटेगरी
                </div>
                <div className="grid grid-cols-2 gap-1.5 px-1">
                  {categories
                    .filter((c) => c.isActive)
                    .map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/category/${cat.slug}`}
                        onClick={() => setDrawerOpen(false)}
                        className="px-3 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-800 hover:border-[#C8102E] hover:text-[#C8102E] transition-colors min-h-[44px] flex items-center"
                      >
                        {cat.name}
                      </Link>
                    ))}
                </div>

                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 pt-4 pb-2">
                  आधिकारिक सोशल मीडिया
                </div>
                <div className="grid grid-cols-2 gap-1.5 px-1 text-xs font-bold">
                  <a
                    href={settings.whatsappChannelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-between"
                  >
                    <span>WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={settings.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2.5 rounded-lg bg-red-50 text-red-800 border border-red-200 flex items-center justify-between"
                  >
                    <span>YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={settings.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 flex items-center justify-between"
                  >
                    <span>Facebook</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2.5 rounded-lg bg-pink-50 text-pink-800 border border-pink-200 flex items-center justify-between"
                  >
                    <span>Instagram</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
              <Link
                to="/admin"
                onClick={() => setDrawerOpen(false)}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-[#C8102E] text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#a50d25] transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {isAdmin ? 'एडमिन डैशबोर्ड खोलें' : 'Admin Login (ID / Password)'}
                </span>
              </Link>
              <p className="text-[11px] text-center text-slate-500">
                © NavBihar India News (NBI). All Rights Reserved.
              </p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
