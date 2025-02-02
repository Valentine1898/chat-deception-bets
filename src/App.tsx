import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { PrivyProvider, usePrivy } from "@privy-io/react-auth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GameLobbyPage from "./pages/GameLobbyPage";
import GameHeader from "@/components/GameHeader";

const queryClient = new QueryClient();

const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID;

if (!PRIVY_APP_ID || PRIVY_APP_ID === "your_privy_app_id_here") {
  throw new Error(
    "Please set up your Privy App ID:\n" +
    "1. Create an account at https://console.privy.io/\n" +
    "2. Create a new application\n" +
    "3. Copy your App ID from the dashboard\n" +
    "4. Add it to your .env file as VITE_PRIVY_APP_ID=your_app_id"
  );
}

const AppRoutes = () => {
  const { authenticated } = usePrivy();
  const location = useLocation();
  const showHeader = location.pathname.startsWith('/game/');
  
  return (
    <>
      {authenticated && showHeader && <GameHeader stage="waiting" countdown={null} />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/game/:gameId" element={<GameLobbyPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <PrivyProvider
    appId={PRIVY_APP_ID}
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
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </PrivyProvider>
);

export default App;