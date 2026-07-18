"use server";

import { requireUser } from "@/features/auth/action/require-user";
import { assertOwnsConversation } from "@/features/conversations/actions/conversation-actions";
import prisma from "@/lib/db";
import { MessageRole, MessageStatus } from "@/prisma/generated/prisma/enums";
import { revalidatePath } from "next/cache";

export type MessageItem = {
  id: string;
  conversationId: string;
  role: MessageRole;
  status: MessageStatus;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export const getMessagesList = async (
  conversationId: string,
): Promise<MessageItem[]> => {
  const user = await requireUser();
  await assertOwnsConversation(conversationId, user.id);

  return prisma.message.findMany({
    where: {
      conversationId,
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      conversationId: true,
      role: true,
      status: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const createMessage = async (
  conversationId: string,
  content: string,
) => {
  const user = await requireUser();
  const conversation = await assertOwnsConversation(conversationId, user.id);

  const normalizedContent = content.trim();

  if (!normalizedContent) {
    throw new Error("Message content cannot be empty");
  }

  const message = await prisma.message.create({
    data: {
      conversationId,
      role: MessageRole.USER,
      status: MessageStatus.COMPLETED,
      content: normalizedContent,
    },
  });

  const rename =
    conversation.title === "New Chat" || conversation.title.trim() === "";

  await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      lastMessagedAt: new Date(),
      ...(rename
        ? {
            title:
              normalizedContent.length > 48
                ? `${normalizedContent.slice(0, 48)}…`
                : normalizedContent,
          }
        : {}),
    },
  });
  revalidatePath("/");
  revalidatePath(`/chat/${conversationId}`);
  return message;
};

export async function updateMessage(messageId: string, content: string) {
  const user = await requireUser();
  const normalizedContent = content.trim();

  if (!normalizedContent) {
    throw new Error("Message cannot be empty");
  }

  const existing = await prisma.message.findUnique({
    where: { id: messageId },
    include: { conversation: true },
  });

  if (!existing || existing.conversation.userId !== user.id) {
    throw new Error("Message not found");
  }

  const message = await prisma.message.update({
    where: { id: messageId },
    data: { content: normalizedContent },
  });

  revalidatePath(`/chat/${existing.conversationId}`);
  return message;
}

export async function deleteMessage(messageId: string) {
  const user = await requireUser();

  const existing = await prisma.message.findUnique({
    where: { id: messageId },
    include: { conversation: true },
  });

  if (!existing || existing.conversation.userId !== user.id) {
    throw new Error("Message not found");
  }

  await prisma.message.delete({ where: { id: messageId } });

  revalidatePath(`/chat/${existing.conversationId}`);
  return { id: messageId, conversationId: existing.conversationId };
}
