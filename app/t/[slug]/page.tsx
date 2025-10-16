"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { ForumHeader } from "@/components/forum-header"
import { ForumSidebar } from "@/components/forum-sidebar"
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthDialog } from "@/components/auth/auth-dialog"
import { Icons } from "@/components/icons"
import Link from "next/link"
import { useCategoriesStore } from "@/lib/categories"
import { usePostsStore } from "@/lib/posts"
import { useAuth } from "@/lib/auth"

export default function TopicPage() {
  const params = useParams()
  const { getCategory } = useCategoriesStore()
  const { getPostsByTopic } = usePostsStore()
  const { user } = useAuth()
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 10

  const slug = params.slug as string
  const category = getCategory(slug)
  const allPosts = getPostsByTopic(slug)

  const totalPages = Math.ceil(allPosts.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const posts = allPosts.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <ForumHeader />
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">分类不存在</h1>
            <p className="text-muted-foreground mb-6">您访问的分类可能不存在或已被删除</p>
            <Link href="/categories">
              <Button>浏览所有分类</Button>
            </Link>
          </div>
        </div>
      </div>
    )
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
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">
                首页
              </Link>
              <span>/</span>
              <Link href="/categories" className="hover:text-foreground">
                分类
              </Link>
              <span>/</span>
              <span className="text-foreground">{category.name}</span>
            </div>

            {/* Category Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-lg ${category.color} flex items-center justify-center text-3xl`}>
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-2xl">{category.name}</CardTitle>
                      {category.isActive && <Badge variant="secondary">活跃</Badge>}
                    </div>
                    <p className="text-muted-foreground">{category.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/categories">
                      <Button variant="outline" size="sm">
                        <Icons.ArrowLeft />
                        <span className="ml-2">所有分类</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{category.postCount}</div>
                    <div className="text-sm text-muted-foreground">话题</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">{category.memberCount}</div>
                    <div className="text-sm text-muted-foreground">成员</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500">{category.todayPostCount}</div>
                    <div className="text-sm text-muted-foreground">今日新增</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-500">{category.moderators.length}</div>
                    <div className="text-sm text-muted-foreground">版主</div>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">版主：</span>
                  {category.moderators.join(", ")}
                </div>
              </CardContent>
            </Card>

            {/* Category Rules */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">分类规则</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {category.rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary font-medium">{index + 1}.</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Post Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">最新话题</h2>
                <Badge variant="secondary" className="text-xs">
                  <Icons.TrendingUp />
                  <span className="ml-1">热门</span>
                </Badge>
              </div>
              {user ? (
                <Link href={`/new-post?category=${slug}`}>
                  <Button size="sm">
                    <Icons.Plus />
                    <span className="ml-2">发布话题</span>
                  </Button>
                </Link>
              ) : (
                <AuthDialog defaultMode="login">
                  <Button size="sm">
                    <Icons.Plus />
                    <span className="ml-2">发布话题</span>
                  </Button>
                </AuthDialog>
              )}
            </div>

            {/* Posts List */}
            <div className="space-y-3">
              {posts.length > 0 ? (
                posts.map((post) => <PostCard key={post.id} {...post} />)
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground mb-4">这个分类还没有任何话题</p>
                    {user ? (
                      <Link href={`/new-post?category=${slug}`}>
                        <Button>
                          <Icons.Plus />
                          <span className="ml-2">发布第一个话题</span>
                        </Button>
                      </Link>
                    ) : (
                      <AuthDialog defaultMode="login">
                        <Button>登录后发布话题</Button>
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
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    )
                  })}
                  {totalPages > 5 && (
                    <>
                      <span className="px-2 text-muted-foreground">...</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePageChange(totalPages)}
                        className="w-8 h-8 p-0"
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
