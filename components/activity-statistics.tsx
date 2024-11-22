'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface ActivityStatistics {
  region: string
  sport: string
  count: number
}

interface ActivityStatisticsProps {
  statistics: ActivityStatistics[]
}

export function ActivityStatistics({ statistics }: ActivityStatisticsProps) {
  const regionData = statistics.reduce((acc, stat) => {
    if (acc[stat.region]) {
      acc[stat.region] += stat.count
    } else {
      acc[stat.region] = stat.count
    }
    return acc
  }, {} as Record<string, number>)

  const sportData = statistics.reduce((acc, stat) => {
    if (acc[stat.sport]) {
      acc[stat.sport] += stat.count
    } else {
      acc[stat.sport] = stat.count
    }
    return acc
  }, {} as Record<string, number>)

  const regionChartData = Object.entries(regionData).map(([region, count]) => ({ name: region, value: count }))
  const sportChartData = Object.entries(sportData).map(([sport, count]) => ({ name: sport, value: count }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>동호회 활동 통계</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div>
            <h4 className="text-sm font-medium mb-2">지역별 동호회 수</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={regionChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">종목별 동호회 수</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={sportChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

