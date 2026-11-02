import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, Calculator, RefreshCw, CheckCircle2, AlertCircle, ArrowRight, Lock } from 'lucide-react';

interface MathCaptchaModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose?: () => void;
  canDismiss?: boolean;
}

interface MathProblem {
  num1: number;
  num2: number;
  operator: '+' | '-' | '×';
  answer: number;
  displayText: string;
}

export function generateMathProblem(): MathProblem {
  const operations: Array<'+' | '-' | '×'> = ['+', '-', '×'];
  const op = operations[Math.floor(Math.random() * operations.length)];
  let num1 = 0;
  let num2 = 0;
  let answer = 0;

  if (op === '+') {
    // Addition: 5-25 + 5-25 (e.g. 10 + 11)
    num1 = Math.floor(Math.random() * 20) + 6;
    num2 = Math.floor(Math.random() * 20) + 5;
    answer = num1 + num2;
  } else if (op === '-') {
    // Subtraction: 15-40 - 3-15 (ensure positive result)
    num1 = Math.floor(Math.random() * 25) + 15;
    num2 = Math.floor(Math.random() * 12) + 3;
    if (num1 <= num2) num1 = num2 + 7;
    answer = num1 - num2;
  } else {
    // Multiplication: 2-9 × 2-9
    num1 = Math.floor(Math.random() * 8) + 2;
    num2 = Math.floor(Math.random() * 8) + 2;
    answer = num1 * num2;
  }

  return {
    num1,
    num2,
    operator: op,
    answer,
    displayText: `${num1} ${op} ${num2} = ?`
  };
}

export const MathCaptchaModal: React.FC<MathCaptchaModalProps> = ({
  isOpen,
  onSuccess,
  onClose,
  canDismiss = false,
}) => {
  const [problem, setProblem] = useState<MathProblem>(generateMathProblem());
  const [userInput, setUserInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const refreshProblem = useCallback(() => {
    setProblem(generateMathProblem());
    setUserInput('');
    setErrorMessage(null);
  }, []);

  useEffect(() => {
    if (isOpen) {
      refreshProblem();
      setIsSuccess(false);
    }
  }, [isOpen, refreshProblem]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(userInput.trim(), 10);

    if (isNaN(parsed)) {
      setErrorMessage('Mohon masukkan angka hasil perhitungan.');
      return;
    }

    if (parsed === problem.answer) {
      setIsSuccess(true);
      setErrorMessage(null);
      setTimeout(() => {
        onSuccess();
      }, 700);
    } else {
      setErrorMessage(`Jawaban "${userInput}" belum tepat. Silakan coba soal baru di bawah ini.`);
      refreshProblem();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="captcha-title"
      >
        {/* Top Decorative Header */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-blue-600 to-amber-500" />

        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 ring-4 ring-amber-400/20 flex items-center justify-center shadow-inner">
            <ShieldCheck className="w-9 h-9 text-amber-600" />
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              Sistem Keamanan Anti-Bot
            </span>
            <h2 id="captcha-title" className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Verifikasi Pengunjung
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
              Untuk melindungi formulir PMB STARS YKPN dari serangan bot dan spam otomatis, mohon selesaikan soal matematika sederhana berikut:
            </p>
          </div>
        </div>

        {/* Captcha Challenge Box */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-900 text-white shadow-lg border border-slate-800 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-full pointer-events-none" />
          
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Calculator className="w-3.5 h-3.5 text-amber-400" />
              Soal Matematika:
            </span>
            <button
              type="button"
              onClick={refreshProblem}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 hover:text-amber-200 transition-colors p-1 rounded-lg hover:bg-slate-800"
              title="Ganti Soal Baru"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Ganti Soal</span>
            </button>
          </div>

          <div className="py-2">
            <div className="font-mono text-3xl sm:text-4xl font-extrabold tracking-wider text-amber-400 select-none">
              {problem.num1} {problem.operator} {problem.num2} = ?
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {problem.operator === '+' && 'Hitung hasil penjumlahan di atas'}
              {problem.operator === '-' && 'Hitung hasil pengurangan di atas'}
              {problem.operator === '×' && 'Hitung hasil perkalian di atas'}
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="captcha-answer" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Jawaban Anda:
            </label>
            <div className="relative">
              <input
                id="captcha-answer"
                type="number"
                inputMode="numeric"
                autoFocus
                placeholder="Tulis angka hasil perhitungan..."
                value={userInput}
                onChange={(e) => {
                  setUserInput(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className={`w-full px-4 py-3 rounded-2xl text-center font-mono text-lg font-bold border-2 transition-all focus:outline-none ${
                  errorMessage
                    ? 'border-rose-400 bg-rose-50/50 text-rose-900 focus:ring-2 focus:ring-rose-400/40'
                    : isSuccess
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                    : 'border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-400/30 text-slate-900'
                }`}
              />
            </div>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isSuccess && (
            <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 animate-bounce" />
              <span>Verifikasi Berhasil! Membuka Portal PMB...</span>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={isSuccess || !userInput.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-slate-950 font-extrabold text-sm sm:text-base shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isSuccess ? 'Terverifikasi' : 'Verifikasi & Masuk PMB'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {canDismiss && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Kembali Nanti
              </button>
            )}
          </div>
        </form>

        {/* Footer Security Note */}
        <div className="mt-4 pt-3 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Perlindungan bot cerdas PMB Online STARS YKPN Yogyakarta • T.A. 2027/2028
          </p>
        </div>
      </div>
    </div>
  );
};
