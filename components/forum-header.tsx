"use client"

import type React from "react"

import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AuthDialog } from "@/components/auth/auth-dialog"
import { MobileNav } from "@/components/mobile-nav"
import { useAuth } from "@/lib/auth"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

const navigationItems = [
  { name: "日常", href: "/t/daily" },
  { name: "技术", href: "/t/tech" },
  { name: "信息", href: "/t/info" },
  { name: "测评", href: "/t/review" },
  { name: "交易", href: "/t/trade" },
  { name: "拼车", href: "/t/carpool" },
  { name: "推广", href: "/t/promotion" },
]

export function ForumHeader() {
  const { user, logout } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
      setSearchTerm("")
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo and Navigation */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gray-900 flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-bold text-xl text-gray-900">NotSeek</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium"
                >
                  {item.name}
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        {/* Search and User Actions */}
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Icons.Search />
            </div>
            <Input
              placeholder="搜索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 pl-9 bg-gray-50 border-gray-200 focus:bg-white focus:border-gray-300"
            />
          </form>

          {user ? (
            <>
              <Button variant="ghost" size="icon" className="relative text-gray-600 hover:bg-gray-100">
                <Icons.Bell />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8 border border-gray-200">
                      <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.username} />
                      <AvatarFallback className="bg-gray-100 text-gray-700">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.username}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <Icons.BarChart3 />
                      <span className="ml-2">仪表盘</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/user/${user.id}`}>
                      <Icons.User />
                      <span className="ml-2">个人资料</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Icons.Settings />
                      <span className="ml-2">设置</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <Icons.LogOut />
                    <span className="ml-2">登出</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <AuthDialog defaultMode="login">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100 border border-gray-200">
                  登录
                </Button>
              </AuthDialog>
              <AuthDialog defaultMode="register">
                <Button size="sm" className="bg-green-600 text-white hover:bg-green-700 font-medium">
                  注册
                </Button>
              </AuthDialog>
            </div>
          )}

          <MobileNav />
        </div>
      </div>
    </header>
  )
}
