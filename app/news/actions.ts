'use server'

import axios from 'axios'
import Parser from 'rss-parser'
import { isAfter, isBefore, parseISO, startOfDay, endOfDay } from 'date-fns'
import OpenAI from 'openai'

interface NewsItem {
  title: string
  link: string
  description: string
  pubDate: string
  source: string
}

interface WordFrequency {
  text: string
  value: number
}

let newsCache: NewsItem[] = []

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function fetchNaverSportsNews(query: string): Promise<NewsItem[]> {
  const response = await axios.get('https://openapi.naver.com/v1/search/news.json', {
    params: { 
      query: query ? `스포츠 ${query}` : '스포츠',
      display: 100,
      sort: 'date',
      category: 'sports'
    },
    headers: {
      'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
      'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET,
    },
  })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return response.data.items.map((item: any) => ({
    ...item,
    source: 'Naver'
  }))
}

async function fetchYonhapSportsNews(): Promise<NewsItem[]> {
  const parser = new Parser()
  const feed = await parser.parseURL('http://www.yonhapnewstv.co.kr/category/news/sports/feed/')

  return feed.items.map(item => ({
    title: item.title || '',
    link: item.link || '',
    description: item.contentSnippet || '',
    pubDate: item.pubDate || '',
    source: 'Yonhap'
  }))
}

export async function searchSportsNews(query: string, page: number = 1, pageSize: number = 15, date?: string): Promise<{ items: NewsItem[], total: number }> {
  if (newsCache.length === 0) {
    const [naverNews, yonhapNews] = await Promise.all([
      fetchNaverSportsNews(''),
      fetchYonhapSportsNews()
    ])
    newsCache = [...naverNews, ...yonhapNews]
  }

  let filteredNews = newsCache

  if (query) {
    const lowercaseQuery = query.toLowerCase()
    filteredNews = filteredNews.filter(item => 
      item.title.toLowerCase().includes(lowercaseQuery) || 
      item.description.toLowerCase().includes(lowercaseQuery)
    )
  }
  
  if (date) {
    const targetDate = parseISO(date)
    filteredNews = filteredNews.filter(item => {
      const itemDate = new Date(item.pubDate)
      return isAfter(itemDate, startOfDay(targetDate)) && isBefore(itemDate, endOfDay(targetDate))
    })
  }

  filteredNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

  const total = filteredNews.length
  const start = (page - 1) * pageSize
  const end = start + pageSize

  return {
    items: filteredNews.slice(start, end),
    total: total
  }
}

export async function analyzeWordFrequency(date?: string): Promise<WordFrequency[]> {
  let targetNews = newsCache

  if (date) {
    const targetDate = parseISO(date)
    targetNews = targetNews.filter(item => {
      const itemDate = new Date(item.pubDate)
      return isAfter(itemDate, startOfDay(targetDate)) && isBefore(itemDate, endOfDay(targetDate))
    })
  }

  const wordCount: { [key: string]: number } = {}
  const stopWords = new Set(['및', '등', '더', '것', '이', '가', '을', '를', '에', '의', '로', '와', '과', '은', '는', '이다', '있다', '하다', '에서', '으로', '한', '대', '일', '때', '또', '수', '말', '그', '전', '후', '중', '씨', '들', '년', '월', '일', '시', '분', '초'])

  targetNews.forEach(item => {
    const words = (item.title + ' ' + item.description).split(/\s+/)
    words.forEach(word => {
      if (word.length > 1 && !stopWords.has(word) && !/^\d+$/.test(word)) {
        wordCount[word] = (wordCount[word] || 0) + 1
      }
    })
  })

  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 100)
    .map(([text, value]) => ({ text, value }))
}

export async function analyzeTrendWithAI(date?: string): Promise<string> {
  let targetNews = newsCache

  if (date) {
    const targetDate = parseISO(date)
    targetNews = targetNews.filter(item => {
      const itemDate = new Date(item.pubDate)
      return isAfter(itemDate, startOfDay(targetDate)) && isBefore(itemDate, endOfDay(targetDate))
    })
  }

  const newsContent = targetNews.map(item => `${item.title}\n${item.description}`).join('\n\n')

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a sports news analyst. Analyze the given sports news and provide a brief trend analysis."
      },
      {
        role: "user",
        content: `Analyze the following sports news and provide a brief trend analysis:\n\n${newsContent}`
      }
    ],
    max_tokens: 150
  });

  return response.choices[0].message.content || "트렌드 분석을 수행할 수 없습니다.";
}
