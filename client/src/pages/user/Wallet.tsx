import { useState, useEffect } from 'react';
import UserSidebar from '@/components/user/Sidebar';
import { Wallet, CreditCard, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/header/Header';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAddMoneyToWallet } from '@/hooks/user/userDashboard';
import { useGetWalletTransaction } from '@/hooks/user/userDashboard';
import { useGetWalletBalance } from '@/hooks/user/userDashboard';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';

const WalletPage: React.FC = () => {
    const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
    const [amount, setAmount] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [animatedBalance, setAnimatedBalance] = useState(0);
    const [animatedReservedBalance, setAnimatedReservedBalance] = useState(0);
    const limit = 6;
    const { toast } = useToast();
    const { mutateAsync, isPending: mutationPending } = useAddMoneyToWallet();
    const stripe = useStripe();
    const elements = useElements();
    const queryClient = useQueryClient();

    const {
        data: transactionsData,
        isLoading: isTransactionsLoading,
    } = useGetWalletTransaction(currentPage, limit);
    
    const {
        data: balanceData,
        isLoading: isBalanceLoading,
    } = useGetWalletBalance();
    
    const transactions = transactionsData?.transactions || [];
    const totalTransactions = transactionsData?.total || 0;
    const totalPages = Math.ceil(totalTransactions / limit);
    const walletBalance = balanceData?.walletData?.availableBalance || 0;
    const reservedBalance = balanceData?.walletData?.reservedBalance || 0;

    useEffect(() => {
        if (!isBalanceLoading) {
            const duration = 1000;
            const startTime = Date.now();
            const startBalance = animatedBalance;
            const startReservedBalance = animatedReservedBalance;
            
            const animateBalance = () => {
                const now = Date.now();
                const elapsedTime = now - startTime;
                const progress = Math.min(elapsedTime / duration, 1);

                const easeOutQuad = (t:any) => t * (2 - t);
                const easedProgress = easeOutQuad(progress);
                
                setAnimatedBalance(startBalance + (walletBalance - startBalance) * easedProgress);
                setAnimatedReservedBalance(startReservedBalance + (reservedBalance - startReservedBalance) * easedProgress);
                
                if (progress < 1) {
                    requestAnimationFrame(animateBalance);
                }
            };
            
            animateBalance();
        }
    }, [isBalanceLoading, walletBalance, reservedBalance]);

    const handleAddMoney = async () => {
        const parsedAmount = parseFloat(amount);

        if (!amount || parsedAmount <= 0) {
            toast({
                title: 'Invalid Amount',
                description: 'Please enter a valid amount greater than 0',
                variant: 'destructive',
            });
            return;
        }

        try {
            const response = await mutateAsync({ amount: parsedAmount });
            const { clientSecret } = response;
            console.log(clientSecret, "Client Secret received");

            if (!stripe || !elements) {
                throw new Error('Stripe or Elements not loaded');
            }

            const cardElement = elements.getElement(CardElement);
            if (!cardElement) {
                throw new Error('Card element not found');
            }

            setIsProcessingPayment(true);

            const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                },
            });

            if (stripeError) {
                toast({
                    title: 'Stripe Error',
                    description: stripeError.message,
                    variant: 'destructive',
                });
                return;
            }

            toast({
                title: 'Payment Successful',
                description: `Successfully added $${parsedAmount} to your wallet`,
            });
            
            await new Promise((resolve) => setTimeout(resolve, 2000));

            await Promise.all([
                queryClient.refetchQueries({ queryKey: ['walletBalance'] }),
                queryClient.refetchQueries({ queryKey: ['walletTransactions'] }),
            ]);
            setIsProcessingPayment(false);

        } catch (error: any) {
            toast({
                title: 'Payment Initiation Failed',
                description: error.message || 'An error occurred while initiating payment',
                variant: 'destructive',
            });
        } finally {
            setIsAddMoneyOpen(false);
            setAmount('');
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    return (
        <>
            <Header />
            <div className="flex h-screen bg-zinc-900">
                <UserSidebar />
                <div className="flex-1 p-8 overflow-auto">
                    <div className="max-w-5xl mx-auto">
                        <motion.h1 
                            className="text-3xl font-bold text-white mb-6"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            My Wallet
                        </motion.h1>
                        
                        {/* Wallet Balance and Reserved Balance Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                            >
                                <Card className="bg-zinc-800 border-zinc-700 h-full">
                                    <CardHeader>
                                        <CardTitle className="text-white flex items-center gap-2">
                                            <Wallet className="h-5 w-5 text-[#3BE188]" />
                                            Available Balance
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-col">
                                            <motion.span 
                                                className="text-3xl font-bold text-white"
                                                key={walletBalance} // Force animation to restart when value changes
                                                initial={{ scale: 0.8 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                            >
                                                ${isBalanceLoading ? '...' : animatedBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                            </motion.span>
                                            <span className="text-gray-400 text-sm mt-1">
                                                Available for bidding and purchases
                                            </span>
                                        </div>
                                        <div className="mt-6">
                                            <Button
                                                onClick={() => setIsAddMoneyOpen(true)}
                                                className="bg-[#3BE188] hover:bg-[#32c676] text-black"
                                                disabled={mutationPending}
                                            >
                                                <CreditCard className="mr-2 h-4 w-4" /> Add Money
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                            
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <Card className="bg-zinc-800 border-zinc-700 h-full">
                                    <CardHeader>
                                        <CardTitle className="text-white flex items-center gap-2">
                                            <Lock className="h-5 w-5 text-yellow-400" />
                                            Reserved Balance
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-col">
                                            <motion.span 
                                                className="text-3xl font-bold text-white"
                                                key={reservedBalance} // Force animation to restart when value changes
                                                initial={{ scale: 0.8 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                            >
                                                ${isBalanceLoading ? '...' : animatedReservedBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                            </motion.span>
                                            <span className="text-gray-400 text-sm mt-1">
                                                Reserved for active bids and pending transactions
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Transaction History */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <Card className="bg-zinc-800 border-zinc-700">
                                <CardHeader>
                                    <CardTitle className="text-white">Transaction History</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader className="bg-zinc-900">
                                            <TableRow className="border-zinc-700">
                                                <TableHead className="text-gray-300">Date</TableHead>
                                                <TableHead className="text-gray-300">Invoice</TableHead>
                                                <TableHead className="text-gray-300">Type</TableHead>
                                                <TableHead className="text-gray-300 text-right">Amount</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {isTransactionsLoading ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-gray-300 text-center">
                                                        <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                                            className="inline-block w-5 h-5 border-2 border-t-[#3BE188] border-r-transparent border-b-transparent border-l-transparent rounded-full mr-2"
                                                        />
                                                        Loading transactions...
                                                    </TableCell>
                                                </TableRow>
                                            ) : transactions.length > 0 ? (
                                                transactions.map((transaction: any, index: number) => {
                                                    // Updated logic to include deposit_release as a type that adds to wallet
                                                    const addsToWallet = ["deposit", "outbid", "deposit_release"].includes(transaction.type);
                                                    const typeStyle =
                                                        transaction.status === "completed"
                                                            ? addsToWallet
                                                                ? "bg-green-500/20 text-green-500"
                                                                : "bg-red-500/20 text-red-500"
                                                            : transaction.status === "pending"
                                                                ? "bg-yellow-500/20 text-yellow-500"
                                                                : "bg-gray-500/20 text-gray-500";
                                                    const amountStyle =
                                                        transaction.status === "completed"
                                                            ? addsToWallet
                                                                ? "text-green-500"
                                                                : "text-red-500"
                                                            : transaction.status === "pending"
                                                                ? "text-yellow-500"
                                                                : "text-gray-500";

                                                    // Format the transaction type display text
                                                    const formatTransactionType = (type: string) => {
                                                        return type
                                                            .split('_')
                                                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                                            .join(' ');
                                                    };

                                                    return (
                                                        <motion.tr
                                                            key={transaction._id.toString()}
                                                            className="border-zinc-700"
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                                        >
                                                            <TableCell className="text-gray-300">
                                                                {new Date(transaction.createdAt).toLocaleString()}
                                                            </TableCell>
                                                            <TableCell className="text-gray-300">
                                                                {transaction.receiptUrl ? (
                                                                    <a
                                                                        href={transaction.receiptUrl}
                                                                        className="text-blue-400 hover:underline"
                                                                    >
                                                                        Invoice
                                                                    </a>
                                                                ) : (
                                                                    <span className="text-gray-500">N/A</span>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                <span
                                                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${typeStyle}`}
                                                                >
                                                                    {formatTransactionType(transaction.type)}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell className={`text-right font-medium ${amountStyle}`}>
                                                                {transaction.status === "completed"
                                                                    ? `${addsToWallet ? "+" : "-"}$${transaction.amount.toLocaleString()}`
                                                                    : transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                                            </TableCell>
                                                        </motion.tr>
                                                    );
                                                })
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-gray-300 text-center">
                                                        No transactions found
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>

                                    {/* Pagination Controls */}
                                    {totalPages > 1 && (
                                        <div className="flex justify-between items-center mt-4">
                                            <Button
                                                onClick={handlePreviousPage}
                                                disabled={currentPage === 1 || isTransactionsLoading}
                                                className="bg-zinc-700 hover:bg-zinc-600 text-white"
                                            >
                                                Previous
                                            </Button>
                                            <span className="text-gray-300">
                                                Page {currentPage} of {totalPages} (Total: {totalTransactions})
                                            </span>
                                            <Button
                                                onClick={handleNextPage}
                                                disabled={currentPage === totalPages || isTransactionsLoading}
                                                className="bg-zinc-700 hover:bg-zinc-600 text-white"
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
                <Dialog open={isAddMoneyOpen} onOpenChange={setIsAddMoneyOpen}>
                    <DialogContent className="bg-zinc-800 border-zinc-700 text-white sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-white">Add Money to Wallet</DialogTitle>
                            <DialogDescription className="text-gray-400">
                                Enter an amount and card details to add to your wallet via Stripe.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="amount" className="text-white">
                                    Enter Amount ($)
                                </Label>
                                <Input
                                    id="amount"
                                    placeholder="Enter amount"
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="bg-zinc-700 border-zinc-600 text-white"
                                    disabled={mutationPending}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white">Card Details</Label>
                                <CardElement
                                    className="p-2 bg-zinc-700 border-zinc-600 text-white rounded-md"
                                    options={{
                                        style: {
                                            base: {
                                                color: '#fff',
                                                backgroundColor: '#3f3f46',
                                            },
                                        },
                                    }}
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {[500, 1000, 2000].map((value) => (
                                    <Button
                                        key={value}
                                        variant="outline"
                                        className="border-zinc-600 text-black hover:bg-zinc-400"
                                        onClick={() => setAmount(value.toString())}
                                        disabled={mutationPending}
                                    >
                                        ${value}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsAddMoneyOpen(false)}
                                className="text-black border-zinc-600 hover:bg-zinc-400"
                                disabled={mutationPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-[#3BE188] hover:bg-[#32c676] text-black"
                                onClick={handleAddMoney}
                                disabled={mutationPending || isProcessingPayment}
                            >
                                {isProcessingPayment ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                            className="inline-block w-4 h-4 border-2 border-t-black border-r-transparent border-b-transparent border-l-transparent rounded-full mr-2"
                                        />
                                        Processing...
                                    </>
                                ) : 'Pay with Stripe'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
};

export default WalletPage;