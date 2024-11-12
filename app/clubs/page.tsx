'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Users, MapPin, Calendar, Search, Menu, X, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from 'framer-motion'
import preprocessedData from '../../public/data/preprocessed_club_data.json'

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

interface PreprocessedData {
  clubs: Club[];
  uniqueRegions: string[];
  uniqueDistricts: string[];
}

const ITEMS_PER_PAGE = 9;

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>((preprocessedData as PreprocessedData).clubs)
  const [filteredClubs, setFilteredClubs] = useState<Club[]>((preprocessedData as PreprocessedData).clubs)
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [selectedDistrict, setSelectedDistrict] = useState('all')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [uniqueRegions] = useState<string[]>(['all', ...(preprocessedData as PreprocessedData).uniqueRegions])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  const districtsByRegion = useMemo(() => {
    const districts: { [key: string]: string[] } = { 'all': ['all'] };
    clubs.forEach(club => {
      if (!districts[club.region]) {
        districts[club.region] = ['all'];
      }
      if (!districts[club.region].includes(club.district)) {
        districts[club.region].push(club.district);
      }
    });
    return districts;
  }, [clubs]);

  const currentDistricts = useMemo(() => {
    return selectedRegion === 'all' ? ['all'] : districtsByRegion[selectedRegion] || ['all'];
  }, [selectedRegion, districtsByRegion]);

  useEffect(() => {
    let filtered = clubs

    if (selectedRegion && selectedRegion !== 'all') {
      filtered = filtered.filter(club => club.region === selectedRegion)
    }

    if (selectedDistrict && selectedDistrict !== 'all') {
      filtered = filtered.filter(club => club.district === selectedDistrict)
    }

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
    setCurrentPage(1)
  }, [clubs, selectedRegion, selectedDistrict, searchTerm, activeTab])

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value)
    setSelectedDistrict('all')
  }

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value)
  }

  const pageCount = Math.ceil(filteredClubs.length / ITEMS_PER_PAGE);
  const currentClubs = filteredClubs.slice(
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
                  <Select onValueChange={handleRegionChange} value={selectedRegion}>
                    <SelectTrigger>
                      <SelectValue placeholder="지역 선택" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[264px] overflow-y-auto">
                      <SelectItem value="all">전체 지역</SelectItem>
                      {uniqueRegions.filter(region => region !== 'all').map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select 
                    onValueChange={handleDistrictChange} 
                    value={selectedDistrict}
                    disabled={!selectedRegion || selectedRegion === 'all'}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="구 선택" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[264px] overflow-y-auto">
                      <SelectItem value="all">전체 구</SelectItem>
                      {currentDistricts.filter(district => district !== 'all').map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="relative">
                    <Input
                      placeholder="동호회 또는 종목 검색"
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
                    <TabsTrigger value="general">일반인 동호회</TabsTrigger>
                    <TabsTrigger value="disability">장애인 동호회</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {currentClubs.map((club) => (
                        <ClubCard key={club.id} club={club} />
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="general">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {currentClubs.filter(club => !club.disabilityFriendly).map((club) => (
                        <ClubCard key={club.id} club={club} />
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="disability">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {currentClubs.filter(club => club.disabilityFriendly).map((club) => (
                        <ClubCard key={club.id} club={club} />
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

function ClubCard({ club }: { club: Club }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="group cursor-pointer p-4 rounded-lg transition-all duration-300 bg-gradient-to-br from-blue-50/30 to-purple-50/30 hover:from-blue-100/40 hover:to-purple-100/40 dark:from-blue-900/30 dark:to-purple-900/30 dark:hover:from-blue-800/40 dark:hover:to-purple-800/40 shadow-lg hover:shadow-lg dark:shadow-gray-800/40 dark:hover:shadow-gray-700/50 border border-gray-200 dark:border-gray-700 h-[150px] flex flex-col"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 truncate">
              {club.name}
            </h3>
            <Badge variant="outline" className="bg-white text-black whitespace-nowrap ml-2 flex-shrink-0">
              {club.disabilityFriendly ? '장애인 동호회' : '일반인 동호회'}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 truncate">{club.sport}</p>
          <div className="mt-auto space-y-2 text-sm">
            <p className="flex items-center text-gray-500">
              {club.disabilityFriendly ? (
                <>
                  <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">모임 일정: {club.meetingDay}</span>
                </>
              ) : (
                <>
                  <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">모임 인원: {club.members}명</span>
                </>
              )}
            </p>
            <p className="flex items-center text-gray-500">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">지역: {club.region} {club.district}</span>
            </p>
          </div>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{club.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div>
            <h4 className="font-semibold text-sm text-gray-500 mb-1">종목</h4>
            <p className="text-gray-700 dark:text-gray-300">{club.sport}</p>
          </div>
          {club.disabilityFriendly ? (
            <div>
              <h4 className="font-semibold text-sm text-gray-500 mb-1">모임 일정</h4>
              <p className="text-gray-700 dark:text-gray-300">{club.meetingDay}</p>
            </div>
          ) : (
            <div>
              <h4 className="font-semibold text-sm text-gray-500 mb-1">모임 인원</h4>
              <p className="text-gray-700 dark:text-gray-300">{club.members}명</p>
            </div>
          )}
          <div>
            <h4 className="font-semibold text-sm text-gray-500 mb-1">지역</h4>
            <p className="text-gray-700 dark:text-gray-300">{club.region} {club.district}</p>
          </div>
          {club.disabilityFriendly && (
            <div>
              <h4 className="font-semibold text-sm text-gray-500 mb-1">장애 유형</h4>
              <p className="text-gray-700 dark:text-gray-300">{club.disabilityType}</p>
            </div>
          )}
          {club.introduction && (
            <div>
              <h4 className="font-semibold text-sm text-gray-500 mb-1">동호회 소개</h4>
              <p className="text-gray-700 dark:text-gray-300">{club.introduction}</p>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="secondary">{club.disabilityFriendly ? '장애인 동호회' : '일반인 동호회'}</Badge>
          <Badge variant="secondary">{club.sport}</Badge>
          <Badge variant="secondary">{club.region}</Badge>
          <Badge variant="secondary">{club.district}</Badge>
        </div>
      </DialogContent>
    </Dialog>
  )
}