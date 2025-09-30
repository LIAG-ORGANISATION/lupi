import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Dogs from "./pages/Dogs";
import AddDog from "./pages/AddDog";
import DogProfile from "./pages/DogProfile";
import DNAResults from "./pages/DNAResults";
import Questionnaire from "./pages/Questionnaire";
import Professionals from "./pages/Professionals";
import DNAKit from "./pages/DNAKit";
import Profile from "./pages/Profile";
import Recommendations from "./pages/Recommendations";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/dogs" element={<Layout><Dogs /></Layout>} />
          <Route path="/dogs/add" element={<Layout><AddDog /></Layout>} />
          <Route path="/dogs/:id" element={<Layout><DogProfile /></Layout>} />
          <Route path="/dogs/:id/dna-results" element={<Layout><DNAResults /></Layout>} />
          <Route path="/questionnaire" element={<Layout><Questionnaire /></Layout>} />
          <Route path="/professionals" element={<Layout><Professionals /></Layout>} />
          <Route path="/dna-kit" element={<Layout><DNAKit /></Layout>} />
          <Route path="/recommendations" element={<Layout><Recommendations /></Layout>} />
          <Route path="/profile" element={<Layout><Profile /></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
