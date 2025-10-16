import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { PostsProvider } from "@/lib/posts";
import { CommentsProvider } from "@/lib/comments";
import { CategoriesProvider } from "@/lib/categories";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TechForum - 现代化技术社区",
  description: "A modern tech community inspired by NotSeek",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <PostsProvider>
            <CommentsProvider>
              <CategoriesProvider>
                <Suspense fallback={null}>{children}</Suspense>
              </CategoriesProvider>
            </CommentsProvider>
          </PostsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
