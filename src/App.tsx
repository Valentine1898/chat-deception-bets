import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrivyProvider } from "@privy-io/react-auth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// For development, we'll show a clear error if the Privy app ID is missing
const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID;

if (!PRIVY_APP_ID) {
  console.error(
    "Missing Privy App ID. Please set the VITE_PRIVY_APP_ID environment variable."
  );
}

const App = () => (
  <PrivyProvider
    appId={PRIVY_APP_ID || ""}
    config={{
      loginMethods: ["wallet"],
      appearance: {
        theme: "dark",
        accentColor: "#4F46E5",
      },
    }}
  >
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </PrivyProvider>
);

export default App;