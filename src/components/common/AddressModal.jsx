import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  MapPin, 
  Compass, 
  ExternalLink, 
  Check, 
  Navigation, 
  Home, 
  Building2, 
  Store 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KECAMATAN_LIST, KECAMATAN_LOCATIONS } from '../../data/mockData';
import LurikDivider from './LurikDivider';

export default function AddressModal() {
  const { 
    isAddressModalOpen, 
    setIsAddressModalOpen, 
    editingAddress, 
    setEditingAddress,
    saveAddress 
  } = useApp();

  const [formData, setFormData] = useState({
    label: 'Rumah Utama',
    receiverName: '',
    phone: '',
    kecamatan: 'Kecamatan Sumedang Utara',
    rtRw: 'RT 01 / RW 01',
    fullAddress: '',
    notes: '',
    lat: -6.8293742,
    lng: 107.9116474,
    isDefault: false
  });

  const [activeTab, setActiveTab] = useState('form');
  useEffect(() => {
    if (editingAddress) {
      setFormData(editingAddress);
    } else {
      setFormData({
        label: 'Rumah Utama',
        receiverName: '',
        phone: '',
        kecamatan: 'Kecamatan Sumedang Utara',
        rtRw: 'RT 01 / RW 01',
        fullAddress: '',
        notes: '',
        lat: -6.8293742,
        lng: 107.9116474,
        isDefault: false
      });
    }
  }, [editingAddress, isAddressModalOpen]);

  if (!isAddressModalOpen) return null;

  const handleKecamatanChange = (kecamatanName) => {
    const loc = KECAMATAN_LOCATIONS[kecamatanName] || KECAMATAN_LOCATIONS['Kecamatan Sumedang Utara'];
    setFormData(prev => ({
      ...prev,
      kecamatan: kecamatanName,
      lat: loc.lat,
      lng: loc.lng
    }));
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData(prev => ({
            ...prev,
            lat: Number(pos.coords.latitude.toFixed(5)),
            lng: Number(pos.coords.longitude.toFixed(5))
          }));
        },
        () => {
          // Use nearby coordinates when location access is unavailable.
          setFormData(prev => ({
            ...prev,
            lat: Number((-6.8293742).toFixed(7)),
            lng: Number((107.9116474).toFixed(7))
          }));
        }
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.receiverName || !formData.phone || !formData.fullAddress) {
      alert('Mohon lengkapi nama penerima, nomor telepon, dan alamat lengkap.');
      return;
    }
    saveAddress(formData);
  };

  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${formData.lat},${formData.lng}&hl=id&z=16&output=embed`;
  const googleMapsExternalUrl = `https://www.google.com/maps?q=${formData.lat},${formData.lng}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            setIsAddressModalOpen(false);
            setEditingAddress(null);
          }}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        />

        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-desa-bg rounded-3xl shadow-2xl overflow-hidden border border-desa-primary/20 z-10 flex flex-col max-h-[92vh]"
        >
          
          <div className="px-6 py-4 bg-desa-primary text-desa-light flex items-center justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-lurik-stripes-light opacity-10" />
            <div className="flex items-center gap-2.5 relative z-10">
              <div className="w-9 h-9 rounded-xl bg-desa-accent/30 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold">
                  {editingAddress ? 'Perbarui Alamat Pengiriman' : 'Tambah Alamat Baru'}
                </h3>
                <p className="text-xs text-desa-light/70">
                  Lengkapi data penerima dan tentukan titik Google Maps
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsAddressModalOpen(false);
                setEditingAddress(null);
              }}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-desa-light transition-colors relative z-10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <LurikDivider variant="accent" />

          
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
            
            <div>
              <label className="block text-xs font-semibold text-desa-primary mb-2">
                Label Alamat
              </label>
              <div className="flex gap-2">
                {[
                  { label: 'Rumah Utama', icon: Home },
                  { label: 'Kantor / Balai', icon: Building2 },
                  { label: 'Toko / Workshop', icon: Store }
                ].map(item => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setFormData({ ...formData, label: item.label })}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      formData.label === item.label
                        ? 'bg-desa-primary text-white border-desa-primary shadow-xs'
                        : 'bg-white text-desa-text/80 border-desa-primary/20 hover:border-desa-accent'
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-desa-primary mb-1">
                  Nama Penerima *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bambang Sudiro"
                  value={formData.receiverName}
                  onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-desa-primary/20 bg-white text-xs text-desa-text focus:outline-none focus:ring-2 focus:ring-desa-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-desa-primary mb-1">
                  Nomor Telepon / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 0813-9988-7766"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-desa-primary/20 bg-white text-xs text-desa-text focus:outline-none focus:ring-2 focus:ring-desa-accent"
                />
              </div>
            </div>

            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-desa-primary mb-1">
                  Kecamatan *
                </label>
                <select
                  value={formData.kecamatan}
                  onChange={(e) => handleKecamatanChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-desa-primary/20 bg-white text-xs text-desa-text focus:outline-none focus:ring-2 focus:ring-desa-accent"
                >
                  {KECAMATAN_LIST.filter(d => d !== 'Semua Kecamatan').map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-desa-primary mb-1">
                  RT / RW
                </label>
                <input
                  type="text"
                  placeholder="Contoh: RT 03 / RW 01"
                  value={formData.rtRw}
                  onChange={(e) => setFormData({ ...formData, rtRw: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-desa-primary/20 bg-white text-xs text-desa-text focus:outline-none focus:ring-2 focus:ring-desa-accent"
                />
              </div>
            </div>

            
            <div>
              <label className="block text-xs font-semibold text-desa-primary mb-1">
                Alamat Lengkap (Nama Jalan, No. Rumah) *
              </label>
              <textarea
                required
                rows={2}
                placeholder="Nama jalan, nomor rumah, kecamatan, Kabupaten Sumedang"
                value={formData.fullAddress}
                onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-desa-primary/20 bg-white text-xs text-desa-text focus:outline-none focus:ring-2 focus:ring-desa-accent"
              />
            </div>

            
            <div>
              <label className="block text-xs font-semibold text-desa-primary mb-1">
                Patokan Rumah / Catatan Pengiriman untuk Kurir Desa
              </label>
              <input
                type="text"
                placeholder="Contoh: Depan gapura bambu ukir khas desa, pagar cat cokelat kayu"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-desa-primary/20 bg-white text-xs text-desa-text focus:outline-none focus:ring-2 focus:ring-desa-accent"
              />
            </div>

            
            <div className="pt-2 border-t border-desa-primary/10">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-desa-accent" />
                  <span className="text-xs font-bold text-desa-primary">
                    Peta Titik Lokasi Google Maps
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-desa-primary/10 hover:bg-desa-primary/20 text-desa-primary text-[11px] font-semibold transition-colors"
                  >
                    <Compass className="w-3.5 h-3.5 text-desa-accent" />
                    <span>Pin Lokasi Saya</span>
                  </button>

                  <a
                    href={googleMapsExternalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-desa-accent text-white hover:bg-desa-accent/90 text-[11px] font-semibold transition-colors"
                  >
                    <span>Buka Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              
              <div className="flex flex-wrap items-center gap-1.5 mb-3">
                <span className="text-[11px] font-medium text-desa-text/70 mr-1">Preset kecamatan:</span>
                {Object.keys(KECAMATAN_LOCATIONS).map((kecamatanKey) => {
                  const loc = KECAMATAN_LOCATIONS[kecamatanKey];
                  const isSelected = formData.lat === loc.lat && formData.lng === loc.lng;
                  return (
                    <button
                      key={kecamatanKey}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          kecamatan: kecamatanKey,
                          lat: loc.lat,
                          lng: loc.lng
                        }));
                      }}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all ${
                        isSelected
                          ? 'bg-desa-accent text-white shadow-xs'
                          : 'bg-white border border-desa-primary/15 text-desa-text hover:border-desa-accent'
                      }`}
                    >
                      {loc.name.split(' (')[0]}
                    </button>
                  );
                })}
              </div>

              
              <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-desa-primary/20 shadow-inner bg-desa-primary/5">
                <iframe
                  title="Pratinjau Google Maps Alamat"
                  src={googleMapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen=""
                  className="w-full h-full"
                />

                
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-desa-primary/10 text-[10px] text-desa-primary font-semibold shadow-xs flex items-center gap-1.5 pointer-events-none">
                  <span className="w-2 h-2 rounded-full bg-desa-accent" />
                  <span>Google Maps: {formData.lat}, {formData.lng}</span>
                </div>
              </div>

              
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div>
                  <span className="text-[10px] text-desa-text/60">Latitude (Garis Lintang):</span>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-desa-primary/20 bg-white"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-desa-text/60">Longitude (Garis Bujur):</span>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.lng}
                    onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-desa-primary/20 bg-white"
                  />
                </div>
              </div>
            </div>

            
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="w-4 h-4 rounded text-desa-accent focus:ring-desa-accent border-desa-primary/30"
              />
              <label htmlFor="isDefault" className="text-xs font-medium text-desa-text cursor-pointer">
                Jadikan sebagai alamat pengiriman utama untuk checkout
              </label>
            </div>

            
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-desa-primary/10">
              <button
                type="button"
                onClick={() => {
                  setIsAddressModalOpen(false);
                  setEditingAddress(null);
                }}
                className="px-5 py-2.5 rounded-xl border border-desa-primary/20 text-xs font-semibold text-desa-primary hover:bg-white transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-desa-primary text-desa-light text-xs font-bold hover:bg-desa-accent transition-all shadow-md flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Alamat</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

