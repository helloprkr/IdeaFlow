"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"
import { ChartTooltip } from "./components/chart-tooltip"
import { useChartConfig } from "./hooks/use-chart-config"

interface SimpleLineChartProps {
  data: Array<{
    name: string
    value: number
  }>
}

export function SimpleLineChart({ data }: SimpleLineChartProps) {
  const config = useChartConfig()
  const lineProps = config.line({ dataKey: "value" })

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="name" {...config.xAxis} />
        <YAxis {...config.yAxis} />
        <Tooltip content={<ChartTooltip />} {...config.tooltip} />
        <Line {...lineProps} />
      </LineChart>
    </ResponsiveContainer>
  )
}