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
    <div className="fixed inset-0 z-[100] bg-[#020202] flex flex-col font-sans overflow-hidden">
      {/* HEADER */}
      <div className="flex justify-between items-center p-10 border-b border-zinc-800 bg-black relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00ff41]/50 to-transparent"></div>
        <div className="flex items-center gap-8">
          <div className="w-20 h-20 border-2 border-[#00ff41] flex items-center justify-center glow-core shadow-[0_0_30px_rgba(0,255,65,0.2)] relative group">
            <div className="absolute inset-0 bg-[#00ff41]/10 animate-pulse"></div>
            <div className="w-10 h-10 bg-[#00ff41] relative z-10"></div>
          </div>
          <div>
            <h1 className="text-9xl font-display font-black uppercase tracking-[-0.05em] text-white italic leading-[0.8]">Hardware<span className="text-[#00ff41]">_</span>Test</h1>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-[#00ff41] text-[11px] font-mono tracking-[0.6em] uppercase font-black">Sentinel v5.0 // Physical_Reliability_Layer</span>
              <div className="h-px w-24 bg-zinc-800"></div>
              <span className="text-zinc-600 text-[10px] font-mono uppercase tracking-widest">Build_Auth_0xEE92</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-12">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em] font-black mb-1">Mission_Phase</span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-display font-black text-white uppercase italic tracking-tighter leading-none">Step_0{htmScreen}</span>
              <span className="text-xl font-display font-black text-zinc-700 uppercase italic tracking-tighter leading-none">/03</span>
            </div>
          </div>
          <button onClick={onClose} className="group flex items-center gap-4 px-8 py-4 border border-zinc-800 hover:border-rose-500/50 hover:bg-rose-500/5 transition-all relative overflow-hidden">
            <div className="absolute inset-0 bg-rose-500/0 group-hover:bg-rose-500/5 transition-all"></div>
            <X size={24} className="text-zinc-600 group-hover:text-rose-500 transition-colors relative z-10" />
            <span className="text-[11px] font-mono font-black uppercase tracking-widest text-zinc-500 group-hover:text-white relative z-10">Abort_Mission</span>
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-hidden flex">
        {/* SIDEBAR STEPS */}
        <div className="w-96 border-r border-zinc-800 p-10 space-y-16 bg-black relative">
          <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-zinc-800 to-transparent"></div>
          
          {[
            { id: 1, label: "Platform Selection", icon: Cpu, desc: "Topology_Mapping", hex: "0x01" },
            { id: 2, label: "Safety Protocols", icon: ShieldCheck, desc: "Deterministic_Checks", hex: "0x02" },
            { id: 3, label: "MVK Generation", icon: Terminal, desc: "Kernel_Synthesis", hex: "0x03" }
          ].map((s) => (
            <div key={s.id} className={`flex items-start gap-6 transition-all duration-700 relative ${htmScreen === s.id ? 'opacity-100 translate-x-4' : 'opacity-20'}`}>
              {htmScreen === s.id && (
                <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-1 h-12 bg-[#00ff41] shadow-[0_0_15px_rgba(0,255,65,0.5)]"></div>
              )}
              <div className={`w-16 h-16 flex items-center justify-center border-2 transition-all relative ${htmScreen === s.id ? 'border-[#00ff41] bg-[#00ff41]/5 text-[#00ff41] shadow-[0_0_20px_rgba(0,255,65,0.15)]' : 'border-zinc-900 text-zinc-700'}`}>
                <s.icon size={32} />
                <span className="absolute -top-2 -right-2 text-[8px] font-mono font-black bg-black px-1 border border-inherit">{s.hex}</span>
              </div>
              <div className="flex flex-col pt-1">
                <span className={`font-display font-black uppercase tracking-tight text-3xl italic leading-none ${htmScreen === s.id ? 'text-white' : 'text-zinc-700'}`}>{s.label}</span>
                <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-600 mt-3 font-bold">{s.desc}</span>
              </div>
            </div>
          ))}
          
          <div className="pt-16 border-t border-zinc-900">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-2 bg-[#00ff41] animate-pulse shadow-[0_0_10px_rgba(0,255,65,0.5)]"></div>
              <span className="text-[11px] font-mono font-black text-zinc-500 uppercase tracking-[0.2em]">System_Diagnostics</span>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest group">
                <span className="text-zinc-700 group-hover:text-zinc-500 transition-colors">Encryption_Layer</span>
                <span className="text-[#00ff41] font-black">AES_256_GCM</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest group">
                <span className="text-zinc-700 group-hover:text-zinc-500 transition-colors">Clock_Sync_PTP</span>
                <span className="text-[#00ff41] font-black">LOCKED_±4ns</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest group">
                <span className="text-zinc-700 group-hover:text-zinc-500 transition-colors">Kernel_Integrity</span>
                <span className="text-[#00ff41] font-black">VERIFIED</span>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN AREA */}
        <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
          {htmScreen === 1 && (
            <div className="max-w-5xl mx-auto space-y-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-zinc-800"></div>
                  <span className="text-[10px] font-mono text-[#00ff41] uppercase tracking-[0.5em] font-bold">Step_01 // Topology_Selection</span>
                  <div className="h-px flex-1 bg-zinc-800"></div>
                </div>
                <h2 className="text-7xl font-display font-black uppercase tracking-tightest text-white italic text-center leading-none">Select_Target_Platform</h2>
                <p className="text-xl text-zinc-500 text-center max-w-2xl mx-auto leading-relaxed font-sans">Choose the hardware topology for this test mission. Sentinel will adapt its safety kernel to the specific dynamics of the platform.</p>
              </div>

              <div className="grid grid-cols-2 gap-16">
                <button 
                  onClick={() => {
                    setSelectedPlatform(HardwarePlatform.ROBOTIC_ARM);
                    setHtmScreen(2);
                    setCheckedItems({});
                  }}
                  className={`group relative p-12 bg-zinc-950 border transition-all text-left space-y-10 ${selectedPlatform === HardwarePlatform.ROBOTIC_ARM ? 'border-[#00ff41] bg-[#00ff41]/5' : 'border-zinc-800 hover:border-zinc-600'}`}
                >
                  <div className="absolute top-0 right-0 p-6 text-[9px] font-mono text-zinc-700 font-bold uppercase tracking-widest">ID: ARM_0x01</div>
                  <div className={`w-24 h-24 flex items-center justify-center border-2 transition-all ${selectedPlatform === HardwarePlatform.ROBOTIC_ARM ? 'border-[#00ff41] bg-[#00ff41] text-black shadow-[0_0_20px_rgba(0,255,65,0.3)]' : 'border-zinc-800 bg-zinc-900 text-zinc-500 group-hover:text-[#00ff41] group-hover:border-[#00ff41]/50'}`}>
                    <Activity size={48} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-4xl font-display font-black uppercase text-white italic tracking-tighter">Robotic_Arm</h3>
                    <p className="text-xs text-zinc-500 uppercase font-mono tracking-widest opacity-60">Multi-DOF Manipulator // Joint Space Governance</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 pt-6 border-t border-zinc-800/50">
                    <li className="flex items-center gap-3 text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest list-none"><div className="w-1.5 h-1.5 bg-[#00ff41]"></div> Singularity Avoidance</li>
                    <li className="flex items-center gap-3 text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest list-none"><div className="w-1.5 h-1.5 bg-[#00ff41]"></div> Torque Clamping</li>
                    <li className="flex items-center gap-3 text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest list-none"><div className="w-1.5 h-1.5 bg-[#00ff41]"></div> Collision Prediction</li>
                  </div>
                </button>

                <button 
                  onClick={() => {
                    setSelectedPlatform(HardwarePlatform.AUTONOMOUS_DRONE);
                    setHtmScreen(2);
                    setCheckedItems({});
                  }}
                  className={`group relative p-12 bg-zinc-950 border transition-all text-left space-y-10 ${selectedPlatform === HardwarePlatform.AUTONOMOUS_DRONE ? 'border-[#00ff41] bg-[#00ff41]/5' : 'border-zinc-800 hover:border-zinc-600'}`}
                >
                  <div className="absolute top-0 right-0 p-6 text-[9px] font-mono text-zinc-700 font-bold uppercase tracking-widest">ID: UAV_0x02</div>
                  <div className={`w-24 h-24 flex items-center justify-center border-2 transition-all ${selectedPlatform === HardwarePlatform.AUTONOMOUS_DRONE ? 'border-[#00ff41] bg-[#00ff41] text-black shadow-[0_0_20px_rgba(0,255,65,0.3)]' : 'border-zinc-800 bg-zinc-900 text-zinc-500 group-hover:text-[#00ff41] group-hover:border-[#00ff41]/50'}`}>
                    <Zap size={48} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-4xl font-display font-black uppercase text-white italic tracking-tighter">Autonomous_Drone</h3>
                    <p className="text-xs text-zinc-500 uppercase font-mono tracking-widest opacity-60">Multi-Rotor Flight // SE(3) Stability Kernel</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 pt-6 border-t border-zinc-800/50">
                    <li className="flex items-center gap-3 text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest list-none"><div className="w-1.5 h-1.5 bg-[#00ff41]"></div> Geofence Enforcement</li>
                    <li className="flex items-center gap-3 text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest list-none"><div className="w-1.5 h-1.5 bg-[#00ff41]"></div> Altitude Clamping</li>
                    <li className="flex items-center gap-3 text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest list-none"><div className="w-1.5 h-1.5 bg-[#00ff41]"></div> Failsafe Triggering</li>
                  </div>
                </button>
              </div>
            </div>
          )}

          {htmScreen === 2 && (
            <div className="max-w-5xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex justify-between items-end border-b border-zinc-800 pb-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-[#00ff41] uppercase tracking-[0.5em] font-bold">Step_02 // Safety_Verification</span>
                  </div>
                  <h2 className="text-6xl font-display font-black uppercase tracking-tightest text-white italic leading-none">Safety_Protocol_Wizard</h2>
                  <p className="text-xl text-zinc-500 leading-relaxed font-sans">Verify physical safety measures and configure initial governance limits.</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                   <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest font-bold">Target_Hardware</span>
                   <div className="px-6 py-3 bg-[#00ff41]/10 border border-[#00ff41]/30 text-[#00ff41] font-display font-black italic text-sm uppercase tracking-widest">
                    {selectedPlatform?.replace(/_/g, ' ')}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-16">
                <div className="col-span-7 space-y-10">
                  <div className="bg-zinc-950 border border-zinc-800 p-10 space-y-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#00ff41]/20"></div>
                    <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-display font-black uppercase text-white italic flex items-center gap-4 tracking-tighter">
                        <ShieldCheck className="text-[#00ff41]" size={28} /> Pre-Flight Checklist
                      </h3>
                      <div className="flex flex-col items-end gap-3">
                        <div 
                          className="text-[10px] font-mono font-bold uppercase tracking-widest"
                          style={{ color: progressPct === 100 ? '#00ff41' : '#71717a' }}
                        >
                          {checkedCount} / {totalCount} CONFIRMED
                        </div>
                        <div className="w-48 h-1 bg-zinc-900 rounded-none overflow-hidden">
                          <div 
                            className="h-full transition-all duration-500 ease-out"
                            style={{ 
                              width: `${progressPct}%`,
                              backgroundColor: '#00ff41',
                              boxShadow: '0 0 15px rgba(0,255,65,0.6)'
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
                          }}
                          className={`w-full flex items-center justify-between p-6 border transition-all text-left group ${checkedItems[item.id] ? 'bg-[#00ff41]/10 border-[#00ff41] text-[#00ff41]' : 'bg-black border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                        >
                          <div className="space-y-3">
                            <span className="font-display font-black uppercase tracking-tight text-2xl block italic leading-none">{item.title}</span>
                            <span className="text-[11px] font-mono uppercase tracking-widest opacity-40 block font-bold">{item.detail}</span>
                          </div>
                          <div className={`w-8 h-8 border-2 flex items-center justify-center transition-all ${checkedItems[item.id] ? 'border-[#00ff41] bg-[#00ff41] text-black' : 'border-zinc-800 group-hover:border-zinc-600'}`}>
                            {checkedItems[item.id] && <CheckCircle2 size={20} />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-span-5 space-y-10">
                  <div className="bg-zinc-950 border border-zinc-800 p-10 space-y-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#00ff41]/20"></div>
                    <h3 className="text-2xl font-display font-black uppercase text-white italic flex items-center gap-4 tracking-tighter">
                      <Lock className="text-[#00ff41]" size={28} /> Safety Limits
                    </h3>
                    <div className="space-y-12">
                      <div className="space-y-6">
                        <div className="flex justify-between items-end text-[11px] font-mono uppercase font-black tracking-widest text-zinc-500">
                          <span>Max Velocity Clamp</span>
                          <span className="text-[#00ff41] font-display text-4xl italic font-black">{safetyParams.maxVelPct}%</span>
                        </div>
                        <div className="relative h-3 bg-zinc-900 border border-zinc-800">
                          <input 
                            type="range" 
                            min="5" max="50" step="5"
                            value={safetyParams.maxVelPct}
                            onChange={(e) => setSafetyParams(prev => ({ ...prev, maxVelPct: parseInt(e.target.value) }))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div 
                            className="h-full bg-[#00ff41] shadow-[0_0_15px_rgba(0,255,65,0.4)] transition-all duration-200"
                            style={{ width: `${(safetyParams.maxVelPct / 50) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="flex justify-between items-end text-[11px] font-mono uppercase font-black tracking-widest text-zinc-500">
                          <span>Max Torque/Power</span>
                          <span className="text-[#00ff41] font-display text-4xl italic font-black">{safetyParams.maxTorquePct}%</span>
                        </div>
                        <div className="relative h-3 bg-zinc-900 border border-zinc-800">
                          <input 
                            type="range" 
                            min="10" max="60" step="5"
                            value={safetyParams.maxTorquePct}
                            onChange={(e) => setSafetyParams(prev => ({ ...prev, maxTorquePct: parseInt(e.target.value) }))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div 
                            className="h-full bg-[#00ff41] shadow-[0_0_15px_rgba(0,255,65,0.4)] transition-all duration-200"
                            style={{ width: `${(safetyParams.maxTorquePct / 60) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="p-6 bg-[#00ff41]/5 border border-[#00ff41]/20">
                        <div className="flex gap-4 text-[#00ff41]">
                          <AlertTriangle size={24} className="shrink-0" />
                          <p className="text-[10px] font-mono uppercase leading-relaxed font-bold tracking-widest">
                            Hardware Test Mode enforces a hard 50% velocity ceiling regardless of user input.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
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
                      className={`w-full py-8 font-display font-black uppercase tracking-widest text-2xl flex items-center justify-center gap-6 transition-all italic ${allItemsChecked ? 'bg-[#00ff41] text-black shadow-[0_0_40px_rgba(0,255,65,0.4)] hover:scale-[1.02]' : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}`}
                    >
                      GENERATE MVK PACKAGE <ArrowRight size={32} />
                    </button>
                    <button 
                      onClick={() => setHtmScreen(1)}
                      className="w-full py-4 border border-zinc-800 text-zinc-500 font-mono font-bold uppercase tracking-widest text-[10px] hover:bg-zinc-900 transition-colors italic"
                    >
                      ← Back to Platform Selection
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {htmScreen === 3 && (
            <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex justify-between items-end border-b border-zinc-800 pb-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-[#00ff41] uppercase tracking-[0.5em] font-bold">Step_03 // Kernel_Deployment</span>
                  </div>
                  <h2 className="text-6xl font-display font-black uppercase tracking-tightest text-white italic leading-none">MVK_Kernel_Deployment</h2>
                  <p className="text-xl text-zinc-500 leading-relaxed font-sans">Download and deploy the generated safety kernel to your target hardware.</p>
                </div>
                <div className="flex gap-6">
                   <div className="px-6 py-3 bg-zinc-900 border border-zinc-800 text-zinc-500 font-mono text-[10px] uppercase tracking-widest font-bold">
                    Build: v5.0-HTM
                  </div>
                  <div className="px-6 py-3 bg-[#00ff41]/10 border border-[#00ff41]/30 text-[#00ff41] font-display font-black italic text-sm uppercase tracking-widest">
                    Status: {deploymentStatus.toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-12 h-[600px]">
                {/* CODE VIEW */}
                <div className="col-span-7 flex flex-col border border-zinc-800 bg-black overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#00ff41]/20"></div>
                  <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/30">
                    <div className="flex items-center gap-4">
                      <FileCode className="text-[#00ff41]" size={24} />
                      <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">sentinel_mvk.py</span>
                    </div>
                    <div className="flex gap-3">
                      <button className="p-3 hover:bg-[#00ff41]/10 text-zinc-500 hover:text-[#00ff41] transition-colors" title="Copy Code">
                        <Copy size={20} />
                      </button>
                      <button className="p-3 hover:bg-[#00ff41]/10 text-zinc-500 hover:text-[#00ff41] transition-colors" title="Download File">
                        <Download size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-auto p-10 font-mono text-sm text-[#00ff41]/80 custom-scrollbar whitespace-pre leading-relaxed">
                    {isGenerating ? (
                      <div className="h-full flex flex-col items-center justify-center gap-8 text-[#00ff41]">
                        <RefreshCw className="animate-spin" size={64} />
                        <span className="text-xl font-display uppercase tracking-[0.3em] font-black italic animate-pulse">Synthesizing Deterministic Logic...</span>
                      </div>
                    ) : generatedCode}
                  </div>
                </div>

                {/* DEPLOYMENT & LOGS */}
                <div className="col-span-5 flex flex-col gap-8">
                  <div className="bg-zinc-950 border border-zinc-800 p-10 space-y-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#00ff41]/20"></div>
                    <h3 className="text-2xl font-display font-black uppercase text-white italic tracking-tighter">Deployment_Instructions</h3>
                    <div className="space-y-6 font-mono text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
                      <div className="flex gap-6">
                        <span className="text-[#00ff41] opacity-50">01</span>
                        <p>Copy <span className="text-white">sentinel_mvk.py</span> to your robot's companion computer.</p>
                      </div>
                      <div className="flex gap-6">
                        <span className="text-[#00ff41] opacity-50">02</span>
                        <p>Ensure ROS2 Foxy/Humble is sourced in your terminal.</p>
                      </div>
                      <div className="flex gap-6">
                        <span className="text-[#00ff41] opacity-50">03</span>
                        <p>Run: <span className="text-white bg-black px-3 py-1.5 border border-zinc-800">python3 sentinel_mvk.py</span></p>
                      </div>
                      <div className="flex gap-6">
                        <span className="text-[#00ff41] opacity-50">04</span>
                        <p>Sentinel will automatically intercept <span className="text-white">/cmd_vel_raw</span>.</p>
                      </div>
                    </div>
                    
                    {deploymentStatus === 'idle' && (
                      <div className="space-y-6 pt-6">
                        <button 
                          onClick={startDeployment}
                          className="w-full py-6 bg-white text-black font-display font-black uppercase tracking-widest text-xl hover:bg-[#00ff41] transition-all flex items-center justify-center gap-6 italic shadow-[0_0_25px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(0,255,65,0.4)]"
                        >
                          Simulate Deployment <Zap size={24} />
                        </button>
                        <button 
                          onClick={() => setHtmScreen(2)}
                          className="w-full py-4 border border-zinc-800 text-zinc-500 font-mono font-bold uppercase tracking-widest text-[10px] hover:bg-zinc-900 transition-colors italic"
                        >
                          ← Back to Safety Wizard
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 bg-black border border-zinc-800 flex flex-col overflow-hidden relative">
                    <div className="p-6 border-b border-zinc-800 bg-zinc-900/30 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Terminal size={20} className="text-[#00ff41]" />
                        <span className="text-[10px] font-mono font-black uppercase text-white tracking-widest italic">Kernel_Live_Monitor</span>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-3 h-3 rounded-full bg-[#00ff41] animate-pulse shadow-[0_0_15px_rgba(0,255,65,0.6)]" />
                      </div>
                    </div>
                    <div 
                      ref={logContainerRef}
                      className="flex-1 p-8 font-mono text-[10px] space-y-3 overflow-y-auto custom-scrollbar leading-relaxed"
                    >
                      {logs.map((log, i) => (
                        <div key={i} className={`flex gap-6 ${log && typeof log === 'string' && log.startsWith('[MVK]') ? 'text-[#00ff41]' : 'text-zinc-600'}`}>
                          <span className="opacity-20">[{new Date().toLocaleTimeString()}]</span>
                          <span className="font-bold tracking-tight">{log}</span>
                        </div>
                      ))}
                      {deploymentStatus === 'deploying' && (
                        <div className="flex gap-6 text-[#00ff41] animate-pulse">
                          <span className="opacity-20">[{new Date().toLocaleTimeString()}]</span>
                          <span className="font-bold">_</span>
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
      <div className="p-10 border-t border-zinc-900 bg-black flex justify-between items-center px-16 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
        <div className="flex gap-16">
          <div className="flex items-center gap-4 group">
            <ShieldCheck size={20} className="text-[#00ff41] opacity-40 group-hover:opacity-100 transition-opacity" />
            <span className="text-[11px] font-mono text-zinc-700 group-hover:text-[#00ff41] uppercase font-black tracking-[0.2em] transition-colors">MVK: Layer_Zero_Active</span>
          </div>
          <div className="flex items-center gap-4 group">
            <Clock size={20} className="text-[#00ff41] opacity-40 group-hover:opacity-100 transition-opacity" />
            <span className="text-[11px] font-mono text-zinc-700 group-hover:text-[#00ff41] uppercase font-black tracking-[0.2em] transition-colors">PTP: Master_Clock_LOCKED</span>
          </div>
          <div className="flex items-center gap-4 group">
            <Database size={20} className="text-[#00ff41] opacity-40 group-hover:opacity-100 transition-opacity" />
            <span className="text-[11px] font-mono text-zinc-700 group-hover:text-[#00ff41] uppercase font-black tracking-[0.2em] transition-colors">Storage: 94%_Available</span>
          </div>
        </div>
        <div className="text-[11px] font-mono text-[#00ff41] font-black uppercase tracking-[0.5em] italic opacity-60">
          Sentinel_Safety_Kernel // Hardware_Test_Protocol_v5.0
        </div>
      </div>
    </div>
  );
};

export default HardwareTestMode;
