
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import Upload from "./pages/Upload";
import Results from "./pages/Results";
import DocumentPage from "./pages/DocumentPage";
import NotFound from "./pages/NotFound";
import AuthRoute from "./components/auth/AuthRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/upload" element={
              <AuthRoute>
                <Upload />
              </AuthRoute>
            } />
            <Route path="/results" element={
              <AuthRoute>
                <Results />
              </AuthRoute>
            } />
            <Route path="/document/:id" element={
              <AuthRoute>
                <DocumentPage />
              </AuthRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
