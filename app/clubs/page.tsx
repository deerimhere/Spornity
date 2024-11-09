'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Users, MapPin, Calendar, Accessibility, Search, Menu, X, ChevronDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from 'framer-motion'
import Papa from 'papaparse'

interface Club {
  id: string
  name: string
  sport: string
  members: string
  meetingDay: string
  location: string
  disabilityFriendly: boolean
  region: string
  district: string
  disabilityType?: string
  introduction?: string
}

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([])
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([])
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  // const [showDisabilityFriendly, setShowDisabilityFriendly] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [uniqueRegions, setUniqueRegions] = useState<string[]>([])
  const [uniqueDistricts, setUniqueDistricts] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchData = async () => {
      const [generalResponse, disabilityResponse] = await Promise.all([
        fetch('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%EC%A7%80%EC%97%AD%EB%B3%84%20%EC%8A%A4%ED%8F%AC%EC%B8%A0%20%EB%8F%99%ED%98%B8%ED%9A%8C%20%ED%98%84%ED%99%A9%20%EC%9D%BC%EB%B6%80-jFaPgzcX9oqqbrqukhFL9wH9SmRSkR.csv'),
        fetch('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%EC%9E%A5%EC%95%A0%EC%9D%B8%EC%83%9D%ED%99%9C%EC%B2%B4%EC%9C%A1%EB%8F%99%ED%98%B8%EC%9D%B8%EB%8F%99%ED%98%B8%ED%9A%8C%EC%A1%B0%ED%9A%8C%EC%A0%95%EB%B3%B4-l7nsdy7qH7WqBXvyfWRxbtvqcGzOqm.csv')
      ])

      const generalCsv = await generalResponse.text()
      const disabilityCsv = await disabilityResponse.text()

      const generalResults = Papa.parse(generalCsv, { header: true, skipEmptyLines: true })
      const disabilityResults = Papa.parse(disabilityCsv, { header: true, skipEmptyLines: true })

      const generalClubs: Club[] = generalResults.data.map((row: any, index: number) => ({
        id: `general-${index}`,
        name: row['동호회명'] || '정보 없음',
        sport: row['종목명'] || '정보 없음',
        members: row['회원수'] || '0',
        meetingDay: '정보 없음',
        location: row['시군구명'] || '정보 없음',
        disabilityFriendly: false,
        region: row['시도명'] || '정보 없음',
        district: row['시군구명']?.replace(row['시도명'], '').trim() || '정보 없음',
      }))

      const disabilityClubs: Club[] = disabilityResults.data.map((row: any, index: number) => ({
        id: `disability-${index}`,
        name: row['동호회명'] || '정보 없음',
        sport: row['종목명'] || '정보 없음',
        members: '정보 없음',
        meetingDay: row['운영시간내용'] || '정보 없음',
        location: row['시군구명'] || '정보 없음',
        disabilityFriendly: true,
        region: row['시도명'] || '정보 없음',
        district: row['시군구명']?.replace(row['시도명'], '').trim() || '정보 없음',
        disabilityType: row['장애유형명'] || '정보 없음',
        introduction: row['동호회 소개내용'] || '정보 없음',
      }))

      const allClubs = [...generalClubs, ...disabilityClubs]
      setClubs(allClubs)

      const regions = [...new Set(allClubs.map(item => item.region))]
      setUniqueRegions(regions)
    }

    fetchData()
  }, [])

  useEffect(() => {
    let filtered = clubs

    if (selectedRegion) {
      filtered = filtered.filter(club => club.region === selectedRegion)
      const districts = [...new Set(filtered.map(item => item.district))]
      setUniqueDistricts(districts)
    }

    if (selectedDistrict) {
      filtered = filtered.filter(club => club.district === selectedDistrict)
    }

    // if (showDisabilityFriendly) {
    //   filtered = filtered.filter(club => club.disabilityFriendly)
    // }

    if (searchTerm) {
      filtered = filtered.filter(club => 
        club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.sport.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (activeTab === "disability") {
      filtered = filtered.filter(club => club.disabilityFriendly)
    } else if (activeTab === "general") {
      filtered = filtered.filter(club => !club.disabilityFriendly)
    }

    setFilteredClubs(filtered)
  }, [clubs, selectedRegion, selectedDistrict, searchTerm, activeTab])

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value)
    setSelectedDistrict('')
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
                  지역 동호회 검색
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  당신의 관심사와 지역에 맞는 동호회를 찾아보세요.<br />
                  새로운 취미와 친구들이 기다리고 있습니다.
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
                  <p className="text-gray-500 dark:text-gray-400">원하는 조건을 선택하여 동호회를 찾아보세요.</p>
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
                  <Select onValueChange={setSelectedDistrict} disabled={!selectedRegion}>
                    <SelectTrigger>
                      <SelectValue placeholder="구 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueDistricts.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* <div className="flex items-center space-x-2">
                    <Switch
                      id="disability-friendly"
                      checked={showDisabilityFriendly}
                      onCheckedChange={setShowDisabilityFriendly}
                    />
                    <Label htmlFor="disability-friendly">장애인 동호회만 보기</Label>
                  </div> */}
                  <Input
                    placeholder="동호회 또는 종목 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">전체</TabsTrigger>
                    <TabsTrigger value="general">일반인 동호회</TabsTrigger>
                    <TabsTrigger value="disability">장애인 동호회</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {filteredClubs.map((club) => (
                        <ClubCard key={club.id} club={club} />
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="general">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {filteredClubs.filter(club => !club.disabilityFriendly).map((club) => (
                        <ClubCard key={club.id} club={club} />
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="disability">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {filteredClubs.filter(club => club.disabilityFriendly).map((club) => (
                        <ClubCard key={club.id} club={club} />
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

function ClubCard({ club }: { club: Club }) {
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
            {club.name}
          </h3>
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-600 dark:text-gray-400">{club.sport}</p>
            <Badge variant="outline" className="bg-white text-black">
              {club.disabilityFriendly ? '장애인 동호회' : '일반인 동호회'}
            </Badge>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            {!club.disabilityFriendly && (
              <p className="flex items-center text-gray-500">
                <Users className="w-4 h-4 mr-2" />
                회원 수: {club.members}명
              </p>
            )}
            <p className="flex items-center text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              모임 일정: {club.meetingDay}
            </p>
            <p className="flex items-center text-gray-500">
              <MapPin className="w-4 h-4 mr-2" />
              위치: {club.location}
            </p>
          </div>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{club.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-sm text-gray-500 mb-1">종목</h4>
            <p className="text-lg">{club.sport}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-500 mb-1">회원 수</h4>
            <p className="text-lg">{club.members}명</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-500 mb-1">모임 일정</h4>
            <p className="text-lg">{club.meetingDay}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-500 mb-1">위치</h4>
            <p className="text-lg">{club.location}</p>
          </div>
        </div>
        {club.disabilityFriendly && (
          <div>
            <h4 className="font-bold text-lg mb-2">장애인 친화 정보</h4>
            {club.disabilityType && (
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-semibold">장애유형:</span> {club.disabilityType}
              </p>
            )}
          </div>
        )}
        {club.introduction && (
          <div>
            <h4 className="font-bold text-lg mb-2">동호회 소개</h4>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
              {club.introduction}
            </p>
          </div>
        )}
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline" className="bg-white text-black">
            {club.disabilityFriendly ? '장애인 동호회' : '일반인 동호회'}
          </Badge>
          <Badge variant="secondary">{club.sport}</Badge>
          <Badge variant="secondary">{club.region}</Badge>
        </div>
      </DialogContent>
    </Dialog>
  )
}