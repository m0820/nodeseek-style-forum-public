"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, MessageSquare, Shield, Lightbulb } from "lucide-react"
import { AIService } from "@/lib/ai-service"

interface AIAssistantProps {
  mode: "post" | "reply" | "moderate"
  postTitle?: string
  postContent?: string
  topic?: string
  onSuggestionSelect?: (suggestion: string) => void
}

export function AIAssistant({
  mode,
  postTitle = "",
  postContent = "",
  topic = "",
  onSuggestionSelect,
}: AIAssistantProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [aiResponse, setAiResponse] = useState("")

  const handleGenerateSuggestions = async () => {
    setIsLoading(true)
    setSuggestions([])
    setAiResponse("")

    try {
      if (mode === "post") {
        const response = await AIService.generatePostSuggestions(postTitle, topic)
        setAiResponse(response.content)
        if (response.suggestions) {
          setSuggestions(response.suggestions)
        }
      } else if (mode === "reply") {
        const response = await AIService.generateReplySuggestions(postTitle, postContent)
        setAiResponse(response.content)
        if (response.suggestions) {
          setSuggestions(response.suggestions)
        }
      }
    } catch (error) {
      console.error("AI生成失败:", error)
      setAiResponse("AI助手暂时不可用，请稍后再试。")
    } finally {
      setIsLoading(false)
    }
  }

  const getTitle = () => {
    switch (mode) {
      case "post":
        return "AI写作助手"
      case "reply":
        return "AI回复助手"
      case "moderate":
        return "AI内容审核"
      default:
        return "AI助手"
    }
  }

  const getDescription = () => {
    switch (mode) {
      case "post":
        return "让AI帮你生成有趣的帖子内容"
      case "reply":
        return "获取智能回复建议"
      case "moderate":
        return "AI检查内容是否合适"
      default:
        return "AI智能助手"
    }
  }

  const getIcon = () => {
    switch (mode) {
      case "post":
        return <Lightbulb className="h-4 w-4" />
      case "reply":
        return <MessageSquare className="h-4 w-4" />
      case "moderate":
        return <Shield className="h-4 w-4" />
      default:
        return <Sparkles className="h-4 w-4" />
    }
  }

  return (
    <Card className="border-dashed border-2 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          {getIcon()}
          {getTitle()}
          <Badge variant="secondary" className="text-xs">
            AI
          </Badge>
        </CardTitle>
        <p className="text-xs text-muted-foreground">{getDescription()}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button onClick={handleGenerateSuggestions} disabled={isLoading} size="sm" className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              AI思考中...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-3 w-3" />
              获取AI建议
            </>
          )}
        </Button>

        {aiResponse && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">AI建议：</div>
            <div className="text-sm bg-muted/50 p-3 rounded-md whitespace-pre-wrap">{aiResponse}</div>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">快速选择：</div>
            <div className="space-y-1">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full text-left justify-start h-auto p-2 text-xs bg-transparent"
                  onClick={() => onSuggestionSelect?.(suggestion)}
                >
                  <div className="whitespace-normal text-left">{suggestion.replace(/^\d+\.\s*/, "")}</div>
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
