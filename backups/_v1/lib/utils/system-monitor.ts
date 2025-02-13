import { supabase } from '@/lib/supabaseClient'

interface SystemMetrics {
  connectionStatus: 'connected' | 'disconnected'
  responseTime: number
  errorRate: number
  dataFlowRate: number
}

export async function checkSystemStatus(): Promise<SystemMetrics> {
  const start = performance.now()
  
  try {
    // Test database connection
    const { data, error } = await supabase
      .from('ideas')
      .select('count')
      .single()

    const end = performance.now()
    const responseTime = end - start

    if (error) throw error

    return {
      connectionStatus: 'connected',
      responseTime,
      errorRate: 0,
      dataFlowRate: calculateDataFlowRate()
    }
  } catch (error) {
    return {
      connectionStatus: 'disconnected',
      responseTime: 0,
      errorRate: 1,
      dataFlowRate: 0
    }
  }
}

function calculateDataFlowRate(): number {
  // Implementation to calculate data flow rate
  // This would be replaced with actual metrics in production
  return Math.random() * 100
}

let errorCount = 0
let requestCount = 0

export function trackError() {
  errorCount++
  requestCount++
}

export function trackRequest() {
  requestCount++
}

export function getErrorRate(): number {
  if (requestCount === 0) return 0
  return errorCount / requestCount
}

export function resetMetrics() {
  errorCount = 0
  requestCount = 0
}