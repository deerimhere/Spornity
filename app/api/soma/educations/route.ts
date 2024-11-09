import { NextResponse } from 'next/server';
import { CSV_URLS } from '../../config/urls';
import { fetchCSV } from '../../utils/csv';
import type { SomaEducationProgram } from '@/app/types';

export async function GET() {
  try {
    const programs = await fetchCSV(CSV_URLS.SOMA_EDUCATION_PROGRAMS);

    const mappedPrograms = programs.map((row: any, index: number) => ({
      id: index,
      title: row['프로그램명'] || '정보 없음',
      type: row['교육종류명'] || '정보 없음',
      target: row['교육대상전처리'] || '정보 없음',
      status: row['접수상태'] || '정보 없음',
      startDate: row['교육시작일자'] || '정보 없음',
      endDate: row['교육종료일자'] || '정보 없음',
      time: row['교육시간'] || '정보 없음',
      location: row['교육장소'] || '정보 없음',
      capacity: row['정원'] || '정보 없음',
      fee: row['수강료'] || '정보 없음',
    }));

    return NextResponse.json(mappedPrograms);
  } catch (error) {
    console.error('Error fetching education programs:', error);
    return NextResponse.json({ error: 'Failed to fetch education programs' }, { status: 500 });
  }
}