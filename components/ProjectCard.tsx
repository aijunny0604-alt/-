import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { Project } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  index: number;
  onClick: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // 3D Tilt effect
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const smoothRotateX = useSpring(rotateX, { damping: 20, stiffness: 300 });
  const smoothRotateY = useSpring(rotateY, { damping: 20, stiffness: 300 });

  // Parallax Logic
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const y = useTransform(smoothProgress, [0, 1], ["-15%", "15%"]);

  const isYouTube = project.video && (project.video.includes('youtube.com') || project.video.includes('youtu.be'));
  const shouldPlayHoverVideo = project.video && !isYouTube;

  useEffect(() => {
    if (videoRef.current && shouldPlayHoverVideo) {
      if (isHovered) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Auto-play was prevented:", error);
          });
        }
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovered, shouldPlayHoverVideo]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    rotateX.set((-mouseY / rect.height) * 10);
    rotateY.set((mouseX / rect.width) * 10);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={containerRef}
      className="group relative w-full mb-24 md:mb-40 cursor-pointer"
      onClick={() => onClick(project)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      data-cursor-view
    >
      {/* Image Container with 3D Tilt */}
      <motion.div
        ref={imageContainerRef}
        className="relative overflow-hidden bg-neutral-200 aspect-[4/3] mb-6 block"
        style={{
          rotateX: smoothRotateX,
          rotateY: smoothRotateY,
          transformPerspective: 1000,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 z-30 pointer-events-none"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.1) 55%, transparent 60%)',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s',
          }}
        />

        {/* Parallax Image Wrapper */}
        <motion.div
          style={{ y }}
          className="absolute inset-0 h-[130%] -top-[15%] w-full"
        >
          {/* Base Image with clip-path reveal */}
          <motion.div
            className="w-full h-full overflow-hidden"
            initial={{ clipPath: 'inset(100% 0 0 0)' }}
            whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover will-change-transform"
              animate={{
                scale: isHovered && !shouldPlayHoverVideo ? 1.08 : 1,
                filter: isHovered ? 'brightness(1.05)' : 'brightness(1)',
              }}
              transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
            />
          </motion.div>

          {/* Video Overlay */}
          {shouldPlayHoverVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 z-10 bg-neutral-900"
            >
              <video
                ref={videoRef}
                src={project.video}
                muted
                loop
                playsInline
                className="object-cover w-full h-full"
              />
            </motion.div>
          )}
        </motion.div>

        {/* YouTube Indicator */}
        {isYouTube && (
           <div className="absolute top-4 right-4 z-20 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full uppercase tracking-widest backdrop-blur-md">
             Video
           </div>
        )}

        {/* Gradient overlay on hover */}
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            background: isHovered
              ? 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)'
              : 'transparent'
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Floating details */}
        <motion.div
          className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md px-5 py-3 hidden md:flex items-center gap-3 z-30"
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 30,
            scale: isHovered ? 1 : 0.9,
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-sm font-medium uppercase tracking-wider text-neutral-900">View Project</span>
          <ArrowUpRight className="w-4 h-4" />
        </motion.div>

        {/* Index number */}
        <motion.span
          className="absolute top-4 left-4 text-[10px] font-mono text-white/60 z-20 mix-blend-difference"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 + index * 0.1 }}
        >
          {String(index + 1).padStart(2, '0')}
        </motion.span>
      </motion.div>

      {/* Text content */}
      <motion.div
        className="flex justify-between items-start border-t border-neutral-900 pt-4 relative z-10 bg-cream"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
      >
        <div>
          <motion.h3
            className="text-3xl md:text-5xl font-serif text-neutral-900 transition-all duration-500"
            animate={{
              fontStyle: isHovered ? 'italic' : 'normal',
              x: isHovered ? 10 : 0,
            }}
          >
            {project.title}
          </motion.h3>
          <div className="overflow-hidden h-6 mt-2">
            <motion.p
              initial={{ y: 0 }}
              animate={{ y: isHovered ? -24 : 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm text-neutral-500"
            >
              {project.category}
            </motion.p>
            <motion.p
              initial={{ y: 24 }}
              animate={{ y: isHovered ? -24 : 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm text-neutral-900 font-medium"
            >
              {project.description.substring(0, 40)}...
            </motion.p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm font-mono text-neutral-400 mb-2">({project.year})</span>
          <motion.div
            animate={{
              rotate: isHovered ? 45 : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="p-2 border border-neutral-200 rounded-full group-hover:bg-neutral-900 group-hover:text-white group-hover:border-neutral-900 transition-colors duration-300"
          >
            <ArrowUpRight className="w-5 h-5" />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectCard;
