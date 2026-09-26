import React, { useState, useRef } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { User, ThemeConfig } from '../../types';
import { buildPatternUrl, buildPatternDisplayUrl } from '../../lib/username-patterns';
import { getSiteUrl } from '../../lib/site';
import { generateReferralCode, buildReferralUrl } from '@/lib/referrals';
import { copyToClipboard } from '../../lib/utils';
import { Download, Copy, Check, Palette, AlertCircle, Users, Share2 } from 'lucide-react';

interface QRCodePageProps {
  user: User & { invitesSent?: number; invitesAccepted?: number; referralCode?: string };
  theme?: ThemeConfig;
}

export const QRCodePage: React.FC<QRCodePageProps> = ({ user }) => {
  const cleanUsername = (user?.username || 'user').replace(/^[@$\-+!~]/, '').trim();
  const customQrUrl = `https://linkvm.online/${cleanUsername}`;
  const customQrDisplay = `linkvm.online/${cleanUsername}`;
  
  // Referral config using short token-based format linkvm.online/r/{code}
  const referralCode = user?.referralCode || generateReferralCode(cleanUsername, user?.id || 'guest');
  const referralUrl = `https://linkvm.online/r/${referralCode}`;
  const inviteCount = user?.invitesAccepted ?? user?.invitesSent ?? 0;

  const [fgColor, setFgColor] = useState('#0F172A');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [size, setSize] = useState<number>(512);
  const [includeMargin, setIncludeMargin] = useState(true);
  const [embedLogo, setEmbedLogo] = useState(true);
  
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedRefUrl, setCopiedRefUrl] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const refCanvasRef = useRef<HTMLDivElement>(null);

  if (!user || !user.username) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-900">No username claimed</h3>
        <p className="text-xs text-slate-500">Please set up your username in Settings first to generate a QR code.</p>
      </div>
    );
  }

  const handleDownloadPNG = () => {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (!canvas) return;

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `linkvm-qr-${user.username}.png`;
    link.click();
  };

  const handleDownloadSVG = () => {
    const svgElement = document.getElementById('linkvm-qr-svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `linkvm-qr-${user.username}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleDownloadRefPNG = () => {
    const canvas = refCanvasRef.current?.querySelector('canvas');
    if (!canvas) return;

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `linkvm-invite-qr-${user.username}.png`;
    link.click();
  };

  const handleCopyUrl = async () => {
    const ok = await copyToClipboard(customQrUrl);
    if (ok) {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  const handleCopyRefUrl = async () => {
    const ok = await copyToClipboard(referralUrl);
    if (ok) {
      setCopiedRefUrl(true);
      setTimeout(() => setCopiedRefUrl(false), 2000);
    }
  };

  const logoSettings = embedLogo
    ? {
        src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="10" fill="%234F46E5"/><path d="M12 28L28 12M28 12H16M28 12V24" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        height: 28,
        width: 28,
        excavate: true,
      }
    : undefined;

  return (
    <div className="space-y-8 w-full min-w-0 font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Custom QR Code Generator
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Vector &amp; High-Res
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Generate printable, high-resolution QR codes pointing directly to your creator profile.
          </p>
        </div>
        <div className="flex justify-end md:shrink-0">
          <button
            type="button"
            onClick={handleCopyUrl}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer border border-slate-200 shadow-2xs hover:-translate-y-0.5"
          >
            {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedUrl ? 'Copied URL!' : 'Copy Page URL'}</span>
          </button>
        </div>
      </div>

      {/* INVITE & REFERRAL LINK SECTION (Swapped to Top) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-xs w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Invite &amp; Referral Link</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Invite your friends to LinkVM and watch your network grow.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-100 shrink-0">
            <span className="text-xs font-bold text-slate-600">Total Signups:</span>
            <span className="text-xs font-extrabold text-indigo-600 font-mono">
              {inviteCount > 0 ? `${inviteCount} ${inviteCount === 1 ? 'signup' : 'signups'}` : 'No invites yet'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-6">
          <div className="md:col-span-7 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Your Referral URL</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-700 truncate select-all">
                  {referralUrl}
                </div>
                <button
                  type="button"
                  onClick={handleCopyRefUrl}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer shrink-0"
                >
                  {copiedRefUrl ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedRefUrl ? 'Copied Link!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Share this link on your social media, newsletter, or bio. Anyone who signs up through it joins LinkVM, and is counted in your real-time creator network tracker above!
            </p>
          </div>

          <div className="md:col-span-5 flex flex-col items-center border-l border-slate-100 pl-0 md:pl-8">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center space-y-3">
              <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-100">
                <QRCodeSVG
                  value={referralUrl}
                  size={140}
                  fgColor="#4F46E5"
                  bgColor="#FFFFFF"
                  level="H"
                  includeMargin={false}
                />
              </div>
              
              {/* Hidden canvas for PNG download */}
              <div ref={refCanvasRef} className="hidden">
                <QRCodeCanvas
                  value={referralUrl}
                  size={512}
                  fgColor="#4F46E5"
                  bgColor="#FFFFFF"
                  level="H"
                  includeMargin={true}
                />
              </div>

              <button
                type="button"
                onClick={handleDownloadRefPNG}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
              >
                <Share2 className="w-3 h-3 text-slate-500" />
                <span>Download Invite QR</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Controls vs Preview */}
      <div className="pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Customization options */}
          <div className="lg:col-span-6 space-y-5">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                <Palette className="w-4 h-4 text-indigo-600" />
                <span>QR Styling Options</span>
              </h3>

              {/* Colors */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Foreground Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer p-0 bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-full text-xs font-mono px-2.5 py-1.5 rounded-lg border border-slate-200 uppercase text-slate-800 font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Background Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer p-0 bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-full text-xs font-mono px-2.5 py-1.5 rounded-lg border border-slate-200 uppercase text-slate-800 font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Resolution Selector: 512 / 1024 / 2048 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Resolution</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: '512 px', val: 512 },
                    { label: '1024 px', val: 1024 },
                    { label: '2048 px', val: 2048 },
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setSize(item.val)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        size === item.val
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 space-y-2 border-t border-slate-100">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={embedLogo}
                    onChange={(e) => setEmbedLogo(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Embed LinkVM Center Mark</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeMargin}
                    onChange={(e) => setIncludeMargin(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Include Quiet Zone Margin (Print Recommended)</span>
                </label>
              </div>
            </div>

            {/* Quick presets */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 space-y-3 shadow-xs">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Quick Color Palettes
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Classic Noir', fg: '#0F172A', bg: '#FFFFFF' },
                  { label: 'Indigo Royal', fg: '#4F46E5', bg: '#FFFFFF' },
                  { label: 'Emerald Mint', fg: '#059669', bg: '#F0FDF4' },
                  { label: 'Warm Espresso', fg: '#451A03', bg: '#FFFBEB' },
                  { label: 'Cyber Violet', fg: '#7E22CE', bg: '#FAF5FF' },
                ].map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setFgColor(p.fg);
                      setBgColor(p.bg);
                    }}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.fg }} />
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: QR Preview & Download Buttons */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs flex flex-col items-center space-y-6 w-full max-w-sm">
              {/* Display rendered QR */}
              <div
                className="p-5 rounded-2xl shadow-inner border border-slate-100 flex items-center justify-center transition-all"
                style={{ backgroundColor: bgColor }}
              >
                <QRCodeSVG
                  id="linkvm-qr-svg"
                  value={customQrUrl}
                  size={220}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  level="H"
                  includeMargin={includeMargin}
                  imageSettings={logoSettings}
                />
              </div>

              {/* Hidden canvas for PNG export */}
              <div ref={canvasRef} className="hidden">
                <QRCodeCanvas
                  value={customQrUrl}
                  size={size}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  level="H"
                  includeMargin={includeMargin}
                  imageSettings={logoSettings}
                />
              </div>

              {/* URL label */}
              <div className="text-center space-y-1">
                <p className="text-xs font-bold text-slate-800 truncate max-w-xs font-mono">
                  {customQrDisplay}
                </p>
                <p className="text-[11px] text-slate-400">Scan to open LinkVM creator profile</p>
              </div>

              {/* Download Buttons */}
              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  type="button"
                  onClick={handleDownloadPNG}
                  className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PNG ({size}px)</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadSVG}
                  className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Vector SVG</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
