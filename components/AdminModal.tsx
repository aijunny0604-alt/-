import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Save, Code, Image as ImageIcon, Film, Upload } from 'lucide-react';
import { Project, ProjectMedia } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onSave: (projects: Project[]) => void;
}

// Helper type to track which field triggered the upload
type UploadTarget = 
  | { type: 'main'; field: keyof Project }
  | { type: 'gallery'; index: number };

const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, projects, onSave }) => {
  const [editingProjects, setEditingProjects] = useState<Project[]>(projects);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projects[0]?.id || null);
  const [showExport, setShowExport] = useState(false);
  
  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<UploadTarget | null>(null);

  const selectedProject = editingProjects.find(p => p.id === selectedProjectId);

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

  const handleSave = () => {
    onSave(editingProjects);
    alert('저장되었습니다! (브라우저 캐시에 반영됨)');
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

    // Warning for large files (optional)
    if (file.size > 5 * 1024 * 1024) {
      const confirm = window.confirm("파일 크기가 5MB를 넘습니다. 브라우저가 느려질 수 있습니다. 계속하시겠습니까?");
      if (!confirm) return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (!uploadTarget) return;

      if (uploadTarget.type === 'main') {
        handleUpdateProject(uploadTarget.field, result);
      } else if (uploadTarget.type === 'gallery') {
        handleGalleryUpdate(uploadTarget.index, 'url', result);
      }
    };
    reader.readAsDataURL(file);
    
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const generateCode = () => {
    return `export const PROJECTS: Project[] = ${JSON.stringify(editingProjects, null, 2)};`;
  };

  // Render helper for gallery lists
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
                  placeholder={type === 'video' ? "YouTube URL 또는 MP4 업로드..." : "이미지 URL 또는 업로드..."}
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
            <div className="w-64 bg-neutral-100 border-r border-neutral-200 p-4 flex flex-col">
              <h2 className="text-lg font-bold mb-4 px-2">프로젝트 목록</h2>
              <div className="flex-1 overflow-y-auto space-y-2">
                {editingProjects.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProjectId(p.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedProjectId === p.id ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    {p.title}
                  </button>
                ))}
              </div>
              <button 
                className="mt-4 flex items-center justify-center gap-2 p-2 bg-neutral-200 hover:bg-neutral-300 rounded-md text-sm font-medium"
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

            {/* Main Editor */}
            <div className="flex-1 flex flex-col h-full bg-white">
              {/* Header */}
              <div className="p-4 border-b border-neutral-200 flex justify-between items-center bg-white">
                <h3 className="font-bold text-lg">프로젝트 수정</h3>
                <div className="flex gap-2">
                  <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm font-medium">
                    <Code className="w-4 h-4" /> 코드 내보내기
                  </button>
                  <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-700 text-sm font-medium">
                    <Save className="w-4 h-4" /> 저장하기
                  </button>
                  <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              {selectedProject ? (
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                  {/* Basic Info */}
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

                  {/* Main Media */}
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
                        <label className="text-xs font-bold uppercase text-neutral-500">호버 영상 (선택사항)</label>
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
                             {selectedProject.video.includes('youtu') ? (
                               <div className="text-neutral-500 text-xs text-center p-2">
                                 YouTube 미리보기<br/>(호버 또는 상세화면에서 확인 가능)
                               </div>
                             ) : (
                               <video src={selectedProject.video} autoPlay muted loop className="w-full h-full object-cover" />
                             )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Gallery Manager - Separated Sections */}
                  <div className="space-y-8 border-t border-neutral-200 pt-6">
                    
                    {/* Motion (Videos) Section */}
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
                         {(!selectedProject.gallery?.some(i => i.type === 'video')) && (
                           <div className="text-center py-4 text-sm text-neutral-400 bg-neutral-50 rounded border border-dashed border-neutral-300">
                             등록된 영상이 없습니다.
                           </div>
                         )}
                      </div>
                    </div>

                    {/* Stills (Images) Section */}
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
                         {(!selectedProject.gallery?.some(i => i.type === 'image')) && (
                           <div className="text-center py-4 text-sm text-neutral-400 bg-neutral-50 rounded border border-dashed border-neutral-300">
                             등록된 이미지가 없습니다.
                           </div>
                         )}
                      </div>
                    </div>

                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-neutral-400">
                  편집할 프로젝트를 선택하세요
                </div>
              )}
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