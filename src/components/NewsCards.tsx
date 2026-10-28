import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Play } from 'lucide-react';
import { EditorialImage } from './EditorialImage';
import { NewsArticle, VideoNewsItem } from '../types/news';
import { formatHindiDate, formatRelativeHindiTime } from '../utils/formatters';
import { useNews } from '../context/NewsContext';

export function FeaturedHeroCard({ article }: { article: NewsArticle }) {
  const { getCategoryName } = useNews();
  const categoryLabel = getCategoryName(article.category);

  return (
    <article className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      <Link to={`/news/${article.slug}`} className="block group">
        {/* Large 16:9 Featured Image Above Headline on Mobile */}
        <div className="relative aspect-16/9 w-full overflow-hidden bg-slate-900">
          <EditorialImage
            src={article.featuredImage}
            alt={article.title}
            category={article.category}
            priority={true}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
          />
        </div>

        {/* Content Block */}
        <div className="p-4 sm:p-6">
          {/* Clean Unboxed Metadata Kicker */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#C8102E] mb-2">
            <span>{categoryLabel}</span>
            {article.city && (
              <>
                <span aria-hidden="true" className="text-slate-300">
                  ·
                </span>
                <span className="text-slate-700">{article.city}</span>
              </>
            )}
            <span aria-hidden="true" className="text-slate-300">
              ·
            </span>
            <time
              dateTime={article.publishedAt}
              className="text-slate-500 font-medium"
            >
              {formatHindiDate(article.publishedAt)}
            </time>
          </div>

          {/* Bold Hindi Headline */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-950 leading-snug group-hover:text-[#C8102E] transition-colors mb-3">
            {article.title}
          </h1>

          {/* Short Description */}
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed line-clamp-3 mb-4">
            {article.description}
          </p>

          {/* Read More Link */}
          <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#C8102E] group-hover:underline">
            <span>पूरी खबर पढ़ें (Read More)</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </Link>
    </article>
  );
}

export function CompactNewsCard({ article }: { article: NewsArticle }) {
  const { getCategoryName } = useNews();
  const categoryLabel = getCategoryName(article.category);

  return (
    <article className="py-4 first:pt-0 last:pb-0 border-b border-slate-200/80 last:border-b-0">
      <Link
        to={`/news/${article.slug}`}
        className="flex items-start gap-3.5 sm:gap-4 group"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <span className="font-bold text-[#C8102E]">{categoryLabel}</span>
            {article.city && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-slate-600 font-medium">{article.city}</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <time dateTime={article.publishedAt}>
              {formatRelativeHindiTime(article.publishedAt)}
            </time>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-[#C8102E] transition-colors line-clamp-2 mb-1.5">
            {article.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-2">
            {article.description}
          </p>

          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-800 group-hover:text-[#C8102E]">
            <span>आगे पढ़ें</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="w-28 h-21 sm:w-36 sm:h-25 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60">
          <EditorialImage
            src={article.featuredImage}
            alt={article.title}
            category={article.category}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
      </Link>
    </article>
  );
}

export function VerticalEditorialCard({ article }: { article: NewsArticle }) {
  const { getCategoryName } = useNews();
  const categoryLabel = getCategoryName(article.category);

  return (
    <article className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-colors">
      <Link to={`/news/${article.slug}`} className="block group flex-1 flex flex-col">
        <div className="aspect-16/9 w-full overflow-hidden bg-slate-100 border-b border-slate-100">
          <EditorialImage
            src={article.featuredImage}
            alt={article.title}
            category={article.category}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
              <span className="font-bold text-[#C8102E]">{categoryLabel}</span>
              {article.city && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{article.city}</span>
                </>
              )}
              <span aria-hidden="true">·</span>
              <time dateTime={article.publishedAt}>
                {formatRelativeHindiTime(article.publishedAt)}
              </time>
            </div>
            <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-[#C8102E] transition-colors line-clamp-2 mb-2">
              {article.title}
            </h3>
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
              {article.description}
            </p>
          </div>
          <div className="inline-flex items-center gap-1 text-xs font-bold text-[#C8102E]">
            <span>पूरी खबर पढ़ें</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </Link>
    </article>
  );
}

export function TrendingRankCard({
  article,
  rank,
}: {
  article: NewsArticle;
  rank: number;
}) {
  const { getCategoryName } = useNews();

  return (
    <article className="py-3.5 first:pt-0 last:pb-0 border-b border-slate-200/80 last:border-b-0">
      <Link
        to={`/news/${article.slug}`}
        className="flex items-start gap-3.5 group"
      >
        <span className="text-2xl font-extrabold text-[#C8102E] tabular-nums leading-none pt-0.5 w-7 shrink-0">
          {String(rank).padStart(2, '0')}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1">
            <span className="font-bold text-slate-700">
              {getCategoryName(article.category)}
            </span>
            <span aria-hidden="true">·</span>
            <span>{formatRelativeHindiTime(article.publishedAt)}</span>
          </div>
          <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug group-hover:text-[#C8102E] transition-colors line-clamp-2">
            {article.title}
          </h4>
        </div>

        <div className="w-20 h-15 rounded-md overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60">
          <EditorialImage
            src={article.featuredImage}
            alt={article.title}
            category={article.category}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>
    </article>
  );
}

export function VideoNewsCard({
  video,
  onSelect,
}: {
  video: VideoNewsItem;
  onSelect: (video: VideoNewsItem) => void;
}) {
  const { getCategoryName } = useNews();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between group">
      <button
        type="button"
        onClick={() => onSelect(video)}
        className="text-left w-full flex-1 flex flex-col justify-between focus:outline-none"
      >
        <div
          className={`relative w-full overflow-hidden bg-slate-950 ${
            video.isVertical ? 'aspect-9/16 max-h-80' : 'aspect-16/9'
          }`}
        >
          <EditorialImage
            src={video.thumbnailUrl}
            alt={video.title}
            category={video.category}
            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-[#C8102E] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
          </div>
          <div className="absolute bottom-2.5 right-2.5 text-xs font-mono tabular-nums font-bold text-white bg-black/80 px-2 py-0.5 rounded-xs">
            {video.duration}
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
              <span className="text-red-400 font-bold">
                {getCategoryName(video.category)}
              </span>
              <span aria-hidden="true">·</span>
              <span>{video.isVertical ? 'मोबाइल शॉर्ट्स (9:16)' : 'वीडियो बुलेटिन'}</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white leading-snug group-hover:text-red-400 transition-colors line-clamp-2">
              {video.title}
            </h3>
          </div>
        </div>
      </button>
    </div>
  );
}
