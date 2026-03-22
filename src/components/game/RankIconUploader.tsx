"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { uploadRankIcon } from "@/app/actions/uploadActions";

interface Props {
  rankId: string;
  currentImage: string;
  className?: string;
  onImageUpdated?: (newUrl: string) => void;
}

export default function RankIconUploader({ rankId, currentImage, className, onImageUpdated }: Props) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !rankId) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    const result = await uploadRankIcon(rankId, formData);
    
    if (result.success && result.url) {
      if (onImageUpdated) onImageUpdated(result.url);
      router.refresh();
    } else {
      alert("Erro ao carregar ícone da patente.");
    }
    setIsUploading(false);
  };

  return (
    <div 
      className="relative cursor-pointer group flex items-center justify-center" 
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        fileInputRef.current?.click();
      }}
    >
      <img 
        src={currentImage} 
        alt="Rank Icon" 
        className={`${className} ${isUploading ? 'opacity-20' : 'group-hover:scale-110'} transition-all duration-300`} 
      />
      
      {/* "AJUSTAR" Overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-brand/20 rounded-full z-20">
        <span className="text-[8px] font-black text-white uppercase bg-black/60 px-2 py-1 rounded">
          {isUploading ? "..." : "AJUSTAR"}
        </span>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleUpload} 
        className="hidden" 
        accept="image/*" 
      />
    </div>
  );
}