import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Image as ImageIcon } from 'lucide-react';
import { AVAILABLE_IMAGES, getImageUrl } from '../imageManifest';

interface ImagePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentImage?: string;
}

const ImagePicker: React.FC<ImagePickerProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentImage
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleSelect = (filename: string) => {
    const url = getImageUrl(filename);
    setSelectedImage(url);
  };

  const handleConfirm = () => {
    if (selectedImage) {
      onSelect(selectedImage);
      onClose();
      setSelectedImage(null);
    }
  };

  const isSelected = (filename: string) => {
    const url = getImageUrl(filename);
    return selectedImage === url || currentImage === url;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white w-full max-w-4xl max-h-[80vh] rounded-xl shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b border-neutral-200 flex justify-between items-center shrink-0">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" /> 이미지 선택
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  GitHub에 저장된 이미지 중 선택하세요
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {AVAILABLE_IMAGES.map((filename) => (
                  <button
                    key={filename}
                    onClick={() => handleSelect(filename)}
                    className={`
                      relative aspect-square rounded-lg overflow-hidden border-2 transition-all
                      ${isSelected(filename)
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-transparent hover:border-neutral-300'
                      }
                    `}
                  >
                    <img
                      src={getImageUrl(filename)}
                      alt={filename}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {isSelected(filename) && (
                      <div className="absolute inset-0 bg-blue-500/30 flex items-center justify-center">
                        <div className="bg-blue-500 rounded-full p-1">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-neutral-200 flex justify-between items-center shrink-0 bg-neutral-50">
              <p className="text-xs text-neutral-500">
                총 {AVAILABLE_IMAGES.length}개 이미지
              </p>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-200 rounded-md transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!selectedImage}
                  className="px-4 py-2 text-sm bg-neutral-900 text-white rounded-md hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  선택 완료
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImagePicker;
