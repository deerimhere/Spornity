"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Activity, Phone, Calendar, Clock, Globe, Users, Accessibility } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

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
  const [showPrograms, setShowPrograms] = useState(false)
  const [showSport, setShowSport] = useState(false)
  const [showAgeGroup, setShowAgeGroup] = useState(false)

  useEffect(() => {
    if (selectedRegion && selectedSport) {
      setShowPrograms(false)
      setTimeout(() => {
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
        setShowPrograms(true)
      }, 300)
    } else {
      setPrograms([])
      setShowPrograms(false)
    }

    if (selectedRegion) {
      setShowSport(false)
      setTimeout(() => setShowSport(true), 50)
    } else {
      setShowSport(false)
    }

    if (selectedSport) {
      setShowAgeGroup(false)
      setTimeout(() => setShowAgeGroup(true), 50)
    } else {
      setShowAgeGroup(false)
    }
  }, [selectedRegion, selectedSport, selectedAgeGroup, showDisabilityFriendly])

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value)
    setSelectedSport('')
    setSelectedAgeGroup('all')
    setShowSport(false)
    setShowAgeGroup(false)
    setTimeout(() => setShowSport(true), 50)
  }

  const handleSportChange = (value: string) => {
    setSelectedSport(value)
    setSelectedAgeGroup('all')
    setShowAgeGroup(false)
    setTimeout(() => setShowAgeGroup(true), 50)
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
              공공체육시설 프로그램 검색
            </h1>
            <div className="flex flex-col space-y-4 mb-8">
              <div>
                <label htmlFor="region-select" className="text-lg font-medium block mb-2">
                  지역을 선택하세요
                </label>
                <Select onValueChange={(value: string) => handleRegionChange(value)}>
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
                <div className={`transition-opacity duration-300 ${showSport ? 'opacity-100' : 'opacity-0'}`}>
                  <label htmlFor="sport-select" className="text-lg font-medium block mb-2">
                    운동 종류를 선택하세요
                  </label>
                  <Select onValueChange={(value: string) => handleSportChange(value)}>
                    <SelectTrigger id="sport-select" className="w-[180px]">
                      <SelectValue placeholder="운동 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(programsData[selectedRegion]).map((sport) => (
                        <SelectItem key={sport} value={sport}>
                          {sport}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {selectedSport && (
                <div className={`transition-opacity duration-300 ${showAgeGroup ? 'opacity-100' : 'opacity-0'}`}>
                  <label htmlFor="age-group-select" className="text-lg font-medium block mb-2">
                    대상 연령대를 선택하세요
                  </label>
                  <Select onValueChange={(value: string) => setSelectedAgeGroup(value)}>
                    <SelectTrigger id="age-group-select" className="w-[180px]">
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
              )}
              <div className="flex items-center space-x-2">
                <Switch
                  id="disability-friendly"
                  checked={showDisabilityFriendly}
                  onCheckedChange={setShowDisabilityFriendly}
                />
                <Label htmlFor="disability-friendly">장애인 친화 프로그램만 보기</Label>
              </div>
            </div>
            {selectedRegion && selectedSport && (
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  {selectedRegion}의 {selectedSport} 프로그램
                  {selectedAgeGroup !== 'all' && ` (${selectedAgeGroup})`}
                  {showDisabilityFriendly && ' - 장애인 친화'}
                </h2>
                <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 transition-opacity duration-300 ${showPrograms ? 'opacity-100' : 'opacity-0'}`}>
                  {programs.map((program) => (
                    <Card key={program.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Activity className="mr-2 h-4 w-4" /> {program.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="font-semibold mb-2">{program.facility}</p>
                        <p className="text-sm text-muted-foreground mb-1">{program.address}</p>
                        <p className="text-sm text-muted-foreground mb-1 flex items-center">
                          <Phone className="mr-2 h-4 w-4" /> {program.phone}
                        </p>
                        <p className="text-sm text-muted-foreground mb-1 flex items-center">
                          <Calendar className="mr-2 h-4 w-4" /> {program.startDate} ~ {program.endDate}
                        </p>
                        <p className="text-sm text-muted-foreground mb-1 flex items-center">
                          <Clock className="mr-2 h-4 w-4" /> {program.days} {program.time}
                        </p>
                        <p className="text-sm text-muted-foreground mb-1 flex items-center">
                          <Users className="mr-2 h-4 w-4" /> 대상: {program.ageGroup}
                        </p>
                        <p className="text-sm text-muted-foreground mb-1 flex items-center">
                          <Accessibility className="mr-2 h-4 w-4" /> 
                          장애인 친화: {program.disabilityFriendly ? '예' : '아니오'}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Globe className="mr-2 h-4 w-4" /> 
                          <a href={program.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            홈페이지 방문
                          </a>
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            {(!selectedRegion || !selectedSport) && (
              <p className="text-lg text-muted-foreground">지역과 운동 종류를 선택하면 해당 프로그램 목록이 표시됩니다.</p>
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