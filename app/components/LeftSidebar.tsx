'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useRef } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { TEMPLATES, CATEGORIES } from '@/lib/templates';
import { Template } from '@/lib/templates';
import { createElementId } from '@/lib/id';
import type { ImageElement, ShapeElement, ShapeType, TextElement, TextStyle } from '@/types';
import {
  LayoutTemplate,
  Type,
  Shapes,
  Upload,
  ChevronDown,
} from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const TABS: Tab[] = [
  { id: 'templates', label: 'Templates', icon: <LayoutTemplate className="w-4 h-4" /> },
  { id: 'elements', label: 'Elements', icon: <Shapes className="w-4 h-4" /> },
  { id: 'uploads', label: 'Uploads', icon: <Upload className="w-4 h-4" /> },
  { id: 'text', label: 'Text', icon: <Type className="w-4 h-4" /> },
];

const SAMPLE_UPLOADS = [
  'https://images.unsplash.com/photo-1579546929518-9eafe2d1c44a?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1441974231538-c916507b2f7b?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1501854140884-074cf2b2b3d0?w=400&h=250&fit=crop',
];

type TextPreset = {
  text: string;
  style: TextStyle;
};

const SHAPE_TYPES: ShapeType[] = ['rectangle', 'circle', 'triangle', 'star'];

const LeftSidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState('templates');
  const [activeCategory, setActiveCategory] = useState('All');
  const { addElement, setElements, setCanvas, elements } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredTemplates = activeCategory === 'All'
    ? TEMPLATES
    : TEMPLATES.filter((t) => t.category === activeCategory);

  const handleTemplateClick = (template: Template) => {
    setCanvas({
      backgroundColor: template.canvas.backgroundColor,
    });

    const newElements = template.elements.map((el) => ({
      ...el,
      id: createElementId('el'),
    }));

    setElements(newElements);
  };

  const handleAddText = (preset: string) => {
    const textElements: Record<string, TextPreset> = {
      heading: {
        text: 'Add Your Headline',
        style: {
          fontFamily: 'Arial',
          fontSize: 48,
          fontWeight: 'bold',
          color: '#000000',
          textAlign: 'center' as const,
          lineHeight: 1.2,
          letterSpacing: 0,
        },
      },
      subheading: {
        text: 'Add subheading text here',
        style: {
          fontFamily: 'Arial',
          fontSize: 24,
          fontWeight: 'normal',
          color: '#666666',
          textAlign: 'center' as const,
          lineHeight: 1.4,
          letterSpacing: 0,
        },
      },
      body: {
        text: 'Body text goes here',
        style: {
          fontFamily: 'Arial',
          fontSize: 16,
          fontWeight: 'normal',
          color: '#333333',
          textAlign: 'left' as const,
          lineHeight: 1.5,
          letterSpacing: 0,
        },
      },
    };

    const presetData = textElements[preset] || textElements.heading;

    const textElement: TextElement = {
      id: createElementId('text'),
      type: 'text',
      text: presetData.text,
      position: { x: 100, y: 100 + elements.length * 60 },
      size: { width: 400, height: 60 },
      rotation: 0,
      opacity: 1,
      zIndex: elements.length,
      locked: false,
      visible: true,
      style: presetData.style,
    };

    addElement(textElement);
  };

  const handleAddImage = (src: string) => {
    const imageElement: ImageElement = {
      id: createElementId('img'),
      type: 'image',
      src,
      position: { x: 100, y: 100 + elements.length * 20 },
      size: { width: 300, height: 200 },
      rotation: 0,
      opacity: 1,
      zIndex: elements.length,
      locked: false,
      visible: true,
      filters: {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        blur: 0,
        hueRotate: 0,
      },
      borderRadius: 0,
      objectFit: 'cover',
    };

    addElement(imageElement);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleAddImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-72 h-full bg-neutral-800 border-r border-neutral-700 flex flex-col flex-shrink-0">
      {/* Tab buttons */}
      <div className="flex border-b border-neutral-700">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 px-1 text-xs font-medium transition-colors flex flex-col items-center gap-1 ${
              activeTab === tab.id
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'templates' && (
          <div className="space-y-4">
            <div className="relative">
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="w-full appearance-none bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-neutral-400 pointer-events-none" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateClick(template)}
                  className="group relative aspect-video bg-neutral-700 rounded-lg overflow-hidden border border-neutral-600 hover:border-blue-400 transition-colors"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: template.canvas.backgroundColor }}
                    >
                      <LayoutTemplate className="w-8 h-8 text-neutral-400" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end">
                    <span className="px-2 py-1 text-xs text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {template.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'elements' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                Shapes
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {SHAPE_TYPES.map((shape) => (
                  <button
                    key={shape}
                    onClick={() => {
                      const shapeElement: ShapeElement = {
                        id: createElementId('shape'),
                        type: 'shape',
                        shapeType: shape,
                        position: { x: 100, y: 100 + elements.length * 20 },
                        size: { width: 100, height: 100 },
                        rotation: 0,
                        opacity: 1,
                        zIndex: elements.length,
                        locked: false,
                        visible: true,
                        fill: shape === 'star' ? '#fbbf24' : '#3b82f6',
                        stroke: 'none',
                        strokeWidth: 0,
                      };

                      addElement(shapeElement);
                    }}
                    className="aspect-square bg-neutral-700 rounded-lg border border-neutral-600 hover:border-blue-400 transition-colors flex items-center justify-center"
                  >
                    <div
                      className="w-6 h-6"
                      style={{
                        backgroundColor: '#3b82f6',
                        borderRadius: shape === 'circle' ? '50%' : shape === 'star' ? '0%' : '2px',
                        clipPath: shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none',
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                Lines
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    const lineElement: ShapeElement = {
                      id: createElementId('shape'),
                      type: 'shape',
                      shapeType: 'rectangle',
                      position: { x: 100, y: 100 + elements.length * 20 },
                      size: { width: 200, height: 4 },
                      rotation: 0,
                      opacity: 1,
                      zIndex: elements.length,
                      locked: false,
                      visible: true,
                      fill: '#000000',
                      stroke: 'none',
                      strokeWidth: 0,
                    };

                    addElement(lineElement);
                  }}
                  className="h-10 bg-neutral-700 rounded-lg border border-neutral-600 hover:border-blue-400 transition-colors flex items-center justify-center"
                >
                  <div className="w-12 h-0.5 bg-neutral-400" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'uploads' && (
          <div className="space-y-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload Image
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            <div className="grid grid-cols-2 gap-2">
              {SAMPLE_UPLOADS.map((url, i) => (
                <button
                  key={i}
                  onClick={() => handleAddImage(url)}
                  className="aspect-video bg-neutral-700 rounded-lg overflow-hidden border border-neutral-600 hover:border-blue-400 transition-colors"
                >
                  <img
                    src={url}
                    alt="Sample"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'text' && (
          <div className="space-y-3">
            {[
              { preset: 'heading', label: 'Add Heading', size: 'text-2xl' },
              { preset: 'subheading', label: 'Add Subheading', size: 'text-xl' },
              { preset: 'body', label: 'Add Body Text', size: 'text-base' },
            ].map((item) => (
              <button
                key={item.preset}
                onClick={() => handleAddText(item.preset)}
                className="w-full py-3 px-4 bg-neutral-700 hover:bg-neutral-600 border border-neutral-600 hover:border-blue-400 rounded-lg text-left transition-colors"
              >
                <span className={`block ${item.size} text-white font-medium`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;
