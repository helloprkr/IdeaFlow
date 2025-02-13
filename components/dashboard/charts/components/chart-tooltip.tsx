"use client"

import { TooltipProps } from "recharts"
import { cn } from "@/lib/utils"

export function ChartTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null

  return (
    <div className={cn(
      "rounded-lg border bg-background p-2 shadow-sm",
      "dark:bg-secondary dark:border-secondary"
    )}>
      <div className="grid grid-cols-2 gap-2">
        <div className="font-medium text-foreground">{label}</div>
        {payload.map((item, index) => (
          <div key={index} className="font-medium text-right text-foreground">
            {item.value}
          </div>
        ))}
      </div>
    </div>
  )
}