import { useState, useEffect } from 'react'

export function ImageComponent() {
  const [logoSrc, setLogoSrc] = useState<string>('')

  useEffect(() => {
    import('../assets/logo.png').then((module) => {
      setLogoSrc(module.default)
    })
  }, [])

  return logoSrc ? <img src={logoSrc} alt="Logo" /> : <div>Loading...</div>
}
