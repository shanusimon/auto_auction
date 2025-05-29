import { useNavigate } from 'react-router-dom';
import { XCircle, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const PaymentCancel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="bg-zinc-800 border-zinc-700 text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
              <XCircle size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Payment Cancelled</h1>
            <p className="text-gray-300 mt-2">
              Your payment was cancelled. No charges were made to your account.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-zinc-700 rounded-lg p-4 text-left">
              <h3 className="text-white font-semibold mb-3">What happened?</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>You chose to cancel the payment process</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>No payment was processed</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Your bid remains unpaid and may expire</span>
                </li>
              </ul>
            </div>

            <div className="bg-zinc-700 rounded-lg p-4 text-left">
              <h3 className="text-white font-semibold mb-3">Next Steps</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-[#3BE188] rounded-full mt-2 flex-shrink-0"></div>
                  <span>You can try the payment again anytime</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-[#3BE188] rounded-full mt-2 flex-shrink-0"></div>
                  <span>Check your bid status in "My Bids"</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-[#3BE188] rounded-full mt-2 flex-shrink-0"></div>
                  <span>Contact support if you need assistance</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <Button 
                className="w-full bg-[#3BE188] hover:bg-[#2da86f] text-black"
                onClick={() => navigate('/user/bids')}
              >
                <RotateCcw size={16} className="mr-2" />
                Try Payment Again
              </Button>
              
              <Button 
                className="w-full bg-zinc-700 hover:bg-zinc-600 text-white"
                onClick={() => navigate('/user/bids')}
              >
                View My Bids
              </Button>
              
              <Button 
                variant="ghost"
                className="w-full text-gray-300 hover:text-white hover:bg-zinc-700"
                onClick={() => navigate('/user/dashboard')}
              >
                <Home size={16} className="mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentCancel;
