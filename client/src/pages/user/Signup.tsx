import React, { useState } from "react";
import SignupForm from "../../components/auth/SignupForm";
// import { useRegister } from "../../hooks/useAuth";
import { SignupFormValues, RegisterData } from "../../types/auth";
import OTPModal from "@/components/modals/OTPmodal";


const Signup: React.FC = () => {
  // const { mutate: register } = useRegister();

  const [isOTPModalOpen,setIsOTPModalOpen] = useState<boolean>(false)
  const [isLoading,setIsLoading] = useState<boolean>(false);
  const [email,setEmail] = useState<string>("")



  const handleSubmit = async (values: SignupFormValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    const registerData: RegisterData = {
      name: values.fullName,
      phone:values.phoneNumber,
      email: values.email,
      password: values.password,
      role:"user"
    };

    setEmail(values.email)

    setIsOTPModalOpen(true);

    await handleOtpSend(registerData,setSubmitting)
  
    // await new Promise(resolve => setTimeout(resolve, 2000));
    // register(registerData, {
    //   onSuccess: () => {
    //     console.log("Registration successful");
    //     setSubmitting(false);
    //   },
    //   onError: (error: Error) => {
    //     console.error("Registration failed:", error);
    //     setSubmitting(false);
    //   },
    // });
  };  
  async function handleOtpSend(registerData: RegisterData, setSubmitting: (isSubmitting: boolean) => void) {
    setIsLoading(true);
    try {
      console.log("Sending OTP to:", registerData.email);
      console.log("OTP Sent Successfully!");
    } catch (error) {
      console.error("Error sending OTP:", error);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  }
  

  return (
    <>
    <div className="flex min-h-screen bg-black text-white">
      {/* Left side - Form */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center p-8">
        <SignupForm onSubmit={handleSubmit}  />
      </div>

      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-10"></div>
        <img
          src="/car-signup-page.jpg"
          alt="Luxury cars"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-center p-12 z-20">
          <h2 className="text-4xl font-bold mb-4">Join the Exclusive Auction</h2>
          <p className="text-lg">
            Create an account to bid on luxury and performance cars from around the world.
          </p>
        </div>
      </div>
    </div>
    <OTPModal
    isOpen={isOTPModalOpen}
    onClose={()=>setIsOTPModalOpen(false)}
    onVerify={()=>console.log("otp verified")}
    onResend={()=>console.log("OTP Resend")}
    isLoading={isLoading}
    title="Verify Your Email"
    subtitle={`We've sent a 6-digit code to ${email}. Enter it below to verify your account.`}
    />
    </>
  );
};

export default Signup;