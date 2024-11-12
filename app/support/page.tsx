'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Menu, X, ChevronDown, MapPin, Users, Dumbbell, Calendar, Palette, Bot, MessageSquare, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { motion } from 'framer-motion'

export default function MainPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [userInput, setUserInput] = useState('')
  const router = useRouter()

  const handleAIPTSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/ai-pt?question=${encodeURIComponent(userInput)}`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Spornity
              </span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/ai-pt" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                AI PT
              </Link>
              <Link href="/fitness" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                맞춤 운동 추천
              </Link>
              <Link href="/support" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                지원사업
              </Link>
              <Link href="/soma" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                소마미술관
              </Link>
              <Link href="/programs" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                프로그램
              </Link>
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
            <Link href="/ai-pt" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              AI PT
            </Link>
            <Link href="/fitness" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              맞춤 운동 추천
            </Link>
            <Link href="/support" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              지원사업
            </Link>
            <Link href="/soma" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              소마미술관
            </Link>
            <Link href="/programs" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              프로그램
            </Link>
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">지역</span>
              <Link href="/facilities" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors pl-4">
                지역 체육 시설
              </Link>
              <Link href="/clubs" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors pl-4">
                지역 동호회
              </Link>
            </div>
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
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                당신의 건강한 삶을 위한 모든 것
              </h1>
              <p className="text-xl md:text-2xl mb-12 text-gray-600 dark:text-gray-300">
                <span className="bg-gradient-to-r from-sky-600 to-violet-600 bg-clip-text text-transparent">Spornity</span>와 함께 더 건강하고 활기찬 라이프스타일을 만들어보세요.
              </p>
              <form onSubmit={handleAIPTSubmit} className="max-w-2xl mx-auto">
                <div className="flex flex-col gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">AI PT에게 물어보세요</h2>
                  <Textarea
                    placeholder="운동 계획, 식단, 건강 조언 등에 대해 물어보세요."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="min-h-[120px] border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Button type="submit" size="lg" className="w-full bg-black hover:bg-gray-800 text-white">
                    <MessageSquare className="mr-2 h-5 w-5" /> AI PT에게 물어보기
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              <span className="bg-gradient-to-r from-sky-600 to-violet-600 bg-clip-text text-transparent">Spornity</span> 서비스
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Link href="/ai-pt" className="group">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 mb-4 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                    <Bot className="h-8 w-8 text-red-500" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">AI PT</h3>
                  <p className="text-gray-600 dark:text-gray-400">AI 기술을 활용한 개인 맞춤형 트레이닝을 경험해보세요.</p>
                </motion.div>
              </Link>

              <Link href="/fitness" className="group">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 mb-4 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <Dumbbell className="h-8 w-8 text-purple-500" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">맞춤 운동 추천</h3>
                  <p className="text-gray-600 dark:text-gray-400">개인의 체력과 목표에 맞는 운동 프로그램을 추천받으세요.</p>
                </motion.div>
              </Link>

              <Link href="/support" className="group">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 mb-4 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Briefcase className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">지원사업</h3>
                  <p className="text-gray-600 dark:text-gray-400">다양한 스포츠 관련 지원사업 정보를 확인하세요.</p>
                </motion.div>
              </Link>

              <Link href="/soma" className="group">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 mb-4 rounded-full bg-pink-100 flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                    <Palette className="h-8 w-8 text-pink-500" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">소마미술관</h3>
                  <p className="text-gray-600 dark:text-gray-400">운동과 문화생활을 동시에 즐겨보세요.</p>
                </motion.div>
              </Link>

              <Link href="/programs" className="group">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 mb-4 rounded-full bg-yellow-100 flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                    <Calendar className="h-8 w-8 text-yellow-500" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">프로그램</h3>
                  <p className="text-gray-600 dark:text-gray-400">다양한 공공체육시설의 프로그램 정보를 확인하세요.</p>
                </motion.div>
              </Link>

              <Link href="/facilities" className="group">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 mb-4 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <MapPin className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">지역 체육 시설</h3>
                  <p className="text-gray-600 dark:text-gray-400">내 주변의 체육 시설을 쉽고 빠르게 찾아보세요.</p>
                </motion.div>
              </Link>

              <Link href="/clubs" className="group">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 mb-4 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                    <Users className="h-8 w-8 text-indigo-500" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">지역 동호회</h3>
                  <p className="text-gray-600 dark:text-gray-400">같은 관심사를 가진 사람들과 함께 운동하세요.</p>
                </motion.div>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto py-12 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Spornity</h3>
              <p className="text-gray-600 dark:text-gray-400">당신의 건강한 삶을 위한 모든 것</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">바로가기</h3>
              <ul className="space-y-2">
                <li><Link href="/ai-pt" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">AI PT</Link></li>
                <li><Link href="/fitness" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">맞춤 운동 추천</Link></li>
                <li><Link href="/support" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">지원사업</Link></li>
                <li><Link href="/soma" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">소마미술관</Link></li>
                <li><Link href="/programs" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">프로그램</Link></li>
                <li><Link href="/facilities" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">지역 체육 시설</Link></li>
                <li><Link href="/clubs" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">지역 동호회</Link></li>
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
              © 2024 <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Spornity</span>. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}