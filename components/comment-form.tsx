"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AIAssistant } from "@/components/ai-assistant"
import { Icons } from "@/components/icons"
import { useCommentsStore } from "@/lib/comments"
import { useAuthStore } from "@/lib/auth"
import { usePostsStore } from "@/lib/posts"
import { useToast } from "@/hooks/use-toast"

interface CommentFormProps {
  postId: string
}

export function CommentForm({ postId }: CommentFormProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAI, setShowAI] = useState(false)

  const { addComment } = useCommentsStore()
  const { user } = useAuthStore()
  const { getPostById } = usePostsStore()
  const { toast } = useToast()

  const post = getPostById(postId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "请先登录",
        description: "登录后才能发表评论",
        variant: "destructive",
      })
      return
    }

    if (!content.trim()) {
      toast({
        title: "请输入评论内容",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      addComment({
        postId,
        content: content.trim(),
        author: {
          id: user.id,
          name: user.username,
          avatar: user.avatar || "/placeholder.svg",
        },
      })

      setContent("")
      toast({
        title: "评论成功",
      })
    } catch (error) {
      toast({
        title: "评论失败",
        description: "请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAISuggestion = (suggestion: string) => {
    setContent(suggestion)
    setShowAI(false)
    toast({
      title: "AI建议已应用",
      description: "您可以继续编辑回复",
    })
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground mb-4">登录后参与讨论</p>
          <Button>登录</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">发表评论</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setShowAI(!showAI)} className="text-xs">
              <Icons.Sparkles className="mr-1 h-3 w-3" />
              AI助手
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-3">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="写下您的想法..."
                  className="min-h-[100px] resize-none"
                  maxLength={1000}
                />
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">{content.length}/1000</div>
                  <Button type="submit" disabled={isSubmitting}>
                    <Icons.Send />
                    <span className="ml-2">{isSubmitting ? "发布中..." : "发布评论"}</span>
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {showAI && post && (
        <AIAssistant
          mode="reply"
          postTitle={post.title}
          postContent={post.content}
          onSuggestionSelect={handleAISuggestion}
        />
      )}
    </div>
  )
}
