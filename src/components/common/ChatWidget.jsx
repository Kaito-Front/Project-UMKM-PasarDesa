import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  Store, 
  ShieldCheck, 
  ChevronRight, 
  HelpCircle, 
  AlertCircle,
  PackageCheck,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import LurikDivider from './LurikDivider';

export default function ChatWidget() {
  const { 
    isChatOpen, 
    setIsChatOpen, 
    activeChatShopId, 
    setActiveChatShopId,
    chatContextProduct, 
    setChatContextProduct,
    chatThreads, 
    sendChatMessage, 
    connectToShopFromBot,
    isConnectingSeller,
    shops,
    viewProduct
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [showShopSelector, setShowShopSelector] = useState(false);
  const messagesEndRef = useRef(null);
  const currentShop = activeChatShopId !== 'general-bot' 
    ? shops.find(s => s.id === activeChatShopId) || shops[0]
    : null;

  const currentMessages = chatThreads[activeChatShopId] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [currentMessages, isChatOpen]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputMessage.trim()) return;
    sendChatMessage(inputMessage);
    setInputMessage('');
  };

  const handleQuickOptionClick = (optionText) => {
    if (optionText === 'Hubungkan ke Admin Toko') {
      setShowShopSelector(true);
      return;
    }
    if (optionText === 'Cek Ketersediaan Stok') {
      if (chatContextProduct) {
        sendChatMessage(`Apakah stok produk "${chatContextProduct.name}" masih tersedia?`);
      } else {
        sendChatMessage('Bagaimana cara cek ketersediaan stok barang di toko?');
      }
      return;
    }
    if (optionText === 'Komplain atau Bantuan Pesanan') {
      sendChatMessage('Saya ingin mengajukan komplain terkait pesanan saya.');
      return;
    }
    if (optionText === 'Tanya Ongkir & Kurir Sumedang') {
      sendChatMessage('Berapa tarif ongkir kurir desa antar kecamatan?');
      return;
    }

    sendChatMessage(optionText);
  };

  return (
    <>
      
      {!isChatOpen && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2"
        >
          <div className="hidden md:flex items-center gap-2 bg-desa-primary text-desa-light px-3.5 py-1.5 rounded-full shadow-lg border border-white/20 text-xs animate-bounce">
            <span className="w-2 h-2 rounded-full bg-desa-highlight animate-ping" />
            <span>Chat Asisten Desa & Toko</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsChatOpen(true)}
            className="w-14 h-14 rounded-2xl bg-desa-accent text-white shadow-xl flex items-center justify-center relative overflow-hidden group border-2 border-white/40"
            aria-label="Buka Chatbox Desa"
          >
            
            <div className="absolute inset-0 bg-lurik-stripes-light opacity-20" />
            <MessageSquare className="w-6 h-6 text-white relative z-10 group-hover:scale-110 transition-transform" />
            <span className="absolute top-2 right-2 w-3 h-3 bg-desa-highlight rounded-full border-2 border-white" />
          </motion.button>
        </motion.div>
      )}

      
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[400px] h-[580px] max-h-[85vh] bg-desa-bg rounded-3xl shadow-2xl border border-desa-primary/20 z-50 flex flex-col overflow-hidden"
          >
            
            <div className="p-4 bg-desa-primary text-desa-light relative overflow-hidden">
              <div className="absolute inset-0 bg-lurik-stripes-light opacity-10" />

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {activeChatShopId === 'general-bot' ? (
                      <div className="w-10 h-10 rounded-xl bg-desa-accent/30 flex items-center justify-center text-white border border-white/20">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    ) : (
                      <img
                        src={currentShop?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'}
                        alt={currentShop?.name}
                        className="w-10 h-10 rounded-xl object-cover border border-white/30"
                      />
                    )}
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-desa-highlight rounded-full border-2 border-desa-primary" />
                  </div>

                  <div>
                    <h4 className="font-heading text-sm font-bold truncate max-w-[200px]">
                      {activeChatShopId === 'general-bot' ? 'Asisten Virtual Desa' : currentShop?.name}
                    </h4>
                    <p className="text-[11px] text-desa-light/70 truncate max-w-[200px]">
                      {activeChatShopId === 'general-bot' 
                        ? 'Bot Layanan & Informasi Warga' 
                        : `Admin: ${currentShop?.owner} (${currentShop?.kecamatan.split(' (')[0]})`}
                    </p>
                  </div>
                </div>

                
                <div className="flex items-center gap-1.5 relative z-10">
                  {activeChatShopId !== 'general-bot' ? (
                    <button
                      onClick={() => setActiveChatShopId('general-bot')}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-semibold text-desa-light transition-colors"
                      title="Kembali ke Asisten Bot Desa"
                    >
                      Ke Bot Desa
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowShopSelector(!showShopSelector)}
                      className="px-2.5 py-1 rounded-lg bg-desa-accent text-white hover:bg-desa-accent/90 text-[10px] font-semibold transition-colors"
                      title="Pilih Toko untuk Chat Admin"
                    >
                      Pilih Toko
                    </button>
                  )}

                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-desa-light transition-colors"
                    aria-label="Tutup Obrolan"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <LurikDivider variant="accent" />

            
            <AnimatePresence>
              {showShopSelector && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white border-b border-desa-primary/10 p-3 shadow-md z-20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-desa-primary uppercase">
                      Pilih Admin Toko Katalog:
                    </span>
                    <button
                      onClick={() => setShowShopSelector(false)}
                      className="text-desa-text/50 hover:text-desa-primary text-xs"
                    >
                      Tutup
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {shops.map(s => (
                      <button
                        key={s.id}
                        onClick={() => {
                          connectToShopFromBot(s.id);
                          setShowShopSelector(false);
                        }}
                        className="w-full text-left p-2 rounded-xl border border-desa-primary/10 hover:border-desa-accent/40 bg-desa-bg/30 hover:bg-white flex items-center justify-between text-xs transition-colors"
                      >
                        <div className="truncate">
                          <p className="font-semibold text-desa-primary truncate">{s.name}</p>
                          <p className="text-[10px] text-desa-text/60 truncate">{s.owner} • {s.kecamatan}</p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-desa-accent shrink-0" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            
            {chatContextProduct && (
              <div className="bg-white px-3.5 py-2.5 border-b border-desa-primary/10 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={chatContextProduct.images?.[0] || 'https://images.unsplash.com/photo-1606744888344-498238f01769?auto=format&fit=crop&w=200&q=80'}
                    alt={chatContextProduct.name}
                    className="w-9 h-9 rounded-lg object-cover border border-desa-primary/10 shrink-0"
                  />
                  <div className="truncate">
                    <span className="text-[10px] text-desa-accent font-semibold block uppercase tracking-wider">
                      Produk yang Ditanyakan:
                    </span>
                    <h5 className="text-xs font-bold text-desa-primary truncate">
                      {chatContextProduct.name}
                    </h5>
                    <span className="text-[11px] font-semibold text-desa-text/70">
                      Rp {chatContextProduct.price.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setChatContextProduct(null)}
                  className="text-desa-text/40 hover:text-desa-text p-1 shrink-0"
                  title="Hapus lampiran produk"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              
              {isConnectingSeller && (
                <div className="text-center py-2">
                  <span className="text-[11px] bg-desa-primary/10 text-desa-primary font-medium px-3 py-1 rounded-full animate-pulse">
                    Menghubungkan ke Admin Toko...
                  </span>
                </div>
              )}

              
              {currentMessages.map((msg) => {
                const isUser = msg.sender === 'user';
                const isBot = msg.sender === 'bot';
                const isSeller = msg.sender === 'seller';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    
                    {!isUser && (
                      <span className="text-[10px] font-semibold text-desa-text/60 mb-1 ml-1">
                        {isBot ? 'Asisten Virtual Desa' : `${msg.senderName || 'Admin Toko'}`}
                      </span>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-xs leading-relaxed ${
                        isUser
                          ? 'bg-desa-accent text-white rounded-br-xs'
                          : isSeller
                          ? 'bg-white border border-desa-accent/30 text-desa-primary rounded-bl-xs'
                          : 'bg-white border border-desa-primary/10 text-desa-primary rounded-bl-xs'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span
                        className={`text-[9px] block text-right mt-1 ${
                          isUser ? 'text-white/70' : 'text-desa-text/50'
                        }`}
                      >
                        {msg.time}
                      </span>
                    </div>

                    
                    {msg.quickOptions && msg.quickOptions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                        {msg.quickOptions.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => handleQuickOptionClick(opt)}
                            className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white border border-desa-accent/40 text-desa-accent hover:bg-desa-accent hover:text-white transition-all shadow-xs"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>

            
            <div className="px-3 py-1.5 bg-white/70 border-t border-desa-primary/5 flex items-center gap-1.5 overflow-x-auto text-[10px] no-scrollbar">
              <button
                type="button"
                onClick={() => handleQuickOptionClick('Cek Ketersediaan Stok')}
                className="px-2.5 py-1 rounded-md bg-desa-primary/5 text-desa-primary hover:bg-desa-primary/10 font-medium shrink-0"
              >
                Cek Stok Barang
              </button>
              <button
                type="button"
                onClick={() => handleQuickOptionClick('Tanya Ongkir & Kurir Sumedang')}
                className="px-2.5 py-1 rounded-md bg-desa-primary/5 text-desa-primary hover:bg-desa-primary/10 font-medium shrink-0"
              >
                Tarif Kurir Desa
              </button>
              <button
                type="button"
                onClick={() => handleQuickOptionClick('Komplain atau Bantuan Pesanan')}
                className="px-2.5 py-1 rounded-md bg-desa-primary/5 text-desa-primary hover:bg-desa-primary/10 font-medium shrink-0"
              >
                Komplain Pesanan
              </button>
              {activeChatShopId === 'general-bot' && (
                <button
                  type="button"
                  onClick={() => setShowShopSelector(true)}
                  className="px-2.5 py-1 rounded-md bg-desa-accent/15 text-desa-accent hover:bg-desa-accent/25 font-bold shrink-0"
                >
                  Hubungkan Admin Toko
                </button>
              )}
            </div>

            
            <form
              onSubmit={handleSend}
              className="p-3 bg-white border-t border-desa-primary/10 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder={
                  activeChatShopId === 'general-bot'
                    ? 'Tanya bot atau minta hubungkan ke toko...'
                    : `Tulis pesan ke admin ${currentShop?.name || 'toko'}...`
                }
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-desa-primary/20 bg-desa-bg/30 text-desa-text focus:outline-none focus:ring-1 focus:ring-desa-accent"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="w-10 h-10 rounded-xl bg-desa-accent text-white flex items-center justify-center hover:bg-desa-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shrink-0"
                aria-label="Kirim Pesan"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

