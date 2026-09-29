import React, { useState, useEffect } from 'react';
import { PageId, UserFinancialProfile, FinancialRecord } from './types';
import { ToastProvider } from './components/ui/Toast';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoanEligibilityPage } from './pages/LoanEligibilityPage';
import { CreditAnalyzerPage } from './pages/CreditAnalyzerPage';
import { EmiCalculatorPage } from './pages/EmiCalculatorPage';
import { AiFinancialTipsPage } from './pages/AiFinancialTipsPage';
import { FinancialProfilePage } from './pages/FinancialProfilePage';
import { HistoryPage } from './pages/HistoryPage';
import { AboutDisclaimerPage } from './pages/AboutDisclaimerPage';

import { ApiService } from './services/api';

export const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageId>('landing');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [userProfile, setUserProfile] = useState<UserFinancialProfile>(() => {
    return ApiService.getUserProfile();
  });

  const [records, setRecords] = useState<FinancialRecord[]>(() => {
    return ApiService.getLocalRecords();
  });

  // Fetch latest records on initial load from backend
  useEffect(() => {
    ApiService.getRecords().then((fetched) => {
      if (fetched && fetched.length > 0) {
        setRecords(fetched);
      }
    });
  }, []);

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const handleRecordSaved = (newRecord: FinancialRecord) => {
    setRecords((prev) => [newRecord, ...prev.filter((r) => r.id !== newRecord.id)]);
  };

  const handleProfileUpdated = (updated: UserFinancialProfile) => {
    setUserProfile(updated);
  };

  const isAppToolPage = currentPage !== 'landing';

  return (
    <div className="min-h-screen flex flex-col bg-fintech-dark text-slate-100">
      {/* Top Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Body Area */}
      <div className="flex-1 flex w-full">
        {/* Desktop Sidebar (Rendered on tool/dashboard pages) */}
        {isAppToolPage && (
          <Sidebar
            currentPage={currentPage}
            onNavigate={handleNavigate}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
            userProfile={userProfile}
          />
        )}

        {/* Content Container */}
        <main className="flex-1 py-8 px-2 sm:px-6 lg:px-8 max-w-full overflow-x-hidden">
          {currentPage === 'landing' && <LandingPage onNavigate={handleNavigate} />}

          {currentPage === 'dashboard' && (
            <DashboardPage
              userProfile={userProfile}
              records={records}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'loan-eligibility' && (
            <LoanEligibilityPage
              userProfile={userProfile}
              onRecordSaved={handleRecordSaved}
            />
          )}

          {currentPage === 'credit-analyzer' && (
            <CreditAnalyzerPage
              userProfile={userProfile}
              onProfileUpdate={(score) => {
                const updated = { ...userProfile, creditScore: score };
                setUserProfile(updated);
                ApiService.saveUserProfile(updated);
              }}
            />
          )}

          {currentPage === 'emi-calculator' && <EmiCalculatorPage />}

          {currentPage === 'ai-tips' && (
            <AiFinancialTipsPage userProfile={userProfile} />
          )}

          {currentPage === 'profile' && (
            <FinancialProfilePage
              userProfile={userProfile}
              onProfileUpdate={handleProfileUpdated}
            />
          )}

          {currentPage === 'history' && (
            <HistoryPage records={records} onNavigate={handleNavigate} />
          )}

          {currentPage === 'about' && <AboutDisclaimerPage />}

          {/* Footer Component */}
          <Footer onNavigate={handleNavigate} />
        </main>
      </div>

      {/* Bottom Mobile Navigation for Phones */}
      <MobileNav currentPage={currentPage} onNavigate={handleNavigate} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

export default App;
