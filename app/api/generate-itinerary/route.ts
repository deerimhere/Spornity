import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  const { travelType, destination, transportation, startDate, endDate } = await req.json()

  const prompt = `
여행 유형: ${travelType}
여행 지역: ${destination}
여행 기간: ${startDate}부터 ${endDate}까지
교통수단: ${transportation}

**여행 코스는 반드시 체육 또는 예술과 관련된 장소로 구성해주세요.**

위 정보를 바탕으로 하루 일정의 여행 계획을 세워주세요.
응답은 **반드시 유효한 JSON 형식**으로 제공해주세요.
응답 형식은 다음과 같이 해주세요:

{
  "itinerary": [
    {
      "courseNumber": 1,
      "places": [
        {
          "startTime": "시작 시간",
          "endTime": "종료 시간",
          "placeName": "장소 이름",
          "description": "설명 (존댓말로 작성)",
          "reservationInfo": "예약 정보",
          "estimatedTravelTimeFromPrevious": "이전 장소에서의 예상 이동 시간 (첫 번째 장소의 경우 생략)",
          "weather": "해당 날짜의 예상 날씨 정보",
          "accessibilityInfo": "접근성 정보",
          "localSpecialties": "추천 기념품 또는 지역 특산품"
        },
        ...
      ]
    },
    ...
  ]
}

각 장소마다 다음 정보를 포함해주세요:
- 방문 시간 (시작 시간과 종료 시간)
- 장소 이름
- 설명 (존댓말로 작성)
- 예약 정보
- 이전 장소에서의 예상 이동 시간 (선택한 교통수단 사용 시, **첫 번째 장소의 경우 생략**)
- 해당 날짜의 예상 날씨 정보
- 접근성 정보
- 추천 기념품 또는 지역 특산품

**특별 이벤트 정보, 온도 및 홈페이지 주소는 포함하지 마세요.**

3개의 추천 코스를 제공해주세요. 각 코스는 3-4개의 장소를 포함해야 합니다.
각 장소 사이의 이동 시간도 명시해주세요.
`

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    })

    const messageContent = response.choices[0].message?.content;

    if (!messageContent) {
      console.error('메시지 내용이 없습니다.');
      return NextResponse.json({ error: '일정 데이터를 생성하는 데 실패했습니다.' }, { status: 500 })
    }

    // OpenAI의 응답을 파싱하여 JSON 데이터로 변환
    let data
    try {
      data = JSON.parse(messageContent)
    } catch (parseError) {
      console.error('JSON 파싱 에러:', parseError)
      return NextResponse.json({ error: '일정 데이터를 파싱하는 데 실패했습니다.' }, { status: 500 })
    }

    return NextResponse.json({ itinerary: data.itinerary })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: '일정 생성에 실패했습니다.' }, { status: 500 })
  }
}
