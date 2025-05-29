import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Users, UserCheck, Car } from 'lucide-react';

interface WalletBalanceProps {
  walletBalance: number;
  CustomersCount: number;
  approvedSellers: number;
  carRegistered: number;
  loading: boolean;
  error: string | null;
  previousMonthData?: {
    walletBalance: number;
    CustomersCount: number;
    approvedSellers: number;
    carRegistered: number;
  };
}

const WalletBalance: React.FC<WalletBalanceProps> = ({
  walletBalance,
  CustomersCount,
  approvedSellers,
  carRegistered,
  loading,
  error,
  previousMonthData,
}) => {
  const calculatePercentageChange = (current: number, previous?: number): string => {
    if (!previous || previous === 0) return '+0%';
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${walletBalance.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {calculatePercentageChange(walletBalance, previousMonthData?.walletBalance)} from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Number of Customers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{CustomersCount.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {calculatePercentageChange(CustomersCount, previousMonthData?.CustomersCount)} from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Approved Sellers</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{approvedSellers.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {calculatePercentageChange(approvedSellers, previousMonthData?.approvedSellers)} from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cars Registered</CardTitle>
          <Car className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{carRegistered.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {calculatePercentageChange(carRegistered, previousMonthData?.carRegistered)} from last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletBalance;