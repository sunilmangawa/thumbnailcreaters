'use client';

import { create } from 'zustand';
import { EditorElement, CanvasState, ToolType } from '@/types';

interface EditorStore {
  elements: EditorElement[];
  selectedIds: string[];
  canvas: CanvasState;
  tool: ToolType;
  zoom: number;
  history: EditorElement[][];
  historyIndex: number;
  
  // Actions
  setElements: (elements: EditorElement[] | ((prev: EditorElement[]) => EditorElement[])) => void;
  addElement: (element: EditorElement) => void;
  updateElement: (id: string, updates: Partial<EditorElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string, multi?: boolean) => void;
  deselectAll: () => void;
  setTool: (tool: ToolType) => void;
  setZoom: (zoom: number) => void;
  setCanvas: (canvas: Partial<CanvasState>) => void;
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  duplicateElement: (id: string) => void;
  moveElement: (id: string, deltaX: number, deltaY: number) => void;
  resizeElement: (id: string, width: number, height: number) => void;
  rotateElement: (id: string, rotation: number) => void;
  setElementOpacity: (id: string, opacity: number) => void;
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  elements: [],
  selectedIds: [],
  canvas: {
    width: 1280,
    height: 720,
    backgroundColor: '#ffffff',
  },
  tool: 'select',
  zoom: 100,
  history: [[]],
  historyIndex: 0,

  setElements: (elements) => {
    set((state) => ({
      elements: typeof elements === 'function' ? elements(state.elements) : elements,
    }));
  },

  addElement: (element) => {
    get().saveToHistory();
    set((state) => ({
      elements: [...state.elements, { ...element, zIndex: state.elements.length }],
      selectedIds: [element.id],
    }));
  },

  updateElement: (id, updates) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, ...updates } as EditorElement : el
      ),
    }));
  },

  deleteElement: (id) => {
    get().saveToHistory();
    set((state) => ({
      elements: state.elements.filter((el) => el.id !== id),
      selectedIds: state.selectedIds.filter((sid) => sid !== id),
    }));
  },

  selectElement: (id, multi = false) => {
    set((state) => ({
      selectedIds: multi
        ? state.selectedIds.includes(id)
          ? state.selectedIds.filter((sid) => sid !== id)
          : [...state.selectedIds, id]
        : [id],
    }));
  },

  deselectAll: () => {
    set({ selectedIds: [] });
  },

  setTool: (tool) => {
    set({ tool });
  },

  setZoom: (zoom) => {
    set({ zoom: Math.max(10, Math.min(500, zoom)) });
  },

  setCanvas: (canvas) => {
    set((state) => ({
      canvas: { ...state.canvas, ...canvas },
    }));
  },

  saveToHistory: () => {
    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push([...state.elements]);
      return {
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  undo: () => {
    set((state) => {
      if (state.historyIndex <= 0) return state;
      const newIndex = state.historyIndex - 1;
      return {
        historyIndex: newIndex,
        elements: [...state.history[newIndex]],
        selectedIds: [],
      };
    });
  },

  redo: () => {
    set((state) => {
      if (state.historyIndex >= state.history.length - 1) return state;
      const newIndex = state.historyIndex + 1;
      return {
        historyIndex: newIndex,
        elements: [...state.history[newIndex]],
        selectedIds: [],
      };
    });
  },

  bringToFront: (id) => {
    get().saveToHistory();
    set((state) => {
      const maxZ = Math.max(...state.elements.map((el) => el.zIndex), 0);
      return {
        elements: state.elements.map((el) =>
          el.id === id ? { ...el, zIndex: maxZ + 1 } : el
        ),
      };
    });
  },

  sendToBack: (id) => {
    get().saveToHistory();
    set((state) => {
      const minZ = Math.min(...state.elements.map((el) => el.zIndex), 0);
      return {
        elements: state.elements.map((el) =>
          el.id === id ? { ...el, zIndex: minZ - 1 } : el
        ),
      };
    });
  },

  duplicateElement: (id) => {
    get().saveToHistory();
    set((state) => {
      const element = state.elements.find((el) => el.id === id);
      if (!element) return state;
      const newElement = {
        ...element,
        id: generateId(),
        position: { x: element.position.x + 20, y: element.position.y + 20 },
        zIndex: Math.max(...state.elements.map((el) => el.zIndex)) + 1,
      } as EditorElement;
      return {
        elements: [...state.elements, newElement],
        selectedIds: [newElement.id],
      };
    });
  },

  moveElement: (id, deltaX, deltaY) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id
          ? { ...el, position: { x: el.position.x + deltaX, y: el.position.y + deltaY } }
          : el
      ),
    }));
  },

  resizeElement: (id, width, height) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, size: { width, height } } : el
      ),
    }));
  },

  rotateElement: (id, rotation) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, rotation } : el
      ),
    }));
  },

  setElementOpacity: (id, opacity) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, opacity } : el
      ),
    }));
  },
}));
