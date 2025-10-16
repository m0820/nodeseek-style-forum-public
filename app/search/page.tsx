"use client"

import type React from "react"

import { ForumHeader } from "@/components/forum-header"
import { ForumSidebar } from "@/components/forum-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { UserLevelBadge } from "@/components/user-level-badge"
import { DEMO_USER_LEVELS, calculateUserLevel } from "@/lib/user-level"
import { useState, useEffect } from "react"
import { Search, MessageSquare, User, Calendar } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { usePosts } from "@/lib/posts"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const [searchTerm, setSearchTerm] = useState(initialQuery)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const { searchPosts } = usePosts()

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery)
    }
  }, [initialQuery])

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const results = searchPosts(query)
      setSearchResults(results)
    } catch (error) {
      console.error("Search error:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(searchTerm)
    // Update URL without page reload
    const url = new URL(window.location.href)
    if (searchTerm.trim()) {
      url.searchParams.set("q", searchTerm)
    } else {
      url.searchParams.delete("q")
    }
    window.history.replaceState({}, "", url.toString())
  }

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
                <h1 className="text-2xl font-bold mb-2">搜索帖子</h1>
                <p className="text-muted-foreground">搜索论坛中的帖子内容</p>
              </div>

              {/* Search Form */}
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="输入关键词搜索帖子..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-20"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  disabled={isSearching}
                >
                  {isSearching ? "搜索中..." : "搜索"}
                </Button>
              </form>
            </div>

            {/* Search Results */}
            <div className="space-y-4">
              {searchTerm && (
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">
                    搜索结果 "{searchTerm}" ({searchResults.length} 个结果)
                  </h2>
                </div>
              )}

              {isSearching && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">搜索中...</p>
                  </CardContent>
                </Card>
              )}

              {!isSearching && searchTerm && searchResults.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">没有找到相关帖子</p>
                  </CardContent>
                </Card>
              )}

              {!isSearching && searchResults.length > 0 && (
                <div className="space-y-4">
                  {searchResults.map((post) => {
                    const authorLevel = DEMO_USER_LEVELS[post.author.id] || calculateUserLevel(90)
                    return (
                      <Card key={post.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary" className="text-xs">
                                  {post.topic}
                                </Badge>
                                {post.isSticky && (
                                  <Badge variant="default" className="text-xs">
                                    置顶
                                  </Badge>
                                )}
                              </div>
                              <CardTitle className="text-lg hover:text-primary">
                                <Link href={`/post/${post.id}`}>{post.title}</Link>
                              </CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{post.content}</p>

                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <User className="h-3 w-3" />
                                <span>{post.author.name}</span>
                                <UserLevelBadge userLevel={authorLevel} />
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                <span>{post.replyCount} 回复</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span>{post.viewCount} 浏览</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{post.createdAt}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}

              {!searchTerm && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">输入关键词开始搜索</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
