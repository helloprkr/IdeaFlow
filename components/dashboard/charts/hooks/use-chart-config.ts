"use client"

import { axisConfig, yAxisConfig } from "../config/axis-config"
import { useChartTheme } from "../config/theme-config"
import { LineComponent } from "../components/line-component"

export function useChartConfig() {
  const { axisColor, tooltipStyle } = useChartTheme()

  return {
    xAxis: {
      ...axisConfig,
      stroke: axisColor
    },
    yAxis: {
      ...yAxisConfig,
      stroke: axisColor
    },
    tooltip: {
      contentStyle: tooltipStyle
    },
    line: LineComponent
  }
}