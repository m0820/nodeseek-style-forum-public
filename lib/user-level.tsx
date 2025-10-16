"use client"

export interface UserLevel {
  level: number
  drumsticks: number
  isSuper?: boolean
}

// 等级规则配置
export const LEVEL_REQUIREMENTS = {
  0: 0,
  1: 100,
  2: 200,
  3: 300,
  4: 400,
  5: 500,
  6: 600,
}

// 奖励配置
export const REWARDS = {
  POST: 5, // 发帖奖励
  REPLY: 20, // 回帖奖励
  DAILY_LIMIT: 20, // 每日奖励上限
}

// 新用户默认鸡腿数量
export const DEFAULT_DRUMSTICKS = 90

/**
 * 根据鸡腿数量计算用户等级
 */
export function calculateUserLevel(drumsticks: number): UserLevel {
  // 超过666显示为Lv6+闪电
  if (drumsticks > 666) {
    return {
      level: 6,
      drumsticks,
      isSuper: true,
    }
  }

  // 计算等级
  let level = 0
  for (let i = 6; i >= 0; i--) {
    if (drumsticks >= LEVEL_REQUIREMENTS[i as keyof typeof LEVEL_REQUIREMENTS]) {
      level = i
      break
    }
  }

  return {
    level,
    drumsticks,
    isSuper: false,
  }
}

/**
 * 获取等级显示文本
 */
export function getLevelDisplay(userLevel: UserLevel): string {
  if (userLevel.isSuper) {
    return `Lv${userLevel.level}`
  }
  return `Lv${userLevel.level}`
}

/**
 * 获取下一等级所需鸡腿数量
 */
export function getNextLevelRequirement(currentLevel: number): number | null {
  if (currentLevel >= 6) return null
  return LEVEL_REQUIREMENTS[(currentLevel + 1) as keyof typeof LEVEL_REQUIREMENTS]
}

/**
 * 获取下一等级信息
 */
export function getNextLevelInfo(currentDrumsticks: number): { required: number; level: number } | null {
  const currentLevel = calculateUserLevel(currentDrumsticks)

  // 如果已经是超级用户，没有下一等级
  if (currentLevel.isSuper || currentLevel.level >= 6) {
    return null
  }

  const nextLevel = currentLevel.level + 1
  const required = LEVEL_REQUIREMENTS[nextLevel as keyof typeof LEVEL_REQUIREMENTS]

  return {
    required,
    level: nextLevel,
  }
}

/**
 * 生成演示用户数据（包含随机鸡腿数量）
 */
export function generateDemoUserLevels() {
  const users = [
    { id: "1", name: "walker" },
    { id: "2", name: "jkoy" },
    { id: "3", name: "yuzu" },
    { id: "4", name: "David" },
    { id: "5", name: "Si" },
    { id: "6", name: "toboo" },
    { id: "7", name: "Evan" },
  ]

  const demoData: Record<string, UserLevel> = {}

  users.forEach((user) => {
    // 生成符合规则的随机鸡腿数量
    const ranges = [
      { min: 50, max: 99 }, // Lv0
      { min: 100, max: 199 }, // Lv1
      { min: 200, max: 299 }, // Lv2
      { min: 300, max: 399 }, // Lv3
      { min: 400, max: 499 }, // Lv4
      { min: 500, max: 599 }, // Lv5
      { min: 600, max: 666 }, // Lv6
      { min: 667, max: 999 }, // Lv6+
    ]

    const randomRange = ranges[Math.floor(Math.random() * ranges.length)]
    const drumsticks = Math.floor(Math.random() * (randomRange.max - randomRange.min + 1)) + randomRange.min

    demoData[user.id] = calculateUserLevel(drumsticks)
  })

  return demoData
}

// 全局演示数据
export const DEMO_USER_LEVELS = generateDemoUserLevels()
