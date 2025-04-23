import { useMutation } from "@tanstack/react-query";
import { updateCarStatus } from "@/services/admin/adminService";


interface UpdateCarStatusPayload {
  carId: string;
  status: "approved" | "rejected";
  rejectionReason?: string;
  sellerEmail: string;
}

export const useUpdateCarStatus = () => {
  return useMutation({
    mutationFn: ({ carId, ...data }: UpdateCarStatusPayload) =>
      updateCarStatus(carId, data)
  });
};
