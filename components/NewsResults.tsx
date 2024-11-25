import { searchSportsNews } from '@/app/news/actions'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { format } from 'date-fns'

interface NewsResultsProps {
  query: string
  page: number
  date?: string
}

export async function NewsResults({ query, page, date }: NewsResultsProps) {
  const pageSize = 15
  const { items: news, total } = await searchSportsNews(query, page, pageSize, date)

  if (news.length === 0) {
    return <p className="text-center text-gray-600">검색 결과가 없습니다. 다른 키워드나 날짜로 검색해보세요.</p>
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <>
      {date && (
        <h2 className="text-xl font-semibold mb-4">
          {format(new Date(date), 'yyyy년 MM월 dd일')} 뉴스
        </h2>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {news.map((item, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg flex justify-between items-start">
                <a href={item.link} target="_blank" rel="noopener noreferrer" 
                   className="hover:underline" dangerouslySetInnerHTML={{ __html: item.title }} />
                <Badge variant="outline" className="ml-2">{item.source}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: item.description }} />
              <p className="text-xs text-gray-500 mt-2">{new Date(item.pubDate).toLocaleString('ko-KR')}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href={`/news?query=${query}&page=${Math.max(1, page - 1)}${date ? `&date=${date}` : ''}`}
              aria-disabled={page === 1}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink 
                href={`/news?query=${query}&page=${i + 1}${date ? `&date=${date}` : ''}`}
                isActive={page === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext 
              href={`/news?query=${query}&page=${Math.min(totalPages, page + 1)}${date ? `&date=${date}` : ''}`}
              aria-disabled={page === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  )
}
