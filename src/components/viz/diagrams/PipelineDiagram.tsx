import React, { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  Position,
  Handle,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import styles from './PipelineDiagram.module.css';

export interface PipelineStage {
  id: string;
  label: string;
  description?: string;
  active?: boolean;
}

export interface PipelineConnection {
  from: string;
  to: string;
  label?: string;
}

interface PipelineDiagramProps {
  stages: PipelineStage[];
  connections: PipelineConnection[];
  direction?: 'horizontal' | 'vertical';
  height?: number | string;
}

const CustomNodeComponent = ({ data }: { data: { label: string; description?: string; active?: boolean } }) => {
  return (
    <div className={`${styles.customNode} ${data.active ? styles.activeNode : ''}`}>
      <Handle type="target" position={Position.Left} style={{ background: 'var(--accent-color)' }} />
      <div className={styles.nodeTitle}>{data.label}</div>
      {data.description && <div className={styles.nodeSubtitle}>{data.description}</div>}
      <Handle type="source" position={Position.Right} style={{ background: 'var(--accent-color)' }} />
    </div>
  );
};

export const PipelineDiagram: React.FC<PipelineDiagramProps> = ({
  stages,
  connections,
  direction = 'horizontal',
  height = 300,
}) => {
  const nodeTypes = useMemo(() => ({ custom: CustomNodeComponent }), []);

  const nodes: Node[] = useMemo(() => {
    return stages.map((stage, idx) => {
      const x = direction === 'horizontal' ? idx * 220 + 40 : 150;
      const y = direction === 'horizontal' ? 100 : idx * 100 + 40;

      return {
        id: stage.id,
        type: 'custom',
        position: { x, y },
        data: {
          label: stage.label,
          description: stage.description,
          active: stage.active,
        },
      };
    });
  }, [stages, direction]);

  const edges: Edge[] = useMemo(() => {
    return connections.map((conn, idx) => ({
      id: `e-${conn.from}-${conn.to}-${idx}`,
      source: conn.from,
      target: conn.to,
      label: conn.label,
      animated: true,
      style: { stroke: 'var(--accent-color)', strokeWidth: 2 },
      labelStyle: { fill: 'var(--text-secondary)', fontSize: 11 },
    }));
  }, [connections]);

  return (
    <div className={styles.container} style={{ height }}>
      <div className={styles.flowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-right"
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="var(--border-color)" />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </div>
  );
};
