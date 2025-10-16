"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { UserLevelBadge } from "@/components/user-level-badge"
import { DEMO_USER_LEVELS, calculateUserLevel } from "@/lib/user-level"
import { type Comment, useCommentsStore } from "@/lib/comments"
import { useAuthStore } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

interface CommentItemProps {
  comment: Comment
  onReply?: () => void
}

export function CommentItem({ comment, onReply }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [editContent, setEditContent] = useState(comment.content)

  const { addComment, updateComment, deleteComment, getRepliesByCommentId, likeComment, unlikeComment } =
    useCommentsStore()
  const { user } = useAuthStore()
  const { toast } = useToast()

  const replies = getRepliesByCommentId(comment.id)
  const isLiked = user ? comment.likedBy.includes(user.id) : false
  const isAuthor = user?.id === comment.author.id
  const commentAuthorLevel = DEMO_USER_LEVELS[comment.author.id] || calculateUserLevel(90)

  const handleLike = () => {
    if (!user) {
      toast({
        title: "请先登录",
        description: "登录后才能点赞评论",
        variant: "destructive",
      })
      return
    }

    if (isLiked) {
      unlikeComment(comment.id, user.id)
    } else {
      likeComment(comment.id, user.id)
    }
  }

  const handleReply = () => {
    if (!user) {
      toast({
        title: "请先登录",
        description: "登录后才能回复评论",
        variant: "destructive",
      })
      return
    }

    if (!replyContent.trim()) {
      toast({
        title: "请输入回复内容",
        variant: "destructive",
      })
      return
    }

    addComment({
      postId: comment.postId,
      content: replyContent.trim(),
      parentId: comment.id,
      author: {
        id: user.id,
        name: user.username,
        avatar: user.avatar || "/placeholder.svg",
      },
    })

    setReplyContent("")
    setIsReplying(false)
    toast({
      title: "回复成功",
    })
  }

  const handleEdit = () => {
    if (!editContent.trim()) {
      toast({
        title: "请输入评论内容",
        variant: "destructive",
      })
      return
    }

    updateComment(comment.id, { content: editContent.trim() })
    setIsEditing(false)
    toast({
      title: "编辑成功",
    })
  }

  const handleDelete = () => {
    if (confirm("确定要删除这条评论吗？此操作无法撤销。")) {
      deleteComment(comment.id)
      toast({
        title: "删除成功",
      })
    }
  }

  return (
    <div className="space-y-3">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
              <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-sm">{comment.author.name}</span>
                <UserLevelBadge userLevel={commentAuthorLevel} />
                <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
                {comment.updatedAt !== comment.createdAt && (
                  <span className="text-xs text-muted-foreground">(已编辑)</span>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="编辑评论..."
                    className="min-h-[80px] resize-none"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleEdit}>
                      <Icons.Send />
                      <span className="ml-2">保存</span>
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                      取消
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm leading-relaxed mb-3 whitespace-pre-wrap">{comment.content}</p>

                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLike}
                      className={`h-7 px-2 ${isLiked ? "text-red-500" : ""}`}
                    >
                      <Icons.Heart className={`mr-1 h-3 w-3 ${isLiked ? "fill-current" : ""}`} />
                      {comment.likes > 0 && comment.likes}
                    </Button>

                    <Button variant="ghost" size="sm" onClick={() => setIsReplying(!isReplying)} className="h-7 px-2">
                      <Icons.MessageCircle />
                      <span className="ml-1">回复</span>
                    </Button>

                    {isAuthor && (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="h-7 px-2">
                          <Icons.Edit />
                          <span className="ml-1">编辑</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleDelete}
                          className="h-7 px-2 text-destructive hover:text-destructive"
                        >
                          <Icons.Trash2 />
                          <span className="ml-1">删除</span>
                        </Button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reply Form */}
      {isReplying && (
        <div className="ml-11">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="写下您的回复..."
                  className="min-h-[80px] resize-none"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleReply}>
                    <Icons.Send />
                    <span className="ml-2">回复</span>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsReplying(false)}>
                    取消
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Replies */}
      {replies.length > 0 && (
        <div className="ml-11 space-y-3">
          {replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} />
          ))}
        </div>
      )}
    </div>
  )
}
