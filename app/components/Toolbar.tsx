'use client';

import React from 'react';
import { useEditorStore } from '@/store/editorStore';
import { createElementId } from '@/lib/id';
import type { ShapeElement, ShapeType, TextElement, ToolType } from '@/types';
import {
  MousePointer2,
  Type,
  Image as ImageIcon,
  Shapes,
  Hand,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Trash2,
  Copy,
  Layers,
} from 'lucide-react';

const Toolbar: React.FC = () => {
  const {
    tool,
    setTool,
    zoom,
    setZoom,
    undo,
    redo,
    selectedIds,
    deleteElement,
    duplicateElement,
    bringToFront,
    elements,
    addElement,
  } = useEditorStore();

  const tools: Array<{ id: ToolType; icon: React.ReactNode; label: string }> = [
    { id: 'select', icon: <MousePointer2 className="w-4 h-4" />, label: 'Select' },
    { id: 'text', icon: <Type className="w-4 h-4" />, label: 'Text' },
    { id: 'image', icon: <ImageIcon className="w-4 h-4" />, label: 'Image' },
    { id: 'shape', icon: <Shapes className="w-4 h-4" />, label: 'Shape' },
    { id: 'hand', icon: <Hand className="w-4 h-4" />, label: 'Hand' },
  ];

  const handleZoomIn = () => setZoom(zoom + 10);
  const handleZoomOut = () => setZoom(zoom - 10);
  const handleZoomReset = () => setZoom(100);

  const selectedId = selectedIds[0];

  const handleAddTextClick = () => {
    const textElement: TextElement = {
      id: createElementId('text'),
      type: 'text',
      text: 'New Text',
      position: { x: 100, y: 100 + elements.length * 20 },
      size: { width: 200, height: 50 },
      rotation: 0,
      opacity: 1,
      zIndex: elements.length,
      locked: false,
      visible: true,
      style: {
        fontFamily: 'Arial',
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center',
        lineHeight: 1.2,
        letterSpacing: 0,
      },
    };

    addElement(textElement);
  };

  const handleAddShapeClick = (shapeType: ShapeType) => {
    const shapeElement: ShapeElement = {
      id: createElementId('shape'),
      type: 'shape',
      shapeType,
      position: { x: 100, y: 100 + elements.length * 20 },
      size: { width: 100, height: 100 },
      rotation: 0,
      opacity: 1,
      zIndex: elements.length,
      locked: false,
      visible: true,
      fill: '#3b82f6',
      stroke: 'none',
      strokeWidth: 0,
    };

    addElement(shapeElement);
  };

  return (
    <div className="h-12 bg-neutral-800 border-b border-neutral-700 flex items-center px-3 gap-1">
      {/* Left: File & Edit */}
      <div className="flex items-center gap-1">
        <div className="flex items-center bg-neutral-700 rounded-lg p-0.5">
          <button
            onClick={undo}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-600 rounded-md transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-600 rounded-md transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="w-px h-6 bg-neutral-700 mx-1" />

      {/* Center: Tools */}
      <div className="flex items-center gap-0.5">
        {tools.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTool(t.id);
              if (t.id === 'text') handleAddTextClick();
              if (t.id === 'shape') handleAddShapeClick('rectangle');
            }}
            className={`p-2 rounded-md transition-colors ${
              tool === t.id
                ? 'bg-blue-600 text-white'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-700'
            }`}
            title={t.label}
          >
            {t.icon}
          </button>
        ))}
      </div>

      <div className="w-px h-6 bg-neutral-700 mx-1" />

      {/* Selection Actions */}
      {selectedId && (
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => duplicateElement(selectedId)}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-md transition-colors"
            title="Duplicate"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => deleteElement(selectedId)}
            className="p-2 text-neutral-400 hover:text-red-400 hover:bg-neutral-700 rounded-md transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => bringToFront(selectedId)}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-md transition-colors"
            title="Bring to Front"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>
      )}

      {selectedId && <div className="w-px h-6 bg-neutral-700 mx-1" />}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right: Zoom */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleZoomOut}
          className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-md transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="flex items-center">
          <input
            type="text"
            value={`${Math.round(zoom)}%`}
            readOnly
            className="w-12 bg-transparent text-center text-sm text-neutral-300 focus:outline-none cursor-default"
          />
        </div>
        <button
          onClick={handleZoomIn}
          className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-md transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomReset}
          className="px-2 py-1 text-xs text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-md transition-colors"
        >
          Fit
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
