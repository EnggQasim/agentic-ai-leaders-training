import React, { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import styles from './styles.module.css';

interface MindMapNodeData {
  label: string;
  description: string;
  level: number;
  hasChildren?: boolean;
  contentAnchor?: string;
}

function MindMapNode({ data }: NodeProps<MindMapNodeData>) {
  const [showTooltip, setShowTooltip] = useState(false);

  const nodeClass =
    data.level === 0 ? styles.centralNode :
    data.level === 1 ? styles.primaryNode :
    styles.secondaryNode;

  return (
    <div
      className={`${styles.mindMapNode} ${nodeClass}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <Handle type="target" position={Position.Top} className={styles.handle} />

      <div className={styles.nodeContent}>
        <span className={styles.nodeLabel}>{data.label}</span>
        {data.hasChildren && (
          <span className={styles.expandIndicator}>+</span>
        )}
      </div>

      {showTooltip && data.description && (
        <div className={styles.tooltip}>
          {data.description}
          {data.contentAnchor && (
            <span className={styles.tooltipHint}>Double-click to navigate</span>
          )}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className={styles.handle} />
    </div>
  );
}

export default memo(MindMapNode);
