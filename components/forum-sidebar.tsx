"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "@/components/icons"
import Link from "next/link"
import { useCategoriesStore } from "@/lib/categories"
import { useState } from "react"
import { useAuthStore } from "@/lib/auth"

const featuredUsers = [
  { name: "yuzu", avatar: "/user-yuzu.jpg", id: "1" },
  { name: "David", avatar: "/user-david.jpg", id: "2" },
  { name: "toboo913", avatar: "/user-toboo.jpg", id: "3" },
  { name: "Si", avatar: "/user-si.jpg", id: "4" },
]

const iconMap: Record<string, () => React.JSX.Element> = {
  daily: Icons.Home,
  tech: Icons.Code,
  info: Icons.Info,
  review: Icons.StarHalf,
  trade: Icons.ShoppingCart,
  carpool: Icons.Car,
  promotion: Icons.Megaphone,
  life: Icons.Coffee,
  dev: Icons.Laptop,
}

export function ForumSidebar() {
  const { categories } = useCategoriesStore()
  const { user, updateUser } = useAuthStore()
  const [isCheckedIn, setIsCheckedIn] = useState(false)

  const handleCheckIn = () => {
    if (!user || isCheckedIn) return

    const updatedUser = {
      ...user,
      drumsticks: (user.drumsticks || 0) + 5,
    }

    updateUser(updatedUser)
    setIsCheckedIn(true)
  }

  return (
    <aside className="w-64 space-y-4">
      {/* Categories */}
      <Card className="border border-gray-200 bg-white shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-900">分类导航</CardTitle>
            <Link href="/categories">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <Icons.Grid3X3 />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-0.5">
          {categories.slice(0, 7).map((category) => {
            const IconComponent = iconMap[category.slug] || Icons.Home
            return (
              <Link key={category.slug} href={`/t/${category.slug}`}>
                <Button
                  variant="ghost"
                  className="w-full justify-between h-9 px-3 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-gray-500">
                      <IconComponent />
                    </div>
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600 hover:bg-gray-200">
                    {category.postCount}
                  </Badge>
                </Button>
              </Link>
            )
          })}
          <Link href="/categories">
            <Button
              variant="ghost"
              className="w-full justify-center h-8 px-2 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            >
              查看所有分类
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Quick Functions */}
      <Card className="border border-gray-200 bg-white shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <div className="text-gray-500">
              <Icons.Zap className="h-4 w-4" />
            </div>
            快捷功能区
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant={isCheckedIn ? "secondary" : "outline"}
            size="sm"
            className={`w-full justify-center gap-3 h-12 px-4 transition-all duration-300 transform hover:scale-[1.02] ${
              isCheckedIn
                ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700 hover:from-green-100 hover:to-emerald-100 shadow-sm"
                : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 shadow-sm hover:shadow-md"
            }`}
            onClick={handleCheckIn}
            disabled={!user || isCheckedIn}
          >
            <div
              className={`transition-transform duration-200 ${isCheckedIn ? "text-green-500 animate-pulse" : "text-gray-600"}`}
            >
              <Icons.Star />
            </div>
            <span className="font-semibold">{isCheckedIn ? "签到成功 🍗+5" : "立即签到"}</span>
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="sm"
              className="h-20 flex-col gap-2 bg-gradient-to-br from-white to-gray-50 border-gray-200 text-gray-700 hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
            >
              <div className="text-gray-500 group-hover:text-blue-500 transition-colors duration-200">
                <Icons.Users />
              </div>
              <span className="text-xs font-semibold">管理记录</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-20 flex-col gap-2 bg-gradient-to-br from-white to-gray-50 border-gray-200 text-gray-700 hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
            >
              <div className="text-gray-500 group-hover:text-purple-500 transition-colors duration-200">
                <Icons.Gift />
              </div>
              <span className="text-xs font-semibold">幸运抽奖</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Featured Users */}
      <Card className="border border-gray-200 bg-white shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-gray-900">欢迎新用户</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2">
            {featuredUsers.map((user) => (
              <Link key={user.name} href={`/user/${user.id}`}>
                <div className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity">
                  <Avatar className="h-10 w-10 border border-gray-200">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="text-xs bg-gray-100 text-gray-700">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-gray-600 truncate w-full text-center font-medium">{user.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card className="border border-gray-200 bg-white shadow-sm py-4">
        <CardContent className="">
          <div className="text-center">
            <div className="text-sm text-gray-600">
              今日论坛共有 <span className="font-bold text-gray-900 text-base">39031</span> 位seeker
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}
