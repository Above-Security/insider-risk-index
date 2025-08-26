'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Network,
  Eye,
  Users,
  Search,
  Key,
  ShieldAlert,
  AlertTriangle,
  Shield,
  RefreshCw
} from 'lucide-react';

interface NetworkNode {
  id: string;
  type: 'technique' | 'pillar' | 'category';
  label: string;
  category?: string;
  pillar?: string;
  size: number;
  color: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface NetworkLink {
  source: string;
  target: string;
  strength: number;
  type: 'prevention' | 'detection' | 'category' | 'pillar';
}

export function MatrixNetwork() {
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [links, setLinks] = useState<NetworkLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [viewMode, setViewMode] = useState<'pillar' | 'category'>('pillar');
  const svgRef = useRef<SVGSVGElement>(null);

  const pillars = [
    { id: 'visibility', name: 'Visibility', icon: Eye, color: '#7AB7FF' },
    { id: 'prevention-coaching', name: 'Prevention & Coaching', icon: Users, color: '#FF89A1' },
    { id: 'investigation-evidence', name: 'Investigation & Evidence', icon: Search, color: '#FF9C7A' },
    { id: 'identity-saas', name: 'Identity & SaaS', icon: Key, color: '#C8B3FF' },
    { id: 'phishing-resilience', name: 'Phishing Resilience', icon: ShieldAlert, color: '#FF5D78' }
  ];

  const categories = [
    { id: 'Motive', name: 'Motive', color: '#FF89A1' },
    { id: 'Means', name: 'Means', color: '#FF9C7A' },
    { id: 'Preparation', name: 'Preparation', color: '#C8B3FF' },
    { id: 'Infringement', name: 'Infringement', color: '#FFB366' },
    { id: 'Anti-forensics', name: 'Anti-forensics', color: '#B3A1FF' }
  ];

  useEffect(() => {
    const fetchNetworkData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/matrix/techniques');
        const data = await response.json();
        
        if (data.techniques) {
          const { networkNodes, networkLinks } = buildNetworkData(data.techniques);
          setNodes(networkNodes);
          setLinks(networkLinks);
          
          // Initialize positions
          initializePositions(networkNodes);
        }
      } catch (error) {
        console.error('Failed to fetch network data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNetworkData();
  }, [viewMode]);


  const buildNetworkData = (techniques: any[]) => {
    const networkNodes: NetworkNode[] = [];
    const networkLinks: NetworkLink[] = [];

    // Add pillar/category nodes
    if (viewMode === 'pillar') {
      pillars.forEach(pillar => {
        networkNodes.push({
          id: pillar.id,
          type: 'pillar',
          label: pillar.name,
          size: 30,
          color: pillar.color
        });
      });
    } else {
      categories.forEach(category => {
        networkNodes.push({
          id: category.id,
          type: 'category',
          label: category.name,
          size: 30,
          color: category.color
        });
      });
    }

    // Add technique nodes and create links
    techniques.forEach(technique => {
      const techniqueNode: NetworkNode = {
        id: technique.id,
        type: 'technique',
        label: technique.title,
        category: technique.category,
        size: 15,
        color: viewMode === 'pillar' 
          ? getPillarColor(technique) 
          : getCategoryColor(technique.category)
      };
      networkNodes.push(techniqueNode);

      // Create links based on view mode
      if (viewMode === 'pillar') {
        // Link to primary pillar
        const primaryPillar = determinePrimaryPillar(technique);
        if (primaryPillar) {
          networkLinks.push({
            source: technique.id,
            target: primaryPillar,
            strength: 1,
            type: 'pillar'
          });
        }
      } else {
        // Link to category
        networkLinks.push({
          source: technique.id,
          target: technique.category,
          strength: 1,
          type: 'category'
        });
      }
    });

    return { networkNodes, networkLinks };
  };

  const determinePrimaryPillar = (technique: any): string => {
    const pillarCounts: Record<string, number> = {};
    
    technique.preventions?.forEach((prev: any) => {
      if (prev.primaryPillar) {
        pillarCounts[prev.primaryPillar] = (pillarCounts[prev.primaryPillar] || 0) + 1;
      }
    });

    technique.detections?.forEach((det: any) => {
      if (det.primaryPillar) {
        pillarCounts[det.primaryPillar] = (pillarCounts[det.primaryPillar] || 0) + 1;
      }
    });

    return Object.entries(pillarCounts).reduce((a, b) => 
      pillarCounts[a[0]] > pillarCounts[b[0]] ? a : b
    )?.[0] || 'visibility';
  };

  const getPillarColor = (technique: any): string => {
    const primaryPillar = determinePrimaryPillar(technique);
    return pillars.find(p => p.id === primaryPillar)?.color || '#C8B3FF';
  };

  const getCategoryColor = (category: string): string => {
    return categories.find(c => c.id === category)?.color || '#C8B3FF';
  };

  const initializePositions = (networkNodes: NetworkNode[]) => {
    const width = 800;
    const height = 600;
    const centerX = width / 2;
    const centerY = height / 2;

    networkNodes.forEach((node, index) => {
      if (node.type === 'pillar' || node.type === 'category') {
        // Position hub nodes in a circle
        const angle = (index * 2 * Math.PI) / (node.type === 'pillar' ? pillars.length : categories.length);
        const radius = 150;
        node.x = centerX + Math.cos(angle) * radius;
        node.y = centerY + Math.sin(angle) * radius;
        node.fx = node.x; // Fix position
        node.fy = node.y;
      } else {
        // Position technique nodes randomly
        node.x = Math.random() * width;
        node.y = Math.random() * height;
      }
    });
    
    setNodes([...networkNodes]);
  };

  const handleNodeClick = (node: NetworkNode) => {
    setSelectedNode(node === selectedNode ? null : node);
  };

  const resetPositions = () => {
    initializePositions(nodes);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="h-96 bg-slate-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Network className="h-5 w-5 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">View Mode:</span>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={viewMode === 'pillar' ? 'default' : 'outline'}
              onClick={() => setViewMode('pillar')}
            >
              <Shield className="h-4 w-4 mr-1" />
              By Pillar
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'category' ? 'default' : 'outline'}
              onClick={() => setViewMode('category')}
            >
              <AlertTriangle className="h-4 w-4 mr-1" />
              By Category
            </Button>
          </div>
        </div>
        
        <Button size="sm" variant="outline" onClick={resetPositions}>
          <RefreshCw className="h-4 w-4 mr-1" />
          Reset Layout
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Network Visualization */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Network className="h-5 w-5 mr-2" />
                Technique Relationship Network
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <svg
                  ref={svgRef}
                  width="100%"
                  height="600"
                  viewBox="0 0 800 600"
                  className="border rounded"
                >
                  {/* Links */}
                  {links.map((link, index) => {
                    const sourceNode = nodes.find(n => n.id === link.source);
                    const targetNode = nodes.find(n => n.id === link.target);
                    
                    if (!sourceNode || !targetNode) return null;
                    
                    return (
                      <line
                        key={index}
                        x1={sourceNode.x || 0}
                        y1={sourceNode.y || 0}
                        x2={targetNode.x || 0}
                        y2={targetNode.y || 0}
                        stroke="#E5E7EB"
                        strokeWidth="1"
                        opacity="0.6"
                      />
                    );
                  })}
                  
                  {/* Nodes */}
                  {nodes.map(node => {
                    const isSelected = selectedNode?.id === node.id;
                    const isHighlighted = selectedNode && (
                      links.some(link => 
                        (link.source === selectedNode.id && link.target === node.id) ||
                        (link.target === selectedNode.id && link.source === node.id)
                      )
                    );
                    
                    return (
                      <g key={node.id}>
                        <circle
                          cx={node.x || 0}
                          cy={node.y || 0}
                          r={node.size}
                          fill={node.color}
                          stroke={isSelected ? "#1F2937" : "white"}
                          strokeWidth={isSelected ? 3 : 2}
                          opacity={!selectedNode || isSelected || isHighlighted ? 1 : 0.3}
                          className="cursor-pointer transition-all hover:opacity-100"
                          onClick={() => handleNodeClick(node)}
                        />
                        
                        {(node.type === 'pillar' || node.type === 'category' || isSelected) && (
                          <text
                            x={node.x || 0}
                            y={(node.y || 0) + node.size + 15}
                            textAnchor="middle"
                            className="text-xs font-medium fill-gray-700 pointer-events-none"
                          >
                            {node.label.length > 15 ? node.label.substring(0, 15) + '...' : node.label}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Details Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Network Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Techniques:</span>
                <span className="font-semibold">{nodes.filter(n => n.type === 'technique').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Hub Nodes:</span>
                <span className="font-semibold">{nodes.filter(n => n.type !== 'technique').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Connections:</span>
                <span className="font-semibold">{links.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {viewMode === 'pillar' ? (
                pillars.map(pillar => {
                  const PillarIcon = pillar.icon;
                  return (
                    <div key={pillar.id} className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: pillar.color }}
                      ></div>
                      <PillarIcon className="h-4 w-4" style={{ color: pillar.color }} />
                      <span className="text-sm">{pillar.name}</span>
                    </div>
                  );
                })
              ) : (
                categories.map(category => (
                  <div key={category.id} className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-sm">{category.name}</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Selected Node Details */}
          {selectedNode && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Selected Node</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Badge className="mb-2" style={{ backgroundColor: selectedNode.color, color: 'white' }}>
                    {selectedNode.type}
                  </Badge>
                  <h4 className="font-semibold">{selectedNode.label}</h4>
                </div>
                
                {selectedNode.category && (
                  <div>
                    <span className="text-sm text-slate-600">Category:</span>
                    <span className="ml-2 font-medium">{selectedNode.category}</span>
                  </div>
                )}

                <div>
                  <span className="text-sm text-slate-600">Connections:</span>
                  <span className="ml-2 font-medium">
                    {links.filter(link => 
                      link.source === selectedNode.id || link.target === selectedNode.id
                    ).length}
                  </span>
                </div>

                <div className="text-xs text-slate-500 mt-2">
                  Click on another node to explore relationships
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}