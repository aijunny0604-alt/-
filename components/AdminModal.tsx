import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Save, Code, Image as ImageIcon, Film, Upload, Trophy, Layers, Grid } from 'lucide-react';
import { Project, ProjectMedia, Award, PlaygroundItem } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onSave: (projects: Project[]) => void;
  awards: Award[];
  onSaveAwards: (awards: Award[]) => void;
  playground?: PlaygroundItem[];
  onSavePlayground?: (items: PlaygroundItem[]) => void;
}

// Helper type to track which field triggered the upload
type UploadTarget = 
  | { type: 'main'; field: keyof Project }
  | { type: 'gallery'; index: number }
  | { type: 'award'; index: number; field: keyof Award }
  | { type: 'playground'; index: number; field: keyof PlaygroundItem };

const AdminModal: React.FC<AdminModalProps> = ({ 
  isOpen, 
  onClose, 
  projects, 
  onSave, 
  awards, 
  onSaveAwards,
  playground = [],
  onSavePlayground
}) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'awards' | 'playground'>('projects');
  
  const [editingProjects, setEditingProjects] = useState<Project[]>(projects);
  const [editingAwards, setEditingAwards] = useState<Award[]>(awards);
  const [editingPlayground, setEditingPlayground] = useState<PlaygroundItem[]>(playground);
  
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projects[0]?.id || null);
  const [showExport, setShowExport] = useState(false);
  
  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<UploadTarget | null>(null);

  const selectedProject = editingProjects.find(p => p.id === selectedProjectId);

  // --- Project Handlers ---
  const handleUpdateProject = (field: keyof Project, value: any) => {
    if (!selectedProjectId) return;
    setEditingProjects(prev => prev.map(p => 
      p.id === selectedProjectId ? { ...p, [field]: value } : p
    ));
  };

  const handleGalleryUpdate = (index: number, field: keyof ProjectMedia, value: string) => {
    if (!selectedProject) return;
    const newGallery = [...(selectedProject.gallery || [])];
    newGallery[index] = { ...newGallery[index], [field]: value };
    handleUpdateProject('gallery', newGallery);
  };

  const addGalleryItem = (type: 'image' | 'video') => {
    if (!selectedProject) return;
    const newGallery = [...(selectedProject.gallery || []), { 
      type: type, 
      url: type === 'image' ? 'https://via.placeholder.com/800' : '' 
    }];
    handleUpdateProject('gallery', newGallery);
  };

  const removeGalleryItem = (index: number) => {
    if (!selectedProject) return;
    const newGallery = [...(selectedProject.gallery || [])].filter((_, i) => i !== index);
    handleUpdateProject('gallery', newGallery);
  };

  // --- Award Handlers ---
  const handleUpdateAward = (index: number, field: keyof Award, value: string) => {
    const newAwards = [...editingAwards];
    newAwards[index] = { ...newAwards[index], [field]: value };
    setEditingAwards(newAwards);
  };

  const addAward = () => {
    const newAward: Award = {
      year: new Date().getFullYear().toString(),
      title: '새로운 수상 내역',
      organization: '주최 기관',
      result: 'Winner',
      description: '',
      video: ''
    };
    setEditingAwards([...editingAwards, newAward]);
  };

  const removeAward = (index: number) => {
    if (window.confirm('정말 이 수상 내역을 삭제하시겠습니까?')) {
      const newAwards = editingAwards.filter((_, i) => i !== index);
      setEditingAwards(newAwards);
    }
  };

  // --- Playground Handlers ---
  const handleUpdatePlayground = (index: number, field: keyof PlaygroundItem, value: any) => {
    const newItems = [...editingPlayground];
    newItems[index] = { ...newItems[index], [field]: value };
    setEditingPlayground(newItems);
  };

  const addPlaygroundItem = () => {
    const newItem: PlaygroundItem = {
        id: Date.now().toString(),
        type: 'image',
        url: 'https://via.placeholder.com/600',
        caption: 'New Artwork'
    };
    setEditingPlayground([newItem, ...editingPlayground]);
  };

  const removePlaygroundItem = (index: number) => {
    if (window.confirm('삭제하시겠습니까?')) {
        const newItems = editingPlayground.filter((_, i) => i !== index);
        setEditingPlayground(newItems);
    }
  };


  // --- Save & Export ---
  const handleSave = () => {
    onSave(editingProjects);
    onSaveAwards(editingAwards);
    if(onSavePlayground) onSavePlayground(editingPlayground);
    alert('저장되었습니다! (브라우저 메모리/캐시에 반영됨)');
  };

  const handleExport = () => {
    setShowExport(true);
  };

  // --- Upload Logic ---
  const triggerUpload = (target: UploadTarget) => {
    setUploadTarget(target);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Decide how to handle the file based on type
    const isVideo = file.type.startsWith('video/');
    
    // For videos, always use Object URL for performance (prevent hanging)
    // For images, small ones can be Base64, large ones Object URL.
    // For simplicity in this demo, we'll use Object URL for videos to allow instant preview of large files.
    // Note: Object URLs are temporary for the session.
    
    if (isVideo || file.size > 2 * 1024 * 1024) {
       // Use Object URL for large files/videos
       const objectUrl = URL.createObjectURL(file);
       applyFileUrl(objectUrl);
       // Alert user about session persistence only
       if (isVideo) {
         // console.log("Video loaded as Blob URL");
       }
    } else {
       // Use FileReader (Base64) for smaller images to try and persist in LocalStorage
       const reader = new FileReader();
       reader.onload = (event) => {
         const result = event.target?.result as string;
         applyFileUrl(result);
       };
       reader.readAsDataURL(file);
    }
    
    // Reset input
    e.target.value = '';
  };

  const applyFileUrl = (url: string) => {
    if (!uploadTarget) return;

    if (uploadTarget.type === 'main') {
      handleUpdateProject(uploadTarget.field, url);
    } else if (uploadTarget.type === 'gallery') {
      handleGalleryUpdate(uploadTarget.index, 'url', url);
    } else if (uploadTarget.type === 'award') {
      handleUpdateAward(uploadTarget.index, uploadTarget.field, url);
    } else if (uploadTarget.type === 'playground') {
      handleUpdatePlayground(uploadTarget.index, uploadTarget.field, url);
      // Auto-switch type based on file if possible (simple check)
      // Since we don't know the exact mimetype here easily without extra logic, 
      // users can manually switch the type select box.
    }
  };

  const generateCode = () => {
    const projectsCode = `export const PROJECTS: Project[] = ${JSON.stringify(editingProjects, null, 2)};`;
    const awardsCode = `export const AWARDS: Award[] = ${JSON.stringify(editingAwards, null, 2)};`;
    const playgroundCode = `export const PLAYGROUND_ITEMS: PlaygroundItem[] = ${JSON.stringify(editingPlayground, null, 2)};`;
    return `${projectsCode}\n\n${awardsCode}\n\n${playgroundCode}`;
  };

  // --- Render Helpers ---
  const renderGalleryList = (type: 'video' | 'image') => {
    if (!selectedProject || !selectedProject.gallery) return null;

    return selectedProject.gallery.map((item, idx) => {
      if (item.type !== type) return null;

      return (
        <div key={idx} className="flex gap-4 items-start p-4 bg-neutral-50 rounded border border-neutral-200">
          <div className="w-32 aspect-video bg-neutral-200 rounded overflow-hidden flex-shrink-0 relative flex items-center justify-center border border-neutral-300">
            {item.type === 'video' ? (
                item.url.includes('youtu') ? (
                  <div className="flex flex-col items-center justify-center text-neutral-400">
                    <Film className="w-6 h-6 mb-1" />
                    <span className="text-[10px]">YouTube</span>
                  </div>
                ) : (
                  <video src={item.url} muted className="w-full h-full object-cover" />
                )
            ) : (
                <img src={item.url} className="w-full h-full object-cover" alt="Thumb" />
            )}
          </div>
          <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 mb-2">
                {type === 'video' ? <Film className="w-4 h-4 text-blue-600" /> : <ImageIcon className="w-4 h-4 text-green-600" />}
                <span className="text-xs font-bold uppercase text-neutral-500">{type === 'video' ? 'Video' : 'Image'} Source</span>
              </div>
              <div className="flex gap-2">
                <input 
                  className="flex-1 p-2 border border-neutral-300 rounded text-sm font-mono focus:ring-2 focus:ring-neutral-900 outline-none"
                  value={item.url}
                  onChange={(e) => handleGalleryUpdate(idx, 'url', e.target.value)}
                  placeholder={type === 'video' ? "YouTube URL 또는 업로드..." : "이미지 URL 또는 업로드..."}
                />
                <button 
                  onClick={() => triggerUpload({ type: 'gallery', index: idx })}
                  className="p-2 bg-neutral-200 hover:bg-neutral-300 rounded transition-colors"
                  title="미디어 업로드"
                >
                  <Upload className="w-4 h-4" />
                </button>
              </div>
          </div>
          <button onClick={() => removeGalleryItem(idx)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      );
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        >
          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*,video/*"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white w-full max-w-6xl h-[90vh] rounded-xl shadow-2xl flex overflow-hidden font-sans"
          >
            {/* Sidebar List */}
            <div className="w-64 bg-neutral-100 border-r border-neutral-200 flex flex-col">
              <div className="p-4 border-b border-neutral-200">
                <div className="flex flex-col gap-1 bg-neutral-200 p-1 rounded-lg">
                  <button 
                    onClick={() => setActiveTab('projects')}
                    className={`flex-1 flex items-center justify-start px-4 gap-2 py-2 text-xs font-bold uppercase rounded-md transition-colors ${activeTab === 'projects' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
                  >
                    <Layers className="w-3 h-3" /> Works
                  </button>
                  <button 
                     onClick={() => setActiveTab('awards')}
                     className={`flex-1 flex items-center justify-start px-4 gap-2 py-2 text-xs font-bold uppercase rounded-md transition-colors ${activeTab === 'awards' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
                  >
                    <Trophy className="w-3 h-3" /> Honors
                  </button>
                  <button 
                     onClick={() => setActiveTab('playground')}
                     className={`flex-1 flex items-center justify-start px-4 gap-2 py-2 text-xs font-bold uppercase rounded-md transition-colors ${activeTab === 'playground' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
                  >
                    <Grid className="w-3 h-3" /> Playground
                  </button>
                </div>
              </div>

              {activeTab === 'projects' && (
                <>
                  <div className="flex-1 overflow-y-auto space-y-1 p-3">
                    {editingProjects.map(p => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedProjectId(p.id)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors truncate ${
                          selectedProjectId === p.id ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-200 text-neutral-700'
                        }`}
                      >
                        {p.title}
                      </button>
                    ))}
                  </div>
                  <div className="p-3 border-t border-neutral-200">
                    <button 
                      className="w-full flex items-center justify-center gap-2 p-2 bg-neutral-200 hover:bg-neutral-300 rounded-md text-sm font-medium transition-colors"
                      onClick={() => {
                        const newId = Date.now().toString();
                        const newProject: Project = {
                          id: newId,
                          title: '새 프로젝트',
                          category: '카테고리',
                          year: '2025',
                          image: 'https://via.placeholder.com/800',
                          description: '설명을 입력하세요...',
                          gallery: []
                        };
                        setEditingProjects([...editingProjects, newProject]);
                        setSelectedProjectId(newId);
                      }}
                    >
                      <Plus className="w-4 h-4" /> 프로젝트 추가
                    </button>
                  </div>
                </>
              )}
              
              {activeTab === 'awards' && (
                <div className="flex-1 p-4 overflow-y-auto">
                   <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
                     수상 내역은 리스트에서 직접 수정됩니다.
                   </p>
                   <button 
                      className="w-full flex items-center justify-center gap-2 p-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 rounded-md text-sm font-medium transition-colors mb-4"
                      onClick={addAward}
                    >
                      <Plus className="w-4 h-4" /> 수상 내역 추가
                    </button>
                </div>
              )}
              
              {activeTab === 'playground' && (
                <div className="flex-1 p-4 overflow-y-auto">
                   <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
                     Playground는 실험적인 이미지나 짧은 영상을 모아두는 공간입니다.
                   </p>
                   <button 
                      className="w-full flex items-center justify-center gap-2 p-2 bg-neutral-200 text-neutral-800 hover:bg-neutral-300 rounded-md text-sm font-medium transition-colors mb-4"
                      onClick={addPlaygroundItem}
                    >
                      <Plus className="w-4 h-4" /> 아이템 추가
                    </button>
                </div>
              )}
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col h-full bg-white">
              {/* Header */}
              <div className="p-4 border-b border-neutral-200 flex justify-between items-center bg-white">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  {activeTab === 'projects' && <><Layers className="w-5 h-5 text-neutral-400" /> 프로젝트 편집</>}
                  {activeTab === 'awards' && <><Trophy className="w-5 h-5 text-yellow-500" /> 수상 내역 편집</>}
                  {activeTab === 'playground' && <><Grid className="w-5 h-5 text-neutral-400" /> Playground 편집</>}
                </h3>
                <div className="flex gap-2">
                  <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm font-medium transition-colors">
                    <Code className="w-4 h-4" /> 코드 내보내기
                  </button>
                  <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-700 text-sm font-medium transition-colors">
                    <Save className="w-4 h-4" /> 저장하기
                  </button>
                  <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className="flex-1 overflow-y-auto p-8">
                {activeTab === 'projects' ? (
                   selectedProject ? (
                    <div className="space-y-8">
                      {/* --- Project Form Fields (Existing) --- */}
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase text-neutral-500">제목</label>
                          <input 
                            className="w-full p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-neutral-900 outline-none"
                            value={selectedProject.title}
                            onChange={(e) => handleUpdateProject('title', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase text-neutral-500">카테고리</label>
                          <input 
                            className="w-full p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-neutral-900 outline-none"
                            value={selectedProject.category}
                            onChange={(e) => handleUpdateProject('category', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase text-neutral-500">연도</label>
                          <input 
                            className="w-full p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-neutral-900 outline-none"
                            value={selectedProject.year}
                            onChange={(e) => handleUpdateProject('year', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-neutral-500">설명</label>
                        <textarea 
                          className="w-full p-2 border border-neutral-300 rounded h-24 focus:ring-2 focus:ring-neutral-900 outline-none resize-none"
                          value={selectedProject.description}
                          onChange={(e) => handleUpdateProject('description', e.target.value)}
                        />
                      </div>

                      <div className="space-y-4 border-t border-neutral-200 pt-6">
                        <h4 className="font-bold">메인 미디어 (썸네일)</h4>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-neutral-500">이미지 소스</label>
                            <div className="flex gap-2">
                              <input 
                                className="flex-1 p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-neutral-900 outline-none text-sm font-mono"
                                value={selectedProject.image}
                                onChange={(e) => handleUpdateProject('image', e.target.value)}
                                placeholder="URL 또는 업로드..."
                              />
                              <button 
                                onClick={() => triggerUpload({ type: 'main', field: 'image' })}
                                className="p-2 bg-neutral-200 hover:bg-neutral-300 rounded"
                                title="이미지 업로드"
                              >
                                <Upload className="w-5 h-5" />
                              </button>
                            </div>
                            <div className="aspect-[4/3] bg-neutral-100 rounded overflow-hidden border border-neutral-200">
                                <img src={selectedProject.image} className="w-full h-full object-cover" alt="미리보기" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-neutral-500">호버 영상</label>
                            <div className="flex gap-2">
                              <input 
                                className="flex-1 p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-neutral-900 outline-none text-sm font-mono"
                                value={selectedProject.video || ''}
                                onChange={(e) => handleUpdateProject('video', e.target.value)}
                                placeholder="YouTube URL 또는 MP4 업로드..."
                              />
                              <button 
                                onClick={() => triggerUpload({ type: 'main', field: 'video' })}
                                className="p-2 bg-neutral-200 hover:bg-neutral-300 rounded"
                                title="영상 업로드"
                              >
                                <Upload className="w-5 h-5" />
                              </button>
                            </div>
                             {selectedProject.video && (
                                <div className="aspect-[4/3] bg-neutral-100 rounded overflow-hidden border border-neutral-200 relative flex items-center justify-center">
                                  <video src={selectedProject.video} autoPlay muted loop className="w-full h-full object-cover" />
                                </div>
                             )}
                          </div>
                        </div>
                      </div>

                      {/* Gallery Editor */}
                      <div className="space-y-8 border-t border-neutral-200 pt-6">
                         <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h4 className="font-bold flex items-center gap-2">
                                <Film className="w-4 h-4" /> Motion (영상)
                              </h4>
                              <button onClick={() => addGalleryItem('video')} className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                                + 영상 추가
                              </button>
                            </div>
                            <div className="space-y-3">
                              {renderGalleryList('video')}
                            </div>
                         </div>
                         <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h4 className="font-bold flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" /> Stills (이미지)
                              </h4>
                              <button onClick={() => addGalleryItem('image')} className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                                + 이미지 추가
                              </button>
                            </div>
                            <div className="space-y-3">
                              {renderGalleryList('image')}
                            </div>
                         </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-neutral-400">
                      편집할 프로젝트를 선택하세요
                    </div>
                  )
                ) : activeTab === 'awards' ? (
                  // --- AWARDS EDITOR ---
                  <div className="space-y-6">
                    {editingAwards.map((award, idx) => (
                      <div key={idx} className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 relative group">
                        <button 
                          onClick={() => removeAward(idx)} 
                          className="absolute top-4 right-4 text-neutral-400 hover:text-red-500 p-2"
                          title="삭제"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                          <div className="space-y-2">
                             <label className="text-xs font-bold uppercase text-neutral-500">수상 연도</label>
                             <input 
                               className="w-full p-2 border border-neutral-300 rounded bg-white"
                               value={award.year}
                               onChange={(e) => handleUpdateAward(idx, 'year', e.target.value)}
                             />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                             <label className="text-xs font-bold uppercase text-neutral-500">타이틀</label>
                             <input 
                               className="w-full p-2 border border-neutral-300 rounded bg-white font-serif"
                               value={award.title}
                               onChange={(e) => handleUpdateAward(idx, 'title', e.target.value)}
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-xs font-bold uppercase text-neutral-500">결과 (Rank)</label>
                             <input 
                               className="w-full p-2 border border-neutral-300 rounded bg-white"
                               value={award.result}
                               onChange={(e) => handleUpdateAward(idx, 'result', e.target.value)}
                             />
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <label className="text-xs font-bold uppercase text-neutral-500">주최 기관</label>
                          <input 
                            className="w-full p-2 border border-neutral-300 rounded bg-white"
                            value={award.organization}
                            onChange={(e) => handleUpdateAward(idx, 'organization', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2 mb-6">
                          <label className="text-xs font-bold uppercase text-neutral-500">설명</label>
                          <textarea 
                            className="w-full p-2 border border-neutral-300 rounded bg-white h-20 resize-none"
                            value={award.description || ''}
                            onChange={(e) => handleUpdateAward(idx, 'description', e.target.value)}
                            placeholder="수상작에 대한 설명을 입력하세요..."
                          />
                        </div>

                        <div className="bg-white border border-neutral-200 rounded p-4">
                          <label className="flex items-center gap-2 text-xs font-bold uppercase text-neutral-500 mb-2">
                             <Film className="w-4 h-4" /> 전시 영상 (Exhibition Video)
                          </label>
                          <div className="flex gap-4">
                             <div className="w-48 aspect-video bg-neutral-900 rounded overflow-hidden flex items-center justify-center">
                               {award.video ? (
                                 <video src={award.video} muted className="w-full h-full object-cover" />
                               ) : (
                                 <span className="text-neutral-500 text-xs">No Video</span>
                               )}
                             </div>
                             <div className="flex-1 space-y-2">
                                <div className="flex gap-2">
                                  <input 
                                    className="flex-1 p-2 border border-neutral-300 rounded text-sm font-mono"
                                    value={award.video || ''}
                                    onChange={(e) => handleUpdateAward(idx, 'video', e.target.value)}
                                    placeholder="MP4 파일 업로드..."
                                  />
                                  <button 
                                    onClick={() => triggerUpload({ type: 'award', index: idx, field: 'video' })}
                                    className="flex items-center gap-2 px-4 bg-neutral-900 text-white rounded hover:bg-neutral-800 text-sm"
                                  >
                                    <Upload className="w-4 h-4" /> 영상 업로드
                                  </button>
                                </div>
                                <p className="text-xs text-neutral-500">
                                  * 팁: 영상을 업로드하면 미리보기가 즉시 적용됩니다.
                                </p>
                             </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // --- PLAYGROUND EDITOR ---
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {editingPlayground.map((item, idx) => (
                      <div key={idx} className="bg-neutral-50 rounded-lg p-4 border border-neutral-200 relative group">
                        <button 
                          onClick={() => removePlaygroundItem(idx)}
                          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="aspect-square bg-neutral-200 rounded overflow-hidden mb-3 relative flex items-center justify-center">
                          {item.url ? (
                            item.type === 'video' ? (
                               <video src={item.url} muted loop className="w-full h-full object-cover" />
                            ) : (
                               <img src={item.url} alt="Preview" className="w-full h-full object-cover" />
                            )
                          ) : (
                            <span className="text-neutral-400 text-xs">No Media</span>
                          )}
                          <button 
                            onClick={() => triggerUpload({ type: 'playground', index: idx, field: 'url' })}
                            className="absolute bottom-2 right-2 p-2 bg-neutral-900 text-white rounded shadow-md text-xs flex items-center gap-1 hover:bg-neutral-700"
                          >
                             <Upload className="w-3 h-3" /> 변경
                          </button>
                        </div>

                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <select 
                              className="p-1 border border-neutral-300 rounded text-xs"
                              value={item.type}
                              onChange={(e) => handleUpdatePlayground(idx, 'type', e.target.value)}
                            >
                              <option value="image">Image</option>
                              <option value="video">Video</option>
                            </select>
                            <input 
                              className="flex-1 p-1 border border-neutral-300 rounded text-xs font-mono"
                              value={item.url}
                              onChange={(e) => handleUpdatePlayground(idx, 'url', e.target.value)}
                              placeholder="URL..."
                            />
                          </div>
                          <input 
                             className="w-full p-1 border border-neutral-300 rounded text-xs text-center"
                             value={item.caption || ''}
                             onChange={(e) => handleUpdatePlayground(idx, 'caption', e.target.value)}
                             placeholder="캡션 (Optional)"
                          />
                        </div>
                      </div>
                    ))}
                    
                    {/* Add Button */}
                    <button 
                      onClick={addPlaygroundItem}
                      className="aspect-square border-2 border-dashed border-neutral-300 rounded-lg flex flex-col items-center justify-center text-neutral-400 hover:border-neutral-500 hover:text-neutral-600 transition-colors"
                    >
                      <Plus className="w-8 h-8 mb-2" />
                      <span className="text-sm font-medium">새 아이템 추가</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          
          {/* Export Code Modal Overlay */}
          {showExport && (
             <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-[110] p-10">
               <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-full flex flex-col">
                 <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-lg">데이터 내보내기</h3>
                   <button onClick={() => setShowExport(false)}><X className="w-5 h-5" /></button>
                 </div>
                 <p className="text-sm text-neutral-500 mb-4">
                   아래 코드를 복사하여 <code>constants.ts</code> 파일에 붙여넣으면 변경 사항이 영구적으로 저장됩니다.
                 </p>
                 <textarea 
                   readOnly 
                   className="flex-1 bg-neutral-900 text-neutral-100 font-mono text-xs p-4 rounded overflow-auto h-96"
                   value={generateCode()}
                 />
               </div>
             </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminModal;