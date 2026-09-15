import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Index from "./pages/Index.tsx";
import Services from "./pages/Services.tsx";
import ServiceDetail from "./pages/ServiceDetail.tsx";
import Portfolio from "./pages/Portfolio.tsx";
import About from "./pages/About.tsx";
import Reviews from "./pages/Reviews.tsx";
import Contact from "./pages/Contact.tsx";
import ThankYou from "./pages/ThankYou.tsx";
import LPInteriorPainting from "./pages/lp/InteriorPainting.tsx";
import LPExteriorPainting from "./pages/lp/ExteriorPainting.tsx";
import LPRemodeling from "./pages/lp/Remodeling.tsx";
import NotFound from "./pages/NotFound.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import ReviewButton from "./components/site/ReviewButton.tsx";


const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  const reduce = useReducedMotion();

  const isPublicPage = !location.pathname.startsWith('/dashboard') && location.pathname !== '/login';

  return (
    <>
      {/* {isPublicPage && <ReviewButton />} */}
      <AnimatePresence mode="wait">

      <motion.div
        key={location.pathname}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: reduce ? 0 : 0.25, ease: "easeOut" } }}
        exit={reduce ? { opacity: 1 } : { opacity: 0, transition: { duration: 0.15, ease: "easeOut" } }}
      >
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/about" element={<About />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/lp/interior-painting" element={<LPInteriorPainting />} />
          <Route path="/lp/exterior-painting" element={<LPExteriorPainting />} />
          <Route path="/lp/remodeling" element={<LPRemodeling />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
