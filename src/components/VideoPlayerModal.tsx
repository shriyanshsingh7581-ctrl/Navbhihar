import React from 'react';
import { X } from 'lucide-react';
import { VideoNewsItem } from '../types/news';
import { useNews } from '../context/NewsContext';
import { formatHindiDate } from '../utils/formatters';

interface VideoPlayerModalProps {
  video: VideoNewsItem | null;
  onClose: () => void;
}

export function VideoPlayerModal({ video, onClose }: VideoPlayerModalProps) {
  const { getCategoryName } = useNews();
  if (!video) return null;

  const isYouTube =
    video.videoUrl.includes('youtube.com/embed') ||
    video.videoUrl.includes('youtu.be');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xs"
    >
      <div
        className={`relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl w-full ${
          video.isVertical ? 'max-w-sm' : 'max-w-3xl'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950 text-white">
          <div className="flex items-center gap-2 text-xs text-slate-300 truncate">
            <span className="font-bold text-red-400">
              {getCategoryName(video.category)}
            </span>
            <span aria-hidden="true">·</span>
            <span>{video.duration}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="वीडियो बंद करें"
            className="min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-300 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          className={`w-full bg-black ${
            video.isVertical ? 'aspect-9/16 max-h-[68vh] mx-auto' : 'aspect-16/9'
          }`}
        >
          {isYouTube ? (
            <iframe
              src={video.videoUrl}
              title={video.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={video.videoUrl}
              poster={video.thumbnailUrl}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            >
              आपका ब्राउज़र वीडियो प्लेबैक सपोर्ट नहीं करता है।
            </video>
          )}
        </div>

        <div className="p-4 sm:p-5 text-white">
          <h2 className="text-base sm:text-lg font-bold leading-snug mb-1.5">
            {video.title}
          </h2>
          {video.summary && (
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-2">
              {video.summary}
            </p>
          )}
          <div className="text-xs text-slate-400">
            प्रकाशित: {formatHindiDate(video.publishedAt)}
          </div>
        </div>
      </div>
    </div>
  );
}
