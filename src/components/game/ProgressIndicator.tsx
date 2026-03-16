'use client';

interface ProgressIndicatorProps {
  totalEvidence: number;
  collectedEvidence: number;
  analyzedEvidence: number;
  totalPuzzles: number;
  solvedPuzzles: number;
  suspectsTalkedTo: number;
  totalSuspects: number;
}

export default function ProgressIndicator({
  totalEvidence,
  collectedEvidence,
  analyzedEvidence,
  totalPuzzles,
  solvedPuzzles,
  suspectsTalkedTo,
  totalSuspects
}: ProgressIndicatorProps) {
  const evidencePercent = Math.round((collectedEvidence / totalEvidence) * 100);
  const analyzedPercent = Math.round((analyzedEvidence / totalEvidence) * 100);
  const puzzlePercent = Math.round((solvedPuzzles / totalPuzzles) * 100);
  const suspectPercent = Math.round((suspectsTalkedTo / totalSuspects) * 100);
  
  const overallProgress = Math.round(
    (collectedEvidence + analyzedEvidence + solvedPuzzles * 3 + suspectsTalkedTo * 2) /
    (totalEvidence + totalEvidence + totalPuzzles * 3 + totalSuspects * 2) * 100
  );

  return (
    <div className="rounded-xl border-2 border-slate-700 bg-black/90 backdrop-blur-xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Investigation Progress</h3>
        <span className="text-2xl font-bold text-white">{overallProgress}%</span>
      </div>
      
      <div className="space-y-3">
        {/* Evidence Collection */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-300">Evidence Collected</span>
            <span className="text-xs font-semibold text-slate-200">{collectedEvidence}/{totalEvidence}</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500"
              style={{ width: `${evidencePercent}%` }}
            />
          </div>
        </div>

        {/* Evidence Analyzed */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-300">Evidence Analyzed</span>
            <span className="text-xs font-semibold text-slate-200">{analyzedEvidence}/{totalEvidence}</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500"
              style={{ width: `${analyzedPercent}%` }}
            />
          </div>
        </div>

        {/* Puzzles */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-300">Puzzles Solved</span>
            <span className="text-xs font-semibold text-slate-200">{solvedPuzzles}/{totalPuzzles}</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-violet-600 to-violet-400 transition-all duration-500"
              style={{ width: `${puzzlePercent}%` }}
            />
          </div>
        </div>

        {/* Suspects */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-300">Suspects Interrogated</span>
            <span className="text-xs font-semibold text-slate-200">{suspectsTalkedTo}/{totalSuspects}</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500"
              style={{ width: `${suspectPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
