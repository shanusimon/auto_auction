import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import { passwordSchema } from '@/utils/validations/passwordvalidator';
import * as z from 'zod';
import { useUserChangePassword } from '@/hooks/user/userDashboard';


interface PasswordChangeDialogProps {
  open: boolean;
  onClose: () => void;
}

type PasswordFormValues = z.infer<typeof passwordSchema>;

export const PasswordChangeDialog: React.FC<PasswordChangeDialogProps> = ({
  open,
  onClose,
}) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {mutateAsync} = useUserChangePassword();
  const { toast } = useToast();

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: PasswordFormValues) => {
    try {
      const response = await mutateAsync({currPass:values.currentPassword,newPass:values.newPassword})
      console.log("raw response", response);
      if(response.success){
        toast({
          title: "passsword updated successgully",
          duration: 3000,
        });
      }
      form.reset();
      onClose();
    } catch (error:any) {
      console.error('Error updating password:', error);
      toast({
        title: "failed to update password",
        duration: 3000,
      });
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    if (field === 'current') {
      setShowCurrentPassword(!showCurrentPassword);
    } else if (field === 'new') {
      setShowNewPassword(!showNewPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-zinc-800 border-zinc-700 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Change Password</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Current Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        type={showCurrentPassword ? "text" : "password"}
                        className="bg-zinc-700 border-zinc-600 text-white"
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">New Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        type={showNewPassword ? "text" : "password"}
                        className="bg-zinc-700 border-zinc-600 text-white"
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                    >
                      {showNewPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Confirm New Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                        className="bg-zinc-700 border-zinc-600 text-white"
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="text-black border-zinc-600"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-[#3BE188] hover:bg-[#2dd077] text-black"
              >
                Update Password
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

