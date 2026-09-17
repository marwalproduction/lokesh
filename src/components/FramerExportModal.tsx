import React, { useState } from 'react';
import { Download, Copy, Check, ExternalLink, Code2, Sparkles, Layers } from 'lucide-react';

interface FramerExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FramerExportModal: React.FC<FramerExportModalProps> = ({ isOpen, onClose }) => {
  const [copiedType, setCopiedType] = useState<'url' | 'iframe' | 'full' | null>(null);
  const [activeTab, setActiveTab] = useState<'url' | 'embed' | 'file'>('url');

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const embedUrl = `${currentOrigin}/framer-embed.html`;

  const iframeSnippet = `<iframe
  src="${embedUrl}"
  width="100%"
  height="750"
  style="border: none; border-radius: 16px; overflow: hidden; width: 100%; max-width: 100%; display: block;"
  title="Checkout Revenue Velocity & Conversion Evolution"
  allow="clipboard-write"
></iframe>`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(embedUrl);
    setCopiedType('url');
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCopyIframe = () => {
    navigator.clipboard.writeText(iframeSnippet);
    setCopiedType('iframe');
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCopyFullHtml = async () => {
    try {
      const res = await fetch('/framer-embed.html');
      const text = await res.text();
      navigator.clipboard.writeText(text);
      setCopiedType('full');
      setTimeout(() => setCopiedType(null), 2000);
    } catch {
      handleCopyIframe();
    }
  };

  const handleDownloadFile = () => {
    const link = document.createElement('a');
    link.href = '/framer-embed.html';
    link.download = 'checkout-evolution-framer.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Use in Framer (Single HTML Export)
              </h3>
              <p className="text-xs text-slate-500">
                Self-contained interactive showreel ready for any Framer site
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-100 bg-slate-50/40">
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'url'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Option 1: Embed via URL (Recommended)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('embed')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'embed'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Option 2: Embed Code (iframe)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('file')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'file'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Option 3: Download Standalone HTML
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-4">
          {activeTab === 'url' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-950 leading-relaxed">
                <span className="font-semibold text-indigo-700">How to use in Framer:</span>
                <ol className="list-decimal list-inside mt-1.5 space-y-1 text-slate-700">
                  <li>In Framer, open your canvas and press <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">Insert</kbd> (or <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">+</kbd>).</li>
                  <li>Search for <strong>Embed</strong> (under Utility) and drag it to your canvas.</li>
                  <li>In the right properties panel, select <strong>Type: URL</strong> and paste this link:</li>
                </ol>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={embedUrl}
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 select-all outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition shadow-xs cursor-pointer"
                >
                  {copiedType === 'url' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'url' ? 'Copied!' : 'Copy URL'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Direct preview available:</span>
                <a
                  href="/framer-embed.html"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-indigo-600 hover:underline font-medium"
                >
                  <span>Open Standalone HTML in new tab</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {activeTab === 'embed' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                <span className="font-semibold text-slate-900">HTML Embed Snippet:</span>
                <p className="mt-1 text-slate-600">
                  In Framer, set Embed component <strong>Type: HTML</strong> and paste this snippet:
                </p>
              </div>

              <div className="relative">
                <pre className="p-3.5 bg-slate-900 text-slate-100 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed max-h-48 border border-slate-800">
                  {iframeSnippet}
                </pre>
                <button
                  type="button"
                  onClick={handleCopyIframe}
                  className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition cursor-pointer"
                >
                  {copiedType === 'iframe' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'iframe' ? 'Copied Snippet' : 'Copy'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'file' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs text-emerald-950 leading-relaxed">
                <span className="font-semibold text-emerald-800">100% Standalone Single HTML File:</span>
                <p className="mt-1 text-slate-700">
                  Contains all CSS styling, JavaScript state engine, SVG charts, and Framer Motion logic bundled into a single file with no build step required.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadFile}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-md transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .html File (checkout-evolution-framer.html)</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyFullHtml}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
                >
                  {copiedType === 'full' ? <Check className="w-4 h-4 text-emerald-600" /> : <Code2 className="w-4 h-4" />}
                  <span>{copiedType === 'full' ? 'Code Copied!' : 'Copy Full HTML Code'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Includes 1-click replay, full animation sequence & manual stage inspection.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
