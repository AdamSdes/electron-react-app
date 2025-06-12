import React, { useState, useEffect, createContext, useContext, useRef } from 'react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer: React.FC<{ toasts: Toast[]; onRemove: (id: string) => void }> = ({ toasts, onRemove }) => {
  const maxVisible = 5; // Limit visible toasts
  const visibleToasts = toasts.slice(-maxVisible); // Show only last 5 toasts

  return (
    <div className="fixed top-4 right-4 z-[100] pointer-events-none max-w-[380px] w-full">
      <div className="flex flex-col gap-4">
        {visibleToasts.map((toast, index) => (
          <ToastItem 
            key={toast.id} 
            toast={toast} 
            onRemove={onRemove}
            index={index}
            total={visibleToasts.length}
          />
        ))}
      </div>
    </div>
  );
};

const ToastItem: React.FC<{ 
  toast: Toast; 
  onRemove: (id: string) => void; 
  index: number;
  total: number;
}> = ({ toast, onRemove, index, total }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [swipeDistance, setSwipeDistance] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const handleClose = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove(toast.id), 150);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.target instanceof HTMLButtonElement) return; // Don't drag when clicking close button
    setIsDragging(true);
    startX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    e.preventDefault();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX.current;
    if (deltaX > 0) {
      setSwipeDistance(Math.min(deltaX, 200)); // Limit swipe distance
    }
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (swipeDistance > 80) {
      handleClose();
    } else {
      setSwipeDistance(0);
    }
  };

  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20 text-green-400';
      case 'error':
        return 'bg-red-500/10 border-red-500/20 text-red-400';
      case 'warning':
        return 'bg-white/10 border-white/20 text-white/90';
      case 'info':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
      default:
        return 'bg-white/10 border-white/20 text-white';
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12l2 2 4-4"/>
            <circle cx="12" cy="12" r="9"/>
          </svg>
        );
      case 'error':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9"/>
            <path d="15 9l-6 6"/>
            <path d="9 9l6 6"/>
          </svg>
        );
      case 'warning':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 9v4"/>
            <path d="M12 17h.01"/>
            <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"/>
          </svg>
        );
      case 'info':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9"/>
            <path d="M12 8v4"/>
            <path d="M12 16h.01"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const scale = Math.max(0.95, 1 - index * 0.03);
  const translateY = -index * 12;
  const opacity = Math.max(0.3, 1 - swipeDistance / 150);
  const blur = swipeDistance > 0 ? Math.min(swipeDistance / 100, 0.5) : 0;

  return (
    <div
      ref={toastRef}
      className="pointer-events-auto relative"
      style={{
        transform: `translateY(${translateY}px) scale(${scale})`,
        transformOrigin: 'top center',
        zIndex: total - index,
      }}
    >
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`
          w-full max-w-[360px] p-4 rounded-xl border backdrop-blur-md shadow-xl
          transform-gpu transition-all duration-150 ease-out cursor-grab active:cursor-grabbing
          ${isVisible && !isRemoving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
          ${isRemoving ? 'scale-95' : ''}
          ${getToastStyles()}
        `}
        style={{
          transform: `translateX(${swipeDistance}px)`,
          opacity: isDragging ? opacity : 1,
          filter: blur > 0 ? `blur(${blur}px)` : 'none',
          transition: isDragging ? 'none' : 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          touchAction: 'pan-y', // Allow vertical scrolling
        }}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="font-medium text-sm leading-5 truncate">{toast.title}</div>
            {toast.description && (
              <div className="text-xs opacity-80 mt-1 leading-4 line-clamp-2">{toast.description}</div>
            )}
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-150 rounded-sm p-1 hover:bg-white/10 -mt-1 -mr-1"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="18 6L6 18"/>
              <path d="6 6l12 12"/>
            </svg>
          </button>
        </div>
        
      </div>
    </div>
  );
};

// Utility functions for easy usage
export const toast = {
  success: (title: string, description?: string, duration?: number) => {
    const context = useContext(ToastContext);
    if (context) {
      context.addToast({ type: 'success', title, description, duration });
    }
  },
  error: (title: string, description?: string, duration?: number) => {
    const context = useContext(ToastContext);
    if (context) {
      context.addToast({ type: 'error', title, description, duration });
    }
  },
  info: (title: string, description?: string, duration?: number) => {
    const context = useContext(ToastContext);
    if (context) {
      context.addToast({ type: 'info', title, description, duration });
    }
  },
  warning: (title: string, description?: string, duration?: number) => {
    const context = useContext(ToastContext);
    if (context) {
      context.addToast({ type: 'warning', title, description, duration });
    }
  },
};
