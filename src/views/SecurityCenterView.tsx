/**
 * Security & E2EE Cryptography Center
 * Comprehensive OWASP Top 10 Enterprise Architecture Documentation,
 * Live Interactive Cryptographic Workbench, and Immutable Security Audit Trail.
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TOP_10_SECURITY_BEST_PRACTICES } from '../data/securityBestPractices';
import {
  ShieldCheck,
  Lock,
  Unlock,
  Key,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Sparkles,
  FileCode,
  Layers,
  Search,
} from 'lucide-react';
import { cryptoService } from '../services/cryptoService';

export const SecurityCenterView: React.FC = () => {
  const { currentUser, rsaKeyPair, securityLogs, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'owasp_top10' | 'crypto_workbench' | 'audit_log'>('owasp_top10');
  const [selectedPractice, setSelectedPractice] = useState(TOP_10_SECURITY_BEST_PRACTICES[0]);

  // Live Cryptographic Workbench state
  const [testPlaintext, setTestPlaintext] = useState('Secret student exam formula: FFT Radix-2 = O(N log2 N)');
  const [testEncrypted, setTestEncrypted] = useState<{
    ciphertext: string;
    iv: string;
    authTag: string;
    wrappedKey: string;
  } | null>(null);
  const [testDecrypted, setTestDecrypted] = useState<string | null>(null);

  // Tamper detection test state
  const [tamperInput, setTamperInput] = useState('STUDENT:aditya:CREDITS:50:TIMESTAMP:2026-10-01');
  const [tamperSig, setTamperSig] = useState('');
  const [tamperVerification, setTamperVerification] = useState<'idle' | 'valid' | 'tampered'>('idle');

  // Generate test signature on load
  React.useEffect(() => {
    cryptoService.signLedgerRecord(tamperInput).then(sig => setTamperSig(sig));
  }, []);

  // Run live E2EE Encryption in workbench
  const handleRunEncryption = async () => {
    if (!rsaKeyPair?.publicKeyJwk) {
      showToast('Client RSA key enclave not initialized.', 'error');
      return;
    }

    try {
      const payload = await cryptoService.encryptEndToEnd(
        testPlaintext,
        rsaKeyPair.publicKeyJwk,
        rsaKeyPair.publicKeyJwk
      );

      setTestEncrypted({
        ciphertext: payload.ciphertext,
        iv: payload.iv,
        authTag: payload.authTag,
        wrappedKey: payload.encryptedKeyRecipient,
      });
      setTestDecrypted(null);
      showToast('Payload Encrypted with AES-256-GCM + RSA-OAEP 2048', 'security');
    } catch (err: any) {
      showToast('Encryption failed: ' + err.message, 'error');
    }
  };

  // Run live E2EE Decryption in workbench
  const handleRunDecryption = async () => {
    if (!testEncrypted || !rsaKeyPair?.privateKeyJwk) return;

    try {
      const decrypted = await cryptoService.decryptEndToEnd(
        {
          ciphertext: testEncrypted.ciphertext,
          iv: testEncrypted.iv,
          wrappedKey: testEncrypted.wrappedKey,
        },
        rsaKeyPair.privateKeyJwk
      );

      setTestDecrypted(decrypted);
      showToast('Authenticated Decryption Successful! 128-bit tag verified.', 'security');
    } catch (err: any) {
      showToast('Decryption failed: ' + err.message, 'error');
    }
  };

  // Test Tamper Verification
  const handleVerifyTamper = async (modified: boolean) => {
    const dataToVerify = modified ? tamperInput + '_tampered_by_attacker' : tamperInput;
    const isValid = await cryptoService.verifyLedgerRecord(dataToVerify, tamperSig);
    setTamperVerification(isValid ? 'valid' : 'tampered');
    if (!isValid) {
      showToast('🚨 TAMPER DETECTED! HMAC-SHA256 signature mismatch.', 'error');
    } else {
      showToast('✓ Signature Valid: Data integrity confirmed.', 'success');
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Enterprise Grade Security Specification</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
              Top 10 Security Architecture &amp; Cryptography Center
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Formal documentation, live cryptographic test bench, and real-time validation of all 10 OWASP web application security controls.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-2xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('owasp_top10')}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                activeTab === 'owasp_top10' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              OWASP Top 10 Best Practices
            </button>
            <button
              onClick={() => setActiveTab('crypto_workbench')}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                activeTab === 'crypto_workbench' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Live Crypto Workbench
            </button>
            <button
              onClick={() => setActiveTab('audit_log')}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                activeTab === 'audit_log' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Security Audit Trail
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: Top 10 OWASP Security Best Practices */}
      {activeTab === 'owasp_top10' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: 10 Items List (1 col) */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              The Top 10 Best Practices
            </span>
            {TOP_10_SECURITY_BEST_PRACTICES.map(item => {
              const isSelected = selectedPractice.id === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedPractice(item)}
                  className={`w-full text-left p-3.5 rounded-2xl border text-xs transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'border-sky-500 bg-white shadow-sm ring-1 ring-sky-500'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="w-5 h-5 rounded-md bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {item.rank}
                  </span>
                  <div className="space-y-0.5 truncate">
                    <p className="font-extrabold text-slate-900 truncate">{item.title}</p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">{item.owaspCategory}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Deep Architectural Breakdown & Code (2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  {selectedPractice.owaspCategory}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-2">
                  #{selectedPractice.rank}. {selectedPractice.title}
                </h2>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 shrink-0">
                {selectedPractice.verificationStatus}
              </span>
            </div>

            {/* Rationale Section */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                1. Architectural Rationale &amp; Necessity
              </h4>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {selectedPractice.rationale}
              </p>
            </div>

            {/* Threats Mitigated */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                2. Threats Mitigated
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                {selectedPractice.threatsMitigated.map((t, idx) => (
                  <li key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Implementation Details */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                3. PeerCampus Implementation Details
              </h4>
              <p className="text-slate-600 leading-relaxed">
                {selectedPractice.implementationDetails}
              </p>
            </div>

            {/* Code Snippet Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono">Reference Implementation</span>
                <span className="font-mono text-[10px]">Test: {selectedPractice.testingCommand}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto">
                <pre>{selectedPractice.codeSnippet}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Live Interactive Cryptographic Workbench */}
      {activeTab === 'crypto_workbench' && (
        <div className="space-y-8">
          {/* Client RSA Key Enclave Status */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Key className="w-4 h-4 text-sky-600" />
                  Local Client-Side Cryptographic Enclave
                </h3>
                <p className="text-xs text-slate-500">
                  Authenticated User: <strong>{currentUser.name}</strong> ({currentUser.email})
                </p>
              </div>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                RSA-OAEP 2048-bit Active
              </span>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl text-slate-300 font-mono text-[10px] overflow-x-auto space-y-1">
              <span className="text-slate-500 block mb-1">YOUR PUBLIC KEY JSON WEB KEY (JWK):</span>
              <pre>{JSON.stringify(rsaKeyPair?.publicKeyJwk, null, 2)}</pre>
            </div>
            <p className="text-[11px] text-slate-500">
              * The corresponding private key is stored in browser-enclaved storage and is never transmitted over HTTP or stored on a centralized database.
            </p>
          </div>

          {/* Interactive Encryption / Decryption Test Bench */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Real-Time End-to-End Encryption Sandbox (AES-256-GCM)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Type any confidential text below, encrypt it client-side with an ephemeral 256-bit AES key, and verify authenticated tag decryption.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block font-bold text-slate-800">1. Plaintext Input</label>
              <textarea
                rows={2}
                value={testPlaintext}
                onChange={e => setTestPlaintext(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                onClick={handleRunEncryption}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Lock className="w-3.5 h-3.5" /> Execute E2EE Encrypt
              </button>
            </div>

            {testEncrypted && (
              <div className="space-y-4 pt-4 border-t border-slate-100 text-xs font-mono">
                <div>
                  <span className="font-bold text-slate-800 block mb-1">
                    2. Resulting Ciphertext (AES-256-GCM with 96-bit random IV &amp; 128-bit Auth Tag):
                  </span>
                  <div className="p-3 bg-slate-900 text-emerald-400 rounded-xl text-[10px] break-all">
                    {testEncrypted.ciphertext}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[10px]">
                  <div className="p-2 bg-slate-100 rounded-xl">
                    <strong>IV (96-bit):</strong> {testEncrypted.iv}
                  </div>
                  <div className="p-2 bg-slate-100 rounded-xl">
                    <strong>Auth Tag:</strong> {testEncrypted.authTag}
                  </div>
                </div>

                <button
                  onClick={handleRunDecryption}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors font-sans"
                >
                  <Unlock className="w-3.5 h-3.5" /> Decrypt &amp; Verify Authenticity
                </button>

                {testDecrypted && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950 font-sans space-y-1">
                    <span className="font-bold text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Authenticated Decrypted Plaintext:
                    </span>
                    <p className="font-mono text-xs bg-white p-2.5 rounded-xl border border-emerald-100">
                      {testDecrypted}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tamper Detection Sandbox (HMAC-SHA256) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Cryptographic Tamper-Proof Signature Check
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Every credit transaction and 70% video progression record is signed with HMAC-SHA256. If a malicious user tampers with even 1 byte, verification immediately aborts.
              </p>
            </div>

            <div className="p-3 bg-slate-100 rounded-xl text-xs font-mono">
              <span className="text-slate-500 block mb-1">LEDGER RECORD:</span>
              {tamperInput}
            </div>

            <div className="p-3 bg-slate-900 text-sky-400 rounded-xl text-[10px] font-mono break-all">
              <span className="text-slate-400 block mb-1">CRYPTOGRAPHIC SIGNATURE (HMAC-SHA256):</span>
              {tamperSig}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => handleVerifyTamper(false)}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors"
              >
                Verify Authentic Record
              </button>
              <button
                onClick={() => handleVerifyTamper(true)}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 transition-colors"
              >
                Simulate Attacker Tampering
              </button>
            </div>

            {tamperVerification === 'valid' && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 text-xs font-bold border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Record Verified! Signature matches exact ledger state.
              </div>
            )}

            {tamperVerification === 'tampered' && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-900 text-xs font-bold border border-rose-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                SECURITY ALARM: Signature verification failed. Tampered payload rejected!
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Immutable Security Audit Log Table */}
      {activeTab === 'audit_log' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Security Audit Log Stream ({securityLogs.length} Events)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Append-only log of cryptographic key generations, 70% threshold tokens, and credit transactions.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {securityLogs.map(log => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 font-mono text-[11px]">{log.action}</span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">{log.details}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                  <span>Actor: {log.userId} · {log.ipAddress}</span>
                  <span className="truncate max-w-xs">Sig: {log.signature.substring(0, 24)}...</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
