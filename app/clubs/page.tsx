"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Activity, Users, MapPin, Calendar, Accessibility } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

// 더미 데이터
const clubsData = {
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
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [showDisabilityFriendly, setShowDisabilityFriendly] = useState(false)
  const [clubs, setClubs] = useState([])
  const [showClubs, setShowClubs] = useState(false)
  const [showDistrict, setShowDistrict] = useState(false)

  useEffect(() => {
    if (selectedRegion && selectedDistrict) {
      setShowClubs(false)
      setTimeout(() => {
        let filteredClubs = clubsData[selectedRegion][selectedDistrict] || []
        if (showDisabilityFriendly) {
          filteredClubs = filteredClubs.filter(club => club.disabilityFriendly)
        }
        setClubs(filteredClubs)
        setShowClubs(true)
      }, 300)
    } else {
      setClubs([])
      setShowClubs(false)
    }

    if (selectedRegion) {
      setShowDistrict(false)
      setTimeout(() => setShowDistrict(true), 50)
    } else {
      setShowDistrict(false)
    }
  }, [selectedRegion, selectedDistrict, showDisabilityFriendly])

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value)
    setSelectedDistrict('')
    setShowDistrict(false)
    setTimeout(() => setShowDistrict(true), 50)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-2xl bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Spornity
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none mb-8">
              지역 동호회 검색
            </h1>
            <div className="flex flex-col space-y-4 mb-8">
              <div>
                <label htmlFor="region-select" className="text-lg font-medium block mb-2">
                  지역을 선택하세요
                </label>
                <Select onValueChange={handleRegionChange}>
                  <SelectTrigger id="region-select" className="w-[180px]">
                    <SelectValue placeholder="지역 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="서울">서울</SelectItem>
                    <SelectItem value="부산">부산</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {selectedRegion && (
                <div className={`transition-opacity duration-300 ${showDistrict ? 'opacity-100' : 'opacity-0'}`}>
                  <label htmlFor="district-select" className="text-lg font-medium block mb-2">
                    구를 선택하세요
                  </label>
                  <Select onValueChange={setSelectedDistrict}>
                    <SelectTrigger id="district-select" className="w-[180px]">
                      <SelectValue placeholder="구 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(clubsData[selectedRegion]).map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Switch
                  id="disability-friendly"
                  checked={showDisabilityFriendly}
                  onCheckedChange={setShowDisabilityFriendly}
                />
                <Label htmlFor="disability-friendly">장애인 친화 동호회만 보기</Label>
              </div>
            </div>
            {selectedRegion && selectedDistrict && (
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  {selectedRegion} {selectedDistrict}의 동호회
                  {showDisabilityFriendly && ' - 장애인 친화'}
                </h2>
                <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 transition-opacity duration-300 ${showClubs ? 'opacity-100' : 'opacity-0'}`}>
                  {clubs.map((club) => (
                    <Card key={club.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Users className="mr-2 h-4 w-4" /> {club.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="font-semibold mb-2">{club.sport}</p>
                        <p className="text-sm text-muted-foreground mb-1 flex items-center">
                          <Users className="mr-2 h-4 w-4" /> 회원 수: {club.members}명
                        </p>
                        <p className="text-sm text-muted-foreground mb-1 flex items-center">
                          <Calendar className="mr-2 h-4 w-4" /> 모임 일정: {club.meetingDay}
                        </p>
                        <p className="text-sm text-muted-foreground mb-1 flex items-center">
                          <MapPin className="mr-2 h-4 w-4" /> 위치: {club.location}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Accessibility className="mr-2 h-4 w-4" /> 
                          장애인 친화: {club.disabilityFriendly ? '예' : '아니오'}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            {(!selectedRegion || !selectedDistrict) && (
              <p className="text-lg text-muted-foreground">지역과 구를 선택하면 해당 지역의 동호회 목록이 표시됩니다.</p>
            )}
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          © 2024 Spornity. 모든 권리 보유.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">이용약관</Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">개인정보처리방침</Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">접근성 정책</Link>
        </nav>
      </footer>
    </div>
  )
}