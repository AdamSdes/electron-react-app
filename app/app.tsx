import React, { useState, useEffect } from 'react';
import Navbar from './components/features/navbar';
import News from './components/features/news';
import ServerList from './components/features/serverlist';
import ModsModal from './components/features/mods-modal';
import { ToastProvider, useToast } from './components/ui/toast';
import { serverApi } from './services/serverApi';

const AppContent = () => {
  const [isModsModalOpen, setIsModsModalOpen] = useState(false);
  const [playButtonState, setPlayButtonState] = useState<'idle' | 'checking' | 'downloading'>('idle');
  const [progress, setProgress] = useState(0);
  const [nickname, setNickname] = useState('');
  const [selectedServerId, setSelectedServerId] = useState<number | null>(null);
  const [serverStats, setServerStats] = useState({ onlinePlayers: 0, queueSize: 0 });
  const [nicknameError, setNicknameError] = useState('');
  const { addToast } = useToast();

  // Fetch server stats for the top display
  const fetchServerStats = async () => {
    try {
      const statusData = await serverApi.getServerStatus();
      setServerStats({
        onlinePlayers: statusData.onlinePlayers,
        queueSize: statusData.queueSize
      });
    } catch (error) {
      console.error('Failed to fetch server stats:', error);
      // Keep default values on error
    }
  };

  useEffect(() => {
    fetchServerStats();
    // Refresh every 30 seconds
    const interval = setInterval(fetchServerStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleModsClick = () => {
    setIsModsModalOpen(true);
  };

  const handleCloseModsModal = () => {
    setIsModsModalOpen(false);
  };

  const handlePlayClick = () => {
    if (playButtonState !== 'idle') return;
    
    // Check if nickname is entered
    if (!nickname.trim()) {
      setNicknameError('Вы не ввели ник');
      return;
    }

    // Clear nickname error if validation passes
    setNicknameError('');

    // Start checking files
    setPlayButtonState('checking');
    setProgress(0);

    // Simulate checking process
    const checkingInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(checkingInterval);
          
          // Start downloading after checking
          setTimeout(() => {
            setPlayButtonState('downloading');
            setProgress(0);
            
            // Simulate downloading process
            const downloadInterval = setInterval(() => {
              setProgress(prev => {
                const newProgress = prev + 5;
                if (newProgress >= 100) {
                  clearInterval(downloadInterval);
                  
                  // Reset to idle after completion
                  setTimeout(() => {
                    setPlayButtonState('idle');
                    setProgress(0);
                  }, 500);
                }
                return newProgress;
              });
            }, 100);
          }, 500);
        }
        return newProgress;
      });
    }, 100);
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    // Clear error when user starts typing
    if (nicknameError) {
      setNicknameError('');
    }
  };

  const getButtonText = () => {
    switch (playButtonState) {
      case 'checking':
        return 'Проверка файлов...';
      case 'downloading':
        return 'Загрузка файлов...';
      default:
        return 'Играть';
    }
  };

  const isPlayDisabled = playButtonState !== 'idle';

  return (
    <div className="app-container overflow-hidden relative">   
      {/* Dynamic blob effects covering top half */}
      <div className="absolute top-0 left-0 right-0 h-[320px] opacity-40 overflow-hidden">
        <div className="absolute top-[-60px] left-[-60px] w-[220px] h-[220px] bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl blob-float"></div>
        <div className="absolute top-[-40px] right-[-40px] w-[160px] h-[160px] bg-gradient-to-r from-purple-400/25 to-pink-400/25 rounded-full blur-2xl blob-pulse"></div>
        <div className="absolute top-[100px] left-[60%] w-[190px] h-[190px] bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl blob-drift"></div>
        <div className="absolute top-[50px] left-[30%] w-[120px] h-[120px] bg-gradient-to-r from-orange-400/15 to-yellow-400/15 rounded-full blur-xl animate-pulse" style={{ animationDuration: '3s' }}></div>
        <div className="absolute top-[150px] right-[20%] w-[140px] h-[140px] bg-gradient-to-r from-rose-400/20 to-violet-400/20 rounded-full blur-2xl blob-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      {/* Brighter gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-[320px] bg-gradient-to-b from-white/[0.12] via-white/[0.06] to-transparent"></div>
      <div className="absolute top-0 left-0 right-0 h-[320px] bg-gradient-to-r from-blue-400/[0.04] via-purple-400/[0.03] to-pink-400/[0.04]"></div>
      
      {/* Smooth transition to background */}
      <div className="absolute top-[250px] left-0 right-0 h-[120px] bg-gradient-to-b from-transparent via-[#060606]/100 to-[#060606]"></div>
      
      <div className="relative z-10">
        <Navbar />
        <div className='container w-full h-[1px] bg-white/5'></div>
        <div className='container pt-[25px] pb-[25px] items-center flex gap-[24px] overflow-hidden' >
          <News />  
          <div className='h-[471px] w-[2px] bg-white/5'></div>
          <div className='w-full flex flex-col  gap-[20px]'>
            <div className='bg-white/2 h-[45px] border border-white/5 rounded-full px-[13px] flex items-center justify-between'>
              <p className='text-white/70'>В зоне <span className='text-[#DDA932]'>{serverStats.onlinePlayers}</span> сталкеров</p>
              <p className='px-[10px] py-[5px] rounded-full bg-white/5 text-white/60'>+{serverStats.queueSize}</p>
            </div>
            <ServerList selectedServerId={selectedServerId} onServerSelect={setSelectedServerId} />
            <div className='w-full h-[1px] bg-white/5'></div>
            <div className="relative">
              <input 
                placeholder='Введите ник' 
                value={nickname}
                onChange={handleNicknameChange}
                className={`h-[50px] outline-none focus:border-white/10 text-white px-[15px] border rounded-[12px] hover:bg-white/2 transition-all duration-300 w-full ${
                  nicknameError 
                    ? 'border-[#C44D56]/10 bg-[#C44D56]/5 placeholder-red-400' 
                    : 'border-white/5'
                }`}
                type="text" 
              />
              {nicknameError && (
                <span className="absolute right-[15px] top-1/2 transform -translate-y-1/2 text-red-400 text-[12px]">
                  {nicknameError}
                </span>
              )}
            </div>
            <div className='flex gap-[10px]'>
              <button 
                onClick={handleModsClick}
                className='px-5 h-[50px] bg-white/5 border border-white/5 rounded-[12px] text-white/60 font-medium hover:opacity-60 transition-all duration-300'
              >
                Моды
              </button>
              <button 
                onClick={handlePlayClick}
                disabled={isPlayDisabled}
                className={`w-full h-[50px] rounded-[12px] text-white font-semibold transition-all duration-300 relative overflow-hidden ${
                  playButtonState === 'idle'
                    ? 'bg-[#C44D56] hover:bg-[#C44D56]/90' 
                    : 'bg-[#C44D56]/10 cursor-not-allowed'
                }`}
              >
                {playButtonState !== 'idle' && (
                  <div 
                    className="absolute top-0 left-0 h-full bg-[#C44D56] transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                )}
                <div className="relative z-10 flex items-center justify-center gap-[8px]">
                  {playButtonState !== 'idle' && (
                    <div className="w-[16px] h-[16px] border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  )}
                  <span>{getButtonText()}</span>
                  {playButtonState !== 'idle' && (
                    <span className="text-[12px] opacity-80">({Math.round(progress)}%)</span>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <ModsModal 
        isOpen={isModsModalOpen} 
        onClose={handleCloseModsModal}
      />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
