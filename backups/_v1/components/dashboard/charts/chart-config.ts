import { type TooltipProps } from "recharts"

export const defaultAxisConfig = {
  tick: { fontSize: 12 },
  stroke: "currentColor",
  strokeOpacity: 0.1,
  padding: { left: 10, right: 10 }
} as const

export const tooltipStyle = {
  background: "var(--background)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)"
} as const

export function formatTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid grid-cols-2 gap-2">
        <div className="font-medium">{label}</div>
        {payload.map((item, index) => (
          <div key={index} className="font-medium text-right">
            {item.value}
          </div>
        ))}
      </div>
    </div>
  )
}