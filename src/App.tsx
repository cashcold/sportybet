/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BettingProvider, useBetting } from './context/BettingContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { SportsView } from './components/SportsView';
import { AZMenuView } from './components/AZMenuView';
import { OpenBetsView } from './components/OpenBetsView';
import { ProfileView } from './components/ProfileView';
import { GamesView } from './components/GamesView';
import { DepositPage } from './components/DepositPage';
import { FloatingBetslipButton } from './components/FloatingBetslipButton';
import { BetslipModal } from './components/BetslipModal';
import { DepositModal } from './components/DepositModal';
import { WithdrawModal } from './components/WithdrawModal';
import { SearchModal } from './components/SearchModal';
import { Toast } from './components/Toast';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab } = useBetting();
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0d1218] flex justify-center text-white antialiased font-sans">
      {/* Mobile viewport container */}
      <div className="w-full max-w-md min-h-screen bg-[#141a22] relative flex flex-col shadow-2xl">
        {/* Top Header - shown on Sports and AZ Menu; Open Bets, Profile (Me), Deposit, and Aviator have their own exact screenshot layouts */}
        {activeTab !== 'open_bets' && activeTab !== 'deposit' && activeTab !== 'me' && activeTab !== 'games' && <Header />}

        {/* Dynamic Views */}
        <main className="flex-1 overflow-x-hidden">
          {activeTab === 'sports' && <SportsView />}
          {activeTab === 'az_menu' && <AZMenuView />}
          {activeTab === 'games' && <GamesView />}
          {activeTab === 'open_bets' && <OpenBetsView />}
          {activeTab === 'me' && <ProfileView onOpenWithdraw={() => setIsWithdrawOpen(true)} />}
          {activeTab === 'deposit' && <DepositPage onBack={() => setActiveTab('sports')} />}
        </main>

        {/* Floating Betslip Ticket & Sticky Quick Bar */}
        {activeTab !== 'deposit' && activeTab !== 'games' && (
          <FloatingBetslipButton />
        )}

        {/* Bottom Navigation Bar */}
        {activeTab !== 'deposit' && activeTab !== 'games' && <BottomNav />}

        {/* Global Modals & Drawers */}
        <BetslipModal />
        <DepositModal />
        <WithdrawModal isOpen={isWithdrawOpen} onClose={() => setIsWithdrawOpen(false)} />
        <SearchModal />
        <Toast />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <BettingProvider>
        <MainContent />
      </BettingProvider>
    </ErrorBoundary>
  );
}
