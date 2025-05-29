import { useMutation, useQueryClient } from "@tanstack/react-query";
import { auctionEnd } from "@/services/user/userServices";
import { toast } from "sonner";

export const useAuctionEnd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (carId: string) => auctionEnd(carId),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({
          queryKey: ["cars"],
          refetchType: "active",
        });
        queryClient.invalidateQueries({
          queryKey: ["soldCars"],
          refetchType: "active",
        });
        const message = data.auctionStatus === "sold" ? "Car sold successfully" : "Auction ended successfully";
        toast.success(message);
      } else {
        toast.error(data.message || "Failed to end auction");
      }
    },
    onError: (error: any) => {
      console.error("Error ending auction:", error);
      if (error.message.includes("already ended")) {
        toast.info("Auction has already ended");
      } else if (error.message.includes("not found")) {
        toast.error("Car not found");
      } else {
        toast.error(error.message || "Failed to process auction end");
      }
    },
  });
};