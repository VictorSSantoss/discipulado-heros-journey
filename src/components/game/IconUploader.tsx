"use client";

import { useState, useRef } from "react";
import { put } from "@vercel/blob";

interface Props {
  onUploadComplete: (url: string) => void;
  currentIcon?: string;
}

export default function IconUploader({ onUploadComplete, currentIcon }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Direct upload to blob from client (requires client token or specialized route)
      // For security, we'll use a standard fetch to a signature route or our server action
      const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });

      const newBlob = await response.json();
      onUploadComplete(newBlob.url);
    } catch (error) {
      console.error("Icon upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="hud-label-tactical text-[10px] text-gray-500 uppercase">Ícone da Relíquia</label>
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="w-20 h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center cursor-pointer hover:border-brand/50 transition-all relative overflow-hidden group"
      >
        {currentIcon ? (
          <img src={currentIcon} alt="Preview" className="w-12 h-12 object-contain group-hover:opacity-40" />
        ) : (
          <span className="text-2xl text-white/20">+</span>
        )}
        
        {isUploading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*" 
      />
    </div>
  );
}