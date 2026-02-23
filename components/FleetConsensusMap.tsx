import React from 'react';
import { ConsensusState } from '../types';

interface FleetConsensusMapProps {
  state: ConsensusState;
  ownPosition: number[];
}

const FleetConsensusMap: React.FC<FleetConsensusMapProps> = ({ state, ownPosition }) => {
  // Map coordinates to SVG space (assuming -50 to 50 range)
  const mapCoord = (val: number) => (val + 50) * (200 / 100);

  return (
    <div className="border border-[#00ff41]/20 bg-zinc-900/20 p-3 flex flex-col h-full">
      <div className="flex items-center justify-between mb-2 border-b border-zinc-800 pb-1">
        <h2 className="font-black uppercase text-[9px] flex items-center gap-2">
          <div className="w-2 h-2 bg-[#00ff41] animate-pulse"></div>
          L3: Fleet_Consensus_Map
        </h2>
        <div className="flex gap-2">
          <span className="text-[7px] text-emerald-400 uppercase">Trusted: {state.peers.filter(p => p.status === 'TRUSTED').length}</span>
          <span className="text-[7px] text-rose-400 uppercase">Byzantine: {state.peers.filter(p => p.status !== 'TRUSTED').length}</span>
          <span className={`text-[7px] font-bold uppercase ${state.quorumReached ? 'text-emerald-400' : 'text-rose-400'}`}>
            Quorum: {state.ackCount}/{state.requiredQuorum}
          </span>
        </div>
      </div>

      <div className="flex-1 relative bg-black/40 border border-zinc-800 overflow-hidden">
        {/* Grid Lines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="h-full w-px bg-zinc-500 absolute left-1/2"></div>
          <div className="w-full h-px bg-zinc-500 absolute top-1/2"></div>
        </div>

        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Own Robot */}
          <circle 
            cx={mapCoord(ownPosition[0])} 
            cy={mapCoord(ownPosition[1])} 
            r="4" 
            fill="#00ff41" 
            className="animate-pulse"
          />
          <text 
            x={mapCoord(ownPosition[0]) + 6} 
            y={mapCoord(ownPosition[1]) + 3} 
            fill="#00ff41" 
            fontSize="6" 
            className="font-bold uppercase"
          >
            SELF
          </text>

          {/* Peers */}
          {state.peers.map(peer => {
            const color = peer.status === 'TRUSTED' ? '#10b981' : peer.status === 'SUSPICIOUS' ? '#f59e0b' : '#ef4444';
            return (
              <g key={peer.id}>
                {/* Trajectory line */}
                {peer.trajectory.length > 1 && (
                  <line 
                    x1={mapCoord(peer.trajectory[0][0])} 
                    y1={mapCoord(peer.trajectory[0][1])} 
                    x2={mapCoord(peer.trajectory[1][0])} 
                    y2={mapCoord(peer.trajectory[1][1])} 
                    stroke={color} 
                    strokeWidth="0.5" 
                    strokeDasharray="2,2" 
                    opacity="0.5"
                  />
                )}
                
                <circle 
                  cx={mapCoord(peer.position[0])} 
                  cy={mapCoord(peer.position[1])} 
                  r="3" 
                  fill={color} 
                />
                <text 
                  x={mapCoord(peer.position[0]) + 5} 
                  y={mapCoord(peer.position[1]) + 2} 
                  fill={color} 
                  fontSize="5" 
                  className="font-mono uppercase"
                >
                  {peer.id}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Conflict Overlay */}
        {state.conflictDetected && (
          <div className="absolute inset-0 bg-rose-500/10 flex items-center justify-center pointer-events-none">
            <div className="border border-rose-500 bg-black px-2 py-1 text-[8px] text-rose-500 font-bold animate-bounce">
              CONFLICT_DETECTED
            </div>
          </div>
        )}

        {/* Quorum Overlay */}
        {!state.quorumReached && state.commitmentTimeout && (
          <div className="absolute inset-0 bg-rose-500/20 flex items-center justify-center pointer-events-none">
            <div className="border border-rose-500 bg-black px-2 py-1 text-[8px] text-rose-500 font-bold">
              QUORUM_TIMEOUT: HOLD_POSITION
            </div>
          </div>
        )}
      </div>

      <div className="mt-2 space-y-1">
        <div className="flex justify-between text-[8px]">
          <span className="opacity-40 uppercase">Global_Consensus</span>
          <span className={state.byzantineStatus === 'TRUSTED' ? 'text-emerald-400' : 'text-rose-400'}>
            {state.byzantineStatus}
          </span>
        </div>
        {state.resolvedIntent && (
          <div className="text-[7px] text-zinc-500 uppercase truncate">
            Resolved: {state.resolvedIntent.type} {'->'} {state.resolvedIntent.target}
          </div>
        )}
      </div>
    </div>
  );
};

export default FleetConsensusMap;
