"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createConversation,
  deleteConversation,
  getConversations,
  updateConversation,
} from "../actions/conversation-actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: () => getConversations(),
  });
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (title: string) => createConversation(title),
    onSuccess: (conversation) => {
      void queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
      router.push(`/chat/${conversation.id}`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create conversation");
    },
  });
};

export const useUpdateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      title,
      isPinned,
      isArchived,
    }: {
      conversationId: string;
      title?: string;
      isPinned?: boolean;
      isArchived?: boolean;
    }) => updateConversation(conversationId, title, isPinned, isArchived),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });

      toast.success("Conversation updated");
    },

    onError: (error) => {
      toast.error(error.message || "Failed to update conversation");
    },
  });
};

export const useDeleteConversation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (conversationId: string) => deleteConversation(conversationId),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });

      router.push("/");
      toast.success("Conversation deleted");
    },

    onError: (error) => {
      toast.error(error.message || "Failed to delete conversation");
    },
  });
};
