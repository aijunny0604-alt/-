import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowUpRight, Film, Image as ImageIcon, Maximize2 } from 'lucide-react';
import { Project } from '../types';
import Lightbox from './Lightbox';

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onClose }) => {
  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);

  // Open lightbox with specific images array and starting index
  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleLightboxNext = () => {
    setLightboxIndex((prev) => (prev + 1) % lightboxImages.length);
  };

  const handleLightboxPrev = () => {
    setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
  };

  // Lock body scroll when open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow || '';
    };
  }, []);

  // Helper to extract YouTube ID and create Embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=0&rel=0&modestbranding=1`;
    }
    return null;
  };

  const isYouTube = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  // Filter gallery items
  const galleryVideos = project.gallery?.filter(item => item.type === 'video') || [];
  const galleryImages = project.gallery?.filter(item => item.type === 'image') || [];

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "tween", ease: [0.33, 1, 0.68, 1], duration: 0.6 }}
      className="fixed inset-0 z-[60] bg-cream overflow-y-auto overscroll-contain"
      data-lenis-prevent
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 z-50 p-2 bg-neutral-900 text-white rounded-full hover:bg-neutral-700 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="max-w-7xl mx-auto px-6 md:px-20 py-20">
        {/* Header Section */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-300 pb-8 mb-8"
          >
            <div>
              <span className="text-sm font-mono text-neutral-500 block mb-2">{project.category} — {project.year}</span>
              <h1 className="text-4xl md:text-7xl font-serif text-neutral-900 leading-none">
                {project.title}
              </h1>
            </div>
            <a href="#" className="hidden md:flex items-center gap-2 text-sm uppercase tracking-widest hover:underline mt-4 md:mt-0">
              사이트 방문 <ArrowUpRight className="w-4 h-4" />
            </a>
          </motion.div>

          <motion.p
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.4 }}
             className="text-xl md:text-2xl text-neutral-600 font-serif leading-relaxed md:w-2/3 keep-all"
          >
            {project.description}
          </motion.p>
          
          {project.tags && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 flex flex-wrap gap-2"
            >
              {project.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-neutral-200 text-neutral-600 text-xs uppercase tracking-wider rounded-full">
                  {tag}
                </span>
              ))}
            </motion.div>
          )}
        </div>

        {/* Main Media (Hero) */}
        <div className="w-full aspect-video bg-neutral-200 mb-24 overflow-hidden rounded-sm">
          {project.video ? (
            isYouTube(project.video) ? (
               <iframe 
                 src={getYouTubeEmbedUrl(project.video) || project.video}
                 className="w-full h-full"
                 title="Main Project Video"
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                 allowFullScreen
               />
            ) : (
              <video
                src={project.video}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            )
          ) : (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Separated Gallery Sections */}
        <div className="space-y-32">
          
          {/* Video Section */}
          {galleryVideos.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-10">
                <Film className="w-5 h-5 text-neutral-400" />
                <h3 className="text-2xl font-serif italic text-neutral-800">Video</h3>
                <div className="h-px bg-neutral-200 flex-1" />
              </div>

              <div className="grid grid-cols-1 gap-10">
                {galleryVideos.map((item, idx) => (
                  <div key={`vid-${idx}`} className="w-full aspect-[16/9] bg-neutral-100 overflow-hidden rounded-lg shadow-lg">
                     {isYouTube(item.url) ? (
                        <iframe 
                          src={getYouTubeEmbedUrl(item.url) || item.url}
                          className="w-full h-full"
                          title={`Gallery Video ${idx}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                       ) : (
                        <video
                          src={item.url}
                          controls
                          playsInline
                          className="w-full h-full object-cover"
                        />
                       )}
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Stills Section */}
          {galleryImages.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-10">
                <ImageIcon className="w-5 h-5 text-neutral-400" />
                <h3 className="text-2xl font-serif italic text-neutral-800">Stills</h3>
                <div className="h-px bg-neutral-200 flex-1" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                {galleryImages.map((item, idx) => (
                  <motion.div
                    key={`img-${idx}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className={`relative w-full ${idx % 3 === 0 ? 'md:col-span-2 aspect-[21/9]' : 'aspect-[4/3]'} bg-neutral-100 overflow-hidden group cursor-pointer`}
                    onClick={() => openLightbox(galleryImages.map(i => i.url), idx)}
                  >
                    <img
                      src={item.url}
                      alt={`Gallery Still ${idx}`}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-105 transform"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

        </div>
        
        {/* Navigation Footer for Overlay */}
        <div className="mt-32 pt-10 border-t border-neutral-300 flex justify-between items-center text-neutral-400">
           <span className="text-sm">다음 프로젝트</span>
           <button onClick={onClose} className="text-sm uppercase tracking-widest hover:text-neutral-900 transition-colors">
             닫기
           </button>
        </div>
      </div>

      {/* Lightbox for fullscreen image viewing */}
      <Lightbox
        images={lightboxImages}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={handleLightboxNext}
        onPrev={handleLightboxPrev}
      />
    </motion.div>
  );
};

export default ProjectDetail;