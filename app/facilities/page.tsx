'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Activity, MapPin, Phone, Accessibility, Search, ChevronDown, Menu, X, Building } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { motion } from 'framer-motion'
import Papa from 'papaparse'

interface Facility {
  id: string
  name: string
  type: string
  address: string
  phone: string
  agencyPhone: string
  disabilityFriendly: string
  big: string
  normal: string
  small: string
}

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([])
  const [selectedBig, setSelectedBig] = useState('')
  const [selectedNormal, setSelectedNormal] = useState('')
  const [selectedSmall, setSelectedSmall] = useState('')
  const [showDisabilityFriendly, setShowDisabilityFriendly] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [uniqueBig, setUniqueBig] = useState<string[]>([])
  const [uniqueNormal, setUniqueNormal] = useState<string[]>([])
  const [uniqueSmall, setUniqueSmall] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/data/facilities.csv')
      const reader = response.body?.getReader()
      const result = await reader?.read()
      const decoder = new TextDecoder('utf-8')
      const csv = decoder.decode(result?.value)
      const results = Papa.parse(csv, { header: true, skipEmptyLines: true })
      const parsedData: Facility[] = results.data.map((row: any, index: number) => ({
        id: index.toString(),
        name: row.name || '정보 없음',
        type: row.type || '정보 없음',
        address: row.address || '정보 없음',
        phone: row.phone || '정보 없음',
        agencyPhone: row.agencyPhone || '정보 없음',
        disabilityFriendly: row.disabilityFriendly || '정보 없음',
        big: row.big || '정보 없음',
        normal: row.normal || '정보 없음',
        small: row.small || '정보 없음',
      }))
      setFacilities(parsedData)

      const bigValues = [...new Set(parsedData.map(item => item.big))]
      setUniqueBig(bigValues)
    }

    fetchData()
  }, [])

  useEffect(() => {
    let filtered = facilities

    if (selectedBig) {
      filtered = filtered.filter(facility => facility.big === selectedBig)
      const normalValues = [...new Set(filtered.map(item => item.normal))]
      setUniqueNormal(normalValues)
    }

    if (selectedNormal) {
      filtered = filtered.filter(facility => facility.normal === selectedNormal)
      const smallValues = [...new Set(filtered.map(item => item.small))]
      setUniqueSmall(smallValues)
    }

    if (selectedSmall) {
      filtered = filtered.filter(facility => facility.small === selectedSmall)
    }

    if (showDisabilityFriendly) {
      filtered = filtered.filter(facility => facility.disabilityFriendly.toLowerCase() === 'yes')
    }

    setFilteredFacilities(filtered)
  }, [facilities, selectedBig, selectedNormal, selectedSmall, showDisabilityFriendly])

  const handleBigChange = (value: string) => {
    setSelectedBig(value)
    setSelectedNormal('')
    setSelectedSmall('')
  }

  const handleNormalChange = (value: string) => {
    setSelectedNormal(value)
    setSelectedSmall('')
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
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-8 text-center text-gray-800 dark:text-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              지역 체육 시설 검색
            </motion.h1>
            <motion.div 
              className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="grid gap-6 md:grid-cols-3 mb-6">
                <div>
                  <label htmlFor="big-select" className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                    도/시
                  </label>
                  <Select onValueChange={handleBigChange}>
                    <SelectTrigger id="big-select" className="w-full">
                      <SelectValue placeholder="도/시 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueBig.map((big) => (
                        <SelectItem key={big} value={big}>
                          {big}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="normal-select" className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                    시/군/구
                  </label>
                  <Select onValueChange={handleNormalChange} disabled={!selectedBig}>
                    <SelectTrigger id="normal-select" className="w-full">
                      <SelectValue placeholder="시/군/구 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueNormal.map((normal) => (
                        <SelectItem key={normal} value={normal}>
                          {normal}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="small-select" className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                    읍/면/동
                  </label>
                  <Select onValueChange={setSelectedSmall} disabled={!selectedNormal}>
                    <SelectTrigger id="small-select" className="w-full">
                      <SelectValue placeholder="읍/면/동 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueSmall.map((small) => (
                        <SelectItem key={small} value={small}>
                          {small}
                        </SelectItem>
                      ))}
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
                <Label htmlFor="disability-friendly" className="text-sm text-gray-700 dark:text-gray-300">장애인 친화 시설만 보기</Label>
              </div>
              <Button className="w-full" disabled={!selectedBig}>
                <Search className="mr-2 h-4 w-4" /> 검색
              </Button>
            </motion.div>
            {filteredFacilities.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">
                  {selectedBig} {selectedNormal} {selectedSmall}의 체육 시설
                  {showDisabilityFriendly && ' (장애인 친화)'}
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredFacilities.map((facility, index) => (
                    <motion.div
                      key={facility.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{facility.name}</h3>
                          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-4">{facility.type}</p>
                          <div className="space-y-2 text-gray-600 dark:text-gray-400">
                            <p className="flex items-center">
                              <MapPin className="text-blue-500 mr-2 h-4 w-4" /> {facility.address}
                            </p>
                            <p className="flex items-center">
                              <Phone className="text-blue-500 mr-2 h-4 w-4" /> {facility.phone}
                            </p>
                            <p className="flex items-center">
                              <Building className="text-blue-500 mr-2 h-4 w-4" /> {facility.agencyPhone}
                            </p>
                            <p className="flex items-center">
                              <Accessibility className="text-blue-500 mr-2 h-4 w-4" /> 
                              장애인 친화: {facility.disabilityFriendly.toLowerCase() === 'yes' ? '예' : '아니오'}
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
                <p className="text-xl text-gray-600 dark:text-gray-400">지역을 선택하여 체육 시설을 검색해보세요. 시/군/구와 읍/면/동은 선택사항입니다.</p>
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