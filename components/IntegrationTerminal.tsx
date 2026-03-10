import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Send, Cpu, Zap, ShieldAlert, Bot, User, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { IndustryProfile, RobotTopology } from '../types';

interface Message {
  role: 'assistant' | 'user';
  content: string;
  timestamp: number;
}

interface IntegrationTerminalProps {
  industry?: IndustryProfile;
  onTopologyDetected?: (topology: RobotTopology) => void;
  onIndustryDetected?: (industry: IndustryProfile) => void;
}

const IntegrationTerminal: React.FC<IntegrationTerminalProps> = ({ 
  industry = IndustryProfile.GENERAL_ROBOTICS,
  onTopologyDetected,
  onIndustryDetected
}) => {
  const getInitialMessage = () => {
    const base = "SYSTEM: Sentinel Integration Kernel v5.0.2 Online.\n\nI am a Sentinel Integration Engineer. My job is to help you connect your robot to Sentinel — the governance layer between AI and physical actuation.\n\n";
    
    if (industry === IndustryProfile.AEROSPACE_LAUNCH) {
      return base + "For Aerospace & Launch, I specialize in NASA-STD-8739.8 compliance and Flight Termination System (FTS) logic.\n\nBefore we begin, I need to ask:\n1. What is your launch vehicle configuration?\n2. Which flight computer architecture are you using? (Rad-Hard, FPGA, etc.)\n3. What is your telemetry link protocol?\n4. Are you integrating with a Range Safety system?";
    }
    
    if (industry === IndustryProfile.URBAN_AIR_MOBILITY) {
      return base + "For Urban Air Mobility, I specialize in DO-178C DAL-A traceability and multi-rotor failure redistribution.\n\nBefore we begin, I need to ask:\n1. What is your rotor configuration (4 to 12 rotors)?\n2. Which flight controller stack are you using? (PX4, ArduPilot, or Custom?)\n3. How do you handle emergency landing zone calculations?\n4. What is your primary compute platform?";
    }
    
    if (industry === IndustryProfile.FLEET_LOGISTICS) {
      return base + "For Fleet & Logistics, I specialize in Byzantine-resilient consensus and PTP-synchronized fleet coordination.\n\nBefore we begin, I need to ask:\n1. How many nodes are in your fleet?\n2. What is your network topology (Mesh, Star, etc.)?\n3. Which communication middleware are you using? (ROS2/DDS, Zenoh, etc.)\n4. What is your required clock synchronization precision?";
    }

    return base + "Before we begin, I need to ask you four questions:\n\n1. What is your robot? (drone, arm, rover, custom hardware?)\n2. Which flight controller stack are you using? (PX4 v1.14+, ArduPilot, or Custom?)\n3. How does your AI currently send commands? (ROS2 topics, direct serial, custom protocol?)\n4. What hardware are you running on? (compute board, OS?)";
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: getInitialMessage(),
      timestamp: Date.now()
    }
  ]);

  // Reset messages when industry changes
  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: getInitialMessage(),
        timestamp: Date.now()
      }
    ]);
  }, [industry]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const [detectedTopology, setDetectedTopology] = useState<string | null>(null);
  const [detectedIndustry, setDetectedIndustry] = useState<string | null>(null);

  const getSymbolicResponse = (userInput: string, currentCount: number): string => {
    const input = userInput.toLowerCase();
    
    // Keyword detection
    let newTopology = detectedTopology;
    let newIndustry = detectedIndustry;

    if (input.includes('quadcopter') || input.includes('drone') || input.includes('multi rotor') || input.includes('multirotor') || input.includes('milti rotor') || input.includes('multi-rotor')) {
      newTopology = "Quadcopter (3D-Flight)";
      newIndustry = "General Robotics";
    } else if (input.includes('rocket') || input.includes('launch vehicle') || input.includes('ballistic')) {
      newTopology = "Rocket (Vertical Ascent)";
      newIndustry = "Aerospace & Launch";
    } else if (input.includes('rover') || input.includes('car') || input.includes('mobile robot')) {
      newTopology = "Mobile Rover (2D-Traction)";
      newIndustry = "Fleet & Logistics";
    } else if (input.includes('arm') || input.includes('manipulator') || input.includes('joint')) {
      newTopology = "Robotic Arm (2-DOF)";
      newIndustry = "General Robotics";
    } else if (input.includes('evtol') || input.includes('air taxi') || input.includes('passenger drone')) {
      newTopology = "eVTOL (Multi-Rotor Flight)";
      newIndustry = "Urban Air Mobility";
    }

    // If we have a topology but it's very early, ask one follow up
    if (newTopology && currentCount < 1) {
      return `Understood. I've noted the ${newTopology} topology. To finalize the L4 Lyapunov boundaries, could you clarify your specific hardware constraints or any safety certifications (e.g. ISO 26262, DO-178C) you need to comply with?`;
    }

    // If we have a topology and enough interaction, give the config
    if (newTopology) {
      let response = `I've analyzed your integration profile via the local Symbolic Engine. Detected ${newTopology} topology. `;
      
      if (newTopology === "Quadcopter (3D-Flight)") {
        response += "For this setup, I recommend the Sentinel ROS2 Safety Node. It intercepts /cmd_vel topics and applies a 3D Lyapunov boundary to prevent ground collisions and fly-aways.\n\n[SENTINEL_CONFIG: {\"topology\": \"Quadcopter (3D-Flight)\", \"industry\": \"General Robotics\"}]";
      } else if (newTopology === "Rocket (Vertical Ascent)") {
        response += "Aerospace context detected. We must enforce NASA-STD-8739.8 compliance. I'm initializing the L4 Flight Termination System (FTS) and the L2 Propellant Mass Flow Observer.\n\n[SENTINEL_CONFIG: {\"topology\": \"Rocket (Vertical Ascent)\", \"industry\": \"Aerospace & Launch\"}]";
      } else if (newTopology === "Mobile Rover (2D-Traction)") {
        response += "Mobile Rover (2D-Traction) topology identified. Integration path: Shadow Driver SDK (C++). This will govern wheel slip and ensure the robot stays within the admissible 2D safety set.\n\n[SENTINEL_CONFIG: {\"topology\": \"Mobile Rover (2D-Traction)\", \"industry\": \"Fleet & Logistics\"}]";
      } else if (newTopology === "Robotic Arm (2-DOF)") {
        response += "Robotic Arm (2-DOF) detected. We will use the Sentinel HIL Bridge for initial joint-space stability verification before moving to the physical HAL.\n\n[SENTINEL_CONFIG: {\"topology\": \"Robotic Arm (2-DOF)\", \"industry\": \"General Robotics\"}]";
      } else if (newTopology === "eVTOL (Multi-Rotor Flight)") {
        response += "Urban Air Mobility (eVTOL) profile active. Enforcing DO-178C DAL-A standards. Initializing Rotor Failure Redistribution logic (L5).\n\n[SENTINEL_CONFIG: {\"topology\": \"eVTOL (Multi-Rotor Flight)\", \"industry\": \"Urban Air Mobility\"}]";
      }
      return response;
    }

    return "I'm still gathering data. To provide the correct L4 Lyapunov boundaries, I need to be certain about your topology. Are we looking at a multi-rotor, a ground vehicle, or a fixed-base manipulator?";
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setInteractionCount(prev => prev + 1);

    try {
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
      if (!apiKey) {
        throw new Error("API_KEY_MISSING");
      }
      const ai = new GoogleGenAI({ apiKey });
      
      const systemInstruction = `
        You are a Sentinel Integration Engineer.
        Your job is to help the user connect their robot to Sentinel — the governance layer between AI and physical actuation.
        
        CURRENT CONTEXT: ${industry}

        You have deep knowledge of:
        - Sentinel's full layer architecture (L0 through L8)
        - The Sentinel ROS2 Safety Node
        - The Sentinel C++ Shadow Driver SDK
        - The Sentinel HAL (Hardware Abstraction Layer)
        - The Sentinel HIL Bridge for simulation testing
        - Supported topologies: quadcopter, rover, linear actuator, eVTOL, rocket
        - Supported hardware: ARM Cortex-M7, RISC-V, FPGA, Rad-Hard processors
        - Supported interfaces: PWM, CAN bus, UART, SPI
        - Flight Controller Stacks: 
          - PX4 (v1.14+ DDS topics: /fmu/in/setpoint_velocity/cmd)
          - ArduPilot (AP_DDS 4.4+ topics: /ap/cmd_vel, /ap/nav_state)
          - Custom.
        
        INDUSTRY SPECIFICS:
        - Aerospace & Launch: NASA-STD-8739.8, FTS, propellant flow, Rad-Hard architectures.
        - Urban Air Mobility: DO-178C DAL-A, rotor failure redistribution, emergency landing zones.
        - Fleet & Logistics: Byzantine Consensus, PTP sync, ROS2/DDS, multi-agent collision avoidance.

        The user is in the process of answering your initial four questions. 
        
        QUESTIONS ASKED:
        ${industry === IndustryProfile.AEROSPACE_LAUNCH ? `
        1. What is your launch vehicle configuration?
        2. Which flight computer architecture are you using?
        3. What is your telemetry link protocol?
        4. Are you integrating with a Range Safety system?` : industry === IndustryProfile.URBAN_AIR_MOBILITY ? `
        1. What is your rotor configuration?
        2. Which flight controller stack are you using?
        3. How do you handle emergency landing zone calculations?
        4. What is your primary compute platform?` : industry === IndustryProfile.FLEET_LOGISTICS ? `
        1. How many nodes are in your fleet?
        2. What is your network topology?
        3. Which communication middleware are you using?
        4. What is your required clock synchronization precision?` : `
        1. What is your robot?
        2. Which flight controller stack are you using?
        3. How does your AI currently send commands?
        4. What hardware are you running on?`}

        CRITICAL RULE:
        - DO NOT provide the [SENTINEL_CONFIG: ...] tag until the user has provided enough detail for ALL FOUR questions.
        - If the user only answers some questions, acknowledge them and ask for the remaining ones.
        - Be professional, technical, and thorough.
        
        DETECTION RULE:
        Once (and ONLY once) you have all the information, include the tag:
        [SENTINEL_CONFIG: {"topology": "...", "industry": "..."}]

        Rules you never break:
        - Never give generic answers. Every response is specific to their robot and their setup.
        - If they haven't answered all four questions yet, politely ask for the missing ones.
        - Once you have the answers, provide:
          STEP 1: Which Sentinel integration path fits them (ROS2 Safety Node, Shadow Driver SDK, or HIL Bridge).
          STEP 2: The exact configuration block they need (topology, mass range, actuator limits, admissible set).
          STEP 3: The exact code or command to get started. Real code. Copy-paste ready. No placeholders.
                  - Use REAL Linux/Robotics commands. 
                  - Instead of a fake CLI, use things like 'sqlite3 /var/log/sentinel/ledger.db', 'tail -f /var/log/sentinel/governor.log', or 'cat /home/pi/sentinel_logs/ledger.db'.
                  - If using ROS2, ensure topic names match their stack (e.g., PX4 v1.14+ uses /fmu/in/setpoint_velocity/cmd).
                  - If Aerospace, use commands relevant to flight computers (e.g., 'fprime-gds', 'mavproxy').
          STEP 4: Tell them what to expect (what Sentinel intercepts, robot behavior, first ledger entry).
          STEP 5: Your Integration Certificate. Explain that once the first ledger entry is confirmed, they can generate a signed Sentinel Integration Certificate. 
                  - This certificate includes a SHA-256 hash of their 'sentinel_gatekeeper.yaml' config.
                  - Emphasize its value for insurers and regulators as proof of governed autonomy.
        - Never assume their topology. Always confirm.
        - If their hardware is unsupported, tell them honestly and tell them what adapter they need.
        - If their setup has a risk, flag it before they plug anything in.
        - Speak like a brilliant engineer. Clear. Direct. No jargon unless they use it first.
        - Format code blocks clearly using markdown.
      `;

      const history = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...history, { role: 'user', parts: [{ text: input }] }],
        config: {
          systemInstruction,
          temperature: 0.2,
        }
      });

      const aiMessage: Message = {
        role: 'assistant',
        content: response.text || "Error: Kernel timed out. Please retry command.",
        timestamp: Date.now()
      };

      // Configuration Detection
      const configMatch = aiMessage.content.match(/\[SENTINEL_CONFIG:\s*({.*?})\]/);
      if (configMatch) {
        try {
          const config = JSON.parse(configMatch[1]);
          if (config.topology && onTopologyDetected) onTopologyDetected(config.topology);
          if (config.industry && onIndustryDetected) onIndustryDetected(config.industry);
          
          // Clean up the message for the user
          aiMessage.content = aiMessage.content.replace(/\[SENTINEL_CONFIG:.*?\]/g, '').trim();
        } catch (e) {
          console.error("Failed to parse detected config", e);
        }
      }

      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      console.error("Integration Engineer Error:", error);
      
      // SYMBOLIC FALLBACK: Answer everytime even without API key
      const fallbackContent = getSymbolicResponse(input, interactionCount);
      const aiMessage: Message = {
        role: 'assistant',
        content: fallbackContent,
        timestamp: Date.now()
      };

      // Configuration Detection in Fallback
      const configMatch = aiMessage.content.match(/\[SENTINEL_CONFIG:\s*({.*?})\]/);
      if (configMatch) {
        try {
          const config = JSON.parse(configMatch[1]);
          if (config.topology && onTopologyDetected) onTopologyDetected(config.topology);
          if (config.industry && onIndustryDetected) onIndustryDetected(config.industry);
          aiMessage.content = aiMessage.content.replace(/\[SENTINEL_CONFIG:.*?\]/g, '').trim();
        } catch (e) {}
      } else {
        // If no config yet, try to extract topology for state tracking
        const inputLower = input.toLowerCase();
        if (inputLower.includes('quadcopter') || inputLower.includes('drone') || inputLower.includes('multi rotor') || inputLower.includes('multirotor') || inputLower.includes('milti rotor') || inputLower.includes('multi-rotor')) {
          setDetectedTopology("Quadcopter (3D-Flight)");
          setDetectedIndustry("General Robotics");
        } else if (inputLower.includes('rocket') || inputLower.includes('launch vehicle') || inputLower.includes('ballistic')) {
          setDetectedTopology("Rocket (Vertical Ascent)");
          setDetectedIndustry("Aerospace & Launch");
        } else if (inputLower.includes('rover') || inputLower.includes('car') || inputLower.includes('mobile robot')) {
          setDetectedTopology("Mobile Rover (2D-Traction)");
          setDetectedIndustry("Fleet & Logistics");
        } else if (inputLower.includes('arm') || inputLower.includes('manipulator') || inputLower.includes('joint')) {
          setDetectedTopology("Robotic Arm (2-DOF)");
          setDetectedIndustry("General Robotics");
        } else if (inputLower.includes('evtol') || inputLower.includes('air taxi') || inputLower.includes('passenger drone')) {
          setDetectedTopology("eVTOL (Multi-Rotor Flight)");
          setDetectedIndustry("Urban Air Mobility");
        }
      }

      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black border border-zinc-800 font-mono text-sm overflow-hidden shadow-2xl">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-[#00ff41]" />
          <span className="text-zinc-400 uppercase tracking-widest text-[11px] font-bold">Sentinel_Integration_Terminal_v5.0</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
          <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
          <div className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse"></div>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[radial-gradient(circle_at_center,rgba(0,255,65,0.03)_0%,transparent_100%)]"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[90%] p-3 rounded-sm ${
              msg.role === 'user' 
                ? 'bg-zinc-900 border border-zinc-800 text-zinc-200' 
                : 'bg-black border-l-2 border-[#00ff41] text-[#00ff41]'
            }`}>
              <div className="flex items-center gap-2 mb-1 opacity-40 text-[10px] uppercase tracking-tighter">
                {msg.role === 'assistant' ? <Cpu size={10} /> : <Zap size={10} />}
                {msg.role === 'assistant' ? 'Sentinel_Engineer' : 'Operator_Input'}
                <span className="ml-auto">{new Date(msg.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="whitespace-pre-wrap leading-relaxed text-zinc-200 space-y-2">
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-2 text-[#00ff41] animate-pulse">
            <span className="w-1 h-3 bg-[#00ff41]"></span>
            <span>Kernel_Processing...</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-zinc-800 bg-zinc-950">
        <div className="flex items-center gap-3">
          <span className="text-[#00ff41] font-bold">{'>'}</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your response..."
            className="flex-1 bg-transparent border-none outline-none text-[#00ff41] placeholder:text-zinc-700"
            disabled={isTyping}
          />
          <button 
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="p-1.5 hover:bg-zinc-900 rounded-sm transition-colors disabled:opacity-20"
          >
            <Send size={14} className="text-[#00ff41]" />
          </button>
        </div>
      </div>

      {/* Risk Warning Footer */}
      <div className="px-3 py-1.5 bg-rose-950/20 border-t border-rose-900/30 flex items-center gap-2">
        <ShieldAlert size={12} className="text-rose-500" />
        <span className="text-[10px] text-rose-500/80 uppercase tracking-widest font-bold">
          Safety_Protocol: Never actuate hardware without a verified Lyapunov proof.
        </span>
      </div>
    </div>
  );
};

export default IntegrationTerminal;
