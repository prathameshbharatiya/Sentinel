import React from 'react';
import { ComplianceStatus } from '../types';
import { ClipboardCheck, BarChart3, History, Bug, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface ComplianceDashboardProps {
  status: ComplianceStatus;
  onExportCompliance?: () => void;
}

const ComplianceDashboard: React.FC<ComplianceDashboardProps> = ({ status, onExportCompliance }) => {
  return (
    <div className="border border-[#00ff41]/30 bg-zinc-900/40 p-3 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-2 border-b border-zinc-800 pb-1">
        <h2 className="font-black uppercase text-xs flex items-center gap-2">
          <ClipboardCheck size={14} className="text-[#00ff41]" />
          L9: DO-178C_Compliance_DAL_{status.dalLevel}
        </h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={onExportCompliance}
            className="text-[8px] bg-[#00ff41] text-black px-1 font-bold uppercase transition-all hover:bg-white"
          >
            Export_Proofs
          </button>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00ff41] animate-pulse"></div>
            <span className="text-[10px] text-[#00ff41] uppercase font-bold">Certified</span>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-1">
        {/* Requirements Traceability */}
        <div className="space-y-1">
          <div className="flex justify-between items-end">
            <span className="text-[9px] text-zinc-500 uppercase">Requirements_Traceability</span>
            <span className="text-xs font-bold text-white">{status.requirementsTraceability.toFixed(1)}%</span>
          </div>
          <div className="h-1 bg-zinc-800 w-full rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#00ff41] transition-all duration-500" 
              style={{ width: `${status.requirementsTraceability}%` }}
            />
          </div>
        </div>

        {/* Structural Coverage (MC/DC) */}
        <div className="bg-black/40 border border-zinc-800 p-2 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 size={14} className="text-[#00ff41]" />
            <span className="text-[10px] font-black uppercase text-white tracking-wider">Structural_Coverage (MC/DC)</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center p-1 bg-zinc-900/60 border border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase">Statement</span>
              <span className="text-xs font-mono text-[#00ff41]">{status.structuralCoverage.statement.toFixed(0)}%</span>
            </div>
            <div className="flex flex-col items-center p-1 bg-zinc-900/60 border border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase">Branch</span>
              <span className="text-xs font-mono text-[#00ff41]">{status.structuralCoverage.branch.toFixed(0)}%</span>
            </div>
            <div className="flex flex-col items-center p-1 bg-zinc-900/60 border border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase">MC/DC</span>
              <span className="text-xs font-mono text-[#00ff41]">{status.structuralCoverage.mcdc.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {/* Configuration Management */}
        <div className="flex items-center justify-between p-2 bg-zinc-950/40 border border-zinc-800">
          <div className="flex items-center gap-2">
            <History size={12} className="text-blue-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-500 uppercase">Config_Management</span>
              <span className="text-[10px] text-zinc-300 font-mono truncate w-24">{status.configurationManagementHash}</span>
            </div>
          </div>
          <span className="text-xs bg-blue-400/10 text-blue-400 px-1 border border-blue-400/20 uppercase font-bold">Locked</span>
        </div>

        {/* Problem Reporting */}
        <div className="flex items-center justify-between p-2 bg-zinc-950/40 border border-zinc-800">
          <div className="flex items-center gap-2">
            <Bug size={12} className={status.openProblemReports > 0 ? "text-amber-500" : "text-emerald-400"} />
            <span className="text-xs text-zinc-300 uppercase">Open_Problem_Reports</span>
          </div>
          <span className={`text-xs font-bold ${status.openProblemReports > 0 ? "text-amber-500" : "text-emerald-400"}`}>
            {status.openProblemReports}
          </span>
        </div>

        {/* FAA Certification Banner */}
        <div className="p-2 border border-[#00ff41]/20 bg-[#00ff41]/5 flex items-start gap-2">
          <ShieldAlert size={14} className="text-[#00ff41] shrink-0" />
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase text-[#00ff41]">eVTOL FAA Certification</span>
            <p className="text-xs text-zinc-400 leading-tight">
              Sentinel v5.0 is compliant with DO-178C DAL-A. All safety-critical paths are traced, tested, and verified for catastrophic failure prevention.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-zinc-800 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <CheckCircle2 size={12} className="text-[#00ff41]" />
          <span className="text-xs text-zinc-500 uppercase">Audit_Ready</span>
        </div>
        <span className="text-[10px] font-mono opacity-40">REF: FAA-AC-20-115D</span>
      </div>
    </div>
  );
};

export default ComplianceDashboard;
