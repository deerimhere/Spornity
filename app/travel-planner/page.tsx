'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Place {
  startTime: string;
  endTime: string;
  placeName: string;
  description: string;
  reservationInfo: string;
  estimatedTravelTimeFromPrevious?: string;
  weather: string;
  accessibilityInfo: string;
  localSpecialties: string;
}

interface Course {
  courseNumber: number;
  places: Place[];
}

export default function TravelPlanner() {
  const [travelType, setTravelType] = useState('')
  const [destination, setDestination] = useState('')
  const [transportation, setTransportation] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ travelType, destination, transportation, startDate, endDate }),
      })
      const data = await response.json()

      // 코스 데이터를 설정
      if (Array.isArray(data.itinerary)) {
        setCourses(data.itinerary)
      } else {
        console.error('Invalid itinerary data:', data)
      }
    } catch (error) {
      console.error('Error:', error)
    }
    setIsLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">여행 계획 도우미</h1>
      <div className="max-w-2xl mx-auto mb-12">
        <Card>
          <CardHeader>
            <CardTitle>여행 정보 입력</CardTitle>
            <CardDescription>여행 유형, 목적지, 여행 기간, 교통수단을 선택해주세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="travelType">여행 유형</Label>
                <Select onValueChange={setTravelType} required>
                  <SelectTrigger id="travelType">
                    <SelectValue placeholder="여행 유형을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="부모님을 모시고 가는 여행">부모님을 모시고 가는 여행</SelectItem>
                    <SelectItem value="커플 여행">커플 여행</SelectItem>
                    <SelectItem value="친구들과의 여행">친구들과의 여행</SelectItem>
                    <SelectItem value="혼자 여행">혼자 여행</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">여행 지역</Label>
                <Input
                  id="destination"
                  placeholder="예: 제주"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>여행 기간</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                  <span>부터</span>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                  <span>까지</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="transportation">교통수단</Label>
                <Select onValueChange={setTransportation} required>
                  <SelectTrigger id="transportation">
                    <SelectValue placeholder="교통수단을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="자가용">자가용</SelectItem>
                    <SelectItem value="대중교통">대중교통</SelectItem>
                    <SelectItem value="택시">택시</SelectItem>
                    <SelectItem value="자전거">자전거</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? '생성 중...' : '여행 계획 생성'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {courses.length > 0 ? (
          courses.map((course, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>추천 여행 일정 {index + 1}</CardTitle>
                <CardDescription>AI가 생성한 맞춤 여행 일정입니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  {course.places.map((place, idx) => (
                    <div key={idx}>
                      <h3>{place.placeName}</h3>
                      <p><strong>방문 시간:</strong> {place.startTime} - {place.endTime}</p>
                      <p><strong>설명:</strong> {place.description}</p>
                      <p><strong>예약 정보:</strong> {place.reservationInfo}</p>
                      {idx !== 0 && place.estimatedTravelTimeFromPrevious && (
                        <p><strong>이동 시간:</strong> {place.estimatedTravelTimeFromPrevious}</p>
                      )}
                      <p><strong>날씨 정보:</strong> {place.weather}</p>
                      <p><strong>접근성 정보:</strong> {place.accessibilityInfo}</p>
                      <p><strong>추천 기념품:</strong> {place.localSpecialties}</p>
                      <hr />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>추천 여행 일정 {index + 1}</CardTitle>
                <CardDescription>AI가 생성한 맞춤 여행 일정입니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  여행 정보를 입력하고 '여행 계획 생성' 버튼을 클릭하면 맞춤 일정이 여기에 표시됩니다.
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <style jsx global>{`
        .prose a {
          color: #3b82f6;
          text-decoration: underline;
          transition: color 0.2s ease-in-out;
        }
        .prose a:hover {
          color: #2563eb;
        }
        .prose ul {
          list-style-type: disc;
          padding-left: 1.5em;
        }
        .prose li {
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }
      `}</style>
    </div>
  )
}
