import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Car, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: ""
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    toast({
      title: "Success!",
      description: "Login successful!",
      duration: 3000,
    });
  };

  const handleGoogleLogin = () => {
    toast({
      title: "Google Authentication",
      description: "Redirecting to Google login...",
      duration: 3000,
    });
    // Google authentication logic would go here
  };

  return (
    <div className="!min-h-screen !w-full !flex !items-center !justify-center !overflow-hidden">
      <div className="!w-full !h-screen !flex">
        {/* Left side - Login Form */}
        <div className="!w-full md:!w-1/2 lg:!w-2/5 !bg-[#121212] !p-6 !flex !items-center !justify-center !animate-fade-in">
          <div className="!max-w-md !w-full">
            <div className="!flex !justify-center !mb-6">
              <Car size={36} className="!text-[#3BE188]" />
            </div>
            
            <h1 className="!text-3xl !font-bold !text-center !mb-2 !text-white">
              Sign in to your account
            </h1>
            <p className="!text-center !mb-8 !text-[#8E9196]">
              Welcome back to our exclusive car auction platform
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="!mb-5">
                <label 
                  htmlFor="email" 
                  className="!block !text-sm !mb-2 !text-[#8E9196]"
                >
                  Email
                </label>
                <div className="!relative">
                  <Mail 
                    className="!absolute !left-3 !top-1/2 !-translate-y-1/2 !text-[#8E9196]" 
                    size={20}
                  />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="name@example.com"
                    className="!h-11 !w-full !rounded !pl-10 !pr-4 !border-0 !outline-none !transition-all !duration-300 !ease-in-out !bg-[#2A2A2A] !text-white"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="!mb-5">
                <div className="!flex !justify-between !items-center !mb-2">
                  <label 
                    htmlFor="password" 
                    className="!block !text-sm !text-[#8E9196]"
                  >
                    Password
                  </label>
                  <a 
                    href="#" 
                    className="!text-sm !text-[#3BE188] hover:!underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="!relative">
                  <Lock 
                    className="!absolute !left-3 !top-1/2 !-translate-y-1/2 !text-[#8E9196]" 
                    size={20}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    className="!h-11 !w-full !rounded !pl-10 !pr-10 !border-0 !outline-none !transition-all !duration-300 !ease-in-out !bg-[#2A2A2A] !text-white"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <div 
                    className="!absolute !right-3 !top-1/2 !-translate-y-1/2 !cursor-pointer !text-[#8E9196] hover:!text-white !transition-colors !duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </div>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="!w-full !font-medium !rounded !py-3 !px-4 !transition-all !duration-300 !bg-[#3BE188] !text-black hover:!opacity-90 hover:!scale-[1.01] active:!scale-[0.99]"
              >
                Sign in
              </button>
            </form>
            
            <div className="!relative !flex !items-center !justify-center !my-6">
              <div className="!absolute !h-px !w-full !bg-[#2A2A2A]"></div>
              <span className="!relative !px-4 !text-sm !bg-[#121212] !text-[#8E9196]">
                OR CONTINUE WITH
              </span>
            </div>
            
            <div>
              <button 
                type="button" 
                className="!w-full !flex !justify-center !items-center !rounded !py-2.5 !px-4 !bg-[#2A2A2A] !text-white hover:!opacity-90 !transition-opacity"
                onClick={handleGoogleLogin}
              >
                Google
              </button>
            </div>
            
            <p className="!text-center !mt-8 !text-sm !text-[#8E9196]">
              Don't have an account?{" "}
              <Link 
                to="/signup" 
                className="!text-[#3BE188] hover:!underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
        
        {/* Right side - Car Image with Gradient Overlay */}
        <div className="!hidden md:!block md:!w-1/2 lg:!w-3/5 !relative">
          <div 
            className="!absolute !inset-0 !bg-cover !bg-center !bg-no-repeat"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1493962853295-0fd70327578a?auto=format&fit=crop&q=80')" }}
          ></div>
          
          {/* Gradient overlay for text */}
          <div className="!absolute !inset-0 !bg-gradient-to-r !from-black/80 !to-transparent"></div>
          
          <div className="!relative !h-full !flex !flex-col !justify-center !px-12 !z-10">
            <div className="!max-w-xl">
              <h2 className="!text-4xl lg:!text-5xl !font-bold !mb-4 !text-white !animate-fade-in">
                Access Exclusive Auctions
              </h2>
              <p className="!text-lg lg:!text-xl !text-white/90 !animate-fade-in">
                Sign in to your account to bid on luxury and performance cars from around the world.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
