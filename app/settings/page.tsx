"use client"

import type React from "react"

import { useState } from "react"
import { ForumHeader } from "@/components/forum-header"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save, Upload, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useAuthStore } from "@/lib/auth"

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore()
  const { toast } = useToast()

  const [profile, setProfile] = useState({
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "",
    location: user?.location || "",
    website: user?.website || "",
  })

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    updateUser({
      ...user!,
      ...profile,
    })

    toast({
      title: "资料更新成功",
      description: "您的个人资料已成功更新",
    })
  }

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (security.newPassword !== security.confirmPassword) {
      toast({
        title: "密码不匹配",
        description: "新密码和确认密码不一致",
        variant: "destructive",
      })
      return
    }

    if (security.newPassword.length < 6) {
      toast({
        title: "密码太短",
        description: "密码至少需要6个字符",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would validate the current password and update it
    toast({
      title: "密码更新成功",
      description: "您的密码已成功更新",
    })

    setSecurity({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  const handleAvatarUpload = () => {
    // In a real app, this would open a file picker and upload the image
    toast({
      title: "功能开发中",
      description: "头像上传功能正在开发中",
    })
  }

  if (!user) {
    return null
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <ForumHeader />

        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="mb-6">
            <Link href={`/user/${user.id}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回个人资料
              </Button>
            </Link>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">账户设置</h1>
              <p className="text-muted-foreground">管理您的个人资料和账户安全设置</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">个人资料</TabsTrigger>
                <TabsTrigger value="security">安全设置</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>个人资料</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                      {/* Avatar Section */}
                      <div className="flex items-center gap-6">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                          <AvatarFallback className="text-xl">{user.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <Button type="button" variant="outline" onClick={handleAvatarUpload}>
                            <Upload className="mr-2 h-4 w-4" />
                            更换头像
                          </Button>
                          <p className="text-xs text-muted-foreground mt-2">支持 JPG、PNG 格式，文件大小不超过 2MB</p>
                        </div>
                      </div>

                      {/* Profile Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="username">用户名</Label>
                          <Input
                            id="username"
                            value={profile.username}
                            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                            placeholder="输入用户名"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">邮箱</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            placeholder="输入邮箱地址"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">个人简介</Label>
                        <Textarea
                          id="bio"
                          value={profile.bio}
                          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                          placeholder="介绍一下自己..."
                          className="min-h-[100px] resize-none"
                          maxLength={200}
                        />
                        <div className="text-xs text-muted-foreground text-right">{profile.bio.length}/200</div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="location">所在地</Label>
                          <Input
                            id="location"
                            value={profile.location}
                            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                            placeholder="输入所在城市"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="website">个人网站</Label>
                          <Input
                            id="website"
                            type="url"
                            value={profile.website}
                            onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                            placeholder="https://example.com"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button type="submit">
                          <Save className="mr-2 h-4 w-4" />
                          保存更改
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>安全设置</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSecuritySubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">当前密码</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showPasswords.current ? "text" : "password"}
                            value={security.currentPassword}
                            onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                            placeholder="输入当前密码"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                          >
                            {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">新密码</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showPasswords.new ? "text" : "password"}
                            value={security.newPassword}
                            onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                            placeholder="输入新密码"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                          >
                            {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">确认新密码</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showPasswords.confirm ? "text" : "password"}
                            value={security.confirmPassword}
                            onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                            placeholder="再次输入新密码"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                          >
                            {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">密码要求：</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• 至少6个字符</li>
                          <li>• 建议包含大小写字母、数字和特殊字符</li>
                          <li>• 不要使用常见密码或个人信息</li>
                        </ul>
                      </div>

                      <div className="flex justify-end">
                        <Button type="submit">
                          <Save className="mr-2 h-4 w-4" />
                          更新密码
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
