"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ForumHeader } from "@/components/forum-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CommentForm } from "@/components/comment-form"
import { CommentItem } from "@/components/comment-item"
import { Icons } from "@/components/icons"
import { UserLevelBadge } from "@/components/user-level-badge"
import { DEMO_USER_LEVELS, calculateUserLevel } from "@/lib/user-level"
import Link from "next/link"
import { usePostsStore } from "@/lib/posts"
import { useCommentsStore } from "@/lib/comments"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

const topicLabels: Record<string, string> = {
  daily: "日常",
  tech: "技术",
  info: "信息",
  review: "测评",
  trade: "交易",
  carpool: "拼车",
  promotion: "推广",
}

export default function PostPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { getPostById, incrementViewCount, deletePost } = usePostsStore()
  const { getCommentsByPostId } = useCommentsStore()
  const { user } = useAuth()

  const [backNavigation, setBackNavigation] = useState<{
    text: string
    path: string
  }>({
    text: "返回首页",
    path: "/",
  })

  const postId = params.id as string
  const post = getPostById(postId)
  const comments = getCommentsByPostId(postId)

  useEffect(() => {
    if (postId) {
      incrementViewCount(postId)
    }
  }, [postId, incrementViewCount])

  useEffect(() => {
    const referrer = document.referrer
    const currentOrigin = window.location.origin

    console.log("[v0] Referrer:", referrer)
    console.log("[v0] Current origin:", currentOrigin)

    if (referrer && referrer.startsWith(currentOrigin)) {
      const referrerPath = referrer.replace(currentOrigin, "")
      console.log("[v0] Referrer path:", referrerPath)

      // Check if user came from a category page
      if (referrerPath.startsWith("/t/")) {
        console.log("[v0] Setting navigation to category")
        setBackNavigation({
          text: "返回上级",
          path: referrerPath,
        })
      } else if (referrerPath === "/" || referrerPath === "") {
        // User came from homepage
        console.log("[v0] Setting navigation to homepage")
        setBackNavigation({
          text: "返回首页",
          path: "/",
        })
      } else {
        // User came from other pages, default to homepage
        console.log("[v0] Setting navigation to homepage (other page)")
        setBackNavigation({
          text: "返回首页",
          path: "/",
        })
      }
    } else {
      // No referrer or external referrer, default to homepage
      console.log("[v0] No referrer, setting navigation to homepage")
      setBackNavigation({
        text: "返回首页",
        path: "/",
      })
    }
  }, [])

  const handleDelete = () => {
    if (confirm("确定要删除这个话题吗？此操作无法撤销。")) {
      deletePost(postId)
      toast({
        title: "删除成功",
        description: "话题已被删除",
      })
      router.push("/")
    }
  }

  const handleBackNavigation = () => {
    router.push(backNavigation.path)
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <ForumHeader />
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">话题不存在</h1>
            <p className="text-muted-foreground mb-6">您访问的话题可能已被删除或不存在</p>
            <Link href="/">
              <Button>返回首页</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const isAuthor = user?.id === post.author.id
  const authorLevel = DEMO_USER_LEVELS[post.author.id] || calculateUserLevel(90)

  return (
    <div className="min-h-screen bg-background">
      <ForumHeader />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={handleBackNavigation}>
            <Icons.ArrowLeft />
            <span className="ml-2">{backNavigation.text}</span>
          </Button>
        </div>

        <div className="space-y-6">
          {/* Post Content */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <Avatar className="h-12 w-12 flex-shrink-0">
                  <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {post.isSticky && (
                      <Badge variant="destructive" className="text-xs">
                        置顶
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      {topicLabels[post.topic] || post.topic}
                    </Badge>
                  </div>

                  <h1 className="text-xl font-semibold mb-3 leading-relaxed">{post.title}</h1>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span>{post.author.name}</span>
                        <UserLevelBadge userLevel={authorLevel} />
                      </div>
                      <div className="flex items-center gap-1">
                        <Icons.MessageCircle />
                        <span>{comments.length}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icons.Eye />
                        <span>{post.viewCount}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icons.Clock />
                      <span>{post.createdAt}</span>
                    </div>
                  </div>

                  {isAuthor && (
                    <div className="flex gap-2 mb-4">
                      <Link href={`/post/${post.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Icons.Edit />
                          <span className="ml-2">编辑</span>
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" onClick={handleDelete}>
                        <Icons.Trash2 />
                        <span className="ml-2">删除</span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-foreground leading-relaxed">{post.content}</div>
              </div>
            </CardContent>
          </Card>

          {/* Comment Form */}
          <CommentForm postId={postId} />

          {/* Comments List */}
          {comments.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">评论 ({comments.length})</h2>
              <div className="space-y-4">
                {comments.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
