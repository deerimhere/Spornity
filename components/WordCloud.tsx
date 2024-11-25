'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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

    const width = 600
    const height = 400

    const layout = cloud<Word>()
      .size([width, height])
      .words(words)
      .padding(5)
      .rotate(() => (~~(Math.random() * 2) - 1) * 90)
      .fontSize(d => Math.sqrt(d.value) * 5)
      .on("end", draw)

    layout.start()

    function draw(words: Word[]) {
      const color = d3.scaleOrdinal(d3.schemeCategory10)

      svg.attr("width", layout.size()[0])
         .attr("height", layout.size()[1])
         .append("g")
         .attr("transform", `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`)
         .selectAll("text")
         .data(words)
         .enter().append("text")
         .style("font-size", d => `${d.size}px`)
         .style("font-family", "Impact")
         .style("fill", (_, i) => color(i.toString()))
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

  if (words.length === 0) return null

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{date ? `${date} 기준 ` : ''}자주 등장하는 단어</CardTitle>
      </CardHeader>
      <CardContent>
        <svg ref={svgRef} width="100%" height="400" />
        <div className="mt-4">
          <Button onClick={handleAnalyzeClick} disabled={isLoading}>
            {isLoading ? '분석 중...' : 'AI 트렌드 분석'}
          </Button>
        </div>
        {aiAnalysis && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <h3 className="text-lg font-semibold mb-2">AI 트렌드 분석 결과:</h3>
            <p>{aiAnalysis}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

