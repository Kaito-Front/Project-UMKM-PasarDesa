import React from 'react';
import { MessageCircle, Clock, MapPin, ExternalLink } from 'lucide-react';

/**
 * Format nomor telepon Indonesia menjadi format yang mudah dibaca (misal: 0812-3456-7890)
 */
function formatIndonesianPhone(numStr) {
  if (!numStr) return '';
  let clean = numStr.replace(/\D/g, '');
  if (clean.startsWith('62')) {
    clean = '0' + clean.slice(2);
  }
  if (clean.length >= 10) {
    return clean.replace(/(\d{4})(\d{4})(\d+)/, '$1-$2-$3');
  }
  return clean;
}

/**
 * Parse teks sebaris untuk merender **bold**, *italic*, dan [link](url) secara aman tanpa dangerouslySetInnerHTML
 */
function renderInlineFormatted(text, keyPrefix = 'inline') {
  if (!text) return null;

  // Regex mencocokkan markdown link, bold (**), dan italic (*)
  const pattern = /(\[(?:[^\]]+)\]\((?:https?:\/\/[^)]+)\)|\*\*(?:[^*]+)\*\*|\*(?:[^*]+)\*)/g;
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    if (!part) return null;
    const k = `${keyPrefix}-${index}`;

    // Markdown link: [label](url)
    const linkMatch = part.match(/^\[(.*?)\]\((https?:\/\/[^)]+)\)$/);
    if (linkMatch) {
      const isWa = linkMatch[2].includes('wa.me') || linkMatch[2].includes('whatsapp');
      return (
        <a
          key={k}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className={
            isWa
              ? 'inline-flex items-center gap-1 font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-800'
              : 'inline-flex items-center gap-1 font-semibold text-desa-accent underline underline-offset-2 hover:opacity-80'
          }
        >
          {linkMatch[1]}
          <ExternalLink className="w-3 h-3 inline-block opacity-70" />
        </a>
      );
    }

    // Bold: **teks**
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={k} className="font-bold text-desa-primary">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Italic: *teks*
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={k} className="italic text-desa-muted">
          {part.slice(1, -1)}
        </em>
      );
    }

    // Normal text
    return <span key={k}>{part}</span>;
  });
}

/**
 * Normalisasi dan bagi teks menjadi blok-blok terstruktur (paragraf, WhatsApp action card, info badges, list)
 */
function parseMessageBlocks(rawText) {
  if (!rawText) return [];

  // 1. Normalisasi: Pisahkan emoji kontak/info yang berhimpitan tanpa spasi / baris baru
  const normalized = rawText
    .replace(/(📱|⏰|📍|🛍️|📦|💡|📞)/gu, '\n$1 ')
    .replace(/([.!?])\s*(Atau jika|Silakan|Bisa juga|Ada lagi yang bisa|Semoga membantu)/gi, '$1\n\n$2')
    .trim();

  const lines = normalized.split('\n').map(l => l.trim()).filter(Boolean);
  const blocks = [];
  let pendingMeta = [];

  const flushMeta = () => {
    if (pendingMeta.length > 0) {
      blocks.push({
        type: 'meta_group',
        items: [...pendingMeta]
      });
      pendingMeta = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Deteksi link WhatsApp: [text](https://wa.me/...) atau https://wa.me/...
    const waMatch = line.match(/\[(.*?)\]\((https?:\/\/wa\.me\/[^)]+)\)/i) || 
                    line.match(/(https?:\/\/wa\.me\/[^\s)]+)/i);

    if (waMatch) {
      flushMeta();
      const url = waMatch[2] || waMatch[1];
      const rawNum = url.split('wa.me/')[1]?.split('?')[0] || '';
      const formattedNum = formatIndonesianPhone(rawNum);
      const customLabel = (waMatch[1] && !waMatch[1].match(/^\d+$/) ? waMatch[1] : '')
        .replace(/^[-*•\s:]+/, '')
        .trim();

      blocks.push({
        type: 'whatsapp_card',
        url,
        phone: formattedNum,
        label: customLabel || 'Hubungi WhatsApp Pengrajin'
      });
      continue;
    }

    // Deteksi Info Operasional & Lokasi Toko
    const isHours = line.includes('Jam Operasional:') || line.startsWith('⏰');
    const isLocation = line.includes('Wilayah:') || line.startsWith('📍');

    if (isHours || isLocation) {
      const cleanText = line
        .replace(/[⏰📍]/gu, '')
        .replace(/^[-*•\s]+/, '')
        .replace(/\*\*(Jam Operasional|Wilayah):\*\*/gi, '$1:')
        .trim();

      pendingMeta.push({
        type: isHours ? 'hours' : 'location',
        text: cleanText
      });
      continue;
    }

    // Jika bukan meta, keluarkan antrean meta jika ada
    flushMeta();

    // Deteksi Bullet point
    if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ')) {
      blocks.push({
        type: 'bullet',
        text: line.replace(/^[-*•]\s*/, '').trim()
      });
      continue;
    }

    // Paragraf biasa
    blocks.push({
      type: 'paragraph',
      text: line
    });
  }

  flushMeta();
  return blocks;
}

export default function FormattedChatMessage({ text, isUser = false }) {
  if (isUser) {
    return (
      <div className="leading-relaxed text-[12.5px] whitespace-pre-wrap">
        {renderInlineFormatted(text, 'usr')}
      </div>
    );
  }

  const blocks = parseMessageBlocks(text);

  return (
    <div className="space-y-2.5 text-[12.5px] leading-relaxed text-desa-text">
      {blocks.map((block, idx) => {
        if (block.type === 'whatsapp_card') {
          return (
            <div
              key={`wa-${idx}`}
              className="my-2 p-2.5 rounded-xl bg-emerald-50/90 border border-emerald-600/25 flex flex-col gap-2 shadow-xs transition-all hover:border-emerald-600/40"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-900 tracking-wide uppercase">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Kontak Pengrajin Resmi
                </span>
                <span className="text-[10px] font-semibold text-emerald-800/80 bg-white/80 px-2 py-0.5 rounded-md border border-emerald-600/20">
                  {block.phone || 'WhatsApp'}
                </span>
              </div>

              <a
                href={block.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors group"
              >
                <MessageCircle className="w-4 h-4 fill-white/20 text-white" />
                <span>{block.label}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          );
        }

        if (block.type === 'meta_group') {
          return (
            <div
              key={`meta-${idx}`}
              className="my-1.5 grid grid-cols-1 sm:grid-cols-2 gap-1.5 p-2 rounded-xl bg-desa-bg/60 border border-desa-primary/10 text-[11px]"
            >
              {block.items.map((item, mIdx) => (
                <div key={`m-${mIdx}`} className="flex items-start gap-1.5 text-desa-text/80">
                  {item.type === 'hours' ? (
                    <Clock className="w-3.5 h-3.5 text-desa-accent shrink-0 mt-0.5" />
                  ) : (
                    <MapPin className="w-3.5 h-3.5 text-desa-highlight shrink-0 mt-0.5" />
                  )}
                  <span className="leading-snug">
                    {renderInlineFormatted(item.text, `meta-item-${mIdx}`)}
                  </span>
                </div>
              ))}
            </div>
          );
        }

        if (block.type === 'bullet') {
          return (
            <div key={`b-${idx}`} className="flex items-start gap-2 pl-1">
              <span className="w-1.5 h-1.5 rounded-full bg-desa-accent mt-1.5 shrink-0" />
              <div className="flex-1 leading-snug">
                {renderInlineFormatted(block.text, `b-${idx}`)}
              </div>
            </div>
          );
        }

        // Paragraph
        return (
          <p key={`p-${idx}`} className="text-desa-text/95">
            {renderInlineFormatted(block.text, `p-${idx}`)}
          </p>
        );
      })}
    </div>
  );
}
