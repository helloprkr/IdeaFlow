"use client"

import { useState } from 'react'
import { resetSystem, type ResetStatus } from '@/lib/utils/system-reset'
import { toast } from 'sonner'

export function useSystemReset() {
  const [isResetting, setIsResetting] = useState(false)
  const [lastResetStatus, setLastResetStatus] = useState<ResetStatus | null>(null)

  const performReset = async () => {
    setIsResetting(true)
    try {
      const status = await resetSystem()
      setLastResetStatus(status)
      
      if (status.success) {
        toast.success('System reset completed successfully')
      } else {
        toast.error('System reset failed')
      }
    } catch (error) {
      toast.error('System reset failed')
    } finally {
      setIsResetting(false)
    }
  }

  return {
    performReset,
    isResetting,
    lastResetStatus
  }
}