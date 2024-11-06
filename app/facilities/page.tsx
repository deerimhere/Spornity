"use client"

import React, { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Clock, Accessibility } from "lucide-react"

interface Facility {
  id: number;
  name: string;
  type: string;
  address: string;
  phone: string;
  hours: string;
  disabilityFriendly: boolean;
}

interface FacilitiesByDistrict {
  [district: string]: Facility[];
}

interface FacilitiesByCity {
  [city: string]: FacilitiesByDistrict;
}

const facilities: FacilitiesByCity = {
  "서울": {
    "강남구": [
      { id: 1, name: "강남스포츠센터", type: "종합체육시설", address: "서울특별시 강남구 삼성로 154", phone: "02-3468-2000", hours: "06:00-22:00", disabilityFriendly: true },
      { id: 2, name: "코엑스 아쿠아리움", type: "수영장", address: "서울특별시 강남구 영동대로 513", phone: "02-6002-6200", hours: "10:00-20:00", disabilityFriendly: true },
    ],
    "강서구": [
      { id: 3, name: "강서구민체육센터", type: "종합체육시설", address: "서울특별시 강서구 화곡로 68길 70", phone: "02-2657-7100", hours: "06:00-22:00", disabilityFriendly: true },
      { id: 4, name: "우장산공원 축구장", type: "축구장", address: "서울특별시 강서구 화곡로 154", phone: "02-2600-6523", hours: "09:00-18:00", disabilityFriendly: false },
    ],
  },
  "부산": {
    "해운대구": [
      { id: 5, name: "해운대비치 농구장", type: "농구장", address: "부산광역시 해운대구 해운대해변로 264", phone: "051-749-7601", hours: "24시간", disabilityFriendly: true },
      { id: 6, name: "해운대구민체육센터", type: "종합체육시설", address: "부산광역시 해운대구 양운로 91", phone: "051-784-0880", hours: "06:00-22:00", disabilityFriendly: true },
    ],
    "부산진구": [
      { id: 7, name: "부산종합운동장", type: "종합체육시설", address: "부산광역시 부산진구 백양대로 344", phone: "051-500-2121", hours: "09:00-18:00", disabilityFriendly: true },
      { id: 8, name: "부산시민공원 인라인스케이트장", type: "인라인스케이트장", address: "부산광역시 부산진구 시민공원로 73", phone: "051-850-6000", hours: "09:00-18:00", disabilityFriendly: false },
    ],
  },
}

export default function FacilitiesPage() {
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [selectedDistrict, setSelectedDistrict] = useState<string>("")

  const cities = Object.keys(facilities)

  const districts = selectedCity ? Object.keys(facilities[selectedCity]) : []

  const filteredFacilities = selectedCity && selectedDistrict
    ? facilities[selectedCity][selectedDistrict]
    : []

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">지역 체육 시설</h1>
      <div className="flex space-x-4 mb-4">
        <Select onValueChange={(value: string) => {
          setSelectedCity(value)
          setSelectedDistrict("")
        }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="도시 선택" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedCity && (
          <Select onValueChange={(value: string) => setSelectedDistrict(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="지역구 선택" />
            </SelectTrigger>
            <SelectContent>
              {districts.map((district) => (
                <SelectItem key={district} value={district}>{district}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFacilities.map((facility) => (
          <Card key={facility.id}>
            <CardHeader>
              <CardTitle>{facility.name}</CardTitle>
              <CardDescription>{facility.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" /> {facility.address}
              </p>
              <p className="flex items-center mt-2">
                <Phone className="mr-2 h-4 w-4" /> {facility.phone}
              </p>
              <p className="flex items-center mt-2">
                <Clock className="mr-2 h-4 w-4" /> {facility.hours}
              </p>
            </CardContent>
            <CardFooter>
              {facility.disabilityFriendly && (
                <Badge variant="outline" className="flex items-center">
                  <Accessibility className="mr-1 h-4 w-4" /> 장애인 편의시설
                </Badge>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}