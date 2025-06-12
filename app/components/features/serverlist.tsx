import React, { useState, useEffect } from 'react'
import { useToast } from '../ui/toast'
import { serverApi, ServerStatus, ServerInfo } from '../../services/serverApi'

interface Server {
  id: number
  name: string
  isOnline: boolean
  onlineCount: number
  maxPlayers: number
  restartTime: number
  serverAddress?: string
  serverPort?: number
  nextRestart?: string // Add nextRestart field
}

interface ServerListProps {
  selectedServerId: number | null
  onServerSelect: (serverId: number) => void
  onStatsUpdate?: (stats: { onlinePlayers: number; queueSize: number }) => void
}

const ServerList: React.FC<ServerListProps> = ({ selectedServerId, onServerSelect, onStatsUpdate }) => {
  const { addToast } = useToast()
  const [servers, setServers] = useState<Server[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const formatRestartTime = (nextRestart: string): string => {
    try {
      console.log('🕐 Formatting restart time:', nextRestart)

      // Parse the date string properly
      const restartDate = new Date(nextRestart)

      console.log('🕐 Parsed date object:', restartDate)
      console.log('🕐 Date getTime():', restartDate.getTime())
      console.log('🕐 Is valid date:', !isNaN(restartDate.getTime()))

      // Check if date is valid
      if (isNaN(restartDate.getTime())) {
        console.error('Invalid date:', nextRestart)

        // Try alternative parsing - extract just the time part
        const timeMatch = nextRestart.match(/T(\d{2}:\d{2})/)
        if (timeMatch) {
          console.log('🕐 Extracted time from string:', timeMatch[1])
          return timeMatch[1]
        }

        return 'Неизвестно'
      }

      const formattedTime = restartDate.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })

      console.log('🕐 Formatted time:', formattedTime)
      return formattedTime
    } catch (error) {
      console.error('Error formatting restart time:', error, nextRestart)

      // Fallback: try to extract time manually
      const timeMatch = nextRestart.match(/T(\d{2}:\d{2})/)
      if (timeMatch) {
        console.log('🕐 Fallback extracted time:', timeMatch[1])
        return timeMatch[1]
      }

      return 'Неизвестно'
    }
  }

  const fetchServerData = async (isInitialLoad = false) => {
    console.log('🚀 Starting server data fetch...')
    try {
      // Only show loading spinner on initial load
      if (isInitialLoad) {
        setIsLoading(true)
        console.log('⏳ Loading state set to true')
      }

      console.log('📞 Making parallel API calls...')
      const [statusData, infoData] = await Promise.all([serverApi.getServerStatus(), serverApi.getServerInfo()])

      console.log('📊 Raw API responses:', { statusData, infoData })

      // Update parent component with server stats
      if (onStatsUpdate) {
        onStatsUpdate({
          onlinePlayers: statusData.onlinePlayers,
          queueSize: statusData.queueSize,
        })
      }

      const serverData: Server = {
        id: 1,
        name: 'Area Of Decay (AoD)',
        isOnline: statusData.isOnline,
        onlineCount: statusData.onlinePlayers,
        maxPlayers: statusData.totalSlots,
        restartTime: 0,
        nextRestart: infoData.nextRestart,
        serverAddress: statusData.serverAddress,
        serverPort: statusData.serverPort,
      }

      console.log('🎯 Processed server data:', serverData)
      setServers([serverData])

      // Auto-select first server if none is selected
      if (!selectedServerId) {
        onServerSelect(serverData.id)
        console.log('🎯 Auto-selected first server:', serverData.id)
      }

      console.log('✅ Server data successfully updated')
    } catch (error) {
      console.error('💥 Server data fetch failed:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      })

      // Only show toast on initial load failure
      if (isInitialLoad) {
        addToast({
          type: 'error',
          title: 'Ошибка загрузки данных сервера',
          description: `Не удалось получить актуальную информацию о сервере: ${
            error instanceof Error ? error.message : 'Неизвестная ошибка'
          }`,
          duration: 6000,
        })
      }

      // Fallback to default data only on initial load
      if (isInitialLoad) {
        const fallbackData = [
          {
            id: 1,
            name: 'Area Of Decay (AoD)',
            isOnline: false,
            onlineCount: 0,
            maxPlayers: 100,
            restartTime: 0,
            nextRestart: new Date().toISOString(),
          },
        ]
        console.log('🔄 Using fallback data:', fallbackData)
        setServers(fallbackData)

        // Auto-select first server even on fallback
        if (!selectedServerId) {
          onServerSelect(fallbackData[0].id)
          console.log('🎯 Auto-selected fallback server:', fallbackData[0].id)
        }
      }
    } finally {
      if (isInitialLoad) {
        setIsLoading(false)
        console.log('⏳ Loading state set to false')
      }
    }
  }

  useEffect(() => {
    console.log('🔧 ServerList component mounted, starting initial data fetch')
    fetchServerData(true) // Initial load

    // Refresh data every 30 seconds
    console.log('⏲️ Setting up 30-second refresh interval')
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing server data...')
      fetchServerData(false) // Background refresh, no loading state
    }, 30000)

    return () => {
      console.log('🧹 Cleaning up refresh interval')
      clearInterval(interval)
    }
  }, [])

  const handleServerSelect = (serverId: number) => {
    const selectedServer = servers.find((server) => server.id === serverId)

    if (selectedServer && !selectedServer.isOnline) {
      addToast({
        type: 'warning',
        title: 'Этот сервер в данный момент не доступен',
        description: 'Выберите другой сервер для игры',
        duration: 4000,
      })
    }

    onServerSelect(serverId)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-[15px]">
        <div className="flex flex-col gap-[10px] justify-between p-[14px] px-[18px] h-[109px] rounded-[14px] bg-[rgba(255,255,255,0.02)] border border-white/5 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="w-32 h-4 bg-white/10 rounded"></div>
            <div className="w-4 h-4 bg-white/10 rounded-full"></div>
          </div>
          <div className="flex items-center justify-between">
            <div className="w-24 h-3 bg-white/10 rounded"></div>
            <div className="w-12 h-6 bg-white/10 rounded-full"></div>
          </div>
          <div className="w-full h-[6px] bg-white/10 rounded-full"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-[15px]">
      {servers.map((server) => {
        const progressPercentage = (server.onlineCount / server.maxPlayers) * 100
        const isSelected = selectedServerId === server.id
        const isRestarting = !server.isOnline // Show spinner when server is offline

        return (
          <div
            key={server.id}
            onClick={() => handleServerSelect(server.id)}
            className={`cursor-pointer flex flex-col gap-[10px] justify-between p-[14px] px-[18px] h-[109px] rounded-[14px] transition-all duration-200 relative ${
              isSelected
                ? !server.isOnline
                  ? 'bg-[#C44D56]/5 border border-[#C44D56]/20'
                  : 'bg-white/5 border border-white/20'
                : 'bg-[rgba(255,255,255,0.02)] border border-white/5 hover:bg-[rgba(255,255,255,0.05)]'
            }`}
          >
            {/* Server restart loading overlay */}
            {isRestarting && (
              <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-[14px] flex items-center justify-center z-10">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#303030"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="#C44D56"
                  />
                </svg>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="w-full flex items-center justify-between gap-[8px]">
                <p className="text-white font-medium">{server.name}</p>
                <div className="flex items-center gap-[6px]">
                  <div
                    className={`w-[16px] flex items-center justify-center h-[16px] rounded-full ${
                      server.isOnline ? 'bg-[#4DC4B6]/20' : 'bg-[#C44D56]/20'
                    }`}
                  >
                    <div
                      className={`w-[6px] h-[6px] rounded-full ${server.isOnline ? 'bg-[#4DC4B6]' : 'bg-[#C44D56]'}`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-white/70 text-[14px]">
                {server.isOnline
                  ? `Рестарт в ${server.nextRestart ? formatRestartTime(server.nextRestart) : 'Неизвестно'}`
                  : 'Сервер выключен'}
              </p>
              <div className="border text-[12px] border-white/5 px-[10px] py-[5px] rounded-full">
                <span className="text-white/80 text-[14px]">
                  {server.onlineCount}/{server.maxPlayers}
                </span>
              </div>
            </div>

            <div className="w-full bg-white/10 rounded-full h-[6px]">
              <div
                className={`h-[6px] rounded-full transition-all duration-300 ${
                  server.isOnline ? 'bg-white' : 'bg-gray-500'
                }`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )
      })}
      <div className="text-white/60 flex items-center justify-center gap-5 bg-[rgba(255,255,255,0.02)] border border-white/5 p-[14px] px-[18px] h-[109px] rounded-[14px] text-[12px]">
        <p>Сервер в разработке</p>
        <svg
          aria-hidden="true"
          className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="#303030"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="#C44D56"
          />
        </svg>
      </div>
    </div>
  )
}

export default ServerList
