import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Lock, CheckCircle, Eye, EyeOff } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const resetPasswordSchema = z.object({
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string()
    .min(6, { message: "Confirm password must be at least 6 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const ResetPassword = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    setIsLoading(true);
    
    // Here you would call your reset password API
    // For now, we'll simulate a successful call
    setTimeout(() => {
      toast({
        title: "Password reset successful",
        description: "Your password has been reset successfully",
      });
      setIsSuccess(true);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-black">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6 animate-fade-in">
          {/* Back button */}
          <button
            onClick={() => navigate("/login")}
            className="flex items-center text-[#8E9196] hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </button>

          {isSuccess ? (
            // Success state
            <div className="text-center space-y-6 animate-slide-up">
              <CheckCircle className="mx-auto h-16 w-16 text-[#3BE188]" />
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2 text-white">
                  Password Reset Complete
                </h2>
                <p className="text-white">
                  Your password has been reset successfully. You can now log in with your new password.
                </p>
              </div>
              <Button 
                onClick={() => navigate("/login")}
                className="bg-[#3BE188] hover:bg-[#2ecd75] text-black mt-4"
              >
                Log In
              </Button>
            </div>
          ) : (
            // Form state
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                  Reset Your Password
                </h1>
                <p className="text-[#3BE188]">
                  Enter your new password below
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white" size={18} />
                          <FormControl>
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter new password"
                              className="h-11 w-full rounded pl-10 pr-10 border-0 outline-none transition-all duration-300 ease-in-out bg-gray-900 text-white"
                              {...field}
                            />
                          </FormControl>
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        <FormMessage className="text-red-500 text-xs mt-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white" size={18} />
                          <FormControl>
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm new password"
                              className="h-11 w-full rounded pl-10 pr-10 border-0 outline-none transition-all duration-300 ease-in-out bg-gray-900 text-white"
                              {...field}
                            />
                          </FormControl>
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                          >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        <FormMessage className="text-red-500 text-xs mt-1" />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#3BE188] hover:bg-[#2ecd75] text-black h-11"
                  >
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </Button>
                </form>
              </Form>
            </>
          )}
        </div>
      </div>

      {/* Right side - Decorative */}
      <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-[#3BE188] to-[#2ecd75] p-12">
        <div className="h-full flex flex-col justify-center items-center text-center">
          <div className="max-w-md animate-slide-up">
            <h2 className="text-4xl font-bold text-black mb-6">
              Reset Your Password
            </h2>
            <p className="text-black/90 text-lg mb-8">
              Create a strong password that you don't use for other websites. A strong password is a combination of letters, numbers, and special characters.
            </p>
            <div className="bg-black/10 p-6 rounded-lg backdrop-blur-sm border border-black/20">
              <p className="text-black font-medium">
                After resetting your password, you'll be able to log in to your account with your new credentials.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;