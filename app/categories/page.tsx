"use client"

import { ForumHeader } from "@/components/forum-header"
import { ForumSidebar } from "@/components/forum-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Icons } from "@/components/icons"
import Link from "next/link"
import { useCategoriesStore } from "@/lib/categories"

export default function CategoriesPage() {
  const { categories } = useCategoriesStore()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPosts = categories.reduce((sum, cat) => sum + cat.postCount, 0)
  const totalMembers = categories.reduce((sum, cat) => sum + cat.memberCount, 0)
  const todayPosts = categories.reduce((sum, cat) => sum + cat.todayPostCount, 0)

  return (
    <div className="min-h-screen bg-background">
      <ForumHeader />

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="hidden lg:block">
            <ForumSidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">话题分类</h1>
                <p className="text-muted-foreground">探索不同的话题分类，找到您感兴趣的讨论</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icons.MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{totalPosts.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">总话题数</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <Icons.Users className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{totalMembers.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">活跃用户</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-500/10 rounded-lg">
                        <Icons.TrendingUp className="h-5 w-5 text-orange-500" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{todayPosts}</div>
                        <div className="text-sm text-muted-foreground">今日新增</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Search */}
              <div className="relative">
                <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索分类..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCategories.map((category) => (
                <Card key={category.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center text-2xl`}
                      >
                        {category.icon}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                      </div>
                      {category.isActive && (
                        <Badge variant="secondary" className="text-xs">
                          活跃
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Icons.MessageSquare className="h-3 w-3" />
                          <span>{category.postCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icons.Users className="h-3 w-3" />
                          <span>{category.memberCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icons.TrendingUp className="h-3 w-3" />
                          <span>今日 {category.todayPostCount}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">版主: {category.moderators.join(", ")}</div>
                      <Link href={`/t/${category.slug}`}>
                        <Button variant="ghost" size="sm">
                          进入分类
                          <Icons.ArrowRight className="ml-2 h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredCategories.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">没有找到匹配的分类</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
