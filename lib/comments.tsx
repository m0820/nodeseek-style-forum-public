"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Comment {
  id: string
  postId: string
  content: string
  author: {
    id: string
    name: string
    avatar: string
  }
  parentId?: string
  createdAt: string
  updatedAt: string
  likes: number
  likedBy: string[]
}

interface CommentsState {
  comments: Comment[]
  addComment: (comment: Omit<Comment, "id" | "createdAt" | "updatedAt" | "likes" | "likedBy">) => void
  updateComment: (id: string, updates: Partial<Comment>) => void
  deleteComment: (id: string) => void
  getCommentsByPostId: (postId: string) => Comment[]
  getRepliesByCommentId: (commentId: string) => Comment[]
  likeComment: (commentId: string, userId: string) => void
  unlikeComment: (commentId: string, userId: string) => void
}

const CommentsContext = createContext<CommentsState | undefined>(undefined)

const initialComments: Comment[] = [
  {
    id: "1",
    postId: "1",
    content: "这个功能真的很实用！期待更多更新。",
    author: { id: "2", name: "David", avatar: "/user-david.jpg" },
    createdAt: "2小时前",
    updatedAt: "2小时前",
    likes: 5,
    likedBy: ["3", "4", "5"],
  },
  {
    id: "2",
    postId: "1",
    content: "同意楼上，这个测试系统确实解决了很多痛点。",
    author: { id: "3", name: "toboo913", avatar: "/user-toboo.jpg" },
    parentId: "1",
    createdAt: "1小时前",
    updatedAt: "1小时前",
    likes: 2,
    likedBy: ["2", "4"],
  },
]

export function CommentsProvider({ children }: { children: ReactNode }) {
  const [comments, setComments] = useState<Comment[]>(initialComments)

  // Load comments from localStorage on mount
  useEffect(() => {
    const savedComments = localStorage.getItem("comments-storage")
    if (savedComments) {
      try {
        const parsed = JSON.parse(savedComments)
        if (parsed.state?.comments) {
          setComments(parsed.state.comments)
        }
      } catch (error) {
        console.error("Failed to parse saved comments:", error)
      }
    }
  }, [])

  // Save comments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("comments-storage", JSON.stringify({ state: { comments } }))
  }, [comments])

  const addComment = (commentData: Omit<Comment, "id" | "createdAt" | "updatedAt" | "likes" | "likedBy">) => {
    const newComment: Comment = {
      ...commentData,
      id: Date.now().toString(),
      createdAt: "刚刚",
      updatedAt: "刚刚",
      likes: 0,
      likedBy: [],
    }
    setComments((prev) => [...prev, newComment])
  }

  const updateComment = (id: string, updates: Partial<Comment>) => {
    setComments((prev) =>
      prev.map((comment) => (comment.id === id ? { ...comment, ...updates, updatedAt: "刚刚" } : comment)),
    )
  }

  const deleteComment = (id: string) => {
    setComments((prev) => prev.filter((comment) => comment.id !== id && comment.parentId !== id))
  }

  const getCommentsByPostId = (postId: string) => {
    return comments.filter((comment) => comment.postId === postId && !comment.parentId)
  }

  const getRepliesByCommentId = (commentId: string) => {
    return comments.filter((comment) => comment.parentId === commentId)
  }

  const likeComment = (commentId: string, userId: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId && !comment.likedBy.includes(userId)
          ? {
              ...comment,
              likes: comment.likes + 1,
              likedBy: [...comment.likedBy, userId],
            }
          : comment,
      ),
    )
  }

  const unlikeComment = (commentId: string, userId: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId && comment.likedBy.includes(userId)
          ? {
              ...comment,
              likes: comment.likes - 1,
              likedBy: comment.likedBy.filter((id) => id !== userId),
            }
          : comment,
      ),
    )
  }

  return (
    <CommentsContext.Provider
      value={{
        comments,
        addComment,
        updateComment,
        deleteComment,
        getCommentsByPostId,
        getRepliesByCommentId,
        likeComment,
        unlikeComment,
      }}
    >
      {children}
    </CommentsContext.Provider>
  )
}

export function useCommentsStore() {
  const context = useContext(CommentsContext)
  if (context === undefined) {
    throw new Error("useCommentsStore must be used within a CommentsProvider")
  }
  return context
}
