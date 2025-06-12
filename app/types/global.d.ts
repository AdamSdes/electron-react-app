declare global {
  interface Window {
    api: {
      invoke: (channel: string, ...args: any[]) => Promise<any>
      openExternal: (url: string) => Promise<void>
      minimizeWindow: () => Promise<void>
      closeWindow: () => Promise<void>
    }
    electron: any
  }
}

export {}
