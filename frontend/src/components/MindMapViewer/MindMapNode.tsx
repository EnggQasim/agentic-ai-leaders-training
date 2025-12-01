import React, { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import styles from './styles.module.css';

interface MindMapNodeData {
  label: string;
  description: string;
  level: number;
  hasChildren?: boolean;
  contentAnchor?: string;
  color?: string;
  collapsed?: boolean;
  onToggleCollapse?: (nodeId: string) => void;
  onNodeClick?: (nodeId: string, label: string, description: string) => void;
}

function MindMapNode({ id, data }: NodeProps<MindMapNodeData>) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.onToggleCollapse) {
      data.onToggleCollapse(id);
    }
  };

  const handleNodeClick = () => {
    if (data.onNodeClick) {
      data.onNodeClick(id, data.label, data.description);
    }
  };

  // NotebookLM style: colored backgrounds based on branch
  const getNodeStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      padding: data.level === 0 ? '16px 20px' : '10px 14px',
      borderRadius: data.level === 0 ? '16px' : '12px',
      minWidth: data.level === 0 ? '140px' : '100px',
      maxWidth: data.level === 0 ? '180px' : '160px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
      border: 'none',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    };

    if (data.level === 0) {
      // Central node - larger, rounded rectangle, primary color
      return {
        ...baseStyle,
        background: 'linear-gradient(135deg, #1a73e8 0%, #1557b0 100%)',
        color: 'white',
        fontWeight: 600,
        fontSize: '14px',
        minHeight: '60px',
      };
    } else if (data.level === 1) {
      // Level 1 - colored pill shapes
      const color = data.color || '#4285f4';
      return {
        ...baseStyle,
        background: color,
        color: 'white',
        fontWeight: 500,
        fontSize: '13px',
      };
    } else {
      // Level 2+ - white/light background with colored left border
      const color = data.color || '#4285f4';
      return {
        ...baseStyle,
        background: '#ffffff',
        color: '#3c4043',
        fontWeight: 400,
        fontSize: '12px',
        borderLeft: `4px solid ${color}`,
        borderRadius: '8px',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
      };
    }
  };

  return (
    <div
      style={getNodeStyle()}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={handleNodeClick}
    >
      {/* Handles for connections - invisible */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: 'transparent',
          border: 'none',
          width: 1,
          height: 1,
        }}
      />

      <div className={styles.nodeContent}>
        <span className={styles.nodeLabel}>{data.label}</span>
      </div>

      {/* Expand/Collapse arrow for nodes with children */}
      {data.hasChildren && (
        <button
          onClick={handleExpandClick}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
            marginLeft: '4px',
            transition: 'transform 0.2s',
            transform: data.collapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
          }}
          title={data.collapsed ? 'Expand' : 'Collapse'}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      )}

      {/* Tooltip on hover */}
      {showTooltip && data.description && (
        <div className={styles.tooltip}>
          {data.description}
          <span className={styles.tooltipHint}>Click to explore this topic</span>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: 'transparent',
          border: 'none',
          width: 1,
          height: 1,
        }}
      />
    </div>
  );
}

export default memo(MindMapNode);
