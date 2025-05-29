// src/components/admin/AdminDashboard.tsx
import { useState } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import WalletBalance from '@/components/admin/WalletBalance';
import RevenueChart from '@/components/admin/RevenueChart';
import AuctionAnalytics from '@/components/admin/AuctionAnalytics';
import TransactionHistoryModal from '@/components/admin/TransactionHistoryModal';
import { Button } from '@/components/ui/button';
import { Receipt } from 'lucide-react';
import { useDashboardDetails } from '@/hooks/admin/useDashBoardData';

const AdminDashboard: React.FC = () => {
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const { data, loading, error } = useDashboardDetails();

  // Debug error
  if (error) {
    console.error('Dashboard error:', error);
  }

  const previousMonthData = {
    walletBalance: data?.walletBalance ? data.walletBalance * 0.875 : 0,
    CustomersCount: data?.CustomersCount ? data.CustomersCount * 0.817 : 0,
    approvedSellers: data?.approvedSellers ? data.approvedSellers * 0.903 : 0,
    carRegistered: data?.carRegistered ? data.carRegistered * 0.749 : 0,
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
      }}
    >
      <Sidebar />
      <div
        style={{
          marginLeft: '250px',
          width: 'calc(100% - 250px)',
          transition: 'margin-left 0.3s ease, width 0.3s ease',
        }}
      >
        <Header title="Dashboard" />
        <main
          style={{
            padding: '24px',
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Admin Dashboard</h2>
            <Button
              onClick={() => setShowTransactionModal(true)}
              className="flex items-center gap-2"
            >
              <Receipt size={16} />
              Transaction History
            </Button>
          </div>

          <WalletBalance
            walletBalance={data?.walletBalance || 0}
            CustomersCount={data?.CustomersCount || 0}
            approvedSellers={data?.approvedSellers || 0}
            carRegistered={data?.carRegistered || 0}
            loading={loading}
            error={error}
            previousMonthData={previousMonthData}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <RevenueChart />
            <AuctionAnalytics stats={data?.stats || []} loading={loading} error={error} />
          </div>

          <TransactionHistoryModal
            open={showTransactionModal}
            onOpenChange={setShowTransactionModal}
            transactions={data?.transactionHistory || []}
            loading={loading}
            error={error}
          />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;