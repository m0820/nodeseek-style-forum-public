"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertTriangle, CheckCircle, X } from "lucide-react"
import { AIService } from "@/lib/ai-service"

interface AIContentModeratorProps {
  content: string
  onModerationResult?: (result: { isAppropriate: boolean; reason?: string }) => void
  autoCheck?: boolean
}

export function AIContentModerator({ content, onModerationResult, autoCheck = false }: AIContentModeratorProps) {
  const [isChecking, setIsChecking] = useState(false)
  const [moderationResult, setModerationResult] = useState<{
    isAppropriate: boolean
    reason?: string
    suggestions?: string[]
  } | null>(null)

  useEffect(() => {
    if (autoCheck && content.trim().length > 10) {
      handleModerate()
    }
  }, [content, autoCheck])

  const handleModerate = async () => {
    if (!content.trim()) return

    setIsChecking(true)
    try {
      const result = await AIService.moderateContent(content)
      setModerationResult(result)
      onModerationResult?.(result)
    } catch (error) {
      console.error("内容审核失败:", error)
    } finally {
      setIsChecking(false)
    }
  }

  if (!content.trim()) return null

  return (
    <Card className="border-dashed border-2 border-muted">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Shield className="h-4 w-4" />
          AI内容审核
          <Badge variant="secondary" className="text-xs">
            AI
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!moderationResult && !isChecking && (
          <Button onClick={handleModerate} size="sm" variant="outline" className="w-full bg-transparent">
            <Shield className="mr-2 h-3 w-3" />
            检查内容
          </Button>
        )}

        {isChecking && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-xs text-muted-foreground">AI正在审核内容...</p>
          </div>
        )}

        {moderationResult && (
          <div className="space-y-2">
            {moderationResult.isAppropriate ? (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">内容审核通过，符合社区规范</AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <div className="space-y-1">
                    <p>内容可能不符合社区规范</p>
                    {moderationResult.reason && <p className="text-xs">原因：{moderationResult.reason}</p>}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {moderationResult.suggestions && moderationResult.suggestions.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">修改建议：</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {moderationResult.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <span>•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button onClick={() => setModerationResult(null)} size="sm" variant="ghost" className="w-full text-xs">
              <X className="mr-1 h-3 w-3" />
              关闭
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
