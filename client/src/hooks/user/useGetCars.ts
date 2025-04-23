import { useQuery } from '@tanstack/react-query';
import { getCars } from '@/services/user/userServices';
import { CarFilterReturn } from '@/types/CarFormTypes';

interface UseCarsOptions {
  year?: number;
  bodyType?: string;
  fuel?: string;
  transmission?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export const useCars = ({
  year,
  bodyType,
  fuel,
  transmission,
  sort = 'ending-soon',
  page = 1,
  limit = 20,
}: UseCarsOptions) => {
  console.log({ bodyType, fuel, transmission, sort, page, limit });
  return useQuery<CarFilterReturn[], Error>({
    queryKey: ['cars', { bodyType, fuel, transmission, sort, page, limit }],
    queryFn: () => getCars(year, transmission, bodyType, fuel, sort, page, limit),
    staleTime: 5 * 60 * 1000,
  });
};