
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Reset link sent",
        description: "Check your email for the password reset link",
      });
      setEmailSent(true);
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
            className="flex items-center text-[#8E9196] hover:text-white transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </button>

          {emailSent ? (
            // Success state
            <div className="text-center space-y-6 animate-slide-up">
              <CheckCircle className="mx-auto h-16 w-16 text-[#3BE188]" />
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2 text-white">
                  Check your email
                </h2>
                <p className="text-white">
                  We've sent a password reset link to{" "}
                  <strong>{form.getValues().email}</strong>
                </p>
              </div>
              <p className="text-sm text-">
                Didn't receive the email? Check your spam folder or{" "}
                <button
                  type="button"
                  onClick={() => setEmailSent(false)}
                  className="text-admin-primary hover:text-admin-light ml-1"
                >
                  try again
                </button>
              </p>
            </div>
          ) : (
            // Form state
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                  Forgot Password?
                </h1>
                <p className="text-[#3BE188]">
                  Enter your email and we'll send you a reset link
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white" size={18} />
                          <FormControl>
                            <Input
                              placeholder="Enter your email"
                              className="h-11 pl-10 bg-black border-admin-charcoal text-white focus:ring-1 focus:ring-admin-primary"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage className="text-destructive text-xs mt-1 " />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#3BE188] hover:bg-admin-secondary text-white h-11"
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>
              </Form>

              <div className="text-center mt-6">
                <p className="text-[#3BE188] text-sm">
                  Remember your password?{" "}
                  <Link to="/login" className="text-white hover:text-amber-50">
                    Back to login
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right side - Decorative */}
      <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-[#8E9196] to-[#8E996]  p-12">
        <div className="h-full flex flex-col justify-center items-center text-center">
          <div className="max-w-md animate-slide-up">
            <h2 className="text-4xl font-bold text-white mb-6">
              Password Recovery
            </h2>
            <p className="text-white/90 text-lg mb-8">
              We understand that sometimes passwords can be forgotten. Don't worry, we've got you covered with our secure password recovery process.
            </p>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm border border-white/20">
              <p className="text-white font-medium">
                After you receive the email, click on the reset link and follow the instructions to create a new password for your account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
