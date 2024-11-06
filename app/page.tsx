"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Activity, Users, Palette, Accessibility, Search, ChevronRight, Menu, X } from "lucide-react"
import type { LucideProps } from 'lucide-react'

interface Service {
  title: string;
  icon: React.ComponentType<LucideProps>;
  description: string;
  href: string;
  color: string;
}

const services: Service[] = [
  { title: "지역 체육 시설", icon: MapPin, description: "주변의 체육 시설을 쉽게 찾아보세요.", href: "/facilities", color: "bg-sky-200 dark:bg-sky-800" },
  { title: "지역 동호회", icon: Users, description: "관심사가 비슷한 사람들과 함께 운동하세요.", href: "/clubs", color: "bg-emerald-200 dark:bg-emerald-800" },
  { title: "체력 진단 및 운동 추천", icon: Accessibility, description: "개인 맞춤형 체력 진단과 운동 추천을 받아보세요.", href: "/fitness", color: "bg-amber-200 dark:bg-amber-800" },
  { title: "공공체육시설 프로그램", icon: Activity, description: "다양한 연령대를 위한 체육 프로그램 정보를 확인하세요.", href: "/programs", color: "bg-rose-200 dark:bg-rose-800" },
  { title: "소마미술관", icon: Palette, description: "현대 미술의 중심, 소마미술관을 소개합니다.", href: "/soma", color: "bg-violet-200 dark:bg-violet-800" },
]

export default function MainPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.8])
  const headerBlur = useTransform(scrollY, [0, 100], [0, 8])

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <motion.header 
        className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur supports-[backdrop-filter]:bg-white/60"
        style={{ 
          opacity: headerOpacity,
          backdropFilter: `blur(${headerBlur}px)`
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-2xl bg-gradient-to-r from-sky-600 to-violet-600 bg-clip-text text-transparent">
                Spornity
              </span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              {services.map((service, index) => (
                <Link key={index} href={service.href} className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {service.title}
                </Link>
              ))}
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
      </motion.header>

      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 py-4">
          <nav className="container mx-auto px-4 flex flex-col space-y-4">
            {services.map((service, index) => (
              <Link key={index} href={service.href} className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {service.title}
              </Link>
            ))}
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
        <HeroSection />
        <ServicesSection services={services} />
      </main>

      <Footer services={services} />
    </div>
  )
}

function HeroSection() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 300], [0, -50])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  return (
    <motion.section 
      className="relative py-20 md:py-32 overflow-hidden"
      style={{ y, opacity }}
    >
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.1 }}
        transition={{ duration: 1.5 }}
      >
        <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-30 dark:opacity-10" />
      </motion.div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-6 text-gray-800 dark:text-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          당신의 건강한 삶을 위한 모든 것
        </motion.h1>
        <motion.p 
          className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-6 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          지역 체육 시설부터 문화 프로그램까지,
        </motion.p>
        <motion.p 
          className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Spornity와 함께 활기찬 라이프스타일을 만들어보세요.
        </motion.p>
        <motion.div 
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <form className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-lg p-1">
            <Input
              className="flex-1 border-none bg-transparent focus:ring-0 text-lg"
              placeholder="찾고 싶은 시설이나 프로그램은?"
              type="text"
            />
            <Button type="submit" size="lg" className="rounded-full">
              <Search className="h-5 w-5 mr-2" />
              검색
            </Button>
          </form>
        </motion.div>
      </div>
    </motion.section>
  )
}

function ServicesSection({ services }: { services: Service[] }) {
  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          <span className="bg-gradient-to-r from-sky-600 to-violet-600 bg-clip-text text-transparent">
            Spornity
          </span>
          <span className="text-gray-800 dark:text-gray-200">의 서비스</span>
        </h2>
        <div className="space-y-24">
          {services.map((service, index) => (
            <ServiceItem key={index} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceItem({ service, index }: { service: Service; index: number }) {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  const variants = {
    hidden: { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  }

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={variants}
      className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}
    >
      <div className="w-full md:w-1/2">
        <motion.div 
          className={`aspect-video rounded-2xl ${service.color} flex items-center justify-center`}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <service.icon className="h-24 w-24 text-white" />
        </motion.div>
      </div>
      <div className="w-full md:w-1/2 space-y-4">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">
          {service.title}
        </h3>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {service.description}
        </p>
        <Button asChild size="lg" className="mt-4">
          <Link href={service.href}>
            자세히 보기
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </motion.div>
  )
}

function Footer({ services }: { services: Service[] }) {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Spornity</h3>
            <p className="text-gray-600 dark:text-gray-400">당신의 건강한 삶을 위한 모든 것</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">빠른 링크</h3>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index}>
                  <Link href={service.href} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">고객 지원</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  접근성 정책
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-gray-600 dark:text-gray-400">
            © 2024 Spornity. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}