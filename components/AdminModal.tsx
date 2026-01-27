import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Save, Code, Image as ImageIcon, Film, Upload, Trophy, Layers, Grid, Palette, ChevronUp, ChevronDown, FolderOpen } from 'lucide-react';
import { Project, ProjectMedia, Award, PlaygroundItem, DesignItem } from '../types';
import ImagePicker from './ImagePicker';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onSave: (projects: Project[]) => void;
  awards: Award[];
  onSaveAwards: (awards: Award[]) => void;
  playground?: PlaygroundItem[];
  onSavePlayground?: (items: PlaygroundItem[]) => void;
  designItems?: DesignItem[];
  onSaveDesign?: (items: DesignItem[]) => void;
  onReset?: () => void;
}

// Helper type to track which field triggered the upload
type UploadTarget =
  | { type: 'main'; field: keyof Project }
  | { type: 'gallery'; index: number }
  | { type: 'award'; index: number; field: keyof Award }
  | { type: 'playground'; index: number; field: keyof PlaygroundItem }
  | { type: 'design'; index: number; field: keyof DesignItem };

const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  projects,
  onSave,
  awards,
  onSaveAwards,
  playground = [],
  onSavePlayground,
  designItems = [],
  onSaveDesign,
  onReset
}) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'awards' | 'playground' | 'design'>('projects');

  const [editingProjects, setEditingProjects] = useState<Project[]>(projects);
  const [editingAwards, setEditingAwards] = useState<Award[]>(awards);
  const [editingPlayground, setEditingPlayground] = useState<PlaygroundItem[]>(playground);
  const [editingDesign, setEditingDesign] = useState<DesignItem[]>(designItems);

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projects[0]?.id || null);
  const [showExport, setShowExport] = useState(false);

  // props 변경 시 내부 상태 동기화
  React.useEffect(() => {
    setEditingProjects(projects);
    setEditingAwards(awards);
    setEditingPlayground(playground);
    setEditingDesign(designItems);
  }, [projects, awards, playground, designItems]);

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<UploadTarget | null>(null);

  // Image Picker State
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [imagePickerTarget, setImagePickerTarget] = useState<UploadTarget | null>(null);
  const [imagePickerCurrentImage, setImagePickerCurrentImage] = useState<string | undefined>(undefined);

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

  const moveGalleryItem = (index: number, direction: 'up' | 'down') => {
    if (!selectedProject || !selectedProject.gallery) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= selectedProject.gallery.length) return;
    const newGallery = [...selectedProject.gallery];
    [newGallery[index], newGallery[newIndex]] = [newGallery[newIndex], newGallery[index]];
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

  const movePlaygroundItem = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= editingPlayground.length) return;
    const newItems = [...editingPlayground];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    setEditingPlayground(newItems);
  };

  // --- Design Handlers ---
  const handleUpdateDesign = (index: number, field: keyof DesignItem, value: any) => {
    const newItems = [...editingDesign];
    newItems[index] = { ...newItems[index], [field]: value };
    setEditingDesign(newItems);
  };

  const addDesignItem = () => {
    const newItem: DesignItem = {
      id: Date.now().toString(),
      title: '새 디자인',
      category: 'Poster Design',
      year: new Date().getFullYear().toString(),
      image: 'https://via.placeholder.com/600x800',
      description: '',
      tools: []
    };
    setEditingDesign([newItem, ...editingDesign]);
  };

  const removeDesignItem = (index: number) => {
    if (window.confirm('이 디자인을 삭제하시겠습니까?')) {
      const newItems = editingDesign.filter((_, i) => i !== index);
      setEditingDesign(newItems);
    }
  };

  const moveDesignItem = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= editingDesign.length) return;
    const newItems = [...editingDesign];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    setEditingDesign(newItems);
  };

  // --- Save & Export ---
  const handleSave = () => {
    onSave(editingProjects);
    onSaveAwards(editingAwards);
    if(onSavePlayground) onSavePlayground(editingPlayground);
    if(onSaveDesign) onSaveDesign(editingDesign);
    alert('저장되었습니다! (브라우저 메모리/캐시에 반영됨)');
  };

  const handleExport = () => {
    setShowExport(true);
  };

  // --- Image Picker Logic ---
  const openImagePicker = (target: UploadTarget, currentImage?: string) => {
    setImagePickerTarget(target);
    setImagePickerCurrentImage(currentImage);
    setShowImagePicker(true);
  };

  const handleImagePickerSelect = (url: string) => {
    if (!imagePickerTarget) return;
    applyFileUrl(url, imagePickerTarget);
    setShowImagePicker(false);
    setImagePickerTarget(null);
  };

  // --- Upload Logic ---
  const triggerUpload = (target: UploadTarget) => {
    setUploadTarget(target);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (isVideo) {
      // 영상은 YouTube URL 사용 권장
      alert('영상 파일은 저장되지 않습니다.\nYouTube URL을 직접 입력해주세요.');
      e.target.value = '';
      return;
    }

    if (file.size > maxSize) {
      alert('파일이 너무 큽니다 (최대 10MB).\n외부 이미지 호스팅 서비스(Flickr, Imgur 등)의 URL을 사용해주세요.');
      e.target.value = '';
      return;
    }

    // 이미지를 Base64로 변환하여 저장 (localStorage에 영구 저장됨)
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      applyFileUrl(result);
    };
    reader.readAsDataURL(file);

    e.target.value = '';
  };

  const applyFileUrl = (url: string, target?: UploadTarget | null) => {
    const currentTarget = target || uploadTarget;
    if (!currentTarget) return;

    if (currentTarget.type === 'main') {
      handleUpdateProject(currentTarget.field, url);
    } else if (currentTarget.type === 'gallery') {
      handleGalleryUpdate(currentTarget.index, 'url', url);
    } else if (currentTarget.type === 'award') {
      handleUpdateAward(currentTarget.index, currentTarget.field, url);
    } else if (currentTarget.type === 'playground') {
      handleUpdatePlayground(currentTarget.index, currentTarget.field, url);
    } else if (currentTarget.type === 'design') {
      handleUpdateDesign(currentTarget.index, currentTarget.field, url);
    }
  };

  const generateCode = () => {
    const projectsCode = `export const PROJECTS: Project[] = ${JSON.stringify(editingProjects, null, 2)};`;
    const awardsCode = `export const AWARDS: Award[] = ${JSON.stringify(editingAwards, null, 2)};`;
    const playgroundCode = `export const PLAYGROUND_ITEMS: PlaygroundItem[] = ${JSON.stringify(editingPlayground, null, 2)};`;
    const designCode = `export const DESIGN_ITEMS: DesignItem[] = ${JSON.stringify(editingDesign, null, 2)};`;
    return `${projectsCode}\n\n${awardsCode}\n\n${playgroundCode}\n\n${designCode}`;
  };

  // --- Render Helpers ---
  const renderGalleryList = (type: 'video' | 'image') => {
    if (!selectedProject || !selectedProject.gallery) return null;

    return selectedProject.gallery.map((item, idx) => {
      if (item.type !== type) return null;

      return (
        <div key={idx} className="flex gap-4 items-start p-4 bg-neutral-50 rounded border border-neutral-200">
          {/* Move Buttons */}
          <div className="flex flex-col gap-1">
            <button
              onClick={() => moveGalleryItem(idx, 'up')}
              disabled={idx === 0}
              className="p-1 bg-neutral-200 hover:bg-neutral-300 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="위로 이동"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => moveGalleryItem(idx, 'down')}
              disabled={idx === (selectedProject.gallery?.length || 0) - 1}
              className="p-1 bg-neutral-200 hover:bg-neutral-300 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="아래로 이동"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
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
                  className="flex-1 min-w-0 p-2 border border-neutral-300 rounded text-xs md:text-sm font-mono focus:ring-2 focus:ring-neutral-900 outline-none truncate"
                  value={item.url}
                  onChange={(e) => handleGalleryUpdate(idx, 'url', e.target.value)}
                  placeholder={type === 'video' ? "YouTube URL..." : "이미지 URL..."}
                />
                {type === 'image' && (
                  <button
                    onClick={() => openImagePicker({ type: 'gallery', index: idx }, item.url)}
                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                    title="갤러리에서 선택"
                  >
                    <FolderOpen className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => triggerUpload({ type: 'gallery', index: idx })}
                  className="p-2 bg-neutral-200 hover:bg-neutral-300 rounded transition-colors"
                  title="직접 업로드"
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
            className="bg-white w-full max-w-6xl h-[100dvh] md:h-[90vh] md:rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden font-sans"
            data-lenis-prevent
          >
            {/* Sidebar List - Mobile: Top tabs, Desktop: Left sidebar */}
            <div className="w-full md:w-64 bg-neutral-100 border-b md:border-b-0 md:border-r border-neutral-200 flex flex-col shrink-0">
              <div className="p-2 md:p-4 border-b border-neutral-200">
                <div className="flex md:flex-col gap-1 bg-neutral-200 p-1 rounded-lg overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('projects')}
                    className={`flex-1 flex items-center justify-center md:justify-start px-3 md:px-4 gap-1 md:gap-2 py-2 text-[10px] md:text-xs font-bold uppercase rounded-md transition-colors whitespace-nowrap ${activeTab === 'projects' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
                  >
                    <Layers className="w-3 h-3" /> <span className="hidden sm:inline">Works</span>
                  </button>
                  <button
                     onClick={() => setActiveTab('awards')}
                     className={`flex-1 flex items-center justify-center md:justify-start px-3 md:px-4 gap-1 md:gap-2 py-2 text-[10px] md:text-xs font-bold uppercase rounded-md transition-colors whitespace-nowrap ${activeTab === 'awards' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
                  >
                    <Trophy className="w-3 h-3" /> <span className="hidden sm:inline">Honors</span>
                  </button>
                  <button
                     onClick={() => setActiveTab('playground')}
                     className={`flex-1 flex items-center justify-center md:justify-start px-3 md:px-4 gap-1 md:gap-2 py-2 text-[10px] md:text-xs font-bold uppercase rounded-md transition-colors whitespace-nowrap ${activeTab === 'playground' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
                  >
                    <Grid className="w-3 h-3" /> <span className="hidden sm:inline">Play</span>
                  </button>
                  <button
                     onClick={() => setActiveTab('design')}
                     className={`flex-1 flex items-center justify-center md:justify-start px-3 md:px-4 gap-1 md:gap-2 py-2 text-[10px] md:text-xs font-bold uppercase rounded-md transition-colors whitespace-nowrap ${activeTab === 'design' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
                  >
                    <Palette className="w-3 h-3" /> <span className="hidden sm:inline">Design</span>
                  </button>
                </div>
              </div>

              {activeTab === 'projects' && (
                <>
                  <div className="hidden md:block flex-1 overflow-y-auto space-y-1 p-3">
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
                  {/* Mobile project selector */}
                  <div className="md:hidden p-2 border-b border-neutral-200">
                    <select
                      value={selectedProjectId || ''}
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                      className="w-full p-2 bg-white border border-neutral-300 rounded-md text-sm"
                    >
                      {editingProjects.map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="hidden md:block p-3 border-t border-neutral-200">
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

              {activeTab === 'design' && (
                <div className="flex-1 p-4 overflow-y-auto">
                   <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
                     포스터, 앨범 커버, 브랜딩 등 그래픽 디자인 작업물을 관리합니다.
                   </p>
                   <button
                      className="w-full flex items-center justify-center gap-2 p-2 bg-purple-100 text-purple-800 hover:bg-purple-200 rounded-md text-sm font-medium transition-colors mb-4"
                      onClick={addDesignItem}
                    >
                      <Plus className="w-4 h-4" /> 디자인 추가
                    </button>
                </div>
              )}
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col min-h-0 bg-white">
              {/* Header */}
              <div className="p-2 md:p-4 border-b border-neutral-200 flex flex-wrap justify-between items-center gap-2 bg-white shrink-0">
                <h3 className="font-bold text-sm md:text-lg flex items-center gap-2">
                  {activeTab === 'projects' && <><Layers className="w-4 h-4 md:w-5 md:h-5 text-neutral-400" /> <span className="hidden sm:inline">프로젝트</span> 편집</>}
                  {activeTab === 'awards' && <><Trophy className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" /> <span className="hidden sm:inline">수상 내역</span> 편집</>}
                  {activeTab === 'playground' && <><Grid className="w-4 h-4 md:w-5 md:h-5 text-neutral-400" /> Playground</>}
                  {activeTab === 'design' && <><Palette className="w-4 h-4 md:w-5 md:h-5 text-purple-500" /> <span className="hidden sm:inline">디자인</span> 편집</>}
                </h3>
                <div className="flex gap-1 md:gap-2">
                  {onReset && (
                    <button
                      onClick={() => {
                        if (confirm('모든 데이터를 기본값으로 초기화하시겠습니까?')) {
                          onReset();
                          onClose();
                        }
                      }}
                      className="flex items-center gap-1 px-2 md:px-4 py-1.5 md:py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-xs md:text-sm font-medium transition-colors"
                    >
                      <Trash2 className="w-3 h-3 md:w-4 md:h-4" /> <span className="hidden sm:inline">초기화</span>
                    </button>
                  )}
                  <button onClick={handleSave} className="flex items-center gap-1 px-2 md:px-4 py-1.5 md:py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-700 text-xs md:text-sm font-medium transition-colors">
                    <Save className="w-3 h-3 md:w-4 md:h-4" /> <span className="hidden sm:inline">저장</span>
                  </button>
                  <button onClick={onClose} className="p-1.5 md:p-2 hover:bg-neutral-100 rounded-full transition-colors">
                    <X className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8">
                {activeTab === 'projects' ? (
                   selectedProject ? (
                    <div className="space-y-6 md:space-y-8">
                      {/* --- Project Form Fields (Existing) --- */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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

                      <div className="space-y-4 border-t border-neutral-200 pt-4 md:pt-6">
                        <h4 className="font-bold text-sm md:text-base">메인 미디어 (썸네일)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-neutral-500">이미지 소스</label>
                            <div className="flex gap-2">
                              <input
                                className="flex-1 min-w-0 p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-neutral-900 outline-none text-xs md:text-sm font-mono truncate"
                                value={selectedProject.image}
                                onChange={(e) => handleUpdateProject('image', e.target.value)}
                                placeholder="URL 또는 갤러리에서 선택..."
                              />
                              <button
                                onClick={() => openImagePicker({ type: 'main', field: 'image' }, selectedProject.image)}
                                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                                title="갤러리에서 선택"
                              >
                                <FolderOpen className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => triggerUpload({ type: 'main', field: 'image' })}
                                className="p-2 bg-neutral-200 hover:bg-neutral-300 rounded"
                                title="직접 업로드"
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
                                className="flex-1 min-w-0 p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-neutral-900 outline-none text-xs md:text-sm font-mono truncate"
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
                             <div className="flex-1 min-w-0 space-y-2">
                                <div className="flex gap-2">
                                  <input
                                    className="flex-1 min-w-0 p-2 border border-neutral-300 rounded text-xs md:text-sm font-mono truncate"
                                    value={award.video || ''}
                                    onChange={(e) => handleUpdateAward(idx, 'video', e.target.value)}
                                    placeholder="MP4 업로드..."
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
                ) : activeTab === 'playground' ? (
                  // --- PLAYGROUND EDITOR ---
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {editingPlayground.map((item, idx) => (
                      <div key={idx} className="bg-neutral-50 rounded-lg p-4 border border-neutral-200 relative group">
                        {/* Action Buttons */}
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <button
                            onClick={() => movePlaygroundItem(idx, 'up')}
                            disabled={idx === 0}
                            className="p-2 bg-white rounded-full shadow-sm text-neutral-400 hover:text-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="앞으로 이동"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => movePlaygroundItem(idx, 'down')}
                            disabled={idx === editingPlayground.length - 1}
                            className="p-2 bg-white rounded-full shadow-sm text-neutral-400 hover:text-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="뒤로 이동"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removePlaygroundItem(idx)}
                            className="p-2 bg-white rounded-full shadow-sm text-neutral-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Order Badge */}
                        <div className="absolute top-2 left-2 w-6 h-6 bg-neutral-900 text-white rounded-full flex items-center justify-center text-xs font-bold z-10">
                          {idx + 1}
                        </div>

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
                          <div className="absolute bottom-2 right-2 flex gap-1">
                            {item.type === 'image' && (
                              <button
                                onClick={() => openImagePicker({ type: 'playground', index: idx, field: 'url' }, item.url)}
                                className="p-2 bg-blue-500 text-white rounded shadow-md text-xs flex items-center gap-1 hover:bg-blue-600"
                              >
                                <FolderOpen className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              onClick={() => triggerUpload({ type: 'playground', index: idx, field: 'url' })}
                              className="p-2 bg-neutral-900 text-white rounded shadow-md text-xs flex items-center gap-1 hover:bg-neutral-700"
                            >
                               <Upload className="w-3 h-3" />
                            </button>
                          </div>
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
                ) : activeTab === 'design' ? (
                  // --- DESIGN EDITOR ---
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {editingDesign.map((item, idx) => (
                      <div key={idx} className="bg-neutral-50 rounded-xl p-5 border border-neutral-200 relative group">
                        {/* Action Buttons */}
                        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <button
                            onClick={() => moveDesignItem(idx, 'up')}
                            disabled={idx === 0}
                            className="p-2 bg-white rounded-full shadow-sm text-neutral-400 hover:text-purple-600 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="앞으로 이동"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => moveDesignItem(idx, 'down')}
                            disabled={idx === editingDesign.length - 1}
                            className="p-2 bg-white rounded-full shadow-sm text-neutral-400 hover:text-purple-600 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="뒤로 이동"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeDesignItem(idx)}
                            className="p-2 bg-white rounded-full shadow-sm text-neutral-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Order Badge */}
                        <div className="absolute top-3 left-3 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold z-10">
                          {idx + 1}
                        </div>

                        {/* Image Preview */}
                        <div className="aspect-[3/4] bg-neutral-200 rounded-lg overflow-hidden mb-4 relative flex items-center justify-center">
                          {item.image ? (
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-neutral-400 text-xs">No Image</span>
                          )}
                          <div className="absolute bottom-2 right-2 flex gap-1">
                            <button
                              onClick={() => openImagePicker({ type: 'design', index: idx, field: 'image' }, item.image)}
                              className="p-2 bg-blue-500 text-white rounded shadow-md text-xs flex items-center gap-1 hover:bg-blue-600"
                            >
                              <FolderOpen className="w-3 h-3" /> 선택
                            </button>
                            <button
                              onClick={() => triggerUpload({ type: 'design', index: idx, field: 'image' })}
                              className="p-2 bg-neutral-900 text-white rounded shadow-md text-xs flex items-center gap-1 hover:bg-neutral-700"
                            >
                              <Upload className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-neutral-400">제목</label>
                            <input
                              className="w-full p-2 border border-neutral-300 rounded text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                              value={item.title}
                              onChange={(e) => handleUpdateDesign(idx, 'title', e.target.value)}
                              placeholder="디자인 제목"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase text-neutral-400">카테고리</label>
                              <select
                                className="w-full p-2 border border-neutral-300 rounded text-sm"
                                value={item.category}
                                onChange={(e) => handleUpdateDesign(idx, 'category', e.target.value)}
                              >
                                <option value="Poster Design">Poster Design</option>
                                <option value="Album Cover">Album Cover</option>
                                <option value="Branding">Branding</option>
                                <option value="Typography">Typography</option>
                                <option value="Illustration">Illustration</option>
                                <option value="Social Media">Social Media</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase text-neutral-400">연도</label>
                              <input
                                className="w-full p-2 border border-neutral-300 rounded text-sm"
                                value={item.year}
                                onChange={(e) => handleUpdateDesign(idx, 'year', e.target.value)}
                                placeholder="2024"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-neutral-400">설명</label>
                            <textarea
                              className="w-full p-2 border border-neutral-300 rounded text-sm h-16 resize-none"
                              value={item.description || ''}
                              onChange={(e) => handleUpdateDesign(idx, 'description', e.target.value)}
                              placeholder="디자인에 대한 설명..."
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-neutral-400">사용 도구 (쉼표로 구분)</label>
                            <input
                              className="w-full p-2 border border-neutral-300 rounded text-sm font-mono"
                              value={(item.tools || []).join(', ')}
                              onChange={(e) => handleUpdateDesign(idx, 'tools', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                              placeholder="Photoshop, Illustrator, Figma"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-neutral-400">이미지 URL</label>
                            <input
                              className="w-full p-2 border border-neutral-300 rounded text-xs font-mono"
                              value={item.image}
                              onChange={(e) => handleUpdateDesign(idx, 'image', e.target.value)}
                              placeholder="https://..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add Button */}
                    <button
                      onClick={addDesignItem}
                      className="aspect-[3/4] border-2 border-dashed border-purple-300 rounded-xl flex flex-col items-center justify-center text-purple-400 hover:border-purple-500 hover:text-purple-600 transition-colors bg-purple-50/50"
                    >
                      <Plus className="w-8 h-8 mb-2" />
                      <span className="text-sm font-medium">새 디자인 추가</span>
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>
          
          {/* Image Picker Modal */}
          <ImagePicker
            isOpen={showImagePicker}
            onClose={() => {
              setShowImagePicker(false);
              setImagePickerTarget(null);
            }}
            onSelect={handleImagePickerSelect}
            currentImage={imagePickerCurrentImage}
          />

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