import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface PopularClassesVisualizationProps {
  popularClassTypes: [string, number][]
}

export function PopularClassesVisualization({ popularClassTypes }: PopularClassesVisualizationProps) {
  const data = popularClassTypes.map(([name, count]) => ({ name, count }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>인기 강좌 유형</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="105%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}