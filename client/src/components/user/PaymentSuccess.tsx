import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Download, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Header from '../header/Header';
import UserSidebar from './Sidebar';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { verify_payment } from '@/services/payment/paymentServices';

interface PaymentDetails {
  transactionId: string;
  amount: number;
  paymentMethod: string;
  date: string;
  carDetails: string;
  auctionId: string;
  receiptUrl?: string; // Add receiptUrl
}

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      const sessionId = searchParams.get('session_id');
      if (!sessionId) {
        const msg = 'Session ID is missing';
        setError(msg);
        toast.error(msg);
        setIsLoading(false);
        return;
      }

      try {
        const response = await verify_payment(sessionId);
        if (response.success) {
          const { auctionWon, session } = response.data;

          // Validate required fields
          if (!auctionWon || !session) {
            throw new Error('Invalid response data');
          }

          setPaymentDetails({
            transactionId: session.payment_intent || sessionId,
            amount: (auctionWon.amount || 0) + (auctionWon.platformCharge || 0),
            paymentMethod: session.payment_method_types?.[0]
              ? session.payment_method_types[0] === 'card'
                ? `**** **** **** ${session.payment_method_details?.card?.last4 || '****'}`
                : session.payment_method_types[0]
              : 'Unknown',
            date: session.created
              ? new Date(session.created * 1000).toLocaleDateString()
              : new Date().toLocaleDateString(),
            carDetails: auctionWon.carId
              ? `${auctionWon.carId.year || ''} ${auctionWon.carId.make || ''} ${auctionWon.carId.model || ''}`.trim() || 'Unknown Car'
              : 'Unknown Car',
            auctionId: auctionWon._id || 'Unknown',
            receiptUrl: auctionWon.receiptUrl, // Include receiptUrl
          });

          toast.success('Payment verified successfully!');
        } else {
          const msg = response.message || 'Payment verification failed';
          setError(msg);
          toast.error(msg);
        }
      } catch (err: any) {
        const msg = err.message || 'Failed to verify payment';
        setError(msg);
        toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [searchParams]); // Removed undefined refetch

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (error || !paymentDetails) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-white flex flex-col items-center gap-4">
          <p>Error: {error || 'No payment details available'}</p>
          <Button
            variant="ghost"
            className="text-gray-300 hover:text-white hover:bg-zinc-700"
            onClick={() => navigate('/user/dashboard')}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-zinc-900">
        <UserSidebar />
        <div className="flex-1 p-4 flex items-center justify-center">
          <div className="max-w-md w-full">
            <Card className="bg-zinc-800 border-zinc-700 text-center">
              <CardHeader className="pb-4">
                <div className="mx-auto w-16 h-16 bg-[#3BE188] rounded-full flex items-center justify-center mb-4">
                  <CheckCircle size={32} className="text-black" />
                </div>
                <h1 className="text-2xl font-bold text-white">Payment Successful!</h1>
                <p className="text-gray-300 mt-2">
                  Your payment for Auction ID: {paymentDetails.auctionId} has been processed successfully.
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Payment Info */}
                <div className="bg-zinc-700 rounded-lg p-4 text-left">
                  <h3 className="text-white font-semibold mb-3">Payment Details</h3>
                  <div className="space-y-2 text-sm">
                    <InfoRow label="Transaction ID" value={paymentDetails.transactionId} />
                    <InfoRow label="Car" value={paymentDetails.carDetails} />
                    <InfoRow
                      label="Amount"
                      value={`$${paymentDetails.amount.toLocaleString()}`}
                      valueClass="text-[#3BE188] font-semibold"
                    />
                    <InfoRow label="Payment Method" value={paymentDetails.paymentMethod} />
                    <InfoRow label="Date" value={paymentDetails.date} />
                  </div>
                </div>

                {/* Next Steps */}
                <div className="bg-zinc-700 rounded-lg p-4 text-left">
                  <h3 className="text-white font-semibold mb-3">Next Steps</h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <BulletItem text="You will receive an email confirmation shortly" />
                    <BulletItem text="The seller will be notified of your payment" />
                    <BulletItem text="Pickup details will be shared within 24 hours" />
                  </ul>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Button
                    className="w-full bg-zinc-700 hover:bg-zinc-600 text-white"
                    onClick={() => {
                      if (paymentDetails.receiptUrl) {
                        window.open(paymentDetails.receiptUrl, '_blank');
                      } else {
                        toast.error('Receipt not available');
                      }
                    }}
                    disabled={!paymentDetails.receiptUrl}
                  >
                    <Download size={16} className="mr-2" />
                    Download Receipt
                  </Button>

                  <Button
                    className="w-full bg-[#3BE188] hover:bg-[#2da86f] text-black"
                    onClick={() => navigate('/user/bids')}
                  >
                    <Calendar size={16} className="mr-2" />
                    View My Bids
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full text-gray-300 hover:text-white hover:bg-zinc-700"
                    onClick={() => navigate('/user/dashboard')}
                  >
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

// Utility components
const InfoRow = ({ label, value, valueClass = 'text-white' }: { label: string; value: string; valueClass?: string }) => (
  <div className="flex justify-between">
    <span className="text-gray-300">{label}:</span>
    <span className={valueClass}>{value}</span>
  </div>
);

const BulletItem = ({ text }: { text: string }) => (
  <li className="flex items-start gap-2">
    <div className="w-2 h-2 bg-[#3BE188] rounded-full mt-2 flex-shrink-0" />
    <span>{text}</span>
  </li>
);

export default PaymentSuccess;