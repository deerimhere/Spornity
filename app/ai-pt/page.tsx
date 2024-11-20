'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { ChevronDown, Menu, X, Dumbbell, Clipboard, MessageSquare, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"

interface UserInfo {
  age: string;
  gender: string;
  height: string;
  weight: string;
  hasDisability: boolean;
  disabilityType?: string;
  activityLevel: string;
  fitnessGoal: string;
}

export default function AIPTPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [userInput, setUserInput] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userInfo, setUserInfo] = useState<UserInfo>({
    age: '',
    gender: '',
    height: '',
    weight: '',
    hasDisability: false,
    disabilityType: '',
    activityLevel: '',
    fitnessGoal: ''
  })
  const abortController = useRef<AbortController | null>(null)

  const generatePrompt = (type: string) => {
    const baseInfo = `${userInfo.age}세 ${userInfo.gender === 'male' ? '남성' : '여성'}입니다. 키 ${userInfo.height}cm, 체중 ${userInfo.weight}kg이며, 현재 활동량은 ${userInfo.activityLevel}입니다. 주요 목표는 ${userInfo.fitnessGoal}입니다.${userInfo.hasDisability ? ' 장애가 있어 ' + (userInfo.disabilityType ? userInfo.disabilityType + ' 장애가 있습니다.' : '특별한 고려가 필요합니다.') : ''}`

    const promptTemplates = {
      workout: `${baseInfo}\n\n이러한 조건을 고려한 맞춤형 운동 계획을 추천해주세요. 운동 강도, 빈도, 시간을 구체적으로 설명해주시고, 주의해야 할 점도 함께 알려주세요.`,
      nutrition: `${baseInfo}\n\n제 상태에 맞는 영양 섭취와 식단 계획을 추천해주세요. 하루 필요 칼로리와 영양소 비율, 식사 예시도 함께 제시해주세요.`,
      health: `${baseInfo}\n\n전반적인 건강 관리를 위한 조언이 필요합니다. 생활 습관, 스트레스 관리, 수면 관리 등에 대한 조언을 해주세요.`
    };

    return promptTemplates[type as keyof typeof promptTemplates] || '';
  };

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form validation could be added here
  };

  const setPrompt = (type: string) => {
    if (!userInfo.age || !userInfo.gender || !userInfo.height || !userInfo.weight) {
      setError('기본 정보를 모두 입력해주세요.');
      return;
    }
    setError(null);
    setUserInput(generatePrompt(type));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setAiResponse("")

    if (abortController.current) {
      abortController.current.abort()
    }

    abortController.current = new AbortController()

    try {
      const response = await fetch('/api/ai-pt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userInput }),
        signal: abortController.current.signal
      })

      if (!response.ok) {
        throw new Error('AI 응답을 가져오는 데 실패했습니다.')
      }

      const data = await response.json()
      setAiResponse(data.response)
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          console.log('Fetch aborted')
        } else {
          setError('오류가 발생했습니다. 다시 시도해 주세요.')
          console.error('Error:', err)
        }
      }
    } finally {
      setIsLoading(false)
      abortController.current = null
    }
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
                스포츠강좌
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
              스포츠강좌
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

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI 퍼스널 트레이너
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-600 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
                개인 맞춤형 운동 계획과 조언을 AI로 받아보세요. 당신의 건강한 라이프스타일을 위한 첫 걸음입니다.
              </p>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-2 mb-12">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>AI PT에게 물어보세요</CardTitle>
                  <CardDescription>아래의 카드를 클릭하여 자동으로 질문을 생성하거나, 직접 질문을 입력하세요.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Textarea
                      placeholder="예: 30대 초반 남성입니다. 체중 감량과 근력 향상을 위한 운동 계획을 추천해주세요."
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      className="min-h-[200px]"
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          처리 중...
                        </>
                      ) : (
                        <>
                          <MessageSquare className="mr-2 h-4 w-4" /> AI PT에게 질문하기
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="w-full">
                <CardHeader>
                  <CardTitle>AI PT의 응답</CardTitle>
                  <CardDescription>맞춤형 조언과 계획을 확인하세요.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md min-h-[200px] max-h-[400px] overflow-y-auto">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      </div>
                    ) : error ? (
                      <p className="text-red-500">{error}</p>
                    ) : aiResponse ? (
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <div dangerouslySetInnerHTML={{ __html: aiResponse }} />
                      </div>
                    ) : (
                      "AI PT의 응답이 여기에 표시됩니다."
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-3 text-center">빠른 맞춤 질문 생성</h2>
              <p className="text-center mb-6 text-gray-600 dark:text-gray-400 text-base">
                아래 카드를 클릭하여 쉽고 빠르게 맞춤형 질문을 생성하세요. 더 정확한 조언을 원하시면 아래에서 기본 정보를 입력해주세요.
              </p>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>기본 정보 입력</CardTitle>
                <CardDescription>더 정확한 맞춤형 조언을 위해 기본 정보를 입력해주세요.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleInfoSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="age">나이</Label>
                      <Input
                        id="age"
                        placeholder="나이를 입력하세요"
                        value={userInfo.age}
                        onChange={(e) => setUserInfo({ ...userInfo, age: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>성별</Label>
                      <RadioGroup
                        value={userInfo.gender}
                        onValueChange={(value) => setUserInfo({ ...userInfo, gender: value })}
                        className="flex space-x-4"
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
                    <div className="space-y-2">
                      <Label htmlFor="height">키 (cm)</Label>
                      <Input
                        id="height"
                        placeholder="키를 입력하세요"
                        value={userInfo.height}
                        onChange={(e) => setUserInfo({ ...userInfo, height: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">몸무게 (kg)</Label>
                      <Input
                        id="weight"
                        placeholder="몸무게를 입력하세요"
                        value={userInfo.weight}
                        onChange={(e) => setUserInfo({ ...userInfo, weight: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="activityLevel">현재 활동량</Label>
                      <Select
                        value={userInfo.activityLevel}
                        onValueChange={(value) => setUserInfo({ ...userInfo, activityLevel: value })}
                      >
                        <SelectTrigger id="activityLevel">
                          <SelectValue placeholder="활동량을 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedentary">거의 운동하지 않음</SelectItem>
                          <SelectItem value="light">가벼운 운동 (주 1-2회)</SelectItem>
                          <SelectItem value="moderate">중간 강도 운동 (주 3-4회)</SelectItem>
                          <SelectItem value="active">활발한 운동 (주 5회 이상)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fitnessGoal">운동 목표</Label>
                      <Select
                        value={userInfo.fitnessGoal}
                        onValueChange={(value) => setUserInfo({ ...userInfo, fitnessGoal: value })}
                      >
                        <SelectTrigger id="fitnessGoal">
                          <SelectValue placeholder="목표를 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weightLoss">체중 감량</SelectItem>
                          <SelectItem value="muscleGain">근력 향상</SelectItem>
                          <SelectItem value="endurance">지구력 향상</SelectItem>
                          <SelectItem value="flexibility">유연성 향상</SelectItem>
                          <SelectItem value="health">전반적인 건강 증진</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="disability"
                      checked={userInfo.hasDisability}
                      onCheckedChange={(checked) =>
                        setUserInfo({ ...userInfo, hasDisability: checked as boolean })
                      }
                    />
                    <Label htmlFor="disability">장애 여부</Label>
                  </div>
                  {userInfo.hasDisability && (
                    <div className="space-y-2">
                      <Label htmlFor="disabilityType">장애 유형</Label>
                      <Input
                        id="disabilityType"
                        placeholder="장애 유형을 입력하세요"
                        value={userInfo.disabilityType}
                        onChange={(e) => setUserInfo({ ...userInfo, disabilityType: e.target.value })}
                      />
                    </div>
                  )}
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                </form>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card
                className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
                onClick={() => setPrompt('workout')}
              >
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Dumbbell className="mr-2 h-5 w-5" />
                    맞춤형 운동 계획
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>개인의 목표, 체력 수준, 선호도에 맞는 운동 계획을 제공합니다.</p>
                </CardContent>
              </Card>
              <Card
                className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
                onClick={() => setPrompt('nutrition')}
              >
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clipboard className="mr-2 h-5 w-5" />
                    영양 및 식단 조언
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>건강한 식단 구성과 영양 섭취에 대한 조언을 제공합니다.</p>
                </CardContent>
              </Card>
              <Card
                className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
                onClick={() => setPrompt('health')}
              >
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    건강 상담
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>일반적인 건강 관련 질문에 대한 답변과 조언을 제공합니다.</p>
                </CardContent>
              </Card>
            </div>
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
                <li><Link href="/fitness" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">스포츠강좌</Link></li>
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