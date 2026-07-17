"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createMessage,
  deleteMessage,
  getMessagesList,
  updateMessage,
} from "../actions/message-actions";

export function useMessages(conversationId: string | undefined) {
  return useQuery({
    queryKey: [`messages/${conversationId}`],
    queryFn: () => getMessagesList(conversationId!),
    enabled: Boolean(conversationId),
  });
}

export function useCreateMessage(conversationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => createMessage(conversationId, content),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [`messages/${conversationId}`],
      });
      void queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not send message");
    },
  });
}

export function useUpdateMessage(conversationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      updateMessage(id, content),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [`messages/${conversationId}`],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not update message");
    },
  });
}

export function useDeleteMessage(conversationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMessage(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [`messages/${conversationId}`],
      });
      toast.success("Message deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not delete message");
    },
  });
}
