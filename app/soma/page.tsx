"use client"

import Link from 'next/link'
import { useState } from 'react'
import { Calendar, Image, Clock, Users, ChevronDown, Menu, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

// 더미 데이터
const educationPrograms = [
  { id: 1, title: "어린이 미술 교실", description: "창의적인 미술 수업", schedule: "매주 토요일 10:00-12:00", period: "2024.03.01 - 2024.06.30", target: "7-12세 어린이" },
  { id: 2, title: "성인 드로잉 클래스", description: "초보자를 위한 기초 드로잉 강좌", schedule: "매주 화요일 19:00-21:00", period: "2024.04.01 - 2024.07.31", target: "성인" },
  { id: 3, title: "현대미술 이해하기", description: "현대미술의 주요 흐름과 작가들에 대한 강의", schedule: "격주 목요일 14:00-16:00", period: "2024.05.01 - 2024.08.31", target: "청소년 및 성인" },
]

const collections = [
  { id: 1, title: "한국 현대미술 컬렉션", description: "1950년대 이후 한국 현대미술 작품 300여 점", imageUrl: "/placeholder.svg?height=100&width=100" },
  { id: 2, title: "국제 조각 컬렉션", description: "국내외 유명 조각가들의 작품 50여 점", imageUrl: "/placeholder.svg?height=100&width=100" },
  { id: 3, title: "미디어 아트 컬렉션", description: "비디오 아트 및 설치 작품 100여 점", imageUrl: "/placeholder.svg?height=100&width=100" },
]

const exhibitions = [
  { id: 1, title: "빛과 그림자: 현대 사진전", artist: "다양한 작가", period: "2024.03.01 - 2024.05.31", description: "현대 사진 작가들의 실험적 작품 전시" },
  { id: 2, title: "자연과 인간: 생태미술전", artist: "김자연, 이환경 외 5명", period: "2024.04.15 - 2024.07.15", description: "환경 문제를 다루는 현대 미술 작품 전시" },
  { id: 3, title: "디지털 아트의 미래", artist: "AI 아티스트 그룹", period: "2024.06.01 - 2024.08.31", description: "AI와 인간 협업으로 만들어진 디지털 아트 전시" },
]

export default function SomaMuseumPage() {
  const [activeTab, setActiveTab] = useState("education")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
        <section className="w-full py-12 md:py-24 lg:py-32 relative">
          <div className="absolute inset-0 bg-[url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-gDkCL29AGe6N4l5rlaSVLKzpmxAnpG.png')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <motion.h1 
              className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none text-white text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              소마미술관에 오신 것을 환영합니다
            </motion.h1>
            <motion.p 
              className="mx-auto max-w-[700px] text-white text-center mt-4 md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              예술과 문화의 중심, 소마미술관에서 특별한 경험을 만나보세요
            </motion.p>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="education">교육 프로그램</TabsTrigger>
                <TabsTrigger value="collection">소장 자료</TabsTrigger>
                <TabsTrigger value="exhibition">현재 전시</TabsTrigger>
              </TabsList>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <TabsContent value="education" className="mt-6">
                    <h2 className="text-2xl font-bold mb-4">교육 프로그램</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {educationPrograms.map((program) => (
                        <Card key={program.id} className="hover:shadow-lg transition-shadow duration-300">
                          <CardHeader>
                            <CardTitle>{program.title}</CardTitle>
                            <CardDescription>{program.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              <Calendar className="inline-block w-4 h-4 mr-2" />
                              {program.schedule}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              <Clock className="inline-block w-4 h-4 mr-2" />
                              {program.period}
                            </p>
                            <p className="text-sm font-semibold">
                              <Users className="inline-block w-4 h-4 mr-2" />
                              대상: {program.target}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="collection" className="mt-6">
                    <h2 className="text-2xl font-bold mb-4">소장 자료</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {collections.map((collection) => (
                        <Card key={collection.id} className="hover:shadow-lg transition-shadow duration-300">
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <Image className="w-6 h-6 mr-2" />
                              {collection.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <img
                              src={collection.imageUrl}
                              alt={collection.title}
                              className="w-full h-48 object-cover mb-4 rounded-md"
                            />
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {collection.description}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="exhibition" className="mt-6">
                    <h2 className="text-2xl font-bold mb-4">현재 전시</h2>
                    <Accordion type="single" collapsible className="w-full">
                      {exhibitions.map((exhibition) => (
                        <AccordionItem key={exhibition.id} value={`item-${exhibition.id}`}>
                          <AccordionTrigger>{exhibition.title}</AccordionTrigger>
                          <AccordionContent>
                            <p className="font-semibold mb-2">{exhibition.artist}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{exhibition.period}</p>
                            <p className="text-gray-700 dark:text-gray-300">{exhibition.description}</p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>
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