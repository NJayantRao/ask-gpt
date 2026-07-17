import { onBoard } from "@/features/auth/action/onboard";
import ChatShell from "@/features/conversations/components/chat-shell";
import { auth } from "@clerk/nextjs/server";
import React from "react";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  await auth.protect();
  await onBoard();

  return (
    <div>
      <ChatShell>{children}</ChatShell>
    </div>
  );
};

export default RootLayout;
