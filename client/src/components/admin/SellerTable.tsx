import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import { ISellerEntity } from '@/types/Types';

interface SellerTableProps {
    sellers: ISellerEntity[];
    onBlockStatusChange?: (userId: string) => void;
}

const SellerTable: React.FC<SellerTableProps> = ({ sellers, onBlockStatusChange }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedSeller, setSelectedSeller] = useState<ISellerEntity | null>(null);

    const handleBlockStatus = (userId: string) => {
        if (onBlockStatusChange) {
            onBlockStatusChange(userId);
        }
        setOpenDialog(false);
        setSelectedSeller(null);
    };

    const openBlockDialog = (seller: ISellerEntity) => {
        setSelectedSeller(seller);
        setOpenDialog(true);
    };

    const formatDate = (dateInput?: string | Date) => {
        try {
            if (!dateInput) return 'N/A';
            const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
            return format(date, 'MMM dd, yyyy');
        } catch (error) {
            return 'Invalid date';
        }
    };


    return (
        <>
            <div className="w-full overflow-x-auto">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="font-medium">No.</TableHead>
                            <TableHead className="font-medium">Name</TableHead>
                            <TableHead className="font-medium">Email</TableHead>
                            <TableHead className="font-medium">Address</TableHead>
                            <TableHead className="font-medium">Identification</TableHead>
                            <TableHead className="font-medium">Approval Status</TableHead>
                            <TableHead className="font-medium">Seller Since</TableHead>
                            <TableHead className="font-medium">Professional Dealer</TableHead>
                            <TableHead className="font-medium">Business Name</TableHead>
                            <TableHead className="font-medium">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sellers.map((seller, index) => (
                            <TableRow key={seller._id?.toString() || seller.userId.toString()}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                    {typeof seller.userId === 'object' && 'name' in seller.userId
                                        ? seller.userId.name
                                        : seller.userId.toString().slice(0, 25)}
                                </TableCell>   <TableCell>
                                    {typeof seller.userId === 'object' && 'email' in seller.userId
                                        ? seller.userId.email
                                        : seller.userId.toString().slice(0, 25)}
                                </TableCell>

                                <TableCell>{seller.address}</TableCell>
                                <TableCell>{seller.identificationNumber}</TableCell>
                                <TableCell>{seller.approvalStatus}</TableCell>
                                <TableCell>{formatDate(seller.sellerSince)}</TableCell>
                                <TableCell>{seller.isProfessionalDealer ? 'Yes' : 'No'}</TableCell>
                                <TableCell>{seller.businessDetails?.businessName || 'N/A'}</TableCell>
                                <TableCell>
                                    <Button
                                        onClick={() => openBlockDialog(seller)}
                                        variant={seller.isActive ? "destructive" : "outline"}
                                        className={seller.isActive ? "" : "border-green-500 text-green-500 hover:bg-green-50"}
                                    >
                                        {seller.isActive ? (
                                            <><ShieldAlert className="mr-2 h-4 w-4" /> Deactivate</>
                                        ) : (
                                            <><ShieldCheck className="mr-2 h-4 w-4" /> Activate</>
                                        )}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {selectedSeller?.isActive ? 'Deactivate Seller' : 'Activate Seller'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedSeller?.isActive
                                ? `Are you sure you want to deactivate ${selectedSeller?.businessDetails?.businessName || selectedSeller?.userId}? They will lose access to the platform.`
                                : `Are you sure you want to activate ${selectedSeller?.businessDetails?.businessName || selectedSeller?.userId}? They will regain access to the platform.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => selectedSeller && handleBlockStatus(selectedSeller._id?.toString() || selectedSeller.userId.toString())}
                            className={selectedSeller?.isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
                        >
                            {selectedSeller?.isActive ? 'Yes, Deactivate' : 'Yes, Activate'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default SellerTable;