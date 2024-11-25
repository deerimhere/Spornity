'use client'

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface CustomDatePickerProps {
  date: Date | undefined
  onDateChange: (date: Date | undefined) => void
  selectsStart?: boolean
  selectsEnd?: boolean
  startDate?: Date
  endDate?: Date
  minDate?: Date
  maxDate?: Date
  placeholder?: string
}

export function CustomDatePicker({
  date,
  onDateChange,
  selectsStart,
  selectsEnd,
  startDate,
  endDate,
  minDate,
  maxDate,
  placeholder = "날짜 선택"
}: CustomDatePickerProps) {
  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      if (selectsStart && endDate && newDate > endDate) {
        return
      }
      if (selectsEnd && startDate && newDate < startDate) {
        return
      }
      if (minDate && newDate < minDate) {
        return
      }
      if (maxDate && newDate > maxDate) {
        return
      }
    }
    onDateChange(newDate)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
          disabled={(date: Date) => {
            if (minDate && date < minDate) return true
            if (maxDate && date > maxDate) return true
            if (selectsStart && endDate && date > endDate) return true
            if (selectsEnd && startDate && date < startDate) return true
            return false
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

