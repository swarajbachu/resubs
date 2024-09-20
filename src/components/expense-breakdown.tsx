"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Apple, Youtube, Music, Tv, Gamepad } from "lucide-react"
import NetflixLogo from "./logo/netflix"
import Spotify from "./logo/spotify"

type Subscription = {
  name: string
  price: number
  platform: string
}

const platformIcons = {
  netflix: NetflixLogo,
  spotify: Spotify,
  youtube: Youtube,
  apple: Apple,
  games: Gamepad,
}

const mockSubscriptions: Subscription[] = [
  { name: "Netflix", price: 15.99, platform: "netflix" },
  { name: "Spotify", price: 9.99, platform: "spotify" },
  { name: "YouTube Premium", price: 11.99, platform: "youtube" },
  { name: "Apple One", price: 14.95, platform: "apple" },
  { name: "Xbox Game Pass", price: 14.99, platform: "games" },
]

export default function ExpenseBreakdown() {
  const [isOpen, setIsOpen] = useState(false)

  const totalExpense = mockSubscriptions.reduce((sum, sub) => sum + sub.price, 0)

  const createArcPath = (startAngle: number, endAngle: number, innerRadius: number, outerRadius: number) => {
    const start = polarToCartesian(outerRadius, endAngle)
    const end = polarToCartesian(outerRadius, startAngle)
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"
    const innerStart = polarToCartesian(innerRadius, endAngle)
    const innerEnd = polarToCartesian(innerRadius, startAngle)
    return `
      M ${start.x} ${start.y}
      A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}
      L ${innerEnd.x} ${innerEnd.y}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${innerStart.x} ${innerStart.y}
      Z
    `
  }

  const polarToCartesian = (radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
    return {
      x: radius * Math.cos(angleInRadians),
      y: radius * Math.sin(angleInRadians),
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <span className="text-3xl font-bold">${totalExpense.toFixed(2)}</span>
          <span className="text-sm text-muted-foreground ml-2">per month</span>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">View Breakdown</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Expense Breakdown</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center items-center">
              <svg width="300" height="300" viewBox="-150 -150 300 300">
                {mockSubscriptions.reduce(
                  (acc, sub, index, array) => {
                    const slice = (sub.price / totalExpense) * 360
                    const path = createArcPath(acc.startAngle, acc.startAngle + slice, 60, 120)
                    const midAngle = acc.startAngle + slice / 2
                    const iconPos = polarToCartesian(90, midAngle)
                    const Icon = platformIcons[sub.platform as keyof typeof platformIcons]
                    acc.elements.push(
                      <g key={sub.platform} >
                        <path d={path}  className="text-primary/20 fill-red-600 m-1 border-2 border-green-600" />
                        <foreignObject
                          x={iconPos.x - 10}
                          y={iconPos.y - 10}
                          width="20"
                          height="20"
                          className="text-primary "
                        >
                          <div className="w-full h-full flex items-center justify-center">
                            <Icon className="w-5 h-5" />
                          </div>
                        </foreignObject>
                      </g>
                    )
                    acc.startAngle += slice
                    return acc
                  },
                  { elements: [], startAngle: 0 } as { elements: JSX.Element[]; startAngle: number }
                ).elements}
                <circle r="60" fill="white" />
                <text x="0" y="5" textAnchor="middle" className="text-xl font-bold">
                  ${totalExpense.toFixed(2)}
                </text>
                <text x="0" y="25" textAnchor="middle" className="text-sm fill-muted-foreground">
                  per month
                </text>
              </svg>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}