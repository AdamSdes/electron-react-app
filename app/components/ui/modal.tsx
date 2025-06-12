import React, { useEffect, useState } from 'react';
import { Button } from './button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Force a reflow before starting animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else if (isVisible) {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isVisible]);

  if (!isVisible) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-200 ease-out ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
    >
      <div className={`fixed inset-0 bg-black/70 transition-all duration-200 ease-out ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}></div>
      <div className={`relative bg-gradient-to-b from-[#0f0f0f] to-[#080808] border border-white/15 rounded-[20px] w-[800px] max-h-[85vh] overflow-hidden shadow-2xl transition-all duration-200 ease-out transform ${
        isAnimating 
          ? 'opacity-100 scale-100 translate-y-0' 
          : 'opacity-0 scale-95 translate-y-4'
      }`}>
        <div className="flex items-center justify-between p-[16px] border-b border-white/10 bg-white/5">
          <h2 className="text-white font-semibold text-[18px]">{title}</h2>
          <Button 
            onClick={onClose}
            className='w-[32px] h-[32px] bg-white/10 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 rounded-[8px] p-0 transition-all duration-200'
          >
            <svg className="w-[14px] h-[14px] text-white/70 hover:text-red-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </Button>
        </div>
        <div className="max-h-[65vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-white/30">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
