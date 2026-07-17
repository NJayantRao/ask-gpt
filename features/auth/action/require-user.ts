"use server";

import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export const requireUser = async () => {
  try {
    const { userId } = await auth.protect();

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error occurred while requiring user:", error);
    throw new Error("Failed to require user");
  }
};
