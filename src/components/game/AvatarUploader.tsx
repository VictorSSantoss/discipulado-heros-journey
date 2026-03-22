"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
// Renamed the import to match the exported function in uploadActions.ts
import { uploadValenteAvatar } from "@/app/actions/uploadActions";

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
    
    // Create the FormData object
    const formData = new FormData();
    // CRITICAL: Ensure the key is "file" to match the Server Action logic
    formData.append("file", file);

    // Call the renamed action
    const result = await uploadValenteAvatar(valenteId, formData);
    
    if (result.success && result.url) {
      // 1. Instantly update the parent UI if the callback is provided
      if (onImageUpdated) {
        onImageUpdated(result.url);
      }
      // 2. Refresh server data in the background
      router.refresh();
    } else {
      console.error("Upload error details:", result);
      alert(result.message || "Error uploading image.");
    }
    
    setIsUploading(false);
  };

  return (
    <div 
      className="relative w-full h-full cursor-pointer group" 
      onClick={() => !isUploading && fileInputRef.current?.click()}
    >
      <img 
        src={displayImage} 
        alt={alt || "Avatar"} 
        className={`${className} ${isUploading ? 'opacity-30' : ''} transition-opacity duration-300`} 
      />
      
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 z-20 rounded-inherit">
        <span className="text-[10px] font-bold text-white uppercase tracking-widest text-center px-2">
          {isUploading ? "Enviando..." : "Alterar Foto"}
        </span>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleUpload} 
        className="hidden" 
        accept="image/*" 
      />
      
      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}