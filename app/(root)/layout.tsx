import { onBoard } from "@/features/auth/action/onboard";
import { auth } from "@clerk/nextjs/server";
import React from "react";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  await auth.protect();
  await onBoard();
  console.log("reached here 2");

  return <div>{children}</div>;
};

export default RootLayout;
