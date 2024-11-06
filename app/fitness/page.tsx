"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight } from "lucide-react"

export default function FitnessPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    hasDisability: false,
    disabilityType: [],
    activityLevel: '',
    fitnessGoal: '',
  })
  const [recommendation, setRecommendation] = useState(null)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleDisabilityTypeChange = (checked: boolean, value: string) => {
    setFormData(prev => ({
      ...prev,
      disabilityType: checked
        ? [...prev.disabilityType, value]
        : prev.disabilityType.filter((type) => type !== value)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // 실제 구현에서는 여기에 체력 진단 및 운동 추천 로직을 추가해야 합니다.
    // 현재는 간단한 예시 추천을 제공합니다.
    setRecommendation({
      fitnessLevel: "중급",
      recommendedExercises: [
        { name: "적응형 요가", duration: "30분", frequency: "주 3회" },
        { name: "수영", duration: "45분", frequency: "주 2회" },
        { name: "근력 운동", duration: "30분", frequency: "주 2회" },
      ],
      dailyCalories: 2200,
    })
    setStep(3)
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
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  체력 진단 및 운동 추천
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  당신의 체력 상태를 진단하고 맞춤형 운동 계획을 받아보세요.
                </p>
              </div>
            </div>

            {step === 1 && (
              <Card className="mt-8 max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>기본 정보 입력</CardTitle>
                  <CardDescription>체력 진단을 위해 기본 정보를 입력해주세요.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => { e.preventDefault(); setStep(2) }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age">나이</Label>
                        <Input id="age" name="age" type="number" placeholder="나이를 입력하세요" required
                               value={formData.age} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2">
                        <Label>성별</Label>
                        <RadioGroup name="gender" value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
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
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="height">키 (cm)</Label>
                        <Input id="height" name="height" type="number" placeholder="키를 입력하세요" required
                               value={formData.height} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weight">몸무게 (kg)</Label>
                        <Input id="weight" name="weight" type="number" placeholder="몸무게를 입력하세요" required
                               value={formData.weight} onChange={handleInputChange} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="hasDisability" 
                          name="hasDisability"
                          checked={formData.hasDisability}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasDisability: checked }))}
                        />
                        <Label htmlFor="hasDisability">장애 여부</Label>
                      </div>
                    </div>
                    {formData.hasDisability && (
                      <div className="space-y-2">
                        <Label>장애 유형 (해당하는 항목 모두 선택)</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {['시각', '청각', '지체', '지적', '자폐성', '정신'].map((type) => (
                            <div key={type} className="flex items-center space-x-2">
                              <Checkbox
                                id={`disability-${type}`}
                                checked={formData.disabilityType.includes(type)}
                                onCheckedChange={(checked) => handleDisabilityTypeChange(checked, type)}
                              />
                              <Label htmlFor={`disability-${type}`}>{type}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <Button type="submit" className="w-full">다음 <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card className="mt-8 max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>활동 수준 및 목표</CardTitle>
                  <CardDescription>현재 활동 수준과 fitness 목표를 선택해주세요.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="activityLevel">활동 수준</Label>
                      <Select name="activityLevel" value={formData.activityLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, activityLevel: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="활동 수준을 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedentary">거의 운동하지 않음</SelectItem>
                          <SelectItem value="light">가벼운 운동 (주 1-2회)</SelectItem>
                          <SelectItem value="moderate">중간 정도 운동 (주 3-4회)</SelectItem>
                          <SelectItem value="active">활발한 운동 (주 5회 이상)</SelectItem>
                          <SelectItem value="veryActive">매우 활발한 운동 (거의 매일)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fitnessGoal">fitness 목표</Label>
                      <Select name="fitnessGoal" value={formData.fitnessGoal} onValueChange={(value) => setFormData(prev => ({ ...prev, fitnessGoal: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="fitness 목표를 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weightLoss">체중 감량</SelectItem>
                          <SelectItem value="muscleGain">근육 증가</SelectItem>
                          <SelectItem value="endurance">지구력 향상</SelectItem>
                          <SelectItem value="flexibility">유연성 향상</SelectItem>
                          <SelectItem value="overallHealth">전반적인 건강 증진</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full">진단 결과 보기 <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {step === 3 && recommendation && (
              <Card className="mt-8 max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>체력 진단 결과 및 운동 추천</CardTitle>
                  <CardDescription>당신의 정보를 바탕으로 맞춤형 운동 계획을 추천해드립니다.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">체력 수준</h3>
                      <p>{recommendation.fitnessLevel}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">추천 운동</h3>
                      <ul className="list-disc list-inside space-y-2">
                        {recommendation.recommendedExercises.map((exercise, index) => (
                          <li key={index}>
                            {exercise.name}: {exercise.duration}, {exercise.frequency}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">일일 권장 칼로리</h3>
                      <p>{recommendation.dailyCalories} kcal</p>
                    </div>
                    <Button onClick={() => setStep(1)} className="w-full">다시 진단하기</Button>
                  </div>
                </CardContent>
              </Card>
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