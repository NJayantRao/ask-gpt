import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { AppSidebar } from "./app-sidebar";

const ChatShell = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="h-screen">{children}</SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default ChatShell;
