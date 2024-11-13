'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Calendar, Users, ChevronDown, Menu, X, Search, ArrowRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import { format, parseISO } from 'date-fns'
import preprocessedData from '../../public/data/preprocessed_soma_data.json'

interface Collection {
  id: string;
  서적명: string;
  작가명: string;
  출판사명: string;
  발행년도: string;
}

interface EducationProgram {
  id: string;
  교육종류명: string;
  교육명: string;
  교육대상명: string;
  정원: string;
  교육시작일자: string;
  교육종료일자: string;
  교육장소명: string;
  교육비용: string;
  "교육 설명내용": string;
  상세설명내용: string;
  신청인원수: string;
  접수상태: string;
  url: string;
  접수기간: string;
  운영기간: string;
  교육대상전처리: string;
}

interface Exhibition {
  id: string;
  전시실명: string;
  전시명: string;
  전시시작일자: string;
  전시종료일자: string;
  전시상태: string;
  장소명: string;
  주관기관명: string;
  작가명: string;
  작품명: string;
  관람시간: string;
  관람정보: string;
  전자책URL: string;
  전자책명: string;
  전시이미지URL: string;
  전시이미지명: string;
  전시영문명: string;
  전시영문내용: string;
  status: string;
}

interface Filters {
  교육종류: string;
  교육대상: string;
  접수상태: string;
}

const getGoogleSearchUrl = (query: string) => {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
};

export default function SomaMuseumPage() {
  const [activeTab, setActiveTab] = useState("exhibition")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [collections] = useState<Collection[]>(preprocessedData.collections)
  const [educationPrograms] = useState<EducationProgram[]>(preprocessedData.educationPrograms)
  const [exhibitions] = useState<Exhibition[]>(preprocessedData.exhibitions)
  const [searchTerm, setSearchTerm] = useState("")
  const [exhibitionSearchTerm, setExhibitionSearchTerm] = useState("")
  const [filters, setFilters] = useState<Filters>({
    교육종류: "전체",
    교육대상: "전체",
    접수상태: "전체"
  })

  const filterOptions = useMemo(() => preprocessedData.filterOptions, [])

  const filteredCollections = collections.filter(collection =>
    Object.values(collection).some(value =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const filteredEducationPrograms = useMemo(() => {
    return educationPrograms.filter(program => {
      const matchesSearch = Object.values(program).some(value =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )

      const matchesType = filters.교육종류 === "전체" || program.교육종류명 === filters.교육종류
      const matchesTarget = filters.교육대상 === "전체" || program.교육대상전처리 === filters.교육대상
      const matchesStatus = filters.접수상태 === "전체" || program.접수상태 === filters.접수상태

      return matchesSearch && matchesType && matchesTarget && matchesStatus
    }).sort((a, b) => {
      if (a.접수상태 === '접수중' && b.접수상태 !== '접수중') return -1;
      if (a.접수상태 !== '접수중' && b.접수상태 === '접수중') return 1;
      return new Date(a.교육시작일자).getTime() - new Date(b.교육시작일자).getTime();
    })
  }, [educationPrograms, searchTerm, filters])

  const filteredExhibitions = useMemo(() => {
    return exhibitions
      .filter(exhibition => 
        exhibition.전시명.toLowerCase().includes(exhibitionSearchTerm.toLowerCase()) ||
        exhibition.작가명.toLowerCase().includes(exhibitionSearchTerm.toLowerCase())
      )
      .sort((a, b) => new Date(b.전시시작일자).getTime() - new Date(a.전시시작일자).getTime())
  }, [exhibitions, exhibitionSearchTerm])

  const currentExhibitions = filteredExhibitions.filter(ex => ex.status === '진행중')
  const pastExhibitions = filteredExhibitions.filter(ex => ex.status === '종료')

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
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/soma-museum-hero-bg.png')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-black opacity-60"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center text-center">
              <motion.h1 
                className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                소마미술관에 오신 것을 환영합니다
              </motion.h1>
              <motion.p 
                className="max-w-[600px] text-white text-xl md:text-2xl mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                예술과 문화의 중심.<br />
                소마미술관에서 특별한 경험을 만나보세요
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.8, delay: 0.4}}
              >
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                  전시 둘러보기 <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="exhibition" className="text-lg">전시 정보</TabsTrigger>
                <TabsTrigger value="education" className="text-lg">교육 프로그램</TabsTrigger>
                <TabsTrigger value="collection" className="text-lg">소장 자료</TabsTrigger>
              </TabsList>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                >
                  <TabsContent value="exhibition" className="mt-6">
                    <h2 className="text-3xl font-bold mb-8 text-center">전시 정보</h2>
                    <div className="mb-8">
                      <div className="relative max-w-md mx-auto">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          type="text"
                          placeholder="전시명, 작가명으로 검색하세요"
                          value={exhibitionSearchTerm}
                          onChange={(e) => setExhibitionSearchTerm(e.target.value)}
                          className="pl-10 py-2 text-lg bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-full focus:border-blue-500 dark:focus:border-blue-400"
                        />
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-4">현재 전시</h3>
                    {currentExhibitions.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {currentExhibitions.map((exhibition, index) => (
                          <ExhibitionCard key={index} exhibition={exhibition} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-600 dark:text-gray-400 mb-12">현재 전시가 진행중이지 않습니다.</p>
                    )}

                    <h3 className="text-2xl font-bold mb-4">지난 전시</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pastExhibitions.map((exhibition, index) => (
                        <ExhibitionCard key={index} exhibition={exhibition} />
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="education" className="mt-6">
                    <h2 className="text-3xl font-bold mb-8 text-center">교육 프로그램</h2>
                    <div className="mb-8 space-y-4">
                      <div className="relative max-w-md mx-auto">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          type="text"
                          placeholder="프로그램명, 대상으로 검색하세요"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 py-2 text-lg bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-full focus:border-blue-500 dark:focus:border-blue-400"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                        <Select
                          value={filters.교육종류}
                          onValueChange={(value) => setFilters(prev => ({ ...prev, 교육종류: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="교육 종류" />
                          </SelectTrigger>
                          <SelectContent>
                            {filterOptions.교육종류.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          value={filters.교육대상}
                          onValueChange={(value) => setFilters(prev => ({ ...prev, 교육대상: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="교육 대상" />
                          </SelectTrigger>
                          <SelectContent>
                            {filterOptions.교육대상.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          value={filters.접수상태}
                          onValueChange={(value) => setFilters(prev => ({ ...prev, 접수상태: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="접수 상태" />
                          </SelectTrigger>
                          <SelectContent>
                            {filterOptions.접수상태.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                      {filteredEducationPrograms.map((program, index) => (
                        <Dialog key={index}>
                          <DialogTrigger asChild>
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              className="group cursor-pointer p-4 rounded-lg transition-all duration-300 bg-gradient-to-br from-blue-50/30 to-purple-50/30 hover:from-blue-100/40 hover:to-purple-100/40 dark:from-blue-900/30 dark:to-purple-900/30 dark:hover:from-blue-800/40 dark:hover:to-purple-800/40 shadow-sm hover:shadow-md dark:shadow-gray-800/30 dark:hover:shadow-gray-700/40"
                            >
                              <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                                {program.교육명}
                              </h3>
                              <div className="flex justify-between items-center mb-2">
                                <p className="text-gray-600 dark:text-gray-400">{program.교육종류명}</p>
                                <Badge variant={program.접수상태 === '접수마감' ? 'secondary' : 'default'}>
                                  {program.접수상태}
                                </Badge>
                              </div>
                              <div className="mt-4 space-y-2 text-sm">
                                <p className="flex items-center text-gray-500">
                                  <Users className="w-4 h-4 mr-2" />
                                  {program.교육대상전처리} ({program.교육대상명})
                                </p>
                                <p className="flex items-center text-gray-500">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  {program.교육시작일자} - {program.교육종료일자}
                                </p>
                              </div>
                            </motion.div>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-bold">{program.교육명}</DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <h4 className="font-semibold text-sm text-gray-500 mb-1">교육 종류</h4>
                                <p className="text-lg">{program.교육종류명}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold text-sm text-gray-500 mb-1">교육 대상</h4>
                                <p className="text-lg">{program.교육대상전처리}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold text-sm text-gray-500 mb-1">세부 대상</h4>
                                <p className="text-lg">{program.교육대상명}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold text-sm text-gray-500 mb-1">정원</h4>
                                <p className="text-lg">{program.정원}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold text-sm text-gray-500 mb-1">교육 장소</h4>
                                <p className="text-lg">{program.교육장소명}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold text-sm text-gray-500 mb-1">교육 기간</h4>
                                <p className="text-lg">{program.교육시작일자} - {program.교육종료일자}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold text-sm text-gray-500 mb-1">교육 비용</h4>
                                <p className="text-lg">{program.교육비용}</p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-bold text-lg mb-2">교육 설명</h4>
                              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                                {program["교육 설명내용"]}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-bold text-lg mb-2">상세 설명</h4>
                              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                                {program.상세설명내용}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="secondary">{program.접수상태}</Badge>
                              <Badge variant="secondary">신청인원: {program.신청인원수}</Badge>
                            </div>
                            <Button asChild className="w-full">
                              <a href={program.url} target="_blank" rel="noopener noreferrer">
                                자세히 보기
                              </a>
                            </Button>
                          </DialogContent>
                        </Dialog>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="collection" className="mt-6">
                    <h2 className="text-3xl font-bold mb-8 text-center">소장 자료</h2>
                    <div className="mb-8">
                      <div className="relative max-w-md mx-auto">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          type="text"
                          placeholder="작품명, 작가명으로 검색하세요"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 py-2 text-lg bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-full focus:border-blue-500 dark:focus:border-blue-400"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                      {filteredCollections.map((collection, index) => (
                        <Dialog key={index}>
                          <DialogTrigger asChild>
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              className="group cursor-pointer p-4 rounded-lg transition-all duration-300 bg-gradient-to-br from-blue-50/30 to-purple-50/30 hover:from-blue-100/40 hover:to-purple-100/40 dark:from-blue-900/30 dark:to-purple-900/30 dark:hover:from-blue-800/40 dark:hover:to-purple-800/40 shadow-sm hover:shadow-md dark:shadow-gray-800/30 dark:hover:shadow-gray-700/40"
                            >
                              <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                                {collection.서적명}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400">{collection.작가명}</p>
                              <p className="text-gray-500 dark:text-gray-500 mt-2">{collection.발행년도}</p>
                            </motion.div>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-bold">{collection.서적명}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div>
                                <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">{collection.작가명}</p>
                                <p className="text-gray-600 dark:text-gray-400">{collection.출판사명} | {collection.발행년도}</p>
                              </div>
                              <div>
                                <h4 className="font-bold text-lg mb-2">작품 정보 검색</h4>
                                <p className="text-gray-600 dark:text-gray-400 mb-2">
                                  이 작품에 대한 자세한 정보를 구글에서 검색해보세요.
                                </p>
                                <Button asChild className="w-full">
                                  <a href={getGoogleSearchUrl(`${collection.서적명} ${collection.작가명}`)} target="_blank" rel="noopener noreferrer">
                                    구글에서 검색하기
                                  </a>
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">도서</Badge>
                                <Badge variant="secondary">{collection.발행년도}</Badge>
                                <Badge variant="secondary">소장품</Badge>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      ))}
                    </div>
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>
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

function ExhibitionCard({ exhibition }: { exhibition: Exhibition }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="group cursor-pointer p-4 rounded-lg transition-all duration-300 bg-gradient-to-br from-blue-50/30 to-purple-50/30 hover:from-blue-100/40 hover:to-purple-100/40 dark:from-blue-900/30 dark:to-purple-900/30 dark:hover:from-blue-800/40 dark:hover:to-purple-800/40 shadow-sm hover:shadow-md dark:shadow-gray-800/30 dark:hover:shadow-gray-700/40 flex flex-col h-[400px]"
        >
          <div className="relative w-full h-48 mb-4 flex items-center justify-center">
            <img
              src={`https://soma.kspo.or.kr${exhibition.전시이미지URL}`}
              alt={exhibition.전시이미지명}
              className="object-contain w-full h-full rounded-lg"
            />
          </div>
          <div className="flex-1 flex flex-col">
            <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
              {exhibition.전시명}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-auto line-clamp-3 overflow-hidden">
              {exhibition.작가명}
            </p>
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-gray-500">
                {format(parseISO(exhibition.전시시작일자), 'yyyy.MM.dd')} - {format(parseISO(exhibition.전시종료일자), 'yyyy.MM.dd')}
              </p>
              <Badge variant={exhibition.status === '진행중' ? 'default' : 'secondary'}>
                {exhibition.status}
              </Badge>
            </div>
          </div>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{exhibition.전시명}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <img
            src={`https://soma.kspo.or.kr${exhibition.전시이미지URL}`}
            alt={exhibition.전시이미지명}
            className="w-full h-auto rounded-lg object-contain max-h-[300px]"
          />
          <div>
            <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">{exhibition.작가명}</p>
            <p className="text-gray-600 dark:text-gray-400">
              {format(parseISO(exhibition.전시시작일자), 'yyyy.MM.dd')} - {format(parseISO(exhibition.전시종료일자), 'yyyy.MM.dd')}
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-2">전시 설명</h4>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
              {exhibition.전시영문내용}
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-2">관람 정보</h4>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-semibold">장소:</span> {exhibition.장소명}<br />
              <span className="font-semibold">관람 시간:</span> {exhibition.관람시간}<br />
              <span className="font-semibold">관람 정보:</span> {exhibition.관람정보}
            </p>
          </div>
          {exhibition.전자책URL && (
            <Button asChild className="w-full">
              <a href={exhibition.전자책URL} target="_blank" rel="noopener noreferrer">
                전자책 보기
              </a>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}