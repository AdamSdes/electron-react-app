import React, { useState } from 'react';
import { useToast } from '../ui/toast';
import Modal from '../ui/modal';
import { Button } from '../ui/button';

interface Mod {
  id: number;
  name: string;
  description: string;
  lastUpdate: string;
  version: string;
  size: string;
  isUpdating: boolean;
  isInstalled: boolean;
}

interface ModsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModsModal: React.FC<ModsModalProps> = ({ isOpen, onClose }) => {
  const { addToast } = useToast();
  const [mods, setMods] = useState<Mod[]>([
    {
      id: 1,
      name: 'Anomaly Enhancement Pack',
      description: 'Улучшенные эффекты аномалий и более реалистичное поведение',
      lastUpdate: '15.01.2025',
      version: 'v2.1.3',
      size: '145 МБ',
      isUpdating: false,
      isInstalled: true
    },
    {
      id: 2,
      name: 'Weapon Rebalance Mod',
      description: 'Перебалансировка оружия для более реалистичного геймплея',
      lastUpdate: '12.01.2025',
      version: 'v1.8.2',
      size: '89 МБ',
      isUpdating: false,
      isInstalled: true
    },
    {
      id: 3,
      name: 'Graphics Overhaul',
      description: 'Улучшенная графика и визуальные эффекты',
      lastUpdate: '08.01.2025',
      version: 'v3.0.1',
      size: '512 МБ',
      isUpdating: false,
      isInstalled: false
    },
    {
      id: 4,
      name: 'Sound Enhancement',
      description: 'Улучшенные звуковые эффекты и атмосферные звуки',
      lastUpdate: '05.01.2025',
      version: 'v1.4.7',
      size: '256 МБ',
      isUpdating: false,
      isInstalled: true
    }
  ]);

  const handleUpdateMod = (modId: number) => {
    const mod = mods.find(m => m.id === modId);
    if (!mod) return;

    if (mod.isInstalled) {
      addToast({ type: 'info', title: `Обновление мода "${mod.name}"...` });
    } else {
      addToast({ type: 'info', title: `Установка мода "${mod.name}"...` });
    }

    setMods(prevMods => 
      prevMods.map(mod => 
        mod.id === modId 
          ? { ...mod, isUpdating: true }
          : mod
      )
    );

    // Simulate update process
    setTimeout(() => {
      setMods(prevMods => 
        prevMods.map(mod => 
          mod.id === modId 
            ? { 
                ...mod, 
                isUpdating: false, 
                lastUpdate: new Date().toLocaleDateString('ru-RU'),
                isInstalled: true
              }
            : mod
        )
      );

      const modName = mods.find(m => m.id === modId)?.name;
      if (modName) {
        addToast({ type: 'success', title: `Мод "${modName}" успешно установлен!` });
      }
    }, 3000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Управление модами">
      <div className="flex flex-col h-[500px]">
        <div className="bg-white/5 border-b border-white/10 p-[8px]">
          <div className="grid grid-cols-[1fr_120px_80px_100px_60px] gap-[8px] items-center text-[11px] text-white/60 font-medium">
            <div>Название</div>
            <div>Статус</div>
            <div>Размер</div>
            <div>Обновлено</div>
            <div></div>
          </div>
        </div>
        
        <div className="overflow-hidden flex-1">
          <div className="overflow-y-auto h-full">
            {mods.map((mod, index) => (
              <div 
                key={mod.id}
                className="hover:bg-white/5 border-b border-white/5 transition-colors relative p-[12px] last:border-b-0"
              >
                <div className="grid grid-cols-[1fr_120px_80px_100px_60px] gap-[8px] items-center">
                  {/* Name */}
                  <div className="flex flex-col">
                    <button className="text-white text-[14px] font-medium text-left hover:underline">
                      {mod.name}
                    </button>
                    <span className="text-white/60 text-[11px]">{mod.description}</span>
                  </div>
                  
                  {/* Status */}
                  <div>
                    <span className={`inline-flex items-center justify-center rounded-md border py-1 px-2 text-[10px] font-medium whitespace-nowrap gap-1 transition-all ${
                      mod.isInstalled 
                        ? 'border-green-500/20 bg-green-500/10 text-green-400'
                        : 'border-white/20 bg-white/5 text-white/60'
                    }`}>
                      {mod.isUpdating && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                          <path d="M12 6l0 -3"/>
                          <path d="M16.25 7.75l2.15 -2.15"/>
                          <path d="M18 12l3 0"/>
                          <path d="M16.25 16.25l2.15 2.15"/>
                          <path d="M12 18l0 3"/>
                          <path d="M7.75 16.25l-2.15 2.15"/>
                          <path d="M6 12l-3 0"/>
                          <path d="M7.75 7.75l-2.15 -2.15"/>
                        </svg>
                      )}
                      {mod.isUpdating ? 'Обновляется' : mod.isInstalled ? 'Установлен' : 'Не установлен'}
                    </span>
                  </div>
                  
                  {/* Size */}
                  <div className="text-white/60 text-[12px]">
                    {mod.size}
                  </div>
                  
                  {/* Last Update */}
                  <div className="text-white/60 text-[12px]">
                    {mod.lastUpdate}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-center">
                    <button 
                      onClick={() => handleUpdateMod(mod.id)}
                      disabled={mod.isUpdating}
                      className={`size-8 rounded-md transition-all flex items-center justify-center ${
                        mod.isUpdating 
                          ? 'bg-white/10 text-white/40 cursor-not-allowed'
                          : 'hover:bg-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={mod.isUpdating ? 'animate-spin' : ''}>
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                        <path d="M21 3v5h-5"/>
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                        <path d="M3 21v-5h5"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-[16px] bg-white/5 border-t border-white/10 flex-shrink-0 sticky bottom-0">
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-white/60">Общий размер установленных модов:</span>
            <span className="text-white font-medium">490 МБ</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModsModal;
