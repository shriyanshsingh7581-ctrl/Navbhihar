import React, { useMemo, useState } from 'react';
import { PlayCircle } from 'lucide-react';
import { useNews } from '../context/NewsContext';
import { SEOHead } from '../components/SEOHead';
import { VideoNewsCard } from '../components/NewsCards';
import { VideoPlayerModal } from '../components/VideoPlayerModal';
import { VideoNewsItem } from '../types/news';

export function VideosPage() {
  const { videos } = useNews();
  const [filter, setFilter] = useState<'all' | 'horizontal' | 'vertical'>('all');
  const [activeVideo, setActiveVideo] = useState<VideoNewsItem | null>(null);

  const publishedVideos = useMemo(() => {
    const base = videos.filter((v) => v.status === 'published');
    if (filter === 'horizontal') return base.filter((v) => !v.isVertical);
    if (filter === 'vertical') return base.filter((v) => v.isVertical);
    return base;
  }, [videos, filter]);

  return (
    <>
      <SEOHead
        title="वीडियो न्यूज़ और मोबाइल शॉर्ट्स — NaviBihar India (NBI News)"
        description="बिहार और देश की ताज़ा वीडियो खबरें, ग्राउंड रिपोर्ट और 60 सेकंड के मोबाइल वर्टिकल शॉर्ट्स।"
        canonicalPath="/videos"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 mb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <PlayCircle className="w-8 h-8 text-[#C8102E] shrink-0" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
                वीडियो न्यूज़ (NBI Video Desk)
              </h1>
              <p className="text-sm text-slate-600">
                प्राइम वीडियो बुलेटिन, ग्राउंड रिपोर्ट और मोबाइल वर्टिकल न्यूज़ शॉर्ट्स
              </p>
            </div>
          </div>

          <div
            role="group"
            aria-label="वीडियो फ़िल्टर"
            className="inline-flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start"
          >
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-slate-950 text-white'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              सभी वीडियो
            </button>
            <button
              type="button"
              onClick={() => setFilter('horizontal')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                filter === 'horizontal'
                  ? 'bg-slate-950 text-white'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              प्राइम बुलेटिन (16:9)
            </button>
            <button
              type="button"
              onClick={() => setFilter('vertical')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                filter === 'vertical'
                  ? 'bg-slate-950 text-white'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              मोबाइल शॉर्ट्स (9:16)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {publishedVideos.map((vid) => (
            <VideoNewsCard
              key={vid.id}
              video={vid}
              onSelect={(selected) => setActiveVideo(selected)}
            />
          ))}
        </div>
      </main>

      <VideoPlayerModal
        video={activeVideo}
        onClose={() => setActiveVideo(null)}
      />
    </>
  );
}
