// Common axis configuration for charts
export const axisConfig = {
  tick: { fontSize: 12 },
  stroke: "currentColor",
  strokeOpacity: 0.1,
  padding: { left: 10, right: 10 }
} as const

export const yAxisConfig = {
  ...axisConfig,
  width: 35,
  padding: { top: 20, bottom: 20 }
} as const