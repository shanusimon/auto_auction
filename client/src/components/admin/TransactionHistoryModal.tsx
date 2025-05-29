import { createPortal } from 'react-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { X, Download, Filter, Search } from 'lucide-react';
import { useState } from 'react';

interface TransactionHistory {
  transactionId: string;
  userName: string;
  carDetails: {
    make: string;
    model: string;
    year: number;
  };
  amountReceived: number;
  commissionAmount: number;
  time: Date;
}

interface TransactionHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactions: TransactionHistory[];
  loading: boolean;
  error: string | null;
}

const TransactionHistoryModal: React.FC<TransactionHistoryModalProps> = ({
  open,
  onOpenChange,
  transactions,
  loading,
  error,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Badge className="bg-green-100 text-green-800 border-green-300">✓ Completed</Badge>;
      case 'Processing':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">⏳ Processing</Badge>;
      case 'Failed':
        return <Badge className="bg-red-100 text-red-800 border-red-300">✗ Failed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Commission':
        return 'text-blue-700 bg-blue-100 px-3 py-1.5 rounded-full font-medium';
      case 'Payment':
        return 'text-green-700 bg-green-100 px-3 py-1.5 rounded-full font-medium';
      case 'Refund':
        return 'text-red-700 bg-red-100 px-3 py-1.5 rounded-full font-medium';
      default:
        return 'text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full font-medium';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${transaction.carDetails.make} ${transaction.carDetails.model}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    const type = transaction.commissionAmount > 0 ? 'Commission' : 'Payment';
    return matchesSearch && type.toLowerCase() === filterType.toLowerCase();
  });

  const totalRevenue = transactions.reduce((sum, t) => sum + t.amountReceived, 0);
  const totalCommission = transactions.reduce((sum, t) => sum + t.commissionAmount, 0);
  const totalNet = totalRevenue - totalCommission;

  if (!open) return null;

  const portalContent = (
    <div className="fixed inset-0 z-[9999] bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
            <p className="text-gray-600 mt-1">Comprehensive view of all transactions</p>
          </div>
          <div className="flex items-center gap-4">
    
            <button 
              onClick={() => onOpenChange(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mt-6">
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl">
            <div className="text-green-800 text-sm font-medium">Total Revenue</div>
            <div className="text-2xl font-bold text-green-900">${totalRevenue.toLocaleString()}</div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
            <div className="text-blue-800 text-sm font-medium">Total Commission</div>
            <div className="text-2xl font-bold text-blue-900">${totalCommission.toLocaleString()}</div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl">
            <div className="text-purple-800 text-sm font-medium">Net Amount</div>
            <div className="text-2xl font-bold text-purple-900">${totalNet.toLocaleString()}</div>
          </div>
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl">
            <div className="text-gray-800 text-sm font-medium">Total Transactions</div>
            <div className="text-2xl font-bold text-gray-900">{transactions.length}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mt-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="commission">Commission</option>
              <option value="payment">Payment</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4 text-lg">Loading transactions...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-xl mb-2">⚠️</div>
              <p className="text-red-600 text-lg">{error}</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-48 py-4 text-base font-semibold">Transaction ID</TableHead>
                  <TableHead className="w-40 py-4 text-base font-semibold">Date & Time</TableHead>
                  <TableHead className="w-32 py-4 text-base font-semibold">Type</TableHead>
                  <TableHead className="w-48 py-4 text-base font-semibold">Customer</TableHead>
                  <TableHead className="w-64 py-4 text-base font-semibold">Vehicle Details</TableHead>
                  <TableHead className="w-36 py-4 text-base font-semibold">Amount Received</TableHead>
                  <TableHead className="w-36 py-4 text-base font-semibold">Commission</TableHead>
                  <TableHead className="w-36 py-4 text-base font-semibold">Net Amount</TableHead>
                  <TableHead className="w-32 py-4 text-base font-semibold">Status</TableHead>
                  <TableHead className="py-4 text-base font-semibold">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-16">
                      <div className="text-gray-500">
                        <div className="text-4xl mb-4">📊</div>
                        <p className="text-xl">No transactions found</p>
                        <p className="text-sm mt-2">Try adjusting your search or filter criteria</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction, index) => {
                    const type = transaction.commissionAmount > 0 ? 'Commission' : 'Payment';
                    const amountReceived = transaction.amountReceived;
                    const commission = transaction.commissionAmount;
                    const netAmount = amountReceived + commission;
                    const status = 'Completed';

                    return (
                      <TableRow key={transaction.transactionId} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                        <TableCell className="py-6">
                          <div className="font-mono text-sm bg-gray-100 px-3 py-2 rounded">
                            {transaction.transactionId}
                          </div>
                        </TableCell>
                        <TableCell className="py-6">
                          <div>
                            <div className="font-semibold text-gray-900">
                              {new Date(transaction.time).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                            <div className="text-gray-500 text-sm">
                              {new Date(transaction.time).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-6">
                          <span className={getTypeColor(type)}>{type}</span>
                        </TableCell>
                        <TableCell className="py-6">
                          <div>
                            <div className="font-semibold text-gray-900 text-base">{transaction.userName}</div>
                            <div className="text-gray-500 text-sm">Customer</div>
                          </div>
                        </TableCell>
                        <TableCell className="py-6">
                          <div>
                            <div className="font-semibold text-gray-900 text-base">
                              {transaction.carDetails.make} {transaction.carDetails.model}
                            </div>
                            <div className="text-gray-500 text-sm">
                              {transaction.carDetails.year} Model
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-6">
                          <div className="text-right">
                            <div className="font-bold text-green-600 text-lg">
                              ${amountReceived.toLocaleString()}
                            </div>
                            <div className="text-gray-500 text-sm">Received</div>
                          </div>
                        </TableCell>
                        <TableCell className="py-6">
                          <div className="text-right">
                            <div className="font-bold text-blue-600 text-lg">
                              ${commission.toLocaleString()}
                            </div>
                            <div className="text-gray-500 text-sm">Commission</div>
                          </div>
                        </TableCell>
                        <TableCell className="py-6">
                          <div className="text-right">
                            <div className={`font-bold text-lg ${netAmount >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                              ${Math.abs(netAmount).toLocaleString()}
                            </div>
                            <div className="text-gray-500 text-sm">Net</div>
                          </div>
                        </TableCell>
                        <TableCell className="py-6">
                          {getStatusBadge(status)}
                        </TableCell>
                        <TableCell className="py-6">
                          <div className="text-gray-700 max-w-md">
                            <p className="font-medium">
                              {type} transaction for vehicle sale
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Customer: {transaction.userName} • Vehicle: {transaction.carDetails.make} {transaction.carDetails.model} ({transaction.carDetails.year})
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(portalContent, document.body);
};

export default TransactionHistoryModal;