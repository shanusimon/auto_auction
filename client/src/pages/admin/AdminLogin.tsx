import { useToast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import FormikLoginForm from "@/components/auth/LoginForm";
import { LoginData } from "@/types/auth";
import Logo from "@/components/header/Logo";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogin } from "@/hooks/auth/useAuth";
import { AdminLogin as reduxAdmin } from "@/store/slices/adminSlice";

const AdminLogin: React.FC = () => {
  const { toast } = useToast();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginAdmin = useLogin();

  async function handleSubmit(values: LoginData) {
    try {
      console.log(values);
      const response = await loginAdmin.mutateAsync(values);
      console.log("AdminLogin", response);
      if (response.status === 200) {
        console.log("Admin Login");
        dispatch(reduxAdmin(response.data.user));
        navigate("/admin/dashboard");
        toast({
          title: "Success",
          description: "Login SuccessFull!",
          duration: 3000,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to login.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#22242b] to-[#121212] p-4"
      style={{
        background:
          "linear-gradient(to bottom right, #1A1F2C, #121212) !important",
      }}
    >
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="flex flex-col items-center">
          <Logo isAdmin={true} className="mb-6" />

          <div className="flex items-center space-x-2 mb-2">
            <Shield
              className="w-6 h-6 text-[#9b87f5]"
              style={{ color: "#9b87f5 !important" }}
            />
            <h1
              className="text-2xl font-bold text-white"
              style={{ fontWeight: "bold !important" }}
            >
              Admin Portal
            </h1>
          </div>

          <p
            className="text-[#8E9196] text-center mb-6"
            style={{ color: "#8E9196 !important" }}
          >
            Secure access to the administration dashboard
          </p>
        </div>

        <Card
          className="border-0 bg-[#221F26] shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
          style={{
            backgroundColor: "#221F26 !important",
            boxShadow: "0 4px 30px rgba(0,0,0,0.1) !important",
            border: "none !important",
          }}
        >
          <CardHeader className="pb-2">
            <div
              className="w-full h-1 bg-gradient-to-r from-[#9b87f5] to-[#D6BCFA]"
              style={{
                background:
                  "linear-gradient(to right, #9b87f5, #D6BCFA) !important",
                height: "1px !important",
              }}
            ></div>
          </CardHeader>
          <CardContent
            className="pt-6"
            style={{ paddingTop: "1.5rem !important" }}
          >
            <FormikLoginForm onSubmit={handleSubmit} isAdmin={true} />

            <div className="mt-4 text-center">
              <p
                className="text-xs text-[#8E9196]"
                style={{
                  fontSize: "0.75rem !important",
                  color: "#8E9196 !important",
                  textAlign: "center",
                }}
              >
                Return to{" "}
                <a
                  href="/"
                  className="text-[#9b87f5] hover:underline"
                  style={{ color: "#9b87f5 !important" }}
                >
                  main site
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        <div
          className="text-center text-[#8E9196] text-xs"
          style={{
            color: "#8E9196 !important",
            fontSize: "0.75rem !important",
            textAlign: "center",
          }}
        >
          <p>Protected area • Unauthorized access prohibited</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
