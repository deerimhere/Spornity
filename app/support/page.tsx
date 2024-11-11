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
}

const ITEMS_PER_PAGE = 9;

export default function SupportPrograms() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedField, setSelectedField] = useState("all")
  const [supportPrograms, setSupportPrograms] = useState<SupportProgram[]>([])
  const [filteredPrograms, setFilteredPrograms] = useState<SupportProgram[]>([])
  const [currentPage, setCurrentPage] = useState(1)

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
          return { ...qual, ...matchingTeam, id: `${qual.사업과제명}-${qual.지원년도}-${index}` };
        });

        setSupportPrograms(combinedData);
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
      (selectedField === "all" || program.지원분야명 === selectedField)
    )
    setFilteredPrograms(filtered)
    setCurrentPage(1)
  }, [searchTerm, selectedField, supportPrograms])

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
                  <Select onValueChange={setSelectedField} value={selectedField}>
                    <SelectTrigger>
                      <SelectValue placeholder="지원 분야 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">모든 분야</SelectItem>
                      <SelectItem value="일자리 지원">일자리 지원</SelectItem>
                      <SelectItem value="창업 지원">창업 지원</SelectItem>
                      {/* 더 많은 분야... */}
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
                  >
                    <ChevronLeft className="h-4 w-4" />
                    이전
                  </Button>
                  <span className="mx-2 self-center">
                    {currentPage} / {pageCount}
                  </span>
                  <Button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                    disabled={currentPage === pageCount}
                  >
                    다음
                    <ChevronRight className="h-4 w-4" />
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
                <li><Link href="/facilities" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">지역 체육 시설</Link></li>
                <li><Link href="/clubs" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">지역 동호회</Link></li>
                <li><Link href="/fitness" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">맞춤 운동 추천</Link></li>
                <li><Link href="/programs" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">프로그램</Link></li>
                <li><Link href="/ai-pt" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">AI PT</Link></li>
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
          className="group cursor-pointer p-4 rounded-lg transition-all duration-300 bg-gradient-to-br from-blue-50/30 to-purple-50/30 hover:from-blue-100/40 hover:to-purple-100/40 dark:from-blue-900/30 dark:to-purple-900/30 dark:hover:from-blue-800/40 dark:hover:to-purple-800/40 shadow-sm hover:shadow-md dark:shadow-gray-800/30 dark:hover:shadow-gray-700/40"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {program.사업과제명}
            </h3>
            <Badge variant="outline" className="bg-white text-black whitespace-nowrap ml-2">
              {program.지원분야명}
            </Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-2">{program.상세사업명 || 'N/A'}</p>
          <p className="text-gray-500 line-clamp-2">{program.사업목적내용 || 'N/A'}</p>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{program.사업과제명}</DialogTitle>
          <DialogDescription>{program.지원분야명} | {program.지원년도}년</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div>
            <h4 className="font-semibold text-sm text-gray-500 mb-1">사업 목적</h4>
            <p className="text-gray-700 dark:text-gray-300">{program.사업목적내용 || 'N/A'}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-500 mb-1">지원 대상</h4>
            <p className="text-gray-700 dark:text-gray-300">{program.지원대상비고내용 || 'N/A'}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-500 mb-1">지원 내용</h4>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{program.지원상세내용 || 'N/A'}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-gray-500 mb-1">모집 기간</h4>
              <p className="text-gray-700 dark:text-gray-300">
                {program.모집기간시작일자 && program.모집기간종료일자 ? 
                  `${new Date(program.모집기간시작일자).toLocaleDateString()} ~ ${new Date(program.모집기간종료일자).toLocaleDateString()}` : 
                  'N/A'}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-500 mb-1">모집 기간 비고</h4>
              <p className="text-gray-700 dark:text-gray-300">{program.모집기간비고내용 || 'N/A'}</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-500 mb-1">지원 기간</h4>
            <p className="text-gray-700 dark:text-gray-300">
              {program.지원기간시작일자 && program.지원기간종료일자 ? 
                `${new Date(program.지원기간시작일자).toLocaleDateString()} ~ ${new Date(program.지원기간종료일자).toLocaleDateString()}` : 
                'N/A'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-gray-500 mb-1">총 예산</h4>
              <p className="text-gray-700 dark:text-gray-300">{program.지원규모총예산금액 ? `${Number(program.지원규모총예산금액).toLocaleString()}원` : 'N/A'}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-500 mb-1">지원 규모</h4>
              <p className="text-gray-700 dark:text-gray-300">{program.지원규모수 ? `${program.지원규모수}개` : 'N/A'}</p>
            </div>
          </div>
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