import React, { useState } from 'react';
import {
  ArrowLeft,
  HelpCircle,
  Home,
  Smartphone,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useBetting } from '../context/BettingContext';

interface DepositPageProps {
  onBack: () => void;
}

export const DepositPage: React.FC<DepositPageProps> = ({ onBack }) => {
  const { user, deposit, showToast, setActiveTab } = useBetting();
  const [tab, setTab] = useState<'Mobile Money' | 'Paybill' | 'Card'>('Mobile Money');
  const [phone, setPhone] = useState('+233 20****815');
  const [operator, setOperator] = useState<'Telecel' | 'MTN' | 'AirtelTigo'>('Telecel');
  const [amount, setAmount] = useState<string>('');
  const [isSwitchingPhone, setIsSwitchingPhone] = useState(false);
  const [isSwitchingOperator, setIsSwitchingOperator] = useState(false);
  const [customPhoneInput, setCustomPhoneInput] = useState('0201234815');
  const [isProcessing, setIsProcessing] = useState(false);

  const quickAddAmounts = [2, 5, 10, 50, 100];

  const handleQuickAdd = (val: number) => {
    const current = parseFloat(amount) || 0;
    setAmount((current + val).toString());
  };

  const handleTopUp = () => {
    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount < 1.0) {
      showToast('Minimum deposit amount is GHS 1.00');
      return;
    }
    if (numericAmount > 50000) {
      showToast('Maximum per transaction is GHS 50,000.00');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      deposit(numericAmount, `${operator} Mobile Money`);
      setIsProcessing(false);
      setAmount('');
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
      showToast(`Deposited GHS ${numericAmount.toFixed(2)} successfully!`);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#141a22] text-white flex flex-col pb-16">
      {/* Red Header (Exact match to screenshot 1000038451.jpg) */}
      <div className="bg-[#de1a22] px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-1 -ml-1 text-white hover:bg-black/10 rounded transition-colors"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <h1 className="text-lg font-bold text-white tracking-wide">Deposit</h1>
        </div>

        <div className="flex items-center space-x-4 text-white">
          <button
            onClick={() => showToast('Instant fee-free mobile deposits via MTN, Telecel, and AT Money')}
            className="hover:opacity-80"
          >
            <HelpCircle className="w-5 h-5 stroke-[2.2]" />
          </button>
          <button
            onClick={() => {
              setActiveTab('sports');
              onBack();
            }}
            className="hover:opacity-80"
          >
            <Home className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>
      </div>

      {/* Tabs Row: Mobile Money | Paybill | Card */}
      <div className="flex bg-[#1b2532] border-b border-[#242f3d] text-xs font-bold">
        {(['Mobile Money', 'Paybill', 'Card'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-center transition-all border-b-2 ${
              tab === t
                ? 'border-[#00df59] text-white font-black'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab !== 'Mobile Money' ? (
        <div className="p-8 text-center text-neutral-400 text-xs">
          <p className="font-semibold text-neutral-200">Instant {tab} Deposit</p>
          <p className="mt-1 text-neutral-500">
            For fastest funding without network fees, please use Mobile Money.
          </p>
        </div>
      ) : (
        <div className="p-4 space-y-3 flex-1 overflow-y-auto">
          {/* Box 1: Registered Phone Number */}
          <div className="bg-[#1b2532] border border-[#263242] rounded-md p-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded bg-[#253243] flex items-center justify-center text-neutral-300">
                <Smartphone className="w-5 h-5 stroke-[1.8]" />
              </div>
              <div>
                <span className="text-sm font-bold text-white block">
                  {phone}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsSwitchingPhone(!isSwitchingPhone)}
              className="text-xs font-semibold text-neutral-300 hover:text-white flex items-center space-x-1"
            >
              <span>Switch</span>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </button>
          </div>

          {/* Switch Phone Input Drawer */}
          {isSwitchingPhone && (
            <div className="bg-[#18212c] p-3 rounded border border-neutral-700 space-y-2 animate-in fade-in duration-150">
              <label className="text-[11px] font-bold text-neutral-300">
                Enter Mobile Number
              </label>
              <div className="flex space-x-2">
                <input
                  type="tel"
                  value={customPhoneInput}
                  onChange={(e) => setCustomPhoneInput(e.target.value)}
                  placeholder="02XXXXXXXX"
                  className="flex-1 bg-[#222d3b] text-white text-xs px-3 py-2 rounded border border-neutral-600 focus:outline-none"
                />
                <button
                  onClick={() => {
                    if (customPhoneInput.length >= 9) {
                      setPhone(`+233 ${customPhoneInput.slice(-9, -3)}***${customPhoneInput.slice(-3)}`);
                      setIsSwitchingPhone(false);
                      showToast('Deposit phone number updated');
                    }
                  }}
                  className="bg-[#00a826] text-white text-xs font-bold px-3 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Box 2: Telecel / Operator Selection */}
          <div className="bg-[#1b2532] border border-[#263242] rounded-md p-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {operator === 'Telecel' && (
                <div className="w-9 h-9 rounded bg-[#e31837] flex items-center justify-center text-white font-black text-xs shadow-sm">
                  t
                </div>
              )}
              {operator === 'MTN' && (
                <div className="w-9 h-9 rounded bg-[#ffcc00] flex items-center justify-center text-neutral-950 font-black text-[10px] shadow-sm">
                  MTN
                </div>
              )}
              {operator === 'AirtelTigo' && (
                <div className="w-9 h-9 rounded bg-[#005da4] flex items-center justify-center text-white font-black text-[10px] shadow-sm">
                  AT
                </div>
              )}

              <div>
                <span className="text-sm font-bold text-white block">
                  {operator}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsSwitchingOperator(!isSwitchingOperator)}
              className="text-xs font-semibold text-neutral-300 hover:text-white flex items-center space-x-1"
            >
              <span>Switch</span>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </button>
          </div>

          {/* Switch Operator Grid */}
          {isSwitchingOperator && (
            <div className="bg-[#18212c] p-3 rounded border border-neutral-700 grid grid-cols-3 gap-2 animate-in fade-in duration-150">
              {(['Telecel', 'MTN', 'AirtelTigo'] as const).map(op => (
                <button
                  key={op}
                  onClick={() => {
                    setOperator(op);
                    setIsSwitchingOperator(false);
                  }}
                  className={`p-2 rounded text-xs font-bold text-center border ${
                    operator === op
                      ? 'border-[#00df59] bg-[#00df59]/20 text-white font-black'
                      : 'border-neutral-700 bg-[#222d3b] text-neutral-300'
                  }`}
                >
                  {op}
                </button>
              ))}
            </div>
          )}

          {/* Right-aligned Balance display */}
          <div className="text-right pt-1">
            <span className="text-xs text-neutral-300">
              Balance ({user.currency || 'GHC'}) <span className="font-bold text-white">{user.balance.toFixed(2)}</span>
            </span>
          </div>

          {/* Amount (GHC) input card */}
          <div className="bg-[#1b2532] border border-[#263242] rounded-md px-3.5 py-3 flex items-center justify-between">
            <label className="text-sm font-bold text-white shrink-0">
              Amount ({user.currency || 'GHC'})
            </label>
            <input
              type="number"
              min="1"
              max="50000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="min. 1.00"
              className="w-36 text-right bg-transparent text-sm font-bold text-white placeholder-neutral-500 focus:outline-none"
            />
          </div>

          {/* Quick Amounts (+2, +5, +10, +50, +100) */}
          <div className="grid grid-cols-5 gap-2 pt-0.5">
            {quickAddAmounts.map(val => (
              <button
                key={val}
                onClick={() => handleQuickAdd(val)}
                className="py-2.5 rounded bg-[#1b2532] hover:bg-[#232f3f] active:scale-[0.97] border border-[#293647] text-white font-bold text-xs text-center transition-colors"
              >
                +{val}
              </button>
            ))}
          </div>

          {/* Action Button: Top Up Now */}
          <div className="pt-2">
            <button
              onClick={handleTopUp}
              disabled={isProcessing}
              className={`w-full py-3.5 rounded-md font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center space-x-2 ${
                amount && parseFloat(amount) >= 1
                  ? 'bg-[#00a826] hover:bg-[#009221] active:scale-[0.98] text-white font-black'
                  : 'bg-[#3f4b59] text-neutral-300 hover:bg-[#485666]'
              }`}
            >
              {isProcessing ? (
                <span>Prompting phone...</span>
              ) : (
                <span>Top Up Now</span>
              )}
            </button>
          </div>

          {/* Numbered Instructions (Exact text from screenshot 1000038451.jpg) */}
          <div className="pt-3 text-[11px] text-neutral-400 space-y-1.5 leading-relaxed font-normal">
            <p>1. Maximum per transaction is GHS 50,000.00</p>
            <p>2. Minimum per transaction is GHS 1.00</p>
            <p>3. Deposit is free, no transaction fees.</p>
            <p>
              4. Your balance can only be withdrawn to the mobile number that you registered with.
            </p>
            <p>
              5. Add a backup number to avoid network issues: Deposit &gt; Mobile Money &gt; Switch.
            </p>
            <p className="pt-1 text-neutral-400">
              Note: For MTN users, if a bill prompt isn't received, dial *170#, then select 6 and 3 to approve the transaction.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
