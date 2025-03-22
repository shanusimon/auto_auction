import { StrictMode } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/store/store";
import { Toaster } from "sonner";
import { Tooltip, TooltipProvider } from "@radix-ui/react-tooltip";

const queryClient = new QueryClient();

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <StrictMode>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
            <Tooltip>
            <Toaster/>
            {children}      
            </Tooltip>
            </TooltipProvider>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </StrictMode>
  );
}
