"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckedState } from "@radix-ui/react-checkbox"

interface FormData {
  age: string;
  gender: string;
  height: string;
  weight: string;
  hasDisability: boolean;
  disabilityType: string[];
  activityLevel: string;
  fitnessGoal: string;
}

interface FitnessResult {
  fitnessLevel: string;
  recommendedExercises: string[];
  dailyCalories: number;
}

export default function FitnessPage() {
  const [formData, setFormData] = useState<FormData>({
    age: '',
    gender: '',
    height: '',
    weight: '',
    hasDisability: false,
    disabilityType: [],
    activityLevel: '',
    fitnessGoal: '',
  })

  const [result, setResult] = useState<FitnessResult | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: CheckedState) => {
    setFormData(prev => ({ ...prev, hasDisability: checked === true }))
  }

  const handleDisabilityTypeChange = (checked: CheckedState, value: string) => {
    setFormData(prev => ({
      ...prev,
      disabilityType: checked === true
        ? [...prev.disabilityType, value]
        : prev.disabilityType.filter(type => type !== value)
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Here you would typically send the data to a backend API
    // For this example, we'll just set some mock results
    setResult({
      fitnessLevel: "중급",
      recommendedExercises: ["걷기", "수영", "요가"],
      dailyCalories: 2000,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">체력 진단 및 운동 추천</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="age">나이</Label>
          <Input
            id="age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label>성별</Label>
          <RadioGroup
            onValueChange={(value) => handleSelectChange('gender', value)}
            required
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">남성</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">여성</Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <Label htmlFor="height">키 (cm)</Label>
          <Input
            id="height"
            name="height"
            type="number"
            value={formData.height}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="weight">몸무게 (kg)</Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            value={formData.weight}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="hasDisability"
            checked={formData.hasDisability}
            onCheckedChange={handleCheckboxChange}
          />
          <Label htmlFor="hasDisability">장애 여부</Label>
        </div>
        {formData.hasDisability && (
          <div>
            <Label>장애 유형 (해당되는 항목 모두 선택)</Label>
            <div className="space-y-2">
              {['시각', '청각', '지체', '기타'].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={formData.disabilityType.includes(type)}
                    onCheckedChange={(checked) => handleDisabilityTypeChange(checked, type)}
                  />
                  <Label htmlFor={type}>{type}</Label>
                </div>
              ))}
            </div>
          </div>
        )}
        <div>
          <Label htmlFor="activityLevel">활동 수준</Label>
          <Select onValueChange={(value) => handleSelectChange('activityLevel', value)} required>
            <SelectTrigger>
              <SelectValue placeholder="활동 수준을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">거의 운동하지 않음</SelectItem>
              <SelectItem value="light">가벼운 운동 (주 1-3회)</SelectItem>
              <SelectItem value="moderate">중간 정도 운동 (주 3-5회)</SelectItem>
              <SelectItem value="active">활발한 운동 (주 6-7회)</SelectItem>
              <SelectItem value="very-active">매우 활발한 운동 (하루 2회 이상)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="fitnessGoal">운동 목표</Label>
          <Select onValueChange={(value) => handleSelectChange('fitnessGoal', value)} required>
            <SelectTrigger>
              <SelectValue placeholder="운동 목표를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weight-loss">체중 감량</SelectItem>
              <SelectItem value="muscle-gain">근육 증가</SelectItem>
              <SelectItem value="endurance">지구력 향상</SelectItem>
              <SelectItem value="flexibility">유연성 향상</SelectItem>
              <SelectItem value="overall-health">전반적인 건강 증진</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">진단 및 추천 받기</Button>
      </form>
      {result && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">진단 결과</h2>
          <p>체력 수준: {result.fitnessLevel}</p>
          <p>추천 운동:</p>
          <ul>
            {result.recommendedExercises.map((exercise, index) => (
              <li key={index}>{exercise}</li>
            ))}
          </ul>
          <p>일일 권장 칼로리: {result.dailyCalories}kcal</p>
        </div>
      )}
    </div>
  )
}