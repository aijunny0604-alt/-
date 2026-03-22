import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { VideoItem } from '../types';

interface VideoSectionProps {
  items: VideoItem[];
}

const getYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

const VideoSection: React.FC<VideoSectionProps> = ({ items }) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (items.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.firstElementChild?.clientWidth || 400;
    const gap = 24;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -(cardWidth + gap) : (cardWidth + gap),
      behavior: 'smooth',
    });
  };

  return (
    <section className="relative z-10 bg-neutral-950 text-white py-32 overflow-hidden">
      <div className="px-6 md:px-20">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-16">
          <div className="flex items-end gap-4">
            <Play className="w-10 h-10 md:w-14 md:h-14 text-red-500 mb-2" />
            <h2 className="text-5xl md:text-9xl font-serif leading-none">Video Reel</h2>
          </div>
          {/* Navigation Arrows */}
          <div className="hidden md:flex gap-3">
            <button
              onClick={() => scroll('left')}
              className="p-3 border border-white/20 rounded-full hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-3 border border-white/20 rounded-full hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto px-6 md:px-20 pb-4 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item) => {
          const videoId = getYouTubeId(item.url);
          const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
          const isPlaying = playingId === item.id;

          return (
            <motion.div
              key={item.id}
              className="flex-shrink-0 w-[85vw] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-start group"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative aspect-video bg-neutral-800 rounded-lg overflow-hidden shadow-2xl">
                {isPlaying && videoId ? (
                  <>
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                      style={{ border: 'none' }}
                    />
                    <button
                      onClick={() => setPlayingId(null)}
                      className="absolute top-3 right-3 z-10 p-1.5 bg-black/60 hover:bg-black/80 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </>
                ) : (
                  <div
                    className="relative w-full h-full cursor-pointer"
                    onClick={() => setPlayingId(item.id)}
                  >
                    <img
                      src={thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        className="w-14 h-14 md:w-16 md:h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Play className="w-6 h-6 md:w-7 md:h-7 text-white ml-1" fill="white" />
                      </motion.div>
                    </div>
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                )}
              </div>

              {/* Video Info */}
              <div className="mt-3">
                <h3 className="text-base md:text-lg font-serif mb-1 truncate">{item.title}</h3>
                {item.description && (
                  <p className="text-xs text-neutral-400 truncate">{item.description}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default VideoSection;
