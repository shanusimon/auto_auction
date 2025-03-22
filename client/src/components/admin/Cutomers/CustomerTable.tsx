import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import { IClient } from '@/types/auth';

interface CustomerTableProps {
  customers: IClient[];
  onBlockStatusChange?: (userId: string) => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({ customers, onBlockStatusChange }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<IClient | null>(null);

  const handleBlockStatus = (userId: string) => {
    if (onBlockStatusChange) {
      onBlockStatusChange(userId);
    }
    setOpenDialog(false);
    setSelectedCustomer(null);
  };
  const openBlockDialog = (customer: IClient) => {
    setSelectedCustomer(customer);
    setOpenDialog(true);
  };

  const formatDate = (dateString: Date) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
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
              <TableHead className="font-medium">ID</TableHead>
              <TableHead className="font-medium">Name</TableHead>
              <TableHead className="font-medium">Email</TableHead>
              <TableHead className="font-medium">Phone</TableHead>
              <TableHead className="font-medium">Joined Date</TableHead>
              <TableHead className="font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer._id}>
                <TableCell>{customer.clientId.slice(0,25)}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.joinedAt ? formatDate(customer.joinedAt) : 'N/A'}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => openBlockDialog(customer)}
                    variant={customer.isBlocked ? "outline" : "destructive"}
                    className={customer.isBlocked ? "border-green-500 text-green-500 hover:bg-green-50" : ""}
                  >
                    {customer.isBlocked ? (
                      <><ShieldCheck className="mr-2 h-4 w-4" /> Unblock</>
                    ) : (
                      <><ShieldAlert className="mr-2 h-4 w-4" /> Block</>
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
              {selectedCustomer?.isBlocked ? 'Unblock Customer' : 'Block Customer'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedCustomer?.isBlocked ? 
                `Are you sure you want to unblock ${selectedCustomer?.name}? They will regain access to the platform.` : 
                `Are you sure you want to block ${selectedCustomer?.name}? This will prevent them from accessing the platform.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => selectedCustomer && handleBlockStatus(selectedCustomer._id)}
              className={selectedCustomer?.isBlocked ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}
            >
              {selectedCustomer?.isBlocked ? 'Yes, Unblock' : 'Yes, Block'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CustomerTable;
