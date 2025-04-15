import { useState, useRef, useEffect } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";
import "react-image-crop/dist/ReactCrop.css";

interface ImageCropperProps {
  imageFile: File;
  onCropComplete: (croppedFile: File) => void;
  onCancel: () => void;
}

export const ImageCropper = ({ imageFile, onCropComplete, onCancel }: ImageCropperProps) => {
  const [crop, setCrop] = useState<Crop>({
    unit: "px", 
    width: 320, 
    height: 180, 
    x: 0,
    y: 0,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [imageSrc, setImageSrc] = useState<string>("");
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);


  useEffect(() => {
    let element = document.getElementById("image-cropper-portal");
    if (!element) {
      element = document.createElement("div");
      element.id = "image-cropper-portal";
      document.body.appendChild(element);
    }
    setPortalElement(element);
    
    return () => {
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, []);


  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        const maxWidth = img.width * 0.9; 
        const maxHeight = (maxWidth * 9) / 16; 
        setCrop({
          unit: "px",
          width: maxWidth,
          height: maxHeight,
          x: (img.width - maxWidth) / 2,
          y: (img.height - maxHeight) / 2, 
        });
      };
    };
    reader.readAsDataURL(imageFile);
  }, [imageFile]);

  const handleCropComplete = (crop: PixelCrop) => {
    setCompletedCrop(crop);
  };

  const getCroppedImg = async (
    image: HTMLImageElement,
    crop: PixelCrop,
    fileName: string
  ): Promise<File> => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const targetWidth = crop.width;
    const targetHeight = (targetWidth * 9) / 16; 

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No 2d context");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      targetWidth,
      targetHeight
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty"));
            return;
          }
          const file = new File([blob], fileName, { type: blob.type });
          resolve(file);
        },
        imageFile.type,
        1 
      );
    });
  };

  const handleSave = async () => {
    if (!imageRef.current || !completedCrop) return;
    try {
      const croppedFile = await getCroppedImg(imageRef.current, completedCrop, imageFile.name);
      onCropComplete(croppedFile);
    } catch (e) {
      console.error("Error cropping image:", e);
    }
  };


  if (!imageSrc || !portalElement) {
    return createPortal(
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-70">
        <div className="bg-[#1A1A1A] p-6 rounded-lg">
          <p className="text-white">Loading image...</p>
        </div>
      </div>,
      document.body
    );
  }


  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-80 p-4" style={{ isolation: 'isolate' }}>
      <div className="bg-[#1A1A1A] p-4 sm:p-6 rounded-lg w-full max-w-4xl flex flex-col max-h-[95vh] shadow-xl">
        <h3 className="text-xl font-semibold text-white mb-2 sm:mb-4">Crop Image</h3>
        <p className="text-[#8E9196] mb-2 sm:mb-4 text-sm">Drag to adjust the crop area (16:9)</p>

        <div className="flex-1 overflow-auto mb-4 min-h-0">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)} 
            onComplete={handleCropComplete}
            aspect={16 / 9}
            className="max-w-full"
          >
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Crop preview"
              className="max-w-full"
            />
          </ReactCrop>
        </div>

        <div className="sticky bottom-0 left-0 right-0 flex justify-end space-x-3 pt-3 border-t border-zinc-800 bg-[#1A1A1A]">
          <Button 
            onClick={onCancel}
            className="bg-zinc-800 hover:bg-zinc-700 text-white"
            type="button"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-[#3BE188] hover:bg-opacity-90 text-black font-medium"
            type="button"
          >
            Apply Crop
          </Button>
        </div>
      </div>
    </div>,
    portalElement
  );
};