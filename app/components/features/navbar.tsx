import React from 'react'
import { Button } from '../../components/ui/button'

const Navbar: React.FC = () => {
  const handleMinimize = () => {
    if (window.api) {
      window.api.invoke('window-minimize')
    }
  }

  const handleClose = () => {
    if (window.api) {
      window.api.invoke('window-close')
    }
  }

  return (
    <div
      className="h-[95px] flex items-center p-4 overflow-hidden relative"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      <div className="container flex justify-between items-center relative z-10">
        <div className="flex items-center gap-[10px]">
          <img src="logo.png" alt="Logo" width={50} height={50} />
          <h1 className="text-white/90 text-[12px] font-semibold">COLD BLOOD</h1>
        </div>
        <div className="flex gap-5" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
          <a
            className="text-white/70 text-[14px] flex items-start gap-1 hover:text-white"
            href="https://cold-blood.online/lor"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault()
              if (window.api && window.api.openExternal) {
                window.api.openExternal('https://cold-blood.online/lor')
              }
            }}
          >
            Лор
            <img className="w-2.5 h-2.5" src="link.svg" alt="" />
          </a>
          <a
            className="text-white/70 flex items-start gap-1 text-[14px] hover:text-white"
            href="https://cold-blood.online/rules"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault()
              if (window.api && window.api.openExternal) {
                window.api.openExternal('https://cold-blood.online/rules')
              }
            }}
          >
            Правила
            <img className="w-2.5 h-2.5" src="link.svg" alt="" />
          </a>
          <a
            className="text-white/70 flex items-start gap-1 text-[14px] hover:text-white"
            href="https://cold-blood.online/factions"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault()
              if (window.api && window.api.openExternal) {
                window.api.openExternal('https://cold-blood.online/factions')
              }
            }}
          >
            Группировки
            <img className="w-2.5 h-2.5" src="link.svg" alt="" />
          </a>
          <a
            className="text-white/70 flex items-start gap-1 text-[14px] hover:text-white"
            href="https://cold-blood.online/faq"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault()
              if (window.api && window.api.openExternal) {
                window.api.openExternal('https://cold-blood.online/faq')
              }
            }}
          >
            FAQ
            <img className="w-2.5 h-2.5" src="link.svg" alt="" />
          </a>
        </div>

        <div
          className="flex items-center text-[12px] gap-[15px]"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          <a
            href="http://cold-blood.ru/"
            target="_blank"
            rel="noopener noreferrer"
            className="h-[44px] text-white/70 font-medium rounded-full bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] flex items-center px-4 gap-2 no-underline"
            onClick={(e) => {
              e.preventDefault()
              if (window.api && window.api.openExternal) {
                window.api.openExternal('http://cold-blood.ru/')
              }
            }}
          >
            <img src="Heart.svg" alt="Donate" width={19} height={19} />
            Пожертвования
          </a>
          <div className="w-[1px] h-[18px] bg-white/5"></div>
          <div className="flex items-center gap-[8px]">
            <Button
              onClick={handleMinimize}
              className="w-[32px] h-[32px] bg-white/5 hover:bg-white/10 rounded-[6px] p-0"
            >
              <svg className="w-[14px] h-[14px] text-white/70" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </Button>
            <Button
              onClick={handleClose}
              className="w-[32px] h-[32px] bg-red-500/10 hover:bg-red-500/20 rounded-[6px] p-0"
            >
              <svg className="w-[14px] h-[14px] text-red-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
