'use client';

import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { UploadCloud, X } from 'lucide-react';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ImageUploaderProps {
  files: File[];
  setFiles: (files: File[]) => void;
}

export default function ImageUploader({ files, setFiles }: ImageUploaderProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const newFiles = Array.from(event.target.files).filter((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} Not An Image!`);
        return false;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error(`${file.name} Size More Than 2MB!`);
        return false;
      }

      return true;
    });

    setFiles([...files, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="bg-background shadow-sm">
        <Label
          htmlFor="image"
          className="cursor-pointer w-full flex-col gap-2 flex items-center justify-center p-4 rounded-lg border-input border-2 border-dashed text-foreground/50"
        >
          <UploadCloud size={24} />
          Upload Images
        </Label>
        <Input id="image" type="file" multiple onChange={handleFileChange} className="hidden" />
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-8 gap-2">
          {files.map((file, index) => (
            <Card key={index} className="relative">
              <CardContent className="p-1">
                <Image
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  width={64}
                  height={64}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={14} />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
