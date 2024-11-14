"use client"

import * as React from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, TooltipProps } from 'recharts'
import { Card } from "@/components/ui/card"

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: Record<string, { label: string; color: string }>
  children: React.ReactElement
}

export function ChartContainer({
  config,
  children,
  ...props
}: ChartContainerProps) {
  return (
    <Card {...props}>
      <ResponsiveContainer width="100%" height={350}>
        {React.isValidElement(children) ? children : <div />}
      </ResponsiveContainer>
      <style jsx global>{`
        ${Object.entries(config)
          .map(
            ([key, value]) => `
          .recharts-tooltip-item-name.${key},
          .recharts-legend-item-text.${key} {
            color: ${value.color};
          }
        `
          )
          .join("\n")}
      `}</style>
    </Card>
  )
}

export function ChartTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {label}
            </span>
            <span className="font-bold text-muted-foreground">
              {payload[0].value}
            </span>
          </div>
          {payload.map((item) => (
            <div key={item.name} className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                {item.name}
              </span>
              <span className="font-bold" style={{ color: item.color }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}

export function ChartTooltipContent({ active, payload, label }: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {label}
            </span>
            <span className="font-bold text-muted-foreground">
              {payload[0].value}
            </span>
          </div>
          {payload.map((item) => (
            <div key={item.name} className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                {item.name}
              </span>
              <span className="font-bold" style={{ color: item.color }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}