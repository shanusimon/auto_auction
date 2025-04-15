import React, { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import UserSidebar from '@/components/user/Sidebar';
import { Button } from '@/components/ui/button';
import * as Yup from 'yup';
import { User as UserIcon, Camera, AlertCircle } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import Header from '@/components/header/Header';
import { uploadProfileImageCloudinary } from '@/utils/cloudinaryImageUpload';
import { UpdateProfilePayLoad, updateUserProfile } from '@/store/slices/user.slice';
import { PasswordChangeDialog } from '@/components/modals/PasswordChangeModal';
import { profileSchema } from '@/utils/validations/proflevalidator';

const UserProfile: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch<AppDispatch>();

  const [profileImage, setProfileImage] = useState<string | null>(user?.profileImage || null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [name, setName] = useState<string>(user?.name || '');
  const [phoneNumber, setPhoneNumber] = useState<string>(user?.phone || '');
  const [about, setAbout] = useState<string>(user?.bio || '');
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState<boolean>(false);

  const [errors, setErrors] = useState<{
    name?: string;
    phoneNumber?: string;
    about?: string;
  }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return <p>Loading User data</p>;
  }

  const formattedDate = user.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "N/A";

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 5MB.");
      return;
    }

    if (!file.type.match('image/*')) {
      toast.error("Only image files are allowed.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    setSelectedImage(file);
  };

  const handleSaveChanges = async () => {
    const formData = {
      name: name.trim(),
      phoneNumber: phoneNumber.trim() || null, 
      about: about.trim() || null,
    };

    try {
      await profileSchema.validate(formData, { abortEarly: false });

      setLoading(true);
      let imageUrl = profileImage || "";

      if (selectedImage) {
        const response = await uploadProfileImageCloudinary(selectedImage);
        if (response) {
          imageUrl = response;
        }
      }

      const profileData: UpdateProfilePayLoad = {
        name: formData.name,
        bio: formData.about || '',
        phone: formData.phoneNumber || '',
        profileImage: imageUrl,
      };

      await dispatch(updateUserProfile(profileData)).unwrap();
      setLoading(false);
      setErrors({}); 
      toast.success("User details updated successfully");
    } catch (error: any) {
      if (error instanceof Yup.ValidationError) {
        const validationErrors: Record<string, string> = {};
        error.inner.forEach((err:any) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
        toast.error("Please correct the validation errors");
      } else {
        toast.error(`Failed updating user profile: ${error.message || 'Unknown error'}`);
      }
      setLoading(false);
    }
  };

  const handlePasswordChangeClick = () => {
    setPasswordDialogOpen(true);
  };

  const handlePasswordDialogClose = () => {
    setPasswordDialogOpen(false);
  };

  return (
    <>
      <Header />
      <div className="flex h-screen bg-zinc-900">
        <UserSidebar />
        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6">Your Profile</h1>

            <div className="bg-zinc-800 rounded-lg p-8 mb-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="relative">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <div className="w-32 h-32 bg-zinc-700 rounded-full flex items-center justify-center overflow-hidden">
                    {profileImage ? (
                      <Avatar className="w-full h-full">
                        <AvatarImage src={profileImage} alt={name} className="object-cover" />
                        <AvatarFallback className="bg-zinc-700">
                          <UserIcon size={48} className="text-gray-400" />
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <UserIcon size={48} className="text-gray-400" />
                    )}
                  </div>
                  <button
                    onClick={handleButtonClick}
                    className="absolute bottom-0 right-0 bg-[#3BE188] p-2 rounded-full"
                    aria-label="Upload profile picture"
                  >
                    <Camera size={16} className="text-black cursor-pointer" />
                  </button>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-white">{name || 'User Name'}</h2>
                  <p className="text-gray-400 mb-4">Member since {formattedDate}</p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <span className="bg-zinc-700 text-white px-3 py-1 rounded-full text-sm">Car Enthusiast</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-800 rounded-lg p-8 mb-8">
              <h2 className="text-xl font-bold text-white mb-6">Personal Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full bg-zinc-700 text-white border-none rounded-md px-4 py-2 ${
                      errors.name ? 'ring-2 ring-red-500' : ''
                    }`}
                  />
                  {errors.name && (
                    <div className="flex items-center mt-1 text-red-500 text-sm">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.name}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    className="w-full bg-zinc-700 text-white border-none rounded-md px-4 py-2"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="1234567890"
                    className={`w-full bg-zinc-700 text-white border-none rounded-md px-4 py-2 ${
                      errors.phoneNumber ? 'ring-2 ring-red-500' : ''
                    }`}
                  />
                  {errors.phoneNumber && (
                    <div className="flex items-center mt-1 text-red-500 text-sm">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.phoneNumber}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-gray-400 mb-2">About</label>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Tell us about yourself and your interest in cars..."
                  className={`w-full bg-zinc-700 text-white border-none rounded-md px-4 py-2 h-32 ${
                    errors.about ? 'ring-2 ring-red-500' : ''
                  }`}
                />
                {errors.about && (
                  <div className="flex items-center mt-1 text-red-500 text-sm">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.about}
                  </div>
                )}
              </div>

              <div className="mt-6">
                <Button
                  onClick={handleSaveChanges}
                  className="bg-[#3BE188] hover:bg-[#2dd077] text-black"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>

            <div className="bg-zinc-800 rounded-lg p-8">
              <h2 className="text-xl font-bold text-white mb-6">Account Settings</h2>

              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-zinc-700">
                  <div>
                    <h3 className="text-white font-medium">Password</h3>
                    <p className="text-gray-400 text-sm">Update your password</p>
                  </div>
                  <Button variant="outline" className="text-black border-zinc-600" onClick={handlePasswordChangeClick}>
                    Change
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PasswordChangeDialog
        open={passwordDialogOpen}
        onClose={handlePasswordDialogClose}
      />
    </>
  );
};

export default UserProfile;