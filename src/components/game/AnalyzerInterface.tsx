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
    <section className="rounded-lg border border-slate-700 bg-slate-950 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100">Forensic Analyzer</h3>
        <p className="text-xs uppercase tracking-widest text-slate-400">Battery: {charges}</p>
      </div>
      <div className="rounded border border-dashed border-slate-600 p-4 text-sm text-slate-300">
        {selectedEvidenceName ? `Loaded: ${selectedEvidenceName}` : 'No evidence loaded. Select an item first.'}
      </div>
      <button
        onClick={onRunAnalysis}
        disabled={disabled}
        className="mt-3 rounded bg-cyan-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-700"
      >
        RUN ANALYSIS
      </button>
      <div className="mt-3 min-h-16 rounded border border-slate-700 bg-slate-900 p-2 text-sm text-cyan-100">
        {output}
      </div>
    </section>
  );
}
