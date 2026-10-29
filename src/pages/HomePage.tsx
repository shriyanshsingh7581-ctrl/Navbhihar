import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { useNews } from '../context/NewsContext';
import { SEOHead } from '../components/SEOHead';
import {
  CompactNewsCard,
  FeaturedHeroCard,
  TrendingRankCard,
  VerticalEditorialCard,
  VideoNewsCard,
} from '../components/NewsCards';
import { VideoPlayerModal } from '../components/VideoPlayerModal';
import { BiharSubSection, VideoNewsItem } from '../types/news';

const BIHAR_SUB_SECTIONS: BiharSubSection[] = [
  'all',
  'बिहार की ताज़ा खबरें',
  'बिहार राजनीति',
  'बिहार शिक्षा',
  'बिहार रोजगार',
  'बिहार क्राइम',
  'बिहार के प्रमुख शहरों की खबरें',
];

const BIHAR_CITIES = ['सभी शहर', 'अररिया', 'पटना', 'पूर्णिया', 'गया', 'मुजफ्फरपुर', 'भागलपुर', 'दरभंगा'];

const HOMEPAGE_CATEGORY_SECTIONS = [
  { slug: 'india', title: 'भारत (National News)' },
  { slug: 'politics', title: 'राजनीति (Politics)' },
  { slug: 'education', title: 'शिक्षा (Education)' },
  { slug: 'employment', title: 'रोजगार (Employment)' },
  { slug: 'sports', title: 'खेल (Sports)' },
  { slug: 'entertainment', title: 'मनोरंजन (Entertainment)' },
  { slug: 'technology', title: 'टेक्नोलॉजी (Technology)' },
  { slug: 'business', title: 'बिजनेस (Business)' },
];

export function HomePage() {
  const { publishedArticles, videos, settings } = useNews();
  const [selectedBiharTab, setSelectedBiharTab] = useState<BiharSubSection>('all');
  const [selectedCity, setSelectedCity] = useState<string>('सभी शहर');
  const [activeVideo, setActiveVideo] = useState<VideoNewsItem | null>(null);

  const featuredArticle = useMemo(() => {
    return (
      publishedArticles.find((a) => a.isFeatured) ||
      publishedArticles[0]
    );
  }, [publishedArticles]);

  const latestArticles = useMemo(() => {
    if (!featuredArticle) return publishedArticles.slice(0, 6);
    return publishedArticles
      .filter((a) => a.id !== featuredArticle.id)
      .slice(0, 6);
  }, [publishedArticles, featuredArticle]);

  const trendingArticles = useMemo(() => {
    const explicitTrending = publishedArticles
      .filter((a) => a.isTrending)
      .sort((a, b) => (a.trendingRank || 99) - (b.trendingRank || 99));
    if (explicitTrending.length >= 5) return explicitTrending.slice(0, 5);
    return [...publishedArticles]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);
  }, [publishedArticles]);

  const biharArticles = useMemo(() => {
    const base = publishedArticles.filter(
      (a) =>
        a.category === 'bihar' ||
        Boolean(a.subCategory) ||
        ['पटना', 'गया', 'मुजफ्फरपुर', 'भागलपुर', 'दरभंगा', 'पूर्णिया', 'राजगीर', 'समस्तीपुर'].includes(
          a.city || ''
        )
    );

    const byTab =
      selectedBiharTab === 'all'
        ? base
        : base.filter(
            (a) =>
              a.subCategory === selectedBiharTab ||
              (selectedBiharTab === 'बिहार राजनीति' && a.category === 'politics') ||
              (selectedBiharTab === 'बिहार शिक्षा' && a.category === 'education') ||
              (selectedBiharTab === 'बिहार रोजगार' && a.category === 'employment') ||
              (selectedBiharTab === 'बिहार क्राइम' && a.category === 'crime')
          );

    if (selectedCity === 'सभी शहर') {
      return byTab.length > 0 ? byTab.slice(0, 6) : base.slice(0, 6);
    }
    const cityMatches = byTab.filter((a) =>
      (a.city || '' + a.title + a.content).includes(selectedCity)
    );
    return cityMatches.length > 0 ? cityMatches : byTab.slice(0, 4);
  }, [publishedArticles, selectedBiharTab, selectedCity]);

  const publishedVideos = useMemo(
    () => videos.filter((v) => v.status === 'published').slice(0, 4),
    [videos]
  );

  return (
    <>
      <SEOHead
        title="NaviBihar India (NBI News) — बिहार और देश की ताज़ा खबरें, राजनीति, शिक्षा और रोजगार"
        description="बिहार और देश की ताज़ा खबरें - NaviBihar India (NBI News) प्रीमियम डिजिटल न्यूज़ पोर्टल। राजनीति, क्राइम, शिक्षा, रोजगार, खेल और मनोरंजन की विश्वसनीय खबरें।"
        canonicalPath="/"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 space-y-12">
        {/* Optional Admin-Controlled Special Coverage Banner */}
        {settings.bannerActive && settings.bannerTitle && (
          <div className="bg-slate-950 text-white rounded-xl px-4 py-3 sm:px-6 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-slate-800">
            <div className="text-xs sm:text-sm font-medium text-slate-200">
              <span className="font-extrabold text-[#EF4444] mr-2">
                विशेष कवरेज:
              </span>
              <span>{settings.bannerTitle}</span>
            </div>
            {settings.bannerLink && (
              <Link
                to={settings.bannerLink}
                className="inline-flex items-center gap-1 text-xs font-bold text-white hover:text-red-400 whitespace-nowrap shrink-0"
              >
                <span>विस्तार से देखें</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        )}

        {/* Section 1: 3-Tier Editorial Front Page Grid (Featured Hero + Latest News + Popular News) */}
        <section aria-label="प्रमुख समाचार और ताज़ा खबरें">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left & Center Column (8 cols on lg): Featured Hero + Latest News */}
            <div className="lg:col-span-8 space-y-8">
              {featuredArticle && <FeaturedHeroCard article={featuredArticle} />}

              {/* Latest News Section ("ताज़ा खबरें") */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-950 tracking-tight">
                    ताज़ा खबरें
                  </h2>
                  <Link
                    to="/latest"
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#C8102E] hover:underline whitespace-nowrap shrink-0"
                  >
                    <span>सभी ताज़ा खबरें</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="divide-y divide-slate-200/80">
                  {latestArticles.map((article) => (
                    <CompactNewsCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (4 cols on lg): Popular / Most Read News */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 sm:p-6">
                <div className=" pb-3 mb-4 border-b border-slate-200">
                  <h2 className="text-lg font-extrabold text-slate-950 tracking-tight">
                    सबसे ज्यादा पढ़ी जाने वाली खबरें
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    पाठकों के बीच आज की सबसे चर्चित खबरें
                  </p>
                </div>

                <div>
                  {trendingArticles.map((article, idx) => (
                    <TrendingRankCard
                      key={article.id}
                      article={article}
                      rank={idx + 1}
                    />
                  ))}
                </div>
              </div>

              {/* Quick Bihar District Bulletin Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-3">
                  बिहार के प्रमुख शहर
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['अररिया', 'पटना', 'पूर्णिया', 'गया', 'मुजफ्फरपुर', 'भागलपुर', 'दरभंगा', 'समस्तीपुर'].map(
                    (city) => (
                      <Link
                        key={city}
                        to={`/search?q=${encodeURIComponent(city)}`}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#C8102E] hover:text-white text-xs font-semibold text-slate-800 transition-colors min-h-[36px] flex items-center"
                      >
                        {city}
                      </Link>
                    )
                  )}
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* Section 2: Dedicated Bihar News Section ("बिहार विशेष") */}
        <section
          aria-label="बिहार विशेष समाचार"
          className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 lg:p-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 mb-5 border-b border-slate-200">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#C8102E] mb-1">
                BIHAR SPECIAL COVERAGE
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950">
                बिहार की खबरें — राजनीति, शिक्षा, रोजगार और शहर
              </h2>
            </div>
            <Link
              to="/category/bihar"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#C8102E] hover:underline whitespace-nowrap shrink-0"
            >
              <span>बिहार पेज खोलें</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Interactive Bihar Sub-Section Filter Controls */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-3 mb-3">
            {BIHAR_SUB_SECTIONS.map((tab) => {
              const active = selectedBiharTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSelectedBiharTab(tab)}
                  className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 min-h-[40px] ${
                    active
                      ? 'bg-[#C8102E] text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {tab === 'all' ? 'सभी बिहार खबरें' : tab}
                </button>
              );
            })}
          </div>

          {/* Interactive Bihar City Filter Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-4 mb-5 border-b border-slate-200/80">
            <span className="text-xs font-bold text-slate-500 mr-1 whitespace-nowrap">
              शहर चुनें:
            </span>
            {BIHAR_CITIES.map((city) => {
              const active = selectedCity === city;
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => setSelectedCity(city)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 min-h-[34px] ${
                    active
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
                  }`}
                >
                  {city}
                </button>
              );
            })}
          </div>

          {/* Bihar News Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {biharArticles.map((article) => (
              <VerticalEditorialCard key={article.id} article={article} />
            ))}
          </div>
        </section>

        {/* Section 3: Video News Section ("वीडियो न्यूज़") */}
        <section
          aria-label="वीडियो न्यूज़"
          className="bg-slate-950 text-white rounded-2xl p-4 sm:p-6 lg:p-8"
        >
          <div className="flex items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <PlayCircle className="w-6 h-6 text-[#EF4444] shrink-0" />
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  वीडियो न्यूज़ और मोबाइल शॉर्ट्स
                </h2>
                <p className="text-xs text-slate-400">
                  ग्राउंड रिपोर्ट, प्राइम बुलेटिन और 60 सेकंड के वर्टिकल न्यूज़ वीडियो
                </p>
              </div>
            </div>
            <Link
              to="/videos"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-red-400 hover:text-red-300 whitespace-nowrap shrink-0"
            >
              <span>सभी वीडियो देखें</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {publishedVideos.map((vid) => (
              <VideoNewsCard
                key={vid.id}
                video={vid}
                onSelect={(selected) => setActiveVideo(selected)}
              />
            ))}
          </div>
        </section>

        {/* Section 4: Dedicated Category Blocks (National, Politics, Education, Employment, Sports, Entertainment, Tech, Business) */}
        <section aria-label="कैटेगरी के अनुसार समाचार">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {HOMEPAGE_CATEGORY_SECTIONS.map((sec) => {
              const catArticles = publishedArticles.filter(
                (a) => a.category.toLowerCase() === sec.slug.toLowerCase()
              );
              const displayList =
                catArticles.length > 0
                  ? catArticles.slice(0, 3)
                  : publishedArticles.slice(0, 2);

              return (
                <div
                  key={sec.slug}
                  className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
                      <h2 className="text-lg font-extrabold text-slate-950">
                        {sec.title}
                      </h2>
                      <Link
                        to={`/category/${sec.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#C8102E] hover:underline whitespace-nowrap shrink-0"
                      >
                        <span>View All · सभी देखें</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <div className="divide-y divide-slate-200/80">
                      {displayList.map((article) => (
                        <CompactNewsCard key={article.id} article={article} />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <VideoPlayerModal
        video={activeVideo}
        onClose={() => setActiveVideo(null)}
      />
    </>
  );
}
