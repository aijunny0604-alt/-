import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { PROJECTS as INITIAL_PROJECTS, ABOUT_TEXT, SOCIAL_LINKS, AWARDS } from './constants';
import { Project } from './types';
import Hero from './components/Hero';
import ProjectCard from './components/ProjectCard';
import ChatWidget from './components/ChatWidget';
import ProjectDetail from './components/ProjectDetail';
import AdminModal from './components/AdminModal';
import { ArrowDown, Settings, Trophy } from 'lucide-react';

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [currentTime, setCurrentTime] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // State for editable projects
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Load from LocalStorage on mount to persist changes locally
  useEffect(() => {
    const savedProjects = localStorage.getItem('portfolio_projects');
    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects));
      } catch (e) {
        console.error("Failed to load saved projects", e);
      }
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

  return (
    <div className="relative min-h-screen bg-cream selection:bg-neutral-900 selection:text-white">
      {/* Noise Texture Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] mix-blend-overlay"
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

        {/* Selected Works - Added Z-index and background to cover Hero when scrolling up */}
        <section id="work" className="relative z-10 bg-cream px-6 md:px-20 py-20 min-h-screen rounded-t-[3rem] shadow-[0_-20px_40px_rgba(0,0,0,0.05)] mt-[100vh]">
          <div className="flex justify-between items-end mb-24 border-b border-neutral-900 pb-4">
            <h2 className="text-4xl md:text-8xl font-serif text-neutral-900">Selected Works</h2>
            <span className="text-sm font-mono text-neutral-500 hidden md:block">(2023 — 2025)</span>
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

        {/* Honors & Awards Section */}
        <section id="awards" className="relative z-10 bg-cream px-6 md:px-20 py-20 border-t border-neutral-200">
           <div className="flex flex-col md:flex-row gap-10 md:gap-20">
             <div className="md:w-1/3">
                <div className="flex items-center gap-3 mb-6">
                  <Trophy className="w-6 h-6 text-neutral-400" />
                  <h2 className="text-4xl md:text-6xl font-serif text-neutral-900">Honors</h2>
                </div>
                <p className="text-neutral-500 text-sm leading-relaxed mb-8">
                  기술과 예술의 경계에서 시도한 다양한 실험과 도전들이<br className="hidden md:block" /> 
                  값진 결과로 인정받았습니다.
                </p>
             </div>
             
             <div className="md:w-2/3 space-y-2">
               {AWARDS.map((award, idx) => (
                 <motion.div 
                   initial={{ opacity: 0, x: -20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   transition={{ delay: idx * 0.1 }}
                   viewport={{ once: true }}
                   key={idx} 
                   className="group border-b border-neutral-200 py-8 flex flex-col md:flex-row md:items-baseline justify-between hover:bg-neutral-50 hover:px-6 -mx-6 px-6 transition-all duration-300 rounded-lg cursor-default"
                 >
                    <div className="mb-2 md:mb-0">
                      <span className="block text-xs font-mono text-neutral-400 mb-2">{award.year} — {award.organization}</span>
                      <h3 className="text-xl md:text-3xl font-serif text-neutral-800 group-hover:text-neutral-900 transition-colors">
                        {award.title}
                      </h3>
                    </div>
                    <div className="text-right mt-4 md:mt-0">
                       <span className="inline-block px-4 py-1.5 bg-neutral-100 rounded-full text-xs font-bold uppercase tracking-wider text-neutral-600 group-hover:bg-neutral-900 group-hover:text-white transition-all shadow-sm">
                         {award.result}
                       </span>
                    </div>
                 </motion.div>
               ))}
             </div>
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
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
      />
    </div>
  );
};

export default App;