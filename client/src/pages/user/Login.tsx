import { Car } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FormikLoginForm from "@/components/auth/LoginForm";
import { LoginData as FormValues } from "@/types/auth";
import { useGoogleAuth, useLogin } from "@/hooks/auth/useAuth";
import { useNavigate } from "react-router-dom";
import { userLogin } from "@/store/slices/user.slice";
import {useDispatch} from "react-redux"
import { CredentialResponse } from "@react-oauth/google";


const Login: React.FC = () => {
  const { toast } = useToast();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginUser = useLogin();

  const googleLogin = useGoogleAuth()

  const handleSubmit = async (values: FormValues) => {
    try {
      console.log(values)
     const response = await loginUser.mutateAsync(values);
     console.log("userLogin",response);
     if(response.status === 200){
      console.log("User Logged in");
      dispatch(userLogin(response.data.user))
      navigate("/dashboard")
      toast({
        title: "Success!",
        description: "Login successful!",
        duration: 3000,
      });
     }
    } catch (error:any) {
      toast({
        title: "Error",
        description: error.message || "Failed to login.",
        variant: "destructive",
        duration: 3000,
      });
      return
    }  

  };

  const handleGoogleLogin = (credentialResponse:CredentialResponse) => {
    console.log("hello",credentialResponse);
    googleLogin.mutate(
      {
        credential:credentialResponse.credential,
        client_id:import.meta.env.VITE_GOOGLE_CLIENT_ID,
        role:"user"
      },{
          onSuccess:(data:any)=>{
            toast({
              title:"success",
              description:data.message || "You have successfully logged in",
            });
            dispatch(userLogin(data.user));
            navigate("/dashboard");
            toast({
              title: "Success!",
              description: "Login successful!",
              duration: 3000,
            });
          },
          onError:(error:any)=>{
            toast({
              title: "error!",
              description: error.message || "Error in Login",
              duration: 3000,
            });
          }
      }
    )
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="w-full h-screen flex">
        {/* Left side - Login Form */}
        <div className="w-full md:w-1/2 lg:w-2/5 bg-black p-6 flex items-center justify-center animate-fade-in">
          <div className="max-w-md w-full">
            <div className="flex justify-center mb-6">
              <Car size={36} className="text-[#3BE188]" />
            </div>
            
            <FormikLoginForm 
              onSubmit={handleSubmit} 
              onGoogleLogin={handleGoogleLogin} 
            />
          </div>
        </div>
        
        {/* Right side - Car Image with Gradient Overlay */}
        <div className="hidden md:block md:w-1/2 lg:w-3/5 relative">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('bmw.jpeg')" }}
          ></div>
          
          {/* Gradient overlay for text */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
          
          <div className="relative h-full flex flex-col justify-center px-12 z-10">
            <div className="max-w-xl">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-white animate-fade-in">
                Access Exclusive Auctions
              </h2>
              <p className="text-lg lg:text-xl text-white/90 animate-fade-in">
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
