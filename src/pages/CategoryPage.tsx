import React, { useMemo } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useNews } from '../context/NewsContext';
import { SEOHead } from '../components/SEOHead';
import {
  CompactNewsCard,
  FeaturedHeroCard,
  TrendingRankCard,
  VerticalEditorialCard,
} from '../components/NewsCards';

export function CategoryPage() {
  const { slug } = useParams<{ slug?: string }>();
  const location = useLocation();
  const { categories, publishedArticles } = useNews();

  const isLatestRoute = location.pathname === '/latest';
  const isAllCategoriesRoute = location.pathname === '/categories';

  const currentCategory = useMemo(() => {
    if (isLatestRoute || isAllCategoriesRoute || !slug) return null;
    return categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase()) || null;
  }, [categories, slug, isLatestRoute, isAllCategoriesRoute]);

  const filteredArticles = useMemo(() => {
    if (isLatestRoute || !slug) return publishedArticles;
    const byCat = publishedArticles.filter(
      (a) => a.category.toLowerCase() === slug.toLowerCase()
    );
    return byCat;
  }, [publishedArticles, slug, isLatestRoute]);

  const trendingArticles = useMemo(
    () =>
      [...publishedArticles]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5),
    [publishedArticles]
  );

  if (isAllCategoriesRoute) {
    return (
      <>
        <SEOHead
          title="सभी समाचार कैटेगरी — NaviBihar India (NBI News)"
          description="बिहार, भारत, राजनीति, क्राइम, शिक्षा, रोजगार, खेल, मनोरंजन, टेक्नोलॉजी, बिजनेस और वायरल समाचार कैटेगरी।"
          canonicalPath="/categories"
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
          <div className="pb-4 mb-6 border-b border-slate-200">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              सभी समाचार सेक्शन (Categories)
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              अपनी पसंद का विषय चुनें और पढ़ें ताज़ा व प्रामाणिक खबरें
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories
              .filter((c) => c.isActive)
              .map((cat) => {
                const count = publishedArticles.filter(
                  (a) => a.category === cat.slug
                ).length;
                return (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    className="bg-white border border-slate-200 hover:border-[#C8102E] rounded-xl p-5 flex flex-col justify-between transition-colors group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-extrabold text-slate-950 group-hover:text-[#C8102E] transition-colors">
                          {cat.name}
                        </h2>
                        <span className="text-xs font-semibold text-slate-400 tabular-nums">
                          {count} खबरें
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                        {cat.description}
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-1 text-xs font-bold text-[#C8102E]">
                      <span>{cat.name} पेज खोलें</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </Link>
                );
              })}
          </div>
        </main>
      </>
    );
  }

  const pageTitle = isLatestRoute
    ? 'ताज़ा खबरें (Latest News)'
    : currentCategory
      ? `${currentCategory.name} समाचार`
      : `${slug} समाचार`;

  const pageDescription = isLatestRoute
    ? 'बिहार और देश की सभी ताज़ा खबरें सबसे पहले NaviBihar India (NBI News) पर पढ़ें।'
    : currentCategory?.description ||
      `${pageTitle} से जुड़ी सभी ताज़ा और विश्वसनीय खबरें।`;

  const leadStory = filteredArticles[0];
  const remainingStories = filteredArticles.slice(1);

  return (
    <>
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        canonicalPath={isLatestRoute ? '/latest' : `/category/${slug}`}
        breadcrumbs={[
          { name: 'होम', path: '/' },
          {
            name: pageTitle,
            path: isLatestRoute ? '/latest' : `/category/${slug}`,
          },
        ]}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-slate-500 py-2 mb-4 border-b border-slate-200"
        >
          <Link to="/" className="hover:text-[#C8102E] font-medium">
            होम
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800">{pageTitle}</span>
        </nav>

        <div className="pb-4 mb-6 border-b border-slate-200">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
            {pageTitle}
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            {pageDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-8">
            {leadStory ? (
              <>
                <FeaturedHeroCard article={leadStory} />
                {remainingStories.length > 0 && (
                  <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 divide-y divide-slate-200/80">
                    {remainingStories.map((art) => (
                      <CompactNewsCard key={art.id} article={art} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
                <h2 className="text-lg font-bold text-slate-900 mb-2">
                  इस सेक्शन में अभी कोई खबर प्रकाशित नहीं है
                </h2>
                <p className="text-sm text-slate-600 mb-5">
                  आप नीचे अन्य प्रमुख सेक्शन की ताज़ा खबरें पढ़ सकते हैं:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  {publishedArticles.slice(0, 4).map((art) => (
                    <VerticalEditorialCard key={art.id} article={art} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h2 className="text-lg font-extrabold text-slate-950 pb-3 mb-4 border-b border-slate-200">
                सबसे ज्यादा पढ़ी जाने वाली खबरें
              </h2>
              <div>
                {trendingArticles.map((art, idx) => (
                  <TrendingRankCard
                    key={art.id}
                    article={art}
                    rank={idx + 1}
                  />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
