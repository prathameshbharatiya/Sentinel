import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { IndustryProfile, RobotTopology } from '../types';

interface PhysicalManifest {
  topology: RobotTopology;
  mass: number;
  friction: number;
  drag: number;
  actuatorLimits: {
    min: number;
    max: number;
    maxRate: number;
  };
  safetyMargin: number;
}

interface PhysicalManifestUploaderProps {
  industry: IndustryProfile;
  topology: RobotTopology;
  onTopologyChange: (topology: RobotTopology) => void;
  onManifestValidated: (manifest: PhysicalManifest) => void;
}

const PhysicalManifestUploader: React.FC<PhysicalManifestUploaderProps> = ({ industry, topology, onTopologyChange, onManifestValidated }) => {
  const [dragActive, setDragActive] = useState(false);
  const [manifest, setManifest] = useState<Partial<PhysicalManifest>>({
    topology: topology,
    mass: industry === IndustryProfile.AEROSPACE_LAUNCH ? 150 : 1.5,
    friction: 0.1,
    drag: 0.05,
    actuatorLimits: { min: -100, max: 100, maxRate: 50 },
    safetyMargin: 0.2
  });

  // Sync internal manifest when topology prop changes
  React.useEffect(() => {
    setManifest(prev => ({ 
      ...prev, 
      topology: topology,
      mass: industry === IndustryProfile.AEROSPACE_LAUNCH && (prev.mass || 0) < 100 ? 150 : prev.mass
    }));
  }, [topology, industry]);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const getRequiredParameters = () => {
    switch (topology) {
      case RobotTopology.QUADCOPTER:
      case RobotTopology.EVTOL:
        return ["mass", "inertia_tensor", "rotor_constant", "propeller_map"];
      case RobotTopology.ROCKET:
        return ["mass", "mass_flow_rate", "tvc_alignment", "aerodynamic_coefficients"];
      case RobotTopology.ROVER:
        return ["mass", "tire_friction_model", "chassis_geometry"];
      case RobotTopology.INDUSTRIAL_ARM:
        return ["mass", "dh_parameters", "joint_friction_model", "payload_inertia"];
      default:
        return ["mass", "topology"];
    }
  };

  const validateManifest = (m: Partial<PhysicalManifest>, fileContent?: any) => {
    const errs: string[] = [];
    
    // Basic validation
    if (!m.mass || m.mass <= 0) errs.push("Mass must be positive.");
    if (industry === IndustryProfile.AEROSPACE_LAUNCH && (m.mass || 0) < 100) {
      errs.push("Aerospace profile requires minimum mass of 100kg for stability proofs.");
    }
    if (industry === IndustryProfile.URBAN_AIR_MOBILITY && topology !== RobotTopology.EVTOL && topology !== RobotTopology.QUADCOPTER) {
      errs.push("UAM profile requires eVTOL or Quadcopter topology.");
    }

    // Strict Schema Validation for uploaded files
    if (fileContent) {
      const required = getRequiredParameters();
      const missing = required.filter(key => !fileContent[key] && fileContent[key] !== 0);
      if (missing.length > 0) {
        errs.push(`Missing required parameters in file: ${missing.join(", ")}`);
      }
    }
    
    setErrors(errs);
    const valid = errs.length === 0;
    setIsValid(valid);
    if (valid) {
      onManifestValidated(m as PhysicalManifest);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.json') || file.name.endsWith('.yaml')) {
        // Simulate parsing the file content
        // In a real app, we would use JSON.parse or a YAML parser
        const mockParsedContent: any = {
          mass: manifest.mass,
          // Intentionally missing some keys to demonstrate validation
        };
        
        // Add some keys based on topology to simulate a "partially correct" file
        if (topology === RobotTopology.QUADCOPTER) {
          mockParsedContent.inertia_tensor = [1, 1, 1];
        }

        validateManifest(manifest, mockParsedContent);
      } else {
        setErrors(["Unsupported file format. Use .json or .yaml"]);
        setIsValid(false);
      }
    }
  };

  const getRequirements = () => {
    switch (topology) {
      case RobotTopology.QUADCOPTER:
      case RobotTopology.EVTOL:
        return ["rotor_constant.json", "inertia_tensor.yaml", "propeller_map.csv"];
      case RobotTopology.ROCKET:
        return ["mass_flow_rate.json", "tvc_alignment.yaml", "aerodynamic_coefficients.csv"];
      case RobotTopology.ROVER:
        return ["tire_friction_model.json", "chassis_geometry.yaml"];
      case RobotTopology.INDUSTRIAL_ARM:
        return ["dh_parameters.json", "joint_friction_model.csv", "payload_inertia.yaml"];
      default:
        return ["robot_manifest.yaml"];
    }
  };

  return (
    <div className="bg-black border border-zinc-800 p-6 space-y-6 font-mono">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h3 className="text-white font-black uppercase text-sm flex items-center gap-2">
            <Upload size={16} className="text-[#00ff41]" />
            Physical_Manifest_Uploader
          </h3>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">
            Define Newtonian constraints for {industry}
          </p>
        </div>
        {isValid === true && (
          <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold uppercase">
            <CheckCircle2 size={14} />
            Validated
          </div>
        )}
      </div>

      <div className="p-3 bg-zinc-900 border border-zinc-800 space-y-2">
        <p className="text-xs text-zinc-500 uppercase font-bold">Minimum Requirements for {topology}:</p>
        <div className="flex flex-wrap gap-2">
          {getRequirements().map(req => (
            <span key={req} className="text-[10px] bg-black border border-zinc-800 px-2 py-1 text-zinc-400">{req}</span>
          ))}
        </div>
      </div>

      <div 
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed transition-all p-8 flex flex-col items-center justify-center text-center gap-4 ${
          dragActive ? 'border-[#00ff41] bg-[#00ff41]/5' : 'border-zinc-800 bg-zinc-900/20'
        }`}
      >
        <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500">
          <FileText size={24} />
        </div>
        <div>
          <p className="text-sm text-zinc-300 uppercase font-bold">Drop {getRequirements()[0]} here</p>
          <p className="text-xs text-zinc-600 uppercase mt-1 tracking-tighter">or click to browse local storage</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs text-zinc-500 uppercase font-bold">Topology</label>
          <select 
            value={topology}
            onChange={(e) => onTopologyChange(e.target.value as RobotTopology)}
            className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm p-2 outline-none focus:border-[#00ff41]"
          >
            {Object.values(RobotTopology).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-zinc-500 uppercase font-bold">Mass (kg)</label>
          <input 
            type="number"
            value={manifest.mass}
            onChange={(e) => setManifest({...manifest, mass: parseFloat(e.target.value)})}
            className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm p-2 outline-none focus:border-[#00ff41]"
          />
        </div>
      </div>

      {errors.length > 0 && (
        <div className="p-3 bg-rose-950/20 border border-rose-900/50 space-y-2">
          <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase">
            <AlertTriangle size={12} />
            Validation_Errors
          </div>
          <ul className="text-xs text-rose-400 space-y-1">
            {errors.map((err, i) => <li key={i}>• {err}</li>)}
          </ul>
        </div>
      )}

      <div className="p-3 bg-blue-950/10 border border-blue-900/30 flex gap-3">
        <Info size={16} className="text-blue-500 shrink-0" />
        <p className="text-xs text-blue-400 leading-relaxed uppercase">
          Sentinel uses these parameters to pre-condition the Lyapunov Kernel. 
          Incorrect mass or drag values will trigger L2 Digital Twin divergence alerts.
        </p>
      </div>

      <button 
        onClick={() => validateManifest(manifest)}
        className="w-full py-3 bg-[#00ff41] text-black font-black uppercase text-sm tracking-widest hover:bg-white transition-all"
      >
        Validate & Commit Manifest
      </button>
    </div>
  );
};

export default PhysicalManifestUploader;
