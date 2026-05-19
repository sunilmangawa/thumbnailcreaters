'use client';

import React, { useState, useRef, useCallback } from 'react';
import EditorCanvas from '@/components/EditorCanvas';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import Toolbar from '@/components/Toolbar';
import ExportModal from '@/components/ExportModal';
import { useEditorStore } from '@/store/editorStore';

export default function EditorPage() {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const { canvas, elements } = useEditorStore();
  const exportRef = useRef<HTMLDivElement>(null);

  const handleExport = useCallback((format: 'png' | 'jpg' | 'webp', quality: number) => {
    const canvasEl = document.createElement('canvas');
    const ctx = canvasEl.getContext('2d');
    if (!ctx) return;

    canvasEl.width = canvas.width;
    canvasEl.height = canvas.height;

    // Background
    ctx.fillStyle = canvas.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw elements sorted by zIndex
    const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);

    const drawElements = async () => {
      for (const el of sortedElements) {
        if (!el.visible) continue;

        ctx.globalAlpha = el.opacity;
        ctx.save();

        // Translate to element center for rotation
        const centerX = el.position.x + el.size.width / 2;
        const centerY = el.position.y + el.size.height / 2;
        ctx.translate(centerX, centerY);
        ctx.rotate((el.rotation * Math.PI) / 180);
        ctx.translate(-centerX, -centerY);

        if (el.type === 'text') {
          const textEl = el as any;
          ctx.font = `${textEl.style.fontWeight} ${textEl.style.fontSize}px ${textEl.style.fontFamily}`;
          ctx.fillStyle = textEl.style.color;
          ctx.textAlign = textEl.style.textAlign;
          ctx.textBaseline = 'top';

          if (textEl.style.backgroundColor) {
            ctx.fillStyle = textEl.style.backgroundColor;
            ctx.fillRect(el.position.x, el.position.y, el.size.width, el.size.height);
            ctx.fillStyle = textEl.style.color;
          }

          const lines = textEl.text.split('\n');
          const lineHeight = textEl.style.fontSize * (textEl.style.lineHeight || 1.2);
          let y = el.position.y + 4;

          lines.forEach((line: string) => {
            ctx.fillText(line, el.position.x, y);
            y += lineHeight;
          });
        } else if (el.type === 'shape') {
          const shapeEl = el as any;
          ctx.fillStyle = shapeEl.fill;

          if (shapeEl.shapeType === 'circle') {
            ctx.beginPath();
            ctx.arc(
              el.position.x + el.size.width / 2,
              el.position.y + el.size.height / 2,
              Math.min(el.size.width, el.size.height) / 2,
              0,
              Math.PI * 2
            );
            ctx.fill();
          } else if (shapeEl.shapeType === 'triangle') {
            ctx.beginPath();
            ctx.moveTo(el.position.x + el.size.width / 2, el.position.y);
            ctx.lineTo(el.position.x, el.position.y + el.size.height);
            ctx.lineTo(el.position.x + el.size.width, el.position.y + el.size.height);
            ctx.closePath();
            ctx.fill();
          } else if (shapeEl.shapeType === 'star') {
            const cx = el.position.x + el.size.width / 2;
            const cy = el.position.y + el.size.height / 2;
            const outerR = Math.min(el.size.width, el.size.height) / 2;
            const innerR = outerR * 0.4;
            ctx.beginPath();
            for (let i = 0; i < 10; i++) {
              const r = i % 2 === 0 ? outerR : innerR;
              const angle = (i * Math.PI) / 5 - Math.PI / 2;
              const x = cx + r * Math.cos(angle);
              const y = cy + r * Math.sin(angle);
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
          } else {
            ctx.fillRect(el.position.x, el.position.y, el.size.width, el.size.height);
          }
        } else if (el.type === 'image') {
          const imgEl = el as any;
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = imgEl.src;
          await new Promise<void>((resolve) => {
            img.onload = () => {
              ctx.drawImage(img, el.position.x, el.position.y, el.size.width, el.size.height);
              resolve();
            };
            img.onerror = () => resolve();
          });
        }

        ctx.restore();
        ctx.globalAlpha = 1;
      }

      // Export
      let mimeType = 'image/png';
      if (format === 'jpg') mimeType = 'image/jpeg';
      if (format === 'webp') mimeType = 'image/webp';

      const dataUrl = canvasEl.toDataURL(mimeType, quality / 100);
      const link = document.createElement('a');
      link.download = `thumbnail-${Date.now()}.${format}`;
      link.href = dataUrl;
      link.click();
    };

    drawElements();
  }, [canvas, elements]);

  return (
    <div className="h-screen w-full bg-neutral-900 flex flex-col" style={{ height: '100vh' }}>
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        <EditorCanvas />
        <RightSidebar onExport={() => setIsExportOpen(true)} />
      </div>
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExport={handleExport}
      />
    </div>
  );
}
