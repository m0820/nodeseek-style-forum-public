"use client"

import { useState } from "react"
import { ForumHeader } from "@/components/forum-header"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { UserLevelBadge } from "@/components/user-level-badge"
import { DEMO_USER_LEVELS, calculateUserLevel, getNextLevelInfo } from "@/lib/user-level"
import { MessageSquare, Heart, Eye, Trophy, Activity, Plus, BookOpen } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { usePostsStore } from "@/lib/posts"
import { useCommentsStore } from "@/lib/comments"

export default function DashboardPage() {
  const { user } = useAuth()
  const { posts } = usePostsStore()
  const { comments } = useCommentsStore()
  const [activeTab, setActiveTab] = useState("overview")

  if (!user) return null

  const userLevel = DEMO_USER_LEVELS[user.id] || calculateUserLevel(90)
  const nextLevelInfo = getNextLevelInfo(userLevel.drumsticks)

  const userPosts = posts.filter((post) => post.author.id === user.id)
  const userComments = comments.filter((comment) => comment.author.id === user.id)
  const recentPosts = userPosts.slice(0, 3)
  const recentComments = userComments.slice(0, 5)

  // Calculate statistics
  const totalViews = userPosts.reduce((sum, post) => sum + post.viewCount, 0)
  const totalLikes = userPosts.reduce((sum, post) => sum + post.likeCount, 0)
  const avgViewsPerPost = userPosts.length > 0 ? Math.round(totalViews / userPosts.length) : 0

  // Activity data for the last 7 days (mock data)
  const weeklyActivity = [
    { day: "周一", posts: 2, comments: 5 },
    { day: "周二", posts: 1, comments: 8 },
    { day: "周三", posts: 3, comments: 4 },
    { day: "周四", posts: 0, comments: 6 },
    { day: "周五", posts: 2, comments: 7 },
    { day: "周六", posts: 1, comments: 3 },
    { day: "周日", posts: 2, comments: 9 },
  ]

  const achievements = [
    {
      id: 1,
      title: "初来乍到",
      description: "发布第一个话题",
      icon: "🎉",
      unlocked: userPosts.length > 0,
      progress: Math.min(userPosts.length, 1),
    },
    {
      id: 2,
      title: "活跃用户",
      description: "发布10个话题",
      icon: "🔥",
      unlocked: userPosts.length >= 10,
      progress: Math.min(userPosts.length / 10, 1),
    },
    {
      id: 3,
      title: "评论达人",
      description: "发表50条评论",
      icon: "💬",
      unlocked: userComments.length >= 50,
      progress: Math.min(userComments.length / 50, 1),
    },
    {
      id: 4,
      title: "人气王",
      description: "获得100个赞",
      icon: "❤️",
      unlocked: totalLikes >= 100,
      progress: Math.min(totalLikes / 100, 1),
    },
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <ForumHeader />

        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">我的仪表盘</h1>
                <p className="text-muted-foreground">欢迎回来，{user.username}！</p>
              </div>
              <Link href="/new-post">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  发布话题
                </Button>
              </Link>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">概览</TabsTrigger>
              <TabsTrigger value="activity">活动</TabsTrigger>
              <TabsTrigger value="achievements">成就</TabsTrigger>
              <TabsTrigger value="analytics">数据</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* User Level Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    等级进度
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                      <AvatarFallback className="text-xl">{user.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold">{user.username}</h3>
                        <UserLevelBadge userLevel={userLevel} showDrumsticks={true} size="md" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>当前鸡腿: {userLevel.drumsticks}</span>
                          {nextLevelInfo && <span>距离下一级: {nextLevelInfo.required - userLevel.drumsticks}</span>}
                        </div>
                        {nextLevelInfo && (
                          <Progress value={(userLevel.drumsticks / nextLevelInfo.required) * 100} className="h-2" />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">{userPosts.length}</div>
                      <div className="text-sm text-muted-foreground">话题</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">{userComments.length}</div>
                      <div className="text-sm text-muted-foreground">评论</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">{totalViews}</div>
                      <div className="text-sm text-muted-foreground">浏览</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">{totalLikes}</div>
                      <div className="text-sm text-muted-foreground">获赞</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="text-2xl font-bold">{userPosts.length}</p>
                        <p className="text-sm text-muted-foreground">发布话题</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-8 w-8 text-green-500" />
                      <div>
                        <p className="text-2xl font-bold">{userComments.length}</p>
                        <p className="text-sm text-muted-foreground">发表评论</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <Eye className="h-8 w-8 text-purple-500" />
                      <div>
                        <p className="text-2xl font-bold">{avgViewsPerPost}</p>
                        <p className="text-sm text-muted-foreground">平均浏览</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <Heart className="h-8 w-8 text-red-500" />
                      <div>
                        <p className="text-2xl font-bold">{totalLikes}</p>
                        <p className="text-sm text-muted-foreground">获得点赞</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      最近话题
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recentPosts.length > 0 ? (
                      <div className="space-y-3">
                        {recentPosts.map((post) => (
                          <div key={post.id} className="border-l-2 border-primary/20 pl-4">
                            <Link href={`/post/${post.id}`} className="hover:text-primary">
                              <h4 className="font-medium line-clamp-1">{post.title}</h4>
                            </Link>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {post.viewCount}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                {post.replyCount}
                              </span>
                              <span>{post.createdAt}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">还没有发布话题</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      最近评论
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recentComments.length > 0 ? (
                      <div className="space-y-3">
                        {recentComments.map((comment) => (
                          <div key={comment.id} className="border-l-2 border-green-500/20 pl-4">
                            <p className="text-sm line-clamp-2">{comment.content}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <span>{comment.createdAt}</span>
                              <Badge variant="outline" className="text-xs">
                                评论
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">还没有发表评论</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    本周活动统计
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weeklyActivity.map((day, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-12 text-sm text-muted-foreground">{day.day}</div>
                        <div className="flex-1 flex items-center gap-2">
                          <div className="flex items-center gap-1 text-sm">
                            <BookOpen className="h-3 w-3 text-blue-500" />
                            <span>{day.posts}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <MessageSquare className="h-3 w-3 text-green-500" />
                            <span>{day.comments}</span>
                          </div>
                          <div className="flex-1 flex gap-1">
                            {Array.from({ length: day.posts }).map((_, i) => (
                              <div key={i} className="h-2 w-4 bg-blue-500 rounded-sm" />
                            ))}
                            {Array.from({ length: day.comments }).map((_, i) => (
                              <div key={i} className="h-2 w-2 bg-green-500 rounded-sm" />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    成就系统
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((achievement) => (
                      <Card
                        key={achievement.id}
                        className={achievement.unlocked ? "border-green-200 bg-green-50" : "border-gray-200"}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{achievement.icon}</div>
                            <div className="flex-1">
                              <h4 className="font-medium">{achievement.title}</h4>
                              <p className="text-sm text-muted-foreground">{achievement.description}</p>
                              <div className="mt-2">
                                <Progress value={achievement.progress * 100} className="h-2" />
                                <p className="text-xs text-muted-foreground mt-1">
                                  {Math.round(achievement.progress * 100)}% 完成
                                </p>
                              </div>
                            </div>
                            {achievement.unlocked && (
                              <Badge variant="default" className="bg-green-500">
                                已解锁
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">内容统计</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">总话题数</span>
                        <span className="font-medium">{userPosts.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">总评论数</span>
                        <span className="font-medium">{userComments.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">平均字数</span>
                        <span className="font-medium">
                          {userPosts.length > 0
                            ? Math.round(
                                userPosts.reduce((sum, post) => sum + post.content.length, 0) / userPosts.length,
                              )
                            : 0}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">互动数据</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">总浏览量</span>
                        <span className="font-medium">{totalViews}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">总点赞数</span>
                        <span className="font-medium">{totalLikes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">互动率</span>
                        <span className="font-medium">
                          {totalViews > 0 ? Math.round((totalLikes / totalViews) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">等级信息</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">当前等级</span>
                        <UserLevelBadge userLevel={userLevel} />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">鸡腿数量</span>
                        <span className="font-medium">{userLevel.drumsticks} 🍗</span>
                      </div>
                      {nextLevelInfo && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">升级还需</span>
                          <span className="font-medium">{nextLevelInfo.required - userLevel.drumsticks}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
