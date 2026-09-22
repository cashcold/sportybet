import React, { useState } from 'react';
import { X, ArrowDownToLine, ShieldCheck } from 'lucide-react';
import { useBetting } from '../context/BettingContext';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose }) => {
  const { user, withdraw, showToast } = useBetting();
  const [provider, setProvider] = useState<'MTN' | 'Telecel' | 'AirtelTigo'>('MTN');
  const [amount, setAmount] = useState<number>(20);
  const [phone, setPhone] = useState('0241234567');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleWithdraw = () => {
    if (amount <= 0) {
      showToast('Please enter an amount');
      return;
    }
    if (user.balance < amount) {
      showToast('Insufficient balance for withdrawal');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const res = withdraw(amount, `${provider} Mobile Money`);
      setIsProcessing(false);
      if (res.success) {
        onClose();
      }
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-[#161e27] text-white rounded-t-2xl sm:rounded-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-neutral-800 animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="bg-[#1e2733] px-4 py-3.5 flex items-center justify-between border-b border-neutral-700/60">
          <div className="flex items-center space-x-2">
            <ArrowDownToLine className="w-5 h-5 text-[#00df59]" />
            <span className="font-extrabold text-sm text-white">Withdraw to Mobile Money</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-neutral-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-[#131a22] p-3 rounded-lg border border-neutral-800 flex justify-between items-center">
            <span className="text-xs text-neutral-400 font-medium">Withdrawable Balance</span>
            <span className="text-base font-black text-[#00df59]">
              {user.currency} {user.balance.toFixed(2)}
            </span>
          </div>

          {/* Provider */}
          <div>
            <label className="text-xs font-bold text-neutral-300 block mb-2">
              Select Mobile Network
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['MTN', 'Telecel', 'AirtelTigo'].map(p => (
                <button
                  key={p}
                  onClick={() => setProvider(p as any)}
                  className={`p-2.5 rounded-lg border text-center transition-all text-xs font-bold ${
                    provider === p
                      ? 'border-[#00df59] bg-[#00df59]/10 text-white font-black'
                      : 'border-neutral-700 bg-[#1b232e] text-neutral-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs font-bold text-neutral-300 block mb-1">
              Withdrawal Amount (GHS)
            </label>
            <div className="flex items-center bg-[#1b232e] border border-neutral-700 rounded-md px-3 py-2">
              <span className="text-xs font-bold text-neutral-400 mr-2">GHS</span>
              <input
                type="number"
                min="1"
                max={user.balance}
                value={amount || ''}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full bg-transparent text-sm font-bold text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-xs font-bold text-neutral-300 block mb-1">
              Registered Phone Number
            </label>
            <div className="flex items-center bg-[#1b232e] border border-neutral-700 rounded-md px-3 py-2">
              <span className="text-xs font-bold text-neutral-400 mr-2">+233</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-neutral-400 bg-[#121922] p-2.5 rounded border border-neutral-800">
            <ShieldCheck className="w-4 h-4 text-[#00df59] shrink-0" />
            <span>Withdrawals are processed automatically in under 5 minutes.</span>
          </div>

          <button
            onClick={handleWithdraw}
            disabled={isProcessing || user.balance <= 0}
            className="w-full py-3 bg-[#00a826] hover:bg-[#009221] active:scale-[0.98] disabled:opacity-50 text-white font-black text-sm rounded-lg shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            {isProcessing ? 'Processing payout...' : `WITHDRAW GHS ${amount.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
};
