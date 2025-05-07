import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Clock, DollarSign, User } from 'lucide-react';
import { useBidHistory } from '@/hooks/user/useGetBidHistory';


interface BidUser {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
}

interface Bid {
  _id: string;
  carId: string;
  userId: BidUser;
  amount: number;
  depositHeld: number;
  status: 'active' | 'outbid' | 'won' | 'lost' | 'refunded';
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface BidHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  carId: string;
  carName: string;
}

const getBadgeColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-500';
    case 'outbid':
      return 'bg-red-500';
    case 'won':
      return 'bg-blue-500';
    case 'refunded':
      return 'bg-amber-500';
    default:
      return 'bg-gray-500';
  }
};

const BidHistoryModal: React.FC<BidHistoryModalProps> = ({
  isOpen,
  onClose,
  carId,
  carName
}) => {

  const { data: bidHistoryData, isLoading: isBidHistoryLoading } = useBidHistory(carId);
  
  const bids = (bidHistoryData?.bids || bidHistoryData?.data || []).slice().reverse();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="bg-zinc-800 border-zinc-700 text-white w-[1000px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">{carName} - Bid History</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-3 py-3 bg-zinc-700 px-4 rounded-md mb-4">
          <DollarSign size={20} className="text-[#3BE188]" />
          <p className="text-sm">
            Showing all bids for this auction. The highest active bid is currently winning.
          </p>
        </div>

        {isBidHistoryLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Loading bid history...</p>
          </div>
        ) : bids.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="border-b border-zinc-700">
                <TableHead className="text-gray-300">Bidder</TableHead>
                <TableHead className="text-gray-300">Amount</TableHead>
                <TableHead className="text-gray-300">Deposit</TableHead>
                <TableHead className="text-gray-300">Time</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bids.map((bid: Bid) => (
                <TableRow key={bid._id} className="border-t border-zinc-700 hover:bg-zinc-700">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        {bid.userId.profileImage ? (
                          <AvatarImage src={bid.userId.profileImage} alt={bid.userId.name} />
                        ) : (
                          <AvatarFallback className="bg-zinc-600 text-white">
                            {bid.userId.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className="font-medium text-white">{bid.userId.name}</p>
                        <p className="text-xs text-gray-400">{bid.userId.email || ''}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-[#3BE188] font-semibold">
                    ${bid.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-white">
                    ${bid.depositHeld.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {formatDistanceToNow(new Date(bid.timestamp), { addSuffix: true })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getBadgeColor(bid.status)}`}>
                      {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <User className="mx-auto h-10 w-10 text-gray-400 mb-2" />
            <p className="text-gray-400">No bids have been placed yet</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
  
export default BidHistoryModal;