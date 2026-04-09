'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Share2, Download, Copy } from 'lucide-react';

export default function QRCodeDisplay({ value, label }: { value: string; label?: string }) {
  const [dataUrl, setDataUrl] = useState('');

  useEffect(() => {
    if (value) {
      QRCode.toDataURL(value, {
        margin: 2,
        width: 400,
        color: {
          dark: '#ffffff',
          light: '#0d0019',
        },
      }).then(setDataUrl);
    }
  }, [value]);

  return (
    <div className="card-surface flex flex-col items-center">
      {label && <span className="text-xs font-bold text-text-secondary uppercase mb-4 tracking-widest">{label}</span>}
      <div className="bg-white p-3 rounded-2xl mb-6 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
        {dataUrl ? (
          <img src={dataUrl} alt="QR Code" className="w-48 h-48 rounded-lg" />
        ) : (
          <div className="w-48 h-48 bg-background animate-pulse rounded-lg" />
        )}
      </div>
      <div className="flex gap-4">
        <button 
          onClick={() => navigator.clipboard.writeText(value)}
          className="p-3 bg-high/50 rounded-xl text-primary hover:bg-primary hover:text-white transition-all"
        >
          <Copy size={20} />
        </button>
        <button className="p-3 bg-high/50 rounded-xl text-accent-indigo hover:bg-accent-indigo hover:text-white transition-all">
          <Share2 size={20} />
        </button>
        <button className="p-3 bg-high/50 rounded-xl text-accent-fuchsia hover:bg-accent-fuchsia hover:text-white transition-all">
          <Download size={20} />
        </button>
      </div>
      <p className="mt-6 text-xs font-mono text-text-muted break-all max-w-xs text-center leading-relaxed">
        {value}
      </p>
    </div>
  );
}
