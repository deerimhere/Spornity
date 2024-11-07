'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Users, MapPin, Calendar, Accessibility, Search, Menu, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { motion } from 'framer-motion'

// Club 인터페이스 정의
interface Club {
  id: number
  name: string
  sport: string
  members: number
  meetingDay: string
  location: string
  disabilityFriendly: boolean
}

// 지역 및 구 타입 정의
type Region = '서울' | '부산'

type District = 
  | '강남구'
  | '강서구'
  | '해운대구'
  | '수영구'

// ClubsData 타입 정의
type ClubsData = {
  서울: {
    강남구: Club[]
    강서구: Club[]
  }
  부산: {
    해운대구: Club[]
    수영구: Club[]
  }
}

// 더미 데이터 정의
const clubsData: ClubsData = {
  서울: {
    강남구: [
      { id: 1, name: '강남 러닝 크루', sport: '러닝', members: 50, meetingDay: '매주 토요일', location: '강남구 테헤란로', disabilityFriendly: false },
      { id: 2, name: '청담 테니스 클럽', sport: '테니스', members: 30, meetingDay: '매주 일요일', location: '강남구 청담동', disabilityFriendly: true },
    ],
    강서구: [
      { id: 3, name: '강서 축구 동호회', sport: '축구', members: 40, meetingDay: '매주 토요일', location: '강서구 화곡동', disabilityFriendly: false },
      { id: 4, name: '마곡 배드민턴 클럽', sport: '배드민턴', members: 25, meetingDay: '매주 수요일', location: '강서구 마곡동', disabilityFriendly: true },
    ],
  },
  부산: {
    해운대구: [
      { id: 5, name: '해운대 비치 발리볼', sport: '비치발리볼', members: 20, meetingDay: '매주 토요일', location: '해운대구 우동', disabilityFriendly: false },
      { id: 6, name: '센텀 농구 동호회', sport: '농구', members: 15, meetingDay: '매주 금요일', location: '해운대구 우동', disabilityFriendly: true },
    ],
    수영구: [
      { id: 7, name: '광안리 서핑 클럽', sport: '서핑', members: 35, meetingDay: '매주 토요일', location: '수영구 광안동', disabilityFriendly: false },
      { id: 8, name: '민락 수영 동호회', sport: '수영', members: 40, meetingDay: '매주 월요일', location: '수영구 민락동', disabilityFriendly: true },
    ],
  },
}

export default function ClubsPage() {
  const [selectedRegion, setSelectedRegion] = useState<Region | ''>('')
  const [selectedDistrict, setSelectedDistrict] = useState<District | ''>('')
  const [showDisabilityFriendly, setShowDisabilityFriendly] = useState(false)
  const [clubs, setClubs] = useState<Club[]>([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    if (selectedRegion && selectedDistrict) {
      const regionData = clubsData[selectedRegion]
      const districtData = regionData[selectedDistrict]
      const filteredClubs = showDisabilityFriendly
        ? districtData.filter(club => club.disabilityFriendly)
        : districtData
      setClubs(filteredClubs)
    } else {
      setClubs([])
    }
  }, [selectedRegion, selectedDistrict, showDisabilityFriendly])

  const handleRegionChange = (value: string) => {
    if (value === '서울' || value === '부산') {
      setSelectedRegion(value)
      setSelectedDistrict('')
    }
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
                <span className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                  지역
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
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-8 text-center text-gray-800 dark:text-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              지역 동호회 검색
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
                  <label htmlFor="district-select" className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                    구
                  </label>
                  <Select onValueChange={(value: string) => {
                    if (
                      (selectedRegion === '서울' && (value === '강남구' || value === '강서구')) ||
                      (selectedRegion === '부산' && (value === '해운대구' || value === '수영구'))
                    ) {
                      setSelectedDistrict(value as District)
                    }
                  }} disabled={!selectedRegion}>
                    <SelectTrigger id="district-select" className="w-full">
                      <SelectValue placeholder="구 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedRegion && Object.keys(clubsData[selectedRegion]).map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="disability-friendly"
                    checked={showDisabilityFriendly}
                    onCheckedChange={setShowDisabilityFriendly}
                  />
                  <Label htmlFor="disability-friendly" className="text-sm text-gray-700 dark:text-gray-300">장애인 친화 동호회만 보기</Label>
                </div>
              </div>
              <Button className="w-full" disabled={!selectedRegion || !selectedDistrict}>
                <Search className="mr-2 h-4 w-4" /> 검색
              </Button>
            </motion.div>
            {clubs.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">
                  {selectedRegion} {selectedDistrict}의 동호회
                  {showDisabilityFriendly && ' (장애인 친화)'}
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {clubs.map((club, index) => (
                    <motion.div
                      key={club.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{club.name}</h3>
                          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-4">{club.sport}</p>
                          <div className="space-y-2 text-gray-600 dark:text-gray-400">
                            <p className="flex items-center">
                              <Users className="text-blue-500 mr-2 h-4 w-4" /> 회원 수: {club.members}명
                            </p>
                            <p className="flex items-center">
                              <Calendar className="text-blue-500 mr-2 h-4 w-4" /> 모임 일정: {club.meetingDay}
                            </p>
                            <p className="flex items-center">
                              <MapPin className="text-blue-500 mr-2 h-4 w-4" /> 위치: {club.location}
                            </p>
                            <p className="flex items-center">
                              <Accessibility className="text-blue-500 mr-2 h-4 w-4" /> 
                              장애인 친화: {club.disabilityFriendly ? '예' : '아니오'}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-xl text-gray-600 dark:text-gray-400">지역과 구를 선택하여 동호회를 검색해보세요.</p>
              </div>
            )}
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
                <li><Link href="/fitness" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">체력 진단</Link></li>
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