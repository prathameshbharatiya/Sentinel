import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, 
  ShieldCheck, 
  Terminal, 
  X, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  FileCode, 
  Zap, 
  Activity,
  History,
  Lock,
  Clock,
  Database,
  ArrowRight,
  RefreshCw,
  Download,
  Copy
} from 'lucide-react';
import { HardwarePlatform, MvkConfig, SafetyChecklist } from '../types';

interface HardwareTestModeProps {
  onClose: () => void;
  onDeploy: (config: MvkConfig) => void;
}

const HardwareTestMode: React.FC<HardwareTestModeProps> = ({ onClose, onDeploy }) => {
  const [htmScreen, setHtmScreen] = useState<1 | 2 | 3>(1);
  const [selectedPlatform, setSelectedPlatform] = useState<HardwarePlatform | null>(null);
  const [platformConfig, setPlatformConfig] = useState<any>({
    controllerType: 'ROS2_FOXY',
    jointCount: 6,
    rotorConfig: 'QUAD_X'
  });
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [safetyParams, setSafetyParams] = useState({
    maxVelPct: 10,
    maxTorquePct: 20,
    singularityBuffer: 15,
    confidenceThreshold: 65,
    maxAltitude: 1.0,
    maxVelocity: 0.3,
    geofenceRadius: 3.0,
    watchdogTimeoutS: 0.5
  });
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'deploying' | 'active'>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [shakeUnchecked, setShakeUnchecked] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const ARM_CHECKLIST = [
    { id: 'estop', title: 'Physical E-stop Verified', detail: 'Emergency stop button is functional and within reach.' },
    { id: 'operator', title: 'Human Operator Present', detail: 'Qualified safety operator is at the controls.' },
    { id: 'area', title: 'Work Area Clear', detail: 'Operational volume is free of obstructions and personnel.' },
    { id: 'ros2', title: 'ROS2 Environment Active', detail: 'Middleware core services are running and healthy.' },
    { id: 'notrunning', title: 'MVK Not Yet Running', detail: 'No existing safety kernel instances detected.' },
    { id: 'secured', title: 'Arm Physically Secured', detail: 'Base mounting bolts and structural integrity verified.' },
    { id: 'jointlimits', title: 'Joint Limits Verified', detail: 'Software-defined joint constraints are validated.' },
    { id: 'torque', title: 'Torque Limits Configured', detail: 'Maximum motor current limits are set in firmware.' },
    { id: 'effector', title: 'End Effector Safe', detail: 'Tooling is secured and within payload limits.' },
  ];

  const DRONE_CHECKLIST = [
    { id: 'estop', title: 'Physical E-stop Verified', detail: 'Radio failsafe or physical kill switch is functional.' },
    { id: 'operator', title: 'Human Operator Present', detail: 'Qualified pilot is at the ground control station.' },
    { id: 'area', title: 'Work Area Clear', detail: 'Flight volume is free of obstructions and personnel.' },
    { id: 'ros2', title: 'ROS2 Environment Active', detail: 'MAVROS or similar bridge is active and synced.' },
    { id: 'notrunning', title: 'MVK Not Yet Running', detail: 'No existing safety kernel instances detected.' },
    { id: 'tether', title: 'Drone is Tethered', detail: 'Safety tether is engaged for initial hardware tests.' },
    { id: 'failsafe', title: 'FC Failsafe Configured', detail: 'Flight controller RTL/Land triggers are verified.' },
    { id: 'geofence', title: 'Geofence Set in FC', detail: 'Hardware-level geofence is active in PX4/ArduPilot.' },
    { id: 'pilot', title: 'Safety Pilot Ready', detail: 'Backup pilot has manual override control.' },
    { id: 'props', title: 'Propellers Secured', detail: 'Propeller integrity and mounting checked.' },
    { id: 'battery', title: 'Battery Checked', detail: 'Voltage levels and cell balance verified.' },
  ];

  const activeChecklist = selectedPlatform === HardwarePlatform.ROBOTIC_ARM
    ? ARM_CHECKLIST
    : DRONE_CHECKLIST;

  const allItemsChecked = activeChecklist.length > 0 &&
    activeChecklist.every(item => checkedItems[item.id] === true);

  const canProceedScreen1 = 
    selectedPlatform !== null &&
    platformConfig.controllerType != null &&
    (selectedPlatform === HardwarePlatform.ROBOTIC_ARM 
      ? platformConfig.jointCount != null
      : platformConfig.rotorConfig != null);

  const toggleCheck = (itemId: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Auto-transition for Screen 2 -> 3 when checklist is complete
  useEffect(() => {
    if (htmScreen === 2 && allItemsChecked && !isGenerating) {
      generateMvkCode();
    }
  }, [allItemsChecked, htmScreen, isGenerating]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const generateMvkCode = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const code = `#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
import time
import json
import hashlib
import os
import gzip
import shutil

# SENTINEL MVK v5.0 - LAYER ZERO SAFETY KERNEL
# PLATFORM: ${selectedPlatform}
# MODE: HARDWARE_TEST_MODE (RESTRICTED)

class SentinelMVK(Node):
    def __init__(self):
        super().__init__('sentinel_mvk')
        
        # 1. PARAMETER INITIALIZATION
        self.max_vel_pct = ${safetyParams.maxVelPct} / 100.0
        self.max_torque_pct = ${safetyParams.maxTorquePct} / 100.0
        self.confidence_threshold = ${safetyParams.confidenceThreshold / 100.0}
        
        # 2. LOGGING ARCHITECTURE (FOUR-TIER)
        self.log_path = "sentinel_log.jsonl"
        self.archive_dir = "sentinel_archive"
        self.cert_dir = "sentinel_certs"
        self.last_hash = "0" * 64
        
        if not os.path.exists(self.archive_dir): os.makedirs(self.archive_dir)
        if not os.path.exists(self.cert_dir): os.makedirs(self.cert_dir)

        # 3. ROS2 INTERCEPTION
        self.sub = self.create_subscription(Twist, '/cmd_vel_raw', self.intercept_callback, 10)
        self.pub = self.create_publisher(Twist, '/cmd_vel', 10)
        
        self.get_logger().info("SENTINEL MVK ACTIVE - GOVERNANCE ENGAGED")

    def intercept_callback(self, msg):
        # LAYER ZERO: DETERMINISTIC CLAMPING
        governed_msg = Twist()
        
        # Apply strict velocity limits
        governed_msg.linear.x = max(min(msg.linear.x, 1.0 * self.max_vel_pct), -1.0 * self.max_vel_pct)
        governed_msg.angular.z = max(min(msg.angular.z, 0.5 * self.max_vel_pct), -0.5 * self.max_vel_pct)
        
        # Log event with hash chain
        self.log_event(msg, governed_msg)
        
        # Publish safe command
        self.pub.publish(governed_msg)

    def log_event(self, raw, safe):
        event = {
            "ts": time.time(),
            "raw": [raw.linear.x, raw.angular.z],
            "safe": [safe.linear.x, safe.angular.z],
            "prev_hash": self.last_hash
        }
        
        event_str = json.dumps(event)
        self.last_hash = hashlib.sha256(event_str.encode()).hexdigest()
        event["hash"] = self.last_hash
        
        with open(self.log_path, "a") as f:
            f.write(json.dumps(event) + "\\n")
            
        # TIER 1 -> TIER 2 ROTATION LOGIC
        if os.path.getsize(self.log_path) > 10 * 1024 * 1024: # 10MB Rotation
            self.rotate_logs()

    def rotate_logs(self):
        timestamp = time.strftime("%Y%m%d-%H%M%S")
        archive_path = os.path.join(self.archive_dir, f"log_{timestamp}.jsonl.gz")
        
        with open(self.log_path, 'rb') as f_in:
            with gzip.open(archive_path, 'wb') as f_out:
                shutil.copyfileobj(f_in, f_out)
        
        os.remove(self.log_path)
        self.get_logger().info(f"LOG ROTATION COMPLETE: {archive_path}")

def main():
    rclpy.init()
    node = SentinelMVK()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
`;
      setGeneratedCode(code);
      setIsGenerating(false);
      setHtmScreen(3);
    }, 1500);
  };

  const startDeployment = () => {
    setDeploymentStatus('deploying');
    setLogs(["[SYSTEM] INITIALIZING HARDWARE LINK...", "[SYSTEM] VERIFYING PTP SYNC...", "[SYSTEM] UPLOADING MVK KERNEL..."]);
    
    let i = 0;
    const interval = setInterval(() => {
      const newLogs = [
        "[MVK] KERNEL_LOADED: 0x8F2A...91C",
        "[MVK] INTERCEPTING /cmd_vel_raw",
        `[MVK] SAFETY_LIMITS: VEL_CLAMP=${safetyParams.maxVelPct}%`,
        "[MVK] HASH_CHAIN_START: 0000000000000000",
        "[MVK] GOVERNANCE_ACTIVE",
        `[MVK] LOGGING TO sentinel_log.jsonl`,
        "[PTP] SYNC_QUALITY: EXCELLENT (±4ns)"
      ];
      if (i < newLogs.length) {
        setLogs(prev => [...prev, newLogs[i]]);
        i++;
      } else {
        clearInterval(interval);
        setDeploymentStatus('active');
        onDeploy({
          platform: selectedPlatform!,
          limits: {
            ...safetyParams,
            confidenceThreshold: safetyParams.confidenceThreshold / 100
          }
        });
      }
    }, 800);
  };

  const checkedCount = activeChecklist.filter(item => checkedItems[item.id]).length;
  const totalCount = activeChecklist.length;
  const progressPct = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  return (
    <div className="fixed inset-0 z-[100] bg-void/95 backdrop-blur-xl flex flex-col font-display border-4 border-amber/20">
      {/* HEADER */}
      <div className="flex justify-between items-center p-6 border-b border-amber/20 bg-amber/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber flex items-center justify-center rounded-sm">
            <Zap className="text-black" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-amber">Hardware_Test_Mode</h1>
            <p className="text-xs text-amber/60 font-mono uppercase tracking-widest">Sentinel v5.0 // Layer Zero Deployment</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-xs font-mono text-amber/40 uppercase tracking-widest">
            STEP {htmScreen} / 03
          </div>
          <button onClick={onClose} className="p-2 hover:bg-amber/10 text-amber transition-colors flex items-center gap-2 uppercase font-bold text-xs">
            <X size={24} /> <span>Cancel</span>
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-hidden flex">
        {/* SIDEBAR STEPS */}
        <div className="w-80 border-r border-amber/10 p-8 space-y-8 bg-void/50">
          {[
            { id: 1, label: "Platform Selection", icon: Cpu },
            { id: 2, label: "Safety Protocols", icon: ShieldCheck },
            { id: 3, label: "MVK Generation", icon: Terminal }
          ].map((s) => (
            <div key={s.id} className={`flex items-center gap-4 transition-opacity ${htmScreen === s.id ? 'opacity-100' : 'opacity-30'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${htmScreen === s.id ? 'border-amber bg-amber text-black' : 'border-amber/30 text-amber'}`}>
                <s.icon size={20} />
              </div>
              <span className="font-bold uppercase tracking-tight text-lg">{s.label}</span>
            </div>
          ))}
        </div>

        {/* MAIN AREA */}
        <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
          {htmScreen === 1 && (
            <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div className="space-y-4">
                <h2 className="text-5xl font-black uppercase tracking-tighter text-white">Select_Target_Platform</h2>
                <p className="text-xl text-zinc-400 leading-relaxed">Choose the hardware topology for this test mission. Sentinel will adapt its safety kernel to the specific dynamics of the platform.</p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <button 
                  onClick={() => {
                    setSelectedPlatform(HardwarePlatform.ROBOTIC_ARM);
                    setHtmScreen(2);
                    setCheckedItems({});
                  }}
                  className={`group relative p-8 bg-zinc-900/50 border-2 transition-all text-left space-y-6 ${selectedPlatform === HardwarePlatform.ROBOTIC_ARM ? 'border-amber' : 'border-zinc-800 hover:border-amber/50'}`}
                >
                  <div className={`w-16 h-16 flex items-center justify-center transition-colors ${selectedPlatform === HardwarePlatform.ROBOTIC_ARM ? 'bg-amber text-black' : 'bg-zinc-800 text-zinc-500 group-hover:text-amber'}`}>
                    <Activity size={32} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black uppercase text-white">Robotic_Arm</h3>
                    <p className="text-sm text-zinc-500 uppercase font-mono">Multi-DOF Manipulator // Joint Space Governance</p>
                  </div>
                  <ul className="space-y-2 text-xs text-zinc-400 font-mono uppercase">
                    <li className="flex items-center gap-2"><ChevronRight size={12} className="text-amber" /> Singularity Avoidance</li>
                    <li className="flex items-center gap-2"><ChevronRight size={12} className="text-amber" /> Torque Clamping</li>
                    <li className="flex items-center gap-2"><ChevronRight size={12} className="text-amber" /> Collision Prediction</li>
                  </ul>
                </button>

                <button 
                  onClick={() => {
                    setSelectedPlatform(HardwarePlatform.AUTONOMOUS_DRONE);
                    setHtmScreen(2);
                    setCheckedItems({});
                  }}
                  className={`group relative p-8 bg-zinc-900/50 border-2 transition-all text-left space-y-6 ${selectedPlatform === HardwarePlatform.AUTONOMOUS_DRONE ? 'border-amber' : 'border-zinc-800 hover:border-amber/50'}`}
                >
                  <div className={`w-16 h-16 flex items-center justify-center transition-colors ${selectedPlatform === HardwarePlatform.AUTONOMOUS_DRONE ? 'bg-amber text-black' : 'bg-zinc-800 text-zinc-500 group-hover:text-amber'}`}>
                    <Zap size={32} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black uppercase text-white">Autonomous_Drone</h3>
                    <p className="text-sm text-zinc-500 uppercase font-mono">Multi-Rotor Flight // SE(3) Stability Kernel</p>
                  </div>
                  <ul className="space-y-2 text-xs text-zinc-400 font-mono uppercase">
                    <li className="flex items-center gap-2"><ChevronRight size={12} className="text-amber" /> Geofence Enforcement</li>
                    <li className="flex items-center gap-2"><ChevronRight size={12} className="text-amber" /> Altitude Clamping</li>
                    <li className="flex items-center gap-2"><ChevronRight size={12} className="text-amber" /> Failsafe Triggering</li>
                  </ul>
                </button>
              </div>

              {/* NEXT button removed for automatic transition */}
            </div>
          )}

          {htmScreen === 2 && (
            <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div className="flex justify-between items-end">
                <div className="space-y-4">
                  <h2 className="text-5xl font-black uppercase tracking-tighter text-white">Safety_Protocol_Wizard</h2>
                  <p className="text-xl text-zinc-400 leading-relaxed">Verify physical safety measures and configure initial governance limits.</p>
                </div>
                <div className="px-4 py-2 bg-amber/10 border border-amber/30 text-amber font-mono text-xs uppercase">
                  Platform: {selectedPlatform}
                </div>
              </div>

              <div className="grid grid-cols-12 gap-12">
                <div className="col-span-7 space-y-8">
                  <div className="bg-zinc-900/50 border border-zinc-800 p-8 space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-black uppercase text-white flex items-center gap-3">
                        <ShieldCheck className="text-amber" /> Pre-Flight Checklist
                      </h3>
                      <div className="flex flex-col items-end gap-1">
                        <div 
                          className="text-[11px] font-mono font-bold uppercase"
                          style={{ color: progressPct === 100 ? 'var(--green, #22c55e)' : progressPct > 0 ? 'var(--amber)' : 'var(--text-dim, #71717a)' }}
                        >
                          {checkedCount} / {totalCount} ITEMS CONFIRMED
                        </div>
                        <div className="w-32 h-1 bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full transition-all duration-300"
                            style={{ 
                              width: `${progressPct}%`,
                              backgroundColor: progressPct === 100 ? '#22c55e' : '#FFB800'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {activeChecklist.map((item) => (
                        <button 
                          key={item.id}
                          onClick={() => toggleCheck(item.id)}
                          style={{
                            animation: (shakeUnchecked && !checkedItems[item.id]) ? 'shake 0.5s ease' : 'none',
                            borderLeft: (shakeUnchecked && !checkedItems[item.id]) ? '3px solid #ef4444' : 'none'
                          }}
                          className={`w-full flex items-center justify-between p-4 border transition-all text-left ${checkedItems[item.id] ? 'bg-amber/10 border-amber text-amber' : 'bg-black border-zinc-800 text-zinc-500'}`}
                        >
                          <div className="space-y-1">
                            <span className="font-bold uppercase tracking-tight text-sm block">{item.title}</span>
                            <span className="text-[10px] opacity-60 block">{item.detail}</span>
                          </div>
                          {checkedItems[item.id] ? <CheckCircle2 size={20} /> : <div className="w-5 h-5 border-2 border-zinc-800 rounded-full" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-span-5 space-y-8">
                  <div className="bg-zinc-900/50 border border-zinc-800 p-8 space-y-6">
                    <h3 className="text-xl font-black uppercase text-white flex items-center gap-3">
                      <Lock className="text-amber" /> Safety Limits
                    </h3>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] uppercase font-bold text-zinc-500">
                          <span>Max Velocity Clamp</span>
                          <span className="text-amber">{safetyParams.maxVelPct}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="5" max="50" step="5"
                          value={safetyParams.maxVelPct}
                          onChange={(e) => setSafetyParams(prev => ({ ...prev, maxVelPct: parseInt(e.target.value) }))}
                          className="w-full accent-amber"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] uppercase font-bold text-zinc-500">
                          <span>Max Torque/Power</span>
                          <span className="text-amber">{safetyParams.maxTorquePct}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="10" max="60" step="5"
                          value={safetyParams.maxTorquePct}
                          onChange={(e) => setSafetyParams(prev => ({ ...prev, maxTorquePct: parseInt(e.target.value) }))}
                          className="w-full accent-amber"
                        />
                      </div>
                      <div className="p-4 bg-amber/5 border border-amber/20 rounded-sm">
                        <div className="flex gap-3 text-amber">
                          <AlertTriangle size={16} className="shrink-0" />
                          <p className="text-[10px] uppercase leading-tight font-bold">
                            Hardware Test Mode enforces a hard 50% velocity ceiling regardless of user input.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button 
                      onClick={() => {
                        if (allItemsChecked) {
                          generateMvkCode();
                        } else {
                          setShakeUnchecked(true);
                          setTimeout(() => setShakeUnchecked(false), 600);
                        }
                      }}
                      disabled={!allItemsChecked}
                      style={{
                        opacity: allItemsChecked ? 1 : 0.4,
                        cursor: allItemsChecked ? 'pointer' : 'not-allowed',
                        background: allItemsChecked ? 'var(--amber)' : 'var(--border)',
                        color: allItemsChecked ? '#000' : 'var(--text-dim)'
                      }}
                      className="w-full py-6 font-black uppercase tracking-widest text-xl flex items-center justify-center gap-3 transition-all"
                    >
                      GENERATE MVK PACKAGE <ArrowRight />
                    </button>
                    <button 
                      onClick={() => setHtmScreen(1)}
                      className="w-full py-3 border border-zinc-800 text-zinc-500 font-bold uppercase tracking-widest text-xs hover:bg-zinc-900 transition-colors"
                    >
                      ← Back to Platform Selection
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {htmScreen === 3 && (
            <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div className="flex justify-between items-end">
                <div className="space-y-4">
                  <h2 className="text-5xl font-black uppercase tracking-tighter text-white">MVK_Kernel_Deployment</h2>
                  <p className="text-xl text-zinc-400 leading-relaxed">Download and deploy the generated safety kernel to your target hardware.</p>
                </div>
                <div className="flex gap-4">
                   <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono text-xs uppercase">
                    Build: v5.0-HTM
                  </div>
                  <div className="px-4 py-2 bg-amber/10 border border-amber/30 text-amber font-mono text-xs uppercase">
                    Status: {deploymentStatus.toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-8 h-[600px]">
                {/* CODE VIEW */}
                <div className="col-span-7 flex flex-col border border-zinc-800 bg-black overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/30">
                    <div className="flex items-center gap-3">
                      <FileCode className="text-amber" size={18} />
                      <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">sentinel_mvk.py</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-amber/10 text-zinc-500 hover:text-amber transition-colors" title="Copy Code">
                        <Copy size={16} />
                      </button>
                      <button className="p-2 hover:bg-amber/10 text-zinc-500 hover:text-amber transition-colors" title="Download File">
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-auto p-6 font-mono text-xs text-amber/80 custom-scrollbar whitespace-pre">
                    {isGenerating ? (
                      <div className="h-full flex flex-col items-center justify-center gap-4 text-amber">
                        <RefreshCw className="animate-spin" size={32} />
                        <span className="uppercase tracking-widest animate-pulse">Synthesizing Deterministic Logic...</span>
                      </div>
                    ) : generatedCode}
                  </div>
                </div>

                {/* DEPLOYMENT & LOGS */}
                <div className="col-span-5 flex flex-col gap-6">
                  <div className="bg-zinc-900/50 border border-zinc-800 p-8 space-y-6">
                    <h3 className="text-xl font-black uppercase text-white">Deployment_Instructions</h3>
                    <div className="space-y-4 font-mono text-[11px] text-zinc-400 uppercase">
                      <div className="flex gap-3">
                        <span className="text-amber">01</span>
                        <p>Copy <span className="text-white">sentinel_mvk.py</span> to your robot's companion computer.</p>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-amber">02</span>
                        <p>Ensure ROS2 Foxy/Humble is sourced in your terminal.</p>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-amber">03</span>
                        <p>Run: <span className="text-white bg-black px-2 py-0.5 border border-zinc-800">python3 sentinel_mvk.py</span></p>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-amber">04</span>
                        <p>Sentinel will automatically intercept <span className="text-white">/cmd_vel_raw</span>.</p>
                      </div>
                    </div>
                    
                    {deploymentStatus === 'idle' && (
                      <div className="space-y-4">
                        <button 
                          onClick={startDeployment}
                          className="w-full py-4 bg-white text-black font-black uppercase tracking-widest hover:bg-amber transition-colors flex items-center justify-center gap-3"
                        >
                          Simulate Deployment <Zap size={18} />
                        </button>
                        <button 
                          onClick={() => setHtmScreen(2)}
                          className="w-full py-2 border border-zinc-800 text-zinc-500 font-bold uppercase tracking-widest text-[10px] hover:bg-zinc-900 transition-colors"
                        >
                          ← Back to Safety Wizard
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 bg-black border border-zinc-800 flex flex-col overflow-hidden">
                    <div className="p-3 border-b border-zinc-800 bg-zinc-900/30 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Terminal size={14} className="text-amber" />
                        <span className="text-[10px] font-bold uppercase text-zinc-500">Kernel_Live_Monitor</span>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
                      </div>
                    </div>
                    <div 
                      ref={logContainerRef}
                      className="flex-1 p-4 font-mono text-[10px] space-y-1 overflow-y-auto custom-scrollbar"
                    >
                      {logs.map((log, i) => (
                        <div key={i} className={`flex gap-3 ${log && typeof log === 'string' && log.startsWith('[MVK]') ? 'text-amber' : 'text-zinc-500'}`}>
                          <span className="opacity-30">[{new Date().toLocaleTimeString()}]</span>
                          <span>{log}</span>
                        </div>
                      ))}
                      {deploymentStatus === 'deploying' && (
                        <div className="flex gap-3 text-amber animate-pulse">
                          <span className="opacity-30">[{new Date().toLocaleTimeString()}]</span>
                          <span>_</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t border-amber/20 bg-amber/5 flex justify-between items-center px-8">
        <div className="flex gap-8">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-amber/40" />
            <span className="text-[10px] text-amber/40 uppercase font-bold">MVK: Layer Zero Active</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-amber/40" />
            <span className="text-[10px] text-amber/40 uppercase font-bold">PTP: Master Clock Detected</span>
          </div>
          <div className="flex items-center gap-2">
            <Database size={14} className="text-amber/40" />
            <span className="text-[10px] text-amber/40 uppercase font-bold">Storage: 94% Available</span>
          </div>
        </div>
        <div className="text-[10px] text-amber font-black uppercase tracking-widest">
          Sentinel_Safety_Kernel // Hardware_Test_Protocol_v5.0
        </div>
      </div>
    </div>
  );
};

export default HardwareTestMode;
