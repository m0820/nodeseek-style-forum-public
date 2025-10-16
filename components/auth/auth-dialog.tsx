"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { LoginForm } from "./login-form"
import { RegisterForm } from "./register-form"

interface AuthDialogProps {
  children: React.ReactNode
  defaultMode?: "login" | "register"
}

export function AuthDialog({ children, defaultMode = "login" }: AuthDialogProps) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<"login" | "register">(defaultMode)

  const handleSuccess = () => {
    setOpen(false)
  }

  const switchToLogin = () => setMode("login")
  const switchToRegister = () => setMode("register")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 border-0">
        {mode === "login" ? (
          <LoginForm onSuccess={handleSuccess} onSwitchToRegister={switchToRegister} />
        ) : (
          <RegisterForm onSuccess={handleSuccess} onSwitchToLogin={switchToLogin} />
        )}
      </DialogContent>
    </Dialog>
  )
}
