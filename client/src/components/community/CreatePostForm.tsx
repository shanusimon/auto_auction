import { useState, useRef } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Video, Image, X } from 'lucide-react';
import { toast } from 'sonner';
import { ImageCropper } from '../user/CarSellingApplication/ImageCropper';
import { uploadMediaCloudinary } from '@/utils/cloudinaryImageUpload';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface PostFormData {
  description: string;
  media: string;
  mediaType: 'image' | 'video';
}

interface CreatePostFormProps {
  onPostCreated: (postData: PostFormData) => void;
  isSubmitting: boolean;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onPostCreated, isSubmitting }) => {
  const [content, setContent] = useState('');
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = useSelector((state:RootState)=>state.user.user);

  

  const validateImage = (file: File): boolean => {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validImageTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPG, PNG, GIF, etc.)');
      return false;
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Image file is too large. Max 5MB allowed.');
      return false;
    }
    return true;
  };

  // Validate video files
  const validateVideo = (file: File): boolean => {
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!validVideoTypes.includes(file.type)) {
      toast.error('Please select a valid video file (MP4, WebM, OGG, MOV)');
      return false;
    }
    const maxSize = 50 * 1024 * 1024; 
    if (file.size > maxSize) {
      toast.error('Video file is too large. Max 50MB allowed.');
      return false;
    }
    return true;
  };

  // Open file input for image
  const handleImageSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = 'image/*'; 
      fileInputRef.current.click();
    }
  };

  // Open file input for video
  const handleVideoSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = 'video/*'; 
      fileInputRef.current.click();
    }
  };

  // Handle file input change (for both images and videos)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      if (!validateImage(file)) {
        e.target.value = '';
        return;
      }
      setSelectedFile(file);
      setShowCropper(true);
      setMediaType('image');
    } else if (file.type.startsWith('video/')) {
      if (!validateVideo(file)) {
        e.target.value = '';
        return;
      }
      setSelectedFile(file);
      const videoUrl = URL.createObjectURL(file);
      setMediaPreview(videoUrl);
      setMediaType('video');
      setShowCropper(false); // no cropper for video
    } else {
      toast.error('Unsupported file type');
    }

    e.target.value = ''; // reset input
  };

  // Crop complete for images
  const handleCropComplete = (croppedFile: File) => {
    setShowCropper(false);
    setMediaType('image');
    const imageUrl = URL.createObjectURL(croppedFile);
    setMediaPreview(imageUrl);
    setSelectedFile(croppedFile);
  };

  // Cancel cropping
  const handleCropCancel = () => {
    setShowCropper(false);
    setSelectedFile(null);
    setMediaPreview(null);
    setMediaType(null);
  };

  // Clear media selection
  const clearMedia = () => {
    if (mediaPreview && !mediaPreview.includes('unsplash.com')) {
      URL.revokeObjectURL(mediaPreview);
    }
    setMediaPreview(null);
    setSelectedFile(null);
    setMediaType(null);
    setShowCropper(false);
  };

  // Submit form handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() && !mediaPreview) {
      toast.error('Please add some content or media to your post');
      return;
    }

    try {
      let mediaUrl = '';
      let type: 'image' | 'video' | null = null;

      if (selectedFile) {
        setIsUploading(true);
        const uploadingToast = toast.loading('Uploading media...');
        const cloudinaryUrl = await uploadMediaCloudinary(selectedFile, mediaType!);
        toast.dismiss(uploadingToast);
        setIsUploading(false);

        if (!cloudinaryUrl) {
          toast.error('Failed to upload media');
          return;
        }

        mediaUrl = cloudinaryUrl;
        type = mediaType!;
      }

      const postData: PostFormData = {
        description: content.trim(),
        media: mediaUrl,
        mediaType: type!,
      };

      await onPostCreated(postData);

      if (!isSubmitting) {
        setContent('');
        clearMedia();
      }
    } catch (error) {
      console.error('Error preparing post:', error);
      toast.error('Failed to process media. Please try again.');
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-zinc-800 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <Avatar>
          <div className="h-full w-full flex items-center justify-center bg-zinc-700">
            <img className="text-lg font-medium text-zinc-300" src={user?.profileImage}></img>
          </div>
        </Avatar>

        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <Textarea
              placeholder="Share something with the community..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-24 bg-zinc-700 border-zinc-600 mb-3 text-white placeholder:text-zinc-400"
            />

            {mediaPreview && (
              <div className="relative mb-3 rounded-md overflow-hidden">
                {mediaType === 'image' ? (
                  <img
                    src={mediaPreview}
                    alt="Media preview"
                    className="w-full h-56 object-cover rounded-md"
                  />
                ) : mediaType === 'video' ? (
                  <video
                    src={mediaPreview}
                    controls
                    className="w-full h-56 object-cover rounded-md bg-black"
                  />
                ) : null}
                <button
                  type="button"
                  onClick={clearMedia}
                  className="absolute top-2 right-2 p-1 bg-black bg-opacity-60 rounded-full"
                >
                  <X size={18} className="text-white" />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between mt-4">
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-zinc-400 hover:text-white hover:bg-zinc-700"
                  onClick={handleImageSelect}
                  disabled={isSubmitting || isUploading}
                >
                  <Image size={18} className="mr-2" />
                  Photo
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-zinc-400 hover:text-white hover:bg-zinc-700"
                  onClick={handleVideoSelect}
                  disabled={isSubmitting || isUploading}
                >
                  <Video size={18} className="mr-2" />
                  Video
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,video/*"
                  className="hidden"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || isUploading || (!content.trim() && !mediaPreview)}
                className="bg-gradient-to-r from-green-400 to-green-500 text-black font-medium hover:shadow-lg hover:shadow-green-500/20"
              >
                {isUploading ? 'Uploading...' : isSubmitting ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Image Cropper Dialog */}
      {showCropper && selectedFile && mediaType === 'image' && (
        <ImageCropper
          imageFile={selectedFile}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
};

export default CreatePostForm;
