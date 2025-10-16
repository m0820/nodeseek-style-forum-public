"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ForumHeader } from "@/components/forum-header"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { usePostsStore } from "@/lib/posts"
import { useAuthStore } from "@/lib/auth"

const topics = [
  { value: "daily", label: "日常" },
  { value: "tech", label: "技术" },
  { value: "info", label: "信息" },
  { value: "review", label: "测评" },
  { value: "trade", label: "交易" },
  { value: "carpool", label: "拼车" },
  { value: "promotion", label: "推广" },
]

export default function EditPostPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { getPostById, updatePost } = usePostsStore()
  const { user } = useAuthStore()

  const postId = params.id as string
  const post = getPostById(postId)

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [topic, setTopic] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (post) {
      setTitle(post.title)
      setContent(post.content)
      setTopic(post.topic)
    }
  }, [post])

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <ForumHeader />
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">话题不存在</h1>
            <Link href="/">
              <Button>返回首页</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (user?.id !== post.author.id) {
    return (
      <div className="min-h-screen bg-background">
        <ForumHeader />
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">无权限编辑</h1>
            <p className="text-muted-foreground mb-6">您只能编辑自己发布的话题</p>
            <Link href={`/post/${postId}`}>
              <Button>返回话题</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !topic) {
      toast({
        title: "请填写完整信息",
        description: "标题、内容和分类都是必填项",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      updatePost(postId, {
        title: title.trim(),
        content: content.trim(),
        topic,
      })

      toast({
        title: "更新成功",
        description: "您的话题已成功更新",
      })

      router.push(`/post/${postId}`)
    } catch (error) {
      toast({
        title: "更新失败",
        description: "请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <ForumHeader />

        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="mb-6">
            <Link href={`/post/${postId}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回话题
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>编辑话题</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">标题</Label>
                  <Input
                    id="title"
                    placeholder="输入话题标题..."
                    className="text-lg"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={100}
                  />
                  <div className="text-xs text-muted-foreground text-right">{title.length}/100</div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topic">分类</Label>
                  <Select value={topic} onValueChange={setTopic}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择话题分类" />
                    </SelectTrigger>
                    <SelectContent>
                      {topics.map((topicItem) => (
                        <SelectItem key={topicItem.value} value={topicItem.value}>
                          {topicItem.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">内容</Label>
                  <Textarea
                    id="content"
                    placeholder="分享您的想法..."
                    className="min-h-[300px] resize-none"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    maxLength={5000}
                  />
                  <div className="text-xs text-muted-foreground text-right">{content.length}/5000</div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting ? "保存中..." : "保存更改"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
