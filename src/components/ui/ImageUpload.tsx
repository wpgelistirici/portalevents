"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image as ImageIcon, Link as LinkIcon, Plus } from "lucide-react";

/* ============================================
   SINGLE IMAGE UPLOAD
   ============================================ */
interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  height?: string;
}

export function ImageUpload({
  value,
  onChange,
  label,
  height = "h-48",
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onChange(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    },
    [onChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      // Reset so same file can be selected again
      e.target.value = "";
    },
    [handleFile],
  );

  const handleUrlSubmit = () => {
    if (urlValue.trim()) {
      onChange(urlValue.trim());
      setUrlValue("");
      setShowUrlInput(false);
    }
  };

  // Has image state
  if (value) {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-white/70">{label}</label>
        )}
        <div className={`relative ${height} rounded-xl overflow-hidden group border border-white/10`}>
          <img src={value} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white text-sm font-medium hover:bg-white/20 transition-colors border border-white/10"
            >
              Değiştir
            </button>
            <button
              onClick={() => onChange("")}
              className="p-2 rounded-lg bg-red-500/20 backdrop-blur-sm text-red-400 hover:bg-red-500/30 transition-colors border border-red-500/20"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>
    );
  }

  // Empty state - upload zone
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-white/70">{label}</label>
      )}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative ${height} rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-3 ${
          isDragging
            ? "border-[#7B61FF] bg-[#7B61FF]/5"
            : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
        }`}
      >
        <AnimatePresence mode="wait">
          {isDragging ? (
            <motion.div
              key="dragging"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#7B61FF]/10 flex items-center justify-center">
                <Upload className="w-7 h-7 text-[#7B61FF]" />
              </div>
              <p className="text-sm font-medium text-[#7B61FF]">Bırakarak yükle</p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                <ImageIcon className="w-7 h-7 text-white/20" />
              </div>
              <div className="text-center">
                <p className="text-sm text-white/50">
                  <span className="text-[#7B61FF] font-medium">Tıklayın</span> veya sürükleyip bırakın
                </p>
                <p className="text-xs text-white/20 mt-1">PNG, JPG, WEBP — maks. 10MB</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* URL Fallback */}
      <div>
        {!showUrlInput ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowUrlInput(true);
            }}
            className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/50 transition-colors mt-1"
          >
            <LinkIcon className="w-3 h-3" />
            URL ile ekle
          </button>
        ) : (
          <div className="flex gap-2 mt-2">
            <input
              type="url"
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
              placeholder="https://..."
              className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#7B61FF]/50"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUrlSubmit();
              }}
              className="px-3 py-2 rounded-lg bg-[#7B61FF]/10 text-[#7B61FF] text-sm font-medium hover:bg-[#7B61FF]/20 transition-colors"
            >
              Ekle
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowUrlInput(false);
                setUrlValue("");
              }}
              className="p-2 rounded-lg text-white/30 hover:text-white/50 hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================
   MULTI IMAGE UPLOAD (Gallery)
   ============================================ */
interface MultiImageUploadProps {
  values: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  maxImages?: number;
}

export function MultiImageUpload({
  values,
  onChange,
  label,
  maxImages = 20,
}: MultiImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList) => {
      const remaining = maxImages - values.length;
      const toProcess = Array.from(files).slice(0, remaining);

      toProcess.forEach((file) => {
        if (!file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            onChange([...values, e.target.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    },
    [values, onChange, maxImages],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files);
      }
      e.target.value = "";
    },
    [handleFiles],
  );

  const removeImage = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const handleUrlSubmit = () => {
    if (urlValue.trim() && values.length < maxImages) {
      onChange([...values, urlValue.trim()]);
      setUrlValue("");
    }
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-white/70">{label}</label>
      )}

      {/* Image Grid */}
      {values.length > 0 && (
        <div className="flex gap-2.5 flex-wrap">
          {values.map((url, idx) => (
            <motion.div
              key={`${idx}-${url.slice(-20)}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative w-24 h-24 rounded-xl overflow-hidden group border border-white/10"
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => removeImage(idx)}
                className="absolute inset-0 bg-black/0 group-hover:bg-black/50 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <div className="w-8 h-8 rounded-full bg-red-500/20 backdrop-blur-sm flex items-center justify-center border border-red-500/20">
                  <X className="w-4 h-4 text-red-400" />
                </div>
              </button>
              <div className="absolute bottom-1 right-1 text-[9px] bg-black/60 backdrop-blur-sm text-white/50 px-1.5 py-0.5 rounded">
                {idx + 1}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Drop Zone */}
      {values.length < maxImages && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer py-6 flex flex-col items-center justify-center gap-2 ${
            isDragging
              ? "border-[#7B61FF] bg-[#7B61FF]/5"
              : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
          }`}
        >
          {isDragging ? (
            <div className="flex items-center gap-2 text-[#7B61FF]">
              <Upload className="w-5 h-5" />
              <span className="text-sm font-medium">Bırakarak yükle</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                <Plus className="w-5 h-5 text-white/20" />
              </div>
              <div>
                <p className="text-sm text-white/50">
                  <span className="text-[#7B61FF] font-medium">Tıklayın</span> veya sürükleyin
                </p>
                <p className="text-xs text-white/20">
                  {values.length}/{maxImages} görsel
                </p>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* URL Fallback */}
      {values.length < maxImages && (
        <div>
          {!showUrlInput ? (
            <button
              onClick={() => setShowUrlInput(true)}
              className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/50 transition-colors"
            >
              <LinkIcon className="w-3 h-3" />
              URL ile ekle
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                type="url"
                value={urlValue}
                onChange={(e) => setUrlValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
                placeholder="https://..."
                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#7B61FF]/50"
                autoFocus
              />
              <button
                onClick={handleUrlSubmit}
                className="px-3 py-2 rounded-lg bg-[#7B61FF]/10 text-[#7B61FF] text-sm font-medium hover:bg-[#7B61FF]/20 transition-colors"
              >
                Ekle
              </button>
              <button
                onClick={() => {
                  setShowUrlInput(false);
                  setUrlValue("");
                }}
                className="p-2 rounded-lg text-white/30 hover:text-white/50 hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
