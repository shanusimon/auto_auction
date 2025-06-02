import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addOrRemoveLike } from '@/services/user/userServices';

export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => addOrRemoveLike(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allPosts'] });
    },
    onError: (error) => {
      console.error("Failed to toggle like", error);
    }
  });
};
