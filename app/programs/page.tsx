'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Activity, Phone, Calendar, Clock, Globe, Users, Search, ChevronDown, Menu, X, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import preprocessedDataRaw from '../../public/data/preprocessed_program_data.json'

type Program = {
  id: number;
  facilityName: string;
  facilityType: string;
  region: string;
  city: string;
  address: string;
  phone: string;
  programName: string;
  targetAudience: string;
  startDate: string;
  endDate: string;
  days: string;
  time: string;
  capacity: string;
  price: string;
  priceType: string | null;
  website: string;
  isDisabilityProgram: boolean;
  programIntroduction?: string;
}

type PreprocessedData = {
  programs: Program[];
}

const preprocessedData: PreprocessedData = preprocessedDataRaw as PreprocessedData;

const ITEMS_PER_PAGE = 9;

export default function PublicProgramsPage() {
  const [programs] = useState<Program[]>(preprocessedData.programs)
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>(preprocessedData.programs)
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedTargetAudience, setSelectedTargetAudience] = useState('all')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  const uniqueRegions = useMemo(() => [...new Set(programs.map(program => program.region))], [programs])

  const citiesByRegion = useMemo(() => {
    const cities: { [key: string]: string[] } = {};
    programs.forEach(program => {
      if (!cities[program.region]) {
        cities[program.region] = [];
      }
      if (!cities[program.region].includes(program.city)) {
        cities[program.region].push(program.city);
      }
    });
    return cities;
  }, [programs]);

  const currentCities = useMemo(() => {
    return selectedRegion ? citiesByRegion[selectedRegion] || [] : [];
  }, [selectedRegion, citiesByRegion]);

  useEffect(() => {
    let filtered = programs

    if (selectedRegion) {
      filtered = filtered.filter(program => program.region === selectedRegion)
    }

    if (selectedCity) {
      filtered = filtered.filter(program => program.city === selectedCity)
    }

    if (selectedTargetAudience !== 'all') {
      filtered = filtered.filter(program => program.targetAudience.includes(selectedTargetAudience))
    }

    if (searchTerm) {
      filtered = filtered.filter(program => 
        program.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.facilityName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (activeTab === "disability") {
      filtered = filtered.filter(program => program.isDisabilityProgram)
    } else if (activeTab === "regular") {
      filtered = filtered.filter(program => !program.isDisabilityProgram)
    }

    setFilteredPrograms(filtered)
    setCurrentPage(1)
  }, [programs, selectedRegion, selectedCity, selectedTargetAudience, searchTerm, activeTab])

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value)
    setSelectedCity('')
  }

  const handleCityChange = (value: string) => {
    setSelectedCity(value)
  }

  const pageCount = Math.ceil(filteredPrograms.length / ITEMS_PER_PAGE);
  const currentPrograms = filteredPrograms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  공공체육시설 프로그램 검색
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  당신의 건강한 삶을 위한 다양한 프로그램을 찾아보세요.<br />
                  지역별, 종목별로 원하는 프로그램을 쉽게 검색할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">검색 필터</h2>
                  <p className="text-gray-500 dark:text-gray-400">원하는 조건을 선택하여 프로그램을 찾아보세요.</p>
                </div>
                <div className="space-y-4">
                  <Select onValueChange={handleRegionChange} value={selectedRegion}>
                    <SelectTrigger>
                      <SelectValue placeholder="도/시 선택" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[264px] overflow-y-auto">
                      {uniqueRegions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select onValueChange={handleCityChange} value={selectedCity} disabled={!selectedRegion}>
                    <SelectTrigger>
                      <SelectValue placeholder="시/군/구 선택" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[264px] overflow-y-auto">
                      {currentCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select onValueChange={setSelectedTargetAudience} value={selectedTargetAudience}>
                    <SelectTrigger>
                      <SelectValue placeholder="연령대 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">연령대 선택</SelectItem>
                      <SelectItem value="성인">성인</SelectItem>
                      <SelectItem value="청소년">청소년</SelectItem>
                      <SelectItem value="어린이">어린이</SelectItem>
                      <SelectItem value="노인">노인</SelectItem>
                      <SelectItem value="장애인">장애인</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="relative">
                    <Input
                      placeholder="프로그램 또는 시설 검색"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-8"
                    />
                    {searchTerm && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                        onClick={() => setSearchTerm("")}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">검색어 지우기</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">전체</TabsTrigger>
                    <TabsTrigger value="regular">일반 프로그램</TabsTrigger>
                    <TabsTrigger value="disability">장애인 프로그램</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {currentPrograms.map((program) => (
                        <ProgramCard key={program.id} program={program} />
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="regular">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {currentPrograms.filter(program => !program.isDisabilityProgram).map((program) => (
                        <ProgramCard key={program.id} program={program} />
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="disability">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {currentPrograms.filter(program => program.isDisabilityProgram).map((program) => (
                        <ProgramCard key={program.id} program={program} />
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
                <div className="flex justify-center mt-8 space-x-2">
                  <Button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">이전</span>
                  </Button>
                  <span className="mx-2 self-center">
                    {currentPage} / {pageCount}
                  </span>
                  <Button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                    disabled={currentPage === pageCount}
                  >
                    <span className="sr-only">다음</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
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

function ProgramCard({ program }: { program: Program }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="group cursor-pointer p-4 rounded-lg transition-all duration-300 bg-gradient-to-br from-blue-50/30 to-purple-50/30 hover:from-blue-100/40 hover:to-purple-100/40 dark:from-blue-900/30 dark:to-purple-900/30 dark:hover:from-blue-800/40 dark:hover:to-purple-800/40 shadow-lg hover:shadow-lg dark:shadow-gray-800/40 dark:hover:shadow-gray-700/50 border border-gray-200 dark:border-gray-700 h-[200px] relative"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {program.programName}
            </h3>
            <Badge variant="outline" className="bg-white text-black whitespace-nowrap ml-2">
              {program.isDisabilityProgram ? '장애인 대상' : '일반인 대상'}
            </Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-2">{program.facilityName}</p>
          <div className="mt-4 space-y-2 text-sm">
            <p className="flex items-center text-gray-500">
              <Activity className="w-4 h-4 mr-2" />
              {program.targetAudience}
            </p>
            <p className="flex items-center text-gray-500">
              <MapPin className="w-4 h-4 mr-2" />
              {program.region} {program.city}
            </p>
          </div>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{program.programName}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          {!program.isDisabilityProgram && (
            <>
              <div>
                <h4 className="font-semibold text-sm text-gray-500 mb-1">시설명</h4>
                <p className="text-lg">{program.facilityName}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-500 mb-1">시설 유형</h4>
                <p className="text-lg">{program.facilityType}</p>
              </div>
            </>
          )}
          <div>
            <h4 className="font-semibold text-sm text-gray-500 mb-1">지역</h4>
            <p className="text-lg">{program.region} {program.city}</p>
          </div>
          {!program.isDisabilityProgram && (
            <>
              <div>
                <h4 className="font-semibold text-sm text-gray-500 mb-1">주소</h4>
                <p className="text-lg">{program.address}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-500 mb-1">전화번호</h4>
                <p className="text-lg">{program.phone}</p>
              </div>
            </>
          )}
          <div>
            <h4 className="font-semibold text-sm text-gray-500 mb-1">대상</h4>
            <p className="text-lg">{program.targetAudience}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-500 mb-1">기간</h4>
            <p className="text-lg">{program.startDate} ~ {program.endDate}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-500 mb-1">요일 및 시간</h4>
            <p className="text-lg">{program.days} {program.time}</p>
          </div>
          {!program.isDisabilityProgram && (
            <>
              <div>
                <h4 className="font-semibold text-sm text-gray-500 mb-1">모집 인원</h4>
                <p className="text-lg">{program.capacity}명</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-500 mb-1">가격</h4>
                <p className="text-lg">{program.price}원</p>
              </div>
            </>
          )}
        </div>
        {program.isDisabilityProgram && program.programIntroduction && (
          <div className="mt-4">
            <h4 className="font-semibold text-sm text-gray-500 mb-1">프로그램 소개</h4>
            <p className="text-lg">{program.programIntroduction}</p>
          </div>
        )}
        {!program.isDisabilityProgram && (
          <div className="mt-4">
            <h4 className="font-semibold text-sm text-gray-500 mb-1">홈페이지</h4>
            <a href={program.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {program.website}
            </a>
          </div>
        )}
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="secondary">{program.region}</Badge>
          <Badge variant="secondary">{program.city}</Badge>
          {!program.isDisabilityProgram && (
            <Badge variant="secondary">{program.facilityType}</Badge>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}