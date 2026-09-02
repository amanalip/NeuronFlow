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
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import styles from './PipelineDiagram.module.css';

export interface PipelineStage {
  id: string;
  label: string;
  description?: string;
  active?: boolean;
  badge?: string;
  role?: 'input' | 'layer' | 'output' | 'operation';
}

export interface PipelineConnection {
  from: string;
  to: string;
  label?: string;
  animated?: boolean;
}

interface PipelineDiagramProps {
  stages: PipelineStage[];
  connections: PipelineConnection[];
  direction?: 'horizontal' | 'vertical';
  height?: number | string;
}

interface NodeData {
  label: string;
  description?: string;
  active?: boolean;
  badge?: string;
  role?: 'input' | 'layer' | 'output' | 'operation';
  direction?: 'horizontal' | 'vertical';
}

const CustomNodeComponent: React.FC<{ data: NodeData; selected?: boolean }> = ({ data, selected }) => {
  const isHorizontal = data.direction !== 'vertical';
  const role = data.role || 'layer';

  const roleClass =
    role === 'input'
      ? styles.inputNode
      : role === 'output'
      ? styles.outputNode
      : role === 'operation'
      ? styles.opNode
      : styles.layerNode;

  return (
    <div
      className={`${styles.customNode} ${roleClass} ${data.active ? styles.activeNode : ''} ${
        selected ? styles.selectedNode : ''
      }`}
    >
      {role !== 'input' && (
        <Handle
          type="target"
          position={isHorizontal ? Position.Left : Position.Top}
          className={styles.nodeHandle}
        />
      )}
      <div className={styles.nodeContent}>
        <div className={styles.nodeHeaderRow}>
          {data.badge && <span className={styles.nodeBadge}>{data.badge}</span>}
          {role !== 'layer' && (
            <span className={styles.roleTag}>{role.toUpperCase()}</span>
          )}
        </div>
        <div className={styles.nodeTitle}>{data.label}</div>
        {data.description && <div className={styles.nodeSubtitle}>{data.description}</div>}
      </div>
      {role !== 'output' && (
        <Handle
          type="source"
          position={isHorizontal ? Position.Right : Position.Bottom}
          className={styles.nodeHandle}
        />
      )}
    </div>
  );
};

export const PipelineDiagram: React.FC<PipelineDiagramProps> = ({
  stages,
  connections,
  direction = 'horizontal',
  height = 320,
}) => {
  const nodeTypes = useMemo(() => ({ custom: CustomNodeComponent }), []);

  const nodes: Node[] = useMemo(() => {
    return stages.map((stage, idx) => {
      const x = direction === 'horizontal' ? idx * 240 + 40 : 160;
      const y = direction === 'horizontal' ? 100 : idx * 120 + 40;

      return {
        id: stage.id,
        type: 'custom',
        position: { x, y },
        data: {
          label: stage.label,
          description: stage.description,
          active: stage.active,
          badge: stage.badge,
          role: stage.role,
          direction,
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
      type: 'smoothstep',
      animated: conn.animated !== false,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: 'var(--accent-color)',
        width: 14,
        height: 14,
      },
      style: {
        stroke: 'var(--accent-color)',
        strokeWidth: 2,
      },
      labelStyle: {
        fill: 'var(--text-secondary)',
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
      },
      labelBgPadding: [6, 4] as [number, number],
      labelBgBorderRadius: 4,
      labelBgStyle: {
        fill: 'var(--bg-primary)',
        stroke: 'var(--border-color)',
        strokeWidth: 1,
      },
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
          fitViewOptions={{ padding: 0.2 }}
          attributionPosition="bottom-right"
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={18}
            size={1.5}
            color="var(--border-color)"
          />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </div>
  );
};
