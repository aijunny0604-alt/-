import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
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

  // Parallax Logic
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Smooth out the scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Map scroll progress to vertical movement (The Parallax Effect)
  const y = useTransform(smoothProgress, [0, 1], ["-15%", "15%"]);

  // Check if video is a direct file or a YouTube link
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

  return (
    <motion.div
      ref={containerRef}
      className="group relative w-full mb-24 md:mb-40 cursor-pointer"
      onClick={() => onClick(project)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
    >
      {/* Image Container with Overflow Hidden */}
      <div className="relative overflow-hidden bg-neutral-200 aspect-[4/3] mb-6 block">
        {/* Parallax Image Wrapper */}
        <motion.div 
          style={{ y }} 
          className="absolute inset-0 h-[130%] -top-[15%] w-full"
        >
          {/* Base Image */}
          <motion.img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover will-change-transform"
            animate={{ scale: isHovered && !shouldPlayHoverVideo ? 1.05 : 1 }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          />

          {/* Video Overlay (Only for direct files like mp4) */}
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
        
        {/* YouTube Indicator (Optional) */}
        {isYouTube && (
           <div className="absolute top-4 right-4 z-20 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full uppercase tracking-widest backdrop-blur-md">
             Video
           </div>
        )}

        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none" />
        
        {/* Floating details that appear on hover */}
        <motion.div
          className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-3 hidden md:flex items-center gap-3 z-30 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <span className="text-sm font-medium uppercase tracking-wider text-neutral-900">View Project</span>
        </motion.div>
      </div>

      <div className="flex justify-between items-start border-t border-neutral-900 pt-4 relative z-10 bg-cream">
        <div>
           <h3 className="text-3xl md:text-5xl font-serif text-neutral-900 group-hover:italic transition-all duration-300">
            {project.title}
          </h3>
          <div className="overflow-hidden h-6 mt-2">
            <motion.p 
              initial={{ y: 0 }}
              animate={{ y: isHovered ? -24 : 0 }}
              transition={{ duration: 0.4 }}
              className="text-sm text-neutral-500"
            >
              {project.category}
            </motion.p>
            <motion.p 
               initial={{ y: 24 }}
               animate={{ y: isHovered ? -24 : 0 }}
               transition={{ duration: 0.4 }}
               className="text-sm text-neutral-900 font-medium"
            >
              {project.description.substring(0, 40)}...
            </motion.p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm font-mono text-neutral-400 mb-2">({project.year})</span>
          <motion.div
            animate={{ rotate: isHovered ? 45 : 0 }}
            transition={{ duration: 0.3 }}
            className="p-2 border border-neutral-200 rounded-full group-hover:bg-neutral-900 group-hover:text-white group-hover:border-neutral-900 transition-colors"
          >
            <ArrowUpRight className="w-5 h-5" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;