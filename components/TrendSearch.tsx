'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CustomDatePicker } from '@/components/CustomDatePicker'

export function TrendSearch() {
  const [keyword, setKeyword] = useState('')
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (keyword.trim() && startDate && endDate) {
      const params = new URLSearchParams({
        keyword: keyword,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      })
      router.push(`/datalab?${params.toString()}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="mb-6 space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="검색어를 입력하세요"
          className="flex-grow"
        />
        <Button type="submit">검색</Button>
      </div>
      <div className="flex gap-4">
        <CustomDatePicker
          date={startDate}
          onDateChange={setStartDate}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          maxDate={new Date()}
          placeholder="시작일"
        />
        <CustomDatePicker
          date={endDate}
          onDateChange={setEndDate}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          maxDate={new Date()}
          placeholder="종료일"
        />
      </div>
    </form>
  )
}

