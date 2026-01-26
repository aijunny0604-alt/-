import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DesignItem } from '../types';
import { X, Palette, ArrowUpRight, Maximize2 } from 'lucide-react';
import Lightbox from './Lightbox';

interface DesignSectionProps {
  items: DesignItem[];
}

const DesignSection: React.FC<DesignSectionProps> = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState<DesignItem | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const designImages = items.map(item => item.image);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleLightboxNext = () => {
    setLightboxIndex((prev) => (prev + 1) % designImages.length);
  };

  const handleLightboxPrev = () => {
    setLightboxIndex((prev) => (prev - 1 + designImages.length) % designImages.length);
  };

  return (
    <section id="design" className="relative z-10 bg-neutral-50 px-6 md:px-20 py-32 border-t border-neutral-200">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-6">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-5 h-5 text-neutral-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
              Graphic Design
            </span>
          </div>
          <h2 className="text-4xl md:text-7xl font-serif text-neutral-900 leading-tight">
            Design<br />Portfolio
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-neutral-500 text-sm md:text-base max-w-sm text-right"
        >
          포스터, 앨범 커버, 브랜드 아이덴티티 등 다양한 그래픽 디자인 작업물입니다.
        </motion.p>
      </div>

      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="break-inside-avoid relative group cursor-pointer"
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => setSelectedItem(item)}
          >
            <div className="relative overflow-hidden rounded-lg bg-neutral-200">
              {/* Image */}
              <motion.img
                src={item.image}
                alt={item.title}
                className="w-full h-auto object-cover"
                style={{
                  filter: hoveredId === item.id ? 'brightness(0.7)' : 'brightness(1)',
                  transform: hoveredId === item.id ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />

              {/* Hover Overlay */}
              <motion.div
                className="absolute inset-0 flex flex-col justify-end p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredId === item.id ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Category Badge */}
                <span className="absolute top-4 left-4 text-[10px] font-mono uppercase tracking-widest text-white/80 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
                  {item.category}
                </span>

                {/* Arrow Icon */}
                <motion.div
                  className="absolute top-4 right-4 p-2 bg-white rounded-full"
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{
                    scale: hoveredId === item.id ? 1 : 0,
                    rotate: hoveredId === item.id ? 0 : -45
                  }}
                  transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
                >
                  <ArrowUpRight className="w-4 h-4 text-neutral-900" />
                </motion.div>

                {/* Title & Year */}
                <motion.div
                  initial={{ y: 20 }}
                  animate={{ y: hoveredId === item.id ? 0 : 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl md:text-2xl font-serif text-white mb-1">
                    {item.title}
                  </h3>
                  <span className="text-sm font-mono text-white/60">
                    {item.year}
                  </span>
                </motion.div>
              </motion.div>
            </div>

            {/* Tools Tags (visible below image on mobile) */}
            <div className="mt-3 flex flex-wrap gap-2 md:hidden">
              {item.tools?.slice(0, 2).map((tool, i) => (
                <span key={i} className="text-[10px] px-2 py-1 bg-neutral-200 text-neutral-600 rounded-full">
                  {tool}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative max-w-5xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image */}
              <div className="md:w-3/5 bg-neutral-100 flex items-center justify-center p-6 relative group/img">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-2xl cursor-pointer"
                  onClick={() => {
                    const index = items.findIndex(i => i.id === selectedItem.id);
                    openLightbox(index);
                  }}
                />
                {/* Fullscreen button */}
                <button
                  onClick={() => {
                    const index = items.findIndex(i => i.id === selectedItem.id);
                    openLightbox(index);
                  }}
                  className="absolute bottom-8 right-8 p-3 bg-black/70 hover:bg-black text-white rounded-full opacity-0 group-hover/img:opacity-100 transition-all"
                  title="전체화면으로 보기"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>

              {/* Info */}
              <div className="md:w-2/5 p-8 flex flex-col justify-center">
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-2">
                  {selectedItem.category}
                </span>
                <h2 className="text-3xl md:text-4xl font-serif text-neutral-900 mb-4">
                  {selectedItem.title}
                </h2>
                <span className="text-sm font-mono text-neutral-500 mb-6">
                  {selectedItem.year}
                </span>

                {selectedItem.description && (
                  <p className="text-neutral-600 leading-relaxed mb-8">
                    {selectedItem.description}
                  </p>
                )}

                {/* Tools */}
                {selectedItem.tools && selectedItem.tools.length > 0 && (
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-3 block">
                      Tools Used
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.tools.map((tool, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-neutral-100 text-neutral-700 text-sm rounded-full"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox for fullscreen viewing */}
      <Lightbox
        images={designImages}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={handleLightboxNext}
        onPrev={handleLightboxPrev}
      />
    </section>
  );
};

export default DesignSection;
