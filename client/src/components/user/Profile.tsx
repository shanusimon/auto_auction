import { useState, useRef } from 'react';
import {  Pen, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface ProfileCardProps {
  username: string;
  joinedDate: string;
  profileImage?: string;
  email?: string;
  location?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  username,
  joinedDate,
  profileImage,
  email = 'user@example.com',
  location = 'New York, USA'
}) => {
  const [userProfile, setUserProfile] = useState({
    username,
    email,
    location,
    profileImage
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    defaultValues: {
      username: userProfile.username,
      email: userProfile.email,
      location: userProfile.location
    }
  });

  const onSubmit = (data: { username: string; email: string; location: string }) => {
    setUserProfile({
      ...userProfile,
      username: data.username,
      email: data.email,
      location: data.location
    });
    console.log("Profile updated:", data);
    toast.success("Profile updated successfully!");
  };
  
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserProfile({
          ...userProfile,
          profileImage: e.target?.result as string
        });
        toast.success("Profile image updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center">
          {/* Profile image and info */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <Avatar className="h-32 w-32 mb-4 border-2 border-zinc-700 cursor-pointer" onClick={handleImageClick}>
                <AvatarImage src={userProfile.profileImage} alt={username} />
                <AvatarFallback className="bg-zinc-800 text-white text-4xl">
                  {username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div 
                className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={handleImageClick}
              >
                <Camera size={24} className="text-white" />
              </div>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>
            
            <h1 className="text-3xl font-bold mb-2">{userProfile.username}</h1>
            <p className="text-zinc-400 mb-4">Joined {joinedDate}</p>
            
            <div className="flex flex-col items-center gap-2 mb-6">
              <p className="text-center text-zinc-300">
                <span className="font-semibold">Email:</span> {userProfile.email}
              </p>
              <p className="text-center text-zinc-300">
                <span className="font-semibold">Location:</span> {userProfile.location}
              </p>
            </div>
            
            {/* Edit profile button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800 text-white">
                  <Pen size={16} className="mr-2" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-zinc-900 border-zinc-700 text-white">
                <DialogHeader>
                  <DialogTitle className='text-black'>Edit Profile</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="bg-zinc-800 border-zinc-700 text-white"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="bg-zinc-800 border-zinc-700 text-white"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="bg-zinc-800 border-zinc-700 text-white"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end">
                      <Button type="submit" className="bg-[#3BE188] text-black hover:bg-[#33c277]">
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          
        
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;