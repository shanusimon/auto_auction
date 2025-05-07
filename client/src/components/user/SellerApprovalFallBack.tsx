import { motion } from 'framer-motion';
import { AlertTriangle, ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const SellerApprovalFallback: React.FC = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full py-20 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
        className="w-20 h-20 bg-zinc-700 rounded-full flex items-center justify-center mb-6"
      >
        <ShieldX size={40} className="text-zinc-400" />
      </motion.div>
      
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center"
      >
        Not Approved as Seller
      </motion.h2>
      
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-zinc-400 text-center max-w-md mb-8"
      >
        Your seller application is pending review. Once approved, you'll be able to list cars for auction and manage your sales from this dashboard.
      </motion.p>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="space-y-4 w-full max-w-md"
      >
        <div className="p-4 bg-zinc-800 border border-zinc-700 rounded-md">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-yellow-500" />
            <h3 className="font-medium text-white">Application Status</h3>
          </div>
          <p className="mt-2 text-zinc-400 text-sm">
            Our team is reviewing your application. This process typically takes 1-2 business days.
          </p>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-8"
      >
        <Link to="/user/dashboard">
          <Button className="bg-[#3BE188] hover:bg-[#2dd077] text-black">
            Return to Dashboard
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default SellerApprovalFallback;
