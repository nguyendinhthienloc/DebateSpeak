import React from "react";
import { Mic, ShieldCheck, Sparkles } from "lucide-react";

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-xl bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
        <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-xl mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          DebateSpeak AI
        </h1>
        <p className="text-slate-600 mb-6 text-sm leading-relaxed">
          Real-time spoken debate practice and AI-assisted coaching platform.
          Built for dual-consent, low-latency audio exchange with automated transcript grounding.
        </p>

        <div className="grid grid-cols-2 gap-3 text-left">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <Mic className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold text-xs text-slate-800">Deterministic Audio</div>
              <div className="text-[11px] text-slate-500">LiveKit WebRTC per-speaker tracks</div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold text-xs text-slate-800">Grounding Guard</div>
              <div className="text-[11px] text-slate-500">Zero-hallucination quote verification</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
