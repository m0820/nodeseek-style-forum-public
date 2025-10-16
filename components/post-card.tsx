"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { UserLevelBadge } from "@/components/user-level-badge"
import { DEMO_USER_LEVELS, calculateUserLevel } from "@/lib/user-level"
import Link from "next/link"

interface PostCardProps {
  id: string
  title: string
  author: {
    id: string
    name: string
    avatar: string
  }
  topic: string
  replyCount: number
  viewCount: number
  createdAt: string
  isSticky?: boolean
}

const topicLabels: Record<string, string> = {
  daily: "日常",
  tech: "技术",
  info: "信息",
  review: "测评",
  trade: "交易",
  carpool: "拼车",
  promotion: "推广",
}

export function PostCard({
  id,
  title,
  author,
  topic,
  replyCount,
  viewCount,
  createdAt,
  isSticky = false,
}: PostCardProps) {
  const userLevel = DEMO_USER_LEVELS[author.id] || calculateUserLevel(90)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={author.avatar || "/placeholder.svg"} alt={author.name} />
            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {isSticky && (
                <Badge variant="destructive" className="text-xs">
                  置顶
                </Badge>
              )}
              <Badge variant="secondary" className="text-xs">
                {topicLabels[topic] || topic}
              </Badge>
            </div>

            <Link href={`/post/${id}`}>
              <h3 className="font-medium text-sm leading-relaxed hover:text-primary transition-colors mb-2 line-clamp-2">
                {title}
              </h3>
            </Link>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Link href={`/user/${author.id}`} className="hover:text-foreground transition-colors">
                    {author.name}
                  </Link>
                  <UserLevelBadge userLevel={userLevel} />
                </div>
                <div className="flex items-center gap-1">
                  <Icons.MessageCircle />
                  <span>{replyCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icons.Eye />
                  <span>{viewCount}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Icons.Clock />
                <span>{createdAt}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
