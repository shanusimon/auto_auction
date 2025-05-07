import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield } from "lucide-react";

interface BiddingTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const BiddingTermsModal = ({
  isOpen,
  onClose,
  onAccept,
}: BiddingTermsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[800px] !h-[80vh] !flex !flex-col !bg-[#1c1c1e] !border !border-[#333]">
        <DialogHeader>
          <DialogTitle className="!flex !items-center !gap-2 !text-2xl !font-bold !text-white">
            <Shield className="!w-6 !h-6 !text-[#3BE188]" />
            Important Bidding Terms & Conditions
          </DialogTitle>
          <DialogDescription className="!text-zinc-400">
            Please read carefully before placing your bid
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="!flex-1 !overflow-y-auto !pr-4">
          <div className="!space-y-6 !text-sm !text-zinc-300">
            {/* Section 1 */}
            <section className="!space-y-2 !bg-[#2c2c2e] !p-4 !rounded-lg !border !border-[#444]">
              <h3 className="!text-lg !font-semibold !text-[#3BE188]">Deposit Requirement</h3>
              <p>
                A 10% deposit of the current bid amount will be temporarily held from your account. This ensures serious bidding and prevents fraudulent activities.
              </p>
            </section>

            {/* Section 2 */}
            <section className="!space-y-2 !bg-[#2c2c2e] !p-4 !rounded-lg !border !border-[#444]">
              <h3 className="!text-lg !font-semibold !text-[#3BE188]">Deposit Management</h3>
              <ul className="!list-disc !pl-5 !space-y-2">
                <li>If outbid: Deposit will be refunded within 24-48 hours.</li>
                <li>If you win: Deposit applies to final purchase price.</li>
                <li>If you default: Deposit forfeited; account restrictions may apply.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="!space-y-2 !bg-[#2c2c2e] !p-4 !rounded-lg !border !border-[#444]">
              <h3 className="!text-lg !font-semibold !text-[#3BE188]">Winner Obligations</h3>
              <ul className="!list-disc !pl-5 !space-y-2">
                <li>Full payment due within 7 days of auction end.</li>
                <li>Failure to pay results in:
                  <ul className="!list-disc !pl-5 !mt-2 !text-zinc-400">
                    <li>Deposit forfeiture</li>
                    <li>Permanent account suspension</li>
                    <li>Potential legal action</li>
                  </ul>
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="!space-y-2 !bg-[#2c2c2e] !p-4 !rounded-lg !border !border-[#444]">
              <h3 className="!text-lg !font-semibold !text-[#3BE188]">Vehicle Information</h3>
              <p>You acknowledge:</p>
              <ul className="!list-disc !pl-5 !space-y-2">
                <li>Reviewed all vehicle info and images carefully.</li>
                <li>Sale is as-is, with no warranties.</li>
                <li>You have the means to complete the purchase.</li>
                <li>You are legally eligible to purchase this vehicle.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="!space-y-2 !bg-[#2c2c2e] !p-4 !rounded-lg !border !border-[#444]">
              <h3 className="!text-lg !font-semibold !text-[#3BE188]">Legal Compliance</h3>
              <p>
                All transactions must comply with laws. Fraudulent activities will be reported to authorities.
              </p>
            </section>

            {/* Section 6 */}
            <section className="!space-y-2 !bg-[#222] !p-4 !rounded-lg !border !border-[#555]">
              <h3 className="!text-lg !font-semibold !text-[#3BE188] !flex !items-center !gap-2">
                <Shield className="!w-5 !h-5" />
                Acknowledgment
              </h3>
              <p>
                By clicking "I Accept & Place Bid", you agree to all terms above and consent to the temporary deposit hold.
              </p>
            </section>
          </div>
        </ScrollArea>

        <DialogFooter className="!flex !flex-col sm:!flex-row !gap-4 !mt-6 !pt-6 !border-t !border-[#333]">
          <Button
            variant="outline"
            onClick={onClose}
            className="!w-full sm:!w-auto !order-2 sm:!order-1 !bg-[#2c2c2e] !hover:bg-[#3a3a3c] !border-[#444] !text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={onAccept}
            className="!w-full sm:!w-auto !order-1 sm:!order-2 !bg-[#3BE188] !hover:bg-[#58e7a7] !text-[#222] !font-bold"
          >
            I Accept & Place Bid
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BiddingTermsModal;
