"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  createConversation,
  deleteConversation,
  listConversations,
  updateConversation,
} from "@/features/conversations/actions/conversation-actions";

export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: () => listConversations(),
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (title?: string) => createConversation(title),
    onSuccess: (conversation) => {
      void queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
      router.push(`/chat/${conversation.id}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not create chat");
    },
  });
}

export function useUpdateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: {
      id: string;
      title?: string;
      isPinned?: boolean;
      isArchived?: boolean;
    }) => updateConversation(id, data),
    onSuccess: (conversation) => {
      void queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["messages", conversation.id],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not update chat");
    },
  });
}

export function useDeleteConversation(activeId?: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: string) => deleteConversation(id),
    onSuccess: ({ id }) => {
      void queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
      queryClient.removeQueries({
        queryKey: ["messages", id],
      });

      if (activeId === id) {
        router.push("/");
      }

      toast.success("Chat deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not delete chat");
    },
  });
}
