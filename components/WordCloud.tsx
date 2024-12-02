'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import * as d3 from 'd3'
import cloud from 'd3-cloud'
import { analyzeWordFrequency, analyzeTrendWithAI } from '@/app/news/actions'

interface WordCloudProps {
  date?: string
}

interface Word extends cloud.Word {
  text: string
  value: number
}

export function WordCloud({ date }: WordCloudProps) {
  const [words, setWords] = useState<Word[]>([])
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    analyzeWordFrequency(date).then(result => 
      setWords(result.map(item => ({ text: item.text, value: item.value })))
    )
  }, [date])

  useEffect(() => {
    if (words.length === 0 || !svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove() // Clear previous content

    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight

    const layout = cloud<Word>()
      .size([width, height])
      .words(words)
      .padding(5)
      .rotate(() => (~~(Math.random() * 2) - 1) * 90)
      .fontSize(d => Math.sqrt(d.value) * 5)
      .on("end", draw)

    layout.start()

    function draw(words: Word[]) {
      svg.attr("width", layout.size()[0])
         .attr("height", layout.size()[1])
         .append("g")
         .attr("transform", `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`)
         .selectAll("text")
         .data(words)
         .enter().append("text")
         .style("font-size", d => `${d.size}px`)
         .style("font-family", "Inter, sans-serif")
         .style("fill", (_, i) => `hsl(${i * 360 / words.length}, 70%, 50%)`)
         .attr("text-anchor", "middle")
         .attr("transform", d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
         .text(d => d.text)
    }
  }, [words])

  const handleAnalyzeClick = async () => {
    setIsLoading(true)
    try {
      const analysis = await analyzeTrendWithAI(date)
      setAiAnalysis(analysis)
    } catch (error) {
      console.error('트렌드 분석 중 오류 발생:', error)
      setAiAnalysis('트렌드 분석 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  if (words.length === 0) return <Skeleton className="w-full h-[500px] rounded-xl" />

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{date ? `${date} 기준 ` : ''}자주 등장하는 단어</CardTitle>
<<<<<<< HEAD
        <CardDescription>상위 30개 단어를 시각화한 워드 클라우드입니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video">
          <svg ref={svgRef} className="w-full h-full" />
        </div>
        <div className="mt-6 space-y-4">
          <Button 
            onClick={handleAnalyzeClick} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? '분석 중...' : 'AI 트렌드 분석 (상위 15개 단어)'}
=======
      </CardHeader>
      <CardContent>
        <svg ref={svgRef} width="100%" height="400" />
        <div className="mt-4">
          <Button onClick={handleAnalyzeClick} disabled={isLoading}>
            {isLoading ? '분석 중...' : 'AI 트렌드 분석'}
>>>>>>> parent of 785bc4d (오류 수정)
          </Button>
          {aiAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI 트렌드 분석 결과</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{aiAnalysis}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

