"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Upload, ImageIcon, X } from "lucide-react";
import clsx from "clsx";

interface ReceiptDropzoneProps {
  onFile: (file: File) => void;
  preview: string | null;
  onClear: () => void;
}

export default function ReceiptDropzone({
  onFile,
  preview,
  onClear,
}: ReceiptDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) onFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  };

  if (preview) {
    return (
      <div className="relative rounded-2xl overflow-hidden border border-[#f0f0ee] bg-[#f7f6f2]">
        <div className="relative w-full h-80">
          <Image
            src={preview}
            alt="Receipt preview"
            fill
            className="object-contain"
            sizes="100vw"
            unoptimized
          />
        </div>
        <button
          onClick={onClear}
          className="absolute top-3 right-3 w-8 h-8 bg-white shadow-sm rounded-lg flex items-center justify-center text-[#9ca3af] hover:text-[#0a1a14] transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={clsx(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-12 cursor-pointer transition-all",
        dragging ?
          "border-[#1D9E75] bg-[#E1F5EE]"
        : "border-[#e5e7eb] bg-white hover:border-[#1D9E75] hover:bg-[#f7f6f2]",
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-[#E1F5EE] flex items-center justify-center">
        <ImageIcon size={22} className="text-[#1D9E75]" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-[#0a1a14]">
          Drop receipt image here
        </p>
        <p className="text-xs text-[#9ca3af] mt-1">
          or click to browse · PNG, JPG, WEBP
        </p>
      </div>
      <button className="flex items-center gap-1.5 px-4 py-2 bg-[#1D9E75] hover:bg-[#0F6E56] text-white text-xs font-medium rounded-xl transition-all active:scale-[0.98]">
        <Upload size={13} />
        Upload receipt
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
