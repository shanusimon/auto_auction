import { useMutation } from "@tanstack/react-query";
import { getConversation } from "@/services/user/userChatService";

export const useConversation = () => {
    return useMutation({
        mutationFn: getConversation,
    });
};
