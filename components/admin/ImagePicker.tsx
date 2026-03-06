import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Upload, X, Check, Image as ImageIcon } from 'lucide-react';

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  aspect?: number;
}

const ImagePicker: React.FC<ImagePickerProps> = ({ value, onChange, label, aspect = 16 / 9 }) => {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImage(reader.result as string);
        setIsCropping(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<Blob | null> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg');
    });
  };

  const handleUpload = async () => {
    if (!image || !croppedAreaPixels) return;

    try {
      setIsUploading(true);
      const croppedBlob = await getCroppedImg(image, croppedAreaPixels);
      if (!croppedBlob) throw new Error('Failed to crop image');

      const formData = new FormData();
      formData.append('image', croppedBlob, 'upload.jpg');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      onChange(data.url);
      setIsCropping(false);
      setImage(null);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs uppercase tracking-widest text-stone-500">{label}</label>}
      
      <div className="flex items-center gap-4">
        <div className="relative w-32 h-20 bg-stone-100 border border-stone-200 rounded overflow-hidden group">
          {value ? (
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-400">
              <ImageIcon size={24} />
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <label className="cursor-pointer p-2 text-white hover:scale-110 transition-transform">
              <Upload size={20} />
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>
        </div>
        
        <div className="flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-transparent border-b border-stone-200 py-2 text-sm focus:outline-none focus:border-stone-800 transition-colors"
            placeholder="Or paste image URL..."
          />
        </div>
      </div>

      {isCropping && image && (
        <div className="fixed inset-0 z-[100] bg-stone-900/90 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-stone-800">
            <h3 className="text-white font-serif italic">Select Visible Area</h3>
            <div className="flex gap-4">
              <button
                onClick={() => setIsCropping(false)}
                className="p-2 text-stone-400 hover:text-white transition-colors"
                disabled={isUploading}
              >
                <X size={24} />
              </button>
              <button
                onClick={handleUpload}
                className="flex items-center gap-2 bg-white text-stone-900 px-4 py-2 rounded text-sm font-medium hover:bg-stone-200 transition-colors disabled:opacity-50"
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : (
                  <>
                    <Check size={18} />
                    Apply & Upload
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="relative flex-1">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>

          <div className="p-8 bg-stone-900 border-t border-stone-800">
            <div className="max-w-xs mx-auto space-y-2">
              <label className="block text-xs text-stone-500 uppercase tracking-widest text-center">Zoom</label>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePicker;
