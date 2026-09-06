import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, CheckCircle2, XCircle, Search } from 'lucide-react';

interface SecurityVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityVerifyModal: React.FC<SecurityVerifyModalProps> = ({
  isOpen,
  onClose
}) => {
  const [inputHandle, setInputHandle] = useState('');
  const [verifyResult, setVerifyResult] = useState<'verified' | 'imposter' | null>(null);

  const officialHandles = [
    '@marvin_atelier',
    'marvin_atelier',
    '@marvintattoos.official',
    'marvintattoos.official',
    '+18005556275',
    '18005556275',
    '+1 800 555-MARK',
    '8005556275',
    'marvintattoos.com',
    'marvin_tattoo'
  ];

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputHandle.trim().toLowerCase();
    if (officialHandles.some(h => h.toLowerCase() === clean)) {
      setVerifyResult('verified');
    } else {
      setVerifyResult('imposter');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-noir-900 border border-noir-700 p-6 sm:p-8 space-y-6 z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-noir-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-noir-800 text-bone border border-noir-700">
                  <ShieldAlert className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-title-editorial text-title-editorial uppercase text-bone">
                    Scam Check
                  </h3>
                  <span className="font-label-caps text-[10px] text-bone-muted uppercase tracking-wider">
                    Verify our official accounts
                  </span>
                </div>
              </div>
              <button onClick={onClose} className="p-1 text-bone-dim hover:text-bone">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Advisory Info */}
            <div className="p-4 bg-noir-850 border border-noir-700 space-y-2">
              <p className="font-body-sm text-xs text-bone leading-relaxed">
                Scammers sometimes impersonate our artists to collect fake booking deposits. Check any handle or phone number here before you pay.
              </p>
            </div>

            {/* Search Input Form */}
            <form onSubmit={handleVerify} className="space-y-3">
              <label className="block font-label-caps text-[10px] uppercase text-bone-dim">
                Enter an Instagram, TikTok, or phone number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputHandle}
                  onChange={(e) => {
                    setInputHandle(e.target.value);
                    setVerifyResult(null);
                  }}
                  placeholder="e.g. @marvin_atelier or +1 800 555-MARK"
                  className="flex-1 px-3 py-2 bg-noir-850 border border-noir-700 text-bone font-body-sm text-sm focus:outline-none focus:border-noir-600"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-noir-800 hover:bg-noir-700 text-bone font-label-caps text-xs uppercase tracking-wider flex items-center gap-1.5 border border-noir-700"
                >
                  <Search className="w-4 h-4" />
                  <span>Verify</span>
                </button>
              </div>
            </form>

            {/* Verification Result Output */}
            {verifyResult === 'verified' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-emerald-950/40 border border-emerald-500/40 flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-label-caps text-xs text-emerald-400 uppercase tracking-wider font-bold block">
                    Verified — Official Account
                  </span>
                  <p className="font-body-sm text-xs text-bone-muted">
                    This is an official Marvin Tattoos account or contact number.
                  </p>
                </div>
              </motion.div>
            )}

            {verifyResult === 'imposter' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-950/40/40 border border-red-500/40/50 flex items-start gap-3"
              >
                <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-label-caps text-xs text-red-400 uppercase tracking-wider font-bold block">
                    Warning — Not an Official Account
                  </span>
                  <p className="font-body-sm text-xs text-bone leading-snug">
                    Don't send money or personal info to this account, and report it to us.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Official Registry List */}
            <div className="space-y-2 pt-2 border-t border-noir-700">
              <span className="font-label-caps text-[10px] text-bone-dim uppercase tracking-wider block">
                Official Accounts
              </span>
              <div className="space-y-1 font-label-data text-xs">
                <div className="flex justify-between p-2 bg-noir-850">
                  <span className="text-bone">Instagram:</span>
                  <span className="text-crimson-light font-bold">@marvin_atelier</span>
                </div>
                <div className="flex justify-between p-2 bg-noir-850">
                  <span className="text-bone">TikTok:</span>
                  <span className="text-crimson-light font-bold">@marvintattoos.official</span>
                </div>
                <div className="flex justify-between p-2 bg-noir-850">
                  <span className="text-bone">WhatsApp / Phone:</span>
                  <span className="text-gold font-bold">+1 (800) 555-MARK</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-noir-800 hover:bg-noir-700 text-bone font-label-caps text-xs uppercase tracking-wider border border-noir-700 transition-colors"
            >
              Dismiss Notice
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
