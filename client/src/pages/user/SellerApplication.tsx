import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/header/Header";
import { SellerApplicationForm } from "@/components/user/SellerApplicationFrom";
import { useGetIsSeller } from "@/hooks/user/useSeller";
import { CarListingForm } from "@/components/user/CarSellingApplication/CarListingFrom";


const SellerApplication = () => {
  const navigate = useNavigate();
  const { data, error, isPending } = useGetIsSeller();
  console.log(data)

  const isApprovedSeller = data?.data?.isSeller;
  const sellerDetails = data?.data?.sellerDetails; 
  const approvalStatus = sellerDetails?.approvalStatus;

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <div className="container max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#8E9196] hover:text-[#3BE188] transition-colors mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>
        
        <div className="bg-[#121212] rounded-lg p-6 md:p-8 border border-[#333333]">
          {isPending ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-[#3BE188] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white">Checking seller status...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">Error checking seller status</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-[#333333] text-white px-4 py-2 rounded-md hover:bg-[#444444]"
              >
                Try Again
              </button>
            </div>
          ) : isApprovedSeller ? (
            <>
              <CarListingForm/>
            </>
          ) : sellerDetails && approvalStatus === "pending" ? (
            <div className="text-center py-12">
              <h1 className="text-3xl font-bold text-white mb-3">Application Under Review</h1>
              <p className="text-[#8E9196] max-w-lg mx-auto mb-4">
                Your seller application is being reviewed. Please wait 2-3 business days for approval.
              </p>
              <p className="text-[#3BE188]">
                We'll notify you once your application has been processed.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-3">Seller Application</h1>
                <p className="text-[#8E9196] max-w-lg mx-auto">
                  {sellerDetails && approvalStatus === "rejected" 
                    ? "Your previous application was rejected. You may reapply below."
                    : "To start selling cars on our platform, we need some information to verify your identity and set up your seller account."
                  }
                </p>
              </div>
              <SellerApplicationForm />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerApplication;