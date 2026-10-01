/**
 * End-to-End Encrypted Peer Messenger & Notes Vault
 * Features AES-256-GCM symmetric payload encryption, RSA-OAEP 2048-bit key wrapping,
 * authenticated GCM tag verification, and a live Raw Ciphertext Inspector.
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquareLock,
  Lock,
  Unlock,
  ShieldCheck,
  Send,
  Eye,
  Key,
  CheckCircle2,
  AlertTriangle,
  User,
  Copy,
} from 'lucide-react';
import { EncryptedMessagePayload } from '../types';

export const E2EEMessengerView: React.FC = () => {
  const {
    currentUser,
    users,
    e2eeMessages,
    sendE2EEMessage,
    decryptE2EEMessage,
    rsaKeyPair,
    showToast,
  } = useApp();

  const [selectedRecipientId, setSelectedRecipientId] = useState<string>(
    users.find(u => u.id !== currentUser.id)?.id || users[0].id
  );
  const [subject, setSubject] = useState('');
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Decrypted cache for viewed messages
  const [decryptedCache, setDecryptedCache] = useState<Record<string, string>>({});
  // Inspector modal for raw cryptographic payload
  const [inspectingMsg, setInspectingMsg] = useState<EncryptedMessagePayload | null>(null);

  const myMessages = e2eeMessages.filter(
    m => m.recipientId === currentUser.id || m.senderId === currentUser.id
  );

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setIsSending(true);
    try {
      await sendE2EEMessage(selectedRecipientId, subject || 'Peer Study Note', messageText);
      setMessageText('');
      setSubject('');
    } finally {
      setIsSending(false);
    }
  };

  const handleDecrypt = async (msg: EncryptedMessagePayload) => {
    try {
      const plaintext = await decryptE2EEMessage(msg);
      setDecryptedCache(prev => ({ ...prev, [msg.id]: plaintext }));
      showToast('Authenticated Decryption Successful (AES-256-GCM)', 'security');
    } catch (err: any) {
      showToast(err.message || 'Decryption failed.', 'error');
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
              <span>Zero-Knowledge End-to-End Cryptography</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1 flex items-center gap-2">
              <MessageSquareLock className="w-7 h-7 text-sky-400" />
              Encrypted Peer Study Exchange
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Confidential peer messages and exam solutions are encrypted directly in your browser. Neither university servers nor third parties can inspect payload contents.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs font-mono space-y-1">
            <div className="text-[10px] text-slate-400">YOUR RSA-OAEP KEY ENCLAVE</div>
            <div className="text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              2048-bit Private Key In Browser Memory
            </div>
          </div>
        </div>

        {/* Cryptographic Pipeline Indicator */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[11px] text-slate-300">
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center gap-2">
            <Key className="w-4 h-4 text-sky-400 shrink-0" />
            <span>1. Asymmetric Recipient Key Exchange (RSA-OAEP 2048)</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>2. Symmetric Payload Cipher (AES-256-GCM + 96-bit IV)</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>3. Authenticated Integrity (128-bit GCM Tag Verification)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Compose Encrypted Message (1 col) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Compose E2EE Message</h3>
            <p className="text-xs text-slate-500">
              Payload will be encrypted with recipient’s public key.
            </p>
          </div>

          <form onSubmit={handleSend} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Recipient Classmate</label>
              <select
                value={selectedRecipientId}
                onChange={e => setSelectedRecipientId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              >
                {users
                  .filter(u => u.id !== currentUser.id)
                  .map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.department})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Subject Metadata (Unencrypted routing)</label>
              <input
                type="text"
                placeholder="e.g. Fourier Transform derivation step 3"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Confidential Study Note / Solution (Encrypted with AES-256-GCM)
              </label>
              <textarea
                rows={4}
                required
                placeholder="Enter sensitive formulas, homework steps, or peer review..."
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              {isSending ? 'Encrypting & Transmitting...' : 'Encrypt & Send Payload'}
            </button>
          </form>
        </div>

        {/* Right Column: Encrypted Inbox & Outbox (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Encrypted Peer Messages ({myMessages.length})
              </h3>
              <p className="text-xs text-slate-500">
                Messages stored as ciphertext bundles. Decrypt on-demand using your local private key.
              </p>
            </div>
          </div>

          {myMessages.length > 0 ? (
            <div className="space-y-3">
              {myMessages.map(msg => {
                const isRecipient = msg.recipientId === currentUser.id;
                const decrypted = decryptedCache[msg.id];

                return (
                  <div
                    key={msg.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 transition-all hover:border-slate-300"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{msg.subject}</span>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {isRecipient ? `From: ${msg.senderName}` : `To: ${msg.recipientName}`} ·{' '}
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setInspectingMsg(msg)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold hover:bg-slate-100 flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3 h-3 text-slate-500" />
                          Inspect Ciphertext
                        </button>

                        {!decrypted ? (
                          <button
                            onClick={() => handleDecrypt(msg)}
                            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 transition-colors"
                          >
                            <Unlock className="w-3 h-3" />
                            Decrypt (AES-256)
                          </button>
                        ) : (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Decrypted
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Decrypted Text View OR Ciphertext Preview */}
                    {decrypted ? (
                      <div className="p-3.5 rounded-xl bg-white border border-emerald-200 text-xs text-slate-900 leading-relaxed font-mono whitespace-pre-wrap">
                        {decrypted}
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-slate-900 text-slate-400 font-mono text-[10px] break-all leading-tight">
                        <span className="text-slate-500 block mb-1">CIPHERTEXT (AES-256-GCM):</span>
                        {msg.ciphertext.substring(0, 120)}...
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-10 text-center text-slate-500 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              No encrypted messages yet. Send your first encrypted study note to a classmate!
            </div>
          )}
        </div>
      </div>

      {/* Raw Ciphertext Inspector Modal */}
      {inspectingMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">Cryptographic Payload Inspector</h3>
              </div>
              <button
                onClick={() => setInspectingMsg(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs font-mono">
              <p className="text-slate-600 font-sans">
                This exact JSON bundle is all the server or transport layer sees. Plaintext is only reconstructible with the corresponding private key.
              </p>

              <div>
                <span className="font-bold text-slate-700 block mb-1">1. Ciphertext (AES-256-GCM):</span>
                <div className="p-3 bg-slate-900 text-emerald-400 rounded-xl text-[10px] break-all">
                  {inspectingMsg.ciphertext}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="font-bold text-slate-700 block mb-1">2. 96-bit Random IV:</span>
                  <div className="p-2.5 bg-slate-100 rounded-xl text-[10px] break-all">
                    {inspectingMsg.iv}
                  </div>
                </div>
                <div>
                  <span className="font-bold text-slate-700 block mb-1">3. 128-bit Auth Tag:</span>
                  <div className="p-2.5 bg-slate-100 rounded-xl text-[10px] break-all">
                    {inspectingMsg.authTag}
                  </div>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">4. Recipient RSA-Wrapped Session Key:</span>
                <div className="p-2.5 bg-slate-100 rounded-xl text-[10px] break-all">
                  {inspectingMsg.encryptedKeyRecipient}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
