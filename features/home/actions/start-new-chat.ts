"use server";

import { requireUser } from "@/features/auth/action/require-user";
import prisma from "@/lib/db";

export const startNewChat = async () => {
  try {
    const user = await requireUser();

    const conversation = await prisma.conversation.create({
      data: {
        userId: user.id,
        title: "New Chat",
      },
    });
    return conversation.id;
  } catch (error) {
    console.error("Error occurred while starting a new chat:", error);
  }
};
