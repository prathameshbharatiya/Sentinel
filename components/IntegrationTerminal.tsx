import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Send, Cpu, Zap, ShieldAlert } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'assistant' | 'user';
  content: string;
  timestamp: number;
}

const IntegrationTerminal: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "SYSTEM: Sentinel Integration Kernel v5.0.2 Online.\n\nI am a Sentinel Integration Engineer. My job is to help you connect your robot to Sentinel — the governance layer between AI and physical actuation.\n\nBefore we begin, I need to ask you three questions:\n\n1. What is your robot? (drone, arm, rover, custom hardware?)\n2. How does your AI currently send commands to your robot? (ROS2 topics, direct serial, custom protocol?)\n3. What hardware are you running on? (flight controller model, compute board, OS?)",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const systemInstruction = `
        You are a Sentinel Integration Engineer.
        Your job is to help the user connect their robot to Sentinel — the governance layer between AI and physical actuation.

        You have deep knowledge of:
        - Sentinel's full layer architecture (L0 through L8)
        - The Sentinel ROS2 Safety Node
        - The Sentinel C++ Shadow Driver SDK
        - The Sentinel HAL (Hardware Abstraction Layer)
        - The Sentinel HIL Bridge for simulation testing
        - Supported topologies: quadcopter, rover, linear actuator, eVTOL, rocket
        - Supported hardware: ARM Cortex-M7, RISC-V, FPGA, Rad-Hard processors
        - Supported interfaces: PWM, CAN bus, UART, SPI

        The user has just provided answers to your initial three questions (or is in the process of doing so).
        
        Rules you never break:
        - Never give generic answers. Every response is specific to their robot and their setup.
        - If they haven't answered all three questions yet, politely ask for the missing ones.
        - Once you have the answers, provide:
          STEP 1: Which Sentinel integration path fits them (ROS2 Safety Node, Shadow Driver SDK, or HIL Bridge).
          STEP 2: The exact configuration block they need (topology, mass range, actuator limits, admissible set).
          STEP 3: The exact code or command to get started. Real code. Copy-paste ready. No placeholders.
          STEP 4: Tell them what to expect (what Sentinel intercepts, robot behavior, first ledger entry).
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

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Integration Engineer Error:", error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "CRITICAL: Connection to Sentinel Logic Core lost. Verify API_KEY and network status.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black border border-zinc-800 font-mono text-[11px] overflow-hidden shadow-2xl">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <Terminal size={12} className="text-[#00ff41]" />
          <span className="text-zinc-400 uppercase tracking-widest text-[9px] font-bold">Sentinel_Integration_Terminal_v5.0</span>
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
                ? 'bg-zinc-900 border border-zinc-800 text-zinc-300' 
                : 'bg-black border-l-2 border-[#00ff41] text-[#00ff41]/90'
            }`}>
              <div className="flex items-center gap-2 mb-1 opacity-40 text-[8px] uppercase tracking-tighter">
                {msg.role === 'assistant' ? <Cpu size={8} /> : <Zap size={8} />}
                {msg.role === 'assistant' ? 'Sentinel_Engineer' : 'Operator_Input'}
                <span className="ml-auto">{new Date(msg.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="whitespace-pre-wrap leading-relaxed text-zinc-300 space-y-2">
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
        <ShieldAlert size={10} className="text-rose-500" />
        <span className="text-[8px] text-rose-500/80 uppercase tracking-widest font-bold">
          Safety_Protocol: Never actuate hardware without a verified Lyapunov proof.
        </span>
      </div>
    </div>
  );
};

export default IntegrationTerminal;
