"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { TooltipProvider } from "@/components/ui/tooltip"
import { defaultAxisConfig, tooltipStyle, ChartTooltip } from "./chart-config"

interface ChartWrapperProps {
  data: any[]
  xKey: string
  yKey: string
}

export function ChartWrapper({ data, xKey, yKey }: ChartWrapperProps) {
  return (
    <TooltipProvider>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis 
            dataKey={xKey}
            {...defaultAxisConfig}
          />
          <YAxis
            width={35}
            {...defaultAxisConfig}
            padding={{ top: 20, bottom: 20 }}
          />
          <Tooltip 
            content={<ChartTooltip />}
            contentStyle={tooltipStyle}
          />
          <Line
            type="monotone"
            dataKey={yKey}
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </TooltipProvider>
  )
}