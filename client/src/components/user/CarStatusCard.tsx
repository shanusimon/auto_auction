import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MessageSquare, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface Bid {
  amount: number;
  bidder: string;
  timestamp: string;
}

interface Comment {
  text: string;
  author: string;
  timestamp: string;
}

interface CarStatusCardProps {
  car: {
    id: string;
    make: string;
    model: string;
    year: number;
    status: 'pending' | 'approved' | 'rejected';
    rejectionReason?: string;
    bids: Bid[];
    comments: Comment[];
  };
}

const CarStatusCard: React.FC<CarStatusCardProps> = ({ car }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <Card className="bg-zinc-800 border-zinc-700 mb-4">
        <CardHeader>
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">{car.year} {car.make} {car.model}</h3>
            <Badge className={`${getStatusColor(car.status)} text-white`}>
              {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {car.rejectionReason && (
            <motion.div 
              className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-red-400">Rejection reason: {car.rejectionReason}</p>
            </motion.div>
          )}

          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                <MessageSquare size={18} />
                Comments
              </h4>
              <div className="space-y-2">
                {car.comments.map((comment, index) => (
                  <motion.div 
                    key={index} 
                    className="bg-zinc-700 p-3 rounded-md"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <User size={14} className="text-gray-400" />
                      <span className="text-gray-400 text-sm">{comment.author}</span>
                    </div>
                    <p className="text-white">{comment.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock size={14} className="text-gray-400" />
                      <span className="text-gray-400 text-sm">{comment.timestamp}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-white mb-2">Current Bids</h4>
              <div className="space-y-2">
                {car.bids.map((bid, index) => (
                  <motion.div 
                    key={index} 
                    className="bg-zinc-700 p-3 rounded-md"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-gray-400" />
                        <span className="text-gray-400">{bid.bidder}</span>
                      </div>
                      <span className="text-[#3BE188] font-semibold">${bid.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock size={14} className="text-gray-400" />
                      <span className="text-gray-400 text-sm">{bid.timestamp}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <motion.div 
            className="w-full"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Button className="w-full bg-[#3BE188] hover:bg-[#2dd077] text-black">
              View Details
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CarStatusCard;
