import { lazy, Suspense } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
const Index = lazy(() => import("./pages/Index.tsx"));
const Services = lazy(() => import("./pages/Services.tsx"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail.tsx"));
const Portfolio = lazy(() => import("./pages/Portfolio.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Reviews = lazy(() => import("./pages/Reviews.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const ThankYou = lazy(() => import("./pages/ThankYou.tsx"));
const LPInteriorPainting = lazy(() => import("./pages/lp/InteriorPainting.tsx"));
const LPExteriorPainting = lazy(() => import("./pages/lp/ExteriorPainting.tsx"));
const LPRemodeling = lazy(() => import("./pages/lp/Remodeling.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.tsx"));
const DashboardPage = lazy(() => import("./pages/DashboardPage.tsx"));
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import SEO from "./components/SEO";


const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  const reduce = useReducedMotion();


  return (
    <>
      {["/login", "/dashboard", "/thank-you"].some(path => location.pathname === path || location.pathname.startsWith(path + "/")) && (
        <SEO title={location.pathname.startsWith("/dashboard") ? "Dashboard" : location.pathname === "/login" ? "Staff Login" : "Thank You"} description="Tony's Painting and Remodeling." noindex />
      )}

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
        <ErrorBoundary>
          <Suspense fallback={<div role="status" className="min-h-screen grid place-content-center bg-background">Loading page…</div>}>
            <AnimatedRoutes />
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
