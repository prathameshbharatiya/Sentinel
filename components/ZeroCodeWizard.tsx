import React, { useState } from 'react';
import { Shield, Settings, Zap, Code, ChevronRight, ChevronLeft, CheckCircle2, Terminal } from 'lucide-react';
import { IndustryProfile, RobotTopology } from '../types';

interface WizardStep {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ZeroCodeWizard: React.FC<{ industry: IndustryProfile, onFinish?: () => void }> = ({ industry, onFinish }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState({
    topology: RobotTopology.QUADCOPTER,
    safetyLevel: 'DAL-A',
    governanceLayers: ['L0', 'L1', 'L2', 'L4'],
    autoRecovery: true
  });

  const steps: WizardStep[] = [
    { title: "Topology Selection", description: "Define the physical structure of your autonomous agent.", icon: <Settings size={18} /> },
    { title: "Safety Envelopes", description: "Set deterministic bounds for actuators and state-space.", icon: <Shield size={18} /> },
    { title: "Governance Layers", description: "Select which Sentinel layers to activate for this mission.", icon: <Zap size={18} /> },
    { title: "Generate Gatekeeper", description: "Finalize and export your sentinel_gatekeeper.yaml.", icon: <Code size={18} /> }
  ];

  const handleFinish = () => {
    // 1. Generate YAML Content
    const yamlContent = `# Sentinel Gatekeeper Configuration
# Generated: ${new Date().toISOString()}
# Industry: ${industry}

topology: ${config.topology.replace(/ /g, '_')}
safety_level: ${config.safetyLevel}
active_layers: [0, 1, 2, 4]
auto_recovery: ${config.autoRecovery}
integrity_hash: 0xEE92B1
governance_mode: DETERMINISTIC_FIREWALL
`;

    // 2. Trigger Download
    const blob = new Blob([yamlContent], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sentinel_gatekeeper.yaml';
    a.click();
    URL.revokeObjectURL(url);

    // 3. Notify Parent
    if (onFinish) onFinish();
  };

  const nextStep = () => {
    if (currentStep === steps.length - 1) {
      handleFinish();
    } else {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  return (
    <div className="bg-zinc-950 border border-zinc-800 h-full flex flex-col font-mono">
      {/* Wizard Header */}
      <div className="p-4 border-b border-zinc-800 bg-black flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#00ff41]/10 border border-[#00ff41]/30 flex items-center justify-center text-[#00ff41]">
            <Code size={16} />
          </div>
          <div>
            <h3 className="text-white font-black uppercase text-sm">Zero-Code_Wizard</h3>
            <p className="text-xs text-zinc-500 uppercase tracking-widest">Configure Sentinel v5.0 without source edits</p>
          </div>
        </div>
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <div key={i} className={`w-8 h-1 ${i <= currentStep ? 'bg-[#00ff41]' : 'bg-zinc-800'}`}></div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-md mx-auto space-y-8">
          <div className="space-y-2 text-center">
            <div className="inline-flex p-3 bg-zinc-900 border border-zinc-800 text-[#00ff41] mb-2">
              {steps[currentStep].icon}
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">{steps[currentStep].title}</h2>
            <p className="text-sm text-zinc-500 uppercase leading-relaxed">{steps[currentStep].description}</p>
          </div>

          <div className="bg-black border border-zinc-800 p-6 space-y-6">
            {currentStep === 0 && (
              <div className="space-y-4">
                <label className="text-xs text-zinc-500 uppercase font-bold block">Target Topology</label>
                <div className="grid grid-cols-1 gap-2">
                  {Object.values(RobotTopology).map(t => (
                    <button 
                      key={t}
                      onClick={() => setConfig({...config, topology: t})}
                      className={`p-3 text-left text-sm border transition-all ${
                        config.topology === t ? 'border-[#00ff41] bg-[#00ff41]/5 text-white' : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs text-zinc-500 uppercase font-bold">Safety Level</label>
                    <span className="text-[#00ff41] text-xs font-bold">{config.safetyLevel}</span>
                  </div>
                  <div className="flex gap-2">
                    {['DAL-E', 'DAL-C', 'DAL-A'].map(level => (
                      <button 
                        key={level}
                        onClick={() => setConfig({...config, safetyLevel: level})}
                        className={`flex-1 py-2 text-xs font-bold border ${
                          config.safetyLevel === level ? 'border-[#00ff41] bg-[#00ff41]/5 text-white' : 'border-zinc-800 text-zinc-500'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-3 bg-amber-950/10 border border-amber-900/30">
                  <p className="text-xs text-amber-500 leading-relaxed uppercase">
                    DAL-A requires formal verification of all L4 Lyapunov transitions.
                  </p>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-3">
                <label className="text-xs text-zinc-500 uppercase font-bold block">Active Governance Layers</label>
                {['L0: Topology Bridge', 'L1: Intent Coherence', 'L2: Digital Twin', 'L3: Byzantine Consensus', 'L4: Lyapunov Kernel'].map((layer, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-zinc-800 bg-zinc-900/20">
                    <span className="text-sm text-zinc-300 uppercase">{layer}</span>
                    <div className="w-4 h-4 border border-[#00ff41] flex items-center justify-center">
                      <div className="w-2 h-2 bg-[#00ff41]"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-zinc-900 p-4 border border-zinc-800">
                  <div className="flex items-center gap-2 mb-3 text-[#00ff41]">
                    <Terminal size={14} />
                    <span className="text-xs font-bold uppercase">sentinel_gatekeeper.yaml</span>
                  </div>
                  <pre className="text-xs text-zinc-400 overflow-x-auto">
                    {`topology: ${config.topology.replace(/ /g, '_')}\nsafety_level: ${config.safetyLevel}\nactive_layers: [0, 1, 2, 4]\nauto_recovery: true\nintegrity_hash: 0xEE92B1`}
                  </pre>
                </div>
                <div className="flex items-center gap-3 p-4 bg-emerald-950/20 border border-emerald-900/50 text-emerald-500">
                  <CheckCircle2 size={20} />
                  <div className="text-xs font-bold uppercase">Configuration Ready for Deployment</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Wizard Footer */}
      <div className="p-4 border-t border-zinc-800 bg-black flex justify-between">
        <button 
          onClick={prevStep}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase text-zinc-500 hover:text-white disabled:opacity-20"
        >
          <ChevronLeft size={16} />
          Back
        </button>
        <button 
          onClick={nextStep}
          className="flex items-center gap-2 px-6 py-2 bg-[#00ff41] text-black text-xs font-black uppercase tracking-widest hover:bg-white transition-all"
        >
          {currentStep === steps.length - 1 ? 'Export & Finish' : 'Next Step'}
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default ZeroCodeWizard;
