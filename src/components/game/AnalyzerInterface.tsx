'use client';

interface AnalyzerInterfaceProps {
  charges: number;
  selectedEvidenceName: string | null;
  onRunAnalysis: () => void;
  disabled: boolean;
  output: string;
}

export default function AnalyzerInterface({
  charges,
  selectedEvidenceName,
  onRunAnalysis,
  disabled,
  output
}: AnalyzerInterfaceProps) {
  return (
    <section className="rounded-xl border-2 border-cyan-500/30 bg-slate-950/90 p-5 shadow-lg shadow-cyan-500/10">
      <div className="mb-4 flex items-center justify-between border-b border-cyan-500/20 pb-3">
        <h3 className="text-lg font-bold text-cyan-400 flex items-center gap-2">
          ⚗️ Forensic Analyzer
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-widest text-slate-400">Power</span>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full ${
                  i < charges ? 'bg-cyan-400 shadow-[0_0_4px_rgba(34,211,238,0.8)]' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="rounded-lg border-2 border-dashed border-cyan-500/30 bg-slate-900/50 p-5 text-center min-h-[80px] flex items-center justify-center">
        <p className="text-sm text-slate-300 font-mono">
          {selectedEvidenceName ? (
            <span className="text-cyan-400 font-bold">
              📋 LOADED: <span className="text-white">{selectedEvidenceName}</span>
            </span>
          ) : (
            <span className="text-slate-500">⚠️ NO EVIDENCE LOADED - Select an item from inventory</span>
          )}
        </p>
      </div>
      
      <button
        onClick={onRunAnalysis}
        disabled={disabled}
        className="mt-5 w-full min-h-[52px] rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 px-6 py-3 text-base font-black text-white disabled:cursor-not-allowed disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-400 hover:from-cyan-500 hover:to-cyan-400 transition-all shadow-lg hover:shadow-cyan-500/50"
      >
        ▶ RUN ANALYSIS
      </button>
      
      <div className="mt-5 rounded-lg border-2 border-cyan-500/30 bg-slate-900 p-4 min-h-[100px]">
        <p className="text-xs uppercase tracking-wider text-cyan-400 mb-2">📊 Analysis Results</p>
        <pre className="text-sm text-cyan-100 leading-relaxed font-mono whitespace-pre-wrap">{output}</pre>
      </div>
    </section>
  );
}
