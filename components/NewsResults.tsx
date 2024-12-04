import { searchSportsNews } from '@/app/news/actions'
import { Card, CardContent } from "@/components/ui/card"
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
    <div className="space-y-6">
      {date && (
        <h2 className="text-xl font-semibold mb-4">
          {format(new Date(date), 'yyyy년 MM월 dd일')} 뉴스
        </h2>
      )}
      <div className="space-y-4">
        {news.map((item, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <a href={item.link} target="_blank" rel="noopener noreferrer" 
                   className="text-lg font-semibold hover:underline" dangerouslySetInnerHTML={{ __html: item.title }} />
                <Badge variant="outline">{item.source}</Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2" dangerouslySetInnerHTML={{ __html: item.description }} />
              <p className="text-xs text-gray-500">{new Date(item.pubDate).toLocaleString('ko-KR')}</p>
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
    </div>
  )
}

