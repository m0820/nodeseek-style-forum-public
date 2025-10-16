"use client"

import { generateText } from "ai"

export interface AIResponse {
  content: string
  suggestions?: string[]
}

/**
 * AI服务 - 提供各种AI功能
 */
export class AIService {
  /**
   * 生成帖子内容建议
   */
  static async generatePostSuggestions(title: string, topic: string): Promise<AIResponse> {
    try {
      const { text } = await generateText({
        model: "openai/gpt-4o-mini",
        prompt: `作为一个中文论坛的AI助手，请根据以下信息生成一个有用的帖子内容建议：

标题: ${title}
话题分类: ${topic}

请生成：
1. 一个详细的帖子内容建议（200-300字）
2. 3个相关的讨论点或问题

请用中文回复，内容要有用、有趣且适合论坛讨论。`,
      })

      return {
        content: text,
      }
    } catch (error) {
      console.error("AI生成失败:", error)
      return {
        content: "AI助手暂时不可用，请稍后再试。",
      }
    }
  }

  /**
   * 生成智能回复建议
   */
  static async generateReplySuggestions(postTitle: string, postContent: string): Promise<AIResponse> {
    try {
      const { text } = await generateText({
        model: "openai/gpt-4o-mini",
        prompt: `作为一个中文论坛的AI助手，请为以下帖子生成3个不同风格的回复建议：

帖子标题: ${postTitle}
帖子内容: ${postContent}

请生成3个回复建议：
1. 一个支持性的回复
2. 一个提出问题或建议的回复  
3. 一个分享相关经验的回复

每个回复50-100字，要自然、有用且符合中文论坛的交流习惯。`,
      })

      // 解析AI返回的内容，提取建议
      const suggestions = text
        .split("\n")
        .filter((line) => line.trim().length > 10)
        .slice(0, 3)

      return {
        content: text,
        suggestions,
      }
    } catch (error) {
      console.error("AI生成失败:", error)
      return {
        content: "AI助手暂时不可用，请稍后再试。",
        suggestions: [],
      }
    }
  }

  /**
   * 内容审核
   */
  static async moderateContent(content: string): Promise<{
    isAppropriate: boolean
    reason?: string
    suggestions?: string[]
  }> {
    try {
      const { text } = await generateText({
        model: "openai/gpt-4o-mini",
        prompt: `请审核以下中文论坛内容是否合适：

内容: ${content}

请判断内容是否：
1. 包含不当言论、仇恨言论或攻击性内容
2. 包含垃圾信息或广告
3. 违反基本的网络礼仪

请回复格式：
合适: 是/否
原因: [如果不合适，说明原因]
建议: [如果不合适，提供修改建议]`,
      })

      const isAppropriate = text.includes("合适: 是")
      const reason = text.match(/原因: (.+)/)?.[1]
      const suggestions = text.match(/建议: (.+)/)?.[1]?.split("；") || []

      return {
        isAppropriate,
        reason,
        suggestions,
      }
    } catch (error) {
      console.error("内容审核失败:", error)
      // 默认通过，避免阻塞用户
      return {
        isAppropriate: true,
      }
    }
  }

  /**
   * 生成帖子标题建议
   */
  static async generateTitleSuggestions(content: string, topic: string): Promise<string[]> {
    try {
      const { text } = await generateText({
        model: "openai/gpt-4o-mini",
        prompt: `根据以下帖子内容和话题分类，生成5个吸引人的标题建议：

内容: ${content}
话题: ${topic}

请生成5个不同风格的标题：
1. 直接描述型
2. 问题型
3. 经验分享型
4. 讨论型
5. 创意型

每个标题15-30字，要吸引人且准确反映内容。`,
      })

      return text
        .split("\n")
        .filter((line) => line.trim().length > 5)
        .slice(0, 5)
    } catch (error) {
      console.error("标题生成失败:", error)
      return []
    }
  }
}
