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

interface MultiLineChartProps {
  data: Array<{
    name: string
    [key: string]: string | number
  }>
  lines: Array<{
    key: string
    color: string
  }>
}

export function MultiLineChart({ data, lines }: MultiLineChartProps) {
  const config = useChartConfig()

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="name" {...config.xAxis} />
        <YAxis {...config.yAxis} />
        <Tooltip content={<ChartTooltip />} {...config.tooltip} />
        {lines.map(({ key, color }) => (
          <Line key={key} {...config.line({ dataKey: key, color })} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}