"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"
import { Apple, Youtube, Music, Tv, Gamepad } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A donut chart showing subscription expenses"

const chartData = [
  { platform: "netflix", expense: 15.99, fill: "var(--color-netflix)" },
  { platform: "spotify", expense: 9.99, fill: "var(--color-spotify)" },
  { platform: "youtube", expense: 11.99, fill: "var(--color-youtube)" },
  { platform: "apple", expense: 14.95, fill: "var(--color-apple)" },
  { platform: "games", expense: 14.99, fill: "var(--color-games)" },
]

const chartConfig = {
  // expense: {
  //   label: "Expense",
  // },
  netflix: {
    label: "Netflix",
    color: "hsl(var(--chart-1))",
    icon: Tv,
  },
  spotify: {
    label: "Spotify",
    color: "hsl(var(--chart-2))",
    icon: Music,
  },
  youtube: {
    label: "YouTube",
    color: "hsl(var(--chart-3))",
    icon: Youtube,
  },
  apple: {
    label: "Apple",
    color: "hsl(var(--chart-4))",
    icon: Apple,
  },
  games: {
    label: "Games",
    color: "hsl(var(--chart-5))",
    icon: Gamepad,
  },
} satisfies ChartConfig

export default function Component() {
  const totalExpense = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.expense, 0)
  }, [])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Subscription Expenses</CardTitle>
        <CardDescription>Monthly Breakdown</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="expense"
              nameKey="platform"
              innerRadius={60}
              outerRadius={80}
              strokeWidth={5}
              stroke="var(--background)"
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          ${totalExpense.toFixed(2)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          per month
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
            {chartData.map((entry, index) => {
              const Icon = chartConfig[entry.platform as keyof typeof chartConfig]?.icon
              const angle = index * (360 / chartData.length) + 180
              const radius = 100
              const x = Math.cos(angle * Math.PI / 180) * radius + 125
              const y = Math.sin(angle * Math.PI / 180) * radius + 125
              return (
                <g key={`icon-${entry.platform}`}>
                  <foreignObject x={x - 10} y={y - 10} width={20} height={20}>
                    <div className="flex h-full w-full items-center justify-center">
                      <Icon className="h-4 w-4 text-foreground" />
                    </div>
                  </foreignObject>
                </g>
              )
            })}
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 3.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total subscription expenses for this month
        </div>
      </CardFooter>
    </Card>
  )
}