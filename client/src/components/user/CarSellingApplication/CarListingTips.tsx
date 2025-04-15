
import { LightbulbIcon } from "lucide-react";

export const CarSellingTips = () => {
  return (
    <div className="mt-12 p-6 bg-[#1A1A1A] border border-[#333333] rounded-lg">
      <div className="flex items-center mb-3">
        <LightbulbIcon className="h-5 w-5 text-[#3BE188] mr-2" />
        <h3 className="text-lg font-semibold text-white">Tips for a Great Listing</h3>
      </div>
      <ul className="text-[#8E9196] space-y-2 list-disc pl-5">
        <li>Upload clear, well-lit photos from multiple angles</li>
        <li>Be honest about the car's condition and history</li>
        <li>Highlight unique features and recent maintenance</li>
        <li>Set a competitive price based on market research</li>
        <li>Consider using our price prediction tool to help set your asking price</li>
        <li>Set a reserve price if you have a minimum amount you need to receive</li>
        <li>Respond quickly to inquiries from potential buyers</li>
      </ul>
    </div>
  );
};
