"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { uploadValenteImage } from "@/app/actions/uploadActions";

interface Props {
  valenteId: string;
  currentImage: string | null;
  className?: string;
  alt?: string;
  onImageUpdated?: (newUrl: string) => void; 
}

export default function AvatarUploader({ valenteId, currentImage, className, alt, onImageUpdated }: Props) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayImage = currentImage || "/images/man-silhouette.svg";

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    const formData = new FormData();
    formData.append("image", file);

    const result = await uploadValenteImage(valenteId, formData);
    
    if (result.success && result.url) {
      // 1. Instantly update the parent UI if the callback is provided
      if (onImageUpdated) {
        onImageUpdated(result.url);
      }
      // 2. Refresh server data in the background
      router.refresh();
    } else {
      alert("Error uploading image.");
    }
    
    setIsUploading(false);
  };

  return (
    <div 
      className="relative w-full h-full cursor-pointer group" 
      onClick={() => fileInputRef.current?.click()}
    >
      <img 
        src={displayImage} 
        alt={alt || "Avatar"} 
        className={`${className} ${isUploading ? 'opacity-30' : ''}`} 
      />
      
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 z-20">
        <span className="text-[10px] font-bold text-white uppercase tracking-tighter">
          {isUploading ? "Uploading..." : "Change Photo"}
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