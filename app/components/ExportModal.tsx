'use client';

import React, { useState, useRef } from 'react';
import { X, Download, Image as ImageIcon } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: 'png' | 'jpg' | 'webp', quality: number) => void;
  canvasPreview?: string;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onExport, canvasPreview }) => {
  const [format, setFormat] = useState<'png' | 'jpg' | 'webp'>('png');
  const [quality, setQuality] = useState(90);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    setIsExporting(true);
    onExport(format, quality);
    setTimeout(() => {
      setIsExporting(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-neutral-800 rounded-xl shadow-2xl w-full max-w-md mx-4 border border-neutral-700">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-700">
          <h2 className="text-lg font-semibold text-white">Export Thumbnail</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Preview */}
          {canvasPreview && (
            <div className="flex justify-center">
              <div className="relative max-w-xs">
                <img
                  src={canvasPreview}
                  alt="Preview"
                  className="rounded-lg border border-neutral-700 max-h-48 object-contain"
                />
              </div>
            </div>
          )}

          {/* Format */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">File Format</label>
            <div className="grid grid-cols-3 gap-2">
              {(['png', 'jpg', 'webp'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`py-2.5 px-4 rounded-lg border text-sm font-medium transition-colors ${
                    format === f
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-neutral-700 border-neutral-600 text-neutral-300 hover:bg-neutral-600'
                  }`}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Quality */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Quality: {quality}%
            </label>
            <input
              type="range"
              min="50"
              max="100"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-neutral-500 mt-1">
              <span>Low (smaller)</span>
              <span>Best (larger)</span>
            </div>
          </div>

          {/* Dimensions */}
          <div className="bg-neutral-700/50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-neutral-300">
              <ImageIcon className="w-4 h-4" />
              <span>Dimensions: 1280 x 720 px</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download {format.toUpperCase()}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
