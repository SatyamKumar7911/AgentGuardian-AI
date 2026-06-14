import React, { useMemo } from 'react';
import { ReactFlow, Controls, Background } from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { Evidence } from '../types';

export const FraudNetworkGraph: React.FC<{ evidence: Evidence[] }> = ({ evidence }) => {
  const { nodes, edges } = useMemo(() => {
    const nds: Node[] = [
      {
        id: 'root',
        position: { x: 400, y: 50 },
        data: { label: 'Uploaded Document' },
        style: { background: '#0ea5e9', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 'bold' }
      }
    ];
    
    const eds: Edge[] = [];

    evidence.forEach((ev, i) => {
      const id = `ev-${i}`;
      let color = '#334155';
      if (ev.verificationStatus === 'SUSPICIOUS') color = '#ef4444';
      if (ev.verificationStatus === 'VERIFIED') color = '#22c55e';
      
      nds.push({
        id,
        position: { x: 100 + (i * 200), y: 200 + (i % 2 === 0 ? 0 : 100) },
        data: { label: `${ev.evidenceType}\n${ev.value}` },
        style: { background: color, color: '#fff', border: 'none', borderRadius: '6px', padding: '10px', fontSize: '12px' }
      });

      eds.push({
        id: `e-root-${id}`,
        source: 'root',
        target: id,
        animated: true,
        style: { stroke: '#94a3b8' }
      });
    });

    return { nodes: nds, edges: eds };
  }, [evidence]);

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden border border-slate-700 bg-slate-900/50">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background color="#334155" gap={16} />
        <Controls className="bg-slate-800 border-slate-700 fill-white" />
      </ReactFlow>
    </div>
  );
};
