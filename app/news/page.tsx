import { Suspense } from 'react'
import { NewsSearch } from '@/components/NewsSearch'
import { NewsResults } from '@/components/NewsResults'
import { WordCloud } from '@/components/WordCloud'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type SearchParams = {
  query?: string
  page?: string
  date?: string
}

type PageProps = {
  params: Promise<any>
  searchParams: Promise<SearchParams>
}

export default async function NewsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams

  const query = resolvedSearchParams.query || ''
  const page = parseInt(resolvedSearchParams.page || '1', 10)
  const date = resolvedSearchParams.date

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <a href="/" className="flex items-center space-x-2">
            <span className="font-bold text-2xl bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Spornity
            </span>
          </a>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">스포츠 뉴스 및 단어 빈도 분석</h1>
          <Card>
            <CardHeader>
              <CardTitle>뉴스 검색</CardTitle>
            </CardHeader>
            <CardContent>
              <NewsSearch 
                initialQuery={query} 
                initialDate={date ? new Date(date) : undefined}
              />
            </CardContent>
          </Card>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>단어 빈도 분석</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>단어 빈도 데이터를 불러오는 중...</div>}>
                  <WordCloud date={date} />
                </Suspense>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>뉴스 결과</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>스포츠 뉴스를 불러오는 중...</div>}>
                  <NewsResults query={query} page={page} date={date} />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-500">
            © 2024 Spornity. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

