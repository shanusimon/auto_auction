mport { FileCheck, Building2, UserCheck } from "lucide-react";

export const ApplicationSteps = () => {
  return (
    <div className="mt-12 border-t border-zinc-800 pt-8">
      <h3 className="text-xl font-semibold text-white mb-4 text-center">Application Process</h3>
      
      <div className="grid md:grid-cols-3 gap-6 text-center">
        <StepCard 
          icon={<FileCheck className="text-zenith-green h-6 w-6" />}
          title="Submit Application"
          description="Complete and submit this form with your information."
        />
        
        <StepCard 
          icon={<Building2 className="text-zenith-green h-6 w-6" />}
          title="Review Process"
          description="Our team will review your application within 1-3 business days."
        />
        
        <StepCard 
          icon={<UserCheck className="text-zenith-green h-6 w-6" />}
          title="Get Approved"
          description="Once approved, you'll be able to list and sell vehicles."
        />
      </div>
    </div>
  );
};

const StepCard = ({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string 
}) => {
  return (
    <div className="bg-zinc-800 p-6 rounded-lg">
      <div className="bg-zinc-700 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h4 className="text-white font-medium mb-2">{title}</h4>
      <p className="text-sm text-zenith-light-gray">{description}</p>
    </div>
  );
};
