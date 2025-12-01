import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  NodeTypes,
  getNodesBounds,
  getViewportForBounds,
} from 'reactflow';
import { toPng } from 'html-to-image';
import 'reactflow/dist/style.css';

import MindMapNode from './MindMapNode';
import { getLayoutedElements } from './layout';
import styles from './styles.module.css';

interface MindMapViewerProps {
  chapterId: string;
  chapterTitle: string;
  chapterContent: string;
  onNavigateToSection?: (anchor: string) => void;
}

interface MindMapNodeData {
  id: string;
  label: string;
  description: string;
  level: number;
  parent_id: string | null;
  content_anchor?: string;
}

interface MindMapEdgeData {
  id: string;
  source: string;
  target: string;
  type?: string;
}

interface MindMapData {
  chapter_id: string;
  title: string;
  central_topic: MindMapNodeData;
  nodes: MindMapNodeData[];
  edges: MindMapEdgeData[];
  node_count: number;
  max_depth: number;
  generated_at: string;
}

interface MindMapResponse {
  success: boolean;
  mindmap?: MindMapData;
  cached: boolean;
  error?: string;
}

interface SelectedNodeInfo {
  id: string;
  label: string;
  description: string;
}

const API_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8000'
  : 'https://mqasim077-physical-ai-textbook-api.hf.space';

// Define custom node types outside component to prevent re-creation
const nodeTypes: NodeTypes = {
  mindmapNode: MindMapNode,
};

function convertToReactFlowNodes(
  mindmap: MindMapData,
  collapsedNodes: Set<string>,
  onToggleCollapse: (nodeId: string) => void,
  onNodeClick: (nodeId: string, label: string, description: string) => void
): { nodes: Node[]; edges: Edge[] } {
  // Collect all nodes including central topic
  const allNodes: MindMapNodeData[] = [mindmap.central_topic, ...mindmap.nodes];

  // Build parent-child map
  const childrenMap: Record<string, string[]> = {};
  allNodes.forEach(node => {
    if (node.parent_id) {
      if (!childrenMap[node.parent_id]) {
        childrenMap[node.parent_id] = [];
      }
      childrenMap[node.parent_id].push(node.id);
    }
  });

  // Find hidden nodes (children of collapsed nodes)
  const hiddenNodes = new Set<string>();
  const hideChildren = (parentId: string) => {
    const children = childrenMap[parentId] || [];
    children.forEach(childId => {
      hiddenNodes.add(childId);
      hideChildren(childId);
    });
  };
  collapsedNodes.forEach(nodeId => hideChildren(nodeId));

  // Filter out hidden nodes
  const visibleNodes = allNodes.filter(n => !hiddenNodes.has(n.id));

  // Convert to React Flow format
  const nodes: Node[] = visibleNodes.map((node) => ({
    id: node.id,
    type: 'mindmapNode',
    data: {
      label: node.label,
      description: node.description,
      level: node.level,
      hasChildren: (childrenMap[node.id] || []).length > 0,
      contentAnchor: node.content_anchor,
      collapsed: collapsedNodes.has(node.id),
      onToggleCollapse,
      onNodeClick,
    },
    position: { x: 0, y: 0 },
  }));

  // Filter edges to only include visible nodes
  const visibleNodeIds = new Set(visibleNodes.map(n => n.id));
  const edges: Edge[] = mindmap.edges
    .filter(edge => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target))
    .map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: 'default',
      animated: false,
      style: { stroke: '#9ca3af', strokeWidth: 2 },
    }));

  return getLayoutedElements(nodes, edges, 'TB');
}

export default function MindMapViewer({
  chapterId,
  chapterTitle,
  chapterContent,
  onNavigateToSection,
}: MindMapViewerProps): JSX.Element {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [mindmapInfo, setMindmapInfo] = useState<{ nodeCount: number; generatedAt: string } | null>(null);
  const [mindmapData, setMindmapData] = useState<MindMapData | null>(null);
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<SelectedNodeInfo | null>(null);

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Toggle collapse for a single node
  const handleToggleCollapse = useCallback((nodeId: string) => {
    setCollapsedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);

  // Handle node click - show details panel
  const handleNodeClick = useCallback((nodeId: string, label: string, description: string) => {
    setSelectedNode({ id: nodeId, label, description });
  }, []);

  // Expand all nodes
  const handleExpandAll = useCallback(() => {
    setCollapsedNodes(new Set());
  }, []);

  // Collapse all level 1 nodes
  const handleCollapseAll = useCallback(() => {
    if (mindmapData) {
      const level1Ids = mindmapData.nodes
        .filter(n => n.level === 1)
        .map(n => n.id);
      setCollapsedNodes(new Set(level1Ids));
    }
  }, [mindmapData]);

  // Toggle fullscreen
  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Re-layout when collapsed nodes change
  useEffect(() => {
    if (mindmapData) {
      const { nodes: layoutedNodes, edges: layoutedEdges } = convertToReactFlowNodes(
        mindmapData,
        collapsedNodes,
        handleToggleCollapse,
        handleNodeClick
      );
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    }
  }, [collapsedNodes, mindmapData, setNodes, setEdges, handleToggleCollapse, handleNodeClick]);

  const fetchMindMap = useCallback(async (forceRegenerate: boolean = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/mindmap/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chapter_id: chapterId,
          chapter_content: chapterContent,
          chapter_title: chapterTitle,
          force_regenerate: forceRegenerate,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate mind map: ${response.statusText}`);
      }

      const data: MindMapResponse = await response.json();

      if (data.success && data.mindmap) {
        setMindmapData(data.mindmap);
        const { nodes: layoutedNodes, edges: layoutedEdges } = convertToReactFlowNodes(
          data.mindmap,
          collapsedNodes,
          handleToggleCollapse,
          handleNodeClick
        );
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
        setIsCached(data.cached);
        setMindmapInfo({
          nodeCount: data.mindmap.node_count,
          generatedAt: data.mindmap.generated_at,
        });
        setHasLoaded(true);
      } else {
        setError(data.error || 'Failed to generate mind map');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [chapterId, chapterContent, chapterTitle, setNodes, setEdges, collapsedNodes, handleToggleCollapse, handleNodeClick]);

  // Auto-fetch on mount if not loaded
  useEffect(() => {
    if (!hasLoaded && !isLoading && chapterContent.length > 100) {
      fetchMindMap();
    }
  }, [hasLoaded, isLoading, chapterContent, fetchMindMap]);

  const handleRegenerate = () => {
    setCollapsedNodes(new Set());
    setSelectedNode(null);
    fetchMindMap(true);
  };

  const handleExport = async () => {
    if (!reactFlowWrapper.current || nodes.length === 0) return;

    setIsExporting(true);
    try {
      const nodesBounds = getNodesBounds(nodes);
      const imageWidth = 1920;
      const imageHeight = 1080;

      const viewport = getViewportForBounds(
        nodesBounds,
        imageWidth,
        imageHeight,
        0.5,
        2,
        0.2
      );

      const viewportElement = reactFlowWrapper.current.querySelector('.react-flow__viewport') as HTMLElement;
      if (!viewportElement) {
        throw new Error('Could not find mind map viewport');
      }

      const originalTransform = viewportElement.style.transform;
      viewportElement.style.transform = `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`;

      const dataUrl = await toPng(viewportElement, {
        backgroundColor: '#ffffff',
        quality: 1.0,
        width: imageWidth,
        height: imageHeight,
        style: {
          width: `${imageWidth}px`,
          height: `${imageHeight}px`,
        },
      });

      viewportElement.style.transform = originalTransform;

      const link = document.createElement('a');
      link.download = `mindmap-${chapterId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export mind map:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleNodeDoubleClick = useCallback((event: React.MouseEvent, node: Node) => {
    const anchor = node.data?.contentAnchor;
    if (anchor && onNavigateToSection) {
      onNavigateToSection(anchor);
    }
  }, [onNavigateToSection]);

  const proOptions = useMemo(() => ({ hideAttribution: true }), []);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <span className={styles.loadingText}>Generating Mind Map...</span>
          <span className={styles.loadingSubtext}>Analyzing chapter concepts and relationships</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <svg className={styles.errorIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span className={styles.errorText}>{error}</span>
          <button className={styles.retryButton} onClick={() => fetchMindMap()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!hasLoaded || nodes.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyContainer}>
          <svg className={styles.emptyIcon} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v4" />
            <path d="M12 18v4" />
            <path d="M4.93 4.93l2.83 2.83" />
            <path d="M16.24 16.24l2.83 2.83" />
            <path d="M2 12h4" />
            <path d="M18 12h4" />
            <path d="M4.93 19.07l2.83-2.83" />
            <path d="M16.24 7.76l2.83-2.83" />
          </svg>
          <span className={styles.emptyText}>Generate an interactive mind map of this chapter</span>
          <button className={styles.generateButton} onClick={() => fetchMindMap()}>
            Generate Mind Map
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${isFullscreen ? styles.fullscreen : ''}`} ref={containerRef}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h3 className={styles.title}>Mind Map</h3>
          {isCached && (
            <span className={styles.cachedBadge}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Cached
            </span>
          )}
          {mindmapInfo && (
            <span className={styles.nodeCountBadge}>
              {mindmapInfo.nodeCount} nodes
            </span>
          )}
        </div>
        <div className={styles.headerActions}>
          {/* Expand/Collapse All buttons */}
          <button
            className={styles.toolbarButton}
            onClick={handleExpandAll}
            title="Expand all branches"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          </button>
          <button
            className={styles.toolbarButton}
            onClick={handleCollapseAll}
            title="Collapse all branches"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="4 14 10 14 10 20" />
              <polyline points="20 10 14 10 14 4" />
              <line x1="14" y1="10" x2="21" y2="3" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          </button>
          <div className={styles.divider} />
          <button
            className={styles.toolbarButton}
            onClick={handleToggleFullscreen}
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="4 14 10 14 10 20" />
                <polyline points="20 10 14 10 14 4" />
                <line x1="14" y1="10" x2="21" y2="3" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <polyline points="21 3 14 10" />
                <polyline points="3 21 10 14" />
              </svg>
            )}
          </button>
          <button
            className={styles.exportButton}
            onClick={handleExport}
            disabled={isExporting}
            title="Download as PNG"
          >
            {isExporting ? (
              <div className={styles.smallSpinner} />
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            )}
            PNG
          </button>
          <button
            className={styles.regenerateButton}
            onClick={handleRegenerate}
            title="Regenerate mind map"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 2v6h-6" />
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
              <path d="M3 22v-6h6" />
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.flowContainer} ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeDoubleClick={handleNodeDoubleClick}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            minZoom={0.2}
            maxZoom={2}
            proOptions={proOptions}
            defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e8eaed" />
            <Controls showInteractive={false} />
            <MiniMap
              nodeColor={(node) => node.data?.color || '#1a73e8'}
              maskColor="rgba(0, 0, 0, 0.08)"
              style={{ backgroundColor: '#f8f9fa' }}
            />
          </ReactFlow>
        </div>

        {/* Details Panel - NotebookLM style */}
        {selectedNode && (
          <div className={styles.detailsPanel}>
            <div className={styles.detailsHeader}>
              <h4>{selectedNode.label}</h4>
              <button
                className={styles.closeButton}
                onClick={() => setSelectedNode(null)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className={styles.detailsContent}>
              <p>{selectedNode.description}</p>
            </div>
            <div className={styles.detailsActions}>
              <button
                className={styles.detailsButton}
                onClick={() => {
                  if (onNavigateToSection) {
                    const anchor = selectedNode.label.toLowerCase().replace(/\s+/g, '-');
                    onNavigateToSection(anchor);
                  }
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Go to content
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <span className={styles.footerHint}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          Click nodes to see details • Double-click to navigate • Scroll to zoom
        </span>
        {mindmapInfo && (
          <span className={styles.generatedAt}>
            Generated: {new Date(mindmapInfo.generatedAt).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}
