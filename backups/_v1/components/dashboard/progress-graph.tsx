"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SimpleLineChart } from "./charts/simple-line-chart"

const data = [
  { name: "Jan", value: 4 },
  { name: "Feb", value: 3 },
  { name: "Mar", value: 6 },
  { name: "Apr", value: 8 },
  { name: "May", value: 7 },
  { name: "Jun", value: 9 },
]

export function ProgressGraph() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <SimpleLineChart data={data} />
        </div>
      </CardContent>
    </Card>
  )
}