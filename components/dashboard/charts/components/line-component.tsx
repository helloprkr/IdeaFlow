"use client"

interface LineComponentProps {
  dataKey: string
  color?: string
  strokeWidth?: number
  dot?: boolean | object
}

export function LineComponent({ 
  dataKey, 
  color = "hsl(var(--primary))",
  strokeWidth = 2,
  dot = false 
}: LineComponentProps) {
  return {
    type: "monotone" as const,
    dataKey,
    stroke: color,
    strokeWidth,
    dot,
    activeDot: dot ? { r: 4, strokeWidth: 2 } : undefined
  }
}