import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Censo from "./pages/Censo";
import CadastroGato from "./pages/CadastroGato";
import Graficos from "./pages/Graficos";
import Protetores from "./pages/Protetores";
import Memorial from "./pages/Memorial";
import AtividadeProtetor from "./pages/AtividadeProtetor";
import ComoAjudar from "./pages/ComoAjudar";
import EditarProtetor from "./pages/EditarProtetor";
import CadastroProtetor from "./pages/CadastroProtetor";
import GerenciarCarrossel from "./pages/GerenciarCarrossel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/censo" element={<Censo />} />
            <Route path="/cadastro-gato" element={<CadastroGato />} />
            <Route path="/editar-gato/:id" element={<CadastroGato />} />
            <Route path="/graficos" element={<Graficos />} />
            <Route path="/protetores" element={<Protetores />} />
            <Route path="/protetores/:id/editar" element={<EditarProtetor />} />
            <Route path="/cadastro-protetor" element={<CadastroProtetor />} />
            <Route path="/gerenciar-carrossel" element={<GerenciarCarrossel />} />
            <Route path="/memorial" element={<Memorial />} />
            <Route path="/atividade-protetor/:id" element={<AtividadeProtetor />} />
            <Route path="/como-ajudar" element={<ComoAjudar />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
