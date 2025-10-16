"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Icons } from "@/components/icons"
import Link from "next/link"

const navigationItems = [
  { name: "首页", href: "/", icon: Icons.Home },
  { name: "日常", href: "/t/daily", icon: Icons.Home },
  { name: "技术", href: "/t/tech", icon: Icons.Code },
  { name: "信息", href: "/t/info", icon: Icons.Info },
  { name: "测评", href: "/t/review", icon: Icons.TestTube },
  { name: "交易", href: "/t/trade", icon: Icons.ShoppingCart },
  { name: "拼车", href: "/t/carpool", icon: Icons.Car },
  { name: "推广", href: "/t/promotion", icon: Icons.Megaphone },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Icons.Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <div className="flex flex-col gap-4 mt-6">
          <div className="flex items-center gap-2 px-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">T</span>
            </div>
            <span className="font-bold text-xl">TechForum</span>
          </div>

          <nav className="flex flex-col gap-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.name} href={item.href} onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start h-10">
                    <Icon />
                    <span className="ml-3">{item.name}</span>
                  </Button>
                </Link>
              )
            })}
          </nav>

          <div className="border-t pt-4">
            <div className="text-sm text-muted-foreground px-2 mb-2">快捷功能</div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm" className="justify-start bg-transparent">
                发布新话题
              </Button>
              <Button variant="outline" size="sm" className="justify-start bg-transparent">
                我的收藏
              </Button>
              <Button variant="outline" size="sm" className="justify-start bg-transparent">
                消息通知
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
