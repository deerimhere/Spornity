'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import Papa from 'papaparse'

interface SupportProgram {
  id: string;
  지원분야명: string;
  지원년도: string;
  사업과제명: string;
  상세사업명: string;
  사업목적내용: string;
  지원대상비고내용: string;
  모집기간시작일자: string;
  모집기간종료일자: string;
  모집기간비고내용: string;
  지원기간시작일자: string;
  지원기간종료일자: string;
  지원상세내용: string;
  지원규모총예산금액: string;
  지원규모수: string;
  홈페이지URL: string;
  담당부서명: string;
  문의전화번호: string;
  신청방법내용: string;
  선정방법내용: string;
  사업수행내용: string;
  사업평가내용: string;
  지원자격: string;
  신청자격: string;
  지원대상사업규모값: string;
  지원대상예비창업여부: string;
  지원대상창업일자: string;
  지원대상지원이력필요여부: string;
  지원대상단체가능여부: string;
  지원대상지자체가능여부: string;
  지원대상개인가능여부: string;
  지원대상관련법률명: string;
  참여조건여부: string;
  참여조건내용: string;
  참여조건최소업력수: string;
  참여조건최대업력수: string;
  지원절차내용: string;
  스타트업우선여부: string;
  지원규모단위당최대지원금액: string;
  지원규모비고내용: string;
  기업자부담여부: string;
  기업자부담기준설명: string;
  기업자부담비율: string;
  가점조건여부: string;
  가점조건최대점수: string;
  가점조건비고내용: string;
  신청제외대상여부: string;
  신청제외대상내용: string;
  평가방식비계량비율: string;
  평가방식계량비율: string;
  평가방식서류평가여부: string;
  평가방식발표평가여부: string;
  평가방식비고내용: string;
}

const ITEMS_PER_PAGE = 9;

export default function SupportPrograms() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedField, setSelectedField] = useState("all")
  const [selectedYear, setSelectedYear] = useState("all")
  const [selectedTarget, setSelectedTarget] = useState<string[]>([])
  const [selectedBudget, setSelectedBudget] = useState("all")
  const [selectedStartupStage, setSelectedStartupStage] = useState("all")
  const [selectedRecruitmentStatus, setSelectedRecruitmentStatus] = useState("all")
  const [supportPrograms, setSupportPrograms] = useState<SupportProgram[]>([])
  const [filteredPrograms, setFilteredPrograms] = useState<SupportProgram[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [uniqueYears, setUniqueYears] = useState<string[]>([])
  const [uniqueFields, setUniqueFields] = useState<string[]>([])
  const [selectedStartupPriority, setSelectedStartupPriority] = useState("all")
  const [selectedSelfPayment, setSelectedSelfPayment] = useState("all")
  const [selectedEvaluation, setSelectedEvaluation] = useState("all")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [qualificationsResponse, teamResponse] = await Promise.all([
          fetch('/data/sports-support-qualifications.csv'),
          fetch('/data/sports-support-team.csv')
        ]);

        const [qualificationsText, teamText] = await Promise.all([
          qualificationsResponse.text(),
          teamResponse.text()
        ]);

        const qualificationsData = Papa.parse<SupportProgram>(qualificationsText, { header: true, skipEmptyLines: true }).data;
        const teamData = Papa.parse<SupportProgram>(teamText, { header: true, skipEmptyLines: true }).data;

        const combinedData = qualificationsData.map((qual, index) => {
          const matchingTeam = teamData.find(team => 
            team.사업과제명 === qual.사업과제명 && team.지원년도 === qual.지원년도
          );
          return { 
            ...qual, 
            ...matchingTeam, 
            id: `${qual.사업과제명}-${qual.지원년도}-${index}`,
            신청방법내용: matchingTeam?.신청방법내용 || 'N/A',
            선정방법내용: matchingTeam?.선정방법내용 || 'N/A',
            사업수행내용: matchingTeam?.사업수행내용 || 'N/A',
            사업평가내용: matchingTeam?.사업평가내용 || 'N/A',
            지원자격: qual.지원자격 || matchingTeam?.지원자격 || 'N/A',
            신청자격: qual.신청자격 || matchingTeam?.신청자격 || 'N/A'
          };
        });

        setSupportPrograms(combinedData);

        const years = Array.from(new Set(combinedData.map(program => program.지원년도))).sort((a, b) => b.localeCompare(a));
        setUniqueYears(["all", ...years]);

        const fields = Array.from(new Set(combinedData.map(program => program.지원분야명))).sort();
        setUniqueFields(["all", ...fields]);
      } catch (error) {
        console.error('Error fetching CSV data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = supportPrograms.filter(program => 
      (program.사업과제명.toLowerCase().includes(searchTerm.toLowerCase()) ||
       program.상세사업명?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedField === "all" || program.지원분야명 === selectedField) &&
      (selectedYear === "all" || program.지원년도 === selectedYear) &&
      (selectedTarget.length === 0 || 
        (selectedTarget.includes('개인') && program.지원대상개인가능여부 === 'Y') ||
        (selectedTarget.includes('단체') && program.지원대상단체가능여부 === 'Y') ||
        (selectedTarget.includes('지자체') && program.지원대상지자체가능여부 === 'Y') ||
        (selectedTarget.includes('예외') && 
         program.지원대상개인가능여부 !== 'Y' && 
         program.지원대상단체가능여부 !== 'Y' && 
         program.지원대상지자체가능여부 !== 'Y')) &&
      (selectedBudget === "all" || 
        (selectedBudget === "low" && Number(program.지원규모총예산금액) < 100000000) ||
        (selectedBudget === "medium" && Number(program.지원규모총예산금액) >= 100000000 && Number(program.지원규모총예산금액) < 1000000000) ||
        (selectedBudget === "high" && Number(program.지원규모총예산금액) >= 1000000000)) &&
      (selectedStartupStage === "all" || 
        (selectedStartupStage === "pre" && program.지원대상예비창업여부 === 'Y') ||
        (selectedStartupStage === "post" && program.지원대상예비창업여부 !== 'Y')) &&
      (selectedRecruitmentStatus === "all" || 
        (selectedRecruitmentStatus === "ongoing" && new Date() >= new Date(program.모집기간시작일자) && new Date() <= new Date(program.모집기간종료일자)) ||
        (selectedRecruitmentStatus === "upcoming" && new Date() < new Date(program.모집기간시작일자)) ||
        (selectedRecruitmentStatus === "closed" && new Date() > new Date(program.모집기간종료일자))) &&
      (selectedStartupPriority === "all" || 
        (selectedStartupPriority === "yes" && program.스타트업우선여부 === 'Y') ||
        (selectedStartupPriority === "no" && program.스타트업우선여부 !== 'Y')) &&
      (selectedSelfPayment === "all" || 
        (selectedSelfPayment === "required" && program.기업자부담여부 === 'Y') ||
        (selectedSelfPayment === "not-required" && program.기업자부담여부 !== 'Y')) &&
      (selectedEvaluation === "all" || 
        (selectedEvaluation === "document" && program.평가방식서류평가여부 === 'Y') ||
        (selectedEvaluation === "presentation" && program.평가방식발표평가여부 === 'Y'))
    )
    setFilteredPrograms(filtered)
    setCurrentPage(1)
  }, [searchTerm, selectedField, selectedYear, selectedTarget, selectedBudget, selectedStartupStage, 
      selectedRecruitmentStatus, selectedStartupPriority, selectedSelfPayment, selectedEvaluation, supportPrograms])

  const pageCount = Math.ceil(filteredPrograms.length / ITEMS_PER_PAGE);
  const currentPrograms = filteredPrograms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  정부 스포츠산업 지원 프로그램
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  당신의 스포츠 관련 사업에 맞는 지원 프로그램을 찾아보세요.<br />
                  다양한 기회가 여러분을 기다리고 있습니다.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">검색 필터</h2>
                  <p className="text-gray-500 dark:text-gray-400">원하는 조건을 선택하여 지원 프로그램을 찾아보세요.</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>지원 대상</Label>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="individual" 
                          checked={selectedTarget.includes('개인')}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTarget([...selectedTarget, '개인'])
                            } else {
                              setSelectedTarget(selectedTarget.filter(t => t !== '개인'))
                            }
                          }}
                        />
                        <label htmlFor="individual">개인</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="organization" 
                          checked={selectedTarget.includes('단체')}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTarget([...selectedTarget, '단체'])
                            } else {
                              setSelectedTarget(selectedTarget.filter(t => t !== '단체'))
                            }
                          }}
                        />
                        <label htmlFor="organization">단체</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="local-gov" 
                          checked={selectedTarget.includes('지자체')}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTarget([...selectedTarget, '지자체'])
                            } else {
                              setSelectedTarget(selectedTarget.filter(t => t !== '지자체'))
                            }
                          }}
                        />
                        <label htmlFor="local-gov">지자체</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="exception" 
                          checked={selectedTarget.includes('예외')}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTarget([...selectedTarget, '예외'])
                            } else {
                              setSelectedTarget(selectedTarget.filter(t => t !== '예외'))
                            }
                          }}
                        />
                        <label htmlFor="exception">예외</label>
                      </div>
                    </div>
                  </div>
                  <Select onValueChange={setSelectedField} value={selectedField}>
                    <SelectTrigger>
                      <SelectValue placeholder="지원 분야 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueFields.map((field) => (
                        <SelectItem key={field} value={field}>
                          {field === "all" ? "지원 분야 선택" : field}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select onValueChange={setSelectedYear} value={selectedYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="지원 년도 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueYears.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year === "all" ? "지원 년도 선택" : `${year}년`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select onValueChange={setSelectedBudget} value={selectedBudget}>
                    <SelectTrigger>
                      <SelectValue placeholder="지원 규모 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">지원 규모 선택</SelectItem>
                      <SelectItem value="low">1억 미만</SelectItem>
                      <SelectItem value="medium">1억 이상 10억 미만</SelectItem>
                      <SelectItem value="high">10억 이상</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select onValueChange={setSelectedStartupStage} value={selectedStartupStage}>
                    <SelectTrigger>
                      <SelectValue placeholder="창업 단계 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">창업 단계 선택</SelectItem>
                      <SelectItem value="pre">예비 창업</SelectItem>
                      <SelectItem value="post">창업 후</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select onValueChange={setSelectedRecruitmentStatus} value={selectedRecruitmentStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="모집 상태 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">모집 상태 선택</SelectItem>
                      <SelectItem value="ongoing">모집 중</SelectItem>
                      <SelectItem value="upcoming">모집 예정</SelectItem>
                      <SelectItem value="closed">모집 마감</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select onValueChange={setSelectedStartupPriority} value={selectedStartupPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder="스타트업 우선 지원 여부" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">스타트업 우선 지원 여부</SelectItem>
                      <SelectItem value="yes">스타트업 우선</SelectItem>
                      <SelectItem value="no">일반</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select onValueChange={setSelectedSelfPayment} value={selectedSelfPayment}>
                    <SelectTrigger>
                      <SelectValue placeholder="자부담 필요 여부" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">자부담 필요 여부</SelectItem>
                      <SelectItem value="required">자부담 필요</SelectItem>
                      <SelectItem value="not-required">자부담 불필요</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select onValueChange={setSelectedEvaluation} value={selectedEvaluation}>
                    <SelectTrigger>
                      <SelectValue placeholder="평가 방식 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">평가 방식 선택</SelectItem>
                      <SelectItem value="document">서류 평가</SelectItem>
                      <SelectItem value="presentation">발표 평가</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="relative">
                    <Input
                      placeholder="프로그램 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-8"
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {currentPrograms.map((program) => (
                    <ProgramCard key={program.id} program={program} />
                  ))}
                </div>
                <div className="flex justify-center mt-8 space-x-2">
                  <Button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">이전</span>
                  </Button>
                  <span className="mx-2 self-center">
                    {currentPage} / {pageCount}
                  </span>
                  <Button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                    disabled={currentPage === pageCount}
                    className="p-2"
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">다음</span>
                  </Button>
                </div>
              </div>
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

function ProgramCard({ program }: { program: SupportProgram }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="group cursor-pointer p-4 rounded-lg transition-all duration-300 bg-gradient-to-br from-blue-50/30 to-purple-50/30 hover:from-blue-100/40 hover:to-purple-100/40 dark:from-blue-900/30 dark:to-purple-900/30 dark:hover:from-blue-800/40 dark:hover:to-purple-800/40 shadow-lg hover:shadow-lg dark:shadow-gray-800/40 dark:hover:shadow-gray-700/50 border border-gray-200 dark:border-gray-700 h-[125px] md:h-[250px] overflow-y-auto"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-xl md:text-xl text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {program.사업과제명}
            </h3>
            <Badge variant="outline" className="bg-white text-black whitespace-nowrap ml-2 text-sm md:text-sm">
              {program.지원분야명}
            </Badge>
          </div>
          <p className="text-base md:text-base text-gray-600 dark:text-gray-400 mb-2">{program.상세사업명 || 'N/A'}</p>
          <p className="text-sm md:text-sm text-gray-500 line-clamp-2">{program.사업목적내용 || 'N/A'}</p>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{program.사업과제명}</DialogTitle>
          <DialogDescription>{program.지원분야명} | {program.지원년도}년</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6">
          <div>
            <h4 className="font-semibold text-sm text-gray-500 mb-1">사업 목적</h4>
            <p className="text-gray-700 dark:text-gray-300">{program.사업목적내용 || 'N/A'}</p>
          </div>
          
          <div className="grid gap-4">
            <h4 className="font-semibold text-sm text-gray-500">지원 대상 정보</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <div>
                <h5 className="font-medium text-sm text-gray-600 dark:text-gray-400 mb-2">지원 가능 대상</h5>
                <div className="space-y-1">
                  <p className="text-sm">
                    개인: {program.지원대상개인가능여부 === 'Y' ? '가능' : '불가능'}
                  </p>
                  <p className="text-sm">
                    단체: {program.지원대상단체가능여부 === 'Y' ? '가능' : '불가능'}
                  </p>
                  <p className="text-sm">
                    지자체: {program.지원대상지자체가능여부 === 'Y' ? '가능' : '불가능'}
                  </p>
                </div>
              </div>
              <div>
                <h5 className="font-medium text-sm text-gray-600 dark:text-gray-400 mb-2">사업 규모 요건</h5>
                <p className="text-sm">{program.지원대상사업규모값 || 'N/A'}</p>
              </div>
              <div>
                <h5 className="font-medium text-sm text-gray-600 dark:text-gray-400 mb-2">창업 관련 요건</h5>
                <div className="space-y-1">
                  <p className="text-sm">
                    예비창업: {program.지원대상예비창업여부 === 'Y' ? '가능' : '불가능'}
                  </p>
                  {program.지원대상창업일자 && (
                    <p className="text-sm">창업일자 기준: {program.지원대상창업일자}</p>
                  )}
                </div>
              </div>
              <div>
                <h5 className="font-medium text-sm text-gray-600 dark:text-gray-400 mb-2">업력 요건</h5>
                <div className="space-y-1">
                  {program.참여조건최소업력수 && (
                    <p className="text-sm">최소 업력: {program.참여조건최소업력수}</p>
                  )}
                  {program.참여조건최대업력수 && (
                    <p className="text-sm">최대 업력: {program.참여조건최대업력수}</p>
                  )}
                </div>
              </div>
            </div>
            {program.지원대상관련법률명 && (
              <div>
                <h5 className="font-medium text-sm text-gray-600 dark:text-gray-400 mb-2">관련 법률</h5>
                <p className="text-sm">{program.지원대상관련법률명}</p>
              </div>
            )}
          </div>

          {program.참여조건여부 === 'Y' && program.참여조건내용 && (
            <div>
              <h4 className="font-semibold text-sm text-gray-500 mb-1">참여 조건</h4>
              <p className="text-gray-700 dark:text-gray-300">{program.참여조건내용}</p>
            </div>
          )}

          <div>
            <h4 className="font-semibold text-sm text-gray-500 mb-1">지원 내용</h4>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{program.지원상세내용 || 'N/A'}</p>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-gray-500 mb-1">지원 절차</h4>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{program.지원절차내용 || 'N/A'}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-gray-500 mb-1">모집 기간</h4>
              <p className="text-gray-700 dark:text-gray-300">
                {program.모집기간시작일자 && program.모집기간종료일자 ? 
                  `${new Date(program.모집기간시작일자).toLocaleDateString()} ~ ${new Date(program.모집기간종료일자).toLocaleDateString()}` : 
                  'N/A'}
              </p>
              {program.모집기간비고내용 && (
                <p className="text-sm text-gray-500 mt-1">{program.모집기간비고내용}</p>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-500 mb-1">지원 기간</h4>
              <p className="text-gray-700 dark:text-gray-300">
                {program.지원기간시작일자 && program.지원기간종료일자 ? 
                  `${new Date(program.지원기간시작일자).toLocaleDateString()} ~ ${new Date(program.지원기간종료일자).toLocaleDateString()}` : 
                  'N/A'}
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <h4 className="font-semibold text-sm text-gray-500">지원금 및 자부담 정보</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <div>
                <h5 className="font-medium text-sm text-gray-600 dark:text-gray-400 mb-2">최대 지원금</h5>
                <p className="text-sm">{program.지원규모단위당최대지원금액 || 'N/A'}</p>
                {program.지원규모비고내용 && (
                  <p className="text-sm text-gray-500 mt-1">{program.지원규모비고내용}</p>
                )}
              </div>
              <div>
                <h5 className="font-medium text-sm text-gray-600 dark:text-gray-400 mb-2">자부담 정보</h5>
                <div className="space-y-1">
                  <p className="text-sm">
                    자부담 필요: {program.기업자부담여부 === 'Y' ? '예' : '아니오'}
                  </p>
                  {program.기업자부담비율 && (
                    <p className="text-sm">자부담 비율: {program.기업자부담비율}</p>
                  )}
                  {program.기업자부담기준설명 && (
                    <p className="text-sm text-gray-500">{program.기업자부담기준설명}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {program.가점조건여부 === 'Y' && (
            <div>
              <h4 className="font-semibold text-sm text-gray-500 mb-1">가점 조건</h4>
              <div className="space-y-2">
                {program.가점조건최대점수 && (
                  <p className="text-sm">최대 가점: {program.가점조건최대점수}점</p>
                )}
                {program.가점조건비고내용 && (
                  <p className="text-gray-700 dark:text-gray-300">{program.가점조건비고내용}</p>
                )}
              </div>
            </div>
          )}

          {program.신청제외대상여부 === 'Y' && program.신청제외대상내용 && (
            <div>
              <h4 className="font-semibold text-sm text-gray-500 mb-1">신청 제외 대상</h4>
              <p className="text-gray-700 dark:text-gray-300">{program.신청제외대상내용}</p>
            </div>
          )}

          <div>
            <h4 className="font-semibold text-sm text-gray-500 mb-1">평가 방식</h4>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm">계량평가: {program.평가방식계량비율 || '0'}%</p>
                  <p className="text-sm">비계량평가: {program.평가방식비계량비율 || '0'}%</p>
                </div>
                <div>
                  <p className="text-sm">
                    서류평가: {program.평가방식서류평가여부 === 'Y' ? '있음' : '없음'}
                  </p>
                  <p className="text-sm">
                    발표평가: {program.평가방식발표평가여부 === 'Y' ? '있음' : '없음'}
                  </p>
                </div>
              </div>
              {program.평가방식비고내용 && (
                <p className="text-sm text-gray-500">{program.평가방식비고내용}</p>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-gray-500 mb-1">신청 방법</h4>
            <p className="text-gray-700 dark:text-gray-300">{program.신청방법내용 || 'N/A'}</p>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-gray-500 mb-1">선정 방법</h4>
            <p className="text-gray-700 dark:text-gray-300">{program.선정방법내용 || 'N/A'}</p>
          </div>

          {program.사업수행내용 && (
            <div>
              <h4 className="font-semibold text-sm text-gray-500 mb-1">사업 수행 내용</h4>
              <p className="text-gray-700 dark:text-gray-300">{program.사업수행내용}</p>
            </div>
          )}

          {program.사업평가내용 && (
            <div>
              <h4 className="font-semibold text-sm text-gray-500 mb-1">사업 평가</h4>
              <p className="text-gray-700 dark:text-gray-300">{program.사업평가내용}</p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="secondary">{program.지원분야명}</Badge>
          <Badge variant="secondary">{program.지원년도}년</Badge>
        </div>

        <div className="mt-4">
          <Button asChild className="w-full">
            <a href={program.홈페이지URL} target="_blank" rel="noopener noreferrer">자세히 보기</a>
          </Button>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          <p>담당: {program.담당부서명 || 'N/A'}</p>
          <p>문의: {program.문의전화번호 || 'N/A'}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}