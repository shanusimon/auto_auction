import { StrictMode } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/store/store";
import { Toaster } from "sonner";
import { Tooltip, TooltipProvider } from "@radix-ui/react-tooltip";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const queryClient = new QueryClient();

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <StrictMode>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Elements stripe={stripePromise}>
             <QueryClientProvider client={queryClient}>
            <TooltipProvider>
            <Tooltip>
            <Toaster/>
            {children}      
            </Tooltip>
            </TooltipProvider>
          </QueryClientProvider>
          </Elements>
        </PersistGate>
      </Provider>
    </StrictMode>
  );
}
