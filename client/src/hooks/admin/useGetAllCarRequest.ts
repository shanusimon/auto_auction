import { ICarEntity } from "@/types/CarFormTypes";
import { FetchCustomerParams } from "@/types/AdminTypes";
import { useQuery } from "@tanstack/react-query";

export type carsResponse = {
  cars: ICarEntity[];
  total: number;
  currentPage: number;
};

export const useGetAllCarRequests = (
  queryfunc: (params: FetchCustomerParams) => Promise<carsResponse>,
  page: number,
  limit: number,
  search: string
) => {
  return useQuery({
    queryKey: ["car-requests", page, limit, search],
    queryFn: () =>
      queryfunc({
        page,
        limit,
        search,
      }), 
    placeholderData: (prevData) => (prevData ? { ...prevData } : undefined),
  });
};
