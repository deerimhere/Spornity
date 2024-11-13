"use client"

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
}

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
}

export default function FitnessPage() {
  const [step, setStep] = useState(1)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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
              <Link href="/ai-pt" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                AI PT
              </Link>
              <Link href="/fitness" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                맞춤 운동 추천
              </Link>
              <Link href="/support" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                지원사업
              </Link>
              <Link href="/soma" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                소마미술관
              </Link>
              <Link href="/programs" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                프로그램
              </Link>
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
            <Link href="/ai-pt" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              AI PT
            </Link>
            <Link href="/fitness" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              맞춤 운동 추천
            </Link>
            <Link href="/support" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              지원사업
            </Link>
            <Link href="/soma" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              소마미술관
            </Link>
            <Link href="/programs" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              프로그램
            </Link>
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">지역</span>
              <Link href="/facilities" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors pl-4">
                지역 체육 시설
              </Link>
              <Link href="/clubs" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors pl-4">
                지역 동호회
              </Link>
            </div>
            <Link href="/login" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              로그인
            </Link>
            <Link href="/signup" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              회원가입
            </Link>
          </nav>
        </div>
      )}

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-gray-800 py-4 overflow-hidden"
          >
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
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="flex flex-col items-center space-y-4 text-center"
            >
              <motion.h1
                variants={itemVariants}
                className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                체력 진단 및 운동 추천
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="mx-auto max-w-[700px] text-gray-600 dark:text-gray-400 md:text-xl"
              >
                당신의 체력 상태를 진단하고 맞춤형 운동 계획을 받아보세요.
              </motion.p>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                {step === 1 && (
                  <Card className="mt-8 max-w-2xl mx-auto bg-white/90 dark:bg-gray-800/90 backdrop-blur">
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
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-2"
                          >
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
                          </motion.div>
                        )}
                        <Button type="submit" className="w-full">
                          다음 <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                )}

                {step === 2 && (
                  <Card className="mt-8 max-w-2xl mx-auto bg-white/90 dark:bg-gray-800/90 backdrop-blur">
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
                        <Button type="submit" className="w-full">
                          진단 결과 보기 <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                )}

                {step === 3 && recommendation && (
                  <Card className="mt-8 max-w-2xl mx-auto bg-white/90 dark:bg-gray-800/90 backdrop-blur">
                    <CardHeader>
                      <CardTitle>체력 진단 결과 및 운동 추천</CardTitle>
                      <CardDescription>당신의 정보를 바탕으로 맞춤형 운동 계획을 추천해드립니다.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="space-y-4"
                      >
                        <motion.div variants={itemVariants}>
                          <h3 className="text-lg font-semibold">체력 수준</h3>
                          <p>{recommendation.fitnessLevel}</p>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                          <h3 className="text-lg font-semibold">추천 운동</h3>
                          <ul className="list-disc list-inside space-y-2">
                            {recommendation.recommendedExercises.map((exercise, index) => (
                              <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                {exercise.name}: {exercise.duration}, {exercise.frequency}
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                          <h3 className="text-lg font-semibold">일일 권장 칼로리</h3>
                          <p>{recommendation.dailyCalories} kcal</p>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                          <Button onClick={() => setStep(1)} className="w-full">다시 진단하기</Button>
                        </motion.div>
                      </motion.div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </AnimatePresence>
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
                <li><Link href="/ai-pt" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">AI PT</Link></li>
                <li><Link href="/fitness" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">맞춤 운동 추천</Link></li>
                <li><Link href="/support" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">지원사업</Link></li>
                <li><Link href="/soma" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">소마미술관</Link></li>
                <li><Link href="/programs" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">프로그램</Link></li>
                <li><Link href="/facilities" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">지역 체육 시설</Link></li>
                <li><Link href="/clubs" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">지역 동호회</Link></li>
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