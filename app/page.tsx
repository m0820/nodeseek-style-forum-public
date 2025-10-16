"use client"

import { ForumHeader } from "@/components/forum-header"
import { ForumSidebar } from "@/components/forum-sidebar"
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthDialog } from "@/components/auth/auth-dialog"
import { Icons } from "@/components/icons"
import Link from "next/link"
import { usePostsStore } from "@/lib/posts"
import { useAuth } from "@/lib/auth"
import { useState } from "react"

export default function HomePage() {
  const { posts } = usePostsStore()
  const { user } = useAuth()
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 10

  const totalPages = Math.ceil(posts.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const currentPosts = posts.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-white">
      <ForumHeader />

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="hidden lg:block">
            <ForumSidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {!user && (
              <Card className="bg-gray-50 border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold mb-2 text-gray-900">你好朋友，欢迎来到！</h2>
                      <p className="text-gray-600">
                        我的朋友，看起来你是新来的，如果想要
                        <br />
                        与我们的讨论，点击下面的按钮！
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <AuthDialog defaultMode="login">
                        <Button className="bg-green-600 hover:bg-green-700 text-white font-medium">登录</Button>
                      </AuthDialog>
                      <AuthDialog defaultMode="register">
                        <Button variant="outline" className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50">
                          注册
                        </Button>
                      </AuthDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Post Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-gray-800">最新话题</h1>
                <Badge variant="secondary" className="text-xs bg-red-50 text-red-600 border border-red-200">
                  <Icons.TrendingUp />
                  <span className="ml-1">热门</span>
                </Badge>
              </div>
              {user ? (
                <Link href="/new-post">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
                    <Icons.Plus />
                    <span className="ml-2">发布新话题</span>
                  </Button>
                </Link>
              ) : (
                <AuthDialog defaultMode="login">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
                    <Icons.Plus />
                    <span className="ml-2">发布新话题</span>
                  </Button>
                </AuthDialog>
              )}
            </div>

            {/* Posts List */}
            <div className="space-y-3">
              {posts.length > 0 ? (
                currentPosts.map((post) => <PostCard key={post.id} {...post} />)
              ) : (
                <Card className="bg-white border-2 border-gray-200 shadow-sm">
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-600 mb-4">还没有任何话题</p>
                    {user ? (
                      <Link href="/new-post">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                          <Icons.Plus />
                          <span className="ml-2">发布第一个话题</span>
                        </Button>
                      </Link>
                    ) : (
                      <AuthDialog defaultMode="login">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">登录后发布话题</Button>
                      </AuthDialog>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="border-gray-300 text-gray-500 bg-transparent disabled:opacity-50"
                >
                  上一页
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1
                    return (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "ghost"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 p-0 ${
                          page === currentPage
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </Button>
                    )
                  })}
                  {totalPages > 5 && (
                    <>
                      <span className="px-2 text-gray-500">...</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePageChange(totalPages)}
                        className="w-8 h-8 p-0 text-gray-600 hover:bg-gray-100"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="border-gray-300 text-gray-500 hover:bg-gray-100 bg-transparent disabled:opacity-50"
                >
                  下一页
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
