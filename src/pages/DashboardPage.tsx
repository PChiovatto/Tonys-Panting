import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLeads } from "@/hooks/useLeads";
import Sidebar, { type DashTab } from "@/components/dashboard/Sidebar";
import BottomNav from "@/components/dashboard/BottomNav";
import InstallPWA from "@/components/dashboard/InstallPWA";

import DashHeader from "@/components/dashboard/DashHeader";
import OverviewTab from "@/components/dashboard/tabs/OverviewTab";
import LeadsTab from "@/components/dashboard/tabs/LeadsTab";
import CalendarTab from "@/components/dashboard/tabs/CalendarTab";
import AnalyticsTab from "@/components/dashboard/tabs/AnalyticsTab";
import LeadToast from "@/components/dashboard/LeadToast";
import NotificationBanner from "@/components/dashboard/NotificationBanner";
import {
  registerServiceWorker,
  subscribeUserToPush,
  unsubscribeFromPush,
} from "@/lib/pushNotifications";

const TAB_TITLES: Record<DashTab, string> = {
  overview: "Overview",
  leads: "Leads",
  calendar: "Calendar",
  analytics: "Analytics",
};

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState<DashTab>("overview");
  const [userId, setUserId] = useState<string | null>(null);
  const { leads, loading, updateLead, deleteLead } = useLeads();
  const navigate = useNavigate();

  useEffect(() => {
    // Enviar mensagem para o service worker limpar o badge
    const sendClearMessage = async () => {
      try {
        const sw = await navigator.serviceWorker.ready
        if (sw.active) {
          sw.active.postMessage({ type: 'CLEAR_BADGE' })
        }
      } catch(e) {}
    }

    sendClearMessage()

    // Repetir ao voltar para a aba
    const onFocus = () => sendClearMessage()
    const onVisible = () => {
      if (document.visibilityState === 'visible') sendClearMessage()
    }

    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])


  useEffect(() => {
    const initPush = async () => {
      await registerServiceWorker();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setUserId(session.user.id);
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        await subscribeUserToPush(session.user.id);
      }
    };
    initPush();
  }, []);

  const handleSignOut = async () => {
    await unsubscribeFromPush();
    await supabase.auth.signOut();
    navigate("/login");
  };

  const newLeadsCount = leads.filter((l) => l.status === "new").length;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100dvh",
        background: "#F8F7F4",
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      <style>{`
        .dash-sidebar { display: flex; }
        .dash-bottom-nav { display: none !important; }
        .dash-content-wrap { padding-bottom: 0; }
        .dash-header-signout { display: none !important; }

        /* Prevent bounce scroll on iOS */
        .dash-content-wrap {
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: none;
        }

        /* Tap highlight transparent */
        .dash-bottom-nav button,
        .dash-bottom-nav a {
          -webkit-tap-highlight-color: transparent;
        }

        .dash-bottom-btn:active {
          opacity: 0.7;
          transform: scale(0.95);
          transition: transform 0.1s ease;
        }

        main {
          overflow-y: auto;
          overflow-x: hidden;
        }

        @keyframes dash-shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }

        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(196,41,28,0), 0 0 8px 2px rgba(196,41,28,0.50); }
          50% { box-shadow: 0 0 0 6px rgba(196,41,28,0), 0 0 20px 6px rgba(196,41,28,0.25); }
        }

        @media (max-width: 767px) {
          .dash-sidebar { display: none !important; }
          .dash-bottom-nav { display: flex !important; }
          .dash-header-date { display: none !important; }
          .dash-header-signout { display: flex !important; }
          .dash-content-wrap { padding-bottom: calc(60px + env(safe-area-inset-bottom)) !important; }
        }
      `}</style>

      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        newLeadsCount={newLeadsCount}
        onSignOut={handleSignOut}
      />

      <div className="dash-content-wrap" style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <DashHeader title={TAB_TITLES[activeTab]} onSignOut={handleSignOut} />
        {userId && <NotificationBanner userId={userId} />}
        <main style={{ flex: 1 }}>
          {activeTab === "overview" && <OverviewTab leads={leads} loading={loading} />}
          {activeTab === "leads" && <LeadsTab leads={leads} updateLead={updateLead} deleteLead={deleteLead} />}
          {activeTab === "calendar" && <CalendarTab leads={leads} />}
          {activeTab === "analytics" && <AnalyticsTab leads={leads} />}
        </main>
      </div>

      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        newLeadsCount={newLeadsCount}
      />

      <LeadToast />
      <InstallPWA />
    </div>
  );
};

export default DashboardPage;