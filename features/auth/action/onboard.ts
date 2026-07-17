"use server";

import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export const onBoard = async () => {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      throw new Error("Unauthorized");
    }

    const email = clerkUser.emailAddresses[0].emailAddress ?? null;

    if (!email) {
      throw new Error("Email not found");
    }

    return prisma.user.upsert({
      where: {
        clerkId: clerkUser.id,
      },
      create: {
        clerkId: clerkUser.id,
        email,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        imageUrl: clerkUser.imageUrl,
      },
      update: {
        email,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        imageUrl: clerkUser.imageUrl,
      },
    });
  } catch (error) {
    console.error("Error occurred while onboarding:", error);
    throw new Error("Error occurred while onboarding");
  }
};
