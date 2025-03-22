import React, { useState } from "react";
import SignupForm from "../../components/auth/SignupForm";
import {useRegister,useSendOtp, useVerifyOtp} from "../../hooks/auth/useAuth";
import { SignupFormValues, RegisterData } from "../../types/auth";
import OTPModal from "@/components/modals/OTPmodal";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Signup: React.FC = () => {
  const [isOTPModalOpen, setIsOTPModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [formData, setFormData] = useState<RegisterData | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  // React Query hooks for API calls
  const registerUser = useRegister();
  const sendOtp = useSendOtp();
  const verifyOtp = useVerifyOtp();

  const handleSubmit = async (
    values: SignupFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      setSubmitting(true);
      setEmail(values.email);
      const registerData: RegisterData = {
        name: values.fullName || "",
        email: values.email,
        phone: values.phoneNumber || "",
        password: values.password,
        role: "user",
      };

      setFormData(registerData);

      const response = await sendOtp.mutateAsync(values.email);
      if (response.status === 201) {
        console.log("Opening OTP Modal");
        setIsOTPModalOpen(true);
        toast({
          title: "OTP Sent",
          description: "Check your email for the OTP.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  const resendOtp = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Email is missing.please Try singing up again",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsLoading(true);
      const response = await sendOtp.mutateAsync(email);
      if (response.status === 201) {
        setIsOTPModalOpen(true);
        toast({
          title: "OTP Sent",
          description: "Check your email for the OTP.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to Resend OTP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleVerifyOtp = async (otp: string) => {
    if (!formData) {
      toast({
        title: "Error",
        description: "Missing registration data. Please try again.",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsLoading(true);
      const optResponse = await verifyOtp.mutateAsync({ email, otp });

      if (optResponse) {
        console.log("verifyyy OTP");
        await registerUser.mutateAsync(formData);
        toast({
          title: "Success",
          description: "Account created successfully! 🎉",
        });
        navigate("/login");
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      toast({
        title: "Invalid OTP",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="flex min-h-screen bg-black text-white">
        {/* Left side - Form */}
        <div className="flex w-full lg:w-1/2 flex-col justify-center p-8">
          <SignupForm onSubmit={handleSubmit} />
        </div>

        <div className="hidden lg:block lg:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-10"></div>
          <img
            src="/car-signup-page.jpg"
            alt="Luxury cars"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center p-12 z-20">
            <h2 className="text-4xl font-bold mb-4">
              Join the Exclusive Auction
            </h2>
            <p className="text-lg">
              Create an account to bid on luxury and performance cars from
              around the world.
            </p>
          </div>
        </div>
      </div>
      <OTPModal
        isOpen={isOTPModalOpen}
        onClose={() => setIsOTPModalOpen(false)}
        onVerify={handleVerifyOtp}
        onResend={resendOtp}
        isLoading={isLoading}
        title="Verify Your Email"
        subtitle={`We've sent a 6-digit code to ${email}. Enter it below to verify your account.`}
      />
    </>
  );
};

export default Signup;
