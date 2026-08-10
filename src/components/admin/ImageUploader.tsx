"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { X, Upload, Loader2, Link as LinkIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ImageUploader({ name, initial }: { name: string; initial?: string[] }) {
  const [images, setImages] = useState<string[]>(initial ?? []);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualUrl, setManualUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const body = new FormData();
        body.set("file", file);
        const res = await fetch("/api/admin/upload-image", { method: "POST", body });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "No se pudo subir la imagen");
        setImages((prev) => [...prev, data.url]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir la imagen");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((i) => i !== url));
  }

  function addManualUrl() {
    const url = manualUrl.trim();
    if (!url) return;
    setImages((prev) => [...prev, url]);
    setManualUrl("");
  }

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name={name} value={images.join("\n")} />

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((url) => (
            <div key={url} className="relative aspect-square rounded-md overflow-hidden border border-border bg-muted">
              <Image src={url} alt="" fill sizes="120px" className="object-cover" unoptimized />
              <button
                type="button"
                onClick={() => removeImage(url)}
                aria-label="Quitar imagen"
                className="absolute top-1 right-1 size-6 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3">
        <Label
          htmlFor="image-upload-input"
          className="inline-flex items-center gap-2 rounded-md border border-input px-3 py-2 text-sm cursor-pointer hover:bg-muted transition-colors"
        >
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          {uploading ? "Subiendo..." : "Subir desde dispositivo"}
        </Label>
        <input
          id="image-upload-input"
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          className="hidden"
          disabled={uploading}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="flex items-center gap-2 pt-1 border-t border-border">
        <LinkIcon className="size-3.5 text-muted-foreground shrink-0" />
        <Input
          value={manualUrl}
          onChange={(e) => setManualUrl(e.target.value)}
          placeholder="O pegá una URL / ruta (/images/...)"
          className="h-8 text-xs"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addManualUrl();
            }
          }}
        />
        <Button type="button" variant="outline" size="sm" onClick={addManualUrl} className="h-8 shrink-0">
          Agregar
        </Button>
      </div>
    </div>
  );
}
