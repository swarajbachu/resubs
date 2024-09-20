"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Apple, Youtube, Music, Tv, Gamepad, Plus } from "lucide-react"

type Subscription = {
  name: string
  price: number
  date: Date
  platform: string
}

const platformIcons = {
  netflix: Tv,
  spotify: Music,
  youtube: Youtube,
  apple: Apple,
  games: Gamepad,
}

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function SubscriptionTracker() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [date, setDate] = useState("")
  const [platform, setPlatform] = useState("")
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState<Date[]>([])

  useEffect(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days = []

    for (let d = firstDay; d <= lastDay; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d))
    }

    setCalendarDays(days)
  }, [currentMonth])

  const addSubscription = () => {
    if (name && price && date && platform) {
      setSubscriptions([
        ...subscriptions,
        {
          name,
          price: parseFloat(price),
          date: new Date(date),
          platform,
        },
      ])
      setName("")
      setPrice("")
      setDate("")
      setPlatform("")
    }
  }

  const getSubscriptionsForDate = (date: Date) => {
    return subscriptions.filter(
      (sub) => sub.date.getDate() === date.getDate() && sub.date.getMonth() === date.getMonth()
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Subscription Tracker</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Subscription
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Subscription</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="platform">Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger id="platform">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="netflix">Netflix</SelectItem>
                    <SelectItem value="spotify">Spotify</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="games">Games</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={addSubscription}>Add Subscription</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center font-semibold text-sm py-2">
                {day}
              </div>
            ))}
            {calendarDays.map((date, index) => {
              const subs = getSubscriptionsForDate(date)
              return (
                <div
                  key={index}
                  className="aspect-square rounded-lg border p-2 flex flex-col items-center justify-between"
                >
                  <span className="text-sm font-medium">{date.getDate()}</span>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {subs.map((sub, subIndex) => {
                      const Icon = platformIcons[sub.platform as keyof typeof platformIcons]
                      return (
                        <div key={subIndex} className="rounded-full bg-primary/10 p-1">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}