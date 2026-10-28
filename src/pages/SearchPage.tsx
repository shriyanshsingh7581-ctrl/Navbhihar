import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useNews } from '../context/NewsContext';
import { SEOHead } from '../components/SEOHead';
import { CompactNewsCard } from '../components/NewsCards';

const POPULAR_SEARCH_SUGGESTIONS = [
  'पटना मेट्रो',
  'BPSC शिक्षक भर्ती',
  'बिहार राजनीति',
  'रोजगार',
  'मुजफ्फरपुर',
  'साइबर क्राइम',
  'राजगीर क्रिकेट स्टेडियम',
  'मखाना निवेश',
];

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [queryText, setQueryText] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { publishedArticles, categories, getCategoryName } = useNews();

  useEffect(() => {
    const qParam = searchParams.get('q') || '';
    if (qParam !== queryText) {
      setQueryText(qParam);
    }
  }, [searchParams]);

  const handleInputChange = (val: string) => {
    setQueryText(val);
    if (val.trim()) {
      setSearchParams({ q: val });
    } else {
      setSearchParams({});
    }
  };

  const results = useMemo(() => {
    const term = queryText.trim().toLowerCase();
    return publishedArticles.filter((article) => {
      if (
        selectedCategory !== 'all' &&
        article.category.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }
      if (!term) return true;
      const catHindi = getCategoryName(article.category).toLowerCase();
      const haystack = [
        article.title,
        article.description,
        article.content,
        article.category,
        catHindi,
        article.subCategory || '',
        article.city || '',
        article.slug,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [publishedArticles, queryText, selectedCategory, getCategoryName]);

  return (
    <>
      <SEOHead
        title={
          queryText.trim()
            ? `"${queryText}" सर्च रिजल्ट्स — NaviBihar India`
            : 'खबरें खोजें (Search News) — NaviBihar India'
        }
        description="हिंदी या अंग्रेजी कीवर्ड से बिहार और देश की खबरें, जिलेवार समाचार और कैटेगरी खोजें।"
        canonicalPath="/search"
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs mb-8">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950 mb-3">
            खबरें खोजें (Search News)
          </h1>

          {/* Search Input Box */}
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="search"
              value={queryText}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="हिंदी या English में कीवर्ड लिखें (जैसे: पटना मेट्रो, BPSC, Bihar, रोजगार)..."
              aria-label="खबरें खोजें"
              className="w-full pl-11 pr-11 py-3.5 rounded-xl border border-slate-300 focus:border-[#C8102E] focus:outline-none text-sm sm:text-base text-slate-900 bg-slate-50/60"
            />
            {queryText && (
              <button
                type="button"
                onClick={() => handleInputChange('')}
                aria-label="सर्च साफ करें"
                className="absolute right-2.5 min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Search Suggestions */}
          <div className="mt-4">
            <div className="text-xs font-bold text-slate-500 mb-2">
              चर्चित कीवर्ड (Search Suggestions):
            </div>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_SEARCH_SUGGESTIONS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleInputChange(item)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors min-h-[34px] ${
                    queryText === item
                      ? 'bg-[#C8102E] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Filter by Category */}
          <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 min-h-[34px] ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              सभी कैटेगरी
            </button>
            {categories
              .filter((c) => c.isActive)
              .map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 min-h-[34px] ${
                    selectedCategory === cat.slug
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
          </div>
        </div>

        {/* Search Results List or Empty State */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-950">
              {queryText.trim()
                ? `"${queryText}" के लिए परिणाम (${results.length})`
                : `सभी प्रकाशित खबरें (${results.length})`}
            </h2>
          </div>

          {results.length > 0 ? (
            <div className="divide-y divide-slate-200/80">
              {results.map((art) => (
                <CompactNewsCard key={art.id} article={art} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="text-lg font-bold text-slate-900 mb-1">
                कोई परिणाम नहीं मिला (No matching news found)
              </div>
              <p className="text-sm text-slate-600 max-w-md mx-auto mb-5">
                कृपया कोई दूसरा शब्द खोजें या ऊपर दिए गए चर्चित कीवर्ड पर क्लिक करें।
              </p>
              <button
                type="button"
                onClick={() => {
                  handleInputChange('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2.5 rounded-lg bg-[#C8102E] text-white text-xs font-bold"
              >
                सभी खबरें दिखाएं
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
