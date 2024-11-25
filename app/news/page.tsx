import { Suspense } from 'react'
import { NewsSearch } from '@/components/NewsSearch'
import { NewsResults } from '@/components/NewsResults'
import { WordCloud } from '@/components/WordCloud'

type SearchParams = {
  query?: string
  page?: string
  date?: string
}

type PageProps = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Promise<any>
  searchParams: Promise<SearchParams>
}

export default async function NewsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  
  const query = resolvedSearchParams.query || ''
  const page = parseInt(resolvedSearchParams.page || '1', 10)
  const date = resolvedSearchParams.date

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">스포츠 뉴스 및 단어 빈도 분석</h1>
      <p className="text-gray-600 mb-6">
        네이버와 연합뉴스에서 최신 스포츠 뉴스를 확인하고 자주 등장하는 단어를 분석하세요.
      </p>
      <NewsSearch 
        initialQuery={query} 
        initialDate={date ? new Date(date) : undefined}
      />
      <Suspense fallback={<div>단어 빈도 데이터를 불러오는 중...</div>}>
        <WordCloud date={date} />
      </Suspense>
      <Suspense fallback={<div>스포츠 뉴스를 불러오는 중...</div>}>
        <NewsResults query={query} page={page} date={date} />
      </Suspense>
    </div>
  )
}