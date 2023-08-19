"use client";
import { StatementProvider } from "@/app/context/statement";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Providers = ({ children }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <StatementProvider>{children}</StatementProvider>
    </QueryClientProvider>
  );
};

export default Providers;
