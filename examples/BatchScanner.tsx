'use client';

import React, { useState } from 'react';

interface BatchScannerProps {
  className?: string;
}

/**
 * Educational stub for batch scanning multiple accounts.
 */
export function BatchScanner({ className = '' }: BatchScannerProps) {
  const [accounts, setAccounts] = useState('');
  const [scanning, setScanning] = useState(false);

  const handleScan = () => {
    setScanning(true);
    // Simulate scanning
    setTimeout(() => {
      setScanning(false);
      alert('Batch scan completed (demo). Check console for results.');
    }, 1500);
  };

  return (
    <div className={`rounded-2xl border border-white/10 p-6 ${className}`}>
      <h3 className="font-semibold mb-4">Batch Account Scanner</h3>

      <textarea
        value={accounts}
        onChange={(e) => setAccounts(e.target.value)}
        placeholder="Enter multiple WAX account names (one per line)"
        className="w-full h-32 bg-black/50 border border-white/10 rounded p-3 text-sm mb-4"
      />

      <button
        onClick={handleScan}
        disabled={scanning || !accounts.trim()}
        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-white/10 rounded text-sm"
      >
        {scanning ? 'Scanning...' : 'Start Batch Audit'}
      </button>

      <p className="text-xs text-muted-foreground mt-3">
        Enter multiple accounts to get a combined security report.
      </p>
    </div>
  );
}
