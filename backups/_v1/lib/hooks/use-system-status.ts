"use client"

import { useState, useEffect } from 'react'
import { checkSystemStatus } from '@/lib/utils/system-monitor'

export function useSystemStatus() {
  const [status, setStatus] = useState({
    connectionStatus: 'disconnected' as const,
    responseTime: 0,
    errorRate: 0,
    dataFlowRate: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkStatus = async () => {
      const metrics = await checkSystemStatus()
      setStatus(metrics)
      setLoading(false)
    }

    // Initial check
    checkStatus()

    // Set up periodic checks
    const interval = setInterval(checkStatus, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return { status, loading }
}