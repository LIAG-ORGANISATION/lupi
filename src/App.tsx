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
import ProfessionalProfile from "./pages/ProfessionalProfile";
import ProfessionalSignUp from "./pages/ProfessionalSignUp";
import ProfessionalWelcome from "./pages/ProfessionalWelcome";
import EthicalCharter from "./pages/EthicalCharter";
import ProfessionalEditProfile from "./pages/ProfessionalEditProfile";
import DNAKit from "./pages/DNAKit";
import Checkout from "./pages/Checkout";
import OrderSummary from "./pages/OrderSummary";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import NotificationsSettings from "./pages/NotificationsSettings";
import PrivacySettings from "./pages/PrivacySettings";
import BillingSettings from "./pages/BillingSettings";
import Recommendations from "./pages/Recommendations";
import RecommendationDetail from "./pages/RecommendationDetail";
import NotFound from "./pages/NotFound";
import ChooseAccountType from "./pages/ChooseAccountType";
import Auth from "./pages/Auth";
import ProfessionalAuth from "./pages/ProfessionalAuth";
import GuardianDashboard from "./pages/GuardianDashboard";
import GuardianMessages from "./pages/GuardianMessages";
import GuardianDocuments from "./pages/GuardianDocuments";
import ProfessionalDashboard from "./pages/ProfessionalDashboard";
import ProfessionalClients from "./pages/ProfessionalClients";
import ProfessionalMessages from "./pages/ProfessionalMessages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/choose-account-type" element={<ChooseAccountType />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/professional/auth" element={<ProfessionalAuth />} />
          <Route path="/guardian/dashboard" element={<GuardianDashboard />} />
          <Route path="/guardian/messages" element={<GuardianMessages />} />
          <Route path="/guardian/documents" element={<GuardianDocuments />} />
          <Route path="/professional/dashboard" element={<ProfessionalDashboard />} />
          <Route path="/professional/clients" element={<ProfessionalClients />} />
          <Route path="/professional/messages" element={<ProfessionalMessages />} />
          <Route path="/dogs" element={<Layout><Dogs /></Layout>} />
          <Route path="/dogs/add" element={<Layout><AddDog /></Layout>} />
          <Route path="/dogs/:id" element={<Layout><DogProfile /></Layout>} />
          <Route path="/dogs/:id/dna-results" element={<Layout><DNAResults /></Layout>} />
          <Route path="/questionnaire" element={<Layout><Questionnaire /></Layout>} />
          <Route path="/professionals" element={<Layout><Professionals /></Layout>} />
          <Route path="/professional/:id" element={<ProfessionalProfile />} />
          <Route path="/professional/signup" element={<ProfessionalSignUp />} />
          <Route path="/professional/welcome" element={<ProfessionalWelcome />} />
          <Route path="/professional/ethical-charter" element={<EthicalCharter />} />
          <Route path="/professional/edit-profile" element={<ProfessionalEditProfile />} />
          <Route path="/dna-kit" element={<DNAKit />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-summary" element={<OrderSummary />} />
          <Route path="/recommendations" element={<Layout><Recommendations /></Layout>} />
          <Route path="/recommendations/:id" element={<Layout><RecommendationDetail /></Layout>} />
          <Route path="/profile" element={<Layout><Profile /></Layout>} />
          <Route path="/profile/edit" element={<Layout><EditProfile /></Layout>} />
          <Route path="/profile/notifications" element={<Layout><NotificationsSettings /></Layout>} />
          <Route path="/profile/privacy" element={<Layout><PrivacySettings /></Layout>} />
          <Route path="/profile/billing" element={<Layout><BillingSettings /></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
