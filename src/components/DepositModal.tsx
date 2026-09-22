import React, { useState } from 'react';
import { X, Smartphone, CheckCircle, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useBetting } from '../context/BettingContext';

export const DepositModal: React.FC = () => {
  const { isDepositModalOpen, setIsDepositModalOpen, deposit, user } = useBetting();
  const [provider, setProvider] = useState<'MTN' | 'Telecel' | 'AirtelTigo'>('MTN');
  const [amount, setAmount] = useState<number>(50);
  const [phone, setPhone] = useState('0241234567');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isDepositModalOpen) return null;

  const quickAmounts = [5, 10, 20, 50, 100, 200, 500];

  const handleDeposit = () => {
    if (amount <= 0) return;
    setIsProcessing(true);

    setTimeout(() => {
      deposit(amount, `${provider} Mobile Money`);
      setIsProcessing(false);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-[#161e27] text-white rounded-t-2xl sm:rounded-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-neutral-800 animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="bg-[#1e2733] px-4 py-3.5 flex items-center justify-between border-b border-neutral-700/60">
          <div className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5 text-[#00df59]" />
            <span className="font-extrabold text-sm text-white">Deposit via Mobile Money</span>
          </div>
          <button
            onClick={() => setIsDepositModalOpen(false)}
            className="p-1 rounded-full text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-4">
          {/* Provider Selector */}
          <div>
            <label className="text-xs font-bold text-neutral-300 block mb-2">
              Select Mobile Network
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'MTN', name: 'MTN MoMo', color: 'border-yellow-500 bg-yellow-500/10 text-yellow-400' },
                { id: 'Telecel', name: 'Telecel Cash', color: 'border-red-500 bg-red-500/10 text-red-400' },
                { id: 'AirtelTigo', name: 'AT Money', color: 'border-blue-500 bg-blue-500/10 text-blue-400' }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setProvider(p.id as any)}
                  className={`p-2.5 rounded-lg border text-center transition-all text-xs font-bold ${
                    provider === p.id
                      ? `${p.color} ring-1 ring-white/20 font-black`
                      : 'border-neutral-700 bg-[#1b232e] text-neutral-400 hover:text-white'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-xs font-bold text-neutral-300 block mb-1">
              Mobile Number
            </label>
            <div className="flex items-center bg-[#1b232e] border border-neutral-700 rounded-md px-3 py-2">
              <span className="text-xs font-bold text-neutral-400 mr-2">+233</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="24 XXX XXXX"
                className="w-full bg-transparent text-sm font-semibold text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Quick Amounts */}
          <div>
            <label className="text-xs font-bold text-neutral-300 block mb-1.5">
              Select Amount (GHS)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map(amt => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt)}
                  className={`py-2 rounded text-xs font-bold transition-all ${
                    amount === amt
                      ? 'bg-[#00a826] text-white shadow'
                      : 'bg-[#1b232e] text-neutral-300 border border-neutral-700 hover:bg-[#222b37]'
                  }`}
                >
                  {amt}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount Input */}
          <div>
            <label className="text-xs font-bold text-neutral-300 block mb-1">
              Or Custom Amount
            </label>
            <div className="flex items-center bg-[#1b232e] border border-neutral-700 rounded-md px-3 py-2">
              <span className="text-xs font-bold text-neutral-400 mr-2">GHS</span>
              <input
                type="number"
                min="1"
                step="1"
                value={amount || ''}
                onChange={(e) => setAmount(Math.max(1, parseFloat(e.target.value) || 0))}
                className="w-full bg-transparent text-sm font-bold text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Security Note */}
          <div className="flex items-center space-x-2 text-[11px] text-neutral-400 bg-[#121922] p-2.5 rounded border border-neutral-800">
            <ShieldCheck className="w-4 h-4 text-[#00df59] shrink-0" />
            <span>Instant & Fee-Free Mobile Money deposits. Authorized via PIN.</span>
          </div>

          {/* Action button */}
          <button
            onClick={handleDeposit}
            disabled={isProcessing}
            className="w-full py-3 bg-[#00a826] hover:bg-[#009221] active:scale-[0.98] disabled:opacity-50 text-white font-black text-sm rounded-lg shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <span>Prompting phone...</span>
            ) : (
              <span>DEPOSIT GHS {amount.toFixed(2)}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
