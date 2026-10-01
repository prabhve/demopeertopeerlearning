/**
 * College Knowledge Map & Connection Graph (Signature Feature 18 & 44)
 * Interactive Canvas & SVG Visualization showing who teaches whom across campus departments.
 * Displays student nodes, animated flow edges, learning relationships, and inspection drawers.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  MOCK_KNOWLEDGE_NODES,
  MOCK_KNOWLEDGE_EDGES,
} from '../data/mockData';
import { KnowledgeNode, KnowledgeEdge } from '../types';
import {
  Share2,
  Filter,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Users,
  BookOpen,
  Award,
  Clock,
  ArrowRight,
  ShieldCheck,
  X,
} from 'lucide-react';

export const KnowledgeNetworkView: React.FC = () => {
  const { currentCollege, setActiveView } = useApp();

  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<KnowledgeEdge | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Filter nodes
  const filteredNodes = MOCK_KNOWLEDGE_NODES.filter(node => {
    const matchesDept = selectedDept === 'All' || node.department.includes(selectedDept);
    const matchesRole = selectedRole === 'All' || node.role === selectedRole;
    return matchesDept && matchesRole;
  });

  const activeNodeIds = new Set(filteredNodes.map(n => n.id));

  // Filter edges where both source & target nodes are present
  const filteredEdges = MOCK_KNOWLEDGE_EDGES.filter(
    e => activeNodeIds.has(e.source) && activeNodeIds.has(e.target)
  );

  const getNodeColor = (role: KnowledgeNode['role']) => {
    switch (role) {
      case 'Top Contributor':
        return '#0284c7'; // Sky-600
      case 'Creator':
        return '#6366f1'; // Indigo-500
      case 'Mentor':
        return '#f59e0b'; // Amber-500
      case 'Learner':
        return '#10b981'; // Emerald-500
      default:
        return '#64748b';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header & Controls */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">
              {currentCollege.name}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
              Living Campus Web
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <Share2 className="w-6 h-6 text-sky-600" />
            College Knowledge Map
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Trace peer learning relationships. Click any student node or connecting learning flow line to inspect details.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Department filter */}
          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none"
          >
            <option value="All">All Departments</option>
            <option value="Computer">CSE</option>
            <option value="Electronics">ECE</option>
            <option value="Electrical">EE</option>
            <option value="Mechanical">ME</option>
            <option value="Civil">Civil</option>
          </select>

          {/* Role filter */}
          <select
            value={selectedRole}
            onChange={e => setSelectedRole(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none"
          >
            <option value="All">All Roles</option>
            <option value="Top Contributor">Top Contributors</option>
            <option value="Creator">Creators</option>
            <option value="Mentor">Mentors</option>
            <option value="Learner">Learners</option>
          </select>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.6))}
              className="p-1 rounded-lg hover:bg-white text-slate-600 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.7))}
              className="p-1 rounded-lg hover:bg-white text-slate-600 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 rounded-lg hover:bg-white text-slate-600 transition-colors"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Graph Canvas */}
      <div className="relative rounded-3xl bg-slate-950 border border-slate-800 h-[580px] overflow-hidden shadow-2xl flex items-center justify-center">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, #38bdf8 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />

        {/* Legend */}
        <div className="absolute top-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800 text-[11px] text-slate-300 space-y-1.5 shadow-lg">
          <div className="font-bold text-white text-xs mb-1">Network Legend</div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sky-500" />
            <span>Top Contributor (Priya S.)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-indigo-500" />
            <span>Creator (Aditya V.)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span>Mentor (Rahul G.)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Active Learner</span>
          </div>
        </div>

        {/* Scaled Interactive Graph Container */}
        <div
          className="relative w-[960px] h-[540px] transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-auto">
            <defs>
              <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {filteredEdges.map(edge => {
              const srcNode = filteredNodes.find(n => n.id === edge.source);
              const tgtNode = filteredNodes.find(n => n.id === edge.target);
              if (!srcNode || !tgtNode) return null;

              const isSelected = selectedEdge?.id === edge.id;

              return (
                <g key={edge.id} className="cursor-pointer" onClick={() => setSelectedEdge(edge)}>
                  {/* Outer clickable line hit area */}
                  <line
                    x1={srcNode.x}
                    y1={srcNode.y}
                    x2={tgtNode.x}
                    y2={tgtNode.y}
                    stroke="transparent"
                    strokeWidth={14}
                  />
                  {/* Visible animated line */}
                  <line
                    x1={srcNode.x}
                    y1={srcNode.y}
                    x2={tgtNode.x}
                    y2={tgtNode.y}
                    stroke={isSelected ? '#38bdf8' : 'rgba(56, 189, 248, 0.45)'}
                    strokeWidth={isSelected ? 3.5 : 2}
                    strokeDasharray={isSelected ? 'none' : '4 4'}
                    className="hover:stroke-sky-300 transition-colors"
                  />
                  {/* Floating topic label on edge */}
                  <rect
                    x={(srcNode.x! + tgtNode.x!) / 2 - 40}
                    y={(srcNode.y! + tgtNode.y!) / 2 - 10}
                    width={80}
                    height={20}
                    rx={6}
                    fill="#0f172a"
                    stroke="#1e293b"
                  />
                  <text
                    x={(srcNode.x! + tgtNode.x!) / 2}
                    y={(srcNode.y! + tgtNode.y!) / 2 + 3}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="9px"
                    fontFamily="monospace"
                  >
                    {edge.subject.substring(0, 10)}..
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Student Nodes */}
          {filteredNodes.map(node => {
            const isSelected = selectedNode?.id === node.id;
            const nodeColor = getNodeColor(node.role);

            return (
              <div
                key={node.id}
                onClick={() => {
                  setSelectedNode(node);
                  setSelectedEdge(null);
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10 transition-transform duration-200"
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  transform: isSelected ? 'translate(-50%, -50%) scale(1.15)' : 'translate(-50%, -50%)',
                }}
              >
                {/* Glowing Outer Ring for Top Contributors */}
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center p-1 transition-all duration-300 shadow-xl"
                  style={{
                    backgroundColor: `${nodeColor}25`,
                    border: `2px solid ${nodeColor}`,
                    boxShadow: isSelected ? `0 0 25px ${nodeColor}` : 'none',
                  }}
                >
                  <img
                    src={node.avatar}
                    alt={node.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-900"
                  />
                </div>

                {/* Name Label */}
                <div className="absolute top-15 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 backdrop-blur-md px-2 py-0.5 rounded-md border border-slate-800 text-[10px] text-white text-center shadow-md">
                  <div className="font-bold">{node.name}</div>
                  <div className="text-[9px] text-slate-400 font-mono">
                    {node.role} · {node.department.split(' ')[0]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Node Inspection Drawer Modal */}
      {selectedNode && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4 animate-in slide-in-from-bottom-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <img
                src={selectedNode.avatar}
                alt={selectedNode.name}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 text-base">{selectedNode.name}</h3>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: getNodeColor(selectedNode.role) }}
                  >
                    {selectedNode.role}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {selectedNode.department} · {currentCollege.name}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedNode(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 text-[10px] block">Top Subject</span>
              <strong className="text-slate-800 text-xs">{selectedNode.topSubject}</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 text-[10px] block">Videos Uploaded</span>
              <strong className="text-slate-800 text-xs">{selectedNode.uploadedCount} Modules</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 text-[10px] block">Peer Learners</span>
              <strong className="text-emerald-700 text-xs">{selectedNode.learnersCount} Students</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 text-[10px] block">Contribution Score</span>
              <strong className="text-sky-700 text-xs">{selectedNode.contributionScore} / 100</strong>
            </div>
          </div>
        </div>
      )}

      {/* Edge Connection Inspection Modal */}
      {selectedEdge && (
        <div className="bg-sky-50/80 border border-sky-200/80 rounded-3xl p-5 space-y-2 animate-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-sky-950 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-600" /> Peer Learning Connection Verified
            </h4>
            <button
              onClick={() => setSelectedEdge(null)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            <strong>{MOCK_KNOWLEDGE_NODES.find(n => n.id === selectedEdge.source)?.name}</strong> taught{' '}
            <strong>{MOCK_KNOWLEDGE_NODES.find(n => n.id === selectedEdge.target)?.name}</strong> in{' '}
            <span className="font-semibold text-sky-800">{selectedEdge.subject}</span> ({selectedEdge.videoTitle}).
          </p>
          <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
            <span>Date: {selectedEdge.watchDate}</span>
            <span>·</span>
            <span>Duration: {selectedEdge.watchDurationMinutes} learning minutes verified</span>
            <span>·</span>
            <span className="text-emerald-700 font-semibold">70% Progression Verified</span>
          </div>
        </div>
      )}
    </div>
  );
};
