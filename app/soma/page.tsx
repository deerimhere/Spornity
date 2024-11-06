"use client"

import Link from 'next/link'
import { useState } from 'react'
import { Activity, Book, Calendar, ChevronDown, Image, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-2xl bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Spornity
            </span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              소개
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              관람안내
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              전시
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              교육
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[url('/placeholder.svg?height=400&width=800')] bg-cover bg-center">
          <div className="container px-4 md:px-6">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none text-white text-center">
              소마미술관에 오신 것을 환영합니다
            </h1>
            <p className="mx-auto max-w-[700px] text-white text-center mt-4 md:text-xl">
              예술과 문화의 중심, 소마미술관에서 특별한 경험을 만나보세요
            </p>
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
              <TabsContent value="education" className="mt-6">
                <h2 className="text-2xl font-bold mb-4">교육 프로그램</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {educationPrograms.map((program) => (
                    <Card key={program.id}>
                      <CardHeader>
                        <CardTitle>{program.title}</CardTitle>
                        <CardDescription>{program.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">
                          <Calendar className="inline-block w-4 h-4 mr-2" />
                          {program.schedule}
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
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
                    <Card key={collection.id}>
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
                        <p className="text-sm text-muted-foreground">
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
                        <p className="text-sm text-muted-foreground mb-2">{exhibition.period}</p>
                        <p>{exhibition.description}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          © 2024 소마미술관. 모든 권리 보유.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">이용약관</Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">개인정보처리방침</Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">오시는 길</Link>
        </nav>
      </footer>
    </div>
  )
}