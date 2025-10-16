"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  color: string
  icon: string
  postCount: number
  memberCount: number
  todayPostCount: number
  isActive: boolean
  moderators: string[]
  rules: string[]
}

interface CategoriesState {
  categories: Category[]
  getCategory: (slug: string) => Category | undefined
  getCategoryStats: (slug: string) => { postCount: number; memberCount: number; todayPostCount: number }
  updateCategoryStats: (
    slug: string,
    stats: Partial<{ postCount: number; memberCount: number; todayPostCount: number }>,
  ) => void
}

const CategoriesContext = createContext<CategoriesState | undefined>(undefined)

const initialCategories: Category[] = [
  {
    id: "1",
    name: "日常",
    slug: "daily",
    description: "日常生活讨论，分享生活中的点点滴滴",
    color: "bg-blue-500",
    icon: "☀️",
    postCount: 1234,
    memberCount: 5678,
    todayPostCount: 23,
    isActive: true,
    moderators: ["admin", "moderator1"],
    rules: ["保持友善和尊重的交流氛围", "不发布违法违规内容", "避免重复发帖", "使用合适的标题和标签"],
  },
  {
    id: "2",
    name: "技术",
    slug: "tech",
    description: "技术交流与分享，编程、开发、工具讨论",
    color: "bg-green-500",
    icon: "💻",
    postCount: 2345,
    memberCount: 8901,
    todayPostCount: 45,
    isActive: true,
    moderators: ["admin", "tech_mod"],
    rules: ["分享技术经验和知识", "提供详细的代码示例", "标注技术栈和版本信息", "鼓励开源和协作"],
  },
  {
    id: "3",
    name: "信息",
    slug: "info",
    description: "资讯与信息分享，行业动态、新闻资讯",
    color: "bg-purple-500",
    icon: "📰",
    postCount: 876,
    memberCount: 3456,
    todayPostCount: 12,
    isActive: true,
    moderators: ["admin", "info_mod"],
    rules: ["分享真实可靠的信息", "注明信息来源", "避免传播谣言", "及时更新过时信息"],
  },
  {
    id: "4",
    name: "测评",
    slug: "review",
    description: "产品测评与体验分享，客观评价各类产品",
    color: "bg-orange-500",
    icon: "⭐",
    postCount: 567,
    memberCount: 2345,
    todayPostCount: 8,
    isActive: true,
    moderators: ["admin", "review_mod"],
    rules: ["提供客观真实的评价", "包含详细的使用体验", "避免恶意差评或好评", "声明是否有利益关系"],
  },
  {
    id: "5",
    name: "交易",
    slug: "trade",
    description: "买卖交易信息，二手物品、服务交易",
    color: "bg-red-500",
    icon: "💰",
    postCount: 789,
    memberCount: 4567,
    todayPostCount: 15,
    isActive: true,
    moderators: ["admin", "trade_mod"],
    rules: ["提供真实的商品信息", "明确标注价格和交易方式", "禁止发布违禁物品", "注意交易安全"],
  },
  {
    id: "6",
    name: "拼车",
    slug: "carpool",
    description: "拼车出行信息，共享出行资源",
    color: "bg-yellow-500",
    icon: "🚗",
    postCount: 234,
    memberCount: 1234,
    todayPostCount: 5,
    isActive: true,
    moderators: ["admin", "carpool_mod"],
    rules: ["提供准确的出行信息", "注明出发时间和地点", "确保联系方式有效", "注意出行安全"],
  },
  {
    id: "7",
    name: "推广",
    slug: "promotion",
    description: "推广与宣传，产品推广、活动宣传",
    color: "bg-pink-500",
    icon: "📢",
    postCount: 345,
    memberCount: 2345,
    todayPostCount: 7,
    isActive: true,
    moderators: ["admin", "promo_mod"],
    rules: ["避免过度推广", "提供有价值的内容", "遵守广告发布规范", "不发布虚假宣传"],
  },
]

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)

  const getCategory = (slug: string) => {
    return categories.find((cat) => cat.slug === slug)
  }

  const getCategoryStats = (slug: string) => {
    const category = getCategory(slug)
    return {
      postCount: category?.postCount || 0,
      memberCount: category?.memberCount || 0,
      todayPostCount: category?.todayPostCount || 0,
    }
  }

  const updateCategoryStats = (
    slug: string,
    stats: Partial<{ postCount: number; memberCount: number; todayPostCount: number }>,
  ) => {
    setCategories((prev) => prev.map((cat) => (cat.slug === slug ? { ...cat, ...stats } : cat)))
  }

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        getCategory,
        getCategoryStats,
        updateCategoryStats,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  )
}

export function useCategoriesStore() {
  const context = useContext(CategoriesContext)
  if (context === undefined) {
    throw new Error("useCategoriesStore must be used within a CategoriesProvider")
  }
  return context
}
