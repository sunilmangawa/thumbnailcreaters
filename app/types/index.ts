export type ElementType = 'text' | 'image' | 'shape' | 'sticker';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  color: string;
  backgroundColor?: string;
  textShadow?: string;
  textStroke?: string;
  textAlign: 'left' | 'center' | 'right';
  lineHeight: number;
  letterSpacing: number;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

export interface ImageFilters {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  hueRotate: number;
}

export interface BaseElement {
  id: string;
  type: ElementType;
  position: Position;
  size: Size;
  rotation: number;
  opacity: number;
  zIndex: number;
  locked: boolean;
  visible: boolean;
}

export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  style: TextStyle;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  filters: ImageFilters;
  borderRadius: number;
  objectFit: 'cover' | 'contain' | 'fill';
}

export type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'star' | 'arrow' | 'line';

export interface ShapeElement extends BaseElement {
  type: 'shape';
  shapeType: ShapeType;
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export type EditorElement = TextElement | ImageElement | ShapeElement;

export interface CanvasState {
  width: number;
  height: number;
  backgroundColor: string;
  backgroundImage?: string;
}

export type ToolType = 'select' | 'text' | 'image' | 'shape' | 'sticker' | 'hand';

export interface EditorState {
  elements: EditorElement[];
  selectedIds: string[];
  canvas: CanvasState;
  tool: ToolType;
  zoom: number;
  history: EditorElement[][];
  historyIndex: number;
}
