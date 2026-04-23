"use client";

import { useRef } from "react";
import { ImagePlus, X } from "lucide-react";

interface Props {
  keptUrls: string[];
  newPreviews: string[];
  onAdd: (files: FileList) => void;
  onRemoveKept: (i: number) => void;
  onRemoveNew: (i: number) => void;
  max?: number;
}

export default function ImageUploader({
  keptUrls,
  newPreviews,
  onAdd,
  onRemoveKept,
  onRemoveNew,
  max = 5,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const total = keptUrls.length + newPreviews.length;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) onAdd(e.target.files);
    e.target.value = "";
  };

  const Thumb = ({ src, onRemove }: { src: string; onRemove: () => void }) => (
    <div className="relative rounded-xl overflow-hidden h-28 bg-zinc-800">
      <img src={src} alt="" className="w-full h-full object-cover" />
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white p-1 rounded-full transition"
      >
        <X size={12} />
      </button>
    </div>
  );

  if (total === 0) {
    return (
      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full h-44 border-2 border-dashed border-zinc-700 hover:border-blue-500 rounded-xl flex flex-col items-center justify-center gap-2 transition text-gray-500 hover:text-blue-400"
        >
          <ImagePlus size={28} />
          <span className="text-sm">Subir fotos</span>
          <span className="text-xs text-gray-600">Hasta {max} fotos · JPG, PNG, WEBP</span>
        </button>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleChange} />
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {keptUrls.map((url, i) => (
          <Thumb key={`k-${i}`} src={url} onRemove={() => onRemoveKept(i)} />
        ))}
        {newPreviews.map((url, i) => (
          <Thumb key={`n-${i}`} src={url} onRemove={() => onRemoveNew(i)} />
        ))}
        {total < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="h-28 border-2 border-dashed border-zinc-700 hover:border-blue-500 rounded-xl flex flex-col items-center justify-center gap-1 transition text-gray-500 hover:text-blue-400"
          >
            <ImagePlus size={20} />
            <span className="text-xs">Agregar</span>
          </button>
        )}
      </div>
      <p className="text-xs text-gray-600 mt-2">{total}/{max} fotos</p>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleChange} />
    </div>
  );
}
