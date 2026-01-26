import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { DesignItem } from '../types';
import { X, Palette, ArrowUpRight, Maximize2 } from 'lucide-react';
import Lightbox from './Lightbox';

interface DesignSectionProps {
  items: DesignItem[];
}

const DesignSection: React.FC<DesignSectionProps> = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState<DesignItem | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

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

  // Parallax effect
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section
      ref={sectionRef}
      id="design"
      className="relative z-10 bg-neutral-950 text-white overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          style={{ y: y1 }}
          className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl"
        />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative px-6 md:px-20 py-32">
        {/* Section Header */}
        <div className="max-w-7xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-10"
          >
            <div>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '60px' }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="h-[2px] bg-gradient-to-r from-purple-500 to-blue-500 mb-6"
              />
              <div className="flex items-center gap-3 mb-4">
                <Palette className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-500">
                  Design Works
                </span>
              </div>
              <h2 className="text-5xl md:text-8xl font-serif leading-[0.9] tracking-tight">
                <span className="text-white">Visual</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                  Identity
                </span>
              </h2>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-neutral-400 text-sm md:text-base max-w-xs leading-relaxed"
            >
              포스터, 앨범 커버, 브랜딩 등
              <br />
              시각적 아이덴티티를 창조합니다.
            </motion.p>
          </motion.div>
        </div>

        {/* Staggered Vertical Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative group cursor-pointer ${
                  index % 5 === 0 ? 'md:row-span-2' : ''
                }`}
                style={{
                  marginTop: index % 2 === 1 ? '2rem' : '0'
                }}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setSelectedItem(item)}
              >
                {/* Card */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-neutral-900 shadow-2xl">
                  {/* Image */}
                  <motion.img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    animate={{
                      scale: hoveredId === item.id ? 1.1 : 1,
                      filter: hoveredId === item.id ? 'brightness(0.5)' : 'brightness(0.9)'
                    }}
                    transition={{ duration: 0.5 }}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Hover Content */}
                  <motion.div
                    className="absolute inset-0 flex flex-col justify-end p-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredId === item.id ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Category */}
                    <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300 mb-2">
                      {item.category}
                    </span>

                    {/* Title */}
                    <h3 className="text-lg md:text-xl font-serif text-white mb-1 leading-tight">
                      {item.title}
                    </h3>

                    {/* Year */}
                    <span className="text-xs font-mono text-neutral-400">
                      {item.year}
                    </span>

                    {/* Arrow */}
                    <motion.div
                      className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center"
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{
                        scale: hoveredId === item.id ? 1 : 0,
                        rotate: hoveredId === item.id ? 0 : -45
                      }}
                      transition={{ duration: 0.3, type: 'spring' }}
                    >
                      <ArrowUpRight className="w-4 h-4 text-neutral-900" />
                    </motion.div>
                  </motion.div>

                  {/* Glowing border on hover */}
                  <div className={`absolute inset-0 rounded-xl border-2 transition-all duration-300 ${
                    hoveredId === item.id
                      ? 'border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.3)]'
                      : 'border-transparent'
                  }`} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom accent */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="max-w-7xl mx-auto mt-20 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"
        />
      </div>

      {/* Detail Modal - Cinematic Style */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={() => setSelectedItem(null)}
              className="absolute top-6 right-6 z-20 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </motion.button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row gap-8 items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image - Portrait optimized */}
              <div className="relative md:w-1/2 flex items-center justify-center">
                <motion.img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl cursor-pointer"
                  onClick={() => {
                    const index = items.findIndex(i => i.id === selectedItem.id);
                    openLightbox(index);
                  }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Fullscreen hint */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-xs text-white/60">
                  클릭하여 전체화면
                </div>
              </div>

              {/* Info Panel */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="md:w-1/2 text-white p-4"
              >
                <div className="mb-6">
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full text-xs font-mono uppercase tracking-wider text-purple-300 mb-4">
                    {selectedItem.category}
                  </span>
                  <h2 className="text-4xl md:text-5xl font-serif mb-2">
                    {selectedItem.title}
                  </h2>
                  <span className="text-lg font-mono text-neutral-500">
                    {selectedItem.year}
                  </span>
                </div>

                {selectedItem.description && (
                  <p className="text-neutral-400 leading-relaxed mb-8 text-lg">
                    {selectedItem.description}
                  </p>
                )}

                {/* Tools */}
                {selectedItem.tools && selectedItem.tools.length > 0 && (
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-4 block">
                      Tools
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.tools.map((tool, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 bg-neutral-800/50 border border-neutral-700 text-neutral-300 text-sm rounded-lg"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
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
