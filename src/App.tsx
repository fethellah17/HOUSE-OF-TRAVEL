import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DataProvider } from "@/contexts/DataContext";
import Index from "./pages/Index";
import VoyageListPage from "./pages/VoyageListPage";
import VoyageDetailPage from "./pages/VoyageDetailPage";
import DevisPage from "./pages/DevisPage";
import BilletteriePage from "./pages/BilletteriePage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DataProvider>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/omrah" element={
              <VoyageListPage category="Omrah" title="Nos Omrah" description="Des pèlerinages organisés avec soin, dans un cadre spirituel et confortable." />
            } />
            <Route path="/voyage-organise" element={
              <VoyageListPage category="Voyage Organisé" title="Voyages Organisés" description="Découvrez nos circuits culturels et historiques accompagnés par des guides francophones." />
            } />
            <Route path="/voyage-a-la-carte" element={
              <VoyageListPage category="Voyage à la Carte" title="Voyages à la Carte" description="Un voyage entièrement personnalisé selon vos envies, votre budget et votre calendrier." />
            } />
            <Route path="/voyage/:id" element={<VoyageDetailPage />} />
            <Route path="/billetterie" element={<BilletteriePage />} />
            <Route path="/devis" element={<DevisPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </DataProvider>
  </QueryClientProvider>
);

export default App;
