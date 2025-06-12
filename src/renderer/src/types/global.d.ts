export interface IElectronAPI {
  minimizeWindow: () => Promise<void>
  closeWindow: () => Promise<void>
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
