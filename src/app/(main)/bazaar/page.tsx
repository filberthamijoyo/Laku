'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { MapPin, Calendar, Info, QrCode, ArrowRight, Clock } from 'lucide-react';
import { upcomingBazaarsOnly, liveBazaars, bazaarData } from '@/lib/bazaar-data';

// Format date
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

// Calculate days until bazaar
const getDaysUntil = (dateStr: string) => {
  const today = new Date();
  const bazaarDate = new Date(dateStr);
  const diffTime = bazaarDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export default function BazaarPage() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [showQRScanner, setShowQRScanner] = useState(false);

  // Get unique locations
  const allBazaars = [...liveBazaars, ...upcomingBazaarsOnly];
  const locations = ['all', ...new Set(allBazaars.map(b => b.location))];
  
  // Filter bazaars by location
  const filteredBazaars = selectedLocation === 'all' 
    ? allBazaars 
    : allBazaars.filter(b => b.location === selectedLocation);

  // Handle QR scan (mock)
  const handleQRScan = (code: string) => {
    // In real app, parse QR code to get bazaar ID
    // For demo, redirect to first bazaar
    if (bazaarData[code]) {
      router.push(`/bazaar/${code}`);
    } else {
      // Mock: redirect to Jakarta Fashion Week
      router.push('/bazaar/jakarta-fashion-week-2026');
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#ff2742] to-pink-500 text-white p-4 pt-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Bazaar</h1>
            <p className="text-white/80 text-sm mt-1">Discover fashion events near you</p>
          </div>
          <button 
            onClick={() => setShowQRScanner(true)}
            className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-colors"
          >
            <QrCode className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Location Filter */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {locations.map(loc => (
            <button
              key={loc}
              onClick={() => setSelectedLocation(loc)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedLocation === loc
                  ? 'bg-[#ff2742] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {loc === 'all' ? 'All Locations' : loc}
            </button>
          ))}
        </div>
      </div>

      {/* Live Now Section */}
      {liveBazaars.length > 0 && selectedLocation === 'all' && (
        <div className="px-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-bold text-red-600">Happening Now</span>
          </div>
          <div className="space-y-3">
            {liveBazaars.map(bazaar => {
              const color1 = bazaar.color1 || '#ff2742';
              const color2 = bazaar.color2 || '#ff2742';
              
              return (
                <div 
                  key={bazaar.id}
                  className="rounded-3xl overflow-hidden cursor-pointer relative"
                  style={{
                    background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
                  }}
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${bazaar.image})`, opacity: 0.3 }}
                  />
                  <div 
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(180deg, ${color1}dd 0%, ${color1}ee 100%)` }}
                  />
                  
                  <div className="relative z-10 p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="text-[10px] text-white/50 font-bold tracking-wider mb-1.5">
                          LIVE · ENDS IN {bazaar.endsIn?.toUpperCase()}
                        </div>
                        <h3 className="text-xl font-black text-white leading-tight">{bazaar.name}</h3>
                        <p className="text-xs text-white/60 mt-1 pt-1.5 pb-1.5">{bazaar.address}</p>
                      </div>
                      <div className="bg-white/20 rounded-xl px-3 py-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold text-white">LIVE</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 mb-3.5">
                      <div className="text-center">
                        <div className="text-base font-black text-white">{bazaar.stores}</div>
                        <div className="text-[12px] text-white/50">Stores</div>
                      </div>
                      <div className="text-center">
                        <div className="text-base font-black text-white">{bazaar.attendees}</div>
                        <div className="text-[12px] text-white/50">There now</div>
                      </div>
                      <div className="text-center">
                        <div className="text-base font-bold text-white mt-0.5">{bazaar.vibe}</div>
                        <div className="text-[12px] text-white/50">Crowd</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-1.5 flex-wrap mb-3.5">
                      {bazaar.tags?.map(tag => (
                        <span 
                          key={tag} 
                          className="bg-white/12 text-white/85 text-[12px] font-semibold px-2 py-1 rounded-lg"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <div className="flex-1 bg-white/20 rounded-xl py-2.5 text-center">
                        <span className="text-xs font-bold text-white">🗺️ Map</span>
                      </div>
                      <div 
                        className="flex-1 bg-white rounded-xl py-2.5 text-center cursor-pointer"
                        onClick={() => router.push(`/bazaar/${bazaar.id}`)}
                      >
                        <span className="text-xs font-bold" style={{ color: color1 }}>View →</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bazaar List */}
      <div className="p-4 space-y-4">
        {filteredBazaars.map(bazaar => {
          const daysUntil = getDaysUntil(bazaar.startDate);
          const color1 = bazaar.color1 || '#ff2742';
          const color2 = bazaar.color2 || '#ff2742';
          
          return (
            <div 
              key={bazaar.id} 
              className="rounded-3xl overflow-hidden cursor-pointer relative"
              style={{
                background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
              }}
            >
              {/* Background Image with Overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${bazaar.image})`, opacity: 0.3 }}
              />
              <div 
                className="absolute inset-0"
                style={{ background: `linear-gradient(180deg, ${color1}dd 0%, ${color1}ee 100%)` }}
              />

              {/* Card Content */}
              <div className="relative z-10 p-5">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-black text-white leading-tight">{bazaar.name}</h3>
                    {bazaar.caption && (
                      <p className="text-xs text-white mt-2 italic">{bazaar.caption}</p>
                    )}
                    <p className="text-xs text-white/60 mt-2 pt-1.5 pb-1.5">{bazaar.address}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-4 mb-3.5">
                  <div className="text-center">
                    <div className="text-base font-black text-white">{bazaar.stores}</div>
                    <div className="text-[12px] text-white/50">Stores</div>
                  </div>
                  <div className="text-center">
                    <div className="text-base font-black text-white">{bazaar.predicted || 'TBD'}</div>
                    <div className="text-[12px] text-white/50">Expected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-base font-black text-white">{bazaar.daysLeft || daysUntil}</div>
                    <div className="text-[12px] text-white/50">Days left</div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex gap-1.5 flex-wrap mb-4">
                  {bazaar.tags?.map(tag => (
                    <span 
                      key={tag} 
                      className="bg-white/12 text-white/85 text-[12px] font-semibold px-2 py-1 rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2.5">
                  <div className="flex-1 bg-white/20 rounded-xl py-2.5 text-center">
                    <span className="text-xs font-bold text-white">🔔 Notify Me</span>
                  </div>
                  <div 
                    className="flex-1 bg-white rounded-xl py-2.5 text-center cursor-pointer"
                    onClick={() => router.push(`/bazaar/${bazaar.id}`)}
                  >
                    <span className="text-xs font-bold" style={{ color: color1 }}>View →</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {filteredBazaars.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No upcoming bazaars in this location</p>
          </div>
        )}
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowQRScanner(false)} />
          <div className="relative bg-white rounded-2xl p-6 m-4 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Scan Bazaar Ticket</h3>
            <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center mb-4">
              <QrCode className="w-24 h-24 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 text-center mb-4">
              Point your camera at the QR code on your bazaar ticket
            </p>
            {/* Mock: simulate scan */}
            <button
              onClick={() => {
                setShowQRScanner(false);
                handleQRScan('jakarta-fashion-week-2026');
              }}
              className="w-full bg-[#ff2742] text-white py-3 rounded-lg font-medium"
            >
              Simulate QR Scan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
