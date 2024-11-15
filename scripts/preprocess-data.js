import fs from 'fs/promises'
import Papa from 'papaparse'

async function preprocessData() {
  try {
    // CSV 파일 읽기
    const regularCsv = await fs.readFile('public/data/sports-program.csv', 'utf-8')
    const disabilityCsv = await fs.readFile('public/data/disabled-sports-progam.csv', 'utf-8')

    // CSV 파싱
    const regularResults = Papa.parse(regularCsv, { header: true, skipEmptyLines: true })
    const disabilityResults = Papa.parse(disabilityCsv, { header: true, skipEmptyLines: true })

    // 데이터 가공
    const regularPrograms = regularResults.data.map((row, index) => ({
      id: index,
      facilityName: row['시설명'] || '정보 없음',
      facilityType: row['시설유형명'] || '정보 없음',
      region: row['시도명'] || '정보 없음',
      city: row['시군구명'] || '정보 없음',
      address: row['시설주소'] || '정보 없음',
      phone: row['시설전화번호'] || '정보 없음',
      programName: row['프로그램 명'] || '정보 없음',
      targetAudience: row['프로그램 대상명'] || '정보 없음',
      startDate: row['프로그램 시작일자'] || '정보 없음',
      endDate: row['프로그램 종료일자'] || '정보 없음',
      days: row['프로그램 개설 요일명'] || '정보 없음',
      time: row['프로그램 개설 시간대값'] || '정보 없음',
      capacity: row['프로그램 모집인원수'] || '0',
      price: row['프로그램 가격'] || '정보 없음',
      priceType: row['프로그램 가격 유형명'] || null,
      website: row['홈페이지 유형명'] || '정보 없음',
      isDisabilityProgram: false,
    }))

    const disabilityPrograms = disabilityResults.data.map((row, index) => ({
      id: regularPrograms.length + index,
      facilityName: '정보 없음',
      facilityType: '장애인 생활체육교실',
      region: row['시도명'] || '정보 없음',
      city: row['시군구명'] || '정보 없음',
      address: '정보 없음',
      phone: '정보 없음',
      programName: row['프로그램명'] || '정보 없음',
      targetAudience: '장애인',
      startDate: row['운영시작일'] || '정보 없음',
      endDate: row['운영종료일'] || '정보 없음',
      days: row['운영시간']?.split(' ')[0] || '정보 없음',
      time: row['운영시간']?.split(' ')[1] || '정보 없음',
      capacity: '정보 없음',
      price: '정보 없음',
      priceType: null,
      website: '정보 없음',
      isDisabilityProgram: true,
      sportName: row['종목명'] || '정보 없음',
      subSportName: row['부종목명'] || '정보 없음',
      disabilityType: row['장애유형명'] || '정보 없음',
      programIntroduction: row['프로그램소개내용'] || '정보 없음',
      recruitmentStartDate: row['모집시작일'] || '정보 없음',
      recruitmentEndDate: row['모집종료일'] || '정보 없음',
    }))

    const allPrograms = [...regularPrograms, ...disabilityPrograms]

    // 고유한 지역, 도시, 장애 유형 추출
    const uniqueRegions = [...new Set(allPrograms.map(item => item.region))]
    const uniqueCities = [...new Set(allPrograms.map(item => item.city))]
    const uniqueDisabilityTypes = [...new Set(disabilityPrograms.map(item => item.disabilityType))]

    // 결과 객체 생성
    const result = {
      programs: allPrograms,
      uniqueRegions,
      uniqueCities,
      uniqueDisabilityTypes,
    }

    // JSON 파일로 저장
    await fs.writeFile('public/data/preprocessed_program_data.json', JSON.stringify(result, null, 2))
    console.log('Data preprocessing completed. Results saved to preprocessed_data.json')
  } catch (error) {
    console.error('Error during data preprocessing:', error)
  }
}

preprocessData()