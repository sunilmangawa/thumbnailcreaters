'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { EditorElement, TextElement, ImageElement, ShapeElement } from '@/types';

interface DragState {
  isDragging: boolean;
  elementId: string | null;
  startX: number;
  startY: number;
  initialX: number;
  initialY: number;
}

const CanvasElement: React.FC<{
  element: EditorElement;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onDragStart: (e: React.MouseEvent) => void;
  onResize: (width: number, height: number) => void;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}> = ({ element, isSelected, onSelect, onDragStart, canvasRef }) => {
  const [isEditing, setIsEditing] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const { updateElement } = useEditorStore();

  const renderShape = (el: ShapeElement) => {
    const commonStyle: React.CSSProperties = {
      position: 'absolute',
      left: el.position.x,
      top: el.position.y,
      width: el.size.width,
      height: el.size.height,
      transform: `rotate(${el.rotation}deg)`,
      opacity: el.opacity,
      zIndex: el.zIndex,
      cursor: 'move',
      border: isSelected ? '2px solid #3b82f6' : 'none',
    };

    if (el.shapeType === 'circle') {
      return (
        <div
          style={{
            ...commonStyle,
            borderRadius: '50%',
            backgroundColor: el.fill,
            border: isSelected ? '2px solid #3b82f6' : el.strokeWidth > 0 ? `${el.strokeWidth}px solid ${el.stroke}` : 'none',
          }}
        />
      );
    }

    if (el.shapeType === 'triangle') {
      return (
        <div style={commonStyle}>
          <svg
            width={el.size.width}
            height={el.size.height}
            viewBox={`0 0 ${el.size.width} ${el.size.height}`}
          >
            <polygon
              points={`${el.size.width / 2},0 0,${el.size.height} ${el.size.width},${el.size.height}`}
              fill={el.fill}
              stroke={el.stroke}
              strokeWidth={el.strokeWidth}
            />
          </svg>
        </div>
      );
    }

    if (el.shapeType === 'star') {
      const cx = el.size.width / 2;
      const cy = el.size.height / 2;
      const outerR = Math.min(el.size.width, el.size.height) / 2 - 5;
      const innerR = outerR * 0.4;
      let path = '';
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (i * Math.PI) / 5 - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        path += (i === 0 ? 'M' : 'L') + `${x},${y}`;
      }
      path += 'Z';

      return (
        <div style={commonStyle}>
          <svg
            width={el.size.width}
            height={el.size.height}
          >
            <path d={path} fill={el.fill} stroke={el.stroke} strokeWidth={el.strokeWidth} />
          </svg>
        </div>
      );
    }

    return (
      <div
        style={{
          ...commonStyle,
          backgroundColor: el.fill,
          border: el.strokeWidth > 0 ? `${el.strokeWidth}px solid ${el.stroke}` : 'none',
        }}
      />
    );
  };

  if (element.type === 'text') {
    const textEl = element as TextElement;
    return (
      <div
        style={{
          position: 'absolute',
          left: textEl.position.x,
          top: textEl.position.y,
          width: textEl.size.width,
          height: textEl.size.height,
          transform: `rotate(${textEl.rotation}deg)`,
          opacity: textEl.opacity,
          zIndex: textEl.zIndex,
          cursor: 'move',
          userSelect: 'none',
          border: isSelected ? '2px dashed #3b82f6' : '2px solid transparent',
          overflow: 'visible',
        }}
        onClick={onSelect}
        onMouseDown={(e) => onDragStart(e)}
      >
        <div
          ref={textRef}
          contentEditable={isEditing}
          suppressContentEditableWarning
          style={{
            width: '100%',
            height: '100%',
            fontFamily: textEl.style.fontFamily,
            fontSize: textEl.style.fontSize,
            fontWeight: textEl.style.fontWeight,
            color: textEl.style.color,
            textAlign: textEl.style.textAlign as 'left' | 'center' | 'right' | 'justify',
            lineHeight: textEl.style.lineHeight,
            letterSpacing: textEl.style.letterSpacing,
            textShadow: textEl.style.textShadow,
            backgroundColor: textEl.style.backgroundColor || 'transparent',
            outline: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent:
              textEl.style.textAlign === 'center'
                ? 'center'
                : textEl.style.textAlign === 'right'
                ? 'flex-end'
                : 'flex-start',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
          }}
          onDoubleClick={() => setIsEditing(true)}
          onBlur={(e) => {
            setIsEditing(false);
            updateElement(element.id, { text: e.currentTarget.innerText });
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {textEl.text}
        </div>
      </div>
    );
  }

  if (element.type === 'image') {
    const imgEl = element as ImageElement;
    return (
      <div
        style={{
          position: 'absolute',
          left: imgEl.position.x,
          top: imgEl.position.y,
          width: imgEl.size.width,
          height: imgEl.size.height,
          transform: `rotate(${imgEl.rotation}deg)`,
          opacity: imgEl.opacity,
          zIndex: imgEl.zIndex,
          cursor: 'move',
          border: isSelected ? '2px dashed #3b82f6' : 'none',
          overflow: 'hidden',
          borderRadius: imgEl.borderRadius,
        }}
        onClick={onSelect}
        onMouseDown={(e) => onDragStart(e)}
      >
        <img
          src={imgEl.src}
          alt="Thumbnail element"
          style={{
            width: '100%',
            height: '100%',
            objectFit: imgEl.objectFit,
            filter: `brightness(${imgEl.filters.brightness}%) contrast(${imgEl.filters.contrast}%) saturate(${imgEl.filters.saturation}%) blur(${imgEl.filters.blur}px) hue-rotate(${imgEl.filters.hueRotate}deg)`,
            pointerEvents: 'none',
          }}
        />
      </div>
    );
  }

  if (element.type === 'shape') {
    const shapeEl = element as ShapeElement;
    return (
      <div
        onClick={onSelect}
        onMouseDown={(e) => onDragStart(e)}
        style={{
          position: 'absolute',
          left: shapeEl.position.x,
          top: shapeEl.position.y,
          width: shapeEl.size.width,
          height: shapeEl.size.height,
          transform: `rotate(${shapeEl.rotation}deg)`,
          opacity: shapeEl.opacity,
          zIndex: shapeEl.zIndex,
          cursor: 'move',
        }}
      >
        {renderShape(shapeEl)}
      </div>
    );
  }

  return null;
};

const EditorCanvas: React.FC = () => {
  const { elements, selectedIds, canvas, selectElement, deselectAll, updateElement, setTool, tool, zoom } = useEditorStore();
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    elementId: null,
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
  });

  const getCanvasCoordinates = useCallback((e: React.MouseEvent): { x: number; y: number } => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const scale = zoom / 100;
    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale,
    };
  }, [zoom]);

  const handleMouseDown = useCallback((e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    const { x, y } = getCanvasCoordinates(e);
    const element = elements.find((el) => el.id === elementId);
    if (!element) return;

    setDragState({
      isDragging: true,
      elementId,
      startX: x,
      startY: y,
      initialX: element.position.x,
      initialY: element.position.y,
    });

    if (!selectedIds.includes(elementId)) {
      selectElement(elementId, e.metaKey || e.ctrlKey);
    }
  }, [getCanvasCoordinates, elements, selectedIds, selectElement]);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      deselectAll();
    }
  }, [deselectAll]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragState.isDragging || !dragState.elementId) return;

    const { x, y } = getCanvasCoordinates(e);
    const deltaX = x - dragState.startX;
    const deltaY = y - dragState.startY;

    updateElement(dragState.elementId, {
      position: {
        x: dragState.initialX + deltaX,
        y: dragState.initialY + deltaY,
      },
    });
  }, [dragState, getCanvasCoordinates, updateElement]);

  const handleMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      elementId: null,
      startX: 0,
      startY: 0,
      initialX: 0,
      initialY: 0,
    });
  }, []);

  useEffect(() => {
    if (dragState.isDragging) {
      window.addEventListener('mousemove', handleMouseMove as any);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove as any);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState, handleMouseMove, handleMouseUp]);

  const getCanvasBackground = () => {
    if (canvas.backgroundImage) {
      return `url(${canvas.backgroundImage})`;
    }
    return canvas.backgroundColor;
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-auto flex items-start justify-center p-8 bg-neutral-900"
      style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #333 1px, transparent 0)', backgroundSize: '20px 20px' }}
    >
      <div
        ref={canvasRef}
        className="relative shadow-2xl transition-shadow duration-200"
        style={{
          width: canvas.width * (zoom / 100),
          height: canvas.height * (zoom / 100),
          background: getCanvasBackground(),
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transformOrigin: 'top left',
        }}
        onMouseDown={handleCanvasMouseDown}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Elements */}
        {elements.map((element) => (
          <CanvasElement
            key={element.id}
            element={element}
            isSelected={selectedIds.includes(element.id)}
            onSelect={(e: React.MouseEvent) => {
              if (tool !== 'select') return;
              handleMouseDown(e, element.id);
            }}
            onDragStart={(e: React.MouseEvent) => handleMouseDown(e, element.id)}
            onResize={() => {}}
            canvasRef={canvasRef}
          />
        ))}
      </div>
    </div>
  );
};

export default EditorCanvas;
