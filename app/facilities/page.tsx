'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Activity, MapPin, Phone, Accessibility, Search, ChevronDown, Menu, X, Building } from "lucide-react"
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
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

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

    if (searchTerm) {
      filtered = filtered.filter(facility => 
        facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facility.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (activeTab === "disability") {
      filtered = filtered.filter(facility => facility.disabilityFriendly.toLowerCase() === 'yes')
    } else if (activeTab === "general") {
      filtered = filtered.filter(facility => facility.disabilityFriendly.toLowerCase() === 'no')
    }

    setFilteredFacilities(filtered)
  }, [facilities, selectedBig, selectedNormal, selectedSmall, showDisabilityFriendly, searchTerm, activeTab])

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
                  <Select onValueChange={handleBigChange}>
                    <SelectTrigger>
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
                  <Select onValueChange={handleNormalChange} disabled={!selectedBig}>
                    <SelectTrigger>
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
                  <Select onValueChange={setSelectedSmall} disabled={!selectedNormal}>
                    <SelectTrigger>
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
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="disability-friendly"
                      checked={showDisabilityFriendly}
                      onCheckedChange={setShowDisabilityFriendly}
                    />
                    <Label htmlFor="disability-friendly">장애인 친화 시설만 보기</Label>
                  </div>
                  <Input
                    placeholder="시설 또는 종목 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">전체</TabsTrigger>
                    <TabsTrigger value="general">일반 시설</TabsTrigger>
                    <TabsTrigger value="disability">장애인 친화 시설</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {filteredFacilities.map((facility) => (
                        <FacilityCard key={facility.id} facility={facility} />
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="general">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {filteredFacilities.filter(facility => facility.disabilityFriendly.toLowerCase() === 'no').map((facility) => (
                        <FacilityCard key={facility.id} facility={facility} />
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="disability">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {filteredFacilities.filter(facility => facility.disabilityFriendly.toLowerCase() === 'yes').map((facility) => (
                        <FacilityCard key={facility.id} facility={facility} />
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

function FacilityCard({ facility }: { facility: Facility }) {
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
            {facility.name}
          </h3>
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-600 dark:text-gray-400">{facility.type}</p>
            <Badge variant="outline" className="bg-white text-black">
              {facility.disabilityFriendly.toLowerCase() === 'yes' ? '장애인 친화' : '일반'}
            </Badge>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <p className="flex items-center text-gray-500">
              <MapPin className="w-4 h-4 mr-2" />
              {facility.address}
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-sm text-gray-500 mb-1">시설 유형</h4>
            <p className="text-lg">{facility.type}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-500 mb-1">주소</h4>
            <p className="text-lg">{facility.address}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-500 mb-1">전화번호</h4>
            <p className="text-lg">{facility.phone}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-500 mb-1">기관 전화번호</h4>
            <p className="text-lg">{facility.agencyPhone}</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2">장애인 친화 정보</h4>
          <p className="text-gray-600 dark:text-gray-400">
            {facility.disabilityFriendly.toLowerCase() === 'yes' ? '장애인 친화 시설입니다.' : '일반 시설입니다.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline" className="bg-white text-black">
            {facility.disabilityFriendly.toLowerCase() === 'yes' ? '장애인 친화' : '일반'}
          </Badge>
          <Badge variant="secondary">{facility.type}</Badge>
          <Badge variant="secondary">{facility.big}</Badge>
          <Badge variant="secondary">{facility.normal}</Badge>
          <Badge variant="secondary">{facility.small}</Badge>
        </div>
      </DialogContent>
    </Dialog>
  )
}