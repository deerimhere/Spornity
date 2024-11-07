"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Activity, Phone, Calendar, Clock, Globe, Users, Accessibility, Search, ChevronDown, Menu, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

type Program = {
  id: number;
  name: string;
  facility: string;
  address: string;
  phone: string;
  startDate: string;
  endDate: string;
  days: string;
  time: string;
  website: string;
  ageGroup: string;
  disabilityFriendly: boolean;
}

type ProgramsData = {
  [region: string]: {
    [sport: string]: Program[];
  };
}

const programsData: ProgramsData = {
  서울: {
    수영: [
      {
        id: 1,
        name: '아침 수영 교실',
        facility: '강남 스포츠 센터',
        address: '서울시 강남구 테헤란로 123',
        phone: '02-1234-5678',
        startDate: '2024-03-01',
        endDate: '2024-05-31',
        days: '월, 수, 금',
        time: '06:00 - 07:30',
        website: 'http://www.gangnamsports.com',
        ageGroup: '성인',
        disabilityFriendly: true
      },
      {
        id: 2,
        name: '주말 가족 수영',
        facility: '송파 올림픽 수영장',
        address: '서울시 송파구 올림픽로 300',
        phone: '02-2345-6789',
        startDate: '2024-04-01',
        endDate: '2024-06-30',
        days: '토, 일',
        time: '10:00 - 12:00',
        website: 'http://www.songpapool.com',
        ageGroup: '전연령',
        disabilityFriendly: false
      },
    ],
    농구: [
      {
        id: 3,
        name: '청소년 농구 교실',
        facility: '마포 체육관',
        address: '서울시 마포구 월드컵로 234',
        phone: '02-3456-7890',
        startDate: '2024-03-15',
        endDate: '2024-06-15',
        days: '화, 목',
        time: '17:00 - 19:00',
        website: 'http://www.maposports.com',
        ageGroup: '청소년',
        disabilityFriendly: true
      },
      {
        id: 4,
        name: '휠체어 농구 클래스',
        facility: '강동 농구센터',
        address: '서울시 강동구 천호대로 567',
        phone: '02-4567-8901',
        startDate: '2024-04-01',
        endDate: '2024-08-31',
        days: '월, 수',
        time: '20:00 - 22:00',
        website: 'http://www.gangdongbasketball.com',
        ageGroup: '성인',
        disabilityFriendly: true
      },
    ],
  },
  부산: {
    요가: [
      {
        id: 5,
        name: '해변 요가',
        facility: '해운대 비치 요가 센터',
        address: '부산시 해운대구 해운대해변로 123',
        phone: '051-1234-5678',
        startDate: '2024-05-01',
        endDate: '2024-08-31',
        days: '월, 수, 금',
        time: '07:00 - 08:30',
        website: 'http://www.haeundaeyoga.com',
        ageGroup: '성인',
        disabilityFriendly: false
      },
      {
        id: 6,
        name: '적응형 요가',
        facility: '부산 웰니스 센터',
        address: '부산시 부산진구 복지로 456',
        phone: '051-2345-6789',
        startDate: '2024-03-01',
        endDate: '2024-05-31',
        days: '화, 목',
        time: '14:00 - 15:30',
        website: 'http://www.busanwellness.com',
        ageGroup: '전연령',
        disabilityFriendly: true
      },
    ],
  },
}

export default function PublicProgramsPage() {
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedSport, setSelectedSport] = useState('')
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('all')
  const [showDisabilityFriendly, setShowDisabilityFriendly] = useState(false)
  const [programs, setPrograms] = useState<Program[]>([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    if (selectedRegion && selectedSport) {
      let filteredPrograms = programsData[selectedRegion]?.[selectedSport] || []
      if (selectedAgeGroup !== 'all') {
        filteredPrograms = filteredPrograms.filter(
          program => selectedAgeGroup === '전연령' || program.ageGroup === selectedAgeGroup
        )
      }
      if (showDisabilityFriendly) {
        filteredPrograms = filteredPrograms.filter(program => program.disabilityFriendly)
      }
      setPrograms(filteredPrograms)
    } else {
      setPrograms([])
    }
  }, [selectedRegion, selectedSport, selectedAgeGroup, showDisabilityFriendly])

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value)
    setSelectedSport('')
    setSelectedAgeGroup('all')
  }

  const handleSportChange = (value: string) => {
    setSelectedSport(value)
    setSelectedAgeGroup('all')
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
            <motion.h1 
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none mb-8 text-center text-gray-800 dark:text-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              공공체육시설 프로그램 검색
            </motion.h1>
            <motion.div 
              className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="grid gap-6 md:grid-cols-3 mb-6">
                <div>
                  <label htmlFor="region-select" className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                    지역
                  </label>
                  <Select onValueChange={handleRegionChange}>
                    <SelectTrigger id="region-select" className="w-full">
                      <SelectValue placeholder="지역 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="서울">서울</SelectItem>
                      <SelectItem value="부산">부산</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="sport-select" className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                    운동 종류
                  </label>
                  <Select onValueChange={handleSportChange} disabled={!selectedRegion}>
                    <SelectTrigger id="sport-select" className="w-full">
                      <SelectValue placeholder="운동 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedRegion && Object.keys(programsData[selectedRegion]).map((sport) => (
                        <SelectItem key={sport} value={sport}>
                          {sport}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="age-group-select" className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                    대상 연령대
                  </label>
                  <Select onValueChange={setSelectedAgeGroup} disabled={!selectedSport}>
                    <SelectTrigger id="age-group-select" className="w-full">
                      <SelectValue placeholder="연령대 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="전연령">전연령</SelectItem>
                      <SelectItem value="성인">성인</SelectItem>
                      <SelectItem value="청소년">청소년</SelectItem>
                      <SelectItem value="유아">유아</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2 mb-6">
                <Switch
                  id="disability-friendly"
                  checked={showDisabilityFriendly}
                  onCheckedChange={setShowDisabilityFriendly}
                />
                <Label htmlFor="disability-friendly" className="text-sm text-gray-700 dark:text-gray-300">장애인 친화 프로그램만 보기</Label>
              </div>
              <Button className="w-full" disabled={!selectedRegion || !selectedSport}>
                <Search className="mr-2 h-4 w-4" /> 검색
              </Button>
            </motion.div>
            <AnimatePresence>
              {programs.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">
                    {selectedRegion}의 {selectedSport} 프로그램
                    {selectedAgeGroup !== 'all' && ` (${selectedAgeGroup})`}
                    {showDisabilityFriendly && ' - 장애인 친화'}
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {programs.map((program, index) => (
                      <motion.div
                        key={program.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <Activity className="mr-2 h-4 w-4" /> {program.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="font-semibold mb-2">{program.facility}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{program.address}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center">
                              <Phone className="mr-2 h-4 w-4" /> {program.phone}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center">
                              <Calendar className="mr-2 h-4 w-4" /> {program.startDate} ~ {program.endDate}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center">
                              <Clock className="mr-2 h-4 w-4" /> {program.days} {program.time}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center">
                              <Users className="mr-2 h-4 w-4" /> 대상: {program.ageGroup}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center">
                              <Accessibility className="mr-2 h-4 w-4" /> 
                              장애인 친화: {program.disabilityFriendly ? '예' : '아니오'}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                              <Globe className="mr-2 h-4 w-4" /> 
                              <a href={program.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                홈페이지 방문
                              </a>
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-12"
                >
                  <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-xl text-gray-600 dark:text-gray-400">지역과 운동 종류를 선택하여 프로그램을 검색해보세요.</p>
                </motion.div>
              )}
            </AnimatePresence>
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