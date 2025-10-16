"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ForumHeader } from "@/components/forum-header"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AIAssistant } from "@/components/ai-assistant"
import { useToast } from "@/hooks/use-toast"
import { Icons } from "@/components/icons"
import Link from "next/link"
import { usePostsStore } from "@/lib/posts"
import { useAuth } from "@/lib/auth"
import { useCategoriesStore } from "@/lib/categories"

export default function NewPostPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [topic, setTopic] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAI, setShowAI] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { addPost, saveDraft } = usePostsStore()
  const { user } = useAuth()
  const { categories } = useCategoriesStore()

  useEffect(() => {
    const categoryParam = searchParams.get("category")
    if (categoryParam && categories.find((cat) => cat.slug === categoryParam)) {
      setTopic(categoryParam)
    }
  }, [searchParams, categories])

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
      addPost({
        title: title.trim(),
        content: content.trim(),
        topic,
        author: {
          id: user?.id || "1",
          name: user?.username || "匿名用户",
          avatar: user?.avatar || "/placeholder.svg",
        },
      })

      toast({
        title: "发布成功",
        description: "您的话题已成功发布",
      })

      const categoryParam = searchParams.get("category")
      if (categoryParam) {
        router.push(`/t/${categoryParam}`)
      } else {
        router.push("/")
      }
    } catch (error) {
      toast({
        title: "发布失败",
        description: "请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = () => {
    if (!title.trim() && !content.trim()) {
      toast({
        title: "无内容可保存",
        description: "请先输入标题或内容",
        variant: "destructive",
      })
      return
    }

    saveDraft({
      title: title.trim() || "未命名草稿",
      content: content.trim(),
      topic: topic || "daily",
      author: {
        id: user?.id || "1",
        name: user?.username || "匿名用户",
        avatar: user?.avatar || "/placeholder.svg",
      },
    })

    toast({
      title: "草稿已保存",
      description: "您可以稍后继续编辑",
    })
  }

  const handleAISuggestion = (suggestion: string) => {
    setContent(suggestion)
    toast({
      title: "AI建议已应用",
      description: "您可以继续编辑内容",
    })
  }

  const getBackLink = () => {
    const categoryParam = searchParams.get("category")
    if (categoryParam) {
      return `/t/${categoryParam}`
    }
    return "/"
  }

  const getBackText = () => {
    const categoryParam = searchParams.get("category")
    if (categoryParam) {
      const category = categories.find((cat) => cat.slug === categoryParam)
      return `返回 ${category?.name || "分类"}`
    }
    return "返回首页"
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <ForumHeader />

        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="mb-6">
            <Link href={getBackLink()}>
              <Button variant="ghost" size="sm">
                <Icons.ArrowLeft />
                <span className="ml-2">{getBackText()}</span>
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>发布新话题</CardTitle>
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
                          {categories.map((category) => (
                            <SelectItem key={category.slug} value={category.slug}>
                              {category.icon} {category.name}
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

                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={handleSaveDraft}>
                        <Icons.Save />
                        <span className="ml-2">保存草稿</span>
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        <Icons.Send />
                        <span className="ml-2">{isSubmitting ? "发布中..." : "发布话题"}</span>
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <AIAssistant mode="post" postTitle={title} topic={topic} onSuggestionSelect={handleAISuggestion} />

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">发帖提示</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground space-y-2">
                  <p>• 标题要简洁明了，准确概括内容</p>
                  <p>• 选择合适的分类便于其他用户找到</p>
                  <p>• 内容要详细，提供足够的背景信息</p>
                  <p>• 遵守社区规则，友善交流</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
