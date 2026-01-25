import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import { PROJECTS as INITIAL_PROJECTS, ABOUT_TEXT, SOCIAL_LINKS, AWARDS as INITIAL_AWARDS, PLAYGROUND_ITEMS as INITIAL_PLAYGROUND } from './constants';
import { Project, Award, PlaygroundItem } from './types';
import Hero from './components/Hero';
import ProjectCard from './components/ProjectCard';
import ChatWidget from './components/ChatWidget';
import ProjectDetail from './components/ProjectDetail';
import AdminModal from './components/AdminModal';
import CustomCursor from './components/CustomCursor';
import LoadingScreen from './components/LoadingScreen';
import MagneticButton from './components/MagneticButton';
import { ArrowDown, Settings, Trophy, Play, Grid } from 'lucide-react';

// YouTube URL에서 비디오 ID 추출
const getYouTubeVideoId = (url: string): string | null => {
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

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [currentTime, setCurrentTime] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // State for editable content
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [awards, setAwards] = useState<Award[]>(INITIAL_AWARDS);
  const [playground, setPlayground] = useState<PlaygroundItem[]>(INITIAL_PLAYGROUND);

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // localStorage에서 데이터 불러오기 (관리자 페이지 수정사항 유지)
  useEffect(() => {
    const savedProjects = localStorage.getItem('portfolio_projects');
    const savedAwards = localStorage.getItem('portfolio_awards');
    const savedPlayground = localStorage.getItem('portfolio_playground');

    if (savedProjects) {
      try { setProjects(JSON.parse(savedProjects)); } catch (e) { console.error(e); }
    }
    if (savedAwards) {
      try { setAwards(JSON.parse(savedAwards)); } catch (e) { console.error(e); }
    }
    if (savedPlayground) {
      try { setPlayground(JSON.parse(savedPlayground)); } catch (e) { console.error(e); }
    }

    const timer = setInterval(() => {
      const date = new Date();
      setCurrentTime(date.toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit' }));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleSaveProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    localStorage.setItem('portfolio_projects', JSON.stringify(newProjects));
    if (selectedProject) {
      const updatedSelected = newProjects.find(p => p.id === selectedProject.id);
      if (updatedSelected) setSelectedProject(updatedSelected);
    }
  };

  const handleSaveAwards = (newAwards: Award[]) => {
    setAwards(newAwards);
    localStorage.setItem('portfolio_awards', JSON.stringify(newAwards));
  };

  const handleSavePlayground = (newItems: PlaygroundItem[]) => {
    setPlayground(newItems);
    localStorage.setItem('portfolio_playground', JSON.stringify(newItems));
  };

  // 데이터 초기화 함수 (constants.ts로 리셋)
  const handleResetToDefaults = () => {
    localStorage.removeItem('portfolio_projects');
    localStorage.removeItem('portfolio_awards');
    localStorage.removeItem('portfolio_playground');
    setProjects(INITIAL_PROJECTS);
    setAwards(INITIAL_AWARDS);
    setPlayground(INITIAL_PLAYGROUND);
  };

  return (
    <>
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {/* Custom Cursor */}
      <CustomCursor />

      <div className="relative min-h-screen bg-neutral-100 selection:bg-neutral-900 selection:text-white">
      {/* Noise Texture Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] mix-blend-overlay"
        style={{
           backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-neutral-900 origin-left z-[50]"
        style={{ scaleX }}
      />

      {/* Navigation / Header */}
      <header className="fixed top-0 w-full p-6 md:p-10 flex justify-between items-start z-40 mix-blend-difference text-white pointer-events-none">
        <div className="pointer-events-auto">
          <span className="text-lg font-bold tracking-tight">PORTFOLIO®</span>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-sm font-mono">SEOUL, KR</p>
          <p className="text-sm font-mono">{currentTime}</p>
        </div>
      </header>

      <main className="pb-20">
        <Hero />

        {/* 
          Selected Works - Luxurious Overlay Style 
          - mt-[100vh] creates space for the fixed hero
          - negative margin top pulls it up slightly
          - Deep shadow and rounded corners create the "Card/Sheet" effect
        */}
        <section 
          id="work" 
          className="relative z-10 bg-cream/95 backdrop-blur-xl px-6 md:px-20 pt-20 pb-32 min-h-screen rounded-t-[3rem] md:rounded-t-[5rem] shadow-[0_-30px_60px_rgba(0,0,0,0.15)] border-t border-white/40 mt-[100vh]"
        >
          {/* Visual Handle for "Sheet" metaphor */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-neutral-200/80 rounded-full" />

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-32 pt-10 border-b border-neutral-200/50 pb-8">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
               <span className="block text-xs font-mono uppercase tracking-widest text-neutral-500 mb-4">
                 Featured Projects
               </span>
               <h2 className="text-5xl md:text-9xl font-serif text-neutral-900 leading-[0.8]">
                 Selected<br />Works
               </h2>
            </motion.div>
            
            <motion.div 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               transition={{ delay: 0.4, duration: 0.8 }}
               className="mt-8 md:mt-0"
            >
              <span className="text-sm font-mono text-neutral-500 block text-right">
                (2023 — 2025)
              </span>
              <span className="text-sm font-mono text-neutral-400 block text-right mt-1">
                Scroll Down ↓
              </span>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-32">
            {projects.map((project, index) => (
              <div key={project.id} className={index % 2 !== 0 ? "md:mt-40" : ""}>
                 <ProjectCard 
                   project={project} 
                   index={index} 
                   onClick={(p) => setSelectedProject(p)}
                 />
              </div>
            ))}
          </div>
        </section>

        {/* Honors & Awards Section - Exhibition Style */}
        <section id="awards" className="relative z-10 bg-neutral-900 text-white px-6 md:px-20 py-32 rounded-t-[3rem] shadow-[0_-20px_40px_rgba(0,0,0,0.2)]">
           <div className="max-w-7xl mx-auto">
             <div className="flex items-end gap-4 mb-20">
                <Trophy className="w-8 h-8 md:w-12 md:h-12 text-yellow-500 mb-2" />
                <h2 className="text-4xl md:text-8xl font-serif leading-none">Honor</h2>
             </div>

             {awards.map((award, idx) => (
               <div key={idx} className="flex flex-col md:flex-row gap-10 md:gap-20 items-stretch">
                 
                 {/* Video Display Column */}
                 <motion.div 
                   initial={{ opacity: 0, y: 50 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.8 }}
                   className="w-full md:w-3/5"
                 >
                    <div className="relative aspect-video bg-neutral-800 rounded-sm overflow-hidden shadow-2xl group">
                      {award.video ? (
                         getYouTubeVideoId(award.video) ? (
                           <iframe
                             src={`https://www.youtube.com/embed/${getYouTubeVideoId(award.video)}?autoplay=1&mute=1&loop=1&playlist=${getYouTubeVideoId(award.video)}&controls=0&showinfo=0&rel=0`}
                             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                             allowFullScreen
                             className="w-full h-full object-cover"
                             style={{ border: 'none' }}
                           />
                         ) : (
                           <video
                             src={award.video}
                             autoPlay
                             muted
                             loop
                             playsInline
                             className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                           />
                         )
                      ) : (
                         <div className="w-full h-full flex items-center justify-center text-neutral-500 border border-neutral-700">No Media</div>
                      )}
                      
                      {/* Floating Badge */}
                      <div className="absolute top-0 left-0 bg-white text-neutral-900 px-6 py-3">
                         <span className="font-bold text-sm tracking-widest uppercase">{award.result}</span>
                      </div>
                    </div>
                 </motion.div>

                 {/* Text Info Column */}
                 <motion.div 
                   initial={{ opacity: 0, x: 50 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.8, delay: 0.2 }}
                   className="w-full md:w-2/5 flex flex-col justify-center"
                 >
                    <div className="mb-8">
                      <span className="inline-block px-3 py-1 border border-white/30 rounded-full text-xs font-mono mb-4 text-neutral-300">
                        {award.year} — {award.organization}
                      </span>
                      <h3 className="text-3xl md:text-5xl font-serif leading-tight mb-6">
                        {award.title}
                      </h3>
                      <div className="w-12 h-0.5 bg-yellow-500 mb-6"></div>
                      <p className="text-neutral-400 leading-relaxed text-lg keep-all">
                        {award.description}
                      </p>
                    </div>
                 </motion.div>
               </div>
             ))}
           </div>
        </section>
        
        {/* Playground / Archive Section */}
        <section id="playground" className="relative z-10 bg-cream px-6 md:px-20 py-32 border-t border-neutral-200">
            <div className="flex justify-between items-end mb-16">
               <div>
                  <h2 className="text-3xl md:text-6xl font-serif text-neutral-900 mb-4">Playground</h2>
                  <p className="text-neutral-500 text-sm md:text-base font-sans max-w-md">
                    실험적인 작업물, 모션 그래픽 스터디, 그리고 일상의 영감들을 모아둔 아카이브입니다.
                  </p>
               </div>
               <Grid className="w-6 h-6 md:w-8 md:h-8 text-neutral-300" />
            </div>
            
            <div className="columns-1 md:columns-3 gap-8 space-y-8">
              {playground.map((item) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="break-inside-avoid relative group"
                >
                   <div className="bg-neutral-100 rounded overflow-hidden">
                      {item.type === 'video' ? (
                        <video 
                          src={item.url} 
                          autoPlay 
                          muted 
                          loop 
                          playsInline
                          className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                        />
                      ) : (
                        <img 
                          src={item.url} 
                          alt={item.caption}
                          className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-500 hover:scale-105 transform" 
                        />
                      )}
                      
                      {/* Hover Overlay */}
                      {item.caption && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                           <span className="text-white text-xs font-mono uppercase tracking-widest bg-black/50 px-3 py-1 backdrop-blur-md rounded-full">
                             {item.caption}
                           </span>
                        </div>
                      )}
                   </div>
                </motion.div>
              ))}
            </div>
        </section>

        {/* About Section */}
        <section id="about" className="relative z-10 px-6 md:px-20 py-32 bg-neutral-100">
          <div className="md:flex gap-20">
            <div className="md:w-1/3 mb-10 md:mb-0">
               <h2 className="text-sm font-mono uppercase tracking-widest text-neutral-500 mb-4">About</h2>
               <div className="w-12 h-0.5 bg-neutral-900"></div>
            </div>
            <div className="md:w-2/3">
              <p className="text-2xl md:text-5xl font-serif leading-tight text-neutral-800 indent-32 keep-all">
                {ABOUT_TEXT}
              </p>
              
              <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
                {SOCIAL_LINKS.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.url}
                    className="text-sm font-medium uppercase tracking-wide hover:underline underline-offset-4 decoration-neutral-400 cursor-pointer"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Footer / Contact */}
        <footer className="relative z-10 px-6 md:px-20 py-32 bg-neutral-900 text-white overflow-hidden">
           <div className="relative z-10">
             <h2 className="text-[12vw] font-serif leading-none mb-10 text-center md:text-left">
               Let's Talk
             </h2>
             <div className="md:flex justify-between items-end">
               <a href="mailto:hello@portfolio.dev" className="text-2xl md:text-4xl hover:text-neutral-400 transition-colors border-b border-white/30 pb-2 cursor-pointer">
                 hello@portfolio.dev
               </a>
               <div className="mt-10 md:mt-0 flex flex-col items-end">
                 <button
                    onClick={() => lenisRef.current?.scrollTo(0, { duration: 2 })}
                    className="group flex items-center gap-2 text-sm uppercase tracking-widest hover:text-neutral-400 transition-colors cursor-pointer"
                 >
                   맨 위로
                   <ArrowDown className="w-4 h-4 rotate-180 group-hover:-translate-y-1 transition-transform" />
                 </button>
                 <p className="text-xs text-neutral-600 mt-4">© 2025 All Rights Reserved.</p>
               </div>
             </div>
           </div>
        </footer>
      </main>
      
      {/* Project Detail Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetail 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>

      <ChatWidget />

      {/* Admin Toggle Button */}
      <button 
        onClick={() => setIsAdminOpen(true)}
        className="fixed bottom-6 left-6 z-50 p-3 bg-white/80 backdrop-blur shadow-lg rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-white transition-all cursor-pointer"
        title="Admin Editor"
      >
        <Settings className="w-5 h-5" />
      </button>

      {/* Admin Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        projects={projects}
        onSave={handleSaveProjects}
        awards={awards}
        onSaveAwards={handleSaveAwards}
        playground={playground}
        onSavePlayground={handleSavePlayground}
        onReset={handleResetToDefaults}
      />
      </div>
    </>
  );
};

export default App;