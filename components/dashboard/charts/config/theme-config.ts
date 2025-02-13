import { useTheme } from "next-themes"

export function useChartTheme() {
  const { resolvedTheme } = useTheme()
  
  return {
    axisColor: resolvedTheme === "dark" 
      ? "hsl(var(--muted-foreground))" 
      : "hsl(var(--foreground))",
    tooltipStyle: {
      background: "var(--background)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)"
    }
  }
}