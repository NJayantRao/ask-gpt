"use server";

import { requireUser } from "@/features/auth/action/require-user";
import prisma from "@/lib/db";

export type ConversationItem = {
  id: string;
  title: string;
  isPinned: boolean;
  isArchived: boolean;
  lastMessagedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export const assertConversation = async (
  userId: string,
  conversationId: string,
) => {
  try {
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId, 
      },
    });

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    return conversation;
  } catch (error) {
    console.error("Error occurred while asserting conversation:", error);
    throw new Error("Failed to assert conversation");
  }
};

export const getConversations = async (): Promise<ConversationItem[]> => {
  try {
    const user = await requireUser();
    return prisma.conversation.findMany({
      where: { userId: user.id, isArchived: false },
      orderBy: [{ isPinned: "desc", lastMessagedAt: "desc" }],
      select: {
        id: true,
        title: true,
        isPinned: true,
        isArchived: true,
        lastMessagedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    console.error("Error occurred while fetching conversations:", error);
    throw new Error("Failed to fetch conversations");
  }
};

export const createConversation = async (
  title: string,
): Promise<ConversationItem> => {
  try {
    const user = await requireUser();
    return prisma.conversation.create({
      data: {
        title: title.trim() || "New Chat",
        userId: user.id,
      },
    });
  } catch (error) {
    console.error("Error occurred while creating conversation:", error);
    throw new Error("Failed to create conversation");
  }
};

export const updateConversation = async (
  conversationId: string,
  title?: string,
  isPinned?: boolean,
  isArchived?: boolean,
) => {
  try {
    const user = await requireUser();

    await assertConversation(user.id, conversationId);

    return await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        ...(title !== undefined && { title: title.trim() || "New Chat" }),
        ...(isPinned !== undefined && { isPinned }),
        ...(isArchived !== undefined && { isArchived }),
      },
      select: {
        id: true,
        title: true,
        isPinned: true,
        isArchived: true,
        lastMessagedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    console.error("Error occurred while updating conversation:", error);
    throw new Error("Failed to update conversation");
  }
};

export const deleteConversation = async (conversationId: string) => {
  try {
    const user = await requireUser();
    await assertConversation(user.id, conversationId);
    return prisma.conversation.delete({
      where: {
        id: conversationId,
      },
    });
  } catch (error) {
    console.error("Error occurred while deleting conversation:", error);
    throw new Error("Failed to delete conversation");
  }
};
