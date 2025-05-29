import { useQuery } from "@tanstack/react-query";
import { getDashBoardDetails } from "@/services/admin/adminService";

export const useDashboardDetails = () => {
  return useQuery({
    queryKey: ["admin-dashboard-details"],
    queryFn: getDashBoardDetails,
    staleTime: 5 * 60 * 1000, 
    retry: 1, 
    refetchOnWindowFocus: false, 
  });
};
