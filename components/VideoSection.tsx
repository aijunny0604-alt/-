import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, X } from 'lucide-react';
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

  if (items.length === 0) return null;

  return (
    <section className="relative z-10 bg-neutral-950 text-white px-6 md:px-20 py-32">
      <div className="max-w-full mx-auto">
        {/* Section Header */}
        <div className="flex items-end gap-4 mb-24">
          <Play className="w-10 h-10 md:w-14 md:h-14 text-red-500 mb-2" />
          <h2 className="text-5xl md:text-9xl font-serif leading-none">Video Reel</h2>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((item, idx) => {
            const videoId = getYouTubeId(item.url);
            const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
            const isPlaying = playingId === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group"
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
                          className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Play className="w-7 h-7 md:w-9 md:h-9 text-white ml-1" fill="white" />
                        </motion.div>
                      </div>
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                  )}
                </div>

                {/* Video Info */}
                <div className="mt-4">
                  <h3 className="text-lg md:text-xl font-serif mb-1">{item.title}</h3>
                  {item.description && (
                    <p className="text-sm text-neutral-400">{item.description}</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
