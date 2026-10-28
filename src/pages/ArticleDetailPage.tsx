import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Copy,
  Share2,
} from 'lucide-react';
import { useNews } from '../context/NewsContext';
import { SEOHead } from '../components/SEOHead';
import { EditorialImage, BrandLogo } from '../components/EditorialImage';
import { TrendingRankCard, VerticalEditorialCard } from '../components/NewsCards';
import { formatHindiDate } from '../utils/formatters';

export function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { articles, publishedArticles, getCategoryName } = useNews();
  const [copied, setCopied] = useState(false);
  const [fontScale, setFontScale] = useState<'normal' | 'large' | 'xlarge'>('normal');

  const article = useMemo(() => {
    return (
      articles.find((a) => a.slug === slug || a.id === slug) ||
      publishedArticles[0]
    );
  }, [articles, publishedArticles, slug]);

  const currentIndex = useMemo(() => {
    if (!article) return -1;
    return publishedArticles.findIndex((a) => a.id === article.id);
  }, [publishedArticles, article]);

  const prevArticle =
    currentIndex > 0 ? publishedArticles[currentIndex - 1] : null;
  const nextArticle =
    currentIndex >= 0 && currentIndex < publishedArticles.length - 1
      ? publishedArticles[currentIndex + 1]
      : null;

  const relatedArticles = useMemo(() => {
    if (!article) return [];
    const sameCategory = publishedArticles.filter(
      (a) => a.category === article.category && a.id !== article.id
    );
    const others = publishedArticles.filter(
      (a) => a.category !== article.category && a.id !== article.id
    );
    return [...sameCategory, ...others].slice(0, 3);
  }, [publishedArticles, article]);

  const trendingArticles = useMemo(() => {
    return [...publishedArticles]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);
  }, [publishedArticles]);

  if (!article) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-3">
          यह खबर उपलब्ध नहीं है
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          आपके द्वारा खोजी गई खबर हटाई जा चुकी है या इसका लिंक बदल गया है।
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#C8102E] text-white text-sm font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>होम पेज पर लौटें</span>
        </Link>
      </main>
    );
  }

  const categoryName = getCategoryName(article.category);
  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/news/${article.slug}`
      : `https://navibiharindia.com/news/${article.slug}`;
  const shareText = `${article.title} - NaviBihar India (NBI News)`;

  const whatsappShareHref = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${shareText}\n${shareUrl}`
  )}`;
  const facebookShareHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    shareUrl
  )}`;
  const twitterShareHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText
  )}&url=${encodeURIComponent(shareUrl)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const paragraphs = article.content
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const proseSizeClass =
    fontScale === 'xlarge'
      ? 'text-xl leading-loose'
      : fontScale === 'large'
        ? 'text-lg leading-relaxed'
        : 'text-base sm:text-[17px] leading-relaxed';

  return (
    <>
      <SEOHead
        title={article.title}
        description={article.description}
        canonicalPath={`/news/${article.slug}`}
        ogImage={article.featuredImage}
        ogType="article"
        article={article}
        breadcrumbs={[
          { name: 'होम', path: '/' },
          { name: categoryName, path: `/category/${article.category}` },
          { name: article.title, path: `/news/${article.slug}` },
        ]}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto no-scrollbar py-2 mb-4 border-b border-slate-200"
        >
          <Link to="/" className="hover:text-[#C8102E] font-medium whitespace-nowrap">
            होम
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <Link
            to={`/category/${article.category}`}
            className="hover:text-[#C8102E] font-semibold text-slate-700 whitespace-nowrap"
          >
            {categoryName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-400 truncate max-w-[220px] sm:max-w-md">
            {article.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Article Column (8 cols on desktop) */}
          <article className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-4 sm:p-7 lg:p-8">
            {/* Unboxed Category & Location Kicker */}
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-bold text-[#C8102E] mb-3">
              <Link to={`/category/${article.category}`} className="hover:underline">
                {categoryName}
              </Link>
              {article.subCategory && (
                <>
                  <span aria-hidden="true" className="text-slate-300">
                    ·
                  </span>
                  <span className="text-slate-700">{article.subCategory}</span>
                </>
              )}
              {article.city && (
                <>
                  <span aria-hidden="true" className="text-slate-300">
                    ·
                  </span>
                  <span className="text-slate-800">{article.city}</span>
                </>
              )}
            </div>

            {/* Full Hindi Headline */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 leading-snug mb-4">
              {article.title}
            </h1>

            {/* Short Description / Summary Deck */}
            <p className="text-base sm:text-lg font-medium text-slate-700 leading-relaxed pb-5 mb-5 border-b border-slate-200">
              {article.description}
            </p>

            {/* Byline, Timestamps & Reader Font Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <BrandLogo size="sm" />
                <div className="text-xs sm:text-sm">
                  <div className="font-bold text-slate-900">{article.author}</div>
                  <div className="text-slate-500 flex flex-wrap items-center gap-1.5 mt-0.5">
                    <span>प्रकाशित: {formatHindiDate(article.publishedAt)}</span>
                    <span aria-hidden="true">·</span>
                    <span>अपडेटेड: {formatHindiDate(article.publishedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Reader Font Size Controls + Share Bar */}
              <div className="flex items-center gap-2 flex-wrap">
                <div
                  role="group"
                  aria-label="अक्षर का आकार बदलें"
                  className="inline-flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200"
                >
                  <button
                    type="button"
                    onClick={() => setFontScale('normal')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                      fontScale === 'normal'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    अ
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontScale('large')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                      fontScale === 'large'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    अ+
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontScale('xlarge')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                      fontScale === 'xlarge'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    अ++
                  </button>
                </div>
              </div>
            </div>

            {/* Social Sharing Strip */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
                <Share2 className="w-3.5 h-3.5" />
                शेयर करें:
              </span>
              <a
                href={whatsappShareHref}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition-colors min-h-[38px] inline-flex items-center"
              >
                WhatsApp
              </a>
              <a
                href={facebookShareHref}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-bold transition-colors min-h-[38px] inline-flex items-center"
              >
                Facebook
              </a>
              <a
                href={twitterShareHref}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors min-h-[38px] inline-flex items-center"
              >
                X / Twitter
              </a>
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors min-h-[38px] inline-flex items-center gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">लिंक कॉपी हो गया!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>

            {/* Featured Image & Caption */}
            <figure className="mb-7">
              <div className="aspect-16/9 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                <EditorialImage
                  src={article.featuredImage}
                  alt={article.title}
                  category={article.category}
                  priority={true}
                  className="w-full h-full object-cover"
                />
              </div>
              <figcaption className="text-xs text-slate-500 mt-2 leading-relaxed">
                {article.imageCaption ||
                  `${article.title} — (फोटो साभार: NaviBihar India / NBI News)`}
              </figcaption>
            </figure>

            {/* Full Hindi Article Body Content */}
            <div className={`hindi-article-prose max-w-2xl ${proseSizeClass}`}>
              {paragraphs.map((para, idx) => {
                const isSubheading =
                  para.length < 95 &&
                  idx > 0 &&
                  !para.endsWith('।') &&
                  !para.endsWith('.');
                if (isSubheading) {
                  return <h2 key={idx}>{para}</h2>;
                }
                return <p key={idx}>{para}</p>;
              })}
            </div>

            {/* Bottom Share Callout */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                बिहार और देश की ताज़ा खबरों के लिए जुड़े रहें <strong>NaviBihar India (NBI News)</strong> के साथ।
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={whatsappShareHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-[#16A34A] text-white text-xs font-bold"
                >
                  WhatsApp पर शेयर करें
                </a>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 text-slate-800 text-xs font-bold"
                >
                  {copied ? 'कॉपी हो गया' : 'लिंक कॉपी करें'}
                </button>
              </div>
            </div>

            {/* Previous & Next Article Navigation */}
            <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevArticle ? (
                <Link
                  to={`/news/${prevArticle.slug}`}
                  className="p-4 rounded-xl border border-slate-200 hover:border-[#C8102E] transition-colors group"
                >
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-500 mb-1">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>पिछली खबर (Previous)</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 group-hover:text-[#C8102E] line-clamp-2">
                    {prevArticle.title}
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {nextArticle && (
                <Link
                  to={`/news/${nextArticle.slug}`}
                  className="p-4 rounded-xl border border-slate-200 hover:border-[#C8102E] transition-colors text-right group"
                >
                  <div className="flex items-center justify-end gap-1 text-xs font-bold text-slate-500 mb-1">
                    <span>अगली खबर (Next)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-sm font-bold text-slate-900 group-hover:text-[#C8102E] line-clamp-2">
                    {nextArticle.title}
                  </div>
                </Link>
              )}
            </div>
          </article>

          {/* Desktop Right Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h2 className="text-lg font-extrabold text-slate-950 pb-3 mb-4 border-b border-slate-200">
                सबसे ज्यादा पढ़ी जाने वाली खबरें
              </h2>
              <div>
                {trendingArticles.map((item, idx) => (
                  <TrendingRankCard
                    key={item.id}
                    article={item}
                    rank={idx + 1}
                  />
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Related News Section ("संबंधित खबरें") */}
        <section aria-label="संबंधित खबरें" className="mt-12">
          <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-200">
            <h2 className="text-xl font-extrabold text-slate-950">
              संबंधित खबरें (Related News)
            </h2>
            <Link
              to={`/category/${article.category}`}
              className="text-xs sm:text-sm font-bold text-[#C8102E] hover:underline"
            >
              {categoryName} की और खबरें देखें
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {relatedArticles.map((rel) => (
              <VerticalEditorialCard key={rel.id} article={rel} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
