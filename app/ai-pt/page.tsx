'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronDown, Menu, X, Dumbbell, Clipboard, MessageSquare, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"

export default function AIPTPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [userInput, setUserInput] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const searchParams = useSearchParams()

  useEffect(() => {
    const question = searchParams.get('question')
    if (question) {
      setUserInput(question)
      handleSubmit(new Event('submit') as React.FormEvent)
    }
  }, [searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 여기에 LLM 모델 호출 로직을 추가할 예정입니다.
    setAiResponse(`AI PT의 응답: "${userInput}"에 대한 답변입니다.`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-2xl bg-gradient-to-r from-sky-600 to-violet-600 bg-clip-text text-transparent">
                Spornity
              </span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <div className="relative group">
                <span className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer flex items-center">
                  지역
                  <ChevronDown className="ml-1 h-4 w-4" />
                </span>
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    <Link href="/facilities" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">
                      지역 체육 시설
                    </Link>
                    <Link href="/clubs" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">
                      지역 동호회
                    </Link>
                  </div>
                </div>
              </div>
              <Link href="/fitness" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                맞춤 운동 추천
              </Link>
              <Link href="/programs" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                프로그램
              </Link>
              <Link href="/soma" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                소마미술관
              </Link>
              <Link href="/ai-pt" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                AI PT
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button asChild variant="outline" size="sm" className="hidden md:inline-flex hover:bg-blue-50 dark:hover:bg-blue-900">
                <Link href="/login">로그인</Link>
              </Button>
              <Button asChild size="sm" className="hidden md:inline-flex">
                <Link href="/signup">회원가입</Link>
              </Button>
              <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 py-4">
          <nav className="container mx-auto px-4 flex flex-col space-y-4">
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">지역</span>
              <Link href="/facilities" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors pl-4">
                지역 체육 시설
              </Link>
              <Link href="/clubs" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors pl-4">
                지역 동호회
              </Link>
            </div>
            <Link href="/fitness" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              맞춤 운동 추천
            </Link>
            <Link href="/programs" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              프로그램
            </Link>
            <Link href="/soma" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              소마미술관
            </Link>
            <Link href="/ai-pt" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              AI PT
            </Link>
            <Link href="/login" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              로그인
            </Link>
            <Link href="/signup" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              회원가입
            </Link>
          </nav>
        </div>
      )}

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI 퍼스널 트레이너
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-600 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
                개인 맞춤형 운동 계획과 조언을 AI로 받아보세요. 당신의 건강한 라이프스타일을 위한 첫 걸음입니다.
              </p>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>AI PT에게 물어보세요</CardTitle>
                  <CardDescription>운동 계획, 식단, 건강 조언 등 무엇이든 물어보세요.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Textarea
                      placeholder="예: 30대 초반 남성입니다. 체중 감량과 근력 향상을 위한 운동 계획을 추천해주세요."
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <Button type="submit" className="w-full">
                      <MessageSquare className="mr-2 h-4 w-4" /> AI PT에게 질문하기
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="w-full">
                <CardHeader>
                  <CardTitle>AI PT의 응답</CardTitle>
                  <CardDescription>맞춤형 조언과 계획을 확인하세요.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md min-h-[200px]">
                    {aiResponse || "AI PT의 응답이 여기에 표시됩니다."}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6 text-center">AI PT의 주요 기능</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Dumbbell className="mr-2 h-5 w-5" />
                      맞춤형 운동 계획
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>개인의 목표, 체력 수준, 선호도에 맞는 운동 계획을 제공합니다.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clipboard className="mr-2 h-5 w-5" />
                      영양 및 식단 조언
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>건강한 식단 구성과 영양 섭취에 대한 조언을 제공합니다.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="mr-2 h-5 w-5" />
                      건강 상담
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>일반적인 건강 관련 질문에 대한 답변과 조언을 제공합니다.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto py-12 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Spornity</h3>
              <p className="text-gray-600 dark:text-gray-400">당신의 건강한 삶을 위한 모든 것</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">바로가기</h3>
              <ul className="space-y-2">
                <li><Link href="/facilities" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">지역 체육 시설</Link></li>
                <li><Link href="/clubs" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">지역 동호회</Link></li>
                <li><Link href="/fitness" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">맞춤 운동 추천</Link></li>
                <li><Link href="/programs" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">프로그램</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">고객 지원</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">이용약관</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">개인정보처리방침</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">접근성 정책</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-gray-600 dark:text-gray-400">
              © 2024 <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Spornity</span>. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}