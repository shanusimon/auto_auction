import { useState, useEffect } from "react"; // Add useEffect import
import { Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ImageCropper } from "./ImageCropper";

interface CarImagesSectionProps {
  carImages: File[];
  setCarImages: React.Dispatch<React.SetStateAction<File[]>>;
}

export const CarImagesSection = ({ carImages, setCarImages }: CarImagesSectionProps) => {
  const { toast } = useToast();
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<File | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);

  useEffect(() => {
    if (carImages.length === 0) {
      imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      setImagePreviewUrls([]);
    }
  }, [carImages, imagePreviewUrls]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const maxImages = 5;
    const currentImagesCount = carImages.length;
    const remainingSlots = maxImages - currentImagesCount;

    if (remainingSlots <= 0) {
      toast({
        title: "Image limit reached",
        description: "You can only upload a maximum of 5 images",
        variant: "destructive",
      });
      return;
    }

    const file = files[0];
    setCurrentImage(file);
    setCropperOpen(true);
  };

  const handleCroppedImage = (croppedFile: File) => {
    if (currentImageIndex !== null) {
      const updatedCarImages = [...carImages];
      const updatedPreviewUrls = [...imagePreviewUrls];

      URL.revokeObjectURL(updatedPreviewUrls[currentImageIndex]);

      updatedCarImages[currentImageIndex] = croppedFile;
      updatedPreviewUrls[currentImageIndex] = URL.createObjectURL(croppedFile);

      setCarImages(updatedCarImages);
      setImagePreviewUrls(updatedPreviewUrls);
    } else {
      setCarImages((prev) => [...prev, croppedFile]);
      setImagePreviewUrls((prev) => [...prev, URL.createObjectURL(croppedFile)]);
    }

    setCropperOpen(false);
    setCurrentImage(null);
    setCurrentImageIndex(null);
  };

  const removeImage = (index: number) => {
    const updatedImages = [...carImages];
    const updatedPreviewUrls = [...imagePreviewUrls];

    URL.revokeObjectURL(updatedPreviewUrls[index]);

    updatedImages.splice(index, 1);
    updatedPreviewUrls.splice(index, 1);

    setCarImages(updatedImages);
    setImagePreviewUrls(updatedPreviewUrls);
  };

  const handleEditImage = (index: number) => {
    setCurrentImage(carImages[index]);
    setCurrentImageIndex(index);
    setCropperOpen(true);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-white mb-4">Car Images</h2>
      <p className="text-[#8E9196] mb-4">Upload up to 5 high-quality images of your car (exterior, interior, etc.)</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {imagePreviewUrls.map((url, index) => (
          <div key={index} className="relative bg-[#1A1A1A] rounded-lg overflow-hidden h-40">
            <img
              src={url}
              alt={`Car preview ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                type="button"
                onClick={() => handleEditImage(index)}
                className="bg-black bg-opacity-70 text-white rounded-full p-1 hover:bg-opacity-90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="bg-black bg-opacity-70 text-white rounded-full p-1 hover:bg-opacity-90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        ))}

        {carImages.length < 5 && (
          <label className="flex flex-col items-center justify-center bg-[#1A1A1A] border border-dashed border-[#333333] rounded-lg h-40 cursor-pointer hover:bg-[#222222] transition-colors">
            <Camera className="h-10 w-10 mb-2 text-[#3BE188]" />
            <span className="text-[#8E9196]">Add Image</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        )}
      </div>

      <p className="text-[#8E9196] text-sm">
        {carImages.length}/5 images uploaded. {5 - carImages.length} slots remaining.
      </p>

      {cropperOpen && currentImage && (
        <ImageCropper
          imageFile={currentImage}
          onCropComplete={handleCroppedImage}
          onCancel={() => {
            setCropperOpen(false);
            setCurrentImage(null);
            setCurrentImageIndex(null);
          }}
        />
      )}
    </div>
  );
};