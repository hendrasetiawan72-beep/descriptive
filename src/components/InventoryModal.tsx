import React from 'react';
import { InventoryItem } from '../types/game';
import { sound } from '../utils/audio';
import { Briefcase, X } from 'lucide-react';

interface InventoryModalProps {
  items: InventoryItem[];
  onClose: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({ items, onClose }) => {
  const [selectedItem, setSelectedItem] = React.useState<InventoryItem | null>(
    items.length > 0 ? items[0] : null
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#F7F4EB]/90 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-retro-dots">
      <div className="w-full max-w-xl bg-[#FFFDF9] border-3 border-[#2B2D42] shadow-[5px_5px_0_0_#2B2D42] rounded-3xl p-5 sm:p-6 text-[#2B2D42] my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#2B2D42]/20 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FFD8BE] border border-[#2B2D42] flex items-center justify-center text-[#78290F] shadow-[1.5px_1.5px_0_0_#2B2D42]">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-[#2B2D42]">
                Inventaris & Bukti Penyelidikan
              </h3>
              <p className="text-[11px] text-[#6C757D] font-medium">
                {items.length} item & kosakata terkumpul
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playInteract();
              onClose();
            }}
            className="p-1 rounded-lg hover:bg-[#F0ECE1] text-[#2B2D42]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="py-10 text-center text-[#6C757D]">
            <Briefcase className="w-10 h-10 mx-auto mb-2 opacity-40 text-[#2B2D42]" />
            <p className="text-xs sm:text-sm font-bold">Inventaris masih kosong.</p>
            <p className="text-[11px] text-[#4A4E69] mt-0.5 font-medium">
              Ketuk dan amati peralatan di laboratorium untuk mengumpulkan kartu kosakata dan petunjuk!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Items List */}
            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      sound.playInteract();
                      setSelectedItem(item);
                    }}
                    className={`w-full p-2.5 rounded-xl border-1.5 text-left flex items-center gap-2.5 transition-all ${
                      isSelected
                        ? 'border-[#2B2D42] bg-[#FFF3B0] shadow-[2px_2px_0_0_#2B2D42]'
                        : 'border-[#2B2D42]/30 bg-[#FFFDF9] hover:bg-[#F7F4EB]'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#FFFDF9] border border-[#2B2D42] flex items-center justify-center text-base shrink-0 shadow-xs">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-xs text-[#2B2D42] truncate">{item.name}</h4>
                        <span className="text-[9px] uppercase font-mono font-bold text-[#6C757D]">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#4A4E69] truncate font-medium">{item.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Item Detail Panel */}
            {selectedItem && (
              <div className="bg-[#EFF7F6] border-2 border-[#2B2D42] rounded-2xl p-3.5 flex flex-col justify-between shadow-[2px_2px_0_0_#2B2D42]">
                <div>
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#FFFDF9] border-1.5 border-[#2B2D42] flex items-center justify-center text-xl shadow-xs">
                      {selectedItem.icon}
                    </div>
                    <div>
                      <span className="text-[9px] font-mono uppercase font-bold text-[#1B4332] tracking-wider block">
                        {selectedItem.category}
                      </span>
                      <h4 className="font-extrabold text-xs sm:text-sm text-[#2B2D42] leading-tight">
                        {selectedItem.name}
                      </h4>
                    </div>
                  </div>

                  <div className="bg-[#FFFDF9] p-2.5 rounded-xl border border-[#2B2D42]/30 text-[11px] text-[#4A4E69] leading-relaxed font-medium">
                    {selectedItem.description}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-[#2B2D42]/20 text-[10px] text-[#6C757D] font-bold flex items-center justify-between">
                  <span>SMK Muhammadiyah Bawang</span>
                  <span className="text-[#E07A5F]">Bukti Expo 2026</span>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 pt-3 border-t-2 border-[#2B2D42]/20 flex justify-end">
          <button
            onClick={() => {
              sound.playInteract();
              onClose();
            }}
            className="px-4 py-1.5 bg-[#FFD166] hover:bg-[#FFC024] text-[#2B2D42] font-black rounded-xl text-xs postmodern-btn"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
