"use client"

import { useParams } from "next/navigation"
import { ForumHeader } from "@/components/forum-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostCard } from "@/components/post-card"
import { ArrowLeft, Calendar, Settings } from "lucide-react"
import { UserLevelBadge } from "@/components/user-level-badge"
import { DEMO_USER_LEVELS, calculateUserLevel } from "@/lib/user-level"
import Link from "next/link"
import { useAuthStore } from "@/lib/auth"
import { usePostsStore } from "@/lib/posts"
import { useCommentsStore } from "@/lib/comments"

// Mock user data - in a real app this would come from a user store
const getUserById = (id: string) => {
  const users = [
    {
      id: "1",
      username: "walker",
      email: "walker@example.com",
      avatar: "/user-walker.jpg",
      bio: "热爱技术，专注于前端开发和用户体验设计。",
      joinDate: "2023年3月",
      location: "北京",
      website: "https://walker.dev",
      postCount: 156,
      commentCount: 892,
      likeCount: 1234,
    },
    {
      id: "2",
      username: "David",
      email: "david@example.com",
      avatar: "/user-david.jpg",
      bio: "全栈开发者，喜欢探索新技术。",
      joinDate: "2023年5月",
      location: "上海",
      website: "",
      postCount: 89,
      commentCount: 456,
      likeCount: 678,
    },
  ]
  return users.find((user) => user.id === id)
}

export default function UserProfilePage() {
  const params = useParams()
  const { user: currentUser } = useAuthStore()
  const { posts } = usePostsStore()
  const { comments } = useCommentsStore()

  const userId = params.id as string
  const profileUser = getUserById(userId)
  const userLevel = DEMO_USER_LEVELS[userId] || calculateUserLevel(90)

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-background">
        <ForumHeader />
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">用户不存在</h1>
            <p className="text-muted-foreground mb-6">您访问的用户可能不存在</p>
            <Link href="/">
              <Button>返回首页</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const userPosts = posts.filter((post) => post.author.id === userId)
  const userComments = comments.filter((comment) => comment.author.id === userId)
  const isOwnProfile = currentUser?.id === userId

  return (
    <div className="min-h-screen bg-background">
      <ForumHeader />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回首页
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileUser.avatar || "/placeholder.svg"} alt={profileUser.username} />
                  <AvatarFallback className="text-2xl">{profileUser.username.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl font-bold">{profileUser.username}</h1>
                        <UserLevelBadge userLevel={userLevel} showDrumsticks={true} size="md" />
                      </div>
                      <p className="text-muted-foreground mb-3">{profileUser.bio}</p>
                    </div>
                    {isOwnProfile && (
                      <Link href="/settings">
                        <Button variant="outline">
                          <Settings className="mr-2 h-4 w-4" />
                          编辑资料
                        </Button>
                      </Link>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{profileUser.postCount}</div>
                      <div className="text-sm text-muted-foreground">话题</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{profileUser.commentCount}</div>
                      <div className="text-sm text-muted-foreground">评论</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{profileUser.likeCount}</div>
                      <div className="text-sm text-muted-foreground">获赞</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{userLevel.drumsticks}</div>
                      <div className="text-sm text-muted-foreground">鸡腿 🍗</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>加入于 {profileUser.joinDate}</span>
                    </div>
                    {profileUser.location && (
                      <div className="flex items-center gap-1">
                        <span>📍 {profileUser.location}</span>
                      </div>
                    )}
                    {profileUser.website && (
                      <div className="flex items-center gap-1">
                        <span>🔗</span>
                        <a
                          href={profileUser.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {profileUser.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Tabs */}
          <Tabs defaultValue="posts" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="posts">话题 ({userPosts.length})</TabsTrigger>
              <TabsTrigger value="comments">评论 ({userComments.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-4">
              {userPosts.length > 0 ? (
                userPosts.map((post) => <PostCard key={post.id} {...post} />)
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">还没有发布任何话题</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="comments" className="space-y-4">
              {userComments.length > 0 ? (
                userComments.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                          <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-sm">{comment.author.name}</span>
                            <UserLevelBadge userLevel={DEMO_USER_LEVELS[comment.author.id] || calculateUserLevel(90)} />
                            <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
                            <Badge variant="outline" className="text-xs">
                              评论
                            </Badge>
                          </div>
                          <p className="text-sm leading-relaxed">{comment.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">还没有发表任何评论</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
