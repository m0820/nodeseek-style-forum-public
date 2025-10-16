"use client"

import { createContext, useContext, useState, useEffect, useMemo, useCallback, type ReactNode } from "react"

export interface Post {
  id: string
  title: string
  content: string
  topic: string
  author: {
    id: string
    name: string
    avatar: string
  }
  replyCount: number
  viewCount: number
  createdAt: string
  updatedAt: string
  isSticky?: boolean
  isDraft?: boolean
}

interface PostsState {
  posts: Post[]
  drafts: Post[]
  addPost: (post: Omit<Post, "id" | "createdAt" | "updatedAt" | "replyCount" | "viewCount">) => void
  updatePost: (id: string, updates: Partial<Post>) => void
  deletePost: (id: string) => void
  saveDraft: (draft: Omit<Post, "id" | "createdAt" | "updatedAt" | "replyCount" | "viewCount">) => void
  deleteDraft: (id: string) => void
  getPostById: (id: string) => Post | undefined
  getPostsByTopic: (topic: string) => Post[]
  incrementViewCount: (id: string) => void
  searchPosts: (query: string) => Post[]
}

const PostsContext = createContext<PostsState | undefined>(undefined)

const initialPosts: Post[] = [
  {
    id: "1",
    title: '升级报告："无限测试"，营运系统，一键导出',
    content: "NodeQuality测试脚本发布",
    topic: "tech",
    author: { id: "1", name: "walker", avatar: "/user-walker.jpg" },
    replyCount: 351,
    viewCount: 55911,
    createdAt: "5天前",
    updatedAt: "5天前",
    isSticky: true,
  },
  {
    id: "2",
    title: "公告：NodeSeek启用DeepFlood社区优化计划",
    content: "DeepFlood社区优化计划启动",
    topic: "info",
    author: { id: "2", name: "jkoy", avatar: "/user-jkoy.jpg" },
    replyCount: 91,
    viewCount: 5276,
    createdAt: "23分钟前",
    updatedAt: "23分钟前",
  },
  {
    id: "3",
    title: "今天的天气真不错，适合出门散步",
    content: "分享一下今天的好心情，阳光明媚的日子总是让人心情愉悦",
    topic: "daily",
    author: { id: "3", name: "yuzu", avatar: "/user-yuzu.jpg" },
    replyCount: 15,
    viewCount: 234,
    createdAt: "刚刚",
    updatedAt: "刚刚",
  },
  {
    id: "4",
    title: "分享一个实用的 React Hook 封装技巧",
    content: "最近在项目中总结的一些 React Hook 最佳实践，希望对大家有帮助",
    topic: "tech",
    author: { id: "4", name: "David", avatar: "/user-david.jpg" },
    replyCount: 42,
    viewCount: 1205,
    createdAt: "2小时前",
    updatedAt: "2小时前",
  },
  {
    id: "5",
    title: "NodeSeek 新功能上线通知",
    content: "我们刚刚发布了一些新功能，包括更好的搜索体验和消息通知",
    topic: "info",
    author: { id: "5", name: "Si", avatar: "/user-si.jpg" },
    replyCount: 67,
    viewCount: 2341,
    createdAt: "1天前",
    updatedAt: "1天前",
  },
  {
    id: "6",
    title: "MacBook Pro M3 深度体验报告",
    content: "使用了一个月的 MacBook Pro M3，来分享一下真实的使用感受",
    topic: "review",
    author: { id: "6", name: "toboo", avatar: "/user-toboo.jpg" },
    replyCount: 89,
    viewCount: 3456,
    createdAt: "3天前",
    updatedAt: "3天前",
  },
  {
    id: "7",
    title: "出售闲置 iPhone 14 Pro，9成新",
    content: "因为换了新手机，出售闲置的 iPhone 14 Pro，成色很好，有意者私信",
    topic: "trade",
    author: { id: "7", name: "Evan", avatar: "/user-evan.jpg" },
    replyCount: 23,
    viewCount: 567,
    createdAt: "6小时前",
    updatedAt: "6小时前",
  },
  {
    id: "8",
    title: "周末一起去爬山吗？寻找同行伙伴",
    content: "计划这个周末去附近的山上徒步，有没有小伙伴一起？",
    topic: "carpool",
    author: { id: "8", name: "yuzu", avatar: "/user-yuzu.jpg" },
    replyCount: 12,
    viewCount: 189,
    createdAt: "45分钟前",
    updatedAt: "45分钟前",
  },
  {
    id: "9",
    title: "推荐一个超好用的在线工具网站",
    content: "最近发现了一个集合了很多实用工具的网站，分享给大家",
    topic: "promotion",
    author: { id: "9", name: "David", avatar: "/user-david.jpg" },
    replyCount: 34,
    viewCount: 892,
    createdAt: "4小时前",
    updatedAt: "4小时前",
  },
  {
    id: "10",
    title: "今天做了一道新菜，味道还不错",
    content: "尝试了一个新的菜谱，家人都说好吃，分享一下制作过程",
    topic: "daily",
    author: { id: "10", name: "Si", avatar: "/user-si.jpg" },
    replyCount: 8,
    viewCount: 156,
    createdAt: "3小时前",
    updatedAt: "3小时前",
  },
  {
    id: "11",
    title: "分享一些生活小窍门，让日常更便利",
    content: "整理了一些实用的生活小技巧，希望能帮助大家提高生活质量",
    topic: "daily",
    author: { id: "11", name: "walker", avatar: "/user-walker.jpg" },
    replyCount: 27,
    viewCount: 445,
    createdAt: "8小时前",
    updatedAt: "8小时前",
  },
  {
    id: "12",
    title: "Next.js 14 新特性详解和最佳实践",
    content: "深入解析 Next.js 14 的新功能，包括 App Router 和 Server Components",
    topic: "tech",
    author: { id: "12", name: "toboo", avatar: "/user-toboo.jpg" },
    replyCount: 156,
    viewCount: 2890,
    createdAt: "12小时前",
    updatedAt: "12小时前",
  },
  {
    id: "13",
    title: "重要通知：论坛维护时间调整",
    content: "由于技术升级需要，论坛维护时间将调整到本周日凌晨进行",
    topic: "info",
    author: { id: "13", name: "jkoy", avatar: "/user-jkoy.jpg" },
    replyCount: 43,
    viewCount: 1567,
    createdAt: "2天前",
    updatedAt: "2天前",
  },
  {
    id: "14",
    title: "iPhone 15 Pro Max 长期使用体验分享",
    content: "使用了半年的 iPhone 15 Pro Max，来谈谈优缺点和使用感受",
    topic: "review",
    author: { id: "14", name: "Evan", avatar: "/user-evan.jpg" },
    replyCount: 78,
    viewCount: 2134,
    createdAt: "4天前",
    updatedAt: "4天前",
  },
  {
    id: "15",
    title: "求购二手 MacBook Air M2，预算8000左右",
    content: "想入手一台二手的 MacBook Air M2，主要用于日常办公和轻度开发",
    topic: "trade",
    author: { id: "15", name: "Si", avatar: "/user-si.jpg" },
    replyCount: 19,
    viewCount: 387,
    createdAt: "1小时前",
    updatedAt: "1小时前",
  },
  {
    id: "16",
    title: "明天去机场，有同路的朋友吗？",
    content: "明天下午2点从市中心出发去机场，有顺路的朋友可以一起拼车",
    topic: "carpool",
    author: { id: "16", name: "David", avatar: "/user-david.jpg" },
    replyCount: 7,
    viewCount: 123,
    createdAt: "30分钟前",
    updatedAt: "30分钟前",
  },
  {
    id: "17",
    title: "推荐几个提高工作效率的Chrome插件",
    content: "分享一些我常用的Chrome插件，能够显著提升日常工作效率",
    topic: "promotion",
    author: { id: "17", name: "yuzu", avatar: "/user-yuzu.jpg" },
    replyCount: 52,
    viewCount: 1245,
    createdAt: "7小时前",
    updatedAt: "7小时前",
  },
]

export function PostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [drafts, setDrafts] = useState<Post[]>([])

  useEffect(() => {
    // Clear old localStorage data to ensure we use the latest initialPosts
    localStorage.removeItem("posts-storage")
    setPosts(initialPosts)
  }, [])

  // Save posts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("posts-storage", JSON.stringify({ state: { posts, drafts } }))
  }, [posts, drafts])

  const addPost = useCallback((postData: Omit<Post, "id" | "createdAt" | "updatedAt" | "replyCount" | "viewCount">) => {
    const newPost: Post = {
      ...postData,
      id: Date.now().toString(),
      createdAt: "刚刚",
      updatedAt: "刚刚",
      replyCount: 0,
      viewCount: 0,
      isDraft: false,
    }
    setPosts((prev) => [newPost, ...prev])
  }, [])

  const updatePost = useCallback((id: string, updates: Partial<Post>) => {
    setPosts((prev) => prev.map((post) => (post.id === id ? { ...post, ...updates, updatedAt: "刚刚" } : post)))
  }, [])

  const deletePost = useCallback((id: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== id))
  }, [])

  const saveDraft = useCallback(
    (draftData: Omit<Post, "id" | "createdAt" | "updatedAt" | "replyCount" | "viewCount">) => {
      const newDraft: Post = {
        ...draftData,
        id: Date.now().toString(),
        createdAt: "刚刚",
        updatedAt: "刚刚",
        replyCount: 0,
        viewCount: 0,
        isDraft: true,
      }
      setDrafts((prev) => [newDraft, ...prev])
    },
    [],
  )

  const deleteDraft = useCallback((id: string) => {
    setDrafts((prev) => prev.filter((draft) => draft.id !== id))
  }, [])

  const getPostById = useCallback(
    (id: string) => {
      return posts.find((post) => post.id === id)
    },
    [posts],
  )

  const getPostsByTopic = useCallback(
    (topic: string) => {
      return posts.filter((post) => post.topic === topic)
    },
    [posts],
  )

  const incrementViewCount = useCallback((id: string) => {
    setPosts((prev) => prev.map((post) => (post.id === id ? { ...post, viewCount: post.viewCount + 1 } : post)))
  }, [])

  const searchPosts = useCallback(
    (query: string) => {
      if (!query.trim()) return []

      const searchTerm = query.toLowerCase().trim()
      return posts
        .filter((post) => {
          return (
            post.title.toLowerCase().includes(searchTerm) ||
            post.content.toLowerCase().includes(searchTerm) ||
            post.author.name.toLowerCase().includes(searchTerm) ||
            post.topic.toLowerCase().includes(searchTerm)
          )
        })
        .sort((a, b) => {
          // Sort search results by relevance (title matches first, then content matches)
          const aInTitle = a.title.toLowerCase().includes(searchTerm)
          const bInTitle = b.title.toLowerCase().includes(searchTerm)

          if (aInTitle && !bInTitle) return -1
          if (!aInTitle && bInTitle) return 1

          // If both or neither have title matches, sort by creation time
          const getTimeValue = (timeStr: string) => {
            if (timeStr === "刚刚") return Date.now()
            if (timeStr.includes("分钟前")) {
              const minutes = Number.parseInt(timeStr.replace("分钟前", ""))
              return Date.now() - minutes * 60 * 1000
            }
            if (timeStr.includes("小时前")) {
              const hours = Number.parseInt(timeStr.replace("小时前", ""))
              return Date.now() - hours * 60 * 60 * 1000
            }
            if (timeStr.includes("天前")) {
              const days = Number.parseInt(timeStr.replace("天前", ""))
              return Date.now() - days * 24 * 60 * 60 * 1000
            }
            return Date.now()
          }

          return getTimeValue(b.createdAt) - getTimeValue(a.createdAt)
        })
    },
    [posts],
  )

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      // Sticky posts always come first
      if (a.isSticky && !b.isSticky) return -1
      if (!a.isSticky && b.isSticky) return 1

      // For posts with same sticky status, sort by creation time
      // Convert relative time strings to comparable values for proper sorting
      const getTimeValue = (timeStr: string) => {
        if (timeStr === "刚刚") return Date.now()
        if (timeStr.includes("分钟前")) {
          const minutes = Number.parseInt(timeStr.replace("分钟前", ""))
          return Date.now() - minutes * 60 * 1000
        }
        if (timeStr.includes("小时前")) {
          const hours = Number.parseInt(timeStr.replace("小时前", ""))
          return Date.now() - hours * 60 * 60 * 1000
        }
        if (timeStr.includes("天前")) {
          const days = Number.parseInt(timeStr.replace("天前", ""))
          return Date.now() - days * 24 * 60 * 60 * 1000
        }
        // For other formats, use current time as fallback
        return Date.now()
      }

      return getTimeValue(b.createdAt) - getTimeValue(a.createdAt)
    })
  }, [posts])

  const contextValue = useMemo(
    () => ({
      posts: sortedPosts,
      drafts,
      addPost,
      updatePost,
      deletePost,
      saveDraft,
      deleteDraft,
      getPostById,
      getPostsByTopic,
      incrementViewCount,
      searchPosts,
    }),
    [
      sortedPosts,
      drafts,
      addPost,
      updatePost,
      deletePost,
      saveDraft,
      deleteDraft,
      getPostById,
      getPostsByTopic,
      incrementViewCount,
      searchPosts,
    ],
  )

  return <PostsContext.Provider value={contextValue}>{children}</PostsContext.Provider>
}

export function usePosts() {
  const context = useContext(PostsContext)
  if (context === undefined) {
    throw new Error("usePosts must be used within a PostsProvider")
  }
  return context
}

export function usePostsStore() {
  return usePosts()
}
