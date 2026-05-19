'use client';

import React, { useState } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { EditorElement, TextElement, ImageElement, ShapeElement } from '@/types';
import { PRESET_COLORS, POPULAR_FONTS } from '@/lib/templates';
import {
  Type,
  Palette,
  Layers,
  Sliders,
  Move,
  RotateCw,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Lock,
  Unlock,
  ChevronDown,
  Eye,
  EyeOff,
} from 'lucide-react';

interface RightSidebarProps {
  onExport: () => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ onExport }) => {
  const {
    elements,
    selectedIds,
    canvas,
    setCanvas,
    updateElement,
    deleteElement,
    duplicateElement,
    bringToFront,
    sendToBack,
    setElementOpacity,
  } = useEditorStore();

  const [activeSection, setActiveSection] = useState<string>('properties');

  const selectedId = selectedIds[0];
  const selectedElement = selectedId ? elements.find((el) => el.id === selectedId) : null;

  const handleColorChange = (color: string) => {
    if (!selectedElement) return;

    if (selectedElement.type === 'text') {
      updateElement(selectedId, {
        style: {
          ...((selectedElement as TextElement).style),
          color,
        },
      });
    } else if (selectedElement.type === 'shape') {
      updateElement(selectedId, {
        fill: color,
      });
    }
  };

  const handleFontChange = (fontFamily: string) => {
    if (!selectedElement || selectedElement.type !== 'text') return;
    updateElement(selectedId, {
      style: {
        ...((selectedElement as TextElement).style),
        fontFamily,
      },
    });
  };

  const handleFontSizeChange = (fontSize: number) => {
    if (!selectedElement || selectedElement.type !== 'text') return;
    updateElement(selectedId, {
      style: {
        ...((selectedElement as TextElement).style),
        fontSize,
      },
    });
  };

  const handleOpacityChange = (opacity: number) => {
    if (!selectedElement) return;
    setElementOpacity(selectedId, opacity);
  };

  const renderSection = () => {
    if (activeSection === 'layers') {
      return (
        <div className="space-y-2">
          {[...elements]
            .sort((a, b) => b.zIndex - a.zIndex)
            .map((el) => (
              <button
                key={el.id}
                onClick={() => {
                  const { selectElement } = useEditorStore.getState();
                  selectElement(el.id);
                }}
                className={`w-full text-left px-3 py-2 rounded text-sm flex items-center justify-between ${
                  selectedIds.includes(el.id)
                    ? 'bg-blue-600/30 border border-blue-500/50'
                    : 'bg-neutral-700/50 hover:bg-neutral-700'
                } text-neutral-300`}
              >
                <span className="flex items-center gap-2">
                  {el.type === 'text' && <Type className="w-3 h-3" />}
                  {el.type === 'image' && <Palette className="w-3 h-3" />}
                  {el.type === 'shape' && <Sliders className="w-3 h-3" />}
                  <span className="truncate max-w-[140px]">
                    {el.type === 'text' ? (el as TextElement).text?.substring(0, 20) || 'Text' : el.type}
                  </span>
                </span>
                <span className="text-xs text-neutral-500">{Math.round(el.zIndex)}</span>
              </button>
            ))}
        </div>
      );
    }

    if (activeSection === 'properties') {
      if (!selectedElement) {
        return (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Canvas Size
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-neutral-500 mb-1 block">Width</label>
                  <input
                    type="number"
                    value={canvas.width}
                    onChange={(e) => setCanvas({ width: parseInt(e.target.value) || 1280 })}
                    className="w-full bg-neutral-700 border border-neutral-600 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-500 mb-1 block">Height</label>
                  <input
                    type="number"
                    value={canvas.height}
                    onChange={(e) => setCanvas({ height: parseInt(e.target.value) || 720 })}
                    className="w-full bg-neutral-700 border border-neutral-600 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Background
              </h4>
              <div className="flex gap-2 flex-wrap">
                <input
                  type="color"
                  value={canvas.backgroundColor}
                  onChange={(e) => setCanvas({ backgroundColor: e.target.value })}
                  className="w-10 h-8 rounded border border-neutral-600 cursor-pointer"
                />
                <input
                  type="text"
                  value={canvas.backgroundColor}
                  onChange={(e) => setCanvas({ backgroundColor: e.target.value })}
                  className="flex-1 bg-neutral-700 border border-neutral-600 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );
      }

      const el = selectedElement;

      return (
        <div className="space-y-4">
          {/* Position and Size */}
          <div>
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Position & Size
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-neutral-500 mb-1 block">X</label>
                <input
                  type="number"
                  value={Math.round(el.position.x)}
                  onChange={(e) =>
                    updateElement(el.id, { position: { ...el.position, x: Number(e.target.value) } })
                  }
                  className="w-full bg-neutral-700 border border-neutral-600 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-500 mb-1 block">Y</label>
                <input
                  type="number"
                  value={Math.round(el.position.y)}
                  onChange={(e) =>
                    updateElement(el.id, { position: { ...el.position, y: Number(e.target.value) } })
                  }
                  className="w-full bg-neutral-700 border border-neutral-600 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-500 mb-1 block">W</label>
                <input
                  type="number"
                  value={Math.round(el.size.width)}
                  onChange={(e) => updateElement(el.id, { size: { ...el.size, width: Number(e.target.value) } })}
                  className="w-full bg-neutral-700 border border-neutral-600 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-500 mb-1 block">H</label>
                <input
                  type="number"
                  value={Math.round(el.size.height)}
                  onChange={(e) => updateElement(el.id, { size: { ...el.size, height: Number(e.target.value) } })}
                  className="w-full bg-neutral-700 border border-neutral-600 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Rotation */}
          <div>
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Rotation
            </h4>
            <input
              type="range"
              min="0"
              max="360"
              value={el.rotation}
              onChange={(e) => updateElement(el.id, { rotation: Number(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-neutral-500 mt-1">
              <span>0°</span>
              <span>{Math.round(el.rotation)}°</span>
              <span>360°</span>
            </div>
          </div>

          {/* Opacity */}
          <div>
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Opacity
            </h4>
            <input
              type="range"
              min="0"
              max="100"
              value={el.opacity * 100}
              onChange={(e) => handleOpacityChange(Number(e.target.value) / 100)}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-neutral-500 mt-1">
              <span>0%</span>
              <span>{Math.round(el.opacity * 100)}%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Text-specific properties */}
          {el.type === 'text' && (
            <>
              <div>
                <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Font
                </h4>
                <select
                  value={(el as TextElement).style.fontFamily}
                  onChange={(e) => handleFontChange(e.target.value)}
                  className="w-full bg-neutral-700 border border-neutral-600 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {POPULAR_FONTS.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-neutral-500 mb-1 block">Font Size</label>
                <input
                  type="number"
                  value={(el as TextElement).style.fontSize}
                  onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                  className="w-full bg-neutral-700 border border-neutral-600 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {/* Color */}
          {(el.type === 'text' || el.type === 'shape') && (
            <div>
              <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Color
              </h4>
              <div className="grid grid-cols-5 gap-1.5">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className="w-7 h-7 rounded border border-neutral-600 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div>
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Actions
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => duplicateElement(el.id)}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-neutral-700 hover:bg-neutral-600 border border-neutral-600 rounded text-sm text-neutral-200 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                Duplicate
              </button>
              <button
                onClick={() => deleteElement(el.id)}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-red-900/30 hover:bg-red-900/50 border border-red-800/50 rounded text-sm text-red-300 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
              <button
                onClick={() => bringToFront(el.id)}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-neutral-700 hover:bg-neutral-600 border border-neutral-600 rounded text-sm text-neutral-200 transition-colors"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                Bring Forward
              </button>
              <button
                onClick={() => sendToBack(el.id)}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-neutral-700 hover:bg-neutral-600 border border-neutral-600 rounded text-sm text-neutral-200 transition-colors"
              >
                <ArrowDown className="w-3.5 h-3.5" />
                Send Backward
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-72 h-full bg-neutral-800 border-l border-neutral-700 flex flex-col flex-shrink-0">
      {/* Section tabs */}
      <div className="flex border-b border-neutral-700">
        {[
          { id: 'properties', label: 'Properties', icon: <Sliders className="w-3.5 h-3.5" /> },
          { id: 'layers', label: 'Layers', icon: <Layers className="w-3.5 h-3.5" /> },
        ].map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex-1 py-3 px-1 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
              activeSection === section.id
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {section.icon}
            <span>{section.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {renderSection()}
      </div>

      {/* Export button */}
      <div className="p-4 border-t border-neutral-700">
        <button
          onClick={onExport}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
        >
          Export Image
        </button>
      </div>
    </div>
  );
};

export default RightSidebar;
