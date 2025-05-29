import { useQuery } from "@tanstack/react-query";
import { getDashBoardRevenue } from "@/services/admin/adminService";


export const useGetDashboardRevenue = (period: 'weekly' | 'monthly' | 'yearly') => {
  return useQuery({
    queryKey: ['dashboard-revenue', period],
    queryFn: () => getDashBoardRevenue(period),
    staleTime: 1000 * 60 * 5,
  });
};
