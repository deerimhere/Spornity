'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Activity, Phone, Calendar, Clock, Globe, Users, Search, ChevronDown, Menu, X, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import Papa from 'papaparse'

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
  sportName?: string;
  subSportName?: string;
  disabilityType?: string;
  programIntroduction?: string;
  recruitmentStartDate?: string;
  recruitmentEndDate?: string;
}

export default function PublicProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([])
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedTargetAudience, setSelectedTargetAudience] = useState('all')
  const [selectedDisabilityType, setSelectedDisabilityType] = useState('all')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [uniqueRegions, setUniqueRegions] = useState<string[]>([])
  const [uniqueCities, setUniqueCities] = useState<string[]>([])
  const [uniqueDisabilityTypes, setUniqueDisabilityTypes] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchData = async () => {
      const [regularResponse, disabilityResponse] = await Promise.all([
        fetch('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%EA%B3%B5%EA%B3%B5%EC%B2%B4%EC%9C%A1%EC%8B%9C%EC%84%A4%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%A8%EC%A0%95%EB%B3%B4%20%EC%9D%BC%EB%B6%80-clNcR9aFyNirMJ7ZBgTPl3YUiD40Zr.csv'),
        fetch('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%EC%9E%A5%EC%95%A0%EC%9D%B8%EC%83%9D%ED%99%9C%EC%B2%B4%EC%9C%A1%EA%B5%90%EC%8B%A4%EB%8D%B0%EC%9D%B4%ED%84%B0-TyyuLqpjrVLBEcQ8zhbWjwPAQNr2wT.csv')
      ])

      const regularReader = regularResponse.body?.getReader()
      const disabilityReader = disabilityResponse.body?.getReader()

      const [regularResult, disabilityResult] = await Promise.all([
        regularReader?.read(),
        disabilityReader?.read()
      ])

      const decoder = new TextDecoder('utf-8')
      const regularCsv = decoder.decode(regularResult?.value)
      const disabilityCsv = decoder.decode(disabilityResult?.value)

      const regularResults = Papa.parse(regularCsv, { header: true, skipEmptyLines: true })
      const disabilityResults = Papa.parse(disabilityCsv, { header: true, skipEmptyLines: true })

      const regularPrograms: Program[] = regularResults.data.map((row: any, index: number) => ({
        id: index,
        facilityName: row['시설명'] || '정보 없음',
        facilityType: row['시설유형명'] || '정보 없음',
        region: row['시도명'] || '정보 없음',
        city: row['시군구명'] || '정보 없음',
        address: row['시설주소'] || '정보 없음',
        phone: row['시설전화번호'] || '정보 없음',
        programName: row['프로그램 명'] || '정보 없음',
        targetAudience: row['프로그램 대상명'] || '정보 없음',
        startDate: row['프로그램 시작일자'] || '정보 없음',
        endDate: row['프로그램 종료일자'] || '정보 없음',
        days: row['프로그램 개설 요일명'] || '정보 없음',
        time: row['프로그램 개설 시간대값'] || '정보 없음',
        capacity: row['프로그램 모집인원수'] || '0',
        price: row['프로그램 가격'] || '정보 없음',
        priceType: row['프로그램 가격 유형명'] || null,
        website: row['홈페이지 유형명'] || '정보 없음',
        isDisabilityProgram: false,
      }))

      const disabilityPrograms: Program[] = disabilityResults.data.map((row: any, index: number) => ({
        id: regularPrograms.length + index,
        facilityName: '정보 없음',
        facilityType: '장애인 생활체육교실',
        region: row['시도명'] || '정보 없음',
        city: row['시군구명'] || '정보 없음',
        address: '정보 없음',
        phone: '정보 없음',
        programName: row['프로그램명'] || '정보 없음',
        targetAudience: '장애인',
        startDate: row['운영시작일'] || '정보 없음',
        endDate: row['운영종료일'] || '정보 없음',
        days: row['운영시간']?.split(' ')[0] || '정보 없음',
        time: row['운영시간']?.split(' ')[1] || '정보 없음',
        capacity: '정보 없음',
        price: '정보 없음',
        priceType: null,
        website: '정보 없음',
        isDisabilityProgram: true,
        sportName: row['종목명'] || '정보 없음',
        subSportName: row['부종목명'] || '정보 없음',
        disabilityType: row['장애유형명'] || '정보 없음',
        programIntroduction: row['프로그램소개내용'] || '정보 없음',
        recruitmentStartDate: row['모집시작일'] || '정보 없음',
        recruitmentEndDate: row['모집종료일'] || '정보 없음',
      }))

      const allPrograms = [...regularPrograms, ...disabilityPrograms]
      setPrograms(allPrograms)

      const regions = [...new Set(allPrograms.map(item => item.region))]
      setUniqueRegions(regions)

      const disabilityTypes = [...new Set(disabilityPrograms.map(item => item.disabilityType))]
      setUniqueDisabilityTypes(disabilityTypes)
    }

    fetchData()
  }, [])

  useEffect(() => {
    let filtered = programs

    if (selectedRegion) {
      filtered = filtered.filter(program => program.region === selectedRegion)
      const cities = [...new Set(filtered.map(item => item.city))]
      setUniqueCities(cities)
    }

    if (selectedCity) {
      filtered = filtered.filter(program => program.city === selectedCity)
    }

    if (selectedTargetAudience !== 'all') {
      filtered = filtered.filter(program => program.targetAudience.includes(selectedTargetAudience))
    }

    if (selectedDisabilityType !== 'all') {
      filtered = filtered.filter(program => program.disabilityType === selectedDisabilityType)
    }

    if (searchTerm) {
      filtered = filtered.filter(program => 
        program.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (program.sportName && program.sportName.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (activeTab === "disability") {
      filtered = filtered.filter(program => program.isDisabilityProgram)
    } else if (activeTab === "regular") {
      filtered = filtered.filter(program => !program.isDisabilityProgram)
    }

    setFilteredPrograms(filtered)
  }, [programs, selectedRegion, selectedCity, selectedTargetAudience, selectedDisabilityType, searchTerm, activeTab])

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value)
    setSelectedCity('')
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
                  <Select onValueChange={handleRegionChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="지역 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueRegions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select onValueChange={setSelectedCity} disabled={!selectedRegion}>
                    <SelectTrigger>
                      <SelectValue placeholder="시/군/구 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select onValueChange={setSelectedTargetAudience}>
                    <SelectTrigger>
                      <SelectValue placeholder="대상 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="성인">성인</SelectItem>
                      <SelectItem value="청소년">청소년</SelectItem>
                      <SelectItem value="어린이">어린이</SelectItem>
                      <SelectItem value="노인">노인</SelectItem>
                      <SelectItem value="장애인">장애인</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select onValueChange={setSelectedDisabilityType}>
                    <SelectTrigger>
                      <SelectValue placeholder="장애 유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      {uniqueDisabilityTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="프로그램 또는 시설 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
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
                      {filteredPrograms.map((program) => (
                        <ProgramCard key={program.id} program={program} />
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="regular">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {filteredPrograms.filter(program => !program.isDisabilityProgram).map((program) => (
                        <ProgramCard key={program.id} program={program} />
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="disability">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {filteredPrograms.filter(program => program.isDisabilityProgram).map((program) => (
                        <ProgramCard key={program.id} program={program} />
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
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
          className="group cursor-pointer p-4 rounded-lg transition-all duration-300 bg-gradient-to-br from-blue-50/30 to-purple-50/30 hover:from-blue-100/40 hover:to-purple-100/40 dark:from-blue-900/30 dark:to-purple-900/30 dark:hover:from-blue-800/40 dark:hover:to-purple-800/40 shadow-sm hover:shadow-md dark:shadow-gray-800/30 dark:hover:shadow-gray-700/40"
        >
          <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
            {program.programName}
          </h3>
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-600 dark:text-gray-400">{program.facilityName}</p>
            <Badge variant="outline" className="bg-white text-black whitespace-nowrap">
              {program.isDisabilityProgram ? '장애인 대상' : '일반인 대상'}
            </Badge>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <p className="flex items-center text-gray-500">
              <Activity className="w-4 h-4 mr-2" />
              {program.isDisabilityProgram ? program.sportName : program.targetAudience}
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
          {program.isDisabilityProgram ? (
            <>
              <div>
                <h4 className="font-semibold text-sm text-gray-500 mb-1">종목</h4>
                <p className="text-lg">{program.sportName}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-500 mb-1">부종목</h4>
                <p className="text-lg">{program.subSportName}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-500 mb-1">장애 유형</h4>
                <p className="text-lg">{program.disabilityType}</p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h4 className="font-semibold text-sm text-gray-500 mb-1">대상</h4>
                <p className="text-lg">{program.targetAudience}</p>
              </div>
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
            <h4 className="font-semibold text-sm text-gray-500 mb-1">기간</h4>
            <p className="text-lg">{program.startDate} ~ {program.endDate}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-500 mb-1">요일 및 시간</h4>
            <p className="text-lg">{program.days} {program.time}</p>
          </div>
          {program.isDisabilityProgram ? (
            <>
              <div className="col-span-2">
                <h4 className="font-semibold text-sm text-gray-500 mb-1">프로그램 소개</h4>
                <p className="text-lg">{program.programIntroduction}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-500 mb-1">모집 기간</h4>
                <p className="text-lg">{program.recruitmentStartDate} ~ {program.recruitmentEndDate}</p>
              </div>
            </>
          ) : (
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
          {program.isDisabilityProgram && (
            <Badge variant="secondary">{program.disabilityType}</Badge>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}