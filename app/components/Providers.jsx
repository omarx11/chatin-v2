"use client";

import { MessagesProvider } from "@/app/context/messages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Layout = ({ children }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <MessagesProvider>{children}</MessagesProvider>
    </QueryClientProvider>
  );
};

export default Layout;
