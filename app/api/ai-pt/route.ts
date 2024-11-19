import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "당신은 전문적인 AI 퍼스널 트레이너입니다. 운동, 영양, 건강에 대한 조언을 제공합니다." },
        { role: "user", content: prompt }
      ],
      max_tokens: 1000,
    });

    const response = chatCompletion.choices[0]?.message?.content;

    if (!response) {
      return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
    }

    // HTML 형식으로 응답 포맷팅
    const formattedResponse = response.replace(/\n/g, '<br>');

    return NextResponse.json({ response: formattedResponse });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}