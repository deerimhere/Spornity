'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { MapPin, Phone, Search, ChevronDown, Menu, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from 'framer-motion'
import preprocessedDataRaw from '../../public/data/preprocessed_facilities_data.json'

interface Facility {
  id: string
  name: string
  type: string
  address: string
  phone: string
  agencyPhone: string
  big: string
  normal: string
  small: string
}

interface PreprocessedData {
  facilities: Facility[]
  uniqueBig: string[]
  uniqueNormal: string[]
  uniqueSmall: string[]
}

const preprocessedData: PreprocessedData = preprocessedDataRaw as PreprocessedData

const ITEMS_PER_PAGE = 9;

export default function FacilitiesPage() {
  const [facilities] = useState<Facility[]>(preprocessedData.facilities)
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>(preprocessedData.facilities)
  const [selectedBig, setSelectedBig] = useState('all')
  const [selectedNormal, setSelectedNormal] = useState('all')
  const [selectedSmall, setSelectedSmall] = useState('all')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [uniqueBig] = useState<string[]>(['all', ...new Set(preprocessedData.uniqueBig)])
  const [uniqueNormal, setUniqueNormal] = useState<string[]>(['all', ...new Set(preprocessedData.uniqueNormal)])
  const [uniqueSmall, setUniqueSmall] = useState<string[]>(['all', ...new Set(preprocessedData.uniqueSmall)])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const normalByBig = useMemo(() => {
    const normal: { [key: string]: string[] } = { 'all': ['all'] };
    facilities.forEach(facility => {
      if (!normal[facility.big]) {
        normal[facility.big] = ['all'];
      }
      if (!normal[facility.big].includes(facility.normal)) {
        normal[facility.big].push(facility.normal);
      }
    });
    return normal;
  }, [facilities]);

  const smallByNormal = useMemo(() => {
    const small: { [key: string]: { [key: string]: string[] } } = { 'all': { 'all': ['all'] } };
    facilities.forEach(facility => {
      if (!small[facility.big]) {
        small[facility.big] = { 'all': ['all'] };
      }
      if (!small[facility.big][facility.normal]) {
        small[facility.big][facility.normal] = ['all'];
      }
      if (!small[facility.big][facility.normal].includes(facility.small)) {
        small[facility.big][facility.normal].push(facility.small);
      }
    });
    return small;
  }, [facilities]);

  useEffect(() => {
    let filtered = facilities

    if (selectedBig && selectedBig !== 'all') {
      filtered = filtered.filter(facility => facility.big === selectedBig)
    }

    if (selectedNormal && selectedNormal !== 'all') {
      filtered = filtered.filter(facility => facility.normal === selectedNormal)
    }

    if (selectedSmall && selectedSmall !== 'all') {
      filtered = filtered.filter(facility => facility.small === selectedSmall)
    }

    if (searchTerm) {
      filtered = filtered.filter(facility => 
        facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facility.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredFacilities(filtered)
    setCurrentPage(1)
  }, [facilities, selectedBig, selectedNormal, selectedSmall, searchTerm])

  const handleBigChange = (value: string) => {
    setSelectedBig(value)
    setSelectedNormal('all')
    setSelectedSmall('all')
    const newNormal = value === 'all' ? ['all'] : ['all', ...new Set(normalByBig[value] || [])]
    setUniqueNormal(newNormal.filter((item, index) => newNormal.indexOf(item) === index))
    setUniqueSmall(['all'])
  }

  const handleNormalChange = (value: string) => {
    setSelectedNormal(value)
    setSelectedSmall('all')
    const newSmall = value === 'all' ? ['all'] : ['all', ...new Set(smallByNormal[selectedBig][value] || [])]
    setUniqueSmall(newSmall.filter((item, index) => newSmall.indexOf(item) === index))
  }

  const handleSmallChange = (value: string) => {
    setSelectedSmall(value)
  }

  const pageCount = Math.ceil(filteredFacilities.length / ITEMS_PER_PAGE);
  const currentFacilities = filteredFacilities.slice(
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
                  지역 체육 시설 검색
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  당신의 지역에 있는 체육 시설을 찾아보세요.<br />
                  건강한 라이프스타일을 위한 첫 걸음입니다.
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
                  <p className="text-gray-500 dark:text-gray-400">원하는 조건을 선택하여 체육 시설을 찾아보세요.</p>
                </div>
                <div className="space-y-4">
                  <Select onValueChange={handleBigChange} value={selectedBig}>
                    <SelectTrigger>
                      <SelectValue placeholder="도/시 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="max-h-[200px] overflow-y-auto">
                        <SelectItem value="all">도/시 선택</SelectItem>
                        {uniqueBig.filter(big => big !== 'all').map((big) => (
                          <SelectItem key={big} value={big}>
                            {big}
                          </SelectItem>
                        ))}
                      </div>
                    </SelectContent>
                  </Select>
                  <Select onValueChange={handleNormalChange} value={selectedNormal} disabled={!selectedBig || selectedBig === 'all'}>
                    <SelectTrigger>
                      <SelectValue placeholder="시/군/구 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="max-h-[200px] overflow-y-auto">
                        <SelectItem value="all">시/군/구 선택</SelectItem>
                        {uniqueNormal.filter(normal => normal !== 'all').map((normal) => (
                          <SelectItem key={normal} value={normal}>
                            {normal}
                          </SelectItem>
                        ))}
                      </div>
                    </SelectContent>
                  </Select>
                  <Select onValueChange={handleSmallChange} value={selectedSmall} disabled={!selectedNormal || selectedNormal === 'all'}>
                    <SelectTrigger>
                      <SelectValue placeholder="읍/면/동 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="max-h-[200px] overflow-y-auto">
                        <SelectItem value="all">읍/면/동 선택</SelectItem>
                        {uniqueSmall.filter(small => small !== 'all').map((small) => (
                          <SelectItem key={small} value={small}>
                            {small}
                          </SelectItem>
                        ))}
                      </div>
                    </SelectContent>
                  </Select>
                  <div className="relative">
                    <Input
                      placeholder="시설 또는 종목 검색"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-8"
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {currentFacilities.map((facility) => (
                    <FacilityCard key={facility.id} facility={facility} />
                  ))}
                </div>
                <div className="flex justify-center mt-8 space-x-2">
                  <Button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2"
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
                    className="p-2"
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">다음</span>
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

function FacilityCard({ facility }: { facility: Facility }) {
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
            <h3 className="font-bold text-xl md:text-xl text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {facility.name}
            </h3>
          </div>
          <p className="text-base md:text-base text-gray-600 dark:text-gray-400 mb-2">{facility.type}</p>
          <div className="mt-4 space-y-2 text-sm">
            <p className="flex items-center text-gray-500">
              <MapPin className="w-4 h-4 mr-2" />
              {facility.big} {facility.normal} {facility.small}
            </p>
            <p className="flex items-center text-gray-500">
              <Phone className="w-4 h-4 mr-2" />
              {facility.phone}
            </p>
          </div>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{facility.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div>
            <h4 className="font-semibold text-sm text-gray-500 mb-1">시설 유형</h4>
            <p className="text-gray-700 dark:text-gray-300">{facility.type}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-500 mb-1">주소</h4>
            <p className="text-gray-700 dark:text-gray-300">{facility.address}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-500 mb-1">전화번호</h4>
            <p className="text-gray-700 dark:text-gray-300">{facility.phone}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-500 mb-1">기관 전화번호</h4>
            <p className="text-gray-700 dark:text-gray-300">{facility.agencyPhone}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="secondary">{facility.big}</Badge>
          <Badge variant="secondary">{facility.normal}</Badge>
          <Badge variant="secondary">{facility.small}</Badge>
        </div>
      </DialogContent>
    </Dialog>
  )
}