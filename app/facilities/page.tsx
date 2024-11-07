"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Activity, MapPin, Phone, Clock, Accessibility } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

// 더미 데이터
const facilitiesData = {
  서울: {
    강남구: [
      { id: 1, name: '강남스포츠센터', type: '종합체육관', address: '서울시 강남구 삼성로 123', phone: '02-1234-5678', hours: '06:00 - 22:00', disabilityFriendly: true },
      { id: 2, name: '청담수영장', type: '수영장', address: '서울시 강남구 청담동 45', phone: '02-2345-6789', hours: '05:30 - 21:30', disabilityFriendly: false },
    ],
    강서구: [
      { id: 3, name: '강서구민체육센터', type: '종합체육관', address: '서울시 강서구 화곡로 123', phone: '02-3456-7890', hours: '06:00 - 22:00', disabilityFriendly: true },
      { id: 4, name: '마곡레포츠센터', type: '테니스장', address: '서울시 강서구 마곡동 789', phone: '02-4567-8901', hours: '07:00 - 21:00', disabilityFriendly: true },
    ],
  },
  부산: {
    해운대구: [
      { id: 5, name: '해운대구민체육센터', type: '종합체육관', address: '부산시 해운대구 중동 123', phone: '051-1234-5678', hours: '06:00 - 22:00', disabilityFriendly: true },
      { id: 6, name: '센텀시티스포츠클럽', type: '헬스장', address: '부산시 해운대구 우동 456', phone: '051-2345-6789', hours: '24시간', disabilityFriendly: false },
    ],
    수영구: [
      { id: 7, name: '광안리해수욕장 체육시설', type: '야외운동기구', address: '부산시 수영구 광안해변로 123', phone: '051-3456-7890', hours: '24시간', disabilityFriendly: true },
      { id: 8, name: '수영구국민체육센터', type: '수영장', address: '부산시 수영구 수영로 789', phone: '051-4567-8901', hours: '06:00 - 22:00', disabilityFriendly: true },
    ],
  },
}

export default function FacilitiesPage() {
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [showDisabilityFriendly, setShowDisabilityFriendly] = useState(false)
  const [facilities, setFacilities] = useState([])
  const [showFacilities, setShowFacilities] = useState(false)
  const [showDistrict, setShowDistrict] = useState(false)

  useEffect(() => {
    if (selectedRegion && selectedDistrict) {
      setShowFacilities(false)
      setTimeout(() => {
        let filteredFacilities = facilitiesData[selectedRegion][selectedDistrict] || []
        if (showDisabilityFriendly) {
          filteredFacilities = filteredFacilities.filter(facility => facility.disabilityFriendly)
        }
        setFacilities(filteredFacilities)
        setShowFacilities(true)
      }, 300)
    } else {
      setFacilities([])
      setShowFacilities(false)
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
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none mb-8 text-black">
              지역 체육 시설 검색
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
                      {Object.keys(facilitiesData[selectedRegion]).map((district) => (
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
                <Label htmlFor="disability-friendly">장애인 친화 시설만 보기</Label>
              </div>
            </div>
            {selectedRegion && selectedDistrict && (
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  {selectedRegion} {selectedDistrict}의 체육 시설
                  {showDisabilityFriendly && ' - 장애인 친화'}
                </h2>
                <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 transition-opacity duration-300 ${showFacilities ? 'opacity-100' : 'opacity-0'}`}>
                  {facilities.map((facility) => (
                    <Card key={facility.id} className="h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Activity className="text-blue-500 mr-2 h-4 w-4" /> {facility.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="font-semibold mb-2 text-blue-600">{facility.type}</p>
                        <p className="text-sm text-muted-foreground mb-1 flex items-center">
                          <MapPin className="text-blue-500 mr-2 h-4 w-4" /> {facility.address}
                        </p>
                        <p className="text-sm text-muted-foreground mb-1 flex items-center">
                          <Phone className="text-blue-500 mr-2 h-4 w-4" /> {facility.phone}
                        </p>
                        <p className="text-sm text-muted-foreground mb-1 flex items-center">
                          <Clock className="text-blue-500 mr-2 h-4 w-4" /> {facility.hours}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Accessibility className="text-blue-500 mr-2 h-4 w-4" /> 
                          장애인 친화: {facility.disabilityFriendly ? '예' : '아니오'}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            {(!selectedRegion || !selectedDistrict) && (
              <p className="text-lg text-muted-foreground">지역과 구를 선택하면 해당 지역의 체육 시설 목록이 표시됩니다.</p>
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